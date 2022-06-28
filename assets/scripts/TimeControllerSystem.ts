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

    private totalsecondtime=0;//秒
    private totalmintime=0;//分钟
    private totalhourtime=0;//小时
    private isday = true;
    private daycount = 1; //经过了多少天

    @number()
    dayhourtime = 16;//白天总时间
    private speed= 1.0;

    @number()
    nighttime = 120;//夜晚时间长度
    private nownighttime = 0;
    //游戏开始时会执行一次
    onStart() {

    }

    //每次屏幕刷新执行
    onUpdate() {

    }

    //平均每16ms执行一次 60次是1s
    //1次ontick 游戏1.6秒  超过六十秒就-60s 分钟+1 分钟超过60-60s 小时进位 小时等于16s时清0变为黑天
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
        this.totalsecondtime += this.timepertick*this.speed;
        if(this.totalhourtime>=this.dayhourtime){
            this.totalhourtime = 0;
            this.isday = false;
            console.log("黑夜");
        }
        if(this.totalmintime>=60){
            this.totalmintime-=60;
            this.totalhourtime+=1;
        }

        if(this.totalsecondtime>=60){
            this.totalsecondtime-=60;
            this.totalmintime+=1;
        }
        //console.log(this.totalhourtime+"小时"+this.totalmintime+"分钟"+this.totalsecondtime+"秒");
         } 
       }

       getSecondTime(){
        return this.totalsecondtime;           
       }

       getMinTime(){
        return this.totalmintime;
       }

       getHourTime(){
        return this.totalhourtime;
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
}