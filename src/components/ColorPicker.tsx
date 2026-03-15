import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';

interface Props {
  visible: boolean;
  selectedColor: string;
  onSelectColor: (color: string) => void;
  onClose: () => void;
}

const COLORS = [
  { nameKey: 'colorBlue', value: '#0A84FF', lightValue: '#007AFF' },
  { nameKey: 'colorSky', value: '#64D2FF', lightValue: '#5AC8FA' },
  { nameKey: 'colorTurquoise', value: '#5DE6DE', lightValue: '#50E3C2' },
  { nameKey: 'colorSea', value: '#00B4D8', lightValue: '#0096C7' },
  
  { nameKey: 'colorPurple', value: '#BF5AF2', lightValue: '#AF52DE' },
  { nameKey: 'colorIndigo', value: '#5E5CE6', lightValue: '#5856D6' },
  { nameKey: 'colorLavender', value: '#B19CD9', lightValue: '#9B7EBD' },
  { nameKey: 'colorMagenta', value: '#D946EF', lightValue: '#C026D3' },
  
  { nameKey: 'colorPink', value: '#FF375F', lightValue: '#FF2D55' },
  { nameKey: 'colorRaspberry', value: '#FF006E', lightValue: '#E0005E' },
  { nameKey: 'colorCoral', value: '#FF6B9D', lightValue: '#FF5C8D' },
  { nameKey: 'colorPeach', value: '#FFB5A7', lightValue: '#FFA094' },
  
  { nameKey: 'colorRed', value: '#FF453A', lightValue: '#FF3B30' },
  { nameKey: 'colorCherry', value: '#DC143C', lightValue: '#C41E3A' },
  { nameKey: 'colorBurgundy', value: '#9D174D', lightValue: '#881337' },
  
  { nameKey: 'colorOrange', value: '#FF9F0A', lightValue: '#FF9500' },
  { nameKey: 'colorTangerine', value: '#FF8C42', lightValue: '#FF7A2F' },
  { nameKey: 'colorApricot', value: '#FFAA5C', lightValue: '#FF9A4A' },
  
  { nameKey: 'colorYellow', value: '#FFD60A', lightValue: '#FFCC00' },
  { nameKey: 'colorGold', value: '#FFB700', lightValue: '#FFA500' },
  { nameKey: 'colorLemon', value: '#FFF44F', lightValue: '#FFE600' },
  
  { nameKey: 'colorGreen', value: '#32D74B', lightValue: '#34C759' },
  { nameKey: 'colorMint', value: '#00D9A3', lightValue: '#00C48C' },
  { nameKey: 'colorEmerald', value: '#10B981', lightValue: '#059669' },
  { nameKey: 'colorLime', value: '#84CC16', lightValue: '#65A30D' },
  { nameKey: 'colorOlive', value: '#84A98C', lightValue: '#6B8E7A' },
  
  { nameKey: 'colorBrown', value: '#A0826D', lightValue: '#8B6F5B' },
  { nameKey: 'colorChocolate', value: '#7B3F00', lightValue: '#6B3500' },
  { nameKey: 'colorChestnut', value: '#954535', lightValue: '#7D3C2D' },
  
  { nameKey: 'colorGray', value: '#8E8E93', lightValue: '#8E8E93' },
  { nameKey: 'colorGraphite', value: '#636366', lightValue: '#48484A' },
];

const ColorPicker: React.FC<Props> = ({ visible, selectedColor, onSelectColor, onClose }) => {
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();
  const styles = createStyles(theme);

  const handleColorSelect = (color: typeof COLORS[0]) => {
    const colorValue = isDark ? color.value : color.lightValue;
    onSelectColor(colorValue);
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
            <Text style={styles.title}>{t('colorPickerTitle')}</Text>
            <Text style={styles.subtitle}>{t('colorPickerSubtitle')}</Text>
          </View>

          <ScrollView style={styles.colorsContainer}>
            <View style={styles.colorsGrid}>
              {COLORS.map((color, index) => {
                const colorValue = isDark ? color.value : color.lightValue;
                const isSelected = selectedColor === colorValue;
                
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.colorItem}
                    onPress={() => handleColorSelect(color)}
                  >
                    <View style={[
                      styles.colorCircle,
                      { backgroundColor: colorValue },
                      isSelected && styles.selectedCircle,
                    ]}>
                      {isSelected && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </View>
                    <Text style={styles.colorName}>{t(color.nameKey as any)}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>{t('close')}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: theme.overlay,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: theme.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '70%',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.separator,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  colorsContainer: {
    maxHeight: 400,
  },
  colorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 16,
    justifyContent: 'center',
  },
  colorItem: {
    alignItems: 'center',
    width: 80,
  },
  colorCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedCircle: {
    borderWidth: 3,
    borderColor: theme.text,
  },
  checkmark: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  colorName: {
    fontSize: 12,
    color: theme.textSecondary,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 12,
    marginHorizontal: 20,
    backgroundColor: theme.backgroundTertiary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textSecondary,
  },
});

export default ColorPicker;
