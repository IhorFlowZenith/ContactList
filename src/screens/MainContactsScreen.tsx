import React, { useState, useRef, useMemo } from 'react';
import { View, SectionList, StyleSheet, TouchableOpacity, Text, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import { useContacts } from '../contexts/ContactsContext';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';
import { Contact } from '../types';
import SwipeableContactCard from '../components/SwipeableContactCard';
import SearchBar from '../components/SearchBar';
import CustomAlert from '../components/CustomAlert';
import SkeletonLoader from '../components/SkeletonLoader';

const MainContactsScreen = () => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteAlertVisible, setDeleteAlertVisible] = useState(false);
  const { contacts, toggleFavorite, deleteContact, loading } = useContacts();
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const sectionListRef = useRef<SectionList>(null);
  const insets = useSafeAreaInsets();

  const styles = createStyles(theme, insets);
  
  const selectedIdsSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const filteredContacts = contacts
    .filter(c => {
      const phones = c.phones?.map(p => p.value).join(' ') || '';
      const matchesSearch = `${c.firstName} ${c.lastName} ${phones}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesTab = activeTab === 'all' || c.isFavorite;
      return matchesSearch && matchesTab;
    })
    .sort((a, b) => a.firstName.localeCompare(b.firstName, 'uk'));

  const groupedContacts = filteredContacts.reduce((acc, contact) => {
    const firstLetter = contact.firstName.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(contact);
    return acc;
  }, {} as Record<string, Contact[]>);

  const sortedLetters = Object.keys(groupedContacts).sort((a, b) => {
    const isUkrA = /[А-ЯІЇЄҐ]/.test(a);
    const isUkrB = /[А-ЯІЇЄҐ]/.test(b);
    const isEngA = /[A-Z]/.test(a);
    const isEngB = /[A-Z]/.test(b);
    const isNumA = /[0-9]/.test(a);
    const isNumB = /[0-9]/.test(b);

    if (isUkrA && !isUkrB) return -1;
    if (!isUkrA && isUkrB) return 1;
    if (isEngA && !isEngB && !isUkrB) return -1;
    if (!isEngA && isEngB && !isUkrA) return 1;
    if (isNumA && !isNumB) return 1;
    if (!isNumA && isNumB) return -1;
    
    return a.localeCompare(b);
  });

  const sections = sortedLetters.map(letter => ({
    title: letter,
    data: groupedContacts[letter],
  }));

  const title = activeTab === 'all' ? t('contacts') : t('favorites');
  const searchPlaceholder = t('searchContacts');

  const handleLongPress = (id: string) => {
    if (!selectionMode) {
      setSelectionMode(true);
      setSelectedIds([id]);
    }
  };

  const handlePress = (id: string) => {
    if (selectionMode) {
      // В режимі виділення - перемикаємо виділення
      setSelectedIds(prev => {
        const newSelection = prev.includes(id) 
          ? prev.filter(i => i !== id) 
          : [...prev, id];
        
        // Якщо виділення пусте - виходимо з режиму
        if (newSelection.length === 0) {
          setSelectionMode(false);
        }
        
        return newSelection;
      });
    } else {
      // Не в режимі виділення - переходимо до деталей
      (navigation as any).navigate('ContactDetails', { contactId: id });
    }
  };

  const handleCancelSelection = () => {
    setSelectionMode(false);
    setSelectedIds([]);
  };

  const handleDeleteSelected = () => {
    setDeleteAlertVisible(true);
  };

  const confirmDelete = async () => {
    try {
      await Promise.all(selectedIds.map(id => deleteContact(id)));
      setSelectionMode(false);
      setSelectedIds([]);
    } catch (error) {
      console.error('Error deleting contacts:', error);
    }
  };

  const handleSelectAll = () => {
    const allIds = filteredContacts.map(c => c.id);
    setSelectedIds(allIds);
  };

  const handleSwipeDelete = (id: string) => {
    setSelectedIds([id]);
    setDeleteAlertVisible(true);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <View style={styles.header}>
        {selectionMode ? (
          <>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleCancelSelection}
            >
              <Icon name="close" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={styles.title}>
              {selectedIds.length} {t('selected')}
            </Text>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={handleSelectAll}
              >
                <Icon name="checkmark-done" size={24} color={theme.text} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={handleDeleteSelected}
              >
                <Icon name="trash" size={24} color={theme.destructive} />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity
              style={styles.settingsBtn}
              onPress={() => (navigation as any).navigate('Settings')}
            >
              <Icon name="settings-outline" size={24} color={theme.text} />
            </TouchableOpacity>
          </>
        )}
      </View>

      <SearchBar value={search} onChangeText={setSearch} placeholder={searchPlaceholder} />

      {loading ? (
        <SkeletonLoader count={10} />
      ) : (
        <SectionList
          ref={sectionListRef}
          sections={sections}
          keyExtractor={item => item.id}
          extraData={[selectionMode, selectedIds]}
          renderItem={({ item }) => {
            const isSelected = selectedIdsSet.has(item.id);
            return (
              <SwipeableContactCard
                contact={item}
                onPress={() => handlePress(item.id)}
                onLongPress={() => handleLongPress(item.id)}
                onToggleFavorite={() => toggleFavorite(item.id)}
                onDelete={() => handleSwipeDelete(item.id)}
                selectionMode={selectionMode}
                isSelected={isSelected}
              />
            );
          }}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{title}</Text>
            </View>
          )}
          contentContainerStyle={styles.list}
          stickySectionHeadersEnabled={false}
          onScrollToIndexFailed={() => {}}
        />
      )}

      {!selectionMode && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => (navigation as any).navigate('EditContact', {})}
        >
          <Icon name="add" size={32} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            {t('contacts')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
          onPress={() => setActiveTab('favorites')}
        >
          <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>
            {t('favorites')}
          </Text>
        </TouchableOpacity>
      </View>

      <CustomAlert
        visible={deleteAlertVisible}
        title={t('deleteContactTitle')}
        message={selectedIds.length === 1 ? t('deleteContactMessage') : `${t('deleteMultipleContactsMessage')} ${selectedIds.length} ${t('contacts').toLowerCase()}?`}
        buttons={[
          { text: t('cancel'), style: 'cancel' },
          { text: t('delete'), style: 'destructive', onPress: confirmDelete },
        ]}
        onClose={() => setDeleteAlertVisible(false)}
      />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const createStyles = (theme: any, insets: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.text,
    flex: 1,
    textAlign: 'center',
  },
  settingsBtn: {
    padding: 8,
  },
  headerButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 100 + insets.bottom,
  },
  sectionHeader: {
    backgroundColor: theme.background,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.primary,
    textTransform: 'uppercase',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 90 + insets.bottom,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  tabBar: {
    position: 'absolute',
    bottom: 20 + insets.bottom,
    left: 20,
    right: 20,
    flexDirection: 'row',
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: theme.backgroundTertiary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 16,
    color: theme.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: theme.text,
  },
});

export default MainContactsScreen;
