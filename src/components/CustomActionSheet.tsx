import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { t } from '../i18n';

interface Option {
  text: string;
  onPress: () => void;
}

interface Props {
  visible: boolean;
  title: string;
  message?: string;
  options: Option[];
  onClose: () => void;
}

const CustomActionSheet: React.FC<Props> = ({ visible, title, message, options, onClose }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const cancelText = t('cancel');

  const handleOptionPress = (option: Option) => {
    option.onPress();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            {message && <Text style={styles.message}>{message}</Text>}
          </View>

          <ScrollView style={styles.optionsContainer}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.option,
                  index === options.length - 1 && styles.lastOption,
                ]}
                onPress={() => handleOptionPress(option)}
              >
                <Text style={styles.optionText}>{option.text}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>{cancelText}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: theme.card,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingBottom: 32,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
    borderTopWidth: 1,
    borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
  },
  header: {
    padding: 28,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.separator,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.text,
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  message: {
    fontSize: 15,
    color: theme.textSecondary,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
  optionsContainer: {
    maxHeight: 400,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  option: {
    backgroundColor: theme.backgroundSecondary,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
  },
  lastOption: {
    marginBottom: 0,
  },
  optionText: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.primary,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  cancelButton: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: theme.destructive,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: theme.destructive,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cancelText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});

export default CustomActionSheet;
