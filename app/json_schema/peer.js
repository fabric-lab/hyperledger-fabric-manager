const schema = {

    type: "object",
    required:["Name","ListenAddress","ListenPort","EventListenPort","LocalMSPID","AdminMSPID","ChainCodeListenPort"],
    properties: {
      Name:{
        type: "string",
        default: "Peer",
        title:"node_name"
      },
      ListenAddress:{
        type: "string",
        default: "127.0.0.1",
        title:"ip_address"
      },
      ListenPort:{
        type: "number",
        default: 7051,
        title:"port"
      },
      ChainCodeListenPort:{
        type: "number",
        default: 7052,
        title:"chaincode_port"
      },
      EventListenPort:{
        type: "number",
        default: 7053,
        title:"Event端口"
      },
      Organization:{
        type: "string",
        enum: [],
        title: "organization"
      },
      LocalMSPID:{
        type: "string",
        enum: [],
        title: "peer_msp"
      },
      AdminMSPID:{
        type: "string",
        enum: [],
        title: "admin_msp"
      },
      AnchorPeer:{
        type: "string",
        enum: ["no","yes"],
        default:"no",
        title: "anchor_peer"
      }
    }
 

}

const uiSchema = {
}

const formData = {
};

export { schema, uiSchema,formData }