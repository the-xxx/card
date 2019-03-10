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
        card1: {
            default: null,
            type: cc.Sprite
        },
        card2: {
            default: null,
            type: cc.Sprite
        },
        card3: {
            default: null,
            type: cc.Sprite
        },
    },

    initCard: function(idx1, idx2, idx3){
        this.loadRes(this.card1, idx1);
        this.loadRes(this.card2, idx2);
        this.loadRes(this.card3, idx3);
    },

    loadRes: function(cardSpr, residx){
        var type = Math.round(residx / 100);
        var idx = Math.round(residx % 100);
        // loadres for "resources", needn't extensions
        var sPath = "card/card_big_symbol_number_"+this.typeKey[type]+"_"+this.cardKey[idx];
        cc.log(sPath, type, idx, residx);
        cc.loader.loadRes(sPath, cc.SpriteFrame, function (err, spriteFrame){
            cardSpr.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.typeKey = ['red','black'];
        this.cardKey = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
    },

    start () {

    },

   onEnable: function(){
        this.node.instance = this;
   },

    // update (dt) {},
});
