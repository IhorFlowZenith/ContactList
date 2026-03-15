import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Platform, Alert } from 'react-native';

export const checkCameraPermission = async (): Promise<boolean> => {
  const permission = PERMISSIONS.ANDROID.CAMERA;
  const result = await check(permission);
  
  if (result === RESULTS.GRANTED) {
    return true;
  }
  
  if (result === RESULTS.DENIED) {
    const requestResult = await request(permission);
    return requestResult === RESULTS.GRANTED;
  }
  
  return false;
};

export const checkGalleryPermission = async (): Promise<boolean> => {
  const permission = Number(Platform.Version) >= 33 
    ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES 
    : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
  
  const result = await check(permission);
  
  if (result === RESULTS.GRANTED) {
    return true;
  }
  
  if (result === RESULTS.DENIED) {
    const requestResult = await request(permission);
    return requestResult === RESULTS.GRANTED;
  }
  
  return false;
};

export const pickImageFromCamera = async (): Promise<string | null> => {
  const hasPermission = await checkCameraPermission();
  
  if (!hasPermission) {
    Alert.alert('Дозвіл відхилено', 'Для використання камери потрібен дозвіл');
    return null;
  }

  return new Promise((resolve) => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 800,
        maxHeight: 800,
        includeBase64: true,
      },
      (response: ImagePickerResponse) => {
        if (response.didCancel) {
          resolve(null);
        } else if (response.errorCode) {
          Alert.alert('Помилка', response.errorMessage || 'Не вдалося зробити фото');
          resolve(null);
        } else if (response.assets && response.assets[0]) {
          const base64 = response.assets[0].base64;
          if (base64) {
            resolve(`data:image/jpeg;base64,${base64}`);
          } else {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      }
    );
  });
};

export const pickImageFromGallery = async (): Promise<string | null> => {
  const hasPermission = await checkGalleryPermission();
  
  if (!hasPermission) {
    Alert.alert('Дозвіл відхилено', 'Для доступу до галереї потрібен дозвіл');
    return null;
  }

  return new Promise((resolve) => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 800,
        maxHeight: 800,
        includeBase64: true,
      },
      (response: ImagePickerResponse) => {
        if (response.didCancel) {
          resolve(null);
        } else if (response.errorCode) {
          Alert.alert('Помилка', response.errorMessage || 'Не вдалося вибрати фото');
          resolve(null);
        } else if (response.assets && response.assets[0]) {
          const base64 = response.assets[0].base64;
          if (base64) {
            resolve(`data:image/jpeg;base64,${base64}`);
          } else {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      }
    );
  });
};
