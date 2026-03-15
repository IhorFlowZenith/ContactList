export const createLightTheme = (accentColor?: string) => ({
  background: '#F2F2F7',
  backgroundSecondary: '#FFFFFF',
  backgroundTertiary: '#E5E5EA',
  text: '#000000',
  textSecondary: '#8E8E93',
  textTertiary: '#C7C7CC',
  primary: accentColor || '#007AFF',
  destructive: '#FF3B30',
  separator: '#C6C6C8',
  card: '#FFFFFF',
  cardBorder: '#E5E5EA',
  inputBackground: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.4)',
});

export const createDarkTheme = (accentColor?: string) => ({
  background: '#000000',
  backgroundSecondary: '#1C1C1E',
  backgroundTertiary: '#2C2C2E',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  textTertiary: '#48484A',
  primary: accentColor || '#0A84FF',
  destructive: '#FF453A',
  separator: '#38383A',
  card: '#1C1C1E',
  cardBorder: '#38383A',
  inputBackground: '#1C1C1E',
  overlay: 'rgba(0, 0, 0, 0.7)',
});

export type Theme = ReturnType<typeof createLightTheme>;