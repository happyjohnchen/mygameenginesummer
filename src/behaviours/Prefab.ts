import * as yaml from 'js-yaml';
import {Behaviour} from "../engine/Behaviour";
import {string} from "../engine/validators/string";
import {ResourceManager} from "../engine/ResourceManager";
import {createGameObject, GameObject} from "../engine";
import {Transform} from "../engine/Transform";

export class Prefab extends Behaviour {
    @string()
    prefabPath = "";//预制体路径

    onStart() {
        if (!this.prefabPath.endsWith('.yaml')) {
            console.log("Prefab:", this.prefabPath, "不是yaml文件");
            return;
        }
        const resourceManager = new ResourceManager();
        resourceManager.loadText(this.prefabPath, () => {
            const text = resourceManager.get(this.prefabPath);
            const prefab = this.unserilize(text);
            const prefabGameObject = new GameObject();
            prefabGameObject.addBehaviour(new Transform());

            //移除Prefab中的camera
            function visitChildren(gameObject: GameObject) {
                for (const child of gameObject.children) {
                    if (child.id === 'camera') {
                        const index = gameObject.children.indexOf(child);
                        if (index >= 0) {
                            gameObject.children.splice(index, 1);
                        }
                        return;
                    }
                }
            }

            visitChildren(prefab);

            this.gameObject.addChild(prefab);
        });
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