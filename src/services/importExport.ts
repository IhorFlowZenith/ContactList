import RNFS from 'react-native-fs';
import { pick, types } from '@react-native-documents/picker';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { Contact, PhoneNumber, Address } from '../types';

export type ExportFormat = 'json' | 'csv' | 'vcf';

export const exportToJSON = async (contacts: Contact[]): Promise<void> => {
  const data = JSON.stringify(contacts, null, 2);
  const fileName = `contacts_${Date.now()}.json`;
  const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
  
  await RNFS.writeFile(filePath, data, 'utf8');
  await ReactNativeBlobUtil.android.actionViewIntent(filePath, 'application/json');
};

export const exportToCSV = async (contacts: Contact[]): Promise<void> => {
  const headers = 'Ім\'я,Прізвище,Телефон,Email,Дата народження,Адреса,Веб-сайт,Нотатки\n';
  const rows = contacts.map(c => {
    const phone = c.phones?.[0]?.value || '';
    const address = c.addresses?.[0]?.value || '';
    return `"${c.firstName}","${c.lastName}","${phone}","${c.email || ''}","${c.birthday || ''}","${address}","${c.website || ''}","${c.notes || ''}"`;
  }).join('\n');
  
  const data = headers + rows;
  const fileName = `contacts_${Date.now()}.csv`;
  const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
  
  await RNFS.writeFile(filePath, data, 'utf8');
  await ReactNativeBlobUtil.android.actionViewIntent(filePath, 'text/csv');
};

export const exportToVCF = async (contacts: Contact[]): Promise<void> => {
  const vcards = contacts.map(c => {
    let vcard = 'BEGIN:VCARD\n';
    vcard += 'VERSION:3.0\n';
    vcard += `FN:${c.firstName} ${c.lastName}\n`;
    vcard += `N:${c.lastName};${c.firstName};;;\n`;
    
    c.phones?.forEach(phone => {
      const type = phone.label === 'Мобільний' ? 'CELL' : phone.label === 'Робочий' ? 'WORK' : 'HOME';
      vcard += `TEL;TYPE=${type}:${phone.value}\n`;
    });
    
    if (c.email) {
      vcard += `EMAIL:${c.email}\n`;
    }
    
    if (c.birthday) {
      const parts = c.birthday.split('.');
      if (parts.length === 3) {
        vcard += `BDAY:${parts[2]}-${parts[1]}-${parts[0]}\n`;
      }
    }
    
    c.addresses?.forEach(addr => {
      const type = addr.label === 'Домашня' ? 'HOME' : 'WORK';
      vcard += `ADR;TYPE=${type}:;;${addr.value};;;;\n`;
    });
    
    if (c.website) {
      vcard += `URL:${c.website}\n`;
    }
    
    if (c.notes) {
      vcard += `NOTE:${c.notes}\n`;
    }
    
    if (c.jobTitle) {
      vcard += `TITLE:${c.jobTitle}\n`;
    }
    
    if (c.nickname) {
      vcard += `NICKNAME:${c.nickname}\n`;
    }
    
    vcard += 'END:VCARD\n';
    return vcard;
  }).join('\n');
  
  const fileName = `contacts_${Date.now()}.vcf`;
  const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
  
  await RNFS.writeFile(filePath, vcards, 'utf8');
  await ReactNativeBlobUtil.android.actionViewIntent(filePath, 'text/x-vcard');
};

export const exportContacts = async (contacts: Contact[], format: ExportFormat = 'json'): Promise<void> => {
  if (!contacts || contacts.length === 0) {
    throw new Error('Немає контактів для експорту');
  }
  
  switch (format) {
    case 'csv':
      await exportToCSV(contacts);
      break;
    case 'vcf':
      await exportToVCF(contacts);
      break;
    case 'json':
    default:
      await exportToJSON(contacts);
      break;
  }
};

export const importFromJSON = async (fileContent: string): Promise<Contact[]> => {
  return JSON.parse(fileContent);
};

export const importFromCSV = async (fileContent: string): Promise<Contact[]> => {
  const lines = fileContent.split('\n').filter(line => line.trim());
  if (lines.length < 2) {
    throw new Error('Файл CSV порожній або некоректний');
  }
  
  const dataLines = lines.slice(1);
  
  const contacts: Contact[] = dataLines.map((line, index) => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    const [firstName, lastName, phone, email, birthday, address, website, notes] = values;
    
    const contact: Contact = {
      id: `imported_${Date.now()}_${index}`,
      firstName: firstName || 'Без імені',
      lastName: lastName || '',
      phones: phone ? [{ label: 'Мобільний' as const, value: phone }] : [],
      email: email || undefined,
      birthday: birthday || undefined,
      addresses: address ? [{ label: 'Домашня' as const, value: address }] : [],
      website: website || undefined,
      notes: notes || undefined,
      isFavorite: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    return contact;
  });
  
  return contacts;
};

export const importFromVCF = async (fileContent: string): Promise<Contact[]> => {
  const vcards = fileContent.split('BEGIN:VCARD').filter(v => v.trim());
  
  const contacts: Contact[] = vcards.map((vcard, index) => {
    const lines = vcard.split('\n').map(l => l.trim()).filter(l => l);
    
    let firstName = '';
    let lastName = '';
    const phones: PhoneNumber[] = [];
    const addresses: Address[] = [];
    let email: string | undefined;
    let birthday: string | undefined;
    let website: string | undefined;
    let notes: string | undefined;
    let jobTitle: string | undefined;
    let nickname: string | undefined;
    
    lines.forEach(line => {
      if (line.startsWith('N:')) {
        const parts = line.substring(2).split(';');
        lastName = parts[0] || '';
        firstName = parts[1] || '';
      } else if (line.startsWith('FN:')) {
        const fullName = line.substring(3);
        if (!firstName && !lastName) {
          const parts = fullName.split(' ');
          firstName = parts[0] || '';
          lastName = parts.slice(1).join(' ') || '';
        }
      } else if (line.startsWith('TEL')) {
        const value = line.split(':')[1];
        let label: PhoneNumber['label'] = 'Мобільний';
        if (line.includes('WORK')) label = 'Робочий';
        else if (line.includes('HOME')) label = 'Домашній';
        phones.push({ label, value });
      } else if (line.startsWith('EMAIL:')) {
        email = line.substring(6);
      } else if (line.startsWith('BDAY:')) {
        const bday = line.substring(5);
        const parts = bday.split('-');
        if (parts.length === 3) {
          birthday = `${parts[2]}.${parts[1]}.${parts[0]}`;
        }
      } else if (line.startsWith('ADR')) {
        const value = line.split(':')[1]?.split(';;')[1]?.split(';;;;')[0] || '';
        let label: Address['label'] = 'Домашня';
        if (line.includes('WORK')) label = 'Робоча';
        if (value) addresses.push({ label, value });
      } else if (line.startsWith('URL:')) {
        website = line.substring(4);
      } else if (line.startsWith('NOTE:')) {
        notes = line.substring(5);
      } else if (line.startsWith('TITLE:')) {
        jobTitle = line.substring(6);
      } else if (line.startsWith('NICKNAME:')) {
        nickname = line.substring(9);
      }
    });
    
    return {
      id: `imported_${Date.now()}_${index}`,
      firstName: firstName || 'Без імені',
      lastName,
      phones,
      email,
      birthday,
      addresses,
      website,
      notes,
      jobTitle,
      nickname,
      isFavorite: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  });
  
  return contacts;
};

export const pickAndImportFile = async (): Promise<Contact[]> => {
  try {
    const result = await pick({
      type: [types.allFiles],
      allowMultiSelection: false,
      copyTo: 'cachesDirectory',
    });
    
    if (!result || result.length === 0) {
      throw new Error('Файл не вибрано');
    }
    
    const file = result[0];
    
    if (!file.uri) {
      throw new Error('Не вдалося отримати шлях до файлу');
    }
    
    let fileUri = file.uri;
    
    if ((file as any).fileCopyUri) {
      fileUri = (file as any).fileCopyUri;
    }
    
    let filePath = decodeURIComponent(fileUri);
    
    if (filePath.startsWith('file://')) {
      filePath = filePath.substring(7);
    }
    
    console.log('Reading file from:', filePath);
    const fileContent = await RNFS.readFile(filePath, 'utf8');
    
    const fileName = file.name?.toLowerCase() || '';
    
    if (fileName.endsWith('.json')) {
      return await importFromJSON(fileContent);
    } else if (fileName.endsWith('.csv')) {
      return await importFromCSV(fileContent);
    } else if (fileName.endsWith('.vcf')) {
      return await importFromVCF(fileContent);
    } else {
      if (fileContent.trim().startsWith('{') || fileContent.trim().startsWith('[')) {
        return await importFromJSON(fileContent);
      } else if (fileContent.includes('BEGIN:VCARD')) {
        return await importFromVCF(fileContent);
      } else {
        return await importFromCSV(fileContent);
      }
    }
  } catch (error: any) {
    if (error?.message?.includes('cancel') || error?.code === 'DOCUMENT_PICKER_CANCELED') {
      return [];
    }
    console.error('Import error:', error);
    throw new Error(`Не вдалося імпортувати файл: ${error?.message || 'Невідома помилка'}`);
  }
};
