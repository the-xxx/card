// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: require("base").CBase, // 组件基类，以后按钮都用这个，自动调用onMessage方法

    properties: {
        cardPrefab:{
            default: null,
            type: cc.Prefab
        },
        dealbutton: {
            default: null,
            type: cc.Button
        },
        comparebutton: {
            default: null,
            type: cc.Button
        },
    },

    createCard: function(pos){
        // get residx for random
        let cardIdx1 = Math.round(Math.random()*3) * 100 + Math.round(Math.random() * 12);
        let cardIdx2 = Math.round(Math.random()*3) * 100 + Math.round(Math.random() * 12);
        let cardIdx3 = Math.round(Math.random()*3) * 100 + Math.round(Math.random() * 12);
        let direction = Math.round(Math.round(pos * 8 / this.posList.length));
        let newCard;
        if (this.cardCache.length == 0) {
            newCard = cc.instantiate(this.cardPrefab);
            this.node.addChild(newCard);
            newCard.instance.game = this;
        }
        else{
            newCard = this.cardCache.pop();
            newCard.active = true;
        }
        newCard.instance.initCardGroup(cardIdx1, cardIdx2, cardIdx3, direction);
        return newCard;
    },

    gamebegin: function(){
        if (this.cardList.length > 0){
            for (let idx in this.cardList){
                this.cardList[idx].active = false;
                this.cardCache.push(this.cardList[idx]);
                // this.cardList[idx].destroy();   // release node
            }
        }
        this.cardList = [];
        for (let pos in this.posList){
            let newCard = this.createCard(pos);
            this.cardList.push(newCard);
            this.playAction(newCard, this.posList[pos]);
        }
    },

    playAction: function(oCard, lstPos){
        oCard.stopAllActions();
        let numTime = 2;

        oCard.setPosition(0, 0);
        // let actionMove = cc.moveTo(numTime, 0, numPos);
        let randomPosY = Math.random()*300;
        let besier = [cc.v2(0,0),cc.v2(300-randomPosY,randomPosY),cc.v2(lstPos[0]*2,lstPos[1])];
        let actionMove = cc.bezierTo(numTime, besier);
        let oldScale = oCard.scale;
        oCard.setScale(0.3);
        let actionScale = cc.scaleTo(numTime, oldScale);
        let actionRotate = cc.rotateTo(numTime, 7200);

        let actionSpawn = cc.spawn(actionMove, actionScale, actionRotate);
        actionSpawn.easing(cc.easeIn(3.0));

        oCard.runAction(actionSpawn);
    },

    /*
    * 0-都没有 1-仅1有 2-仅2有 3-都有
    */
    checkKey: function(cardInfo1, cardInfo2, sKey){
        var val = 0;
        if (cardInfo1[sKey]){
            val |= 1;
        }
        if (cardInfo2[sKey]){
            val |= 2;
        }
        return val
    },

    /*
    * 单牌大小
    * 1-1号大 2-2号大
    */
    checkOneCard: function(cardInfo1, cardInfo2, iIdx){
        let [numColor1, num1] = [cardInfo1["value"][iIdx], cardInfo1["value"][iIdx+1]];
        let [numColor2, num2] = [cardInfo2["value"][iIdx], cardInfo2["value"][iIdx+1]];
        if (num1 != num2){
            return (num1>num2)?1:2;   // 牌面值大小，0~12表示牌值2~A
        }
        else{
            return (numColor1<numColor2)?1:2; // 花色大小，0~3表示花色红黑方梅，依次从大到小
        }
    },

    /*
    * 1-1号赢 2-2号赢
    */
    doCompareCard: function(oCard1, oCard2){
        let cardInfo1 = oCard1.instance.getCompareInfo();
        let cardInfo2 = oCard2.instance.getCompareInfo();
        cc.log("------------------------");
        cc.log(">>>>>cardInfo1");
        for(let i in cardInfo1){
            cc.log(i,cardInfo1[i]);
        }
        cc.log("------------------------");
        cc.log(">>>>>cardInfo2");
        for(let i in cardInfo2){
            cc.log(i,cardInfo2[i]);
        }
        cc.log("------------------------");

        // "TripleKill"
        // "DoubleKill"
        // "GoldenFlower"
        // "Straight"
        // "value" : [numMinColor, numMin, numMidColor, numMid, numMaxColor, numMax]

        let valOneCard = this.checkOneCard(cardInfo1, cardInfo2, 4);   // 仅比单个牌的大小
        cc.log('-----------------valOneCard',valOneCard);
        let valMidCard = this.checkOneCard(cardInfo1, cardInfo2, 2);   // 仅比单个牌的大小
        cc.log('-----------------valMidCard',valMidCard);

        let valThipleKill = this.checkKey(cardInfo1, cardInfo2, "TripleKill");
        cc.log('-----------------valThipleKill',valThipleKill);
        if (valThipleKill){ //豹子
            return (valThipleKill==3)?valOneCard:valThipleKill;
        }
        let valGoldenFlower = this.checkKey(cardInfo1, cardInfo2, "GoldenFlower");
        cc.log('-----------------valGoldenFlower',valGoldenFlower);
        let valStraight = this.checkKey(cardInfo1, cardInfo2, "Straight");
        cc.log('-----------------valStraight',valStraight);
        if (valGoldenFlower & valStraight){    // 同花顺
            return ((valGoldenFlower & valStraight)==3)?valOneCard:(valGoldenFlower & valStraight);
        }
        if (valGoldenFlower){   // 同花
            return (valGoldenFlower==3)?valOneCard:valGoldenFlower;
        }
        if (valStraight){   // 顺子
            return (valStraight==3)?valOneCard:valStraight;
        }
        let valDoubleKill = this.checkKey(cardInfo1, cardInfo2, "DoubleKill");
        cc.log('-----------------valDoubleKill',valDoubleKill);
        if (valDoubleKill){ // 对子
            return (valDoubleKill==3)?valOneCard:valDoubleKill;
        }
        return valOneCard;  // 单张
    },

    callback: function(event, customEventData){
        cc.log(event, customEventData, '+++++++++++++++++++++++++++');
        if (customEventData == "dealbutton") {
            this.gamebegin();
        }
        else{
            if (this.cardList.length){
                let val = this.doCompareCard(this.cardList[0], this.cardList[1]);
                cc.log("结果",val);
                let delKey = (val==1)?1:0;
                this.cardCache.push(this.cardList[delKey]);
                this.cardList[delKey].active = false;
                this.cardList.splice(delKey, 1);
            }
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onMessage: function(event, msg){
        cc.log(event, msg, '+++++++++++++++++++++++++++');
        if (msg == "deal") {
            this.gamebegin();
            let label = this.dealbutton.node.getChildByName("label").getComponent(cc.Label);
            if (label.string == "开始"){
                label.string = "跟";
            }
            else{
                label.string = "开始";
            }
        }
        else if (msg == "compare") {
            if (this.cardList.length >= 2){
                let val = this.doCompareCard(this.cardList[0], this.cardList[1]);
                cc.log("结果",val);
                let delKey = (val==1)?1:0;
                this.cardCache.push(this.cardList[delKey]);
                this.cardList[delKey].active = false;
                this.cardList.splice(delKey, 1);
            }
        }
        else if (msg == "look") {
            if (this.cardList.length){
                this.cardList[0].instance.lookCard();
            }
        }
    },

    onLoad () {
        this.cardList = [];
        this.cardCache = [];
        let num = 169;
        this.posList = [[0,-num],[num,-num],[num,0],[num,num],[0,num],[-num,num],[-num,0],[-num,-num]];

        // let clickEventHandler = new cc.Component.EventHandler();
        // clickEventHandler.target = this.node;
        // clickEventHandler.component = "game";
        // clickEventHandler.handler = "callback";
        // clickEventHandler.customEventData = "dealbutton";
        // this.dealbutton.clickEvents.push(clickEventHandler);

        // let clickEventHandler2 = new cc.Component.EventHandler();
        // clickEventHandler2.target = this.node;
        // clickEventHandler2.component = "game";
        // clickEventHandler2.handler = "callback";
        // clickEventHandler2.customEventData = "comparebutton";
        // this.comparebutton.clickEvents.push(clickEventHandler2);
    },

    start () {

    },

    // update (dt) {},
});
