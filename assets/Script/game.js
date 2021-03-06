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
        goldlabel: {
            default: null,
            type: cc.Label
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
            newCard.name = "objCard" + pos.toString();
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

        let actionCall = cc.callFunc(()=>{oCard.instance.onActionEnd()});

        let actionSequence = cc.sequence(actionSpawn, actionCall);

        oCard.runAction(actionSequence);
    },

    /*
    * 针对某种牌，确定开牌双方拥有情况
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

    onOpen: function(numIgnor=0){
        for (let idx in this.cardList){
            this.cardList[idx].instance.lookCard(numIgnor);
            if (this.cardList[idx].instance.direction != 0) {
                this.cardList[idx].setScale(0.8);
            }
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onMessage: function(event, msg){
        cc.log(event, msg, '+++++++++++++++++++++++++++');
        cc.log(event.target.name, event.target.name.match("objCard"), '**');
        if (msg == "deal") {
            let label = this.dealbutton.node.getChildByName("label").getComponent(cc.Label);
            if (label.string == "开始"){
                this.gamebegin();
                label.string = "跟";
                
                this.operationForGoldLabel(3, 10);
                this.operationForGoldLabel(4, 10);
                this.operationForGoldLabel(5, 80);
            }
            else if (label.string == "跟"){
                let [goldAll, goldBase, goldYour] = this.operationForGoldLabel(0);
                this.operationForGoldLabel(3, goldBase>goldYour?goldBase:goldYour);
                this.operationForGoldLabel(4, goldBase>goldYour?goldBase:goldYour);
                this.operationForGoldLabel(5, goldAll+goldYour);
            }
        }
        else if (msg == "compare") {
            this.onOpen();
            let label = this.dealbutton.node.getChildByName("label").getComponent(cc.Label);
            label.string = "开始";
        }
        else if (msg == "look") {
            if (this.cardList.length){
                this.cardList[0].instance.lookCard();
                let [goldAll, goldBase, goldYour] = this.operationForGoldLabel(0);
                this.operationForGoldLabel(3, goldYour*2);
                this.operationForGoldLabel(4, goldBase*2);
            }
        }
        else if (event.target.name.match("objCard")){
            let idx = this.cardList.indexOf(event.target.parent);
            cc.log(idx,'---', this.cardList.length);
            if (idx != -1 && idx != 0){
                let val = this.doCompareCard(this.cardList[0], this.cardList[idx]);
                cc.log("结果",val);
                let delKey = (val==1)?idx:0;
                let oCard = this.cardList[delKey];
                let oWinCard = this.cardList[idx-delKey];
                this.cardCache.push(oCard);
                this.cardList.splice(delKey, 1);
                // oCard.active = false;
                oCard.instance.lookCard(-1);
                if (delKey != 0) {
                    oCard.setScale(0.8);
                }

                if (delKey == 0){
                    this.onOpen(oWinCard.instance.direction);
                    // cc.director.loadScene("login");
                }
            }
        }
        else if ( event.target.name == "addbutton"){
            cc.log("抬价");
            this.operationForGoldLabel(1);
        }
        else if ( event.target.name == "cutbutton"){
            cc.log("减价");
            this.operationForGoldLabel(2);
        }
    },

    /**
     * 对金币文本操作
     * numOP: 0-获取数值 1-加出价 2-减出价 3-改出价 4-改底价 5-改奖池
     * numVal：改变值
     */
    operationForGoldLabel: function(numOP, numVal=0){
        let label = this.goldlabel.getComponent(cc.Label);
        let labelStr = label.string;
        let lstStr = labelStr.split(/[:\n]/ig);

        switch(numOP){
            case 0: {
                return [Number(lstStr[1]),Number(lstStr[3]),Number(lstStr[5])];
            }
            case 1: {
                lstStr[5] = Math.round(Number(lstStr[5])+Number(lstStr[3])/2.0).toString();
                break;
            }
            case 2: {
                let numVal = Math.round(Number(lstStr[5])-Number(lstStr[3])/2.0);
                lstStr[5] = (Number(lstStr[3])>numVal?Number(lstStr[3]):numVal).toString();
                break;
            }
            case 3: {
                lstStr[5] = numVal.toString();
                break;
            }
            case 4: {
                lstStr[3] = numVal.toString();
                break;
            }
            case 5: {
                lstStr[1] = numVal.toString();
                break;
            }
        }

        label.string = "{0}:{1}\n{2}:{3}\n{4}:{5}".replace(/\{(\w+)\}/g, function(k,v){
            return lstStr[v];
        });
    },

    onLoad () {
        this.cardList = [];
        this.cardCache = [];
        let num = 180;
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
