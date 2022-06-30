export class PersonModule {
    personId: number = 1;
    personName: string = 'New Person';
    race: PersonRace = PersonRace.Human;
    animationId: number = 1;
    room: number;
}

export enum PersonRace {
    Human,
    Giant,
    Dwarf,
    Spirit
}