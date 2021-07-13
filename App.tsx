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
    primary: '#212121',
    accent: '#212121',
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
