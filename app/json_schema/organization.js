const organizationSchema = {
    type: "object",
    required:["Name","CommonName"],
    properties: {
      Name:{
        type:"string",
        title:"organization"
      },
      CommonName:{
        type:"string",
        title:"common_name"
      },
      Country: {
        type:"string",
        title:"country"
      },
      Province:{
        type:"string",
        title:"province"
      },
      Locality:{
        type:"string",
        title:"locality"
      }
    }

  }


  
  export { organizationSchema }