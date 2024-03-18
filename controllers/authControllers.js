import bcrypt from 'bcrypt';
import User from '../models/userModel.js';

export const register = async (req, res, next) => {
    const { password, email } = req.body;
    const normalizedEmail = email.toLowerCase();
    try {
        const user = await User.findOne({ email: normalizedEmail });
        if (user !== null) {
            return res.status(409).json({ message: 'User already registered' });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const result = await User.create({
            password: passwordHash,
            email: normalizedEmail
        });
        console.log(result);

        res.status(201).json({ message: "Registration success" });
    } catch (error) {
        next(error);
    }
}

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();
    try {
        const user = await User.findOne({ email: normalizedEmail });
        if (user === null) {
            console.log('email');
            return res
                .status(401)
                .json({ message: 'Email or password is incorrect' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch === false) {
            console.log('password');
            return res.status(401).json({ message: 'Email or password is incorrect' });
        }
        res.status(200).json({ message: 'Login successfully' });
    } catch (error) {
        next(error);
    }
}