const schema = {

      type: "object",
      required:["Name","ListenAddress","ListenPort","Consortiums","LocalMSPID"],
      properties: {
        Name:{
          type: "string",
          default: "OrdererNode1",
          title:"节点名称"
        },
        OrdererType: {
          type: "string",
          enum: ["solo"],
          default: "solo",
          title:"节点类型"
        },
        LedgerType: {
          type: "string",
          enum: ["file", "json", "ram"],
          default: "file",
          title:"账本类型"
        },
        ListenAddress:{
          type: "string",
          default: "127.0.0.1",
          title:"IP地址"
        },
        ListenPort:{
          type: "number",
          default: 7050,
          title:"端口"
        },
        LocalMSPID:{
          type: "string",
          enum: [],
          title: "MSP 名称"
        },
        Consortiums:{
          type:"array",
          items: {
            enum: [],
            type: "string",
          },
          uniqueItems: true,
          title:"联盟"
        }

      }
}

const uiSchema = {

}

const formData = {
  General:{TLS:{RootCAs:["tls/ca.crt"]}}
};

export { schema, uiSchema,formData }