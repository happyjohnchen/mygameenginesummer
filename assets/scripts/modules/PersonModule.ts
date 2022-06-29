export class PersonModule {
    personId: number;
    personName: string;
    race: PersonRace;
    animationId: number;
}

export enum PersonRace{
    Human,
    Giant,
    Dwarf,
    Spirit
}