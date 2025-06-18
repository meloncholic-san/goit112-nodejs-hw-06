import express from 'express';
import {getContactsCtrl, getContactByIdCtrl, createContactCtrl, updateContactCtrl, deleteContactCtrl, replaceContactCtrl} from "../controllers/contacts.js"
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { contactsSchema, updateContactsSchema } from '../validation/contacts.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();
const jsonParser = express.json();

router.get('/', ctrlWrapper(getContactsCtrl));
router.get('/:id', isValidId, ctrlWrapper(getContactByIdCtrl));
router.post('/', upload.single('photo'), jsonParser, validateBody(contactsSchema), ctrlWrapper(createContactCtrl));
router.patch("/:id", isValidId, jsonParser, validateBody(updateContactsSchema), ctrlWrapper(updateContactCtrl));
router.delete("/:id", isValidId, ctrlWrapper(deleteContactCtrl));
router.put("/:id", isValidId, jsonParser, validateBody(updateContactsSchema), ctrlWrapper(replaceContactCtrl));

export default router;