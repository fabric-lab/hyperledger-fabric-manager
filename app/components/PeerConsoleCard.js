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
import {msgToObj} from '../util'

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
    panel: {
        whiteSpace: "nowrap",
        height: window.screen.height - 200,
        overflowX: "scroll",
        overflowY: "scroll",
    }
});


class PeerConsoleCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cmd: "NODE_START",
            log: "",
            msp: "",
            state: "stop",
            nodeName: "",
            loading: false,
            channels: [],
            cid: "",
            name: "asset_mgmt",
            version: "1.0",
            json: '{"Args":["a","10"]}',
            path: "sacc",
            lang: "golang",
            chaincodes: [],
            chaincode: "",
        };
    }


    getChannel = () => {
        let that = this;
        var url = 'api/entity/channels,chaincodes';
        fetch(url, {
            method: 'get',
        }).then(response => {
            return response.json();
        }).then(function (data) {
            that.setState({ chaincodes: data.chaincodes == null ? [] : data.chaincodes, channels: data.channels == null ? [] : data.channels })
        }).catch(function (e) {
            console.log(e);
        });
    }

    componentDidMount = () => {
        this.getChannel();
        let that = this;
        let params = JSON.parse(this.props.match.params.data);
        let { key } = params;
        that.setState({ nodeName: key });
        var url = `api/entity/peers/${key}/state`;

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



    handleChange = name => event => {
        let that = this
        if (name == "chaincode") {
            this.state.chaincodes.forEach(function (chaincode) {
                if (chaincode.Name == event.target.value) {
                    that.setState({ path: chaincode.Path, lang: chaincode.Lang, version: chaincode.Version, name: chaincode.Name });
                    if (that.state.cmd == "CHAINCODE_INIT") {
                        that.setState({ json: chaincode.Init });
                    } else if (that.state.cmd == "CHAINCODE_INVOKE") {
                        that.setState({ json: chaincode.Invoke });
                    } else if (that.state.cmd == "CHAINCODE_QUERY") {
                        that.setState({ json: chaincode.Query });
                    }
                }
            })
        }else if (name == "cmd") {
             let chaincodeName = this.state.chaincode;
             let chaincode;
             if(chaincodeName == ""){
                if(this.state.chaincodes.length>0){
                     chaincode = this.state.chaincodes[0];
                }
             }else{
                this.state.chaincodes.forEach(function(c){
                    if(c.Name == chaincodeName){
                        chaincode = c
                    }
                })
            }
             
             if(chaincode !=undefined){
                if (event.target.value == "CHAINCODE_INIT") {
                    this.setState({ json: chaincode.Init });
                } else if (event.target.value == "CHAINCODE_INVOKE") {
                    this.setState({ json: chaincode.Invoke });
                } else if (event.target.value == "CHAINCODE_QUERY") {
                    this.setState({ json: chaincode.Query });
                }
             }
            
        }
        this.setState({ [name]: event.target.value });
    };



    execCmd = (cmd) => {
        let that = this;
        let data = {}
        data.Cmd = this.state.cmd;
        data.NodeName = this.state.nodeName;
        if (data.Cmd == "CHANNEL_JOIN" || data.cmd == "CHANNEL_GETINFO") {
            if (this.state.cid == "") {
                that.setState({ log: "Some param is required" })
                return "";
            }
        }
        if (data.Cmd == "CHAINCODE_INSTALL") {
            if (this.state.name == "" || this.state.version == "" || this.state.lang == "" || this.state.path == "") {
                that.setState({ log: "Some param is required" })
                return "";
            }
        }
        if (data.Cmd == "CHAINCODE_INIT") {
            if (this.state.name == "" || this.state.version == "" || this.state.json == "" || this.state.cid == "") {
                that.setState({ log: "Some param is required" })
                return "";
            }
        }
        if (data.Cmd == "CHAINCODE_INVOKE" || data.Cmd == "CHAINCODE_QUERY") {
            if (this.state.name == "" || this.state.json == "") {
                that.setState({ log: "Some param is required" })
                return "";
            }
        }
        data.Name = this.state.name;
        data.Version = this.state.version;
        data.Lang = this.state.lang;
        data.Path = this.state.path;
        data.ChannelId = this.state.cid;
        data.Json = this.state.json;
        that.setState({ loading: true, log:this.props.intl.formatMessage({id:'running'}) });
        var url = `api/entity/peers/${this.state.nodeName}/cmd`;
        fetch(url, {
            method: 'put',
            body: JSON.stringify(data)
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            let msgObj = msgToObj(data.msg)
            let msg = that.props.intl.formatMessage(msgObj[0],msgObj[1]);
            that.setState({ log: msg, state: data.state, loading: false });
        }).catch(function (e) {
            console.log(e);
        });
    };


    render() {
        let that = this;
        const { classes,intl } = this.props;
        const { cmd, log, msp, state, nodeName, channels, cid, chaincodes, chaincode } = this.state;

        let isJson = false;
        try { var json = JSON.parse(log); isJson = true; } catch (e) { isJson = false; }
        let item = [];
        channels.forEach(
            function (channel) {
                if (channel.State == "enable") {
                    item.push(<MenuItem value={channel.Name} key={channel.Name} >  {channel.Name}  </MenuItem>)
                }
            }
        )
        let chaincodeItem = [];
        chaincodes.forEach(function (chaincode) {
            if(chaincode.PeerName == nodeName){
                if (chaincode.State == "enable" && cmd != "CHAINCODE_INSTALL") {
                    chaincodeItem.push(<MenuItem value={chaincode.Name} key={chaincode.Name} >  {chaincode.Name}  </MenuItem>)
                } else {
                    chaincodeItem.push(<MenuItem value={chaincode.Name} key={chaincode.Name} >  {chaincode.Name}  </MenuItem>)
                }
            }
            
        })
        return (
            <div className='container'>
                <div >
                    <div className='col-sm-3 '>
                        <div className='panel panel-default'>
                            <div className='panel-heading'>{nodeName} {intl.formatMessage({id:state})}</div>
                            <div className='panel-body'>
                                <Select
                                    className={classes.select}
                                    value={cmd}
                                    onChange={this.handleChange('cmd')}
                                >
                                    <MenuItem value="NODE_START" key={1} >  {intl.formatMessage({id:'run_node'})}  </MenuItem>
                                    <MenuItem value="NODE_STOP" key={2} >  {intl.formatMessage({id:'stop_node'})}  </MenuItem>
                                    <MenuItem value="CHANNEL_LIST" key={3} >   {intl.formatMessage({id:'channel_list'})}  </MenuItem>
                                    <MenuItem value="CHANNEL_JOIN" key={4} >  {intl.formatMessage({id:'join_channel'})}   </MenuItem>
                                    <MenuItem value="CHANNEL_GETINFO" key={10} >  {intl.formatMessage({id:'get_channel_info'})}  </MenuItem>
                                    <MenuItem value="CHAINCODE_INSTALL" key={5} >  {intl.formatMessage({id:'install_chaincode'})}  </MenuItem>
                                    <MenuItem value="CHAINCODE_LIST" key={6} >   {intl.formatMessage({id:'chaincode_list'})}  </MenuItem>
                                    <MenuItem value="CHAINCODE_INIT" key={7} >  {intl.formatMessage({id:'init_chaincode'})}  </MenuItem>
                                    <MenuItem value="CHAINCODE_INVOKE" key={8} >  {intl.formatMessage({id:'invoke_chaincode'})}  </MenuItem>
                                    <MenuItem value="CHAINCODE_QUERY" key={9} >  {intl.formatMessage({id:'query_chaincode'})}  </MenuItem>

                                </Select>
                                {(cmd === "CHANNEL_JOIN" || cmd === "CHAINCODE_INIT" || cmd == "CHANNEL_GETINFO" || cmd == "CHAINCODE_INIT" || cmd === "CHAINCODE_INVOKE" || cmd === "CHAINCODE_QUERY") && <Select className={classes.select} value={cid} onChange={this.handleChange('cid')}>{item}</Select>}
                                {
                                    (cmd === "CHAINCODE_INIT" || cmd === "CHAINCODE_INVOKE" || cmd === "CHAINCODE_QUERY" || cmd === "CHAINCODE_INSTALL") &&
                                    <Select className={classes.select} value={chaincode} onChange={this.handleChange('chaincode')} >
                                        {chaincodeItem}
                                    </Select>
                                }
                                {
                                    (cmd === "CHAINCODE_INIT" || cmd === "CHAINCODE_INVOKE" || cmd === "CHAINCODE_QUERY") && <TextField value={this.state.json} id="json" label="Json" onChange={this.handleChange('json')} margin="normal" className={classes.textField} required />
                                }


                                <Button variant="raised" color="primary" className={classes.button} onClick={this.execCmd.bind(this)} >
                                {intl.formatMessage({id:'run_cmd'})}
                                </Button>
                            </div>
                        </div>

                    </div>
                    <div className='col-sm-8    '>
                        <div className={'panel panel-default ' + classes.panel}>
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

PeerConsoleCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(injectIntl(PeerConsoleCard));


