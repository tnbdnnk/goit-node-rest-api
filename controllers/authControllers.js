import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Contact from '../models/contactModel.js';

export const register = async (req, res, next) => {
    const { password, email } = req.body;
    const normalizedEmail = email.toLowerCase();
    try {
        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists !== null) {
            return res.status(409).json({ message: 'Email is already in use.' });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            password: passwordHash,
            email: normalizedEmail
        });
        await Contact.updateMany(
            { email: normalizedEmail },
            { owner: newUser._id }
        );
        res.status(201).json({ message: "Registration success", user: newUser });
    } catch (error) {
        next(error);
    }
}

export const login = async (req, res, next) => {
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
        res.status(200).json(
            {
                message: 'Login successfully',
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
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(401).json({ message: 'Not authorized.' });
        };
        user.token = null;
        await user.save();
        res.status(204).send();
    } catch (error) {
        next(error);
    };
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