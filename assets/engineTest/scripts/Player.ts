import {Behaviour} from "../../../src/engine/Behaviour";
import {Transform} from "../../../src/engine/Transform";
import {number} from "../../../src/engine/validators/number";
import {GameObject, getGameObjectById, hasGameObjectById} from "../../../src/engine";
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
        console.log("player onStart");
        console.log(getGameObjectById('sound').getBehaviour(Sound))
    }

    onPlayStart() {
        console.log("player onPlayerStart, data: " + this.engine.loadSceneData as string);

        //读取存档
        try{
            let gameDataJSON = decodeURI(this.engine.loadSceneData);
            if (ArchiveSystem.encryptArchive){
                //base64解码
                gameDataJSON = window.atob(gameDataJSON);
            }
            const gModule = JSON.parse(gameDataJSON) as GameModule;//gMoudle是获取到的GameModule对象
            console.log(gModule);
        } catch (e){
            console.log("Player: loadSceneData没有被解析，因为其不是JSON格式")
        }


        const transform = this.gameObject.getBehaviour(Transform);
        if (this.engine.loadSceneData && this.engine.loadSceneData !== this.sceneData) {
            this.sceneData = this.engine.loadSceneData;
            //console.log(this.sceneData)
        }

        this.gameObject.onHoverIn = (e) => {
            //鼠标移入
            console.log("Player onHoverIn");
            //alert("hoverIn")
        }

        this.gameObject.onHoverOut = (e) => {
            //鼠标移出
            console.log("Player onHoverOut");
            //alert("hoverOut")
        }

        this.gameObject.onClick = (e) => {
            //鼠标点击
            switch (e.button) {
                case 0:
                    alert("左键");
                    break;
                case 1:
                    console.log("中键");
                    break;
                case 2:
                    console.log("右键");
                    break;
            }
            return;

            //点击player读取存档
            ArchiveSystem.readFile((file) => {
                const reader = new FileReader();
                reader.readAsText(file);
                reader.onload=()=>{
                    //跳转下一个场景并传递参数
                    this.engine.loadScene('assets/engineTest/scenes/secondScene.yaml', reader.result.toString())
                }
            });
        }

        document.addEventListener('keyup', (e) => {
            if (this.engine.mode === 'edit') {
                return;
            }
            const camera = getGameObjectById('camera');
            //console.log(getGameObjectById('TileMap').getBehaviour(TileMap).tileToWorldPosition(1, 1))
            switch (e.key) {
                case 'a':
                    camera.getBehaviour(Transform).x -= this.speed;
                    break;
                case 'd':
                    camera.getBehaviour(Transform).x += this.speed;
                    break;
                case 'w':
                    camera.getBehaviour(Transform).y -= this.speed;
                    break;
                case 's':
                    camera.getBehaviour(Transform).y += this.speed;
                    break;
                case 'q':
                    camera.getBehaviour(Transform).scaleX += 0.1;
                    camera.getBehaviour(Transform).scaleY += 0.1;
                    break;
                case 'e':
                    camera.getBehaviour(Transform).scaleX -= 0.1;
                    camera.getBehaviour(Transform).scaleY -= 0.1;
                    break;
                case 'z':
                    //发出声音，并自动循环播放
                    if (hasGameObjectById('sound')){
                        getGameObjectById("sound").getBehaviour(Sound).play();
                        getGameObjectById("sound").getBehaviour(Sound).loopPlay = true;
                    }
                    break;
                case 'x':
                    //暂停播放
                    if (hasGameObjectById('sound')) {
                        getGameObjectById("sound").getBehaviour(Sound).pause();
                    }
                    break;
                case 'c':
                    //取消循环播放
                    if (hasGameObjectById('sound')) {
                        getGameObjectById("sound").getBehaviour(Sound).loopPlay = false;
                    }
                    break;
                case 'v':
                    //暂停动画
                    if (hasGameObjectById('animation')) {
                        getGameObjectById("animation").getBehaviour(AnimationRenderer).pauseAnimation = true;
                    }
                    break;
                case 'b':
                    //恢复动画
                    if (hasGameObjectById('animation')) {
                        getGameObjectById("animation").getBehaviour(AnimationRenderer).pauseAnimation = false;
                    }
                    break;
                case 'n':
                    //隐藏动画
                    if (hasGameObjectById('animation')) {
                        getGameObjectById("animation").active = false;
                    }
                    break;
                case 'm':
                    //显示动画
                    if (hasGameObjectById('animation')) {
                        getGameObjectById("animation").active = true;
                    }
                    break;
                case 'l':
                    //在player周围随机生成绿点
                    const child = new GameObject();

                    const childTransform = new Transform();
                    childTransform.x = Math.random() * 100;
                    childTransform.y = Math.random() * 100;
                    child.addBehaviour(childTransform);

                    const childRenderer = new ShapeCircleRenderer();
                    childRenderer.radius = Math.random() % 30 + 20;
                    childRenderer.color = "#117744";
                    child.addBehaviour(childRenderer);

                    this.gameObject.addChild(child);
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
                    if (hasGameObjectById('YellowCircle')) {
                        getGameObjectById("YellowCircle").active = false;
                    }
                    break;
                case 'g':
                    if (hasGameObjectById('YellowCircle')) {
                        getGameObjectById("YellowCircle").active = true;
                    }
                    break;
                case 'f':
                    this.gameObject.removeSelf();
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
        roomModule.roomType = RoomType.Entrance;
        roomModule.position = {x: 1, y: 1};
        roomModule.people = [1];

        gameModule.gameTime = {day: 1, hour: 10, minute: 10, second: 30, rate: 1.0};
        gameModule.people = [personModule];
        gameModule.rooms = [roomModule];
        gameModule.water = 10;
        gameModule.food = 12;
        gameModule.energy = 5;
        gameModule.material = 3;

        //保存存档
        //ArchiveSystem.saveFile("testGame", gameModule);

    }

    onTick(duringTime: number) {
        if (hasGameObjectById('Prefab')){
            const prefab = getGameObjectById('Prefab');

        }
    }

    onEnd() {
        super.onEnd();
        this.gameObject.children = [];
    }
}