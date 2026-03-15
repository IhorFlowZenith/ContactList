import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useContacts } from '../contexts/ContactsContext';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';
import Avatar from '../components/Avatar';
import CustomAlert from '../components/CustomAlert';
import CustomActionSheet from '../components/CustomActionSheet';
import { PhoneNumber, Address } from '../types';
import { pickImageFromCamera, pickImageFromGallery } from '../services/imageService';

const EditContactScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { contacts, addContact, updateContact } = useContacts();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { contactId } = (route.params as { contactId?: string }) || {};
  const [alertConfig, setAlertConfig] = useState<any>(null);
  const [photoSheetVisible, setPhotoSheetVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'main' | 'other'>('main');

  const existingContact = contactId ? contacts.find(c => c.id === contactId) : null;

  const [firstName, setFirstName] = useState(existingContact?.firstName || '');
  const [lastName, setLastName] = useState(existingContact?.lastName || '');
  const [phones, setPhones] = useState<PhoneNumber[]>(
    existingContact?.phones?.length ? existingContact.phones : [{ value: '', label: 'Мобільний' }]
  );
  const [email, setEmail] = useState(existingContact?.email || '');
  const [birthday, setBirthday] = useState(existingContact?.birthday || '');
  const [addresses, setAddresses] = useState<Address[]>(
    existingContact?.addresses?.length ? existingContact.addresses : []
  );
  const [website, setWebsite] = useState(existingContact?.website || '');
  const [notes, setNotes] = useState(existingContact?.notes || '');
  const [avatar, setAvatar] = useState(existingContact?.avatar || '');

  const [middleName, setMiddleName] = useState(existingContact?.middleName || '');
  const [nickname, setNickname] = useState(existingContact?.nickname || '');
  const [jobTitle, setJobTitle] = useState(existingContact?.jobTitle || '');
  
  useEffect(() => {
    navigation.setOptions({
      title: contactId ? t('editContact') : t('addContact'),
      headerRight: () => (
        <TouchableOpacity
          onPress={handleSave}
          style={{ marginRight: 16 }}
        >
          <Icon name="checkmark" size={28} color={theme.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, contactId, t, firstName, lastName, phones, email, birthday, addresses, website, notes, avatar, middleName, nickname, jobTitle]);

  const styles = createStyles(theme);

  const handlePhotoSelect = async (type: 'camera' | 'gallery') => {
    const imageUri = type === 'camera' ? await pickImageFromCamera() : await pickImageFromGallery();

    if (imageUri) {
      setAvatar(imageUri);
    }
  };

  const handleRemovePhoto = () => {
    setAvatar('');
  };

  const addPhone = () => {
    setPhones([...phones, { value: '', label: 'Мобільний' }]);
  };

  const removePhone = (index: number) => {
    if (phones.length > 1) {
      setPhones(phones.filter((_, i) => i !== index));
    }
  };

  const updatePhone = (index: number, value: string) => {
    const newPhones = [...phones];
    newPhones[index].value = value;
    setPhones(newPhones);
  };

  const updatePhoneLabel = (index: number, label: PhoneNumber['label']) => {
    const newPhones = [...phones];
    newPhones[index].label = label;
    setPhones(newPhones);
  };

  const addAddress = () => {
    setAddresses([...addresses, { value: '', label: 'Домашня' }]);
  };

  const removeAddress = (index: number) => {
    setAddresses(addresses.filter((_, i) => i !== index));
  };

  const updateAddress = (index: number, value: string) => {
    const newAddresses = [...addresses];
    newAddresses[index].value = value;
    setAddresses(newAddresses);
  };

  const updateAddressLabel = (index: number, label: Address['label']) => {
    const newAddresses = [...addresses];
    newAddresses[index].label = label;
    setAddresses(newAddresses);
  };

  const handleSave = async () => {
    if (!firstName.trim()) {
      setAlertConfig({
        title: t('error'),
        message: t('firstNameRequired'),
        buttons: [{ text: t('ok') }],
      });
      return;
    }

    const contactData = {
      firstName,
      lastName,
      phones: phones.filter(p => p.value.trim()),
      email,
      birthday,
      addresses: addresses.filter(a => a.value.trim()),
      website,
      notes,
      avatar,
      middleName,
      nickname,
      jobTitle,
      isFavorite: existingContact?.isFavorite || false,
    };

    console.log('💾 Збереження контакту:', contactId ? 'оновлення' : 'новий', contactData);

    try {
      if (contactId) {
        console.log('📝 Оновлення контакту ID:', contactId);
        await updateContact(contactId, contactData);
      } else {
        console.log('➕ Додавання нового контакту');
        await addContact(contactData);
      }
      console.log('✅ Контакт успішно збережено, повертаємось назад');
      navigation.goBack();
    } catch (error) {
      console.error('❌ Помилка збереження:', error);
      setAlertConfig({
        title: t('error'),
        message: `${t('saveContactError')}\n\n${error}`,
        buttons: [{ text: t('ok') }],
      });
    }
  };

  const displayName = firstName && lastName ? `${firstName} ${lastName}` : t('addContact');

  const phoneLabels: PhoneNumber['label'][] = [
    'Мобільний',
    'Робочий',
    'Домашній',
    'Основний',
    'Інший',
  ];
  const addressLabels: Address['label'][] = ['Домашня', 'Робоча', 'Інша'];

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={styles.container} 
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={() => setPhotoSheetVisible(true)}>
            <Avatar name={displayName} avatar={avatar} size={100} />
            <View style={styles.cameraIcon}>
              <Icon name="camera" size={24} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'main' && styles.activeTab]}
            onPress={() => setActiveTab('main')}
          >
            <Text style={[styles.tabText, activeTab === 'main' && styles.activeTabText]}>
              {t('mainInfo')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'other' && styles.activeTab]}
            onPress={() => setActiveTab('other')}
          >
            <Text style={[styles.tabText, activeTab === 'other' && styles.activeTabText]}>
              {t('otherInfo')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          {activeTab === 'main' ? (
            <>
              <View style={styles.section}>
                <TextInput
                  style={[styles.input, styles.inputWithMargin]}
                  placeholder={t('firstNamePlaceholder')}
                  placeholderTextColor={theme.textSecondary}
                  value={firstName}
                  onChangeText={setFirstName}
                />
                <TextInput
                  style={styles.input}
                  placeholder={t('lastNamePlaceholder')}
                  placeholderTextColor={theme.textSecondary}
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('phones')}</Text>
                {phones.map((phone, index) => (
                  <View key={index} style={styles.fieldGroup}>
                    <View style={styles.fieldRow}>
                      <TouchableOpacity
                        style={styles.labelButton}
                        onPress={() => {
                          setAlertConfig({
                            title: t('selectLabel'),
                            options: phoneLabels.map(label => ({
                              text: label,
                              onPress: () => updatePhoneLabel(index, label),
                            })),
                          });
                        }}
                      >
                        <Text style={styles.labelText}>{phone.label}</Text>
                        <Icon name="chevron-down" size={16} color={theme.textSecondary} />
                      </TouchableOpacity>
                      {phones.length > 1 && (
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => removePhone(index)}
                        >
                          <Icon name="close-circle" size={24} color={theme.destructive} />
                        </TouchableOpacity>
                      )}
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder={t('phonePlaceholder')}
                      placeholderTextColor={theme.textSecondary}
                      value={phone.value}
                      onChangeText={value => updatePhone(index, value)}
                      keyboardType="phone-pad"
                    />
                  </View>
                ))}
                <TouchableOpacity style={styles.addButton} onPress={addPhone}>
                  <Icon name="add-circle-outline" size={24} color={theme.primary} />
                  <Text style={styles.addButtonText}>{t('addPhone')}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('email')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('emailPlaceholder')}
                  placeholderTextColor={theme.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('birthday')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('birthdayPlaceholder')}
                  placeholderTextColor={theme.textSecondary}
                  value={birthday}
                  onChangeText={setBirthday}
                  keyboardType="numbers-and-punctuation"
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('addresses')}</Text>
                {addresses.map((address, index) => (
                  <View key={index} style={styles.fieldGroup}>
                    <View style={styles.fieldRow}>
                      <TouchableOpacity
                        style={styles.labelButton}
                        onPress={() => {
                          setAlertConfig({
                            title: t('selectLabel'),
                            options: addressLabels.map(label => ({
                              text: label,
                              onPress: () => updateAddressLabel(index, label),
                            })),
                          });
                        }}
                      >
                        <Text style={styles.labelText}>{address.label}</Text>
                        <Icon name="chevron-down" size={16} color={theme.textSecondary} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeAddress(index)}
                      >
                        <Icon name="close-circle" size={24} color={theme.destructive} />
                      </TouchableOpacity>
                    </View>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder={t('addressPlaceholder')}
                      placeholderTextColor={theme.textSecondary}
                      value={address.value}
                      onChangeText={value => updateAddress(index, value)}
                      multiline
                      numberOfLines={3}
                    />
                  </View>
                ))}
                <TouchableOpacity style={styles.addButton} onPress={addAddress}>
                  <Icon name="add-circle-outline" size={24} color={theme.primary} />
                  <Text style={styles.addButtonText}>{t('addAddress')}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('website')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('websitePlaceholder')}
                  placeholderTextColor={theme.textSecondary}
                  value={website}
                  onChangeText={setWebsite}
                  autoCapitalize="none"
                  keyboardType="url"
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('notes')}</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder={t('notesPlaceholder')}
                  placeholderTextColor={theme.textSecondary}
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </>
          ) : (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('middleName')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('middleNamePlaceholder')}
                  placeholderTextColor={theme.textSecondary}
                  value={middleName}
                  onChangeText={setMiddleName}
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('nickname')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('nicknamePlaceholder')}
                  placeholderTextColor={theme.textSecondary}
                  value={nickname}
                  onChangeText={setNickname}
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('jobTitle')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('jobTitlePlaceholder')}
                  placeholderTextColor={theme.textSecondary}
                  value={jobTitle}
                  onChangeText={setJobTitle}
                />
              </View>
            </>
          )}
        </View>

        {alertConfig && alertConfig.options ? (
          <CustomActionSheet
            visible={!!alertConfig}
            title={alertConfig.title}
            options={alertConfig.options}
            onClose={() => setAlertConfig(null)}
          />
        ) : alertConfig ? (
          <CustomAlert
            visible={!!alertConfig}
            title={alertConfig.title}
            message={alertConfig.message}
            buttons={alertConfig.buttons}
            onClose={() => setAlertConfig(null)}
          />
        ) : null}

        <CustomActionSheet
          visible={photoSheetVisible}
          title={t('contactPhoto')}
          message={t('selectPhotoSource')}
          options={[
            {
              text: `📷 ${t('takePhoto')}`,
              onPress: () => handlePhotoSelect('camera'),
            },
            {
              text: `🖼️ ${t('chooseFromGallery')}`,
              onPress: () => handlePhotoSelect('gallery'),
            },
            ...(avatar
              ? [
                  {
                    text: `🗑️ ${t('removePhoto')}`,
                    onPress: handleRemovePhoto,
                  },
                ]
              : []),
          ]}
          onClose={() => setPhotoSheetVisible(false)}
        />
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
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
    avatarSection: {
      alignItems: 'center',
      paddingVertical: 24,
      position: 'relative',
    },
    cameraIcon: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: theme.primary,
      borderRadius: 20,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: theme.background,
    },
    tabs: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      marginBottom: 16,
      gap: 8,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      borderRadius: 12,
      backgroundColor: theme.backgroundSecondary,
    },
    activeTab: {
      backgroundColor: theme.primary,
    },
    tabText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    activeTabText: {
      color: '#FFFFFF',
    },
    form: {
      padding: 16,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textSecondary,
      marginBottom: 8,
      textTransform: 'uppercase',
    },
    fieldGroup: {
      marginBottom: 12,
    },
    fieldRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    labelButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingVertical: 4,
    },
    labelText: {
      fontSize: 14,
      color: theme.primary,
      fontWeight: '500',
    },
    removeButton: {
      padding: 4,
    },
    input: {
      backgroundColor: theme.inputBackground,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.separator,
    },
    inputWithMargin: {
      marginBottom: 12,
    },
    textArea: {
      height: 80,
      textAlignVertical: 'top',
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 12,
    },
    addButtonText: {
      fontSize: 16,
      color: theme.primary,
      fontWeight: '500',
    },
    actions: {
      flexDirection: 'row',
      padding: 16,
      gap: 12,
    },
    cancelBtn: {
      flex: 1,
      backgroundColor: theme.backgroundTertiary,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.separator,
    },
    cancelBtnText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
    },
    saveBtn: {
      flex: 1,
      backgroundColor: theme.primary,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    saveBtnText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  });

export default EditContactScreen;
