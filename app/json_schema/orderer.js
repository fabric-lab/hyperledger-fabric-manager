const schema = {

      type: "object",
      required:["Name","ListenAddress","ListenPort","Consortiums","LocalMSPID"],
      properties: {
        Name:{
          type: "string",
          default: "OrdererNode1",
          title:"node_name"
        },
        OrdererType: {
          type: "string",
          enum: ["solo"],
          default: "solo",
          title:"node_type"
        },
        LedgerType: {
          type: "string",
          enum: ["file", "json", "ram"],
          default: "file",
          title:"ledger_type"
        },
        ListenAddress:{
          type: "string",
          default: "127.0.0.1",
          title:"ip_address"
        },
        ListenPort:{
          type: "number",
          default: 7050,
          title:"port"
        },
        Organization:{
          type: "string",
          enum: [],
          title: "organization"
        },
        LocalMSPID:{
          type: "string",
          enum: [],
          title: "msp_name"
        },
        Consortiums:{
          type:"array",
          items: {
            enum: [],
            type: "string",
          },
          uniqueItems: true,
          title:"consortiums"
        }

      }
}

const uiSchema = {

}

const formData = {
  General:{TLS:{RootCAs:["tls/ca.crt"]}}
};

export { schema, uiSchema,formData }