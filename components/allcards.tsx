
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
    selected = false
    blanked = false
    cleared = false
    armyCleared = false
    expansion = false
    blankingPriority = 0
    score = 0
    specialSelectedCard = ""

    updatescore(cardlist: CardBase[]): void {
        this.score = this.strength
    }

    penalty(cardlist: CardBase[]): void {
    }

    clear(cardlist: CardBase[]): void {
    }

    reset(): void {
        this.blanked = false
        this.cleared = false
        this.armyCleared = false
        this.score = 0
    }
}

/* -------------- Beast --------------- */

class DragonCard extends CardBase {
    name = "Dragon";
    suit = Suit.Beast;
    strength = 30;
    updatescore(cardlist: CardBase[]): void {
        this.score = this.strength
        if (this.cleared) {
            return
        }

        // -40 Unless with a Wizard
        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked && currentCard.suit === Suit.Wizard) {
                return
            }

        }
        this.score = -40
    }

}

class HydraCard extends CardBase {
    name = "Hydra";
    suit = Suit.Beast;
    strength = 12;
    updatescore(cardlist: CardBase[]): void {

        this.score = this.strength
        // +28 when with Swamp
        for (var currentCard of cardlist) {

            if (currentCard.selected && !currentCard.blanked && currentCard.name === "Swamp") {
                this.score += 28
                return
            }
        }
    }
}

class WarHorseCard extends CardBase {
    name = "Warhorse";
    suit = Suit.Beast;
    strength = 6;
    updatescore(cardlist: CardBase[]): void {

        // +14 when with Leader or Wizard
        this.score = this.strength
        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked && (currentCard.suit === Suit.Leader || currentCard.suit === Suit.Wizard)) {
                this.score += 14
                return
            }
        }      
    }
}

class BasiliskCard extends CardBase {
    name = "Basilisk";
    suit = Suit.Beast;
    strength = 35;
    blankingPriority = 10
    penalty(cardlist: CardBase[]): void {
        if (this.cleared) {
            return
        }
        // Blanks All Floods
        for (var currentCard of cardlist) {
            if (currentCard.selected && (
                (currentCard.suit == Suit.Army && !this.armyCleared) ||
                currentCard.suit == Suit.Leader ||
                (currentCard.suit == Suit.Beast && currentCard.name != "Basilisk")
                ))

                currentCard.blanked = true
        }
    }
}

class UnicornCard extends CardBase {
    name = "Unicorn";
    suit = Suit.Beast;
    strength = 9;
    updatescore(cardlist: CardBase[]): void {
        this.score = this.strength
        let hasPrincess = false
        let hasOther = false
        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked) {
                if (currentCard.name === "Princess") {
                    hasPrincess = true 
                }
                else if (currentCard.name === "Empress" || 
                    currentCard.name === "Queen" ||
                    currentCard.name === "Enchantress") {
                    
                    hasOther = true
                }
            } 
        }
        
        if (hasPrincess) {
            this.score += 30
        }
        else if (hasOther) {
            this.score += 15
        }
    }
}

/* -------------- Wizards -----------*/

class NecromancerCard extends CardBase {
    name = "Necromancer";
    suit = Suit.Wizard;
    strength = 3;
}

class BeastmasterCard extends CardBase {
    name = "Beastmaster";
    suit = Suit.Wizard;
    strength = 9;
    clear(cardlist: CardBase[]): void {
        for (var currentCard of cardlist) {
            if (currentCard.selected && currentCard.suit === Suit.Beast) {
                currentCard.cleared = true
            }
        }
    }

    updatescore(cardlist: CardBase[]): void {
        this.score = this.strength
        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked && currentCard.suit === Suit.Beast) {
                this.score += 9
            }
        }
    }
}

class CollectorCard extends CardBase {
    name = "Collector";
    suit = Suit.Wizard;
    strength = 7;
    updatescore(cardlist: CardBase[]): void {
        this.score = this.strength
        let selectedSuits = new Set<Suit>();
        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked) {
                selectedSuits.add(currentCard.suit)
            }
        }
        if (selectedSuits.size == 3) {
            this.score += 10
        }
        else if (selectedSuits.size == 4) {
            this.score += 40
        }
        else if (selectedSuits.size >= 5) {
            this.score += 100
        }
    }
}

class WarlockLordCard extends CardBase {
    name = "Warlock Lord";
    suit = Suit.Wizard;
    strength = 25;
    updatescore(cardlist: CardBase[]): void {
        this.score = this.strength

        if (this.cleared) {
            return
        }

        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked && (currentCard.suit === Suit.Leader || 
                (currentCard.suit === Suit.Wizard && currentCard.name != "Warlock Lord"))) {
                
                this.score -= 10
            }
        }
    }
}

class EnchantressCard extends CardBase {
    name = "Enchantress";
    suit = Suit.Wizard;
    strength = 5;
    updatescore(cardlist: CardBase[]): void {
        this.score = this.strength

        if (this.cleared) {
            return
        }

        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked && (
                currentCard.suit === Suit.Land || 
                currentCard.suit === Suit.Weather ||
                currentCard.suit === Suit.Flood ||
                currentCard.suit === Suit.Flame)) {
                
                this.score += 5
            }
        }
    }
}

/* -------------- Leaders -----------*/

class KingCard extends CardBase {
    name = "King";
    suit = Suit.Leader;
    strength = 8;
    updatescore(cardlist: CardBase[]): void {
        this.score = this.strength
        let armiesCount = 0
        let hasQueen = false
        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked) {
                if (currentCard.suit === Suit.Army) {
                    armiesCount += 1
                }
                else if (currentCard.name === "Queen") {
                    hasQueen = true
                }
            }
        }
        if (hasQueen) {
            this.score += (armiesCount * 20)
        }
        else {
            this.score += (armiesCount * 5)
        }
    }
}

class QueenCard extends CardBase {
    name = "Queen";
    suit = Suit.Leader;
    strength = 6;
    updatescore(cardlist: CardBase[]): void {
        this.score = this.strength
        let armiesCount = 0
        let hasQueen = false
        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked) {
                if (currentCard.suit === Suit.Army) {
                    armiesCount += 1
                }
                else if (currentCard.name === "King") {
                    hasQueen = true
                }
            }
        }
        if (hasQueen) {
            this.score += (armiesCount * 20)
        }
        else {
            this.score += (armiesCount * 5)
        }
    }
}

class PrincessCard extends CardBase {
    name = "Princess";
    suit = Suit.Leader;
    strength = 2;
    updatescore(cardlist: CardBase[]): void {
        this.score = this.strength

        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked && (
                currentCard.suit === Suit.Leader ||
                currentCard.suit === Suit.Wizard ||
                currentCard.suit === Suit.Army)) {
                
                this.score += 8
            }
        }
    }
}

class WarloardCard extends CardBase {
    name = "Warlord";
    suit = Suit.Leader;
    strength = 4;
    updatescore(cardlist: CardBase[]): void {
        this.score = this.strength

        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked && currentCard.suit === Suit.Army) {
                
                this.score += currentCard.strength
            }
        }
    }
}

class EmpressCard extends CardBase {
    name = "Empress";
    suit = Suit.Leader;
    strength = 15;
    updatescore(cardlist: CardBase[]): void {
        this.score = this.strength

        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked) {
                if (currentCard.suit === Suit.Army) {
                    this.score += 10
                }
                else if (currentCard.suit === Suit.Leader && currentCard.name != "Empress") {
                    this.score -= 5
                }
            } 
        }
    }
}

/* -------------- Artifacts -----------*/

class ProtectionRuneCard extends CardBase {
    name = "Protection Rune";
    suit = Suit.Artifact;
    strength = 1;

    clear(cardlist: CardBase[]): void {
        for (var currentCard of cardlist) {
            if (currentCard.selected) {
                currentCard.cleared = true
            }
        }
    }
}

class GemOfOrderCard extends CardBase {
    name = "Gem of Order";
    suit = Suit.Artifact;
    strength = 5;

    updatescore(cardlist: CardBase[]): void {
        this.score = this.strength
        
        let strengthSet = new Set<number>();
        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked) {
                strengthSet.add(currentCard.strength)
            }
        }
        
        let longestRun = 1
        let currentRun = 1
        let previousStr = -10
        let strengthArray = Array.from(strengthSet).sort((n1,n2) => n1 - n2);
        for (var currentStr of strengthArray) {
            if (currentStr - previousStr === 1) {
                currentRun += 1
            }
            else {
                if (longestRun < currentRun) {
                    longestRun = currentRun
                }
                currentRun = 1
            }
            previousStr = currentStr
        }
        if (currentRun > longestRun) {
            longestRun = currentRun
        }

        if (longestRun === 3) {
            this.score += 10
        }
        else if (longestRun === 4) {
            this.score += 30
        }
        else if (longestRun === 5) {
            this.score += 60
        }
        else if (longestRun === 6) {
            this.score += 100
        }
        else if (longestRun >= 7) {
            this.score += 150
        }
    }
}

class ShieldOfKethCard extends CardBase {
    name = "Shield Of Keth";
    suit = Suit.Artifact;
    strength = 4;
 
    updatescore(cardlist: CardBase[]): void {
        this.score = this.strength
        let hasLeader = false
        let hasSword = false
        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked) {
                if (currentCard.suit === Suit.Leader) {
                    hasLeader = true
                }
                else if (currentCard.name === "Sword of Keth") {
                    hasSword = true
                }
            }
        }
        if (hasSword && hasLeader) {
            this.score += 40
        }
        else if (hasLeader) {
            this.score += 15
        }
    }
}

class WorldTreeCard extends CardBase {
    name = "World Tree";
    suit = Suit.Artifact;
    strength = 4;
 
    updatescore(cardlist: CardBase[]): void {
        this.score = this.strength
        let selectedNum = 0
        let suitSet = new Set<Suit>();
        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked) {
                suitSet.add(currentCard.suit)
                selectedNum += 1
            }
        }
        if (suitSet.size === selectedNum) {
            this.score += 50
        }
    }
}

class WorldTreeCardExpansion extends CardBase {
    name = "World Tree Expansion";
    suit = Suit.Artifact;
    strength = 4;
 
    updatescore(cardlist: CardBase[]): void {
        this.score = this.strength
        let selectedNum = 0
        let suitSet = new Set<Suit>();
        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked) {
                suitSet.add(currentCard.suit)
                selectedNum += 1
            }
        }
        if (suitSet.size === selectedNum) {
            this.score += 70
        }
    }
}

/* -------------- Weapon -----------*/

class WarshipCard extends CardBase {
    name = "Warship";
    suit = Suit.Weapon;
    strength = 23;

    clear(cardlist: CardBase[]): void {
        for (var currentCard of cardlist) {
            if (currentCard.selected && currentCard.suit == Suit.Flood) {
                currentCard.armyCleared = true
            }
        }
    }

    penalty(cardlist: CardBase[]): void {

        if (this.cleared) {
            return
        }

        // If there is a Flood the card is not blanked.
        let hasFlood = false
        for (var currentCard of cardlist) {
            if (currentCard.selected && 
                !currentCard.blanked &&
                currentCard.suit == Suit.Flood) {
                
                return
            }
        }
        this.blanked = false
    }
}

class SwordOfKethCard extends CardBase {
    name = "Sword Of Keth";
    suit = Suit.Weapon;
    strength = 7;
 
    updatescore(cardlist: CardBase[]): void {
        this.score = this.strength
        let hasLeader = false
        let hasShield = false
        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked) {
                if (currentCard.suit === Suit.Leader) {
                    hasLeader = true
                }
                else if (currentCard.name === "Shield of Keth") {
                    hasShield = true
                }
            }
        }
        if (hasShield && hasLeader) {
            this.score += 40
        }
        else if (hasLeader) {
            this.score += 10
        }
    }
}

class MagicWandCard extends CardBase {
    name = "Magic Wand";
    suit = Suit.Weapon;
    strength = 1;
 
    updatescore(cardlist: CardBase[]): void {
        this.score = this.strength
        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked && currentCard.suit === Suit.Wizard) {
                this.score += 25
            }
        }
    }
}

class ElvenLongbowCard extends CardBase {
    name = "Elven Longbow";
    suit = Suit.Weapon;
    strength = 3;
 
    updatescore(cardlist: CardBase[]): void {
        this.score = this.strength
        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked && (
                currentCard.name === "Elven Archers" ||
                currentCard.name === "Warlord" ||
                currentCard.name === "Beastmaster")) {
                this.score += 30
            }
        }
    }
}

class WarDirigibleCard extends CardBase {
    name = "War Dirigible";
    suit = Suit.Weapon;
    strength = 35;
    penalty(cardlist: CardBase[]): void {

        if (this.cleared) {
            return
        }

        let hasArmy = false
        for (var currentCard of cardlist) {
            if (currentCard.selected && currentCard.suit == Suit.Weather) {
                this.blanked = true
            }
            else if (currentCard.selected && currentCard.suit == Suit.Army && !this.armyCleared) {
                hasArmy = true
            }
        }

        if (!hasArmy) {
            this.blanked = true
        }
    }
}

/* -------------- Army -----------*/

class ElvenArchersCard extends CardBase {
    name = "Elven Archers";
    suit = Suit.Army;
    strength = 10;
    updatescore(cardlist: CardBase[]): void {

        // +14 when with Leader or Wizard
        this.score = this.strength
        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked && currentCard.suit === Suit.Weather) {
                return
            }
        }
        this.score += 5  
    }
}

class DwarvishInfantryCard extends CardBase {
    name = "Dwarvish Infantry";
    suit = Suit.Army;
    strength = 15;
    updatescore(cardlist: CardBase[]): void {
        this.score = this.strength
        if (this.cleared) {
            return
        }

        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked && currentCard.suit === Suit.Army && currentCard.name != "Dwarvish Infantry") {
                this.score -= 2
            }
        }
    }
}

class LightCavalryCard extends CardBase {
    name = "Light Cavalry";
    suit = Suit.Army;
    strength = 17;
    updatescore(cardlist: CardBase[]): void {
        this.score = this.strength
        if (this.cleared) {
            return
        }

        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked && currentCard.suit === Suit.Land) {
                this.score -= 2
            }
        }
    }
}

class RangersCard extends CardBase {
    name = "Rangers";
    suit = Suit.Army;
    strength = 5;
    clear(cardlist: CardBase[]): void {
        for (var currentCard of cardlist) {
            if (currentCard.selected) {
                currentCard.armyCleared = true
            }
        }
    }

    updatescore(cardlist: CardBase[]): void {
        this.score = this.strength

        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked && currentCard.suit === Suit.Land) {
                this.score += 10
            }
        }
    }
}

class KnightsCard extends CardBase {
    name = "Knights";
    suit = Suit.Army;
    strength = 20;
    updatescore(cardlist: CardBase[]): void {
        this.score = this.strength
        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked && currentCard.suit === Suit.Leader) {
                return
            }
        }
        this.score -= 8
    }
}

/* -------------- Lands -----------*/

class MountainCard extends CardBase {
    name = "Mountain";
    suit = Suit.Land;
    strength = 9;
    clear(cardlist: CardBase[]): void {
        for (var currentCard of cardlist) {
            if (currentCard.selected && currentCard.suit === Suit.Flood) {
                currentCard.cleared = true
            }
        }
    }

    updatescore(cardlist: CardBase[]): void {
        this.score = this.strength
        let smoke = true
        let wildFire = true
        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked) {
                if (currentCard.name == "Smoke") {
                    smoke = true
                }
                else if (currentCard.name == "Wildfire") {
                    wildFire = true
                }
            }
        }
        if (smoke && wildFire) {
            this.score += 50
        }
    }
}

class BellTowerCard extends CardBase {
    name = "Bell Tower";
    suit = Suit.Land;
    strength = 8;
    updatescore(cardlist: CardBase[]): void {
        this.score = this.strength
        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked && currentCard.suit === Suit.Wizard) {
                this.score += 15
                return
            }
        }
    }
}

class ForestCard extends CardBase {
    name = "Forest";
    suit = Suit.Land;
    strength = 8;
    updatescore(cardlist: CardBase[]): void {
        this.score = this.strength
        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked && ( 
                currentCard.name == "Elven Archers" ||
                currentCard.suit == Suit.Beast
                )) {
                    this.score += 12
            }
        }
    }
}

class CavernCard extends CardBase {
    name = "Cavern";
    suit = Suit.Land;
    strength = 6;
    clear(cardlist: CardBase[]): void {
        for (var currentCard of cardlist) {
            if (currentCard.selected && currentCard.suit === Suit.Weather) {
                currentCard.cleared = true
            }
        }
    }

    updatescore(cardlist: CardBase[]): void {
        this.score = this.strength
        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked && ( 
                currentCard.name == "Dwarvish Infantry" ||
                currentCard.name == "Dragon"
                )) {
                    this.score += 25
            }
        }
    }
}

class EarthElementalCard extends CardBase {
    name = "Earth Elemental";
    suit = Suit.Land;
    strength = 15;
    updatescore(cardlist: CardBase[]): void {
        this.score = this.strength
        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked && currentCard.suit === Suit.Land && currentCard.name != "Earth Elemental") {
                this.score += 15
            }
        }
    }
}

class GardenCard extends CardBase {
    name = "Garden";
    suit = Suit.Land;
    strength = 11;
    blankingPriority = 2
    expansion = true
    penalty(cardlist: CardBase[]): void {
        if (this.cleared) {
            return
        }

        for (var currentCard of cardlist) {
            if (currentCard.selected && (
                currentCard.suit === Suit.Undead ||
                currentCard.name === "Necromancer" ||
                currentCard.name === "Deamon")) {

                this.blanked = true
                return
            }
        }
    }
    
    updatescore(cardlist: CardBase[]): void {
        this.score = this.strength
        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked && (currentCard.suit === Suit.Leader || currentCard.suit === Suit.Beast)) {
                this.score += 11
            }
        }
    }
}

/* -------------- Flood ---------------- */

class GreatFloodCard extends CardBase {
    name = "Great Flood";
    suit = Suit.Flood;
    strength = 32;
    blankingPriority = 12
    penalty(cardlist: CardBase[]): void {

        if (this.cleared) {
            return
        }

        for (var currentCard of cardlist) {
            if (currentCard.selected && (
                (currentCard.suit == Suit.Army && !currentCard.armyCleared) ||
                currentCard.suit == Suit.Land ||
                currentCard.suit == Suit.Flame) &&
                currentCard.name != "Mountain" &&
                currentCard.name != "Lightning") {

                currentCard.blanked = true
            }
        }
    }
}

class WaterElementalCard extends CardBase {
    name = "Water Elemental";
    suit = Suit.Flood;
    strength = 4;
    updatescore(cardlist: CardBase[]): void {
        this.score = this.strength
        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked && currentCard.suit === Suit.Flood && currentCard.name != "Water Elemental") {
                this.score += 15
            }
        }
    }
}

class FountainOfLifeCard extends CardBase {
    name = "Fountain Of Life";
    suit = Suit.Flood;
    strength = 1;
    updatescore(cardlist: CardBase[]): void {
        this.score = this.strength
        let highestBonus = 0
        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked && (
                    currentCard.suit === Suit.Flood || 
                    currentCard.suit === Suit.Weapon ||
                    currentCard.suit === Suit.Flame || 
                    currentCard.suit === Suit.Land ||
                    currentCard.suit === Suit.Weather)) {
                if (currentCard.strength > highestBonus) {
                    highestBonus = currentCard.strength
                }
            }
        }
        this.score += highestBonus
    }
}

class SwampCard extends CardBase {
    name = "Swamp";
    suit = Suit.Flood;
    strength = 18;
    updatescore(cardlist: CardBase[]): void {
        this.score = this.strength
        if (this.cleared) {
            return
        }

        let highestBonus = 0
        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked && (
                    (currentCard.suit === Suit.Army && !this.armyCleared) || 
                    currentCard.suit === Suit.Flame)) {
                this.score -= 3
            }
        }
    }
}

class IslandCard extends CardBase {
    name = "Island";
    suit = Suit.Flood;
    strength = 14;
    specialSelectedCard : string = ""

    clear(cardlist: CardBase[]): void {
        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked && this.specialSelectedCard == currentCard.name) {
                currentCard.cleared = true
            }
        }
    }
}

/* ------------ Flame ---------------- */

class WildfireCard extends CardBase {
    name = "Wildfire";
    suit = Suit.Flame;
    strength = 40;
    blankingPriority = 11
    penalty(cardlist: CardBase[]): void {
        if (this.cleared) {
            return
        }

        for (var currentCard of cardlist) {
            if (currentCard.selected && 
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

                currentCard.blanked = true
        }
    }
}

class FireElementalCard extends CardBase {
    name = "Fire Elemental";
    suit = Suit.Flame;
    strength = 4;
    updatescore(cardlist: CardBase[]): void {
        this.score = this.strength
        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked && currentCard.suit === Suit.Flame && currentCard.name != "Fire Elemental") {
                this.score += 15
            }
            
        }
    }

}

class CandleCard extends CardBase {
    name = "Candle";
    suit = Suit.Flame;
    strength = 2;

    updatescore(cardlist: CardBase[]): void {
        this.score = this.strength
        var book = false
        var belltower = false
        var wizard = false
        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked){
                if (currentCard.name == "Book of Changes") {
                    book = true
                }
                else if (currentCard.name == "Bell Tower") {
                    belltower = true
                }
                else if (currentCard.suit == Suit.Wizard) {
                    wizard = true
                }
            }     
        }        
        if (book && belltower && wizard) {
            this.score += 100
        }
    }
}

class ForgeCard extends CardBase {
    name = "Forge";
    suit = Suit.Flame;
    strength = 9;

    updatescore(cardlist: CardBase[]): void {
        this.score = this.strength
        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked && (currentCard.suit == Suit.Weapon || currentCard.suit == Suit.Artifact)){
                this.score += 9
            }
        }
    }
}

class LightningCard extends CardBase {
    name = "Lightning";
    suit = Suit.Flame;
    strength = 11;

    updatescore(cardlist: CardBase[]): void {
        this.score = this.strength
        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked && currentCard.name == "Lightning"){
                this.score += 30
                return
            }
        }
    }
}

/* ----------- Weather -------------- */

class BlizzardCard extends CardBase {
    name = "Blizzard";
    suit = Suit.Weather;
    strength = 30;
    blankingPriority = 13
    penalty(cardlist: CardBase[]): void {
        if (this.cleared) {
            return
        }
        // Blanks All Floods
        for (var currentCard of cardlist) {
            if (currentCard.selected && 
                currentCard.suit == Suit.Flood 
                )

                currentCard.blanked = true
        }
    }

    updatescore(cardlist: CardBase[]): void {
        this.score = this.strength
        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked && (
                (currentCard.suit == Suit.Army && !currentCard.armyCleared) ||
                currentCard.suit == Suit.Leader ||
                currentCard.suit == Suit.Beast ||
                currentCard.suit == Suit.Flame)){
                this.score -= 5
            }
        }
    }
}

class RainstormCard extends CardBase {
    name = "Rainstorm";
    suit = Suit.Weather;
    strength = 8;
    blankingPriority = 14
    updatescore(cardlist: CardBase[]): void {

        // +14 when with Leader or Wizard
        this.score = this.strength
        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked && (currentCard.suit === Suit.Flood)) {
                this.score += 10
                return
            }
        }      
    }
    penalty(cardlist: CardBase[]): void {

        if (this.cleared) {
            return
        }
        for (var currentCard of cardlist) {
            if (currentCard.selected && currentCard.suit == Suit.Flame && currentCard.name != "Lightning" )

                currentCard.blanked = true
        }
    }
}

class AirElementalCard extends CardBase {
    name = "Air Elemental";
    suit = Suit.Weather;
    strength = 4;

    updatescore(cardlist: CardBase[]): void {
        this.score = this.strength
        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked && (currentCard.suit == Suit.Weather || currentCard.name != "Air Elemental")){
                this.score += 15
            }
        }
    }
}

class WhirlwindCard extends CardBase {
    name = "Whirlwind";
    suit = Suit.Weather;
    strength = 13;

    updatescore(cardlist: CardBase[]): void {
        this.score = this.strength
        let hasRainstorm = false
        let hasBlizzardOrFlood = false
        for (var currentCard of cardlist) {
            if (currentCard.selected && !currentCard.blanked) {
                if (currentCard.name === "Rainstorm") {
                    hasRainstorm = true
                }
                else if (currentCard.name === "Blizzard" || currentCard.name === "Great Flood") {
                    hasBlizzardOrFlood = true
                }
            }
        }
        if (hasRainstorm && hasBlizzardOrFlood) {
            this.score += 40
        }
    }
}

class SmokeCard extends CardBase {
    name = "Smoke";
    suit = Suit.Weather;
    strength = 8;
    blankingPriority = 5
    penalty(cardlist: CardBase[]): void {
        if (this.cleared) {
            return
        }
        for (var currentCard of cardlist) {
            if (currentCard.selected && currentCard.suit == Suit.Flame)
                return
        }
        this.blanked = true
    }
}

export const AllCards = [
    // Beast
    new DragonCard(),
    new HydraCard(),
    new WarHorseCard(),
    new BasiliskCard(),
    new UnicornCard(),

    // Wizard
    new NecromancerCard(),
    new BeastmasterCard(),
    new CollectorCard(),
    new WarlockLordCard(),
    new EnchantressCard(),

    // Leader
    new KingCard(),
    new QueenCard(),
    new PrincessCard(),
    new WarloardCard(),
    new EmpressCard(),

    // Artifact
    new ProtectionRuneCard(),
    new GemOfOrderCard(),
    new ShieldOfKethCard(),
    new WorldTreeCard(),
    // new WorldTreeCardExpansion(),

    // Weapon
    new WarshipCard(),
    new SwordOfKethCard(),
    new MagicWandCard(),
    new ElvenLongbowCard(),
    new WarDirigibleCard(),

    // Army
    new ElvenArchersCard(),
    new DwarvishInfantryCard(),
    new KnightsCard(),
    new RangersCard(),
    new LightCavalryCard(),


    // Flame
    new WildfireCard(),
    new FireElementalCard(),
    new CandleCard(),
    new ForgeCard(),
    new LightningCard(),

    // Flood
    new GreatFloodCard(),
    new WaterElementalCard(),
    new FountainOfLifeCard(),
    new SwampCard(),
    new IslandCard(),

    // Lands
    new MountainCard(),
    new CavernCard(),
    new BellTowerCard(),
    new ForestCard(),
    new EarthElementalCard(),
    //new GardenCard(), // Expansion

    // Weather
    new BlizzardCard(),
    new RainstormCard(),
    new AirElementalCard(),
    new WhirlwindCard(),
    new SmokeCard()
]