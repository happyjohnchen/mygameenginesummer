import {Behaviour} from "../../src/engine/Behaviour";
import {Transform} from "../../src/engine/Transform";
import {number} from "../../src/engine/validators/number";
import {getGameObjectById} from "../../src/engine";
import {Sound} from "../../src/behaviours/Sound";
import {AnimationRenderer} from "../../src/behaviours/AnimationRenderer";

export class Player extends Behaviour {
    @number()
    speed = 1;

    onStart() {
        const transform = this.gameObject.getBehaviour(Transform);
        document.addEventListener('keydown', (e) => {
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
            }
        })
    }
}