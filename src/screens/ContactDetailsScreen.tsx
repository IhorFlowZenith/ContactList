import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Share as RNShare, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import QRCode from 'react-native-qrcode-svg';
import { useContacts } from '../contexts/ContactsContext';
import { useSettings } from '../contexts/SettingsContext';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';
import { formatContactName } from '../utils/formatName';
import Avatar from '../components/Avatar';
import CustomAlert from '../components/CustomAlert';
import CustomActionSheet from '../components/CustomActionSheet';
import { Contact } from '../types';

const ContactDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { contacts, deleteContact } = useContacts();
  const { settings } = useSettings();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { contactId } = route.params as { contactId: string };
  
  const [deleteAlertVisible, setDeleteAlertVisible] = useState(false);
  const [shareSheetVisible, setShareSheetVisible] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  
  const styles = createStyles(theme);
  const contact = contacts.find((c: Contact) => c.id === contactId);


  if (!contact) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{t('contactNotFound')}</Text>
      </View>
    );
  }

  const displayName = formatContactName(contact, settings.nameFormat);

  const shareAsText = async () => {
    let text = `📇 ${displayName}\n\n`;
    
    if (contact.phones?.length) {
      text += '📱 Телефони:\n';
      contact.phones.forEach(phone => {
        text += `  ${phone.label}: ${phone.value}\n`;
      });
      text += '\n';
    }
    
    if (contact.email) {
      text += `📧 Email: ${contact.email}\n\n`;
    }
    
    if (contact.birthday) {
      text += `🎂 Дата народження: ${contact.birthday}\n\n`;
    }
    
    if (contact.addresses?.length) {
      text += '📍 Адреси:\n';
      contact.addresses.forEach(addr => {
        text += `  ${addr.label}: ${addr.value}\n`;
      });
      text += '\n';
    }
    
    if (contact.website) {
      text += `🌐 Веб-сайт: ${contact.website}\n\n`;
    }
    
    if (contact.notes) {
      text += `📝 Нотатки: ${contact.notes}\n`;
    }

    try {
      await RNShare.share({
        message: text,
        title: `Контакт: ${displayName}`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const generateVCard = () => {
    let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
    vcard += `FN:${displayName}\n`;
    vcard += `N:${contact.lastName};${contact.firstName};${contact.middleName || ''};;`;
    
    if (contact.jobTitle) {
      vcard += `\nTITLE:${contact.jobTitle}`;
    }
    
    contact.phones?.forEach(phone => {
      const type = phone.label === 'Мобільний' ? 'CELL' : 
                   phone.label === 'Робочий' ? 'WORK' : 
                   phone.label === 'Домашній' ? 'HOME' : 'VOICE';
      vcard += `\nTEL;TYPE=${type}:${phone.value}`;
    });
    
    if (contact.email) {
      vcard += `\nEMAIL:${contact.email}`;
    }
    
    contact.addresses?.forEach(address => {
      const type = address.label === 'Домашня' ? 'HOME' : 
                   address.label === 'Робоча' ? 'WORK' : 'OTHER';
      vcard += `\nADR;TYPE=${type}:;;${address.value};;;;`;
    });
    
    if (contact.website) {
      vcard += `\nURL:${contact.website}`;
    }
    
    if (contact.notes) {
      vcard += `\nNOTE:${contact.notes}`;
    }
    
    vcard += '\nEND:VCARD';
    return vcard;
  };

  const showQRCode = () => {
    setQrModalVisible(true);
  };

  const handleDelete = () => {
    setDeleteAlertVisible(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteContact(contactId);
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const handleShare = () => {
    setShareSheetVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >


        <View style={styles.header}>
          <Avatar name={displayName} avatar={contact.avatar} size={100} />
          
          <View style={styles.avatarActions}>
            <TouchableOpacity 
              style={[styles.avatarActionButton, styles.deleteButton]}
              onPress={handleDelete}
              activeOpacity={0.7}
            >
              <Icon name="trash-outline" size={22} color={theme.destructive} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.avatarActionButton}
              onPress={() => (navigation as any).navigate('EditContact', { contactId })}
              activeOpacity={0.7}
            >
              <Icon name="create-outline" size={22} color={theme.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.avatarActionButton}
              onPress={handleShare}
              activeOpacity={0.7}
            >
              <Icon name="share-outline" size={22} color={theme.primary} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.name}>{displayName}</Text>
          {contact.jobTitle && (
            <Text style={styles.jobTitle}>{contact.jobTitle}</Text>
          )}
        </View>

        {contact.phones?.map((phone, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardIcon}>
              <Icon name="call-outline" size={20} color={theme.primary} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>{phone.label}</Text>
              <Text style={styles.cardValue}>{phone.value}</Text>
            </View>
            <View style={styles.phoneActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => Linking.openURL(`tel:${phone.value}`)}
                activeOpacity={0.7}
              >
                <Icon name="call" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.actionButtonSecondary]}
                onPress={() => Linking.openURL(`sms:${phone.value}`)}
                activeOpacity={0.7}
              >
                <Icon name="chatbubble" size={20} color={theme.primary} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {contact.email && (
          <TouchableOpacity
            style={styles.card}
            onPress={() => Linking.openURL(`mailto:${contact.email}`)}
            activeOpacity={0.7}
          >
            <View style={styles.cardIcon}>
              <Icon name="mail-outline" size={20} color={theme.primary} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>{t('email')}</Text>
              <Text style={styles.cardValue}>{contact.email}</Text>
            </View>
            <Icon name="chevron-forward" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        )}

        {contact.birthday && (
          <View style={styles.card}>
            <View style={styles.cardIcon}>
              <Icon name="calendar-outline" size={20} color={theme.primary} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>{t('birthday')}</Text>
              <Text style={styles.cardValue}>{contact.birthday}</Text>
            </View>
          </View>
        )}

        {contact.addresses?.map((address, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardIcon}>
              <Icon name="location-outline" size={20} color={theme.primary} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>{address.label}</Text>
              <Text style={styles.cardValue}>{address.value}</Text>
            </View>
          </View>
        ))}

        {contact.website && (
          <TouchableOpacity
            style={styles.card}
            onPress={() => Linking.openURL(contact.website!)}
            activeOpacity={0.7}
          >
            <View style={styles.cardIcon}>
              <Icon name="globe-outline" size={20} color={theme.primary} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>{t('website')}</Text>
              <Text style={styles.cardValue}>{contact.website}</Text>
            </View>
            <Icon name="chevron-forward" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        )}

        {contact.notes && (
          <View style={styles.card}>
            <View style={styles.cardIcon}>
              <Icon name="document-text-outline" size={20} color={theme.primary} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>{t('notes')}</Text>
              <Text style={styles.notes}>{contact.notes}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <CustomAlert
        visible={deleteAlertVisible}
        title={t('deleteContactTitle')}
        message={t('deleteContactMessage')}
        buttons={[
          { text: t('cancel'), style: 'cancel' },
          { text: t('delete'), style: 'destructive', onPress: confirmDelete },
        ]}
        onClose={() => setDeleteAlertVisible(false)}
      />

      <CustomActionSheet
        visible={shareSheetVisible}
        title={t('shareContact')}
        message={t('selectShareMethod')}
        options={[
          {
            text: t('shareAsText'),
            onPress: shareAsText,
          },
          {
            text: t('showQRCode'),
            onPress: showQRCode,
          },
        ]}
        onClose={() => setShareSheetVisible(false)}
      />

      <Modal
        visible={qrModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setQrModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.qrModalOverlay}
          activeOpacity={1}
          onPress={() => setQrModalVisible(false)}
        >
          <View style={styles.qrModalContent}>
            <View style={styles.qrHeader}>
              <Text style={styles.qrTitle}>{t('qrCodeTitle')}</Text>
              <TouchableOpacity onPress={() => setQrModalVisible(false)}>
                <Icon name="close" size={28} color={theme.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.qrCodeContainer}>
              <QRCode
                value={generateVCard()}
                size={280}
                backgroundColor="white"
                color={theme.primary}
              />
            </View>
            
            <Text style={styles.qrMessage}>{t('qrCodeMessage')}</Text>
            <Text style={styles.qrName}>{displayName}</Text>
          </View>
        </TouchableOpacity>
      </Modal>
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
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
    position: 'relative',
  },
  avatarActions: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'column',
    gap: 8,
  },
  avatarActionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.card,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteButton: {
    backgroundColor: theme.card,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.text,
    marginTop: 16,
    textAlign: 'center',
  },
  jobTitle: {
    fontSize: 16,
    color: theme.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.card,
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 13,
    color: theme.textSecondary,
    marginBottom: 2,
  },
  cardValue: {
    fontSize: 17,
    color: theme.text,
    fontWeight: '500',
  },
  phoneActions: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 8,
    flexShrink: 0,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonSecondary: {
    backgroundColor: theme.backgroundSecondary,
    borderWidth: 1.5,
    borderColor: theme.primary,
  },
  notes: {
    fontSize: 15,
    color: theme.text,
    lineHeight: 22,
  },
  error: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    marginTop: 32,
  },
  qrModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  qrModalContent: {
    backgroundColor: theme.card,
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  qrHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  qrTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.text,
  },
  qrCodeContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  qrMessage: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  qrName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
    textAlign: 'center',
  },

});

export default ContactDetailsScreen;