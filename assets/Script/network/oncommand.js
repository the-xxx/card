var commond=require("../command")

cc.Class({
    extends: cc.Component,

    properties: {
        _m_Response:null
    },

    init:function(response){
        this._m_Response = response
        this._m_Response.gameServerNotify=this.gameServerNotify.bind(this)
        this._m_Response.initResponse=this.initResponse.bind(this)
    },

    gameServerNotify:function(rspData){
        let idx=rspData.cpProto.head
        let len=rspData.cpProto.len
        commond.oncommand(idx,len,rspData)
    },

    initResponse:function(status){
        console.log("引擎初始化结果"+status)
    },
})
