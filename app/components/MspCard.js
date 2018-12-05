
import React from 'react';
import PropTypes from 'prop-types';
import JsonForm from './JsonForm';
import {schema,uiSchema,formData} from '../json_schema/msp'
import { injectIntl  } from 'react-intl';


class MspCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           formData:{},
           formMode:"edit",
           schema:schema,
           isInit:false
        }
    }
  
    getData = (organization) => {
        let that=this;
        var url = `api/entity/organizations/${organization}`;
        fetch(url,{
            method: 'get',
        }).then(response=>{
            return response.json();
        }).then(function(data) {
            let allca=[], rootca=[],ca=[],tlsrootca=[],tlsca = [];
            data.PEMs.forEach(function (PEM) {
                if(PEM.Type == "ca.root"){
                    rootca.push(PEM.Name)
                }else if(PEM.Type == "ca.common"){
                    ca.push(PEM.Name)
                }else if(PEM.Type == "tlsca.root"){
                    tlsrootca.push(PEM.Name)
                }else if(PEM.Type == "tlsca.common"){
                    tlsca.push(PEM.Name)
                }
                allca.push(PEM.Name)
            });
            schema.properties.CRL.items.enum = allca.length==0?[""]:allca;
            schema.properties.Roots.items.enum = rootca.length==0?[""]:rootca;
            schema.properties.Intermediates.items.enum = ca.length==0?[""]:ca;
            schema.properties.Administrators.items.enum = ca.length==0?[""]:ca;
            schema.properties.NodeId.enum = ca.length==0?[""]:ca;
            schema.properties.TlsRoots.items.enum = tlsrootca.length==0?[""]:tlsrootca;
            schema.properties.TlsIntermediates.items.enum = tlsca.length==0?[""]:tlsca;
            that.setState({schema:schema,isInit:true});
        }).catch(function(e) {
            console.log(e);
        });
    }

    

     componentWillMount =  () => {
        let that = this
        let data = JSON.parse(this.props.match.params.data);
        let {formMode,key,organization,mspName} = data;
        this.getData(organization);
        if(mspName){
            var url = 'api/entity/organizations/'+organization;
            fetch(url,{
                method: 'get',
            }).then(response=>{
                return response.json();
            }).then(function(data) {
                data.MSPs.forEach(function (MSP) {
                    if(MSP.Name == mspName){
                        that.setState({formData:MSP,formMode:formMode});
                    }
                })
                
                
            }).catch(function(e) {
                console.log("Oops, error");
            });
        }else{
            this.setState({formMode:formMode,organization:organization});
        }
    }

    render() {
        const {intl } = this.props;
        const { organization } = this.state;
        let that = this;
        const handleFormSubmit = ({formData}) => {
            formData["Oper"] = "add_msp";
            var url = `api/entity/organizations/${organization}`;
            fetch(url,{
                method: 'put',
                body:JSON.stringify(formData)
            }).then(function(response) {
                return response;
            }).then(function(data) {
                that.props.history.push({
                    pathname: '/Organizations',
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
                                <div className='panel-heading'>{this.state.formMode=="view"?intl.formatMessage({id:'view'}):intl.formatMessage({id:'add_msp'}) }</div>
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

export default injectIntl(MspCard);

