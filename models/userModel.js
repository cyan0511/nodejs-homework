import bcrypt from "bcrypt";
import {model, Schema} from "mongoose";

const userSchema = new Schema(
    {
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
        },
        subscription: {
            type: String,
            enum: ["starter", "pro", "business"],
            default: "starter"
        },
        avatarURL: {
            type: String,
        },
        token: {
            type: String,
            default: null,
        },
        verify: {
            type: Boolean,
            default: false,
        },
        verificationToken: {
            type: String,
            required: [true, "Verify token is required"],
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        }
    },
    {versionKey: false}
);

//MongoDB collection name = "users"
export const User = model("users", userSchema);

