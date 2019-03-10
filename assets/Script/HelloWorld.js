var Engine = require("./network/packetsend");
var Rsp = require("./network/oncommand");
cc.Class({
    extends: cc.Component,

    properties: {
         _m_Engine:null,
         _m_Response:null
    },

    // use this for initialization
    onLoad: function () {
        this._m_Engine=new Engine()
        this._m_Response=new Rsp()
        let engine = new MatchvsEngine()
        let response = new MatchvsResponse()
        engine.init(response,"Matchvs","alpha",215155,"51965001f3444a05bbac214c7ee984a7#C");
        this._m_Engine.init(engine)
        this._m_Response.init(response)
    },

});
