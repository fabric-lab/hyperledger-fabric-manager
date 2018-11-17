import JsonWidget from "./JsonWidget"

const nameSchema = {
    type: "object",
    required:["CommonName"],
    properties: {
      Oper:{
        type:"string",
        default:"add_cert",
        title: "Oper"
      },
      CommonName:{
        type:"string",
        title: "common_name"
      },
      IsTLS:{
        type: "string",
        enum: ["no","yes"],
        default:"no",
        title: "is_tls"
      },
      ParentCa:{
        type: "string",
        enum: [],
        title: "parent_ca"
      }
    }

  }

  const pemSchema = {
    type: "object",
    required:["Cert"],
    properties: {
      Oper:{
        type:"string",
        default:"add_pem",
        title: "Oper"
      },
      Key:{
        type:"string",
        title:"keys"
      },
      Cert:{
        type:"string",
        title:"certificate"
      },
      IsTLS:{
        type: "string",
        enum: ["no","yes"],
        default:"no",
        title: "is_tls"
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
      Oper: {
        "ui:widget": "hidden"
      }
  }
  
  const iuiPemSchema = {
    Cert: {
      "ui:widget": "textarea"
    },
    Key: {
      "ui:widget": "textarea"
    },
    Oper: {
      "ui:widget": "hidden"
    }
  }
  const uiSchema = {
    Oper: {"ui:widget": "hidden"}
  };
  
  export { nameSchema, pemSchema,uiPemSchema,iuiPemSchema,widgets,uiSchema }