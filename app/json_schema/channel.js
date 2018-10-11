const schema = {
    type: "object",
    required:["Name","Consortium","OrdererName"],
    properties: {
      Name: {
        type:"string",
        title:"通道名称(ID)",
      },
      Desc: {
        type:"string",
        title:"通道描述",
      },
      Consortium:{
        type: "string",
        enum: [],
        title: "联盟"
      },
      OrdererName:{
        type: "string",
        enum: [],
        title: "Order节点"
      }
    }

  }


  
  export { schema }