cc.Class({

    extends: cc.Component,
    // use this for initialization
    init: function () {
        console.log("脚本开始初始化！")
        console.log("网络的对象",+Net.g_Socket)
        Net.preparePacket(0)
        Net.packetInt(1)
        // Net.packetString("this is test player")
        Net.packetSend()
    },

});