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
    },

    onMessage: function(event, msg){
        if (event.target.instance != undefined) {
            cc.log("onMessage!", event.target.instance.name, msg);
            event.target.instance.onMessage(event, msg);
        }
        else{
            cc.log("onMessage! no target node", event.target.name);
            let nodeGame = cc.find("Canvas/game");
            cc.log(nodeGame);
            if (nodeGame){
                nodeGame.instance.onMessage(event, msg);
            }
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
