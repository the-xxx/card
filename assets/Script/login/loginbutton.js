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
    },

    // LIFE-CYCLE CALLBACKS:

    onMessage: function(event, msg){
        cc.director.loadScene("play");  // 加载场景【play】
        moduleLogin = require("login"); // 获取脚本【login.js】
        if (moduleLogin){
            moduleLogin.DoLogin();  // 如果脚本存在，则调用【DoLogin】函数
        }
    },

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
