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
  });
  

class ChainCodeConsoleCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cmd:"NODE_START",
            log:"",
            state:"",
            nodeName:"",
            peer:"",
            peers:[]
        };
    }

    getPeer = () => {
        let that=this;
        var url = 'api/entity/peers';
        fetch(url,{
            method: 'get',
        }).then(response=>{
            return response.json();
        }).then(function(data) {
           let values = [];
           data.peers.forEach(function (peer) {
                values.push(peer.Name);
           });
            that.setState({peers:values})
        }).catch(function(e) {
            console.log(e);
        });
    }

    componentDidMount = () => {
        this.getPeer();
        let that = this;
        let params = JSON.parse(this.props.match.params.data);
        let {key} = params;
        that.setState({ nodeName:key });
        var url = `api/entity/chaincodes/${key}/state`;
        
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

    handleChange = (name)=>event => {
        this.setState({ [name]: event.target.value });
    };
    
    execCmd = (cmd) => {
        let that = this;
        let data = {}
        data.Cmd = this.state.cmd;
        data.NodeName = this.state.nodeName;
        if(data.Cmd == "NODE_START" ){
            if( this.state.peer=="" ){
                that.setState({log:"Some param is required"})
                return "";
            }
            data.Peer = this.state.peer;
        }
        
        var url = `api/entity/chaincodes/${this.state.nodeName}/cmd`;
            fetch(url,{
                method: 'put',
                body:JSON.stringify(data)
            }).then(function(response) {
                return response.json()
            }).then(function(data) {
                that.setState({ log: data.msg,state:data.state });
            }).catch(function(e) {
                console.log(e);
            });
    };

      
    render() {
        let that = this;
        const { classes } = this.props;
        const { cmd,log,nodeName,state,peers } = this.state;
        let item =[];
        peers.forEach((peer)=>{
            item.push(<MenuItem value={peer} key={peer} >  {peer}  </MenuItem>);
        })
        return (
            <div className='container'>
                <div >
                        <div className='col-sm-3 '>
                        <div className='panel panel-default'>
                                <div className='panel-heading'>{nodeName} {state}</div>
                                <div className='panel-body'>
                                    <Select
                                        className={classes.select}
                                        value={cmd}
                                        onChange={this.handleChange("cmd")}
                                    >
                                    <MenuItem value="NODE_START" key={1} >  启动节点  </MenuItem>
                                    <MenuItem value="NODE_STOP" key={2} >  停止节点  </MenuItem>
                                   </Select>
                                   {
                                        cmd==="NODE_START" && <Select className={classes.select} value={this.state.peer} onChange={this.handleChange("peer")} >{item}</Select>
                                    }
                                    <Button variant="raised" color="primary" className={classes.button} onClick={this.execCmd.bind(this)} >
                                        执行命令
                                    </Button>
                                </div>
                            </div>
                            
                        </div>
                        <div className='col-sm-8    '>
                            <div className='panel panel-default'>
                                <div className='panel-heading'>日志</div>
                                <div className='panel-body'>
                                    <TextField rowsMax="100"  margin="normal"  className={classes.textField} value={log} multiline={true}  />
                               </div>
                            </div>
                        </div>
                   
                      
                </div>

              
            </div>
        )
    }
}

ChainCodeConsoleCard.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
export default withStyles(styles)(ChainCodeConsoleCard);


