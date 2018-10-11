import JsonWidget from "./JsonWidget"

const nameSchema = {
    type: "object",
    required:["CommonName"],
    properties: {
      CommonName:{
        type:"string"
      },

      Country: {
        type:"array",
        items:{
            type:"string"
        }
      },
      Organization:{
        type:"array",
        items:{
            type:"string"
        }
      },
      OrganizationalUnit:{
        type:"array",
        items:{
            type:"string"
        }
      },
      Locality:{
        type:"array",
        items:{
            type:"string"
        }
      },
      Province:{
        type:"array",
        items:{
            type:"string"
        }
      },
      
      
     
    }

  }

  const pemSchema = {
    type: "object",
    required:["Cert"],
    properties: {
      Key:{
        type:"string",
        title:"密钥"
      },
      Cert:{
        type:"string",
        title:"证书"
      },

     
     
    }

  }

  const widgets = {
    jsonWidget: JsonWidget
  };

  
  const uiPemSchema = {
      Cert: {
        "ui:widget": "jsonWidget"
      },
      Key: {
        "ui:widget": "textarea"
      },
  }
  

  
  export { nameSchema, pemSchema,uiPemSchema,widgets }