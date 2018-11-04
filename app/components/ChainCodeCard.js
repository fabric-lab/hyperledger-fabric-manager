
import React from 'react';
import PropTypes from 'prop-types';
import JsonForm from './JsonForm';
import {schema,uiSchema,formData} from '../json_schema/chaincode'
import { injectIntl  } from 'react-intl';


class ChainCodeCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           formData:{},
           formMode:"edit",
           schema:schema,
           isInit:false
        }
    }
  
    getData = () => {
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
            schema.properties.PeerName.enum = values;
            that.setState({schema:schema,isInit:true});
        }).catch(function(e) {
            console.log(e);
        });
    }

    

     componentWillMount =  () => {
         this.getData()
         let that = this
        let data = JSON.parse(this.props.match.params.data);
        let {formMode,key} = data;
        
        if(key){
            var url = 'api/entity/chaincodes/'+key;
            fetch(url,{
                method: 'get',
            }).then(response=>{
                return response.json();
            }).then(function(data) {
                that.setState({formMode:formMode,formData:data});
            }).catch(function(e) {
                console.log("Oops, error");
            });
        }else{
            this.setState({formMode:formMode});
        }
    }

    render() {
        const {intl } = this.props;

        let that = this;
        const handleFormSubmit = ({formData}) => {
            // formData.OrderName = this.props.location.state.OrderName;
            // console.log(formData);
            let key = formData.Name+"."+formData.PeerName
            var url = `api/entity/chaincodes/${key}`;
            fetch(url,{
                method: 'post',
                mode: "no-cors",
                body:JSON.stringify(formData)
            }).then(function(response) {
                return response;
            }).then(function(data) {
                that.props.history.push({
                    pathname: '/chaincode',
                  });
            }).catch(function(e) {
                console.log("Oops, error");
            });
        }
        return (
            <div className='container'>

                <div >
                        <div className='col-sm-3    '/>
                        <div className='col-sm-6    '>
                            <div className='panel panel-default'>
                                <div className='panel-heading'>{this.state.formMode=="view"?intl.formatMessage({id:'view'}):intl.formatMessage({id:'add_chaincode'}) }</div>
                                <div className='panel-body'>
                                { this.state.isInit &&  <JsonForm schema={this.state.schema} uiSchema={uiSchema} handleForm={handleFormSubmit} formData={this.state.formData} formMode={this.state.formMode} history={this.props.history}/>}
                                </div>
                            </div>
                        </div>
                        <div className='col-sm-3 '/>
                </div>

              
            </div>
        )
    }
}

export default injectIntl(ChainCodeCard);

