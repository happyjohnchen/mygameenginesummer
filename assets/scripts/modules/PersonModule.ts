export class PersonModule {
    personId: number;
    personName: string;
    race: PersonRace;
    animationId: number;
    placeInRoom: number;
}

export enum PersonRace{
    Human,
    Giant,
    Dwarf,
    Spirit
}