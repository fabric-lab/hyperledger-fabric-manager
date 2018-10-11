const organizationSchema = {
    type: "object",
    required:["Organization","CommonName"],
    properties: {
      Country: {
        type:"string",
        title:"国家"
      },
      Province:{
        type:"string",
        title:"省份"
      },
      Locality:{
        type:"string",
        title:"城市"
      },
      Organization:{
        type:"string",
        title:"单位名称"
      },
      CommonName:{
        type:"string",
        title:"公用名称"
      }
    }

  }


  
  export { organizationSchema }