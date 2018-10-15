const schema = {
    type: "object",
    required:["Name","Path","Lang","Version","PeerName"],
    properties: {
      Name: {
        type:"string",
        title:"chaincode_name",
      },
      Path: {
        type:"string",
        title:"path",
      },
      Lang: {
        type:"string",
        title:"language",
      },
      Version: {
        type:"string",
        title:"version",
      },
      PeerName:{
        type: "string",
        enum: [],
        title: "peers"
      },
      Init: {
        type:"string",
        title:"init_code",
      },
      Invoke: {
        type:"string",
        title:"invoke_code",
      },
      Query: {
        type:"string",
        title:"query_code",
      },
    }

  }


  
  export { schema }