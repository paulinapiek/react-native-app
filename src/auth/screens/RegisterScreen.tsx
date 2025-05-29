// src/auth/screens/RegisterScreen.tsx
import React, { useState } from 'react';
import { Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { registerUser, UserProfileData } from '../services/authService';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [albumNumber, setAlbumNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !firstName || !lastName || !albumNumber) {
      Alert.alert('Błąd', 'Wszystkie pola (email, hasło, imię, nazwisko, nr albumu) są wymagane.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Błąd', 'Hasła nie są takie same.');
      return;
    }
    if (!email.endsWith('@microsoft.wsei.edu.pl')) {
      Alert.alert('Błąd', 'Rejestracja jest możliwa tylko dla adresów email w domenie @microsoft.wsei.edu.pl.');
      return;
    }

    setLoading(true);
    const userProfileData: UserProfileData = {
      firstName,
      lastName,
      albumNumber,
    };

    try {
      await registerUser(email, password, userProfileData);
      Alert.alert('Sukces', 'Konto zostało utworzone! Możesz się teraz zalogować.');
      navigation.navigate('Login');
    } catch (error: any) {
      Alert.alert('Błąd rejestracji', error.message || 'Wystąpił nieoczekiwany błąd.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Rejestracja do eWSEI</Text>
      <TextInput style={styles.input} placeholder="Imię" value={firstName} onChangeText={(text: string) => setFirstName(text)} placeholderTextColor="#888" />
      <TextInput style={styles.input} placeholder="Nazwisko" value={lastName} onChangeText={(text: string) => setLastName(text)} placeholderTextColor="#888" />
      <TextInput style={styles.input} placeholder="Numer albumu" value={albumNumber} onChangeText={(text: string) => setAlbumNumber(text)} keyboardType="numeric" placeholderTextColor="#888" />
      <TextInput style={styles.input} placeholder="Email (@microsoft.wsei.edu.pl)" value={email} onChangeText={(text: string) => setEmail(text)} keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#888" />
      <TextInput style={styles.input} placeholder="Hasło (min. 6 znaków)" value={password} onChangeText={(text: string) => setPassword(text)} secureTextEntry placeholderTextColor="#888" />
      <TextInput style={styles.input} placeholder="Potwierdź hasło" value={confirmPassword} onChangeText={(text: string) => setConfirmPassword(text)} secureTextEntry placeholderTextColor="#888" />

      <TouchableOpacity style={[styles.button, styles.registerButton, loading && styles.buttonDisabled]} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Rejestrowanie...' : 'Zarejestruj się'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.loginLinkButton, loading && styles.buttonDisabled]} onPress={() => navigation.navigate('Login')} disabled={loading}>
        <Text style={styles.loginLinkButtonText}>Masz już konto? Zaloguj się</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f4f6f8',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    fontSize: 16,
    color: '#333',
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    marginBottom: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#6dab3c',
  },
  loginLinkButton: {
    backgroundColor: 'transparent',
  },
  loginLinkButtonText: {
    color: '#464f5a',
    fontSize: 15,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default RegisterScreen;
