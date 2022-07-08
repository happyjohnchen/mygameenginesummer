
export class RoomModule {
    roomId: number = 1;
    level: number = 0;
    roomSize: number = 1;
    roomType: RoomType = RoomType.Entrance;
    position: RoomPosition = new RoomPosition();
    people: number[] = [];
    neighbourId:number;
    roomStatus:RoomStatus
    hasRoomClass:boolean
}

export enum RoomType {
    WaterFactory,
    EnergyFactory,
    FoodFactory,
    Entrance,
    noType
}
export enum RoomStatus {

    empty = 0,

    isBuild = 1,

    canBuild = 2
}
export class RoomPosition {
    x: number = 0;
    y: number = 0;
}