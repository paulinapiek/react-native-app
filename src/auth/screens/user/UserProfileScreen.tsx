// src/auth/screens/user/UserProfileScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  Image,
  View as ReactNativeView,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../context/ThemeContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ThemedView from '../../../components/ThemedView';
import ThemedText from '../../../components/ThemedText';
import ThemedButton from '../../../components/ThemedButton';
import { RootStackParamList, UserProfileData } from '../../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const getStudentProfile = async (userId: string): Promise<Partial<UserProfileData> | null> => {
  console.log(`[UserProfileScreen/getStudentProfile] Fetching profile for userId: ${userId}`);
  try {
    const userDocRef = firestore().collection('studentProfiles').doc(userId);
    const docSnap = await userDocRef.get();

    // @ts-ignore
    if (docSnap.exists) {
      console.log("[UserProfileScreen/getStudentProfile] Document data:", docSnap.data());
      return docSnap.data() as Partial<UserProfileData>;
    } else {
      console.log("[UserProfileScreen/getStudentProfile] No such document for user:", userId);
      return null;
    }
  } catch (error) {
    console.error("[UserProfileScreen/getStudentProfile] Error fetching student profile: ", error);
    throw error;
  }
};

type UserProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'UserProfile'>;

const UserProfileScreen = () => {
  const { t } = useTranslation();
  const { theme: currentUITheme, isLoadingTheme: isThemeLoading } = useTheme();
  const navigation = useNavigation<UserProfileScreenNavigationProp>();

  const [profile, setProfile] = useState<Partial<UserProfileData> | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const loadUserProfile = useCallback(async () => {
    setIsLoadingData(true);
    console.log('[UserProfileScreen/loadUserProfile] Loading profile data...');
    const currentUser = auth().currentUser;

    if (currentUser) {
      try {
        const userDataFromDb = await getStudentProfile(currentUser.uid);
        console.log('[UserProfileScreen/loadUserProfile] Data from DB (getStudentProfile):', userDataFromDb);

        const displayName = currentUser.displayName || "";
        const nameParts = displayName.split(" ");
        const firstNameFromAuth = nameParts[0] || undefined;
        const lastNameFromAuth = nameParts.length > 1 ? nameParts.slice(1).join(" ") : undefined;

        const combinedProfile: Partial<UserProfileData> = {
          uid: currentUser.uid,
          email: currentUser.email || undefined,
          firstName: userDataFromDb?.firstName || firstNameFromAuth || undefined,
          lastName: userDataFromDb?.lastName || lastNameFromAuth || undefined,
          albumNumber: userDataFromDb?.albumNumber || undefined,
          profileImageUri: userDataFromDb?.profileImageUri || currentUser.photoURL || undefined,
          studyYear: userDataFromDb?.studyYear,
          studyMode: userDataFromDb?.studyMode,
          studyModule: userDataFromDb?.studyModule,
          birthDate: userDataFromDb?.birthDate,
        };
        setProfile(combinedProfile);
        console.log('[UserProfileScreen/loadUserProfile] Combined profile set:', combinedProfile);
      } catch (error) {
        console.error("[UserProfileScreen/loadUserProfile] Error loading user profile from DB:", error);
        setProfile({
          uid: currentUser.uid,
          email: currentUser.email || undefined,
          firstName: currentUser.displayName?.split(' ')[0] || undefined,
          lastName: currentUser.displayName?.split(' ').slice(1).join(' ') || undefined,
        });
      } finally {
        setIsLoadingData(false);
      }
    } else {
      console.warn("[UserProfileScreen/loadUserProfile] No authenticated user found.");
      setProfile({});
      setIsLoadingData(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      console.log("[UserProfileScreen] Screen focused, calling loadUserProfile.");
      loadUserProfile();
    }, [loadUserProfile])
  );

  if (isThemeLoading || isLoadingData || !currentUITheme || profile === null) {
    const fallbackBackgroundColor = currentUITheme?.background || '#f4f6f8';
    const fallbackPrimaryColor = currentUITheme?.primary || '#6dab3c';
    return (
      <ReactNativeView style={[styles.loadingContainer, { backgroundColor: fallbackBackgroundColor }]}>
        <ActivityIndicator size="large" color={fallbackPrimaryColor} />
      </ReactNativeView>
    );
  }

  const placeholderText = `(${t('userProfile.pleaseComplete', 'uzupełnij*')})`;

  const renderProfileField = (labelKey: string, value: string | undefined | null) => (
    <ReactNativeView style={[styles.fieldContainer, { borderColor: currentUITheme.separator }]}>
      <ThemedText variant="label" style={styles.label}>{t(labelKey)}:</ThemedText>
      <ThemedText variant="p" style={styles.valueText}>
        {value && value.trim() !== '' ? value : <ThemedText style={[styles.placeholderText, { color: currentUITheme.secondaryText }]}>{placeholderText}</ThemedText>}
      </ThemedText>
    </ReactNativeView>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {profile.profileImageUri ? (
          <Image source={{ uri: profile.profileImageUri }} style={[styles.profileImageDisplay]} />
        ) : (
          <ReactNativeView style={[styles.profileImageDisplay, styles.profileImagePlaceholder, { backgroundColor: currentUITheme.separator, borderColor: currentUITheme.separator }]}>
            <FontAwesome5 name="user-circle" size={80} color={currentUITheme.secondaryText} />
          </ReactNativeView>
        )}

        {renderProfileField('userProfile.email', profile.email)}
        {renderProfileField('userProfile.firstName', profile.firstName)}
        {renderProfileField('userProfile.lastName', profile.lastName)}
        {renderProfileField('userProfile.albumNumber', profile.albumNumber)}
        {renderProfileField('userProfile.studyYear', profile.studyYear)}
        {renderProfileField('userProfile.studyMode', profile.studyMode)}
        {renderProfileField('userProfile.studyModule', profile.studyModule)}
        {renderProfileField('userProfile.birthDate', profile.birthDate)}

        <ThemedButton
          title={t('userProfile.editButton', 'Edytuj Profil')}
          onPress={() => {
            const profileToSend = profile || {};
            navigation.navigate('EditProfile', { currentProfile: profileToSend });
          }}
          type="primary"
          style={styles.actionButton}
          leftIcon={<FontAwesome5 name="user-edit" size={16} color={currentUITheme.buttonText} />}
        />
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 30, paddingTop: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  profileImageDisplay: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImagePlaceholder: {
    borderWidth: 1,
  },
  fieldContainer: {
    marginBottom: 18,
    borderBottomWidth: 1,
    paddingBottom: 12,
  },
  label: {
    marginBottom: 4,
    fontWeight: '500',
  },
  valueText: {
    fontSize: 17,
  },
  placeholderText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  actionButton: {
    marginTop: 30,
  },
});

export default UserProfileScreen;
