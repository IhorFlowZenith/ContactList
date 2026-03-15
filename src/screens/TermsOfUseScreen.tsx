import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';

const TermsOfUseScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>

        <View style={styles.header}>
          <Icon name="document-text" size={64} color={theme.primary} />
          <Text style={styles.headerTitle}>{t('termsTitle')}</Text>
          <Text style={styles.headerDate}>{t('termsDate')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('termsSection1Title')}</Text>
          <Text style={styles.text}>{t('termsSection1Text')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('termsSection2Title')}</Text>
          <Text style={styles.text}>{t('termsSection2Text')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('termsSection3Title')}</Text>
          <Text style={styles.text}>{t('termsSection3Text')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('termsSection4Title')}</Text>
          <Text style={styles.text}>{t('termsSection4Text')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('termsSection5Title')}</Text>
          <Text style={styles.text}>{t('termsSection5Text')}</Text>
        </View>

        <View style={styles.footer}>
          <Icon name="happy" size={32} color={theme.primary} />
          <Text style={styles.footerText}>{t('termsFooter')}</Text>
        </View>
      </ScrollView>
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
    textAlign: 'center',
  },
  headerDate: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: theme.textSecondary,
    lineHeight: 24,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'center',
    marginTop: 12,
  },
});

export default TermsOfUseScreen;
