import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';
import CustomAlert from '../components/CustomAlert';

const FeedbackScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [alertConfig, setAlertConfig] = useState<any>(null);
  const styles = createStyles(theme);

  const handleSend = () => {
    if (!message.trim()) {
      setAlertConfig({
        title: t('error'),
        message: t('feedbackMessageRequired'),
        buttons: [{ text: t('ok') }],
      });
      return;
    }

    setAlertConfig({
      title: '💙',
      message: t('feedbackSent'),
      buttons: [{ text: t('ok') }],
    });
    
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>

        <View style={styles.header}>
          <Icon name="chatbubbles" size={64} color={theme.primary} />
          <Text style={styles.headerTitle}>{t('feedbackTitle')}</Text>
          <Text style={styles.headerSubtitle}>{t('feedbackSubtitle')}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('feedbackNameLabel')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('feedbackNamePlaceholder')}
              placeholderTextColor={theme.textSecondary}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('feedbackEmailLabel')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('feedbackEmailPlaceholder')}
              placeholderTextColor={theme.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {t('feedbackMessageLabel')} <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder={t('feedbackMessagePlaceholder')}
              placeholderTextColor={theme.textSecondary}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Icon name="send" size={20} color="#FFFFFF" />
            <Text style={styles.sendButtonText}>{t('feedbackSend')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.info}>
          <Icon name="information-circle-outline" size={24} color={theme.textSecondary} />
          <Text style={styles.infoText}>{t('feedbackInfo')}</Text>
        </View>
      </ScrollView>

      {alertConfig && (
        <CustomAlert
          visible={!!alertConfig}
          title={alertConfig.title}
          message={alertConfig.message}
          buttons={alertConfig.buttons}
          onClose={() => setAlertConfig(null)}
        />
      )}
    </SafeAreaView>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.text,
    marginTop: 16,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 8,
  },
  required: {
    color: theme.destructive,
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
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.primary,
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    gap: 8,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  info: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.backgroundSecondary,
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

export default FeedbackScreen;
