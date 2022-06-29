export class RoomModule {
    roomId: number;
    level: number;
    roomSize: number;
    roomType: RoomType;
    position: { x: number, y: number };
    people: [number];
    capability: number;
}

export enum RoomType {
    WaterFactory,
    EnergyFactory,
    FoodFactory,
    Entrance
}