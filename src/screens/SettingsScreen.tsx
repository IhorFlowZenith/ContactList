import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSettings } from '../contexts/SettingsContext';
import { useContacts } from '../contexts/ContactsContext';
import { useTheme } from '../contexts/ThemeContext';
import { exportContacts, pickAndImportFile } from '../services/importExport';
import { useTranslation } from '../hooks/useTranslation';
import CustomAlert from '../components/CustomAlert';
import CustomActionSheet from '../components/CustomActionSheet';
import ColorPicker from '../components/ColorPicker';

const packageJson = require('../../package.json');

const SettingsScreen = () => {
  const { settings, updateSettings } = useSettings();
  const { contacts, importContactsData } = useContacts();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [alertConfig, setAlertConfig] = useState<any>(null);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [themeSheetVisible, setThemeSheetVisible] = useState(false);
  const [languageSheetVisible, setLanguageSheetVisible] = useState(false);
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [exportFormatSheetVisible, setExportFormatSheetVisible] = useState(false);

  const styles = createStyles(theme);

  useEffect(() => {
    navigation.setOptions({
      title: t('settings'),
    });
  }, [navigation, t, settings.language]);

  const handleExportFormat = (format: 'json' | 'csv' | 'vcf') => {
    handleExportWithFormat(format);
  };

  const handleExportWithFormat = async (format: 'json' | 'csv' | 'vcf') => {
    try {
      await exportContacts(contacts, format);
    } catch (error: any) {
      console.error('Export error:', error);
      setAlertConfig({
        title: t('error'),
        message: error?.message || t('exportError'),
        buttons: [{ text: t('ok') }],
      });
    }
  };

  const handleExport = () => {
    setExportFormatSheetVisible(true);
  };

  const handleImport = async () => {
    try {
      const imported = await pickAndImportFile();
      if (imported.length === 0) {
        return;
      }
      importContactsData(imported);
      setAlertConfig({
        title: t('success'),
        message: t('importSuccess', { count: imported.length }),
        buttons: [{ text: t('ok') }],
      });
    } catch (error: any) {
      console.error('Import error:', error);
      setAlertConfig({
        title: t('error'),
        message: error?.message || t('importError'),
        buttons: [{ text: t('ok') }],
      });
    }
  };

  const handleNameFormatChange = () => {
    setActionSheetVisible(true);
  };

  const handleThemeChange = () => {
    setThemeSheetVisible(true);
  };

  const handleLanguageChange = () => {
    setLanguageSheetVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('general')}</Text>
        
        <TouchableOpacity style={styles.row} onPress={handleThemeChange}>
          <Text style={styles.label}>{t('theme')}</Text>
          <Text style={styles.value}>
            {settings.theme === 'auto' ? t('themeAuto') : settings.theme === 'dark' ? t('themeDark') : t('themeLight')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row} onPress={() => setColorPickerVisible(true)}>
          <Text style={styles.label}>{t('accentColor')}</Text>
          <View style={styles.colorPreview}>
            <View style={[styles.colorCircle, { backgroundColor: theme.primary }]} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row} onPress={handleLanguageChange}>
          <Text style={styles.label}>{t('language')}</Text>
          <Text style={styles.value}>{settings.language === 'uk' ? 'Українська' : 'English'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row} onPress={handleNameFormatChange}>
          <Text style={styles.label}>{t('nameFormat')}</Text>
          <Text style={styles.value}>
            {settings.nameFormat === 'firstLast' ? t('nameFormatFirstLast') : t('nameFormatLastFirst')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('privacy')}</Text>
        
        <TouchableOpacity style={styles.row} onPress={() => (navigation as any).navigate('Permissions')}>
          <Text style={styles.label}>{t('appPermissions')}</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('data')}</Text>
        
        <TouchableOpacity style={styles.row} onPress={handleExport}>
          <Text style={styles.label}>{t('exportContacts')}</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row} onPress={handleImport}>
          <Text style={styles.label}>{t('importFromFile')}</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('helpAndFeedback')}</Text>
        
        <TouchableOpacity style={styles.row} onPress={() => (navigation as any).navigate('HelpCenter')}>
          <Text style={styles.label}>{t('helpCenter')}</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row} onPress={() => (navigation as any).navigate('Feedback')}>
          <Text style={styles.label}>{t('sendFeedback')}</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('about')}</Text>
        
        <View style={styles.row}>
          <Text style={styles.label}>{t('version')}</Text>
          <Text style={styles.value}>{packageJson.version}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{t('developer')}</Text>
          <Text style={styles.value}>{settings.language === 'uk' ? 'Пелих Ігор' : 'Pelykh Ihor'}</Text>
        </View>

        <TouchableOpacity style={styles.row} onPress={() => (navigation as any).navigate('PrivacyPolicy')}>
          <Text style={styles.label}>{t('privacyPolicy')}</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row} onPress={() => (navigation as any).navigate('TermsOfUse')}>
          <Text style={styles.label}>{t('termsOfUse')}</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      {alertConfig && (
        <CustomAlert
          visible={!!alertConfig}
          title={alertConfig.title}
          message={alertConfig.message}
          buttons={alertConfig.buttons}
          onClose={() => setAlertConfig(null)}
        />
      )}

      <CustomActionSheet
        visible={actionSheetVisible}
        title={t('nameFormat')}
        message=""
        options={[
          {
            text: t('nameFormatFirstLast'),
            onPress: () => updateSettings({ nameFormat: 'firstLast' }),
          },
          {
            text: t('nameFormatLastFirst'),
            onPress: () => updateSettings({ nameFormat: 'lastFirst' }),
          },
        ]}
        onClose={() => setActionSheetVisible(false)}
      />

      <CustomActionSheet
        visible={themeSheetVisible}
        title={t('theme')}
        message={t('selectTheme')}
        options={[
          {
            text: t('autoTheme'),
            onPress: () => updateSettings({ theme: 'auto' }),
          },
          {
            text: t('themeLight'),
            onPress: () => updateSettings({ theme: 'light' }),
          },
          {
            text: t('themeDark'),
            onPress: () => updateSettings({ theme: 'dark' }),
          },
        ]}
        onClose={() => setThemeSheetVisible(false)}
      />

      <CustomActionSheet
        visible={languageSheetVisible}
        title={t('language')}
        message=""
        options={[
          {
            text: 'Українська',
            onPress: () => updateSettings({ language: 'uk' }),
          },
          {
            text: 'English',
            onPress: () => updateSettings({ language: 'en' }),
          },
        ]}
        onClose={() => setLanguageSheetVisible(false)}
      />

      <ColorPicker
        visible={colorPickerVisible}
        selectedColor={settings.accentColor || theme.primary}
        onSelectColor={(color) => updateSettings({ accentColor: color })}
        onClose={() => setColorPickerVisible(false)}
      />

      <CustomActionSheet
        visible={exportFormatSheetVisible}
        title={t('exportFormat')}
        message={t('exportFormatMessage')}
        options={[
          {
            text: t('exportJSON'),
            onPress: () => handleExportFormat('json'),
          },
          {
            text: t('exportCSV'),
            onPress: () => handleExportFormat('csv'),
          },
          {
            text: t('exportVCF'),
            onPress: () => handleExportFormat('vcf'),
          },
        ]}
        onClose={() => setExportFormatSheetVisible(false)}
      />
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
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 13,
    color: theme.textSecondary,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.card,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  label: {
    fontSize: 16,
    color: theme.text,
  },
  value: {
    fontSize: 16,
    color: theme.textSecondary,
  },
  arrow: {
    fontSize: 20,
    color: theme.textSecondary,
  },
  colorPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: theme.separator,
  },
});

export default SettingsScreen;
