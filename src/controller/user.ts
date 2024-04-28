import { Request, Response } from 'express';
import User from '../model/User';
import { config } from '../config/config'
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';

const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ msg: 'All Fields are required' });

        // check existense
        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists with this email' });

        // Password Hashing
        const hashPassword = await hash(password, 10);

        // create New User
        const newUser = await User.create({ name, email, password: hashPassword });
        if (newUser) {
            return res.status(200).json({ msg: 'User Created' });
        } else {
            return res.status(500).json({ error: 'Something went wrong' });
        }

    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }

}

const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ msg: 'All Fields are required' });

        // Check user existance
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'User Not Found' });

        // Match password
        const passwordMatched = await compare(password, user.password);
        if (!passwordMatched) return res.status(400).json({ msg: 'Incorrect Username Or Password' });

        // Generate Token

        const token = sign({ sid: user._id }, config.jwtSecret as string, { expiresIn: 60 * 10 });
        const refreshToken = sign({ sid: user._id }, config.jwtSecret as string, { expiresIn: '30d' })
        if (!token || !refreshToken) return res.status(500).json({ error: 'Something went Wrong' });
        await User.findOneAndUpdate({ _id: user._id }, { $set: { refreshToken } })
        res.cookie('token', token, {
            expires: new Date(Date.now() + 1000 * 60 * 10), // 10 minutes
            httpOnly: true
        });
        res.cookie('refreshToken', refreshToken, {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 Days
            httpOnly: true
        })

        return res.status(200).json('Login Successfully');

    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ error: error.message })

    }




}

const logoutUser = async (req: Request, res: Response) => {
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    try {
        await User.findOneAndUpdate({ _id: req.body.userId }, { $unset: { refreshToken: '' } })
    } catch (error: any) {
        console.log(error.message);

    }
    return res.status(200).json({ msg: 'Logged Out' })
}

const getUser = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        if (!user) return res.status(400).json({ msg: 'User Not Found' });
        return res.status(200).json({ user })
    } catch (error: any) {
        return res.status(500).json(error.message)
    }
}


export { registerUser, loginUser, getUser, logoutUser };