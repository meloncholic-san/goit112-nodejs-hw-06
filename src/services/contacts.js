import { ContactColection } from "../models/contacts.js";

export const getAllContacts = async ({page, perPage, sortBy, sortOrder, filter, userId}) => {
  const skip = page > 0 ? (page - 1) * perPage: 0;
  const contactsQuery = ContactColection.find();
  
  contactsQuery.where('userId').equals(userId);
  if (typeof filter.isFavourite !== 'undefined') {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }
    if (typeof filter.contactType !== 'undefined') {
    contactsQuery.where('contactType').equals(filter.contactType);
  }
  
   const [total, contacts] = await Promise.all([
    ContactColection.countDocuments(contactsQuery),
    contactsQuery
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
  ]);
  const totalPages = Math.ceil(total / perPage);
  return {
    data: contacts, 
    page, 
    perPage, 
    totalItem: total, 
    totalPages, 
    hasNextPage: totalPages > page, 
    hasPreviousPage: page > 1
  };
};

export const getContactById = async (contactId, userId) => {
  const contact = await ContactColection.findOne({_id: contactId, userId});
  return contact;
};

export const createContact = async (newContact) => {
  const contact = await ContactColection.create(newContact);
  return contact;
}

export const updateContact = async (contactId, userId, payload) => {
  const contact = await ContactColection.findOneAndUpdate({_id: contactId, userId}, payload, { new: true });
  return contact;
}

export async function replaceContact(contactId, userId, contact) {
  const result = await ContactColection.findOneAndUpdate({_id: contactId, userId}, contact, {
    new: true,
    upsert: true,
    includeResultMetadata: true,
  });

  return {
    value: result.value,
    updatedExisting: result.lastErrorObject.updatedExisting,
  };
}

export const deleteContact = async(contactId, userId) => {
  const contact = await ContactColection.findOneAndDelete({_id: contactId, userId});
  return contact;
}