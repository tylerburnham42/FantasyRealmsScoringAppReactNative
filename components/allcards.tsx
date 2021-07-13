

export enum Suit {
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

export interface iCard {
    name : string,
    suit : Suit,
    strength : number,
    score : (selectedcards: iCard[]) => any;
}

/* -------------- Beast --------------- */

class DragonCard implements iCard {
    name = "Dragon";
    suit = Suit.Beast;
    strength = 30;
    score(selectedcards: iCard[]): number {
        return this.strength;
    }
}

/* -------------- Lands -----------*/

class MountainCard implements iCard {
    name = "Mountain";
    suit = Suit.Land;
    strength = 9;
    score(selectedcards: iCard[]): number {
        return this.strength;
    }
}

/* -------------- Flood ---------------- */

class GreatFloodCard implements iCard {
    name = "Great Flood";
    suit = Suit.Flood;
    strength = 32;
    score(selectedcards: iCard[]): number {
        return this.strength;
    }
}

/* ------------ Flame ---------------- */

class WildfireCard implements iCard {
    name = "Wildfire";
    suit = Suit.Flame;
    strength = 40;
    score(selectedcards: iCard[]): number {
        return this.strength;
    }
}

/* ----------- Weather -------------- */

class BlizzardCard implements iCard {
    name = "Blizzard";
    suit = Suit.Weather;
    strength = 30;
    score(selectedcards: iCard[]): number {
        return this.strength;
    }
}

class RainstormCard implements iCard {
    name = "Rainstorm";
    suit = Suit.Weather;
    strength = 8;
    score(selectedcards: iCard[]): number {
        return this.strength;
    }
}

export const AllCards = [
    new DragonCard(),
    new WildfireCard(),
    new GreatFloodCard(),
    new MountainCard(),
    new BlizzardCard(),
    new RainstormCard()
]