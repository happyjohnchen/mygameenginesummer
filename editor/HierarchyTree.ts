import {Button, TreeItem, TreeView} from "@microsoft/fast-components";
import {EditorHost} from "./EditorHost";
import type {GameObjectInfo} from '../src/types'
import {InspectorPanel} from "./InspectorPanel";


export class HierarchyTree {

    private treeNode: TreeView
    private addGameObjectButton: Button

    constructor(private editorHost: EditorHost) {
        this.treeNode = document.getElementById('hierarchy-tree') as TreeView;
        this.addGameObjectButton = document.getElementById('add-game-object-button') as Button;
    }

    async start(inspectorPanel: InspectorPanel) {
        const gameObjects = await this.editorHost.execute('getAllGameObjects', null);

        function createTreeItem(container: HTMLElement, info: GameObjectInfo, editorHost: EditorHost) {
            const treeItem = new TreeItem();
            treeItem.addEventListener('click', (e) => {
                inspectorPanel.onSelectGameObject(info.uuid);
                e.stopPropagation();
            })
            treeItem.innerText = info.name;
            container.appendChild(treeItem);
            const gameObjectChildren = info.children || [];
            for (const child of gameObjectChildren) {
                createTreeItem(treeItem, child, editorHost)
            }
        }

        //仅显示RootGameObject（uuid=1）
        createTreeItem(this.treeNode, gameObjects[0], this.editorHost);


        //创建GameObject按钮
        this.addGameObjectButton.onclick = async () => {
            const parentUUID = inspectorPanel.selectedGameObjectUUID;
            await this.editorHost.execute('createNewGameObject', parentUUID);
            location.reload();
        }
    }
}

