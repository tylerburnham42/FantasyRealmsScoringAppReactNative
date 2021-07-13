import React, { Component } from 'react';
import { StyleSheet, Text, View,  } from 'react-native';
import { List, Badge, Card, Title, Paragraph, Colors, Divider } from 'react-native-paper';
import {iCard, AllCards, Suit} from './allcards';

const iconDict: { [key in Suit] : string} = {
  [Suit.Army]: "flag",
  [Suit.Artifact]: "diamond-stone",
  [Suit.Beast]: 'paw',
  [Suit.Flame]: "fire",
  [Suit.Flood]: "water",
  [Suit.Land]: "terrain",
  [Suit.Leader]: "crown",
  [Suit.Weapon]: "sword",
  [Suit.Weather]: "apple-icloud",
  [Suit.Wild]: "cards",
  [Suit.Wizard]: "wizard-hat",

  [Suit.Undead]: "grave-stone",
  [Suit.Outsider]: "account-cowboy-hat",
  [Suit.Building]: "office-building",
}

function cardSelect () {


}

const CardList = () => (
    <Card>
    {
      AllCards.map((item: iCard, i: number) =>
      <div>
        <Card style={{backgroundColor:Colors.grey300}} onPress={cardSelect}>
          <Card.Title key={i} title={item.name} left={() => <List.Icon color={Colors.black} icon={iconDict[item.suit]}/>} />
        </Card>
        <Divider/>
      </div>
      )
    }
    </Card>
);

export default CardList;