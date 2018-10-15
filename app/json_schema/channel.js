const schema = {
    type: "object",
    required:["Name","Consortium","OrdererName"],
    properties: {
      Name: {
        type:"string",
        title:"channel_name",
      },
      Desc: {
        type:"string",
        title:"channel_desc",
      },
      Consortium:{
        type: "string",
        enum: [],
        title: "consortiums"
      },
      OrdererName:{
        type: "string",
        enum: [],
        title: "orderer_name"
      }
    }

  }


  
  export { schema }