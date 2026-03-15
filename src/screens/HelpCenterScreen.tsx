import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';

interface FAQItem {
  question: string;
  answer: string;
  icon: string;
}

const HelpCenterScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const styles = createStyles(theme);

  const faqData: FAQItem[] = [
    {
      question: t('faq1Question'),
      answer: t('faq1Answer'),
      icon: 'add-circle-outline',
    },
    {
      question: t('faq2Question'),
      answer: t('faq2Answer'),
      icon: 'create-outline',
    },
    {
      question: t('faq3Question'),
      answer: t('faq3Answer'),
      icon: 'trash-outline',
    },
    {
      question: t('faq4Question'),
      answer: t('faq4Answer'),
      icon: 'star-outline',
    },
    {
      question: t('faq5Question'),
      answer: t('faq5Answer'),
      icon: 'help-circle-outline',
    },
  ];

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>

        <View style={styles.header}>
          <Icon name="help-buoy" size={64} color={theme.primary} />
          <Text style={styles.headerTitle}>{t('helpCenterTitle')}</Text>
          <Text style={styles.headerSubtitle}>{t('helpCenterSubtitle')}</Text>
        </View>

        <View style={styles.faqSection}>
          {faqData.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.faqItem}
              onPress={() => toggleExpand(index)}
              activeOpacity={0.7}
            >
              <View style={styles.faqHeader}>
                <View style={styles.faqIconContainer}>
                  <Icon name={item.icon} size={24} color={theme.primary} />
                </View>
                <Text style={styles.faqQuestion}>{item.question}</Text>
                <Icon
                  name={expandedIndex === index ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color={theme.textSecondary}
                />
              </View>
              {expandedIndex === index && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{item.answer}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Icon name="chatbubbles-outline" size={48} color={theme.textSecondary} />
          <Text style={styles.footerText}>{t('helpCenterFooter')}</Text>
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
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  faqSection: {
    marginBottom: 32,
  },
  faqItem: {
    backgroundColor: theme.card,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  faqIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingLeft: 68,
  },
  faqAnswerText: {
    fontSize: 15,
    color: theme.textSecondary,
    lineHeight: 22,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 40,
  },
});

export default HelpCenterScreen;
