const schema = {
    type: "object",
    required:["Name","Path","Lang","Version","PeerName"],
    properties: {
      Name: {
        type:"string",
        title:"链码名称",
      },
      Path: {
        type:"string",
        title:"路径",
      },
      Lang: {
        type:"string",
        title:"语言",
      },
      Version: {
        type:"string",
        title:"版本",
      },
      PeerName:{
        type: "string",
        enum: [],
        title: "Peer节点"
      },
      Init: {
        type:"string",
        title:"初始化语句",
      },
      Invoke: {
        type:"string",
        title:"调用语句",
      },
      Query: {
        type:"string",
        title:"查询语句",
      },
    }

  }


  
  export { schema }