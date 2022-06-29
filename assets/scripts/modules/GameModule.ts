import {PersonModule} from "./PersonModule";
import {RoomModule} from "./RoomModule";

export class GameModule {
    gameTime: { day: number, hour: number, minute: number, second: number, rate: number };//时间
    people: [PersonModule];//所有人
    rooms: [RoomModule];//所有房间
    water: number;//水
    energy: number;//能量
    food: number;//食物
    material: number;//材料
}