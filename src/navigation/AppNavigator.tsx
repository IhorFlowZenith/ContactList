import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../contexts/ThemeContext';
import { t } from '../i18n';
import MainContactsScreen from '../screens/MainContactsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ContactDetailsScreen from '../screens/ContactDetailsScreen';
import EditContactScreen from '../screens/EditContactScreen';
import PermissionsScreen from '../screens/PermissionsScreen';
import HelpCenterScreen from '../screens/HelpCenterScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import TermsOfUseScreen from '../screens/TermsOfUseScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { theme } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
          headerBackTitle: t('cancel'),
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="MainContacts"
          component={MainContactsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: t('settings') }}
        />
        <Stack.Screen
          name="ContactDetails"
          component={ContactDetailsScreen}
          options={{ title: t('contactDetails') }}
        />
        <Stack.Screen
          name="EditContact"
          component={EditContactScreen}
          options={({ route }) => ({
            title: (route.params as any)?.contactId ? t('editContact') : t('addContact'),
          })}
        />
        <Stack.Screen
          name="Permissions"
          component={PermissionsScreen}
          options={{ title: t('permissions') }}
        />
        <Stack.Screen
          name="HelpCenter"
          component={HelpCenterScreen}
          options={{ title: t('helpCenter') }}
        />
        <Stack.Screen
          name="Feedback"
          component={FeedbackScreen}
          options={{ title: t('sendFeedback') }}
        />
        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicyScreen}
          options={{ title: t('privacyPolicy') }}
        />
        <Stack.Screen
          name="TermsOfUse"
          component={TermsOfUseScreen}
          options={{ title: t('termsOfUse') }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;