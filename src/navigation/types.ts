// src/navigation/types.ts
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword?: undefined;
};

export type MainTabParamList = {
  Start: undefined;
  Legitymacja: undefined;
  Więcej: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  MainApp: { screen?: keyof MainTabParamList };
  AccountSettings: undefined;
  AppSettings: undefined;
  HelpContact: undefined;
  AboutAuthors: undefined;
  UserProfile: undefined;
  EditProfile: undefined;
};
