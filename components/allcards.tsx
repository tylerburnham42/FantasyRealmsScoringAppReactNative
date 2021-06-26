

export enum Suit {
    Army,
    Artifact,
    Beast,
    Flame,
    Flood,
    Land,
    Leader,
    Weapon,
    Weather,
    Wild,
    Wizard,

    Undead,
    Outsider,
    Building,
}

export interface iCard {
    name : string,
    suit : Suit,
    strength : number,
    score : (selectedcards: iCard[]) => any;
}

class DragonCard implements iCard {
    name = "Dragon";
    suit = Suit.Beast;
    strength = 30;
    score(selectedcards: iCard[]): number {
        return this.strength;
    }
}

export const AllCards = [
    new DragonCard(),
];