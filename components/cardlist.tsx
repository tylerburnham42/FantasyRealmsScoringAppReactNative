import React, { Component } from 'react';
import { StyleSheet, Text, View,  } from 'react-native';
import { List, Badge, Card, Title, Paragraph, Colors } from 'react-native-paper';
import {iCard, AllCards, Suit} from './allcards';

const iconDict: { [key in Suit] : string} = {
  [Suit.Army]: "folder",
  [Suit.Artifact]: "folder",
  [Suit.Beast]: 'paw',
  [Suit.Flame]: "local_fire_department",
  [Suit.Flood]: "folder",
  [Suit.Land]: "folder",
  [Suit.Leader]: "folder",
  [Suit.Weapon]: "folder",
  [Suit.Weather]: "folder",
  [Suit.Wild]: "folder",
  [Suit.Wizard]: "folder",

  [Suit.Undead]: "folder",
  [Suit.Outsider]: "folder",
  [Suit.Building]: "folder",
}

const CardList = () => (
  <List.Section>
    <List.Subheader></List.Subheader>
    {
      AllCards.map((item: iCard, i: number) =>
        <Card>
          <Card.Content>
            
            <List.Item 
              key={i} 
              title={item.name}
              left={() => <List.Icon color={Colors.blue500} icon={iconDict[item.suit]}/>}
            />
          </Card.Content>
        </Card>
      )
    }
  </List.Section>
);

export default CardList;