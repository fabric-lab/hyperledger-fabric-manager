const organizationSchema = {
    type: "object",
    required:["Organization","CommonName"],
    properties: {
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
      },
      Organization:{
        type:"string",
        title:"organization"
      },
      CommonName:{
        type:"string",
        title:"common_name"
      }
    }

  }


  
  export { organizationSchema }