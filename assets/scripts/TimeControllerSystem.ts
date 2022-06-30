import {Behaviour} from "../../src/engine/Behaviour";
import { number } from "../../src/engine/validators/number";

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

    private secondTime=0;//秒
    private minTime=0;//分钟
    private hourTime=0;//小时
    private isDay = true;
    private dayCount = 1; //经过了多少天

    @number()
    dayHourTime = 16;//白天总时间 以小时为单位
    private speed= 1.0;

    @number()
    nightTime = 120;//夜晚时间长度 目前相当于现实2s
    private nowNightTime = 0;
    //游戏开始时会执行一次
    onStart() {

    }

    //每次屏幕刷新执行
    onUpdate() {

    }

    //平均每16ms执行一次 60次是1s
    //1次ontick 游戏1.6秒  超过六十秒就-60s 分钟+1 分钟超过60-60s 小时进位 小时等于16时清0变为黑天
    onTick(duringTime: number) {  
        if(!this.isDay){//黑夜
            this.nowNightTime +=1;
            if(this.nowNightTime>=this.nightTime){
                this.isDay = true;
                this.dayCount +=1;
                console.log(this.dayCount);
                
            }
        }
        else{   
        this.secondTime += this.timePerTick*this.speed;
        if(this.hourTime>=this.dayHourTime){
            this.hourTime = 0;
            this.isDay = false;
            console.log("黑夜");
        }
        if(this.minTime>=60){
            this.minTime-=60;
            this.hourTime+=1;
        }

        if(this.secondTime>=60){
            this.secondTime-=60;
            this.minTime+=1;
        }
        //console.log(this.totalhourtime+"小时"+this.totalmintime+"分钟"+this.totalsecondtime+"秒");
         } 
       }

       getSecondTime(){
        return this.secondTime;           
       }

       getMinTime(){
        return this.minTime;
       }

       getHourTime(){
        return this.hourTime;
       }
       getSpeed(){
        return this.speed;
       }

       setSpeed(nowspeed:number){
        this.speed = nowspeed;
       }

       getDaycount(){
        return this.dayCount;
       }

       getTotalGameSecondTime(){//得到游戏时长 以秒为单位
        return (this.dayCount-1)*this.dayHourTime*3600+this.hourTime*3600+this.minTime*60+this.secondTime;
       }
}