// src/auth/screens/AboutAuthorsScreen.tsx
import React from 'react';
import { StyleSheet, Image, View as ReactNativeView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';

import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText';
import ThemedCard from '../../components/ThemedCard';

const authorImage = require('../../assets/images/author_image.png');

const AboutAuthorsScreen = () => {
  const { t } = useTranslation();
  const { theme: currentUITheme } = useTheme();

  const authorName = "User";
  const albumNumber = "Surname";

  return (
    <ThemedView style={styles.container}>
      <ThemedCard style={styles.cardContent}>
        <Image
          source={authorImage}
          style={[styles.authorImage, { borderColor: currentUITheme.primary }]}
        />
        <ThemedText variant="h3" style={[styles.header, { color: currentUITheme.secondaryText }]}>
          {t('aboutAuthors.header')}
        </ThemedText>

        <ReactNativeView style={styles.infoSection}>
          <ThemedText variant="label" style={{ color: currentUITheme.secondaryText }}>
            {t('aboutAuthors.nameLabel')}
          </ThemedText>
          <ThemedText variant="p" style={styles.value}>{authorName}</ThemedText>
        </ReactNativeView>

        <ReactNativeView style={styles.infoSection}>
          <ThemedText variant="label" style={{ color: currentUITheme.secondaryText }}>
            {t('aboutAuthors.albumLabel')}
          </ThemedText>
          <ThemedText variant="p" style={styles.value}>{albumNumber}</ThemedText>
        </ReactNativeView>

        <ThemedText variant="p" style={styles.description}>
          {t('aboutAuthors.description')}
        </ThemedText>
      </ThemedCard>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center', paddingTop: 30 },
  cardContent: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'flex-start',
  },
  authorImage: { width: 120, height: 120, borderRadius: 60, alignSelf: 'center', marginBottom: 20, borderWidth: 3 },
  header: { marginBottom: 25, alignSelf: 'center' },
  infoSection: { marginBottom: 15, width: '100%' },
  value: { fontWeight: '500'},
  description: { lineHeight: 22, marginTop: 20, textAlign: 'left', width: '100%' },
});

export default AboutAuthorsScreen;
