// src/auth/screens/EditProfileScreen.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  View as ReactNativeView,
  Alert,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../context/ThemeContext';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { launchImageLibrary, ImagePickerResponse, PhotoQuality, MediaType, Asset } from 'react-native-image-picker';
import { uploadProfileImageToFirebase, updateStudentProfileInFirestore } from '../../services/profileService';

import ThemedView from '../../../components/ThemedView';
import ThemedText from '../../../components/ThemedText';
import ThemedButton from '../../../components/ThemedButton';
import { RootStackParamList, UserProfileData } from '../../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';

type EditProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditProfile'>;
type EditProfileScreenRouteProp = RouteProp<RootStackParamList, 'EditProfile'>;

const EditProfileScreen = () => {
  const { t } = useTranslation();
  const { theme: currentUITheme, isLoadingTheme: isThemeLoading } = useTheme();
  const navigation = useNavigation<EditProfileScreenNavigationProp>();
  const route = useRoute<EditProfileScreenRouteProp>();
  const initialProfileData = useMemo(() => route.params?.currentProfile || {}, [route.params?.currentProfile]);

  const [pickerImageUri, setPickerImageUri] = useState<string | null | undefined>(initialProfileData.profileImageUri);
  const [pickerImageType, setPickerImageType] = useState<string | undefined>(undefined);
  const [firstName, setFirstName] = useState(initialProfileData.firstName || '');
  const [lastName, setLastName] = useState(initialProfileData.lastName || '');
  const [albumNumber, setAlbumNumber] = useState(initialProfileData.albumNumber || '');
  const [studyYear, setStudyYear] = useState(initialProfileData.studyYear || '');
  const [studyMode, setStudyMode] = useState(initialProfileData.studyMode || '');
  const [studyModule, setStudyModule] = useState(initialProfileData.studyModule || '');
  const [birthDate, setBirthDate] = useState(initialProfileData.birthDate || '');
  const emailToDisplay = initialProfileData.email || '---';
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: t('editProfile.screenTitle', 'Edytuj Profil') });
  }, [navigation, t]);

  const requestStoragePermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const permissionToRequest = Platform.Version >= 33 
            ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES 
            : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

        const granted = await PermissionsAndroid.request(
          permissionToRequest,
          {
            title: t('permissions.storageTitle', "Pozwolenie na dostęp do galerii"),
            message: t('permissions.storageMessage', "Aplikacja potrzebuje dostępu do Twoich zdjęć, abyś mógł je wybrać."),
            buttonNeutral: t('permissions.askMeLater', "Zapytaj później"),
            buttonNegative: t('common.cancel', "Anuluj"),
            buttonPositive: t('common.ok', "OK")
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("[EditProfileScreen] Storage permission granted");
          return true;
        } else {
          console.log("[EditProfileScreen] Storage permission denied");
          return false;
        }
      } catch (err) {
        console.warn("[EditProfileScreen] Storage permission request error:", err);
        return false;
      }
    }
    return true;
  }, [t]);

  const handleChoosePhoto = useCallback(async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert(t('common.error'), t('permissions.storageNeeded', "Aby wybrać zdjęcie, potrzebne jest pozwolenie na dostęp do galerii."));
      return;
    }

    const options = { mediaType: 'photo' as MediaType, quality: 0.7 as PhotoQuality, includeBase64: false };
    try {
      const result: ImagePickerResponse = await new Promise((resolve, reject) => {
        launchImageLibrary(options, (response) => {
          if (response.didCancel) { resolve(response); }
          else if (response.errorCode) { reject(new Error(response.errorMessage || 'ImagePicker Error')); }
          else { resolve(response); }
        });
      });
      if (result.didCancel) { console.log('[EditProfileScreen] User cancelled image picker'); return; }
      const firstAsset: Asset | undefined = result.assets && result.assets[0];
      if (firstAsset && firstAsset.uri) {
        console.log('[EditProfileScreen] Image picked. URI:', firstAsset.uri, 'Type:', firstAsset.type, 'FileName:', firstAsset.fileName);
        setPickerImageUri(firstAsset.uri);
        setPickerImageType(firstAsset.type);
      } else {
        console.warn('[EditProfileScreen] No image URI found in picker result:', result);
      }
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || t('editProfile.photoPickerError'));
    }
  }, [t, requestStoragePermission]);

  const handleSaveProfile = useCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);
    const currentUser = auth().currentUser;
    if (!currentUser) {
      Alert.alert(t('common.error'), "Użytkownik niezalogowany.");
      setIsSaving(false);
      return;
    }
    let finalImageUriToStoreInFirestore: string | null | undefined = pickerImageUri;
    try {
      const isNewImagePicked = pickerImageUri && pickerImageUri !== initialProfileData.profileImageUri;
      if (isNewImagePicked && pickerImageUri) {
        console.log('[EditProfileScreen] New image picked, attempting upload. Picker URI:', pickerImageUri);
        finalImageUriToStoreInFirestore = await uploadProfileImageToFirebase(currentUser.uid, pickerImageUri, pickerImageType);
      } else if (pickerImageUri === null && initialProfileData.profileImageUri !== null) {
        finalImageUriToStoreInFirestore = null;
      } else if (!isNewImagePicked) {
        finalImageUriToStoreInFirestore = initialProfileData.profileImageUri;
      }
      const dataToSave: Partial<UserProfileData> = {
        firstName: firstName.trim() === '' ? null : firstName.trim(),
        lastName: lastName.trim() === '' ? null : lastName.trim(),
        albumNumber: albumNumber.trim() === '' ? null : albumNumber.trim(),
        studyYear: studyYear.trim() === '' ? null : studyYear.trim(),
        studyMode: studyMode.trim() === '' ? null : studyMode.trim(),
        studyModule: studyModule.trim() === '' ? null : studyModule.trim(),
        birthDate: birthDate.trim() === '' ? null : birthDate.trim(),
        profileImageUri: finalImageUriToStoreInFirestore,
      };
      await updateStudentProfileInFirestore(currentUser.uid, dataToSave);
      Alert.alert(t('common.success'), t('editProfile.saveSuccess'));
      navigation.goBack();
    } catch (error: any) {
      const errorMessage = error.message || t('editProfile.saveError');
      Alert.alert(t('common.error'), errorMessage);
    } finally {
      setIsSaving(false);
    }
  }, [
    isSaving, t, navigation, pickerImageUri, pickerImageType, firstName, lastName, albumNumber,
    studyYear, studyMode, studyModule, birthDate, initialProfileData
  ]);

  if (isThemeLoading || !currentUITheme) {
    const fallbackBackgroundColor = currentUITheme?.background || '#f4f6f8';
    const fallbackPrimaryColor = currentUITheme?.primary || '#6dab3c';
    return (
      <ReactNativeView style={[styles.loadingContainer, { backgroundColor: fallbackBackgroundColor }]}>
        <ActivityIndicator size="large" color={fallbackPrimaryColor} />
      </ReactNativeView>
    );
  }

  const renderEditableField = (labelKey: string, value: string, setter: (text: string) => void, placeholderKey: string, keyboardType: TextInput['props']['keyboardType'] = 'default', autoCapitalize: TextInput['props']['autoCapitalize'] = 'sentences') => (
    <>
      <ThemedText variant="label" style={styles.label}>{t(labelKey)}</ThemedText>
      <TextInput
        style={[styles.input, { backgroundColor: currentUITheme.inputBackground, color: currentUITheme.text, borderColor: currentUITheme.inputBorder }]}
        value={value}
        onChangeText={setter}
        placeholder={t(placeholderKey)}
        placeholderTextColor={currentUITheme.placeholderText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={[styles.photoPickerContainer, { borderColor: currentUITheme.separator }]} onPress={handleChoosePhoto}>
          {pickerImageUri ? (
            <Image source={{ uri: pickerImageUri }} style={styles.profileImage} />
          ) : (
            <ReactNativeView style={[styles.profileImagePlaceholder, { backgroundColor: currentUITheme.separator }]}>
              <FontAwesome5 name="camera" size={40} color={currentUITheme.secondaryText} />
              <ThemedText variant="caption" style={{ marginTop: 8, color: currentUITheme.secondaryText }}>
                {t('editProfile.addProfilePhoto')}
              </ThemedText>
            </ReactNativeView>
          )}
        </TouchableOpacity>
        <ThemedText variant="label" style={styles.label}>{t('userProfile.emailLabel', 'E-mail')}:</ThemedText>
        <ThemedText variant="p" style={[styles.emailDisplay, { color: currentUITheme.secondaryText, borderBottomColor: currentUITheme.separator }]}>{emailToDisplay}</ThemedText>
        {renderEditableField('editProfile.firstName', firstName, setFirstName, 'editProfile.firstNamePlaceholder', 'default', 'words')}
        {renderEditableField('editProfile.lastName', lastName, setLastName, 'editProfile.lastNamePlaceholder', 'default', 'words')}
        {renderEditableField('editProfile.albumNumber', albumNumber, setAlbumNumber, 'editProfile.albumNumberPlaceholder', 'numeric')}
        {renderEditableField('editProfile.studyYear', studyYear, setStudyYear, 'editProfile.studyYearPlaceholder', 'numeric')}
        {renderEditableField('editProfile.studyMode', studyMode, setStudyMode, 'editProfile.studyModePlaceholder')}
        {renderEditableField('editProfile.studyModule', studyModule, setStudyModule, 'editProfile.studyModulePlaceholder')}
        {renderEditableField('editProfile.birthDate', birthDate, setBirthDate, 'editProfile.birthDatePlaceholder')}
        <ReactNativeView style={styles.buttonContainer}>
          <ThemedButton
            title={isSaving ? t('editProfile.savingButton', 'Zapisywanie...') : t('editProfile.saveButton', 'Zapisz Zmiany')}
            onPress={handleSaveProfile}
            type="primary"
            loading={isSaving}
            style={styles.actionButton}
          />
          <ThemedButton
              title={t('common.cancel', 'Anuluj')}
              onPress={() => navigation.goBack()}
              type="outline"
              style={styles.actionButton}
              disabled={isSaving}
          />
        </ReactNativeView>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 30, paddingTop:10 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  photoPickerContainer: { alignSelf: 'center', marginVertical: 20, width: 130, height: 130, borderRadius: 65, justifyContent: 'center', alignItems: 'center', borderWidth: 2 },
  profileImage: { width: '100%', height: '100%', borderRadius: 65 },
  profileImagePlaceholder: { width: '100%', height: '100%', borderRadius: 65, justifyContent: 'center', alignItems: 'center' },
  label: { marginBottom: 6, marginTop: 12, fontWeight: '500' },
  input: { height: 50, borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, marginBottom: 18, fontSize: 16 },
  emailDisplay: {
    fontSize: 16,
    paddingBottom: 15,
    marginBottom: 18,
    borderBottomWidth: 1,
  },
  buttonContainer: { marginTop: 25 },
  actionButton: { marginBottom: 15 },
});

export default EditProfileScreen;
