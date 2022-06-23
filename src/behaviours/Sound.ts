import {Behaviour} from "../engine/Behaviour";
import {string} from "../engine/validators/string";
import {boolean} from "../engine/validators/boolean";

export class Sound extends Behaviour {
    @string()
    soundPath = "";

    @boolean()
    autoPlay = false;//自动开始播放

    @boolean()
    loopPlay = false;//循环播放

    private audio: HTMLAudioElement;

    constructor() {
        super();
    }

    onStart() {
        this.audio = document.createElement('audio');
        this.audio.setAttribute('id', "sound-" + this.gameObject.uuid);
        this.audio.setAttribute('src', this. soundPath);
        this.audio.setAttribute('hidden', 'true');
        document.body.appendChild(this.audio);
        this.audio.loop = this.loopPlay;
        console.log("autoplay:" + this.autoPlay);
        console.log("loopplay:" + this.loopPlay);
        if (this.autoPlay) {
            this.play();
        }
        console.log(this.audio)
    }

    play() {
        this.audio.play();
    }

    pause() {
        this.audio.pause();
    }

    onEnd() {
        document.body.removeChild(this.audio);
    }
}