import {GameModule} from "../modules/GameModule"

export class ArchiveSystem {
    static encryptArchive = false;//是否对存档文件加密
    static fileEncryptSuffix = ".psa";//加密文件的后缀名

    static saveFile(fileName: string, gameModule: GameModule) {
        let content = JSON.stringify(gameModule);
        if (this.encryptArchive){
            //使用base64编码
            content = window.btoa(content);
        }
        const blob = new Blob(['\ufeff' + content], {type: 'text/json,charset-UTF-8'});
        this.openDownloadDialog(blob, fileName + (this.encryptArchive ? this.fileEncryptSuffix : ".json"));
    }

    static readFile(onFileRead: (file: File) => void) {
        const head = document.head;
        const selector = document.createElement('input') as HTMLInputElement;
        selector.type = 'file';
        selector.accept = (this.encryptArchive ? this.fileEncryptSuffix : ".json");
        selector.style.display = 'none';
        head.appendChild(selector);
        selector.click();
        const interval = setInterval(() => {
            if (selector.files[0]) {
                clearInterval(interval);//停止定时器
                onFileRead(selector.files[0]);
                return;
            }
        }, 100)

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