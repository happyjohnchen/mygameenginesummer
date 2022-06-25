import {
    Accordion,
    AccordionItem,
    Breadcrumb,
    BreadcrumbItem,
    Button, TextField,
    TreeItem,
    TreeView
} from "@microsoft/fast-components";
import {EditorHost} from "./EditorHost";


export class Assets {

    treeNode: TreeView
    fileBrowser: HTMLDivElement
    fileHandler: HTMLDivElement
    editorHostt: EditorHost

    constructor(editorHost: EditorHost) {
        this.treeNode = document.getElementById('file-tree') as TreeView;
        this.fileBrowser = document.getElementById('file-browser') as HTMLDivElement;
        this.fileHandler = document.getElementById('file-handler') as HTMLDivElement;
        this.editorHostt = editorHost;
    }

    async start() {
        const fs = require('fs');
        const path = require('path');

        //文件树
        function readFileList(dir: string, container: HTMLElement, fileBrowser: HTMLDivElement, editorHost: EditorHost) {
            const treeItem = new TreeItem();
            const fileList = [];
            treeItem.innerText = dir.split('/').slice(-1)[0];//文件夹名称
            container.appendChild(treeItem);
            const files = fs.readdirSync(dir);
            files.forEach((item) => {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                    fileList.push(fullPath);
                    readFileList(path.join(dir, item), treeItem, fileBrowser, editorHost);  //递归读取文件
                } else {
                    if (!item.startsWith('.')) {
                        fileList.push(fullPath);
                    }
                }
            });
            treeItem.onclick = (e) => {
                //选中了当前文件夹
                fileBrowser.innerHTML = '';
                const fileNameInput = document.getElementById('file-name-input') as TextField;
                const newDirectoryButton = document.getElementById('new-directory-button') as Button;
                const newScriptButton = document.getElementById('new-script-button') as Button;
                const newSceneButton = document.getElementById('new-scene-button') as Button;
                //新建文件夹
                newDirectoryButton.onclick = () => {
                    const newDirectoryName = fileNameInput.currentValue;
                    if (newDirectoryName && newDirectoryName !== "") {
                        const newDirectoryFullPath = path.join(dir, newDirectoryName);
                        if (!fs.existsSync(newDirectoryFullPath)) {
                            fs.mkdirSync(newDirectoryFullPath);
                            alert("新建文件夹" + newDirectoryFullPath);
                        }
                    }
                }
                //新建脚本
                newScriptButton.onclick = () => {
                    if (fileNameInput.currentValue && fileNameInput.currentValue !== "") {
                        const newScriptPath = path.join(dir, fileNameInput.currentValue + ".ts");
                        if (!fs.existsSync(newScriptPath)) {
                            const scriptDemo = fs.readFileSync('src/behaviours/BehaviourDemo.ts');
                            fs.writeFileSync(newScriptPath, scriptDemo);
                            alert("新建脚本" + newScriptPath);
                        }
                    }
                }
                //新建场景
                newSceneButton.onclick = () => {
                    if (fileNameInput.currentValue && fileNameInput.currentValue !== "") {
                        const newScenePath = path.join(dir, fileNameInput.currentValue + ".yaml");
                        if (!fs.existsSync(newScenePath)) {
                            const sceneDemo = fs.readFileSync('src/engine/SceneDemo.yaml');
                            fs.writeFileSync(newScenePath, sceneDemo);
                            alert("新建场景" + newScenePath);
                        }
                    }
                }
                //显示当前路径
                const breadcrumb = new Breadcrumb();
                for (const direction of dir.split('/')) {
                    const breadcrumbItem = new BreadcrumbItem();
                    breadcrumbItem.innerText = direction;
                    breadcrumb.appendChild(breadcrumbItem);
                }
                fileBrowser.appendChild(breadcrumb);
                //显示文件
                const accordion = new Accordion();
                for (const file of fileList) {
                    const accordionItem = new AccordionItem();
                    const stat = fs.statSync(file);
                    if (stat.isDirectory()) {
                        accordionItem.innerHTML = "<div slot=\"heading\">" + file.split('/').slice(-1)[0] + "/</div>";
                    } else {
                        accordionItem.innerHTML = "<div slot=\"heading\">" + file.split('/').slice(-1)[0] + "</div>";
                    }
                    if (file.endsWith('.yaml')) {
                        //场景
                        const button = new Button();
                        button.innerText = "加载此场景";
                        button.onclick = async () => {
                            await editorHost.execute('loadScene', file);
                            const fs = require('fs');
                            fs.writeFileSync('src/defaultScene', file);
                            location.reload();
                        }
                        accordionItem.appendChild(button);
                    } else if (file.endsWith('.ts') || file.endsWith('.js')) {
                        //脚本
                        const button = new Button();
                        button.innerText = "使用VSCode编辑此脚本";
                        button.onclick = async () => {
                            const filePath = path.join(__dirname.split("node_modules")[0], file)
                            console.log(filePath);
                            window.open("vscode://file/" + filePath, '_self');
                        }
                        accordionItem.appendChild(button);
                    } else if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.JPG')) {
                        //图片
                        const image = new Image();
                        image.src = file;
                        accordionItem.appendChild(image);
                    }
                    //删除文件
                    const button = new Button();
                    if (stat.isDirectory()) {
                        button.innerText = "删除文件夹";
                        button.onclick = () => {
                            if (confirm("确认删除文件夹" + file)) {
                                if (!fs.existsSync(file)) {
                                    alert("文件夹不存在")
                                    return;
                                }
                                if (fs.readdirSync(file).length !== 0) {
                                    console.log(fs.readdirSync(file))
                                    alert("文件夹非空")
                                    return;
                                }
                                fs.rmdirSync(file);
                            }
                        }
                    } else {
                        button.innerText = "删除文件";
                        button.onclick = () => {
                            if (confirm("确认删除文件" + file)) {
                                if (fs.existsSync(file)) {
                                    fs.rmSync(file);
                                }
                            }
                        }
                    }
                    accordionItem.appendChild(button);
                    accordion.appendChild(accordionItem);
                }
                fileBrowser.appendChild(accordion);
                e.stopPropagation();
            }
        }

        readFileList('assets', this.treeNode, this.fileBrowser, this.editorHostt);

    }
}

