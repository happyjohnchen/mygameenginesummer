export class PersonModule {
    personId: number;
    personName: string;
    race: PersonRace;
}

export enum PersonRace{
    Human,
    Giant,
    Dwarf,
    Spirit
}