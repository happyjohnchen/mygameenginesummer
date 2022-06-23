import {
    Accordion,
    AccordionItem,
    Breadcrumb,
    BreadcrumbItem,
    Button,
    TreeItem,
    TreeView
} from "@microsoft/fast-components";
import {EditorHost} from "./EditorHost";


export class Assets {

    treeNode: TreeView
    fileBrowser: HTMLDivElement
    editorHostt: EditorHost

    constructor(editorHost: EditorHost) {
        this.treeNode = document.getElementById('file-tree') as TreeView;
        this.fileBrowser = document.getElementById('file-browser') as HTMLDivElement;
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
                    accordionItem.innerHTML = "<div slot=\"heading\">" + file.split('/').slice(-1)[0] + "</div>";
                    if (file.endsWith('.yaml')) {
                        const button = new Button();
                        button.innerText = "加载此场景";
                        button.onclick = async () => {
                            await editorHost.execute('loadScene', file);
                            location.reload();
                        }
                        accordionItem.appendChild(button);
                    } else if (file.endsWith('.ts')) {
                        const button = new Button();
                        button.innerText = "使用VSCode编辑此脚本";
                        button.onclick = async () => {
                            const filePath = path.join(__dirname.split("node_modules")[0], file)
                            console.log(filePath);
                            window.open("vscode://file/" + filePath, '_self');
                        }
                        accordionItem.appendChild(button);
                    } else if (file.endsWith('.png') || file.endsWith('.jpg')) {
                        const image = new Image();
                        image.src = file;
                        accordionItem.appendChild(image);
                    }
                    accordion.appendChild(accordionItem);
                }
                fileBrowser.appendChild(accordion);
                e.stopPropagation();
            }
        }

        readFileList('assets', this.treeNode, this.fileBrowser, this.editorHostt);

    }
}

