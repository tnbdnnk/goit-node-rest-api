import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { v4 as uuidv4 } from "uuid";
import gravatar from 'gravatar';
import jimp from 'jimp';

import User from '../models/userModel.js';
import Contact from '../models/contactModel.js';
import { loginSchema, registerSchema } from '../schemas/schemas.js';
import { emailSender } from "../middleware/emailSender.js";

export const register = async (req, res, next) => {
    console.log('Register function called');
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return res
            .status(400)
            .json({ message: error.message });
    }
    const { password, email } = req.body;
    const normalizedEmail = email.toLowerCase();
    try {
        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists !== null) {
            return res.status(409).json({ message: 'Email is already in use.' });
        };
        const avatarURL = gravatar.url(
            normalizedEmail,
            {
                protocol: 'https',
                s: '250',
                d: 'retro'
            }
        );
        const passwordHash = await bcrypt.hash(password, 10);
        const verificationToken = uuidv4();
        const newUser = await User.create({
            password: passwordHash,
            email: normalizedEmail,
            avatarURL: avatarURL,
            verificationToken: verificationToken,
            verify: false
        });
        await Contact.updateMany(
            { email: normalizedEmail },
            { owner: newUser._id }
        );
        const verificationLink = `http://localhost:3000/verify-email?token=${verificationToken}`;
        await emailSender(normalizedEmail, verificationLink);
        res.status(201).json({
            user: {
                email: newUser.email,
                subscription: newUser.subscription,
                avatarURL: newUser.avatarURL,
                verify: newUser.verify
            }
        });
        req.body = {
            email: normalizedEmail,
            subject: 'email verification',
        };
        next();
    } catch (error) {
        next(error);
    }
}

export const verifyEmail = async (req, res) => {
    try {
        const { verificationToken } = req.params;
        const user = await User.findOne({ verificationToken });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.verify) {
            return res.status(400).json({message: "Verification has already been passed."})
        }
        user.verify = true;
        user.verificationToken = null;
        await user.save();
        return res.status(200).json({ message: "Verification successful" });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Missing required field: email.' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User Not Found' });
        }
        if (user.verify) {
            return res.status(400).json({ message: 'Verification has already been passed.' });
        }
        const newVerificationToken = uuidv4();
        user.verificationToken = newVerificationToken;
        await user.save();
        const verificationLink = `http://localhost:3000/users/verify/${newVerificationToken}`;
        await emailSender(email, verificationLink);
        return res.status(200).json({ message: 'Verification email sent' });
    } catch (error) {
        return res.status(500).json({message: 'Internal Server Error'})
    }
}

export const login = async (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res
            .status(400)
            .json({ message: error.message });
    }
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();
    try {
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res
                .status(401)
                .json({ message: 'Email or password is incorrect' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch === false) {
            return res
                .status(401)
                .json({ message: 'Email or password is incorrect' });
        }
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: 60 * 60 }
        );
        const updateUser = (filter, data) => User.findOneAndUpdate(filter, data);
        await updateUser(user._id, { token });
        res.status(200).json(
            {
                token,
                user: {
                    email: user.email,
                    subscription: user.subscription
                }
            }
        );
    } catch (error) {
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        const updateUser = (filter, data) => User.findOneAndUpdate(filter, data);
        const user = await updateUser({ _id: req.user.id }, { token: null });
        if (!user) {
            return res.status(401).json({ message: 'Not authorized.' });
        };
        res.status(204).send();
    } catch (error) {
        console.error('Error logging out user:', error);
        next(error);
    }
};

export const getCurrentUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(401).json({ message: 'Not authorized.' });
        };
        res.status(200).json(
            {
                email: user.email,
                subscription: user.subscription
            }
        );
    } catch (error) {
        next(error);
    };
};

export const updateSubscription = async (req, res, next) => {
    const allowedSubscriptions = ['starter', 'pro', 'business'];
    const subscription = req.body.subscription;
    if (!allowedSubscriptions.includes(subscription)) {
        return res.status(400).json({ message: 'Invalid subscribtion.' });
    };
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(401).json({ message: 'Not authorized.' });
        };
        user.subscription = subscription;
        await user.save();
        res.status(200).json({ message: `Subscription updated successfully to ${subscription}!` });
    } catch (error) {
        next(error);
    };
};

export const getAvatar = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user === null) {
            return res.status(404).json({ message: "User not found" });
        };
        if (user.avatarURL === null) {
            return res.status(404).json({ message: "Avatar not found" });
        };
        res.sendFile(path.join(
            process.cwd(),
            "public/avatars",
            user.avatarURL
        ));
    } catch(error) {
        next(error);
    };
}

export const uploadAvatar = async (req, res, next) => {    
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const avatar = await jimp.read(req.file.path);
        await avatar.resize(250, 250).write(req.file.path);
        await fs.rename(
            req.file.path,
            path.join(
                process.cwd(),
                "public/avatars",
                req.file.filename
            )
        );
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { avatarURL: `/avatars/${req.file.filename}` },
            { new: true }
        );
        if (user === null) {
            return res.status(404).json({ message: "User not found" });
        };
        res.status(200).json({ avatarURL: user.avatarURL });
    } catch(error) {
        next(error);
    }
};


