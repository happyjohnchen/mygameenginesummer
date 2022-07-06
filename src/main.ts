import { ChildTest } from "../assets/engineTest/scripts/Child";
import { FatherTest } from "../assets/engineTest/scripts/Father";
import { Player } from "../assets/engineTest/scripts/Player";
import { Test_xjy } from "../assets/engineTest/scripts/Test_xjy";
import { Test_xjy2 } from "../assets/engineTest/scripts/Test_xjy2";
import { AddAttribute } from "../assets/scripts/addAttribute";
import { AttributeSystem } from "../assets/scripts/AttributeSystem";
import { BorderSet } from "../assets/scripts/BorderSet";
import { ButtonNewGame } from "../assets/scripts/ButtonNewGame";
import { ButtonReadArchive } from "../assets/scripts/ButtonReadArchive";
import { CameraMouseController } from "../assets/scripts/CameraMouseController";
import { ChangeTimeSpeed } from "../assets/scripts/changeTimeSpeed";
import { GameController } from "../assets/scripts/GameController";
import { PersonClass } from "../assets/scripts/PersonClass";
import { PersonSet } from "../assets/scripts/PersonSet";
import { PersonTestLXQ } from "../assets/scripts/PersonTestLXQ";
import { Room } from "../assets/scripts/Room";
import { RoomClass } from "../assets/scripts/RoomClass";
import { RoomSet } from "../assets/scripts/RoomSet";
import { ShowAttribute } from "../assets/scripts/ShowAttribute";
import { ShowTime } from "../assets/scripts/showtime";
import { TimeControllerSystem } from "../assets/scripts/TimeControllerSystem";
import { UiCloseForCreate } from "../assets/scripts/UiCloseForCreate";
import { UiCreateRoom } from "../assets/scripts/UiCreateRoom";
import { UiProgressBar } from "../assets/scripts/UiProgressBar";
import { UiSaveArchive } from "../assets/scripts/UiSaveArchive";
import { UiUnfold } from "../assets/scripts/uiUnfold";
import { AnimationRenderer } from "./behaviours/AnimationRenderer";
import { BehaviourDemo } from "./behaviours/BehaviourDemo";
import { Camera } from "./behaviours/Camera";
import { CircleCollider, EdgeCollider, BoxCollider } from "./behaviours/Collider";
import { ImageRenderer } from "./behaviours/ImageRenderer";
import { Prefab } from "./behaviours/Prefab";
import { RigidBody } from "./behaviours/RigidBody";
import { Rotatable } from "./behaviours/Rotatable";
import { RoundedRectRenderer } from "./behaviours/RoundedRectRenderer";
import { ShapeCircleRenderer } from "./behaviours/ShapeCircleRenderer";
import { ShapeRectRenderer } from "./behaviours/ShapeRectRenderer";
import { Sound } from "./behaviours/Sound";
import { TextRenderer } from "./behaviours/TextRenderer";
import { TileMap } from "./behaviours/TileMap";
import { Walkable } from "./behaviours/Walkable";
import { registerBehaviourClass, GameEngine } from "./engine";
import { Transform } from "./engine/Transform";
registerBehaviourClass(AnimationRenderer);
registerBehaviourClass(BehaviourDemo);
registerBehaviourClass(Camera);
registerBehaviourClass(CircleCollider);
registerBehaviourClass(EdgeCollider);
registerBehaviourClass(BoxCollider);
registerBehaviourClass(ImageRenderer);
registerBehaviourClass(Prefab);
registerBehaviourClass(RigidBody);
registerBehaviourClass(Rotatable);
registerBehaviourClass(RoundedRectRenderer);
registerBehaviourClass(ShapeCircleRenderer);
registerBehaviourClass(ShapeRectRenderer);
registerBehaviourClass(Sound);
registerBehaviourClass(TextRenderer);
registerBehaviourClass(TileMap);
registerBehaviourClass(Walkable);
registerBehaviourClass(Transform);
registerBehaviourClass(AddAttribute);
registerBehaviourClass(AttributeSystem);
registerBehaviourClass(BorderSet);
registerBehaviourClass(ButtonNewGame);
registerBehaviourClass(ButtonReadArchive);
registerBehaviourClass(CameraMouseController);
registerBehaviourClass(ChangeTimeSpeed);
registerBehaviourClass(BehaviourDemo);
registerBehaviourClass(GameController);
registerBehaviourClass(PersonClass);
registerBehaviourClass(PersonSet);
registerBehaviourClass(PersonTestLXQ);
registerBehaviourClass(Room);
registerBehaviourClass(RoomClass);
registerBehaviourClass(RoomSet);
registerBehaviourClass(ShowAttribute);
registerBehaviourClass(ShowTime);
registerBehaviourClass(TimeControllerSystem);
registerBehaviourClass(UiCloseForCreate);
registerBehaviourClass(UiCreateRoom);
registerBehaviourClass(UiProgressBar);
registerBehaviourClass(UiSaveArchive);
registerBehaviourClass(UiUnfold);
registerBehaviourClass(ChildTest);
registerBehaviourClass(FatherTest);
registerBehaviourClass(Player);
registerBehaviourClass(Test_xjy);
registerBehaviourClass(Test_xjy2);
const engine = new GameEngine();
engine.start();
