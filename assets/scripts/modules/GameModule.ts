import { PersonModule } from "./PersonModule";
import { RoomModule } from "./RoomModule";

export class GameModule {
    gameTime: GameTimeModule = new GameTimeModule();//时间
    people: PersonModule[] = [];//所有人
    rooms: RoomModule[] = [];//所有房间
    water: number = 50;//水
    energy: number = 50;//能量
    food: number = 50;//食物
    material: number = 0;//材料
    newPersonTime: number = 0;
}

export class GameTimeModule {
    day: number = 1;//日期
    hour: number = 0;//小时
    minute: number = 0;//分钟
    second: number = 0;//秒
    rate: number = 1.0;//倍速
}