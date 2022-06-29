export class RoomModule {
    roomId: number;
    level: number;
    roomSize: number;
    roomType: RoomType;
    position: { x: number, y: number };
    people: [number];
}

export enum RoomType {
    WaterFactory,
    EnergyFactory,
    FoodFactory,
    Entrance,
    noType
}