import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Contact } from '../types';
import { loadContacts, saveFavorites, loadFavorites, saveLocalContacts, loadLocalContacts, saveAvatar, loadAllAvatars, deleteAvatar } from '../services/storage';
import { 
  importContactsFromDevice, 
  requestContactsPermission,
  saveContactToDevice,
  updateContactOnDevice,
  deleteContactFromDevice,
} from '../services/contactsService';

interface ContactsContextType {
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateContact: (id: string, contact: Partial<Contact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  importContactsData: (contacts: Contact[]) => void;
  refreshContacts: () => Promise<void>;
  loading: boolean;
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

export const ContactsProvider = ({ children }: { children: ReactNode }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [localContacts, setLocalContacts] = useState<Contact[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContactsFromDevice().catch(error => {
      console.error('Помилка ініціалізації контактів:', error);
    });
  }, []);



  const loadContactsFromDevice = async () => {
    try {
      setLoading(true);
      
      const savedFavorites = await loadFavorites().catch(() => [] as string[]);
      const savedLocalContacts = await loadLocalContacts().catch(() => [] as Contact[]);
      const savedAvatars = await loadAllAvatars().catch(() => ({} as Record<string, string>));
      
      setFavoriteIds(savedFavorites);
      setLocalContacts(savedLocalContacts);
      
      let allContacts: Contact[] = [];
      
      try {
        const hasPermission = await requestContactsPermission();
        
        if (hasPermission) {
          const deviceContacts = await importContactsFromDevice();
          allContacts = [...deviceContacts];
          console.log(`📱 Завантажено ${deviceContacts.length} контактів з пристрою`);
        } else {
          const oldContacts = await loadContacts().catch(() => []);
          allContacts = [...oldContacts];
          console.log(`💾 Завантажено ${oldContacts.length} контактів з кешу`);
        }
      } catch (contactsError) {
        console.warn('Не вдалося завантажити контакти з пристрою:', contactsError);
      }
      
      const deviceContactIds = new Set(allContacts.map(c => c.id));
      const localOnlyContacts = savedLocalContacts.filter(c => !deviceContactIds.has(c.id));
      
      console.log(`💾 Локальних контактів: ${savedLocalContacts.length}, унікальних: ${localOnlyContacts.length}`);
      
      allContacts = [...allContacts, ...localOnlyContacts];
      
      const contactsWithFavorites = allContacts.map((contact): Contact => {
        const uniqueKey = `${contact.firstName}_${contact.lastName}_${contact.phones?.[0]?.value || ''}`;
        const savedAvatar = savedAvatars[contact.id];
        return {
          ...contact,
          avatar: savedAvatar || contact.avatar,
          isFavorite: savedFavorites.includes(uniqueKey),
        };
      });
      
      console.log(`✅ Всього контактів: ${contactsWithFavorites.length}`);
      setContacts(contactsWithFavorites);
    } catch (error) {
      console.error('Критична помилка завантаження контактів:', error);
      setContacts([]);
      setFavoriteIds([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshContacts = async () => {
    await loadContactsFromDevice();
  };



  const addContact = async (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const tempContact: Contact = {
        ...contact,
        id: '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      
      const deviceContactId = await saveContactToDevice(tempContact);
      
      const newContact: Contact = {
        ...tempContact,
        id: deviceContactId,
      };
      
      if (newContact.avatar) {
        await saveAvatar(deviceContactId, newContact.avatar);
      }
      
      setContacts(prev => [...prev, newContact]);
      
      console.log('✅ Контакт успішно збережено в телефонну книгу:', deviceContactId);
    } catch (error) {
      console.error('❌ Помилка збереження контакту на пристрій:', error);
      
      const localContact: Contact = {
        ...contact,
        id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      
      const updatedLocal = [...localContacts, localContact];
      setLocalContacts(updatedLocal);
      await saveLocalContacts(updatedLocal);
      
      if (localContact.avatar) {
        await saveAvatar(localContact.id, localContact.avatar);
      }
      
      setContacts(prev => [...prev, localContact]);
      
      console.log('💾 Контакт збережено локально (не вдалося зберегти на пристрій):', localContact.id);
      throw error;
    }
  };

  const updateContact = async (id: string, updates: Partial<Contact>) => {
    try {
      const contact = contacts.find(c => c.id === id);
      if (!contact) {
        console.error('Контакт не знайдено:', id);
        return;
      }
      
      const updatedContact = { ...contact, ...updates, updatedAt: Date.now() };
      
      const isLocalContact = id.startsWith('local_');
      
      if (!isLocalContact) {
        await updateContactOnDevice(updatedContact);
        console.log('✅ Контакт успішно оновлено в телефонній книзі:', id);
      } else {
        const updatedLocal = localContacts.map(c => 
          c.id === id ? updatedContact : c
        );
        setLocalContacts(updatedLocal);
        await saveLocalContacts(updatedLocal);
        console.log('💾 Локальний контакт оновлено:', id);
      }
      
      if (updatedContact.avatar) {
        await saveAvatar(id, updatedContact.avatar);
      }
      
      setContacts(prev =>
        prev.map(c => (c.id === id ? updatedContact : c))
      );
    } catch (error) {
      console.error('❌ Помилка оновлення контакту:', error);
      throw error;
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const isLocalContact = id.startsWith('local_');
      
      if (!isLocalContact) {
        await deleteContactFromDevice(id);
        console.log('✅ Контакт успішно видалено з телефонної книги:', id);
      } else {
        const updatedLocal = localContacts.filter(c => c.id !== id);
        setLocalContacts(updatedLocal);
        await saveLocalContacts(updatedLocal);
        console.log('💾 Локальний контакт видалено:', id);
      }
      
      await deleteAvatar(id);
      
      setContacts(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('❌ Помилка видалення контакту:', error);
      throw error;
    }
  };

  const toggleFavorite = async (id: string) => {
    const contact = contacts.find(c => c.id === id);
    if (!contact) return;

    const uniqueKey = `${contact.firstName}_${contact.lastName}_${contact.phones?.[0]?.value || ''}`;
    const newIsFavorite = !contact.isFavorite;
    
    setContacts(prev =>
      prev.map(c => (c.id === id ? { ...c, isFavorite: newIsFavorite } : c))
    );
    
    const newFavorites = newIsFavorite 
      ? [...favoriteIds, uniqueKey]
      : favoriteIds.filter(key => key !== uniqueKey);
    
    setFavoriteIds(newFavorites);
    
    try {
      await saveFavorites(newFavorites);
    } catch (error) {
      console.error('Помилка збереження улюблених:', error);
    }
  };

  const importContactsData = (importedContacts: Contact[]) => {
    setContacts(importedContacts);
  };

  return (
    <ContactsContext.Provider
      value={{ 
        contacts, 
        addContact, 
        updateContact, 
        deleteContact, 
        toggleFavorite, 
        importContactsData, 
        refreshContacts,
        loading 
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
};

export const useContacts = () => {
  const context = useContext(ContactsContext);
  if (!context) throw new Error('useContacts must be used within ContactsProvider');
  return context;
};