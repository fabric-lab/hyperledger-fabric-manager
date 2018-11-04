export function msgToObj(msg){
    let msgs = msg.split("|");
    let id={}
    let values={}
    for(let i=0;i<msgs.length;i++){
        if(i==0){
            id={id:msgs[i]}
        }else{
            values["param"+i]=msgs[i]
        }
    }
    return [id,values]
}