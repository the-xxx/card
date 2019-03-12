/*
客户端处理服务端的数据包接口，协议由程序商量
0号协议为空协议不要使用
*/
module.exports={

    oncommand:function(idx){
        switch (idx) {
            case 0:               
                break;
        
            default:
                console.log("收到服务器无法解析的包！")
                break;
        }
    },
}