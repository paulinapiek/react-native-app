// src/screens/StudentIdScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StudentIdScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>LEGITYMACJA</Text>
      <Text>Tutaj będą dane legitymacji</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
});
export default StudentIdScreen;
