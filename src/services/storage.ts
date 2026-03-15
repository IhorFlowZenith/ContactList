import AsyncStorage from '@react-native-async-storage/async-storage';
import { Contact, Settings } from '../types';

const CONTACTS_KEY = '@contacts';
const LOCAL_CONTACTS_KEY = '@local_contacts';
const SETTINGS_KEY = '@settings';
const FAVORITES_KEY = '@favorites';
const AVATARS_KEY = '@contact_avatars';

export const saveContacts = async (contacts: Contact[]): Promise<void> => {
  await AsyncStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
};

export const loadContacts = async (): Promise<Contact[]> => {
  try {
    const data = await AsyncStorage.getItem(CONTACTS_KEY);
    if (!data) return [];
    const contacts = JSON.parse(data);
  
  return contacts.map((contact: any) => {
    if (contact.phones && Array.isArray(contact.phones)) {
      return contact;
    }
    
    const phones = [];
    if (contact.phone) {
      phones.push({ value: contact.phone, label: 'Мобільний' as const });
    }
    if (contact.workPhone) {
      phones.push({ value: contact.workPhone, label: 'Робочий' as const });
    }
    
    return {
      ...contact,
      phones: phones.length > 0 ? phones : [{ value: '', label: 'Мобільний' as const }],
      addresses: contact.addresses || [],
      birthday: contact.birthday || '',
      middleName: contact.middleName || '',
      nickname: contact.nickname || '',
      jobTitle: contact.jobTitle || '',
    };
  });
  } catch (error) {
    console.error('Error loading contacts, clearing old data:', error);
    await AsyncStorage.removeItem(CONTACTS_KEY);
    return [];
  }
};

export const saveSettings = async (settings: Settings): Promise<void> => {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const loadSettings = async (): Promise<Settings> => {
  const data = await AsyncStorage.getItem(SETTINGS_KEY);
  if (!data) {
    return { theme: 'auto', language: 'uk', nameFormat: 'firstLast' };
  }
  return JSON.parse(data);
};

export const saveFavorites = async (favoriteIds: string[]): Promise<void> => {
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteIds));
};

export const loadFavorites = async (): Promise<string[]> => {
  try {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading favorites, clearing old data:', error);
    await AsyncStorage.removeItem(FAVORITES_KEY);
    return [];
  }
};

export const saveLocalContacts = async (contacts: Contact[]): Promise<void> => {
  await AsyncStorage.setItem(LOCAL_CONTACTS_KEY, JSON.stringify(contacts));
};

export const loadLocalContacts = async (): Promise<Contact[]> => {
  try {
    const data = await AsyncStorage.getItem(LOCAL_CONTACTS_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading local contacts:', error);
    return [];
  }
};

export const saveAvatar = async (contactId: string, avatar: string): Promise<void> => {
  try {
    const avatarsData = await AsyncStorage.getItem(AVATARS_KEY);
    const avatars = avatarsData ? JSON.parse(avatarsData) : {};
    avatars[contactId] = avatar;
    await AsyncStorage.setItem(AVATARS_KEY, JSON.stringify(avatars));
  } catch (error) {
    console.error('Error saving avatar:', error);
  }
};

export const loadAvatar = async (contactId: string): Promise<string | null> => {
  try {
    const avatarsData = await AsyncStorage.getItem(AVATARS_KEY);
    if (!avatarsData) return null;
    const avatars = JSON.parse(avatarsData);
    return avatars[contactId] || null;
  } catch (error) {
    console.error('Error loading avatar:', error);
    return null;
  }
};

export const loadAllAvatars = async (): Promise<Record<string, string>> => {
  try {
    const avatarsData = await AsyncStorage.getItem(AVATARS_KEY);
    return avatarsData ? JSON.parse(avatarsData) : {};
  } catch (error) {
    console.error('Error loading avatars:', error);
    return {};
  }
};

export const deleteAvatar = async (contactId: string): Promise<void> => {
  try {
    const avatarsData = await AsyncStorage.getItem(AVATARS_KEY);
    if (!avatarsData) return;
    const avatars = JSON.parse(avatarsData);
    delete avatars[contactId];
    await AsyncStorage.setItem(AVATARS_KEY, JSON.stringify(avatars));
  } catch (error) {
    console.error('Error deleting avatar:', error);
  }
};