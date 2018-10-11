const schema = {
    type: "object",
    required:["Name","MspNames"],
    properties: {
      Name: {
        type:"string",
        title:"联盟名称",
      },
      Desc: {
        type:"string",
        title:"联盟描述",
      },
      Type: {
        type: "string",
        enum: ["application"],
        default: "application",
        title:"联盟类型",
      },
      MspNames:{
        type:"array",
        title:"联盟中的MSP",
        items: {
          enum: [],
          type: "string",
        },
        uniqueItems: true,
      }
    }

  }


  
  export { schema }