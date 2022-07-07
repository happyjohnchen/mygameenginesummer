import {Behaviour} from "../../src/engine/Behaviour";
import {number} from "../../src/engine/validators/number";
import {randomNumber} from "./RandomSys";
import {GameSet} from "./GameSet";
import {getGameObjectById} from "../../src/engine";
import {GameController} from "./GameController";

export class TimeControllerSystem extends Behaviour {

    /* 时间控制系统
    游戏里白天一共16h
    现实ontick等于游戏n秒（目前1.6）
    16h后进入黑夜 并天数+1
    可以通过get函数拿到时间
    可以通过set函数调整倍速
    */

    @number()
    timePerTick = 1.6;//控制每次ontick的游戏秒数

    private secondTime = 0;//秒
    private minTime = 0;//分钟
    private hourTime = 0;//小时
    private isDay = true;
    private dayCount = 1; //经过了多少天

    private nightRandom = false;
    private maxMinusPercent = 30;//夜间最多减少百分之几的资源
    private game: GameSet

    @number()

    dayHourTime = 16;//白天总时间
    speed = 1.0;


    @number()
    nightTime = 300;//夜晚时间长度 目前相当于现实5s
    private nowNightTime = 0;

    //游戏开始时会执行一次
    onStart() {
    }

    onPlayStart() {
        //使用键盘控制倍速
        window.addEventListener('keyup', (e) => {
            switch (e.key) {
                case ' ':
                    this.speed = 0.0;
                    break;
                case '1':
                    this.speed = 1.0;
                    break;
                case '2':
                    this.speed = 2.0;
                    break;
                case '3':
                    this.speed = 3.0;
                    break;
            }
        });
    }

    //每次屏幕刷新执行
    onUpdate() {

    }

    //平均每16ms执行一次 60次是1s
    //1次ontick 游戏1.6秒  超过六十秒就-60s 分钟+1 分钟超过60-60s 小时进位 小时等于16时清0变为黑天

    onTick(duringTime: number) {
        if (!this.isDay) {
            //放夜晚图
            getGameObjectById("NightTime").active = true;
            //获取游戏控制器
            this.game = getGameObjectById("GameController").getBehaviour(GameController).game;
            //随机减少
            if (!this.nightRandom) {
                console.log("夜晚开始:material" + this.game.material + ",energy" + this.game.energy + ",food" + this.game.food + ",water" + this.game.water);
                this.nightRandom = true;
                //随机减少几种资源
                switch (randomNumber(3)) {
                    case 0:
                        console.log("今夜平安夜，没有损失")
                        break;
                    case 1:
                        //减少一种资源
                        switch (randomNumber(4)) {
                            case 0:
                                this.game.material = Math.floor(Math.max(this.game.material * (1 - randomNumber(this.maxMinusPercent) / 100), this.game.material - 50));
                                break
                            case 1:
                                this.game.energy = Math.floor(Math.max(this.game.energy * (1 - randomNumber(this.maxMinusPercent) / 100), this.game.energy - 50));
                                break
                            case 2:
                                this.game.food = Math.floor(Math.max(this.game.food * (1 - randomNumber(this.maxMinusPercent) / 100), this.game.food - 50));
                                break
                            case 3:
                                this.game.water = Math.floor(Math.max(this.game.water * (1 - randomNumber(this.maxMinusPercent) / 100), this.game.water - 50));
                                break
                        }
                        break;
                    case 2:
                        //减少两种资源
                        switch (randomNumber(6)) {
                            case 0:
                                this.game.material = Math.floor(Math.max(this.game.material * (1 - randomNumber(this.maxMinusPercent) / 100), this.game.material - 50));
                                this.game.energy = Math.floor(Math.max(this.game.energy * (1 - randomNumber(this.maxMinusPercent) / 100), this.game.energy - 50));
                                break
                            case 1:
                                this.game.material = Math.floor(Math.max(this.game.material * (1 - randomNumber(this.maxMinusPercent) / 100), this.game.material - 50));
                                this.game.food = Math.floor(Math.max(this.game.food * (1 - randomNumber(this.maxMinusPercent) / 100), this.game.food - 50));
                                break
                            case 2:
                                this.game.material = Math.floor(Math.max(this.game.material * (1 - randomNumber(this.maxMinusPercent) / 100), this.game.material - 50));
                                this.game.water = Math.floor(Math.max(this.game.water * (1 - randomNumber(this.maxMinusPercent) / 100), this.game.water - 50));
                                break
                            case 3:
                                this.game.energy = Math.floor(Math.max(this.game.energy * (1 - randomNumber(this.maxMinusPercent) / 100), this.game.energy - 50));
                                this.game.food = Math.floor(Math.max(this.game.food * (1 - randomNumber(this.maxMinusPercent) / 100), this.game.food - 50));
                                break
                            case 4:
                                this.game.energy = Math.floor(Math.max(this.game.energy * (1 - randomNumber(this.maxMinusPercent) / 100), this.game.energy - 50));
                                this.game.water = Math.floor(Math.max(this.game.water * (1 - randomNumber(this.maxMinusPercent) / 100), this.game.water - 50));
                                break
                            case 5:
                                this.game.food = Math.floor(Math.max(this.game.food * (1 - randomNumber(this.maxMinusPercent) / 100), this.game.food - 50));
                                this.game.water = Math.floor(Math.max(this.game.water * (1 - randomNumber(this.maxMinusPercent) / 100), this.game.water - 50));
                                break
                        }
                        break;
                }
                console.log("夜晚结束:material" + this.game.material + ",energy" + this.game.energy + ",food" + this.game.food + ",water" + this.game.water);
            }

            //黑夜
            this.nowNightTime += 1;
            if (this.nowNightTime >= this.nightTime) {
                this.isDay = true;
                this.dayCount += 1;
                console.log("TimeSystem: 进入第" + this.dayCount + "天")
            }
        } else {
            //白天
            getGameObjectById("NightTime").active = false;
            this.nightRandom = false;
            this.secondTime += this.timePerTick * this.speed;
            if (this.hourTime >= this.dayHourTime) {
                this.hourTime = 0;
                this.isDay = false;
                console.log("TimeSystem: 黑夜");
            }
            if (this.minTime >= 60) {
                this.minTime -= 60;
                this.hourTime += 1;
            }

            if (this.secondTime >= 60) {
                this.secondTime -= 60;
                this.minTime += 1;
            }
            //console.log(this.totalhourtime+"小时"+this.totalmintime+"分钟"+this.totalsecondtime+"秒");

        }
    }

    setInitialTime(day: number, hour: number, minute: number, second: number) {
        this.dayCount = day;
        this.hourTime = hour;
        this.minTime = minute;
        this.secondTime = second;
    }

    getSecondTime() {
        return this.secondTime;
    }

    getMinTime() {
        return this.minTime;
    }

    getHourTime() {
        return this.hourTime;
    }

    getSpeed() {
        return this.speed;
    }

    setSpeed(nowSpeed: number) {
        this.speed = nowSpeed;
    }

    getDayCount() {
        return this.dayCount;
    }

    getTotalGameSecondTime() {//得到游戏时长 以秒为单位
        return (this.dayCount - 1) * this.dayHourTime * 3600 + this.hourTime * 3600 + this.minTime * 60 + this.secondTime;
    }

}