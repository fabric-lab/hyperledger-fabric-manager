import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';
import ReactJson from 'react-json-view';

const styles = theme => ({
    button: {
      margin: theme.spacing.unit,
    },
    input: {
      display: 'none',
    },
    tab: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    select:{
        margin: theme.spacing.unit,
        width:"100%"
    },
    textField:{
        margin: theme.spacing.unit,
        width:"100%"
    },
    paper: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
      },
      panel:{
        whiteSpace:"nowrap",
        height: window.screen.height-200 ,
        overflowX: "scroll",
        overflowY: "scroll",
    }
  });
  

class ChannelConsoleCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cmd:"CHANNEL_CREATE",
            log:"",
            msps:[],
            msp:"",
            nodeName:"",
            channel:{},
            loading: false,
        };
    }

   

    componentDidMount = () => {
        let that = this;
        let params = JSON.parse(this.props.match.params.data);
        let {key} = params;
        this.getMsp(key)
        
        that.setState({ nodeName:key });
        var url = `api/entity/peers/${key}/state`;
        
        fetch(url, {
          method: 'get',
        }).then(response => {
          return response.json();
        })
        .then(function (data) {
            that.setState({ state:data.state });
        }).catch(function (e) {
            console.log(e);
        });
    }

    getMsp = (key) => {
        let that=this;
        var url = 'api/entity/organizations,channels';
        fetch(url,{
            method: 'get',
        }).then(response=>{
            return response.json();
        }).then(function(data) {
           let values = [];
           data.organizations.forEach(function (organization) {
                if(organization.MSPs){
                    organization.MSPs.forEach(
                        function (msp) {
                            if(msp.Type=="peer"){
                                values.push(msp.Name);
                            }
                            
                        }
                    )
                }
             });
             data.channels.forEach(function (channel){
                 
                 if(channel.Name == key){
                    
                    that.setState({channel:channel})
                }
             })
             that.setState({msps:values})
        }).catch(function(e) {
            console.log(e);
        });
    }



    handleChange =name =>event => {
        this.setState({ [name]: event.target.value });
    };
    
    

    execCmd = (cmd) => {
        let that = this;
        let data = {}
        data.Cmd = this.state.cmd;
        data.NodeName = this.state.nodeName;

        if(data.Cmd == "CHANNEL_FETCH" ){
            if( this.bid.value=="" ){
                that.setState({log:"Some param is required"})
                return "";
            }
            data.Seek = this.bid.value;
        }
       
        that.setState({ loading: true, log: "运行中......." });
        var url = `api/entity/channels/${this.state.nodeName}/cmd`;
            fetch(url,{
                method: 'put',
                body:JSON.stringify(data)
            }).then(function(response) {
                return response.json();
            }).then(function(data) {
                that.setState({ log: data.msg, loading: false });
            }).catch(function(e) {
                console.log(e);
            });
    };

      
    render() {
        let that = this;
        const { classes } = this.props;
        const { cmd,log,msps,msp,nodeName,channel } = this.state;
        let item = [];
        msps.forEach(
            function(msp){
                item.push(<MenuItem value={msp} key={msp} >  {msp}  </MenuItem>)                                              
                
            }
        )
        let isJson = false;
        try { var json =  JSON.parse(log); isJson = true; } catch (e) { isJson = false; }
        return (
            <div className='container'>
                <div >
                        <div className='col-sm-3 '>
                        <div className='panel panel-default'>
                                <div className='panel-heading'>{nodeName} </div>
                                <div className='panel-body'>
                                    <Select
                                        className={classes.select}
                                        value={cmd}
                                        onChange={this.handleChange("cmd")}
                                    >
                                    <MenuItem value="CHANNEL_CREATE" key={1} >  启用通道  </MenuItem>
                                    <MenuItem value="CHANNEL_FETCH" key={3} >  查看区块  </MenuItem>
                                   </Select>
                                    
                                    
                                    {
                                        cmd==="CHANNEL_FETCH" && <TextField inputRef={el => this.bid = el} id="blockNum" label="Block Num" margin="normal"  className={classes.textField} required/>
                                    }
                                    {
                                        (cmd==="CHAINCODE_INIT" || cmd==="CHAINCODE_INVOKE" || cmd==="CHAINCODE_QUERY"||cmd==="CHAINCODE_INSTALL") && <TextField inputRef={el => this.name = el} id="name" label="Name" margin="normal"  className={classes.textField} required/>
                                    }
                                    {
                                        (cmd==="CHAINCODE_INIT"||cmd==="CHAINCODE_INSTALL") && <TextField inputRef={el => this.version = el} id="version" label="Version" margin="normal"  className={classes.textField} required/>
                                    }
                                    {
                                        cmd==="CHAINCODE_INSTALL" && <TextField inputRef={el => this.lang = el} id="lang" label="Language" margin="normal"  className={classes.textField} required/>
                                    }
                                    {
                                        cmd==="CHAINCODE_INSTALL" && <TextField inputRef={el => this.path = el} id="path" label="Path" margin="normal"  className={classes.textField} required/>
                                    }
                                    {
                                        (cmd==="CHAINCODE_INIT" || cmd==="CHAINCODE_INVOKE" || cmd==="CHAINCODE_QUERY") && <TextField inputRef={el => this.json = el} id="json" label="Json" margin="normal"  className={classes.textField} required/>
                                    }
                                    {
                                        (cmd==="CHANNEL_CREATE"||cmd==="CHANNEL_FETCH") && <Typography className={classes.textField} >
                                                请先确认Orderer节点 {channel.OrdererEndpoint} 已经启动
                                            </Typography>
                                    }
                                     
                                    <Button variant="raised" color="primary" className={classes.button} onClick={this.execCmd.bind(this)} >
                                        执行命令
                                    </Button>
                                </div>
                            </div>
                            
                        </div>
                        <div className='col-sm-8    '>
                        <div className={'panel panel-default '+classes.panel}  >
                                {this.state.loading && <LinearProgress />}
                                <div className='panel-heading'>日志</div>
                                <div className='panel-body'>
                                {!isJson && <TextField rowsMax="100"  margin="normal"  className={classes.textField} value={log} multiline={true}  />}
                                {isJson && <ReactJson src={json} />}
                                </div>
                            </div>
                        </div>
                      
                </div>

              
            </div>
        )
    }
}

ChannelConsoleCard.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
export default withStyles(styles)(ChannelConsoleCard);


