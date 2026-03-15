import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { check, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import { Platform } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';

const PermissionsScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [cameraStatus, setCameraStatus] = useState('');
  const [galleryStatus, setGalleryStatus] = useState('');
  const [contactsStatus, setContactsStatus] = useState('');

  const styles = createStyles(theme);

  useEffect(() => {
    checkPermissions();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: t('permissions'),
    });
  }, [navigation, t]);

  const checkPermissions = async () => {
    const contactsPermission = PERMISSIONS.ANDROID.READ_CONTACTS;
    const contactsResult = await check(contactsPermission);
    setContactsStatus(getStatusText(contactsResult));

    const cameraPermission = PERMISSIONS.ANDROID.CAMERA;
    const cameraResult = await check(cameraPermission);
    setCameraStatus(getStatusText(cameraResult));

    const galleryPermission = Number(Platform.Version) >= 33 
      ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES 
      : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
    const galleryResult = await check(galleryPermission);
    setGalleryStatus(getStatusText(galleryResult));
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case RESULTS.GRANTED:
        return t('granted');
      case RESULTS.DENIED:
        return t('denied');
      case RESULTS.BLOCKED:
        return t('denied');
      case RESULTS.UNAVAILABLE:
        return t('denied');
      default:
        return t('denied');
    }
  };

  const getStatusColor = (status: string): string => {
    const grantedText = t('granted');
    if (status === grantedText) return '#34C759';
    return '#FF3B30';
  };

  const handleOpenSettings = () => {
    openSettings();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('permissionsTitle')}</Text>
          <Text style={styles.description}>
            {t('permissionsDesc')}
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.permissionCard}
          onPress={handleOpenSettings}
          activeOpacity={0.7}
        >
          <View style={styles.permissionHeader}>
            <Icon name="people-outline" size={24} color={theme.primary} />
            <View style={styles.permissionInfo}>
              <Text style={styles.permissionTitle}>{t('contactsPermissionTitle')}</Text>
              <Text style={styles.permissionDescription}>
                {t('contactsPermissionDescription')}
              </Text>
            </View>
          </View>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(contactsStatus) }]} />
            <Text style={[styles.statusText, { color: getStatusColor(contactsStatus) }]}>
              {contactsStatus}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.permissionCard}
          onPress={handleOpenSettings}
          activeOpacity={0.7}
        >
          <View style={styles.permissionHeader}>
            <Icon name="camera-outline" size={24} color={theme.primary} />
            <View style={styles.permissionInfo}>
              <Text style={styles.permissionTitle}>{t('cameraPermissionTitle')}</Text>
              <Text style={styles.permissionDescription}>
                {t('cameraPermissionDescription')}
              </Text>
            </View>
          </View>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(cameraStatus) }]} />
            <Text style={[styles.statusText, { color: getStatusColor(cameraStatus) }]}>
              {cameraStatus}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.permissionCard}
          onPress={handleOpenSettings}
          activeOpacity={0.7}
        >
          <View style={styles.permissionHeader}>
            <Icon name="images-outline" size={24} color={theme.primary} />
            <View style={styles.permissionInfo}>
              <Text style={styles.permissionTitle}>{t('galleryPermissionTitle')}</Text>
              <Text style={styles.permissionDescription}>
                {t('galleryPermissionDescription')}
              </Text>
            </View>
          </View>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(galleryStatus) }]} />
            <Text style={[styles.statusText, { color: getStatusColor(galleryStatus) }]}>
              {galleryStatus}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Icon name="information-circle-outline" size={20} color={theme.primary} />
          <Text style={styles.infoText}>
            {t('permissionsInfo')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.textSecondary,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: theme.textSecondary,
    lineHeight: 20,
  },
  permissionCard: {
    backgroundColor: theme.card,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  permissionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  permissionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: theme.backgroundTertiary,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: theme.textSecondary,
    lineHeight: 20,
  },
});

export default PermissionsScreen;
