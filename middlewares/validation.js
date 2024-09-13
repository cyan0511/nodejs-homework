// Validation middleware
import {contactValidation, favoriteValidation, subscriptionValidation} from "../validations/validation.js";
import {signupValidation} from "../validations/validation.js";

const validate = joiSchema => (req, res, next) => {
    const {error} = joiSchema.validate(req.body, {abortEarly: false});
    if (error) {
        return res.status(400).json({
            status: 'error',
            errors: error.details.map(detail => ({
                field: detail.context?.key,
                message: detail.message
            }))
        });
    }
    next();
};

export const validateContact = validate(contactValidation);
export const validateFavorite = validate(favoriteValidation);
export const validateSignup = validate(signupValidation);
export const validateSubscription = validate(subscriptionValidation);

