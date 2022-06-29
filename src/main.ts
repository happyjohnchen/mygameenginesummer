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
import {Sound} from "./behaviours/Sound";
import {AnimationRenderer} from "./behaviours/AnimationRenderer";
import {TileMap} from "./behaviours/TileMap";
import {Prefab} from "./behaviours/Prefab";

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

const engine = new GameEngine();
engine.start();
