import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import CardList from './components/cardlist';
import Header from './components/header'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#f4ad48',
    accent: '#4890f4',
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <Header/>
      <CardList/>
    </PaperProvider>
  );
}
