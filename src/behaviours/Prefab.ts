import * as yaml from 'js-yaml';
import {Behaviour} from "../engine/Behaviour";
import {string} from "../engine/validators/string";
import {createGameObject, GameObject} from "../engine";

export class Prefab extends Behaviour {
    @string()
    prefabPath = "";//预制体路径

    created = false;

    prefab: GameObject;

    onStart() {
        if (this.prefabPath !== "") {
            this.prefab = this.unserilize(this.engine.resourceManager.getText(this.prefabPath));
            this.gameObject.children = [];
            this.gameObject.addChild(this.prefab);
        }
    }

    onTick(duringTime: number) {
        if (this.unserilize(this.engine.resourceManager.getText(this.prefabPath)) !== this.prefab) {
            this.gameObject.children = [];
            this.prefab = this.unserilize(this.engine.resourceManager.getText(this.prefabPath));
            this.gameObject.addChild(this.prefab);
        }
    }

    private unserilize(text: string): GameObject {
        try {
            let data = yaml.load(text);
            return createGameObject(data, this.engine);
        } catch (e) {
            console.log(e)
            console.log("配置文件解析失败", text);
            alert('配置文件解析失败')
        }
        return null;
    }
}