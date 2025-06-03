// src/navigation/types.ts
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Start: undefined;
  StudentId: undefined;
  Więcej: undefined;
};
export interface UserProfileData {
  uid?: string;
  email?: string | null;
  profileImageUri?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  albumNumber?: string | null;
  studyYear?: string | null;
  studyMode?: string | null;
  studyModule?: string | null;
  birthDate?: string | null;
}

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  MainApp: { screen?: keyof MainTabParamList };
  AccountSettings: undefined;
  AppSettings: undefined;
  HelpContact: undefined;
  AboutAuthors: undefined;
  UserProfile: undefined;
  EditProfile: { currentProfile: Partial<UserProfileData> };
  ChangePassword: undefined;
  DeleteAccount: undefined;
};
