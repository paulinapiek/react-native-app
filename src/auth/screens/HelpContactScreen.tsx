// src/auth/screens/HelpContactScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, Linking, Alert, View as ReactNativeView, Platform, ActivityIndicator, Pressable } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';

import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText';
import ThemedButton from '../../components/ThemedButton';
import ThemedCard from '../../components/ThemedCard';

const HelpContactScreen = () => {
  const { t } = useTranslation();
  const { theme: currentUITheme, isLoadingTheme } = useTheme();

  const [isPhoneLinkActive, setIsPhoneLinkActive] = useState(false);
  const [isEmailLinkActive, setIsEmailLinkActive] = useState(false);

  const wseiEmail = 'kancelaria@wsei.edu.pl';
  const wseiPhone = '+48124311890';
  const wseiAddress = t('helpContact.address');
  const googleMapsUrl = 'https://maps.app.goo.gl/U9iqueew89qWHBBu6';

  const openLink = async (url: string) => {
    try {
      const isTelOrMailto = url.startsWith('tel:') || url.startsWith('mailto:');
      if (Platform.OS === 'android' && isTelOrMailto) {
        await Linking.openURL(url);
      } else {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          Alert.alert(t('common.error'), t('helpContact.errorOpeningLink', { url }));
        }
      }
    } catch (error) {
      console.error('Błąd podczas otwierania linku:', error);
      Alert.alert(t('common.error'), t('helpContact.errorGenericLink'));
    }
  };

  if (isLoadingTheme || !currentUITheme) {
    const fallbackBackgroundColor = '#f4f6f8';
    const fallbackPrimaryColor = '#6dab3c';
    return (
      <ReactNativeView style={[styles.loadingContainer, { backgroundColor: fallbackBackgroundColor }]}>
        <ActivityIndicator size="large" color={fallbackPrimaryColor} />
      </ReactNativeView>
    );
  }

  const iconColor = currentUITheme.primary;
  const defaultLinkColor = currentUITheme.text;
  const activeLinkColor = currentUITheme.primary;

  return (
    <ThemedView style={styles.container}>
      <ThemedCard style={styles.cardContent}>
        <ThemedText variant="h3" style={styles.cardTitle}>
          {t('helpContact.cardTitle')}
        </ThemedText>

        <ReactNativeView style={styles.infoItemStatic}>
          <FontAwesome5 name="map-marker-alt" size={20} color={iconColor} style={styles.icon} />
          <ThemedText variant="p" style={styles.infoText}>{wseiAddress}</ThemedText>
        </ReactNativeView>

        <Pressable
          style={({ pressed }) => [
            styles.infoItemClickable,
            pressed && styles.linkPressed,
          ]}
          onPress={() => openLink(`tel:${wseiPhone}`)}
          onPressIn={() => setIsPhoneLinkActive(true)}
          onPressOut={() => setIsPhoneLinkActive(false)}
        >
          <FontAwesome5 name="phone-alt" size={20} color={isPhoneLinkActive ? activeLinkColor : iconColor} style={styles.icon} />
          <ThemedText
            variant="p"
            style={[
              styles.infoText,
              { color: isPhoneLinkActive ? activeLinkColor : defaultLinkColor },
            ]}
          >
            {t('helpContact.phoneCall')}
          </ThemedText>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.infoItemClickable,
            pressed && styles.linkPressed,
          ]}
          onPress={() => openLink(`mailto:${wseiEmail}`)}
          onPressIn={() => setIsEmailLinkActive(true)}
          onPressOut={() => setIsEmailLinkActive(false)}
        >
          <FontAwesome5 name="envelope" size={20} color={isEmailLinkActive ? activeLinkColor : iconColor} style={styles.icon} />
          <ThemedText
            variant="p"
            style={[
              styles.infoText,
              { color: isEmailLinkActive ? activeLinkColor : defaultLinkColor },
            ]}
          >
            {t('helpContact.emailWrite')}
          </ThemedText>
        </Pressable>

        <ThemedButton
          title={t('helpContact.goToGoogleMaps')}
          onPress={() => openLink(googleMapsUrl)}
          type="primary"
          style={styles.mapsButtonBase}
          leftIcon={<FontAwesome5 name="directions" size={18} color={currentUITheme.buttonText} />}
          textStyle={{ marginLeft: 8 }}
        />
      </ThemedCard>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'flex-start',
  },
  cardTitle: {
    marginBottom: 25,
    textAlign: 'center',
    width: '100%',
  },
  infoItemBase: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  infoItemStatic: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    paddingVertical: 8,
  },
  infoItemClickable: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    paddingVertical: 8,
    borderRadius: 6,
  },
  linkPressed: {
  },
  icon: {
    width: 30,
    textAlign: 'center',
    marginRight: 15,
  },
  infoText: {
    flexShrink: 1,
  },
  mapsButtonBase: {
    marginTop: 20,
    width: '100%',
  },
});

export default HelpContactScreen;
