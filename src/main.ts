import {Camera} from './behaviours/Camera';
import {BoxCollider, CircleCollider, EdgeCollider} from './behaviours/Collider';
import {RigidBody} from './behaviours/RigidBody';
import {Rotatable} from './behaviours/Rotatable';
import {ShapeRectRenderer} from './behaviours/ShapeRectRenderer';
import {Walkable} from './behaviours/Walkable';
import {GameEngine, registerBehaviourClass} from './engine';
import {TextRenderer} from './behaviours/TextRenderer';
import {Transform} from './engine/Transform';
import {ShapeCircleRenderer} from "./behaviours/ShapeCircleRenderer";
import {ImageRenderer} from "./behaviours/ImageRenderer";
import {RoundedRectRenderer} from "./behaviours/RoundedRectRenderer";
import {Player} from "../assets/engineTest/scripts/Player";
import {Room} from "../assets/engineTest/scripts/Room";
import {RoomSet} from "../assets/engineTest/scripts/RoomSet";
import {Sound} from "./behaviours/Sound";
import {AnimationRenderer} from "./behaviours/AnimationRenderer";
import {TileMap} from "./behaviours/TileMap";
import {Prefab} from "./behaviours/Prefab";

import {TimeControllerSystem} from "../assets/scripts/TimeControllerSystem";
import {GameController} from "../assets/scripts/GameController";
import{chooseRoomType} from"../assets/engineTest/scripts/chooseRoomType"
import{ensureChoose} from"../assets/engineTest/scripts/ensureChoose"
import{setImageStyle} from"../assets/engineTest/scripts/setImageStyle"
//注册引擎提供的组件
registerBehaviourClass(Transform);
registerBehaviourClass(TextRenderer);
registerBehaviourClass(Walkable);
registerBehaviourClass(Rotatable);
registerBehaviourClass(ShapeRectRenderer);
registerBehaviourClass(RoundedRectRenderer);
registerBehaviourClass(ShapeCircleRenderer);
registerBehaviourClass(ImageRenderer);
registerBehaviourClass(AnimationRenderer);
registerBehaviourClass(RigidBody);
registerBehaviourClass(BoxCollider);
registerBehaviourClass(CircleCollider);
registerBehaviourClass(EdgeCollider);
registerBehaviourClass(Camera);
registerBehaviourClass(Sound);
registerBehaviourClass(TileMap);
registerBehaviourClass(Prefab);

//注册自定义脚本
registerBehaviourClass(Player);
registerBehaviourClass(GameController);
registerBehaviourClass(TimeControllerSystem);

registerBehaviourClass(RoomSet)
registerBehaviourClass(Room)
registerBehaviourClass(chooseRoomType )
registerBehaviourClass(ensureChoose )
registerBehaviourClass(setImageStyle)
const engine = new GameEngine()
engine.start()
