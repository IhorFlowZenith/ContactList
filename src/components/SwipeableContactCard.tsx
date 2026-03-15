import React, { useRef } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../contexts/ThemeContext';
import ContactCard from './ContactCard';
import { Contact } from '../types';

interface Props {
  contact: Contact;
  onPress: () => void;
  onLongPress: () => void;
  onToggleFavorite: () => void;
  onDelete: () => void;
  selectionMode?: boolean;
  isSelected?: boolean;
}

const SwipeableContactCard: React.FC<Props> = ({
  contact,
  onPress,
  onLongPress,
  onToggleFavorite,
  onDelete,
  selectionMode = false,
  isSelected = false,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const swipeableRef = useRef<Swipeable>(null);

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          swipeableRef.current?.close();
          onDelete();
        }}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Icon name="trash" size={24} color="#FFFFFF" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  // Вимикаємо swipe в режимі виділення
  if (selectionMode) {
    return (
      <ContactCard
        contact={contact}
        onPress={onPress}
        onLongPress={onLongPress}
        onToggleFavorite={onToggleFavorite}
        selectionMode={selectionMode}
        isSelected={isSelected}
      />
    );
  }

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      friction={2}
    >
      <ContactCard
        contact={contact}
        onPress={onPress}
        onLongPress={onLongPress}
        onToggleFavorite={onToggleFavorite}
        selectionMode={selectionMode}
        isSelected={isSelected}
      />
    </Swipeable>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    deleteButton: {
      backgroundColor: theme.destructive,
      justifyContent: 'center',
      alignItems: 'center',
      width: 80,
      borderRadius: 12,
      marginBottom: 8,
      marginLeft: 8,
    },
  });

export default SwipeableContactCard;
