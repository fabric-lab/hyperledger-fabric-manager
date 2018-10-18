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
import { injectIntl  } from 'react-intl';


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
    select: {
        margin: theme.spacing.unit,
        width: "100%"
    },
    textField: {
        margin: theme.spacing.unit,
        width: "100%"
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


class OrdererConsoleCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cmd: "NODE_START",
            log: "",
            state: "",
            nodeName: "",
            loading: false,
            channelId:"system-channel",
            blockNum:"-1",
            channels:[]

        };
    }

    componentDidMount = () => {
        
        let that = this;
        let params = JSON.parse(this.props.match.params.data);
        let { key } = params;
        this.getData(key)
        that.setState({ nodeName: key });
        var url = `api/entity/orderers/${key}/state`;

        fetch(url, {
            method: 'get',
        }).then(response => {
            return response.json();
        })
            .then(function (data) {
                that.setState({ state: data.state });
            }).catch(function (e) {
                console.log(e);
            });
    }

    handleChange =(name)=> event => {
        this.setState({ [name]: event.target.value });
    };

    getData = (key) => {
        let that=this;
        var url = 'api/entity/channels';
        fetch(url,{
            method: 'get',
        }).then(response=>{
            return response.json();
        }).then(function(data) {
            let channels = [];
            data.channels.forEach(function (channel){
                 if(channel.OrdererName == key && channel.State == "enable"){
                    channels.push(channel);
                }
             })
             that.setState({channels:channels})
        }).catch(function(e) {
            console.log(e);
        });
    }


    execCmd = (cmd) => {
        
        let that = this;
        let data = {}
        data.Cmd = this.state.cmd;
        data.NodeName = this.state.nodeName;
        if (data.Cmd == "SEEK") {
            if (this.state.channelId == "" || this.state.blockNum == "") {
                that.setState({ log: "Some param is required" })
                return "";
            }
            data.ChannelId = this.state.channelId;
            data.Seek = this.state.blockNum;
        }
        that.setState({ loading: true, log: intl.formatMessage({id:'running'})} );
        var url = `api/entity/orderers/${this.state.nodeName}/cmd`;
        fetch(url, {
            method: 'put',
            body: JSON.stringify(data)
        }).then(function (response) {
            return response.json()
        }).then(function (data) {
            that.setState({ log: data.msg, state: data.state, loading: false });
        }).catch(function (e) {
            console.log(e);
        });
    };


    render() {
        let that = this;
        const { classes,intl } = this.props;
        const { cmd, log, nodeName, state,channelId,blockNum,channels } = this.state;
        let items = [];
        items.push(<MenuItem value="system-channel" key="system-channel" >  system-channel  </MenuItem>)
        channels.forEach(function(channel){
            items.push(<MenuItem value={channel.Name} key={channel.Name} >  {channel.Name}  </MenuItem>)
        })
        let isJson = false;
        try { var json =  JSON.parse(log); isJson = true; } catch (e) { isJson = false; }
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
                                    <MenuItem value="NODE_START" key={1} >  {intl.formatMessage({id:'run_node'})}  </MenuItem>
                                    <MenuItem value="NODE_STOP" key={2} >  {intl.formatMessage({id:'stop_node'})}   </MenuItem>
                                    <MenuItem value="SEEK" key={3} >  {intl.formatMessage({id:'view_block'})}  </MenuItem>
                                </Select>
                                {
                                    cmd === "SEEK" && <Select  className={classes.select} value={channelId} onChange={this.handleChange("channelId")}> {items} </Select> 
                                }
                                {
                                    cmd === "SEEK" && <TextField id="blockNum" onChange={this.handleChange("blockNum")} label= {intl.formatMessage({id:'block_num'})} margin="normal" value={blockNum} className={classes.textField} required />
                                }
                                {
                                    cmd==="SEEK"  && <Typography className={classes.textField} >{intl.formatMessage({id:'desc_1'})}</Typography>
                                }
                                
                                <Button variant="raised" color="primary" className={classes.button} onClick={this.execCmd.bind(this)} >
                                    {intl.formatMessage({id:'run_cmd'})}
                                </Button>
                            </div>
                        </div>

                    </div>
                    <div className='col-sm-8    '>
                        <div className={'panel panel-default '+classes.panel}  >
                            {this.state.loading && <LinearProgress />}
                            <div className='panel-heading'>{intl.formatMessage({id:'log'})}</div>
                            <div className='panel-body'>
                                {!isJson && <TextField rowsMax="100" margin="normal" className={classes.textField} value={log} multiline={true} />}
                                {isJson && <ReactJson src={json} />}
                            </div>
                        </div>
                    </div>


                </div>


            </div>
        )
    }
}

OrdererConsoleCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(injectIntl(OrdererConsoleCard));


