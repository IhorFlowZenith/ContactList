export interface PhoneNumber {
  value: string;
  label: 'Мобільний' | 'Робочий' | 'Домашній' | 'Основний' | 'Інший';
}

export interface Address {
  value: string;
  label: 'Домашня' | 'Робоча' | 'Інша';
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  phones: PhoneNumber[];
  email?: string;
  birthday?: string;
  addresses: Address[];
  website?: string;
  notes?: string;
  avatar?: string;
  isFavorite: boolean;
  createdAt: number;
  updatedAt: number;
  
  middleName?: string;
  nickname?: string;
  jobTitle?: string;
}

export interface Settings {
  theme: 'auto' | 'light' | 'dark';
  language: 'uk' | 'en';
  nameFormat: 'firstLast' | 'lastFirst';
  accentColor?: string;
}

export type RootStackParamList = {
  MainTabs: undefined;
  ContactDetails: { contactId: string };
  EditContact: { contactId?: string };
};

export type MainTabParamList = {
  Contacts: undefined;
  Favorites: undefined;
  Settings: undefined;
};