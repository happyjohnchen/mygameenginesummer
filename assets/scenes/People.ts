import {Room} from "./Room";

export class People {
    id: number;
    name: string;
    gender: 'male' | 'female';
    level: number;
    happiness: number;//幸福度

    //SPECIAL属性
    strength:number;
    perceptive:number;
    endurance:number;
    charm:number;
    intelligence:number;
    agility:number;
    luck:number;

    //物品栏
    equipment;
    weapon;
    pet;

    //工作
    workPlaceId: number;

}