const schema = {

    type: "object",
    required:["Name","ListenAddress","ListenPort","EventListenPort","LocalMSPID","AdminMSPID","ChainCodeListenPort"],
    properties: {
      Name:{
        type: "string",
        default: "Peer",
        title:"名称(ID)"
      },
      ListenAddress:{
        type: "string",
        default: "127.0.0.1",
        title:"IP地址"
      },
      ListenPort:{
        type: "number",
        default: 7051,
        title:"端口"
      },
      ChainCodeListenPort:{
        type: "number",
        default: 7052,
        title:"链码监听端口"
      },
      EventListenPort:{
        type: "number",
        default: 7053,
        title:"事件监听端口"
      },
      LocalMSPID:{
        type: "string",
        enum: [],
        title: "当前节点MSP"
      },
      AdminMSPID:{
        type: "string",
        enum: [],
        title: "管理员MSP"
      }
    }
 

}

const uiSchema = {
}

const formData = {
};

export { schema, uiSchema,formData }