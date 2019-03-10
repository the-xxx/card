cc.Class({
    extends: cc.Component,

    properties: {
        _m_Indx:0,
        _m_Data:null,
        _m_Engine:null
    },

    init:function(engine){
        this._m_Engine = engine
        this._m_Data={"head":0,"len":0}
    },

    preparePacket:function(pID){
        this._m_Data.head=pID
    },

    packetString:function(str){
        this._m_Indx++
        this._m_Data[this._m_Indx]=str
    },

    packetInt:function(int){
        this._m_Indx++
        this._m_Data[this._m_Indx]=int
    },

    packetObject:function(obj){
        this._m_Indx++
        this._m_Data[this._m_Indx]=JSON.stringify(obj)
    },

    packetSend:function(){
        this._m_Data.len=this._m_Indx
        retObj=this.m_Engine.sendEventEx(1,JSON.stringify(this._m_Data))
        if(retObj.result==0){
            this._m_Indx=0
            this._m_Data=_m_Data={"head":0,"len":0}
        }
    },
})