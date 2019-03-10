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
    extends: cc.Component,

    properties: {
        cardPrefab:{
            default: null,
            type: cc.Prefab
        },
        dealbutton: {
            default: null,
            type: cc.Button
        },
    },

    createCard: function(){
        // get residx for random
        var residx1 = Math.round(Math.random()) * 100 + Math.round(Math.random() * 12);
        var residx2 = Math.round(Math.random()) * 100 + Math.round(Math.random() * 12);
        var residx3 = Math.round(Math.random()) * 100 + Math.round(Math.random() * 12);
        var newCard = cc.instantiate(this.cardPrefab);
        this.node.addChild(newCard);
        newCard.instance.game = this;
        newCard.instance.initCard(residx1, residx2, residx3);
        return newCard;
    },

    gamebegin: function(){
        if (this.cardList.length > 0){
            for (var idx in this.cardList){
                this.cardList[idx].destroy();   // release node
            }
        }
        this.cardList = [];
        for ( var pos in this.posList){
            var newCard = this.createCard();
            newCard.setPosition(0, this.posList[pos]);
            this.cardList.push(newCard);
        }
    },

    callback: function(event, customEventData){
        this.gamebegin();
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.cardList = [];
        this.posList = [0,300];

        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "game";
        clickEventHandler.handler = "callback";
        clickEventHandler.customEventData = "";
        this.dealbutton.clickEvents.push(clickEventHandler);
    },

    start () {

    },

    // update (dt) {},
});
