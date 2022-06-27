import * as yaml from 'js-yaml';
import {Behaviour} from "../engine/Behaviour";
import {string} from "../engine/validators/string";
import {ResourceManager} from "../engine/ResourceManager";
import {createGameObject, GameObject} from "../engine";

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
            const prefabObject = this.unserilize(resourceManager.get(this.prefabPath));

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
                    visitChildren(child);
                }
            }

            visitChildren(prefabObject);

            console.log(prefabObject);
        });
    }

    private unserilize(text: string): GameObject {
        try {
            return yaml.load(text);
        } catch (e) {
            console.log(e)
            console.log("配置文件解析失败", text);
            alert('配置文件解析失败')
        }
        return null;
    }
}