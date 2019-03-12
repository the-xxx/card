module.exports = {
    g_Socket:null,

    preparePacket:function(pID){
        g_Socket.preparePacket(pID)
    },

    packetString:function(str){
        g_Socket.packetString(str)
    },

    packetInt:function(int){
        g_Socket.packetInt(int)
    },

    packetObject:function(obj){
        g_Socket.packetObject(obj)
    },

    packetArray:function(array){
        g_Socket.packetArray(array)
    },

    packetSend:function(){
        g_Socket.packetSend()
    },

    unPacketInt:function(){
        g_Socket.unPacketInt()
    },
    
    unPacketString:function(){
        g_Socket.unPacketString()
    },

    unPacketObject:function(){
        g_Socket.unPacketObject()
    },

    unPacketArray:function(){
        g_Socket.unPacketArray()
    },
};