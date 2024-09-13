import express from 'express';
import {
    addContact,
    getContactById,
    listContacts,
    removeContact,
    updateContact,
    updateStatusContact
} from '../../controllers/contactController.js';
import {validateContact, validateFavorite} from "../../middlewares/validation.js";

const router = express.Router();

router.get('/', listContacts);

router.get('/:id', getContactById);

router.post('/', validateContact, addContact);

router.delete('/:id', removeContact);

router.put('/:id', validateContact, updateContact);

router.patch('/:id/favorite', validateFavorite, updateStatusContact);

export default router;