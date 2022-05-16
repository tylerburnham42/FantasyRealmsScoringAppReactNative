import React, { Component, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { List, Badge, Card, Title, Paragraph, Colors, Divider, TextInput, Button  } from 'react-native-paper';
import {AllCards, Suit, CardBase} from './allcards';
import DropDown from "react-native-paper-dropdown";

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


const AddCardsToCardList = () => {
  let cardlist: CardBase[] = [];
  for (var card of AllCards) {
    cardlist.push(card)
  }
  return cardlist
}



const CardList = () => {
    const [cardlist, SetCardList] = useState(AddCardsToCardList())
    const [totalScore, SetScore] = useState(0)
    const [showDropDown, setShowDropDown] = useState(false);
    const [selectedIsland, setSelectedIsland] = useState("")

    var selectedIslandList :[{label: string, value: string}];
    
    const createIslandList = () => {
      selectedIslandList = [{label: "", value: ""}]
      for (var currentCard of cardlist) {
        if (currentCard.suit == Suit.Flood || currentCard.suit == Suit.Flame) {
          selectedIslandList.push({label: currentCard.name, value:currentCard.name})
        }
      }
    }
    createIslandList() 

    const updateIslandDropdownValue = (islandVal:string) => {
      setSelectedIsland(islandVal)

      let newCardList = [...cardlist]
      for (var currentCard of newCardList) {
        if (currentCard.name == "Island") {
          currentCard.specialSelectedCard = selectedIsland ?? ""
        }
      }

      updateScore(newCardList)
    }

    const changeSelected = (card: CardBase) => {
      let currentCardIndex = cardlist.findIndex(search => search.name === card.name)
      if (currentCardIndex == undefined) {return}

      let newCardList = [...cardlist]
      newCardList[currentCardIndex].selected = !newCardList[currentCardIndex].selected

      //SetCardList(newCardList)
      updateScore(newCardList)
    }

    const updateScore = (newCardList: CardBase[]) => {

      let sumScore = 0;

      /** Reset the blanking, cleared, and score values. */
      for (var currentCard of newCardList) {
        currentCard.reset()
      }



      /** Reset the blanking, cleared, and score values. */
      for (var currentCard of newCardList) {
        if (currentCard.selected && !currentCard.blanked) 
        { 
          currentCard.clear(newCardList)
        }
      }

      /** Run the penaltys */
      for (var currentCard of newCardList.sort((card1, card2) => card2.blankingPriority - card1.blankingPriority)) {     
        if (currentCard.selected && !currentCard.blanked) 
        { 
          currentCard.penalty(newCardList)
        }
      }

      for (var currentCard of newCardList) {

        if (currentCard.selected && !currentCard.blanked) 
        {
          currentCard.updatescore(newCardList);
          sumScore += currentCard.score;
        }
      }

      SetScore(sumScore)
      SetCardList(newCardList);
      
    }

    const clearSelected = () => {
      SetCardList(AddCardsToCardList());
      SetScore(0)
    }

    /** Get the Style for the buttons based on selection value and blanking */ 
    const selectStyle = (card: CardBase) => {
      let currentCardIndex = cardlist.findIndex(search => search.name === card.name)
      if (currentCardIndex == undefined) {
        return [styles.buttons, styles.errorButtons]
      }

      if(cardlist[currentCardIndex].selected)
      {
        if(cardlist[currentCardIndex].blanked) {
          return [styles.buttons, styles.blankedButtons]
        }
        else if(cardlist[currentCardIndex].cleared) {
          return [styles.buttons, styles.clearedButtons]
        }
        else {
          return [styles.buttons, styles.selectedButtons]
        }
      }
      else {
        return [styles.buttons, styles.deselectedButtons]
      }
    }

    const getName = (card: CardBase) => {
      let currentCardIndex = cardlist.findIndex(search => search.name === card.name)
      if (currentCardIndex == undefined) {return}

      if (cardlist[currentCardIndex].selected)
      {
        return card.name + ": " + cardlist[currentCardIndex].score.toString()
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
        flex: -1,
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

    const InteractiveCard = (card: CardBase) => {
      if(card.name === "Island") {
        return (
          <view>
            {<DropDown
              label='Cleared Flood or Flame'
              visible = {showDropDown}
              mode={"outlined"}
              showDropDown={() => setShowDropDown(true)}
              onDismiss={() => setShowDropDown(false)}
              value={selectedIsland}
              setValue={updateIslandDropdownValue}
              list={selectedIslandList}
            />}
            
          </view>
        )
      }

      return <view/>
    }

    return (
      <View style={styles.container}>
        <ScrollView>
        {

          //Array.from(selectedMap.keys()).map((item: CardBase, i: number) =>
          cardlist.sort((card1, card2) => card1.suit.toString() < card2.suit.toString() ? -1 : 1).map((item: CardBase, i: number) =>
          <View key={i}>
            <Card onPress={() => changeSelected(item)} style={selectStyle(item)}>
              <Card.Title title={getName(item)} left={() => <List.Icon color={Colors.black} icon={iconDict[item.suit]} />} />
              
            </Card>
          </View>
          )
          //right={(props) => InteractiveCard(item)} />
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