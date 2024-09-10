import express from 'express';
import {
    addContact,
    getContactById,
    isContactExists,
    listContacts,
    removeContact,
    updateContact,
    updateStatusContact
} from '../../models/contacts.js';
import contactSchema from '../../validations/contactValidation.js';

// Validation middleware
const validateContact = (req, res, next) => {
    const {error} = contactSchema.validate(req.body, {abortEarly: false});
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

const validateExistingContact = async(req, res, next) => {
    const { name , email } = req.body;
    const exists = await isContactExists({name, email});
    if (exists) {
        return res.status(400).json({
            status: 'error',
            error: 'Contact already exists.'
        });
    }
    next();
};

const router = express.Router();

router.get('/', async (req, res, next) => {
   try {
       const list = await listContacts();
       res.json(list);
   } catch (ex) {
       console.log(ex);
       res.status(500).json({message: 'Internal Server Error'});
   }
})

router.get('/:id', async (req, res, next) => {
    const {id} = req.params;
    const contact = await getContactById(id);
    if (!contact) return res.status(400).json({message: 'Not found'});
    res.json(contact);
})

router.post('/', validateContact, validateExistingContact, async (req, res, next) => {
    const {name, email, phone} = req.body;
    const newContact = await addContact({name, email, phone, favorite: false});
    res.status(201).json(newContact);
})

router.delete('/:id', async (req, res, next) => {
    const {id} = req.params;
    const contact = await getContactById(id);
    if (!contact) return res.status(404).json({"message": "Not found"});
    await removeContact(id);
    res.json({"message": "contact deleted"});
})

router.put('/:id', validateContact, async (req, res, next) => {
    const {id} = req.params;
    const {name, email, phone} = req.body;

    const contact = await getContactById(id);
    if (!contact) return res.status(404).json({"message": "Not found"});

    const updatedContact = await updateContact({...contact, id, name, email, phone, });
    res.json(updatedContact);
})

router.patch('/:id/favorite', async (req, res, next) => {
    const {id} = req.params;
    const {favorite} = req.body;

    if (favorite === undefined || favorite === null) {
        return res.status(404).json({"message": "missing field favorite"});
    }

    const contact = await getContactById(id);
    if (!contact) return res.status(404).json({"message": "Not found"});

    const updatedContact = await updateStatusContact({ id, favorite});
    res.json(updatedContact);
})

export default router;