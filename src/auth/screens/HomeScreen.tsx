// src/auth/screens/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, View as ReactNativeView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText';
import { UserProfileData } from '../../navigation/types';

// Przykładowy plan zajęć dla Informatyki Stosowanej
const sampleSchedule = [
  { day: 'Poniedziałek', time: '8:00-9:30', subject: 'Programowanie obiektowe', room: 'A-101', type: 'wykład' },
  { day: 'Poniedziałek', time: '10:00-11:30', subject: 'Bazy danych', room: 'B-205', type: 'laboratorium' },
  { day: 'Wtorek', time: '8:00-9:30', subject: 'Matematyka dyskretna', room: 'A-203', type: 'wykład' },
  { day: 'Wtorek', time: '10:00-11:30', subject: 'Systemy operacyjne', room: 'C-301', type: 'laboratorium' },
  { day: 'Środa', time: '9:00-10:30', subject: 'Inżynieria oprogramowania', room: 'A-101', type: 'wykład' },
  { day: 'Środa', time: '11:00-12:30', subject: 'Programowanie obiektowe', room: 'B-105', type: 'laboratorium' },
  { day: 'Czwartek', time: '8:00-9:30', subject: 'Sieci komputerowe', room: 'C-201', type: 'wykład' },
  { day: 'Czwartek', time: '10:00-11:30', subject: 'Algorytmy i struktury danych', room: 'B-301', type: 'laboratorium' },
  { day: 'Piątek', time: '9:00-10:30', subject: 'Grafika komputerowa', room: 'A-305', type: 'wykład' },
  { day: 'Piątek', time: '11:00-12:30', subject: 'Projekt zespołowy', room: 'B-201', type: 'projekt' },
];

const HomeScreen = () => {
  const { t } = useTranslation();
  const { theme: currentUITheme, isLoadingTheme } = useTheme();
  const [userProfile, setUserProfile] = useState<Partial<UserProfileData> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isScheduleExpanded, setIsScheduleExpanded] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        setIsLoading(false);
        return;
      }

      const userDocRef = firestore().collection('studentProfiles').doc(currentUser.uid);
      const docSnap = await userDocRef.get();

     // @ts-ignore
    if (docSnap.exists) {
      const profileData = docSnap.data() as Partial<UserProfileData>;
      setUserProfile({
        ...profileData,
        email: currentUser.email,
      });
    } else {
      setUserProfile({
        email: currentUser.email,
        firstName: currentUser.displayName?.split(' ')[0] || null,
        lastName: currentUser.displayName?.split(' ')[1] || null,
      });
    }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDisplayName = () => {
    if (userProfile?.firstName && userProfile?.lastName) {
      return `${userProfile.firstName} ${userProfile.lastName}`;
    }
    if (userProfile?.firstName) {
      return userProfile.firstName;
    }
    return t('homeScreen.defaultName', 'Studencie');
  };

  const toggleSchedule = () => {
    setIsScheduleExpanded(!isScheduleExpanded);
  };

  const getSubjectTypeColor = (type: string) => {
    switch (type) {
      case 'wykład': return currentUITheme.primary;
      case 'laboratorium': return currentUITheme.accent;
      case 'projekt': return currentUITheme.secondary;
      default: return currentUITheme.text;
    }
  };

  if (isLoadingTheme || !currentUITheme || isLoading) {
    const fallbackBackgroundColor = currentUITheme?.background || '#f4f6f8';
    const fallbackPrimaryColor = currentUITheme?.primary || '#6dab3c';
    return (
      <ReactNativeView style={[styles.loadingContainer, { backgroundColor: fallbackBackgroundColor }]}>
        <ActivityIndicator size="large" color={fallbackPrimaryColor} />
      </ReactNativeView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ReactNativeView style={styles.welcomeSection}>
          <ThemedText variant="h2" style={styles.welcomeTitle}>
            {t('homeScreen.welcome', 'Witaj')} {getDisplayName()}!
          </ThemedText>
        </ReactNativeView>
        <ReactNativeView style={[styles.infoCard, { backgroundColor: currentUITheme.card, borderColor: currentUITheme.separator }]}>
          <ThemedText variant="h3" style={styles.cardTitle}>
            {t('homeScreen.studentInfo', 'Informacje o studencie')}
          </ThemedText>
          <ReactNativeView style={styles.infoRow}>
            <FontAwesome5 name="id-badge" size={16} color={currentUITheme.primary} style={styles.infoIcon} />
            <ThemedText variant="p" style={styles.infoLabel}>
              {t('homeScreen.albumNumber', 'Nr albumu')}:
            </ThemedText>
            <ThemedText variant="p" style={[styles.infoValue, { color: currentUITheme.primary }]}>
              {userProfile?.albumNumber || t('homeScreen.notProvided', 'nie podano')}
            </ThemedText>
          </ReactNativeView>
          <ReactNativeView style={styles.infoRow}>
            <FontAwesome5 name="graduation-cap" size={16} color={currentUITheme.primary} style={styles.infoIcon} />
            <ThemedText variant="p" style={styles.infoLabel}>
              {t('homeScreen.studyYear', 'Rok studiów')}:
            </ThemedText>
            <ThemedText variant="p" style={[styles.infoValue, { color: currentUITheme.primary }]}>
              {userProfile?.studyYear || t('homeScreen.notProvided', 'nie podano')}
            </ThemedText>
          </ReactNativeView>
          <ReactNativeView style={styles.infoRow}>
            <FontAwesome5 name="clock" size={16} color={currentUITheme.primary} style={styles.infoIcon} />
            <ThemedText variant="p" style={styles.infoLabel}>
              {t('homeScreen.studyMode', 'Tryb studiów')}:
            </ThemedText>
            <ThemedText variant="p" style={[styles.infoValue, { color: currentUITheme.primary }]}>
              {userProfile?.studyMode || t('homeScreen.notProvided', 'nie podano')}
            </ThemedText>
          </ReactNativeView>
        </ReactNativeView>

        <ReactNativeView style={[styles.scheduleCard, { backgroundColor: currentUITheme.card, borderColor: currentUITheme.separator }]}>
          <TouchableOpacity 
            style={styles.scheduleHeader} 
            onPress={toggleSchedule}
            activeOpacity={0.7}
          >
            <ReactNativeView style={styles.scheduleHeaderContent}>
              <FontAwesome5 name="calendar-alt" size={20} color={currentUITheme.primary} style={styles.scheduleIcon} />
              <ThemedText variant="h3" style={styles.cardTitle}>
                {t('homeScreen.schedule', 'Plan zajęć')}
              </ThemedText>
            </ReactNativeView>
            <FontAwesome5 
              name={isScheduleExpanded ? "chevron-up" : "chevron-down"} 
              size={16} 
              color={currentUITheme.secondaryText} 
            />
          </TouchableOpacity>

          {isScheduleExpanded && (
            <ReactNativeView style={styles.scheduleContent}>
              <ThemedText variant="caption" style={[styles.scheduleSubtitle, { color: currentUITheme.secondaryText }]}>
                {t('homeScreen.scheduleSubtitle', 'Informatyka Stosowana - Studia Dzienne')}
              </ThemedText>
              {sampleSchedule.map((item, index) => (
                <ReactNativeView
                  key={index}
                  style={[styles.scheduleItem, { borderLeftColor: getSubjectTypeColor(item.type) }]}
                >
                  <ReactNativeView style={styles.scheduleItemHeader}>
                    <ThemedText variant="label" style={styles.scheduleDay}>
                      {item.day}
                    </ThemedText>
                    <ThemedText variant="caption" style={[styles.scheduleTime, { color: currentUITheme.secondaryText }]}>
                      {item.time}
                    </ThemedText>
                  </ReactNativeView>
                  <ThemedText variant="p" style={styles.scheduleSubject}>
                    {item.subject}
                  </ThemedText>
                  <ReactNativeView style={styles.scheduleDetails}>
                    <ThemedText variant="caption" style={[styles.scheduleRoom, { color: currentUITheme.secondaryText }]}>
                      Sala: {item.room}
                    </ThemedText>
                    <ThemedText 
                      variant="caption" 
                      style={[styles.scheduleType, { color: getSubjectTypeColor(item.type) }]}
                    >
                      {item.type}
                    </ThemedText>
                  </ReactNativeView>
                </ReactNativeView>
              ))}
            </ReactNativeView>
          )}
        </ReactNativeView>

      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 30,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  infoCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  cardTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 12,
    width: 20,
  },
  infoLabel: {
    flex: 1,
    fontWeight: '500',
  },
  infoValue: {
    fontWeight: 'bold',
  },
  scheduleCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  scheduleHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleIcon: {
    marginRight: 12,
  },
  scheduleContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  scheduleSubtitle: {
    marginBottom: 16,
    fontStyle: 'italic',
  },
  scheduleItem: {
    borderLeftWidth: 4,
    paddingLeft: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  scheduleItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  scheduleDay: {
    fontWeight: 'bold',
  },
  scheduleTime: {
    fontSize: 12,
  },
  scheduleSubject: {
    fontWeight: '500',
    marginBottom: 4,
  },
  scheduleDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scheduleRoom: {
    fontSize: 12,
  },
  scheduleType: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default HomeScreen;
