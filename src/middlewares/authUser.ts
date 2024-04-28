import User from "../model/User";
import { Request, Response, NextFunction } from "express";
import { sign, verify } from "jsonwebtoken";
import { config } from '../config/config'


const authUser = async (req: Request, res: Response, next: NextFunction) => {
    interface userPayloadTypes {
        sid: string,
        iat: number,
        exp: number
    }
    const { token, refreshToken } = req.cookies;

    if (!token && !refreshToken) return res.status(401).json({ msg: 'unauthorized ' });

    if (refreshToken) {
        if (token) {
            // check validity
            const userPayload = <userPayloadTypes>verify(token, config.jwtSecret as string);
            if (!userPayload.sid) return res.status(401).json({ msg: 'unauthorized ' });
            // check valid User
            const user = await User.findOne({ _id: userPayload.sid, refreshToken });
            if (!user) return res.status(401).json({ msg: 'unauthorized ' });
            req.body.userId = user._id;
            next();
        } else {
            // Refresh new Token

            const userPayload = <userPayloadTypes>verify(refreshToken, config.jwtSecret as string);
            if (!userPayload.sid) return res.status(401).json({ msg: 'unauthorized ' });

            const user = await User.findOne({ _id: userPayload.sid, refreshToken });
            if (!user) return res.status(401).json({ msg: 'unauthorized ' });

            // generate token
            const token = sign({ sid: user._id }, config.jwtSecret as string, { expiresIn: 60 * 10 });
            res.cookie('token', token, {
                expires: new Date(Date.now() + 1000 * 60 * 10), // 10 minutes
                httpOnly: true
            });
            req.body.userId = user._id;
            next();
        }
    } else {
        return res.status(401).json({ msg: 'unauthorized ' });
    }
}

export { authUser };