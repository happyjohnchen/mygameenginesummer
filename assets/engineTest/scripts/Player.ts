import {Behaviour} from "../../../src/engine/Behaviour";
import {Transform} from "../../../src/engine/Transform";
import {number} from "../../../src/engine/validators/number";
import {GameObject, getGameObjectById} from "../../../src/engine";
import {Sound} from "../../../src/behaviours/Sound";
import {AnimationRenderer} from "../../../src/behaviours/AnimationRenderer";
import {ShapeCircleRenderer} from "../../../src/behaviours/ShapeCircleRenderer";
import {Prefab} from "../../../src/behaviours/Prefab";
import {GameModule} from "../../scripts/modules/GameModule";
import {PersonModule, PersonRace} from "../../scripts/modules/PersonModule";
import {RoomModule, RoomType} from "../../scripts/modules/RoomModule";
import {ArchiveSystem} from "../../scripts/archiveSystem/ArchiveSystem";

export class Player extends Behaviour {
    @number()
    speed: number = 1;

    sceneData?: any;

    onStart() {
        console.log("player onStart, data: " + this.engine.loadSceneData as string);
        try{
            const gModule = JSON.parse(decodeURI(this.engine.loadSceneData)) as GameModule;
            console.log(gModule);
        } catch (e){
            console.log("Player:loadSceneData没有被解析，因为其不是JSON格式")
        }
        const transform = this.gameObject.getBehaviour(Transform);
        if (this.engine.loadSceneData && this.engine.loadSceneData !== this.sceneData) {
            this.sceneData = this.engine.loadSceneData;
            //console.log(this.sceneData)
        }

        this.gameObject.onHoverIn = (e) => {
            //鼠标移入
            console.log("Player onHoverIn");
        }

        this.gameObject.onHoverOut = (e) => {
            //鼠标移出
            console.log("Player onHoverOut");
        }

        this.gameObject.onClick = (e) => {
            //鼠标点击
            switch (e.button) {
                case 0:
                    console.log("左键");
                    break;
                case 1:
                    console.log("中键");
                    break;
                case 2:
                    console.log("右键");
                    break;
            }
            ArchiveSystem.readFile((file) => {
                const reader = new FileReader();
                reader.readAsText(file);
                reader.onload=()=>{
                    this.engine.loadScene('assets/engineTest/scenes/secondScene.yaml', reader.result.toString())
                }
            });
        }

        document.addEventListener('keyup', (e) => {
            if (this.engine.mode === 'edit') {
                return;
            }
            //console.log(getGameObjectById('TileMap').getBehaviour(TileMap).tileToWorldPosition(1, 1))
            switch (e.key) {
                case 'a':
                    transform.x -= this.speed;
                    break;
                case 'd':
                    transform.x += this.speed;
                    break;
                case 'w':
                    transform.y -= this.speed;
                    break;
                case 's':
                    transform.y += this.speed;
                    break;
                case 'z':
                    //发出声音，并自动循环播放
                    getGameObjectById("sound").getBehaviour(Sound).play();
                    getGameObjectById("sound").getBehaviour(Sound).loopPlay = true;
                    break;
                case 'x':
                    //暂停播放
                    getGameObjectById("sound").getBehaviour(Sound).pause();
                    break;
                case 'c':
                    //取消循环播放
                    getGameObjectById("sound").getBehaviour(Sound).loopPlay = false;
                    break;
                case 'v':
                    //暂停动画
                    getGameObjectById("animation").getBehaviour(AnimationRenderer).pauseAnimation = true;
                    break;
                case 'b':
                    //恢复动画
                    getGameObjectById("animation").getBehaviour(AnimationRenderer).pauseAnimation = false;
                    break;
                case 'n':
                    //隐藏动画
                    getGameObjectById("animation").active = false;
                    break;
                case 'm':
                    //显示动画
                    getGameObjectById("animation").active = true;
                    break;
                case 'l':
                    //在player周围随机生成绿点
                    const child = new GameObject();
                    this.gameObject.addChild(child);

                    const childTransform = new Transform();
                    childTransform.x = Math.random() * 100;
                    childTransform.y = Math.random() * 100;
                    child.addBehaviour(childTransform);

                    const childRenderer = new ShapeCircleRenderer();
                    childRenderer.radius = Math.random() % 30 + 20;
                    childRenderer.color = "#117744";
                    child.addBehaviour(childRenderer);
                    break;
                case 'k':
                    this.engine.loadScene("assets/engineTest/scenes/main.yaml", "123");
                    console.log("player: to main scene")
                    break;
                case 'j':
                    this.engine.loadScene("assets/engineTest/scenes/secondScene.yaml")
                    console.log("player: to second scene")
                    break;
                case 'h':
                    getGameObjectById("YellowCircle").active = false;
                    break;
                case 'g':
                    getGameObjectById("YellowCircle").active = true;
                    break;
            }
        })


        const gameModule = new GameModule();
        const personModule = new PersonModule();
        const roomModule = new RoomModule();

        personModule.personId = 1;
        personModule.personName = 'person1';
        personModule.race = PersonRace.Dwarf;
        personModule.animationId = 1;

        roomModule.roomId = 1;
        roomModule.level = 1;
        roomModule.roomSize = 1;
        roomModule.roomType = RoomType.WaterFactory;
        roomModule.position = {x: 1, y: 1};
        roomModule.people = [1];

        gameModule.gameTime = {day: 1, hour: 10, minute: 10, second: 30, rate: 1.0};
        gameModule.people = [personModule];
        gameModule.rooms = [roomModule];
        gameModule.water = 10;
        gameModule.food = 12;
        gameModule.food = 5;
        gameModule.material = 3;

        //ArchiveSystem.saveFile("testGame", gameModule);


        //console.log(ArchiveSystem.readFile('testGame'));

    }

    onPlayStart() {
        console.log("Player onPlayStart")
    }

    onTick(duringTime: number) {
        const prefab = getGameObjectById('Prefab');
        if (prefab.getBehaviour(Prefab).created) {
            //console.log(getGameObjectById('PrefabSquare').getBehaviour(Transform));
        }
    }

    onEnd() {
        super.onEnd();
        this.gameObject.children = [];
    }
}