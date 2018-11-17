const schema = {

    type: "object",
    required:["Roots","Administrators","NodeId"],
    properties: {
      Roots:{
        type:"array",
        items: {
            enum: [],
            type: "string",
        },
        uniqueItems: true,
        title:"root_ca"
      },
      Intermediates:{
        type:"array",
        items: {
            enum: [],
            type: "string",
        },
        uniqueItems: true,
        title:"intermediate_ca"
      },
      Ous:{
        type: "string",
        title:"organization_unit"
      },
      Administrators:{
        type:"array",
        items: {
            enum: [],
            type: "string",
        },
        uniqueItems: true,
        title:"administrator"
      },
      CRL:{
        type:"array",
        items: {
            enum: [],
            type: "string",
        },
        uniqueItems: true,
        title:"revoked_ca"
      },
      NodeId:{
        type: "string",
        enum: [],
        title:"node_identity"
      },
      TlsRoots:{
        type:"array",
        items: {
            enum: [],
            type: "string",
        },
        uniqueItems: true,
        title:"tls_root_ca"
      },
      TlsIntermediates:{
        type:"array",
        items: {
            enum: [],
            type: "string",
        },
        uniqueItems: true,
        title:"tls_intermediate_ca"
      },
    }
}



export {schema}