import {TimeControllerSystem} from "./TimeControllerSystem";
import {GameObject} from "../../src/engine";
import { PersonSet } from "./PersonSet";

export class GameSet {
    time: TimeControllerSystem;//时间
    people: GameObject[] = [];//所有人
    rooms: GameObject[] = [];//所有房间
    water: number = 0;//水
    energy: number = 0;//能量
    food: number = 0;//食物
    material: number = 0;//材料
    newPersonTime: number = 0;
    personSet: PersonSet = new PersonSet()
}