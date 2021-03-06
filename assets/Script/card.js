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
        node1: {
            default: null,
            type: cc.Node
        },
        node2: {
            default: null,
            type: cc.Node
        },
        node3: {
            default: null,
            type: cc.Node
        },
    },

    /*
    * 初始化牌组
    */
    initCardGroup: function(cardIdx1, cardIdx2, cardIdx3, direction){
        this.cardInfo = [cardIdx1,cardIdx2,cardIdx3];
        this.cardInfo.sort(
            function(a, b){
                if (a%100 == b%100){
                    return b/100 - a/100;
                }
                return a%100 - b%100;
            }
        );
        this.direction = direction;
        this.cardCompareInfo = {};
        this.loadCard(this.node1, this.cardInfo[0]);
        this.loadCard(this.node2, this.cardInfo[1]);
        this.loadCard(this.node3, this.cardInfo[2]);
        this.loadFuckButton(direction);
        this.loadHide();
        if (direction != 0){
            this.node.setScale(0.5);
        }
        else{
            this.node.setScale(1);
        }
    },

    loadHide: function(direction){

        let sPath = "button/btnhide";
        let self = this;
        cc.loader.loadRes(sPath, cc.SpriteFrame, function(err, spriteFrame){
            let node = self.node.getChildByName("hide");
            if (node){
                node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                node.active = false;
                return
            }
            node = new cc.Node("hide");
            let sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = spriteFrame;
            self.node.addChild(node, 999);
            node.setPosition(0, 0);
            node.setScale(2);
            node.opacity = 150;
            node.active = false;
        });
    },

    loadFuckButton: function(direction){
        let sPath = "button2/btnboom";
        let self = this;
        cc.loader.loadRes(sPath, cc.SpriteFrame, function(err, spriteFrame){
            let node = self.node.getChildByName(self.node.name);
            if (node){
                node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                node.active = false;
                // node.active = (direction != 0 && true);
                return
            }
            node = new cc.Node(self.node.name);
            // node.active = (direction != 0 && true);
            node.active = false;
            let sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = spriteFrame;
            self.node.addChild(node, -1);
            node.setPosition(0, 100);
            node.setScale(2);
            let button = node.addComponent(cc.Button);
            let eventHandler = new cc.Component.EventHandler();
            eventHandler.target = cc.find("Canvas/evention");
            eventHandler.component = "evention";
            eventHandler.handler = "onMessage";
            eventHandler.customEventData = "zzz";
            button.clickEvents.push(eventHandler);
        });
    },

    /*
    * 加载单张牌
    * 异步加载
    */
    loadCard: function(cardNode, cardIdx){
        let cardColor = Math.round(cardIdx / 100);
        let cardVal = Math.round(cardIdx % 100);
        cardNode.setScale(0.7);

        let sPath = "card/card_bg_"+this.typeKey[cardColor];
        cc.loader.loadRes(sPath, cc.SpriteFrame, function(err, spriteFrame){
            let node = cardNode.getChildByName("bg");
            if (node){
                node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                return
            }
            node = new cc.Node("bg");
            let sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = spriteFrame;
            cardNode.addChild(node, -1);
            node.setPosition(0, 0);
        });

        sPath = "card/card_symbol_"+this.typeKey[cardColor];
        cc.loader.loadRes(sPath, cc.SpriteFrame, function(err, spriteFrame){
            let node = cardNode.getChildByName("type");
            if (node){
                node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                return
            }
            node = new cc.Node("type");
            let sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = spriteFrame;
            cardNode.addChild(node);
            node.setPosition(1, -21);
            node.setScale(2);
        });

        sPath = "card/num_"+this.colorKey[cardColor]+"_"+this.valueKey[cardVal];
        cc.loader.loadRes(sPath, cc.SpriteFrame, function(err, spriteFrame){
            let node = cardNode.getChildByName("value");
            if (node){
                node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                return
            }
            node = new cc.Node("value");
            let sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = spriteFrame;
            cardNode.addChild(node);
            node.setPosition(0, 50);
        });

        let idxBg = Math.round(Math.random()*3);
        sPath = "card/cover_"+this.typeKey[idxBg];
        cc.loader.loadRes(sPath, cc.SpriteFrame, function(err, spriteFrame){
            let node = cardNode.getChildByName("cover");
            if (node){
                node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                return
            }
            node = new cc.Node("cover");
            let sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = spriteFrame;
            cardNode.addChild(node, 999);
            node.setPosition(0, 0);
        });
    },

    getCardInfo: function(){
        let numMinColor, numMin;
        let numMidColor, numMid;
        let numMaxColor, numMax;
        [numMinColor, numMin] = [Math.round(this.cardInfo[0]/100), this.cardInfo[0]%100];
        [numMidColor, numMid] = [Math.round(this.cardInfo[1]/100), this.cardInfo[1]%100];
        [numMaxColor, numMax] = [Math.round(this.cardInfo[2]/100), this.cardInfo[2]%100];
        return [numMinColor, numMin, numMidColor, numMid, numMaxColor, numMax];
    },

    /*
     * 豹子：3相同
     */
    calTripleKill: function(numMinColor, numMin, numMidColor, numMid, numMaxColor, numMax){
        return numMin == numMax;
    },

    /*
     * 对子：2相同
     */
    calDoubleKill: function(numMinColor, numMin, numMidColor, numMid, numMaxColor, numMax){
        return numMin == numMid || numMid == numMax;
    },

    /*
     * 同花：牌色一致
     */
    calGoldenFlower: function(numMinColor, numMin, numMidColor, numMid, numMaxColor, numMax){
        return numMinColor == numMidColor && numMinColor == numMaxColor;
    },

    /*
     * 顺子：有序
     * A23最小，QKA最大，用mid值来定位顺子大小标志，注：KA2不算顺子
     */
    calStraight: function(numMinColor, numMin, numMidColor, numMid, numMaxColor, numMax){
        if ([numMin, numMid, numMax] == [0, 1, 12]){    // A23
            return true
        }
        return numMin+1 == numMid && numMid+1 == numMax;
    },

    /*
    * 获取比较信息
    * 豹子 > 同花顺 > 同花 > 顺子 > 对子 > 单张
    */
    getCompareInfo: function(){
        if (Object.keys(this.cardCompareInfo).length == 0) {
            let [numMinColor, numMin, numMidColor, numMid, numMaxColor, numMax] = this.getCardInfo();
            this.cardCompareInfo = {    // 比较时候用到的信息
                "TripleKill": this.calTripleKill(numMinColor, numMin, numMidColor, numMid, numMaxColor, numMax),
                "DoubleKill": this.calDoubleKill(numMinColor, numMin, numMidColor, numMid, numMaxColor, numMax),
                "GoldenFlower": this.calGoldenFlower(numMinColor, numMin, numMidColor, numMid, numMaxColor, numMax),
                "Straight": this.calStraight(numMinColor, numMin, numMidColor, numMid, numMaxColor, numMax),
                "value" : [numMinColor, numMin, numMidColor, numMid, numMaxColor, numMax]
            }
        }
        return this.cardCompareInfo;
    },

    lookCard: function(numIgnor=0){
        let node;
        node = this.node1.getChildByName("cover");
        if (node){
            node.destroy();
        }
        node = this.node2.getChildByName("cover");
        if (node){
            node.destroy();
        }
        node = this.node3.getChildByName("cover");
        if (node){
            node.destroy();
        }
        node = this.node.getChildByName(this.node.name);
        if (node){
            node.active = false;
        }
        node = this.node.getChildByName("hide");
        if (node && this.direction != numIgnor){
            node.active = true;
        }
    },

    onActionEnd: function(){
        let node = this.node.getChildByName(this.node.name);
        if (node){
            node.active = (this.direction != 0);
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.colorKey = ['red','black','red','black'];
        this.typeKey = ['hongtao','heitao','fangkuai','meihua'];
        this.valueKey = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
        // this.directionList = [[0,0],[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,-1]];
        this.cardInfo = [];
        this.cardCompareInfo = {};
        this.direction = -1;
    },

    start () {

    },

   onEnable: function(){
        this.node.instance = this;
   },

    // update (dt) {},
});
