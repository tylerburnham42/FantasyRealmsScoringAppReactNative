
export enum Suit {
    None="None",
    Army="Army",
    Artifact="Artifact",
    Beast="Beast",
    Flame="Flame",
    Flood="Flood",
    Land="Land",
    Leader="Leader",
    Weapon="Weapon",
    Weather="Weather",
    Wild="Wild",
    Wizard="Wizard",

    Undead="Undead",
    Outsider="Outsider",
    Building="Building",
}


export abstract class CardBase{
    name = "";
    suit = Suit.None;
    strength = 0
    score(selectedcards: Map<CardBase, [boolean, boolean, boolean, number]>): number {
        return this.strength;
    }

    penalty(selectedcards: Map<CardBase, [boolean, boolean, boolean, number]>): Map<CardBase, [boolean, boolean, boolean, number]> {
        return selectedcards
    }
}

/* -------------- Beast --------------- */

class DragonCard extends CardBase {
    name = "Dragon";
    suit = Suit.Beast;
    strength = 30;
    score(selectedcards: Map<CardBase, [boolean, boolean, boolean, number]>): number {

        // -40 Unless with a Wizard
        for (var currentCard of selectedcards.keys()) {
            let currentVals = selectedcards.get(currentCard)
            if (currentVals == undefined) {throw Error("Could not find Value.")}
            let [currentSelected, currentBlanked, currentCleared, currentscore] = currentVals

            if (currentSelected && currentCard.suit === Suit.Wizard) {
                return this.strength
            }

        }
        return -40;
    }

}

class HydraCard extends CardBase {
    name = "Hydra";
    suit = Suit.Beast;
    strength = 12;
    score(selectedcards: Map<CardBase, [boolean, boolean, boolean, number]>): number {

        let score = this.strength
        // +28 when with Swamp
        for (var cardAndSelected of selectedcards) {
            let [currentCard, currentValsArr] = cardAndSelected;
            let [selected, blanked, cleared, scoreVal] = currentValsArr;

            if (selected && currentCard.name === "Swamp") {
                score += 28
                return score;
            }

        }
        return score;
    }
}

class WarHorseCard extends CardBase {
    name = "War Horse";
    suit = Suit.Beast;
    strength = 6;
    score(selectedcards: Map<CardBase, [boolean, boolean, boolean, number]>): number {

        // +28 when with Swamp
        var score = this.strength
        for (var cardAndSelected of selectedcards) {
            let [currentCard, currentValsArr] = cardAndSelected;
            let [selected, blanked, cleared, scoreVal] = currentValsArr;
            if (selected && (currentCard.suit === Suit.Leader || currentCard.suit === Suit.Wizard)) {
                score += 14
                return score;
            }

        }
        return score;
        
    }
}

/* -------------- Wizards -----------*/

class NecromancerCard extends CardBase {
    name = "Necromancer";
    suit = Suit.Wizard;
    strength = 3;
}

/* -------------- Lands -----------*/

class MountainCard extends CardBase {
    name = "Mountain";
    suit = Suit.Land;
    strength = 9;

}

/* -------------- Flood ---------------- */

class GreatFloodCard extends CardBase {
    name = "Great Flood";
    suit = Suit.Flood;
    strength = 32;
    penalty(selectedMap: Map<CardBase, [boolean, boolean, boolean, number]>): Map<CardBase, [boolean, boolean, boolean, number]> {

        var tempSelectedMap = selectedMap

        // for (var cardAndSelected of selectedMap) {
        //     let [currentCard, currentValsArr] = cardAndSelected;
        //     let [selected, blanked, cleared, scoreVal] = currentValsArr;

        //     if (currentCard.name == "Blizzard" && (blanked || !cleared))
        //     {

        //     }
        // }

        for (var cardAndSelected of selectedMap) {
            let [currentCard, currentValsArr] = cardAndSelected;
            let [selected, blanked, cleared, scoreVal] = currentValsArr;

            if (selected && (
                currentCard.suit == Suit.Army ||
                currentCard.suit == Suit.Land ||
                currentCard.suit == Suit.Flame) &&
                currentCard.name != "Mountain" &&
                currentCard.name != "Lightning")
                selectedMap.set(currentCard, [selected, true, cleared, scoreVal])
        }
        return tempSelectedMap
    }
}

/* ------------ Flame ---------------- */

class WildfireCard extends CardBase {
    name = "Wildfire";
    suit = Suit.Flame;
    strength = 40;
    penalty(selectedMap: Map<CardBase, [boolean, boolean, boolean, number]>): Map<CardBase, [boolean, boolean, boolean, number]> {

        var tempSelectedMap = selectedMap

        for (var cardAndSelected of selectedMap) {
            let [currentCard, currentValsArr] = cardAndSelected;
            let [selected, blanked, cleared, scoreVal] = currentValsArr;

            if (selected && 
                currentCard.name != "Mountain" &&
                currentCard.name != "Great Flood" &&
                currentCard.name != "Island" &&
                currentCard.name != "Unicorn" &&
                currentCard.name != "Dragon" &&
                currentCard.suit != Suit.Flame &&
                currentCard.suit != Suit.Wizard &&
                currentCard.suit != Suit.Weather &&
                currentCard.suit != Suit.Weapon &&
                currentCard.suit != Suit.Artifact
                )
                tempSelectedMap.set(currentCard, [selected, true, cleared, scoreVal])
        }
        return tempSelectedMap
    }
}

/* ----------- Weather -------------- */

class BlizzardCard extends CardBase {
    name = "Blizzard";
    suit = Suit.Weather;
    strength = 30;

}

class RainstormCard extends CardBase {
    name = "Rainstorm";
    suit = Suit.Weather;
    strength = 8;

}

export const AllCards = [
    new DragonCard(),
    new HydraCard(),
    new WarHorseCard(),
    new NecromancerCard(),
    new WildfireCard(),
    new GreatFloodCard(),
    new MountainCard(),
    new BlizzardCard(),
    new RainstormCard()
]