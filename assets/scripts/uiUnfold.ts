import { Prefab } from "../../src/behaviours/Prefab";
import { GameObject, getGameObjectById } from "../../src/engine";
import {Behaviour} from "../../src/engine/Behaviour";
import { Transform } from "../../src/engine/Transform";
import { string } from "../../src/engine/validators/string";

export class UiUnfold extends Behaviour {

    //展示出ui

    prefabsPath = "" // 预制体路径

    //游戏编辑模式或运行模式开始时会执行一次
    onStart() {

    }

    //游戏运行模式开始时会执行一次  点击ui 生成预制体ui
    onPlayStart() {
        this.gameObject.onClick = (e) => {
            if(e.button ==0){
                // let gameObjectchild = new GameObject() 
                // this.gameObject.parent.addChild(gameObjectchild);
                // const childrenTransform = new Transform();
                // childrenTransform.x = this.gameObject.getBehaviour(Transform).x ;
                // childrenTransform.y = this.gameObject.getBehaviour(Transform).y ;
                // gameObjectchild.addBehaviour(childrenTransform);
                // const prefab = new Prefab();
                // prefab.prefabPath = this.prefabsPath;
                // gameObjectchild.addBehaviour(prefab);
                getGameObjectById("CreateUi").active = true;     
            }
     
        }
    }

    createPrefab(){
        
    }
    //每次屏幕刷新执行
    onUpdate() {

    }

    //平均每16ms执行一次
    onTick(duringTime: number) {

    }

    //删除Behaviour时会执行一次
    onEnd() {

    }
}