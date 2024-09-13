import {Contact} from "../models/contactModel.js";
import {HttpError} from "../errors/HttpError.js";

const listContacts = async (req, res) => {
    const { page = 1, limit = 20, favorite } = req.query;
    const query = favorite !== undefined && favorite !== '' ? { favorite } : {};

    const result = await Contact.find(query)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    res.json(result);
};

const getContactById = async (req, res, next) => {
    try {
        const {id} = req.params;
        const contact = await Contact.findById(id);
        if (!contact) return res.status(400).json({message: 'Not found'});
        res.json(contact);
    } catch (error) {
        next(new HttpError(500, 'Error retrieving contact'));
    }
};

const removeContact = async (req, res, next) => {
    // Model.findByIdAndDelete()
    try {
        const {id} = req.params;
        const contact = await Contact.findById(id);
        if (!contact) return res.status(400).json({message: 'Not found'});
        await Contact.findByIdAndDelete(id);
        res.json({"message": "contact deleted"});
    } catch (error) {
        next(new HttpError(500, 'Error deleting contact'));
    }
};


const addContact = async (req, res, next) => {
    // Create a new contact
    try {
        const {name, email, phone} = req.body;
        const contact = await Contact.findOne({
            $or: [{name}, {email}],
        });

        if (contact) {
            return res.status(400).json({
                status: 'error',
                error: 'Contact already exists.'
            });
        }

        const newContact = await Contact.create({name, email, phone, favorite: false});
        res.status(201).json(newContact);
    } catch (error) {
        next(new HttpError(400, 'Error creating contact'));
    }
};

const updateContact = async (req, res, next) => {
    try {
        const {id} = req.params;

        const contact = await Contact.findById(id);
        if (!contact) return res.status(400).json({message: 'Not found'});

        const result = await Contact.findByIdAndUpdate(id, req.body, {
            new: true,
        });

        if (!result) return res.status(404).json({message: 'Not found'});

        res.json(result);
    } catch (error) {
        next(new HttpError(400, 'Error updating contact'));
    }
};

const updateStatusContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findById(id);
        if (!contact) return res.status(400).json({message: 'Not found'});

        const result = await Contact.findByIdAndUpdate(id, req.body, {
            new: true,
        });

        if (!result) return res.status(404).json({message: 'Not found'});

        res.json(result);
    } catch (error) {
        next(new HttpError(400, 'Error updating favorite'));
    }
};

export {updateStatusContact, listContacts, getContactById, removeContact, addContact, updateContact};