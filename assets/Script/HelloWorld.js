var Socket = require("./network/socket");

cc.Class({
    extends: cc.Component,

    properties: {
         _m_Engine:null,
         _m_Response:null
    },

    // use this for initialization
    onLoad: function () {
        window.Net = new Socket()
        var engine = new MatchvsEngine()
        var response = new MatchvsResponse()
        engine.init(response,"Matchvs","alpha",215155,"51965001f3444a05bbac214c7ee984a7#C");
        window.Net.initEngine(engine)
        window.Net.initRsp(response)
    },

});
