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
import {Room} from "../assets/scripts/Room";
import {RoomSet} from "../assets/scripts/RoomSet";
import {Sound} from "./behaviours/Sound";
import {AnimationRenderer} from "./behaviours/AnimationRenderer";
import {Prefab} from "./behaviours/Prefab";

import {TimeControllerSystem} from "../assets/scripts/TimeControllerSystem";
import {AttributeSystem} from "../assets/scripts/AttributeSystem";
import {AddAttribute} from "../assets/scripts/AddAttribute";
import {ShowTime} from "../assets/scripts/ShowTime";
import {ChangeTimeSpeed} from "../assets/scripts/ChangeTimeSpeed";
import {RoomClass} from "../assets/scripts/RoomClass";
import {GameController} from "../assets/scripts/GameController";
import {CameraMouseController} from "../assets/scripts/CameraMouseController";

import {Test} from "../assets/scripts/Test";
import {UiUnfold} from "../assets/scripts/UiUnfold";
import {UiCreateRoom} from "../assets/scripts/UiCreateRoom";
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
registerBehaviourClass(Prefab);

//注册自定义脚本
registerBehaviourClass(Player);
registerBehaviourClass(GameController);
registerBehaviourClass(TimeControllerSystem);


registerBehaviourClass(AttributeSystem);
registerBehaviourClass(AddAttribute);
registerBehaviourClass(ShowTime);
registerBehaviourClass(RoomClass);
registerBehaviourClass(ChangeTimeSpeed);

registerBehaviourClass(Test);


registerBehaviourClass(CameraMouseController);
registerBehaviourClass(RoomSet);
registerBehaviourClass(Room);

registerBehaviourClass(UiUnfold);
registerBehaviourClass(UiCreateRoom);

const engine = new GameEngine()
engine.start()
