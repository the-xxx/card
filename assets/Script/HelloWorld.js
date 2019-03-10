cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
         // 主角跳跃高度
         jumpHeight: 0,
         // 主角跳跃持续时间
         jumpDuration: 0,
         // 最大移动速度
         maxMoveSpeed: 0,
         // 加速度
         accel: 0,
         // defaults, set visually when attaching this script to the Canvas
         text: 'Hello, World!',

    },

    jumpFunc:function(){
        let up=cc.moveBy(this.jumpDuration,cc.v2(0,this.jumpHeight)).easing(cc.easeCubicActionOut())
        let down=cc.moveBy(this.jumpDuration,cc.v2(0,-this.jumpHeight)).easing(cc.easeCubicActionIn())
        return cc.repeatForever(cc.sequence(up,down))
    },

    // use this for initialization
    onLoad: function () {
        this.label.string = this.text;
        let jump=this.jumpFunc()
        this.node.runAction(jump)
        this.engine = new MatchvsEngine()
        this.Response = new MatchvsResponse()
        this.Response.initResponse=this.initResponse.bind(this)
        this.Response.registerUserResponse=this.registerUserResponse.bind(this)
        this.Response.loginResponse=this.loginResponse.bind(this)
        this.Response.logoutResponse=this.logoutResponse.bind(this)
        this.engine.init(this.Response,"Matchvs","alpha",215155,"51965001f3444a05bbac214c7ee984a7#C");
    },

    initResponse:function(status){
        console.log("注册回调类成功："+status)
        this.engine.registerUser()
    },

    registerUserResponse:function(registerrsp){
        console.log("注册用户成功："+registerrsp.userID+","+registerrsp.token)
        this.engine.login(registerrsp.userID,registerrsp.token)
    },

    loginResponse:function(loginrsp){
        console.log("登录成功："+loginrsp.status+","+loginrsp.roomID)
        let roomInfo={
            roomName:"testroom",
            maxPlayer:10,
            mode:1,
            canWatch:2,
            visibility:1,
            roomProperty:"this is test room",
        }
        let userData="something data"    
        this.engine.createRoom(roomInfo,userData)
    },

    createRoomResponse:function(createRoomRsp){
        console.log("房间创建成功："+createRoomRsp.status+","+createRoomRsp.roomID+","+createRoomRsp.owner)
    },

    logoutResponse:function(logoutrsp){
        console.log("登出成功："+logoutrsp)
    },
    // called every frame
    update: function (dt) {
    },
});
