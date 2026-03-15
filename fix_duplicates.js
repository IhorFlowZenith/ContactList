import AsyncStorage from '@react-native-async-storage/async-storage';

export const clearLocalContacts = async () => {
  try {
    await AsyncStorage.removeItem('@local_contacts');
    console.log('✅ Локальні контакти очищено');
  } catch (error) {
    console.error('❌ Помилка очищення:', error);
  }
};