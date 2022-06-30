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
    timepertick = 1.6;//控制每次ontick的游戏秒数

    private secondtime=0;//秒
    private mintime=0;//分钟
    private hourtime=0;//小时
    private isday = true;
    private daycount = 1; //经过了多少天

    @number()
    dayhourtime = 16;//白天总时间
    private speed= 1.0;

    @number()
    nighttime = 120;//夜晚时间长度 目前相当于现实2s
    private nownighttime = 0;
    //游戏开始时会执行一次
    onStart() {

    }

    //每次屏幕刷新执行
    onUpdate() {

    }

    //平均每16ms执行一次 60次是1s
    //1次ontick 游戏1.6秒  超过六十秒就-60s 分钟+1 分钟超过60-60s 小时进位 小时等于16时清0变为黑天
    onTick(duringTime: number) {  
        if(!this.isday){//黑夜
            this.nownighttime +=1;
            if(this.nownighttime>=this.nighttime){
                this.isday = true;
                this.daycount +=1;
                console.log(this.daycount);
                
            }
        }
        else{   
        this.secondtime += this.timepertick*this.speed;
        if(this.hourtime>=this.dayhourtime){
            this.hourtime = 0;
            this.isday = false;
            console.log("黑夜");
        }
        if(this.mintime>=60){
            this.mintime-=60;
            this.hourtime+=1;
        }

        if(this.secondtime>=60){
            this.secondtime-=60;
            this.mintime+=1;
        }
        //console.log(this.totalhourtime+"小时"+this.totalmintime+"分钟"+this.totalsecondtime+"秒");
         } 
       }

       getSecondTime(){
        return this.secondtime;           
       }

       getMinTime(){
        return this.mintime;
       }

       getHourTime(){
        return this.hourtime;
       }
       getspeed(){
        return this.speed;
       }

       setspeed(nowspeed:number){
        this.speed = nowspeed;
       }

       getdaycount(){
        return this.daycount;
       }

       gettotalgamesecondtime(){//得到游戏时长 以秒为单位
        return (this.daycount-1)*this.dayhourtime*3600+this.hourtime*3600+this.mintime*60+this.secondtime;
       }
}