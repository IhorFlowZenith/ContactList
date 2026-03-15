import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Contact } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import { useTheme } from '../contexts/ThemeContext';
import { formatContactName } from '../utils/formatName';
import Avatar from './Avatar';

interface Props {
  contact: Contact;
  onPress: () => void;
  onLongPress?: () => void;
  onToggleFavorite: () => void;
  selectionMode?: boolean;
  isSelected?: boolean;
}

const ContactCard: React.FC<Props> = ({ 
  contact, 
  onPress, 
  onLongPress,
  onToggleFavorite,
  selectionMode = false,
  isSelected = false,
}) => {
  const { settings } = useSettings();
  const { theme } = useTheme();
  const displayName = formatContactName(contact, settings.nameFormat);
  const styles = createStyles(theme, isSelected);
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const checkboxAnim = useRef(new Animated.Value(0)).current;
  const favoriteAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (selectionMode) {
      Animated.parallel([
        Animated.spring(checkboxAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(favoriteAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(checkboxAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(favoriteAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
      ]).start();
    }
  }, [selectionMode]);

  useEffect(() => {
    if (isSelected) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.97,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
      ]).start();
    }
  }, [isSelected]);

  const checkboxScale = checkboxAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const checkboxOpacity = checkboxAnim;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity 
        style={styles.container} 
        onPress={onPress}
        onLongPress={onLongPress}
        delayLongPress={150}
        activeOpacity={0.7}
      >
        {selectionMode && (
          <Animated.View 
            style={[
              styles.checkbox,
              {
                opacity: checkboxOpacity,
                transform: [{ scale: checkboxScale }],
              },
            ]}
          >
            <Icon 
              name={isSelected ? 'checkmark-circle' : 'ellipse-outline'} 
              size={28} 
              color={isSelected ? theme.primary : theme.textSecondary} 
            />
          </Animated.View>
        )}
        <Avatar name={displayName} avatar={contact.avatar} />
        <View style={styles.info}>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.phone}>{contact.phones?.[0]?.value || ''}</Text>
        </View>
        {!selectionMode && (
          <Animated.View style={{ opacity: favoriteAnim, transform: [{ scale: favoriteAnim }] }}>
            <TouchableOpacity onPress={onToggleFavorite} style={styles.favoriteBtn}>
              <Icon 
                name={contact.isFavorite ? 'star' : 'star-outline'} 
                size={24} 
                color={contact.isFavorite ? theme.primary : theme.textSecondary} 
              />
            </TouchableOpacity>
          </Animated.View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const createStyles = (theme: any, isSelected: boolean = false) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: isSelected ? theme.backgroundSecondary : theme.card,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
  },
  phone: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 4,
  },
  favoriteBtn: {
    padding: 8,
  },
  checkbox: {
    marginRight: 12,
  },
});

export default ContactCard;
