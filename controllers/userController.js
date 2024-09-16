import bcrypt from "bcrypt";
import fs from "fs/promises";
import gravatar from "gravatar";
import {Jimp} from "jimp";
import jwt from "jsonwebtoken";
import path from "path";
import {v4 as uuid4} from "uuid";
import "dotenv/config";
import {User} from "../models/userModel.js";
import {HttpError} from "../errors/HttpError.js";
import {sendEmail} from "../utils/utils.js";

const {SECRET_KEY, PORT} = process.env;

const signupUser = async (req, res, next) => {
    const {email, password} = req.body;

    // Registration conflict error
    const user = await User.findOne({email});
    if (user) {
        return next(new HttpError(409, "Email in Use"));
    }

    const hashPassword = await bcrypt.hash(password, 10);

    // Create a link to the user's avatar with gravatar
    const avatarURL = gravatar.url(email, {protocol: "http"});

    // Create a verificationToken for the user
    const verificationToken = uuid4();

    const newUser = await User.create({
        email,
        password: hashPassword,
        avatarURL,
        verificationToken,
    });

    // Email the user's mail and specify a link to verify the email (/users/verify/:verificationToken) in the message
    await sendEmail({
        to: email,
        subject: "Action Required: Verify Your Email",
        html: `<a target="_blank" href="http://localhost:${PORT}/api/users/verify/${verificationToken}">Click to verify email</a>`,
    });

    // Registration success response
    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
            avatarURL,
            verificationToken,
        },
    });
};

const loginUser = async (req, res, next) => {
    try {
        const {email, password} = req.body;

        // Login auth error (email)
        const user = await User.findOne({email});
        if (!user) {
            return next(new HttpError(401, "Email or password is wrong"));
        }

        // Login auth error (password)
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return next(new HttpError(401, "Email or password is wrong"));
        }

        const payload = {id: user._id};
        const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "23h"});

        await User.findByIdAndUpdate(user._id, {token});

        //   Login success response
        res.status(200).json({
            token: token,
            user: {
                email: user.email,
                subscription: user.subscription,
            },
        });
    } catch (ex) {
        next(new HttpError(500, "Unhandled exception."));
    }
};

const logoutUser = async (req, res) => {
    const {_id} = req.user;

    // Logout unauthorized error (setting token to empty string will remove token -> will logout)
    await User.findByIdAndUpdate(_id, {token: ""});

    //   Logout success response
    res.status(204).send();
};

const getCurrentUser = async (req, res) => {
    const {email, subscription} = req.user;

    res.json({
        email,
        subscription,
    });
};

const updateUserSubscription = async (req, res) => {
    const {_id} = req.user;

    const updatedUser = await User.findByIdAndUpdate(_id, req.body, {
        new: true,
    });

    res.json({
        email: updatedUser.email,
        subscription: updatedUser.subscription,
    });
};

const updateAvatar = async (req, res, next) => {
    try {
        const {_id} = req.user;
        const {path: oldPath, originalname} = req.file;

        await Jimp.read(oldPath).then((image) =>
            // image.resize(250, 250).write(oldPath)
            image.cover({w: 250, h: 250}).write(oldPath)
        );

        const extension = path.extname(originalname);

        const filename = `${_id}${extension}`;
        const newPath = path.join("public", "avatars", filename);
        await fs.rename(oldPath, newPath);

        let avatarURL = path.join("/avatars", filename);
        avatarURL = avatarURL.replace(/\\/g, "/");

        await User.findByIdAndUpdate(_id, {avatarURL});
        res.status(200).json({avatarURL});
    } catch (ex) {
        next(new HttpError(500, ex.message))
    }
};

const verifyEmail = async (req, res, next) => {
    try {
        const {verificationToken} = req.params;
        const user = await User.findOne({verificationToken});

        // Verification user Not Found
        if (!user) {
            return next(new HttpError(400, "User not found"));
        }

        await User.findByIdAndUpdate(user._id, {
            verify: true,
            verificationToken: null,
        });

        // Verification success response
        res.json({
            message: "Verification successful",
        });
    } catch (ex) {
        next(new HttpError(500, ex.message));
    }
};

const resendVerifyEmail = async (req, res, next) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return next(new HttpError(404, "The provided email address could not be found"));
    }

    // Resend email for verified user
    if (user.verify) {
        return next(new HttpError(400, "Verification has already been passed"));
    }

    let verificationToken = user.verificationToken;
    if (!verificationToken) {
        verificationToken = uuid4();
        await User.findByIdAndUpdate(user._id, {verificationToken});
    }
    await sendEmail({
        to: email,
        subject: "Action Required: Verify Your Email",
        html: `<a target="_blank" href="http://localhost:${PORT}/api/users/verify/${verificationToken}">Click to verify email</a>`,
    });

    // Resending a email success response
    res.json({ message: "Verification email sent" });
};

export { verifyEmail, resendVerifyEmail, updateAvatar, updateUserSubscription, signupUser, loginUser, logoutUser, getCurrentUser};