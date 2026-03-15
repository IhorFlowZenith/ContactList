import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
  count?: number;
}

const SkeletonLoader: React.FC<Props> = ({ count = 8 }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <Animated.View key={index} style={[styles.card, { opacity }]}>
          <View style={styles.avatar} />
          <View style={styles.content}>
            <View style={styles.nameLine} />
            <View style={styles.phoneLine} />
          </View>
          <View style={styles.icon} />
        </Animated.View>
      ))}
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      padding: 16,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: theme.card,
      borderRadius: 12,
      marginBottom: 8,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.backgroundSecondary,
    },
    content: {
      flex: 1,
      marginLeft: 12,
    },
    nameLine: {
      width: '60%',
      height: 16,
      backgroundColor: theme.backgroundSecondary,
      borderRadius: 4,
      marginBottom: 8,
    },
    phoneLine: {
      width: '40%',
      height: 14,
      backgroundColor: theme.backgroundSecondary,
      borderRadius: 4,
    },
    icon: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.backgroundSecondary,
    },
  });

export default SkeletonLoader;
