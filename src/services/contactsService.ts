import { PermissionsAndroid } from 'react-native';
import Contacts from 'react-native-contacts';
import { Contact, PhoneNumber, Address } from '../types';

export const requestContactsPermission = async (): Promise<boolean> => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        title: 'Дозвіл на читання контактів',
        message: 'Додатку потрібен доступ до ваших контактів для імпорту',
        buttonPositive: 'Дозволити',
        buttonNegative: 'Відмінити',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
};

export const importContactsFromDevice = async (): Promise<Contact[]> => {
  try {
    const hasPermission = await requestContactsPermission();
    if (!hasPermission) {
      throw new Error('Немає дозволу на читання контактів');
    }

    const deviceContacts = await Contacts.getAll();
    
    const importedContacts: Contact[] = deviceContacts
      .filter(c => c.givenName || c.familyName)
      .map(deviceContact => {
        const phones: PhoneNumber[] = deviceContact.phoneNumbers.map(phone => {
          let label: PhoneNumber['label'] = 'Інший';
          
          const phoneLabel = (phone.label || '').toLowerCase();
          if (phoneLabel.includes('mobile') || phoneLabel.includes('мобільний')) {
            label = 'Мобільний';
          } else if (phoneLabel.includes('work') || phoneLabel.includes('робочий')) {
            label = 'Робочий';
          } else if (phoneLabel.includes('home') || phoneLabel.includes('домашній')) {
            label = 'Домашній';
          } else if (phoneLabel.includes('main') || phoneLabel.includes('основний')) {
            label = 'Основний';
          }
          
          console.log(`📱 Імпорт телефону: label="${phone.label}", number="${phone.number}" -> label="${label}"`);
          
          return {
            value: phone.number || '',
            label,
          };
        });

        const addresses: Address[] = deviceContact.postalAddresses.map(addr => {
          let label: Address['label'] = 'Інша';
          
          const addrLabel = (addr.label || '').toLowerCase();
          if (addrLabel.includes('home') || addrLabel.includes('домашня')) {
            label = 'Домашня';
          } else if (addrLabel.includes('work') || addrLabel.includes('робоча')) {
            label = 'Робоча';
          }
          
          const addressParts = [
            addr.street,
            addr.city,
            addr.region,
            addr.postCode,
            addr.country,
          ].filter(Boolean);
          
          const addressValue = addressParts.join(', ');
          console.log(`📍 Імпорт адреси: label="${addr.label}", parts=${JSON.stringify(addressParts)} -> value="${addressValue}"`);
          
          return {
            value: addressValue,
            label,
          };
        });

        let birthday = '';
        if (deviceContact.birthday && deviceContact.birthday.year && deviceContact.birthday.month && deviceContact.birthday.day) {
          const date = new Date(deviceContact.birthday.year, deviceContact.birthday.month - 1, deviceContact.birthday.day);
          birthday = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
        }

        return {
          id: deviceContact.recordID || Date.now().toString() + Math.random(),
          firstName: deviceContact.givenName || '',
          lastName: deviceContact.familyName || '',
          phones: phones.length > 0 ? phones : [{ value: '', label: 'Мобільний' }],
          email: deviceContact.emailAddresses[0]?.email || '',
          birthday,
          addresses,
          website: deviceContact.urlAddresses[0]?.url || '',
          notes: deviceContact.note || '',
          avatar: deviceContact.thumbnailPath || '',
          isFavorite: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          middleName: (deviceContact as any).middleName || '',
          nickname: (deviceContact as any).nickname || '',
          jobTitle: deviceContact.jobTitle || '',
        };
      });

    return importedContacts;
  } catch (error) {
    console.error('Помилка імпорту контактів:', error);
    throw error;
  }
};

export const checkContactsPermission = async (): Promise<boolean> => {
  const result = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.READ_CONTACTS
  );
  return result;
};

export const requestWriteContactsPermission = async (): Promise<boolean> => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
      {
        title: 'Дозвіл на запис контактів',
        message: 'Додатку потрібен доступ для збереження контактів на телефоні',
        buttonPositive: 'Дозволити',
        buttonNegative: 'Відмінити',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
};

export const saveContactToDevice = async (contact: Contact): Promise<string> => {
  try {
    const hasPermission = await requestWriteContactsPermission();
    if (!hasPermission) {
      throw new Error('Немає дозволу на запис контактів');
    }

    console.log('📝 Підготовка контакту для збереження:', {
      firstName: contact.firstName,
      lastName: contact.lastName,
      phones: contact.phones,
      addresses: contact.addresses,
      website: contact.website,
    });

    const newContact: any = {
      givenName: contact.firstName || '',
      familyName: contact.lastName || '',
      middleName: contact.middleName || '',
      phoneNumbers: contact.phones
        .filter(p => p.value && p.value.trim())
        .map(phone => ({
          label: phone.label === 'Мобільний' ? 'mobile' : 
                 phone.label === 'Робочий' ? 'work' : 
                 phone.label === 'Домашній' ? 'home' : 
                 phone.label === 'Основний' ? 'main' : 'other',
          number: phone.value.trim(),
        })),
      emailAddresses: contact.email && contact.email.trim() ? [{
        label: 'work',
        email: contact.email.trim(),
      }] : [],
      note: contact.notes || '',
      jobTitle: contact.jobTitle || '',
      nickname: contact.nickname || '',
    };
    
    console.log('📱 Телефони для збереження:', newContact.phoneNumbers);

    if (contact.addresses && contact.addresses.length > 0) {
      newContact.postalAddresses = contact.addresses
        .filter(a => a.value && a.value.trim())
        .map(addr => {
          const parts = addr.value.split(',').map(p => p.trim());
          return {
            label: addr.label === 'Домашня' ? 'home' : 
                   addr.label === 'Робоча' ? 'work' : 'other',
            street: parts[0] || '',
            city: parts[1] || '',
            region: parts[2] || '',
            postCode: parts[3] || '',
            country: parts[4] || '',
          };
        });
      console.log('📍 Адреси для збереження:', newContact.postalAddresses);
    }

    if (contact.birthday) {
      const [day, month, year] = contact.birthday.split('.');
      if (day && month && year) {
        newContact.birthday = {
          day: parseInt(day, 10),
          month: parseInt(month, 10),
          year: parseInt(year, 10),
        };
      }
    }

    if (contact.website && contact.website.trim()) {
      newContact.urlAddresses = [{
        label: 'homepage',
        url: contact.website.trim(),
      }];
      console.log('🌐 Веб-сайт для збереження:', newContact.urlAddresses);
    }

    console.log('💾 Фінальний об\'єкт контакту:', JSON.stringify(newContact, null, 2));
    const savedContact = await Contacts.addContact(newContact);
    console.log('✅ Контакт збережено з ID:', savedContact.recordID);
    return savedContact.recordID;
  } catch (error) {
    console.error('Помилка збереження контакту на телефоні:', error);
    throw error;
  }
};

export const updateContactOnDevice = async (contact: Contact): Promise<void> => {
  try {
    const hasPermission = await requestWriteContactsPermission();
    if (!hasPermission) {
      throw new Error('Немає дозволу на запис контактів');
    }

    if (contact.id.startsWith('local_')) {
      return;
    }

    const existingContact = await Contacts.getContactById(contact.id);
    if (!existingContact) {
      throw new Error('Контакт не знайдено на пристрої');
    }

    const updatedContact: any = {
      ...existingContact,
      recordID: contact.id,
      givenName: contact.firstName,
      familyName: contact.lastName,
      middleName: contact.middleName || '',
      phoneNumbers: contact.phones
        .filter(p => p.value)
        .map(phone => ({
          label: phone.label === 'Мобільний' ? 'mobile' : 
                 phone.label === 'Робочий' ? 'work' : 
                 phone.label === 'Домашній' ? 'home' : 
                 phone.label === 'Основний' ? 'main' : 'other',
          number: phone.value,
        })),
      emailAddresses: contact.email ? [{
        label: 'work',
        email: contact.email,
      }] : [],
      note: contact.notes || '',
      jobTitle: contact.jobTitle || '',
      nickname: contact.nickname || '',
    };

    if (contact.addresses && contact.addresses.length > 0) {
      updatedContact.postalAddresses = contact.addresses
        .filter(a => a.value)
        .map(addr => {
          const parts = addr.value.split(',').map(p => p.trim());
          return {
            label: addr.label === 'Домашня' ? 'home' : 
                   addr.label === 'Робоча' ? 'work' : 'other',
            street: parts[0] || '',
            city: parts[1] || '',
            region: parts[2] || '',
            postCode: parts[3] || '',
            country: parts[4] || '',
          };
        });
    }

    if (contact.birthday) {
      const [day, month, year] = contact.birthday.split('.');
      if (day && month && year) {
        updatedContact.birthday = {
          day: parseInt(day, 10),
          month: parseInt(month, 10),
          year: parseInt(year, 10),
        };
      }
    }

    if (contact.website) {
      updatedContact.urlAddresses = [{
        label: 'homepage',
        url: contact.website,
      }];
    }

    await Contacts.updateContact(updatedContact);
  } catch (error) {
    console.error('Помилка оновлення контакту на телефоні:', error);
    throw error;
  }
};

export const deleteContactFromDevice = async (contactId: string): Promise<void> => {
  try {
    const hasPermission = await requestWriteContactsPermission();
    if (!hasPermission) {
      throw new Error('Немає дозволу на запис контактів');
    }

    if (contactId.startsWith('local_')) {
      return;
    }

    const contact = await Contacts.getContactById(contactId);
    if (contact) {
      await Contacts.deleteContact(contact);
    }
  } catch (error) {
    console.error('Помилка видалення контакту з телефону:', error);
    throw error;
  }
};
