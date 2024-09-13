import Joi from 'joi';

export const contactValidation = Joi.object({
    name: Joi.string().min(3).max(30).required().messages({
        'string.base': 'Name must be a string',
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 3 characters long',
        'string.max': 'Name cannot be longer than 30 characters',
        'any.required': 'Name is required'
    }),
    phone: Joi.string().pattern(/^[0-9]+$/).min(10).max(15).required().messages({
        'string.base': 'Phone must be a string',
        'string.empty': 'Phone is required',
        'string.pattern.base': 'Phone must contain only digits',
        'string.min': 'Phone must be at least 10 digits long',
        'string.max': 'Phone cannot be longer than 15 digits',
        'any.required': 'Phone is required'
    }),
    email: Joi.string().email().required().messages({
        'string.base': 'Email must be a string',
        'string.empty': 'Email is required',
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email is required'
    })
});

export const favoriteValidation = Joi.object({
    favorite: Joi.bool().required()
        .messages({
            'string.empty': 'missing field favorite',
            'any.required': 'missing field favorite'
        }),
});

// validation for signup/login
export const signupValidation = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required()
        .messages({
            "any.required": "Missing required email field",
            "string.email": "Invalid email format",
        }),
    password: Joi.string().min(6).max(16).required().messages({
        "any.required": "Missing required password field",
        "string.min": "Password must be at least {#limit} characters long",
        "string.max": "Password cannot be longer than {#limit} characters",
    }),
});

// Validation for Subscription
export const subscriptionValidation = Joi.object({
    subscription: Joi.string().valid("starter", "pro", "business"),
});