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
        playercard: {
            default: null,
            type: cc.Sprite
        },
    },

    callback: function(event, customEventData){
        cc.log('============================================================');
        this.playercard.getComponent("player").randomCard();
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // var clickEventHandler = new cc.Component.EventHandler();
        // clickEventHandler.target = this.node;
        // clickEventHandler.component = "dealbutton";
        // clickEventHandler.handler = "callback";
        // clickEventHandler.customEventData = "";
        //
        // var button = this.node.getComponent(cc.Button);
        // button.clickEvents.push(clickEventHandler);
    },

    start () {

    },

    // update (dt) {},
});
