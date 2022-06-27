export class Room {
    id: number;
    name: string;
    type: RoomType;

    peopleCapability: number;
    roomSize: number;
    place: { x: number, y: number };

}

export enum RoomType {
    entrance,
    elevator,
    dormitory,
    electricFactory,
    restaurant,
    waterFactory,
    storeroom,
    infirmary,
    laboratory,
    office,
    broadcastRoom,
    weaponFactory,
    weightliftingRoom,
    gym,
    armsDepot,
    classroom,
    gymnasium,
}