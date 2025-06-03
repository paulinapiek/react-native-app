// src/services/profileService.ts
import RNFS from 'react-native-fs';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { UserProfileData } from '../../navigation/types';

export const uploadProfileImageToFirebase = async (
  userId: string, 
  originalImageUriFromPicker: string, 
  imageTypeFromPicker?: string
): Promise<string | null> => {
  console.log('[Service Upload] Start. UserID:', userId, 'OriginalPickerURI:', originalImageUriFromPicker, 'Type:', imageTypeFromPicker);
  let pathToUseForPutFile = originalImageUriFromPicker;

  if (!pathToUseForPutFile || !pathToUseForPutFile.startsWith('file://')) {
    console.error('[Service Upload] ERROR: Invalid or non-file URI received:', pathToUseForPutFile);
    throw new Error('Invalid image URI provided for upload.');
  }

  pathToUseForPutFile = pathToUseForPutFile.substring('file://'.length);
  console.log('[Service Upload] Path after stripping "file://" prefix:', pathToUseForPutFile);

  try {
    const fileExists = await RNFS.exists(pathToUseForPutFile);
    if (!fileExists) {
      console.error(`[Service Upload] CRITICAL ERROR - File does NOT exist at path: '${pathToUseForPutFile}'`);
      throw new Error(`File not found at path: ${pathToUseForPutFile}`);
    }
    console.log(`[Service Upload] File confirmed to exist at '${pathToUseForPutFile}'`);
  } catch (rnfsError) {
    console.error(`[Service Upload] Error checking file existence:`, rnfsError);
    throw new Error('Failed to confirm file existence before upload.');
  }
  
  const storageFileName = `${Date.now()}_${pathToUseForPutFile.substring(pathToUseForPutFile.lastIndexOf('/') + 1) || `profile_image.jpg`}`;
  const reference = storage().ref(`profileImages/${userId}/${storageFileName}`);

  console.log(`[Service Upload] Final Path for putFile: '${pathToUseForPutFile}'`);
  console.log(`[Service Upload] Storage FileName: '${storageFileName}'`);

  // Poprawiona definicja metadanych
  const metadata: { contentType?: string } = {};
  if (imageTypeFromPicker) {
    metadata.contentType = imageTypeFromPicker;
  } else {
    const extension = pathToUseForPutFile.substring(pathToUseForPutFile.lastIndexOf('.') + 1).toLowerCase();
    if (extension === 'jpg' || extension === 'jpeg') metadata.contentType = 'image/jpeg';
    else if (extension === 'png') metadata.contentType = 'image/png';
    console.log(`[Service Upload] Guessed contentType from extension '${extension}': '${metadata.contentType}'`);
  }

  try {
    const uploadTaskSnapshot = await reference.putFile(pathToUseForPutFile, metadata);
    console.log('[Service Upload] Image uploaded successfully. Bytes transferred:', uploadTaskSnapshot.bytesTransferred);
    const downloadURL = await reference.getDownloadURL();
    console.log('[Service Upload] Download URL:', downloadURL);
    return downloadURL;
  } catch (e: any) {
    console.error("[Service Upload] ERROR during Firebase Storage putFile operation:", e);
    console.error("[Service Upload] Error Code:", e.code, "Message:", e.message);
    throw new Error(`Upload failed: ${e.code} - ${e.message}`);
  }
};

export const updateStudentProfileInFirestore = async (
  userId: string, 
  profileDataToSave: Partial<UserProfileData>
): Promise<void> => {
  const dataToUpdate: { [key: string]: any } = {};
  (Object.keys(profileDataToSave) as Array<keyof UserProfileData>).forEach(key => {
    if (profileDataToSave[key] !== undefined) {
      dataToUpdate[key] = profileDataToSave[key];
    }
  });
  
  try {
    await firestore().collection('studentProfiles').doc(userId).set(dataToUpdate, { merge: true });
    console.log('[Service Update] Profile updated in Firestore successfully');
  } catch (e: any) {
    console.error("[Service Update] Error updating profile in Firestore:", e);
    throw new Error(`Failed to update profile: ${e.message || 'Unknown Firestore error'}`);
  }
};
