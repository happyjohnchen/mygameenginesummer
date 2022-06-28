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
            const text = resourceManager.get(this.prefabPath);
            const prefab = this.unserilize(text);
            for (const child of prefab.children){
                this.gameObject.addChild(child);
            }
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