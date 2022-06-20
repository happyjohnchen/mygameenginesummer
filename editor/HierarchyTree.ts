import {Button, TextField, TreeItem, TreeView} from "@microsoft/fast-components";
import { EditorHost } from "./EditorHost";
import type { GameObjectInfo } from '../src/types'
import { InspectorPanel } from "./InspectorPanel";


export class HierarchyTree {

    private treeNode: TreeView
    private addGameObjectButton: Button
    constructor(private editorHost: EditorHost) {
        this.treeNode = document.getElementById('hierarchy-tree') as TreeView;
        this.addGameObjectButton = document.getElementById('add-game-object-button') as Button;
    }

    async start(inspectorPanel: InspectorPanel) {
        const gameObjects = await this.editorHost.execute('getAllGameObjects', null);
        console.log(gameObjects);

        function createTreeItem(container: HTMLElement, info: GameObjectInfo) {
            const treeItem = new TreeItem();
            treeItem.addEventListener('click', (e) => {
                console.log('点击了' + info.name, info.uuid)
                inspectorPanel.onSelectGameObject(info.uuid);
                e.stopPropagation();
            })
            treeItem.innerText = info.name;
            container.appendChild(treeItem);
            const gameObjectChildren = info.children || [];
            for (const child of gameObjectChildren) {
                createTreeItem(treeItem, child)
            }
        }

        for (const gameObject of gameObjects) {
            if(gameObject.id === "RootGameObject")
                continue;
            createTreeItem(this.treeNode, gameObject);
        }

        this.addGameObjectButton.onclick = async () => {
            const parentUUID = inspectorPanel.selectedGameObjectUUID;
            await this.editorHost.execute('createNewGameObject', parentUUID);
            location.reload();
        }
    }
}

