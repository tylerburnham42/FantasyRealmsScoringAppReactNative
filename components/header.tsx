import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { List, Appbar, useTheme  } from 'react-native-paper'

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';


function Header() {
    return (
    <Appbar.Header>
        <Appbar.Content title="Fantasy Realms Scoring"  />
        <Appbar.Action icon="magnify" onPress={() => {}} />
        <Appbar.Action icon={MORE_ICON} onPress={() => {}} />
    </Appbar.Header>
    );
}

export default Header;