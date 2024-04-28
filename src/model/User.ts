import { Schema, model } from 'mongoose'
interface UserTypes {
    _id: string;
    name: string;
    email: string;
    password: string;
    refreshToken: string
}

const userSchema = new Schema<UserTypes>(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: String,
            // required: true
        }
    }
)

export default model<UserTypes>('User', userSchema);