import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { User } from "../models/userModel.js";
import {HttpError} from "../errors/HttpError.js";

const { SECRET_KEY } = process.env;

const signupUser = async (req, res, next) => {
    const { email, password } = req.body;

    // Registration conflict error
    const user = await User.findOne({ email });
    if (user) {
      return next(new HttpError(409, "Email in Use"));
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ email, password: hashPassword });

    // Registration success response
    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
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
    const { _id } = req.user;

    // Logout unauthorized error (setting token to empty string will remove token -> will logout)
    await User.findByIdAndUpdate(_id, { token: "" });

    //   Logout success response
    res.status(204).send();
};

const getCurrentUser = async (req, res) => {
    const { email, subscription } = req.user;

    res.json({
        email,
        subscription,
    });
};

const updateUserSubscription = async (req, res) => {
    const { _id } = req.user;

    const updatedUser = await User.findByIdAndUpdate(_id, req.body, {
        new: true,
    });

    res.json({
        email: updatedUser.email,
        subscription: updatedUser.subscription,
    });
};

export { updateUserSubscription, signupUser, loginUser, logoutUser, getCurrentUser};