const schema = {
    type: "object",
    required:["Name","MspNames"],
    properties: {
      Name: {
        type:"string",
        title:"consortium_name",
      },
      Desc: {
        type:"string",
        title:"consortium_desc",
      },
      Type: {
        type: "string",
        enum: ["application"],
        default: "application",
        title:"consortium_type",
      },
      MspNames:{
        type:"array",
        title:"consortium_msps",
        items: {
          enum: [],
          type: "string",
        },
        uniqueItems: true,
      }
    }

  }


  
  export { schema }