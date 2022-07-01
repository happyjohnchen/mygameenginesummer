export class RoomModule {
    roomId: number = 1;
    level: number = 1;
    roomSize: number = 1;
    roomType: RoomType = RoomType.Entrance;
    position: RoomPosition = new RoomPosition();
    people: number[] = [];
    neighbourId:number;
}

export enum RoomType {
    WaterFactory,
    EnergyFactory,
    FoodFactory,
    Entrance,
    noType
}

export class RoomPosition {
    x: number = 0;
    y: number = 0;
}