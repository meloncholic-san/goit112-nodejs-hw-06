import createHttpError from "http-errors";
import * as fs from 'node:fs/promises';
import path from 'node:path';

import { parsePaginationParams } from "../utils/parsePaginationParams.js";

import { getAllContacts, getContactById, createContact, updateContact, deleteContact, replaceContact} from "../services/contacts.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { parseFilterParams } from "../utils/parseFilterParams.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { getEnvVar } from "../utils/getEnvVar.js";

    export async function getContactsCtrl(req, res) {
        const { page, perPage } = parsePaginationParams(req.query);
        const {sortBy, sortOrder} = parseSortParams(req.query);
        const filter = parseFilterParams(req.query);
        const contacts = await getAllContacts({ 
            page,
            perPage,
            sortBy,
            sortOrder,
            filter,
            userId: req.user.id,
        });

        res.json({data:contacts, message: "Successfully found contacts!"});
    }
    
    export async function getContactByIdCtrl(req, res) {
        const contactId = req.params.id;
        const contact = await getContactById(contactId, req.user.id);

        if(!contact) throw new createHttpError.NotFound('Contact not found');

        res.json({data:contact, message: "Successfully found contact!"});
    }


    export async function createContactCtrl(req, res) {
        const payload = req.body;
        let photo = null

        if (getEnvVar("UPLOAD_TO_CLOUDINARY") === 'true') {
            const result = await uploadToCloudinary(req.file.path);
            fs.unlink(req.file.path);
            photo = result.url;
        } else {
            await fs.rename(req.file.path, path.resolve('src', 'uploads', 'photos', req.file.filename));
            photo = `http://localhost:8080/photos/${req.file.filename}`
        }

        const newContact = await createContact({...payload, userId: req.user.id, photo});
        res.status(201).json({data: newContact, message: "Successfully created new contact!"});
    }

    export async function updateContactCtrl(req, res) {
        const payload = req.body;
        const contactId = req.params.id;
        const updatedContact = await updateContact(contactId, req.user.id, payload);

        if (!updatedContact) {
        throw new createHttpError.NotFound('Contact not found');
        }

        res.json({data: updatedContact, message: "Successfully updated contact!"});
    }

    export async function deleteContactCtrl(req, res) {
        const contactId = req.params.id;
        const deletedContact = await deleteContact(contactId, req.user.id);
        if(!deletedContact) throw new createHttpError.NotFound('Contact not found');
        res.status(204);
    }


    export async function replaceContactCtrl(req, res) {
        const contactId = req.params.id;
        const payload = req.body;
        const { value, updatedExisting } = await replaceContact(contactId, req.user.id, payload);

        if (updatedExisting === true) {
            return res.json({
            status: 200,
            message: 'Contact updated successfully',
            data: value,
            });
        }

        res.status(201).json({
            status: 201,
            message: 'Contact created successfully',
            data: value,
        });
        }