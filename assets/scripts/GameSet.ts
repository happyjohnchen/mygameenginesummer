import {TimeControllerSystem} from "./TimeControllerSystem";

export class GameSet {
    time: TimeControllerSystem;//时间
    people = [];//所有人
    rooms = [];//所有房间
    water: number = 0;//水
    energy: number = 0;//能量
    food: number = 0;//食物
    material: number = 0;//材料
}