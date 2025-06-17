import Joi from "joi";

export const contactsSchema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    phoneNumber: Joi.string().min(7).required(),
    contactType: Joi.string().valid('work', 'home', 'personal').required(),
    email: Joi.string().email(),
})


export const updateContactsSchema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    phoneNumber: Joi.string().min(7).required(),
    contactType: Joi.string().valid('work', 'home', 'personal'),
    email: Joi.string().email(),
})