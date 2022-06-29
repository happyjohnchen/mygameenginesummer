import {GameModule} from "../modules/GameModule";

import fs from "fs";

export class ArchiveSystem {
    static saveFile(fileName: string, gameModule: GameModule) {
        const content = JSON.stringify(gameModule);
        const blob = new Blob(['\ufeff' + content], {type: 'text/json,charset-UTF-8'});
        this.openDownloadDialog(blob, fileName + ".json");
    }

    static readFile(onFileRead: Function) {
        return JSON.parse(fs.readFileSync("").toString());
    }

    static openDownloadDialog = (url, fileName) => {
        if (typeof url === 'object' && url instanceof Blob) {
            url = URL.createObjectURL(url); // 创建blob地址
        }
        const aLink = document.createElement('a');
        aLink.href = url;
        aLink.download = fileName;
        aLink.click();
    }
}