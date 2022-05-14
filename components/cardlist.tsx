import React, { Component, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { List, Badge, Card, Title, Paragraph, Colors, Divider, TextInput, Button  } from 'react-native-paper';
import {AllCards, Suit, CardBase} from './allcards';

const iconDict: { [key in Suit] : string} = {
  [Suit.None]: "help",
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


const MakeSelectedDict = () => {
  let selectedDict = new Map<CardBase, [boolean, boolean, boolean, number]>();
  for (var card of AllCards) {
    selectedDict.set(card, [false, false, false, 0])
  }
  return selectedDict
}



const CardList = () => {
    const [selectedMap, SetSelectedMap] = useState(MakeSelectedDict())
    const [totalScore, SetScore] = useState(0)

    const changeSelected = (card: CardBase) => {
      let tempSelectedMap = selectedMap
      let currentVals = selectedMap.get(card)
      if (currentVals == undefined) {return}
      let [currentSelected, currentBlanked, currentCleared, currentscore] = currentVals
      tempSelectedMap = new Map(tempSelectedMap.set(card, [!currentSelected , currentBlanked, currentCleared, currentscore]))
      //SetSelectedMap(new Map(tempSelectedMap));
      updateScore(tempSelectedMap)
    }

    const updateScore = (tempSelectedMap: Map<CardBase, [boolean, boolean, boolean, number]>) => {

      let sumScore = 0;

      /** Reset the blanking, cleared, and score values. */
      for (var currentCard of selectedMap.keys()) {
        let currentVals = selectedMap.get(currentCard)
        if (currentVals == undefined) {return}
        let [currentSelected, currentBlanked, currentCleared, currentscore] = currentVals        
        tempSelectedMap = tempSelectedMap.set(currentCard, [currentSelected , false, false, 0])
      }

      /** Run the penaltys */
      for (var currentCard of selectedMap.keys()) {
        let currentVals = selectedMap.get(currentCard)
        if (currentVals == undefined) {return}
        let [currentSelected, currentBlanked, currentCleared, currentscore] = currentVals        
        if (currentSelected && !currentBlanked) 
        {
          currentCard.penalty(tempSelectedMap)
        }
      }

      for (var currentCard of selectedMap.keys()) {
        let currentVals = selectedMap.get(currentCard)
        if (currentVals == undefined) {throw Error("Could not find Value.")}
        let [currentSelected, currentBlanked, currentCleared, currentscore] = currentVals
        if (currentSelected && !currentBlanked) 
        {
          let returnScore = currentCard.score(tempSelectedMap);
          sumScore += returnScore;
          tempSelectedMap = tempSelectedMap.set(currentCard, [currentSelected , currentBlanked, currentCleared, returnScore])
        }
      }

      SetScore(sumScore)
      SetSelectedMap(tempSelectedMap);
      
    }

    const clearSelected = () => {
      SetSelectedMap(MakeSelectedDict());
      SetScore(0)
    }

    /** Get the Style for the buttons based on selection value and blanking */ 
    const selectStyle = (card: CardBase) => {
      let vals = selectedMap.get(card)
      if (vals == null){
        return [styles.buttons, styles.errorButtons]
      }
      let [selected, blanked, cleared, score] = vals



      if(cleared && selected)
      {
        return [styles.buttons, styles.clearedButtons]
      }

      else if(blanked && selected)
      {
        return [styles.buttons, styles.blankedButtons]
      }
      
      else if(selected)
      {
        return [styles.buttons, styles.selectedButtons]
      }
      else
      {
        return [styles.buttons, styles.deselectedButtons]
      }
    }

    const getName = (card: CardBase) => {
      var values = selectedMap.get(card)
      if (values == null)
      {
        return "Cannot get name From map"
      }
      else if (values.length != 4)
      {
        return "Cannot unpack 4 values from state map."
      }

      let [currentSelected, currentBlanked, currentCleared, currentscore] = values
      if (currentSelected)
      {
        return card.name + ": " + currentscore.toString()
      }
      else
      {
        return card.name
      }
    }

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
        //justifyContent: 'space-between',
      },

      scoreView: {
        flexDirection: 'row'
      },
    
      score: {
        margin: 5,
        flex: 4,
        backgroundColor: Colors.grey100
      },

      clearButton: {
        margin: 5,
        flex: 1,
        backgroundColor: Colors.grey600
      },

      clearButtonText: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: Colors.white
      },
    
      buttons: {
        flex: 0,
        padding: 0,
        margin: 10,
      },

      errorButtons: {
        backgroundColor: Colors.yellow100,
      },   

      deselectedButtons: {
        backgroundColor: Colors.grey300,
      },      

      selectedButtons: {
        backgroundColor: Colors.green300,
      },

      blankedButtons: {
        backgroundColor: Colors.red300,
      },

      clearedButtons: {
        backgroundColor: Colors.blue300,
      },
    
    });

    return (
      <View style={styles.container}>
        <ScrollView>
        {

          Array.from(selectedMap.keys()).map((item: CardBase, i: number) =>
          //AllCards.map((item: CardBase, i: number) =>
          <View>
            <Card key={i} onPress={() => changeSelected(item)} style={selectStyle(item)}>
              <Card.Title title={getName(item)} left={() => <List.Icon color={Colors.black} icon={iconDict[item.suit]}/>} />
            </Card>

          </View>
          )
        }
        </ScrollView>
        <View style={styles.scoreView}>
          <TextInput editable={false} label="Score:" value={totalScore.toString()} style={styles.score}/>
          <Button mode='text' style={styles.clearButton} labelStyle={styles.clearButtonText} onPress={clearSelected}>Clear</Button>
        </View>
      </View>

    );
}


export default CardList;