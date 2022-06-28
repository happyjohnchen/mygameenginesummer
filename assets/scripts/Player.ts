import {Behaviour} from "../../src/engine/Behaviour";
import {Transform} from "../../src/engine/Transform";
import {number} from "../../src/engine/validators/number";
import {GameObject, getGameObjectById} from "../../src/engine";
import {Sound} from "../../src/behaviours/Sound";
import {AnimationRenderer} from "../../src/behaviours/AnimationRenderer";
import {ShapeCircleRenderer} from "../../src/behaviours/ShapeCircleRenderer";
import {TileMap} from "../../src/behaviours/TileMap";

export class Player extends Behaviour {
    @number()
    speed:number = 1;

    sceneData?: any;

    onStart() {
        const transform = this.gameObject.getBehaviour(Transform);
        if (this.engine.loadSceneData && this.engine.loadSceneData !== this.sceneData) {
            this.sceneData = this.engine.loadSceneData;
            console.log(this.sceneData)
        }

        this.gameObject.onHoverIn=(e)=>{
            //鼠标移入
            console.log("Player onHoverIn");
        }

        this.gameObject.onHoverOut=(e)=>{
            //鼠标移出
            console.log("Player onHoverOut");
        }

        this.gameObject.onClick = (e) => {
            //鼠标移出
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
        }

        document.addEventListener('keyup', (e) => {
            console.log(getGameObjectById('TileMap').getBehaviour(TileMap).tileToWorldPosition(1, 1))
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
                    this.engine.loadScene("assets/scenes/main.yaml", "123");
                    console.log("player: to main scene")
                    break;
                case 'j':
                    this.engine.loadScene("assets/scenes/secondScene.yaml")
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
    }
}