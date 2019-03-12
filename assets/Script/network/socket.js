var commond=require("../command")
var game=require("../gameinit")

cc.Class({

    properties: {
        _m_Response:null,
        _m_Engine:null,
        _m_PacketIdx:0,
        _m_PacketData:null,
        _m_RspData:null,
        _m_RspLen:0,
        _m_RspIdx:0,
    },

    initRsp:function(response){
        this._m_Response = response
        this._m_Response.gameServerNotify=this.gameServerNotify.bind(this)
        this._m_Response.initResponse=this.initResponse.bind(this)
        this._m_Response.registerUserResponse=this.registerUserResponse.bind(this)
        this._m_Response.loginResponse=this.loginResponse.bind(this)
        this._m_Response.joinRoomResponse=this.joinRoomResponse.bind(this)
        this._m_Response.logoutResponse=this.logoutResponse.bind(this)
    },

    initResponse:function(status){
        console.log("引擎初始化结果"+status)
        this._m_Engine.registerUser()
    },

    registerUserResponse:function(registerrsp){
        console.log("注册用户成功："+registerrsp.userID+","+registerrsp.token)
        this._m_Engine.login(registerrsp.userID,registerrsp.token)
    },

    loginResponse:function(loginrsp){
        console.log("登录成功："+loginrsp.status+","+loginrsp.roomID)
        this._m_Engine.joinRandomRoom(100,"this is test player")
    },

    joinRoomResponse:function(status,roomUserInfoList,roomInfo){
        console.log("加入房间成功"+status+","+roomUserInfoList+","+roomInfo.ownerId)
        var Game=new game()
        Game.init()
    },

    logoutResponse:function(logoutrsp){
        console.log("登出成功："+logoutrsp)
    },

    gameServerNotify:function(rspData){
        this._m_RspData=rspData
        console.log(rspData,typeof(rspData))
        this._m_RspLen=this._m_RspData.cpProto.len
        let idx=this._m_RspData.cpProto.head  
        commond.oncommand(idx)
    },

    initEngine:function(engine){
        this._m_Engine = engine
        this._m_PacketData={'head':0,'len':0}
    },

    preparePacket:function(pID){
        this._m_PacketData.head=pID
    },

    packetString:function(str){
        this._m_PacketIdx++
        this._m_PacketData[this._m_PacketIdx.toString()]=str
    },

    packetInt:function(int){
        this._m_PacketIdx++
        this._m_PacketData[this._m_PacketIdx.toString()]=int
    },

    packetObject:function(obj){
        this._m_PacketIdx++
        this._m_PacketData[this._m_PacketIdx.toString()]=JSON.stringify(obj)
    },

    packetArray:function(array){
        this._m_PacketIdx++
        this._m_PacketData[this._m_PacketIdx.toString()]=array
    },

    packetSend:function(){
        this._m_PacketData.len=this._m_PacketIdx
        let send=JSON.stringify(this._m_PacketData)
        let retObj=this._m_Engine.sendEventEx(1,send,0)
        if(retObj.result==0){
            console.log("发送成功！！")
            this._m_PacketIdx=0
            this._m_PacketData={'head':0,'len':0}
        }
        else{
            console.log("发送失败！！"+retObj.result+","+retObj.sequence)
        }
        
    },

    unPacketInt:function(){
        if(this._m_RspIdx>=this._m_RspLen)
            return 0
        this._m_RspIdx++
        retData=this._m_RspData[this._m_RspIdx]
        this.clearData()
        return retData
    },

    unPacketString:function(){
        if(this._m_RspIdx>=this._m_RspLen)
            return 0
        this._m_RspIdx++
        retData=this._m_RspData[this._m_RspIdx]
        if(this._m_RspIdx>=this._m_RspLen) 
            this.clearData()
        return retData
    },

    unPacketObject:function(){
        if(this._m_RspIdx>=this._m_RspLen)
            return 0
        this._m_RspIdx++
        retData=this._m_RspData[this._m_RspIdx]
        if(this._m_RspIdx>=this._m_RspLen) 
            this.clearData()
        return retData
    },

    unPacketArray:function(){
        if(this._m_RspIdx>=this._m_RspLen)
            return 0
        this._m_RspIdx++
        retData=this._m_RspData[this._m_RspIdx] 
        if(this._m_RspIdx>=this._m_RspLen) 
            this.clearData()   
        return retData
    },

    clearData:function(){
        this._m_RspData=null,
        this._m_RspLen=0
        this._m_RspIdx=0
    }
})
