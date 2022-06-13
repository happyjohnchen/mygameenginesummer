export class ResourceManager {

    cache: { [url: string]: string } = {};

    loadText(url: string, callback: () => void) {
        const xhr = new XMLHttpRequest();
        xhr.open('get', url);
        xhr.send();
        xhr.onload = () => {
            this.cache[url] = xhr.responseText;
            callback();
        }
    }

    get(url: string) {
        return this.cache[url];
    }
}