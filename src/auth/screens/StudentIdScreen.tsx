// src/screens/StudentIdScreen.tsx
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText';
import ThemedButton from '../../components/ThemedButton';

const StudentIdScreen = () => {
  const { t } = useTranslation();
  const { theme: currentUITheme } = useTheme();
  const navigation = useNavigation();

  const handleContactPress = () => {
    // @ts-ignore
    navigation.navigate('HelpContact');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        alwaysBounceVertical={false}
      >
        <View style={[styles.iconContainer, { backgroundColor: currentUITheme.separator }]}>
          <FontAwesome5
            name="id-card"
            size={60}
            color={currentUITheme.secondaryText}
          />
        </View>
        <ThemedText variant="h2" style={styles.title}>
          {t('studentIdScreen.title', 'LEGITYMACJA')}
        </ThemedText>
        <View style={[styles.infoBox, { backgroundColor: currentUITheme.card, borderColor: currentUITheme.separator }]}>
          <ThemedText variant="h3" style={[styles.statusTitle, { color: currentUITheme.secondaryText }]}>
            {t('studentIdScreen.noApplicationTitle', 'Brak zgłoszonego wniosku')}
          </ThemedText>
          <ThemedText variant="p" style={[styles.infoText, { color: currentUITheme.secondaryText }]}>
            {t('studentIdScreen.applicationInfo', 'Jeśli chcesz złożyć wniosek o e-legitymację, skontaktuj się z dziekanatem.')}
          </ThemedText>
        </View>

        <ThemedButton
          title={t('studentIdScreen.contactButton', 'Skontaktuj się z dziekanatem')}
          onPress={handleContactPress}
          type="primary"
          style={styles.contactButton}
        />
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 30,
    paddingBottom: 50,
    minHeight: '100%',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  infoBox: {
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 32,
    width: '100%',
    maxWidth: 400,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  contactButton: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 30,
  },
});

export default StudentIdScreen;
