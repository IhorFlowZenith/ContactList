import { Contact, Settings } from '../types';

export const formatContactName = (
  contact: Contact,
  nameFormat: Settings['nameFormat']
): string => {
  if (nameFormat === 'lastFirst') {
    return `${contact.lastName} ${contact.firstName}`;
  }
  return `${contact.firstName} ${contact.lastName}`;
};