import React from 'react';
import PropTypes from 'prop-types';
import JsonForm from './JsonForm';
import {nameSchema,pemSchema,uiPemSchema,iuiPemSchema,widgets,uiSchema} from '../json_schema/cert'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import { injectIntl  } from 'react-intl';



class CertCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            formMode:"view",
            orgCommonName:"",
            activeTab:0,
            nameSchema:nameSchema,
            pemSchema:pemSchema,
            formData:{},
            isInit:false
        }
    }

    getData = (orgCommonName) => {
        let that=this;
        var url = `api/entity/organizations/${orgCommonName}`;
        fetch(url,{
            method: 'get',
        }).then(response=>{
            return response.json();
        }).then(function(data) {
           
            let values = [];
            data.PEMs.forEach(function (PEM) {
                values.push(PEM.Name);
            });
            nameSchema.properties.ParentCa.enum = values;
            let names =[];
            names[0] = that.props.intl.formatMessage({id:'no'})
            names[1] = that.props.intl.formatMessage({id:'yes'})
            nameSchema.properties.IsTLS.enumNames = names;
            pemSchema.properties.IsTLS.enumNames = names;
            that.setState({nameSchema:nameSchema,pemSchema:pemSchema,isInit:true});
        }).catch(function(e) {
            console.log(e);
        });
    }

    componentDidMount = () => {
        let that = this
        let data = JSON.parse(this.props.match.params.data);
        let {formMode,commonName,caName} = data;
        this.getData(commonName);
        if(caName){
            var url = 'api/organizations/'+commonName+"/"+caName;
            fetch(url,{
                method: 'get',
            }).then(response=>{
                return response.json();
            }).then(function(data) {
                let formData = {Cert:data.ca,Key:data.key}
                that.setState({formData:formData,formMode:formMode});
            }).catch(function(e) {
                console.log("Oops, error");
            });
        }else{
            this.setState({formMode:formMode,orgCommonName:commonName});
        }
    }

    render() {
        const {intl} = this.props;
        const { activeTab,formMode,orgCommonName } = this.state;

        let that = this;
        const handleFormSubmit = ({formData}) => {
            var url = `api/entity/organizations/${orgCommonName}`;
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

        const handleChange = (event, value) => {
            this.setState({ activeTab:value });
        };
        
        return (
            <div className='container'>
              
                    <div >
                        <div className='col-sm-1    '/>
                        <div className='col-sm-10    '>
                            <div className='panel panel-default'>
                                <div className='panel-heading'> {formMode=="view"?intl.formatMessage({id:'view'}):intl.formatMessage({id:'add_cert'}) }</div>
                                {formMode=="view"?(
                                    <div className='panel-body'>
                                        <JsonForm widgets={widgets} schema={pemSchema} uiSchema={uiPemSchema} handleForm={()=>this.props.history.goBack()}   formData={this.state.formData} formMode={formMode}  history={this.props.history}  />
                                    </div>
                                ):(
                                    <div className='panel-body'>
                                    <Tabs value={activeTab} onChange={handleChange}>
                                        <Tab label="Certificate Info" />
                                        <Tab label="PEM" />
                                    </Tabs>
                                    {activeTab === 0 && this.state.isInit &&  <JsonForm  schema={nameSchema} uiSchema={uiSchema} handleForm={handleFormSubmit}   formMode={formMode}  history={this.props.history} />}
                                    {activeTab === 1 && this.state.isInit &&<JsonForm  schema={pemSchema} uiSchema={iuiPemSchema} handleForm={handleFormSubmit} formMode={formMode}  history={this.props.history}  />}
                                    </div>
                                )}
                                
                                
                            </div>
                        </div>
                        <div className='col-sm-1    '/>
                    </div>
                
            </div>
        )
    }
}

export default injectIntl(CertCard);

