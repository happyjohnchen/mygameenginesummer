import {
    allComponents,
    Button,
    provideFASTDesignSystem
} from "@microsoft/fast-components";
import {EditorHost} from "./EditorHost";
import {HierarchyTree} from "./HierarchyTree";
import {InspectorPanel} from "./InspectorPanel";
import {Assets} from "./Assets";

provideFASTDesignSystem().register(allComponents);


async function startup() {
    const editorHost = new EditorHost();

    //保存按钮
    const saveButton = document.getElementById("save-button") as Button;
    saveButton.onclick = async () => {
        const response = await editorHost.execute('getSceneSerializedData', null);
        const fs = require("fs");
        const currentSceneName = await editorHost.execute('getCurrentSceneName', null);
        fs.writeFileSync(currentSceneName, response);
        alert('保存成功')
    };

    //刷新按钮
    const refreshButton = document.getElementById("refresh-button") as Button;
    refreshButton.onclick = () => {
        location.reload();
    }

    //编辑/运行按钮
    const playButton = document.getElementById('play-button') as Button;
    const editButton = document.getElementById('edit-button') as Button;
    editButton.innerText = ">编辑<";
    playButton.onclick = () => {
        editorHost.send({command: "changeMode", data: "play"})
        playButton.innerText = ">运行<";
        editButton.innerText = "编辑";
    }
    editButton.onclick = () => {
        editorHost.send({command: "changeMode", data: "edit"})
        playButton.innerText = "运行";
        editButton.innerText = ">编辑<";
    }

    //场景显示
    const currentScene = document.getElementById('current-scene') as HTMLElement;
    const fs = require('fs');
    currentScene.innerText = fs.readFileSync('src/defaultScene.txt').toString();

    await editorHost.start();

    const inspector = new InspectorPanel(editorHost);
    const hierarchyTree = new HierarchyTree(editorHost);
    const assetPanel = new Assets(editorHost);
    await hierarchyTree.start(inspector);
    await assetPanel.start();
}

startup();
