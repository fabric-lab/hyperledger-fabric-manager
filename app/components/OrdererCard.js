import React from 'react';
import PropTypes from 'prop-types';
import JsonForm from './JsonForm';
import {schema,uiSchema,formData} from '../json_schema/orderer'
import { injectIntl  } from 'react-intl';


class OrdererCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           formData:{},
           formMode:"edit",
           schema:schema,
           isInit:false,

        }
    }

    getData = () => {
        let that=this;
        var url = 'api/entity/organizations,consortiums';
        fetch(url,{
            method: 'get',
        }).then(response=>{
            return response.json();
        }).then(function(data) {
           
           let values=[],organizations = [];
           data.organizations.forEach(function (organization) {
                if(organization.MSPs){
                    organization.MSPs.forEach(
                        function (msp) {
                            if(msp.Type=="orderer"){
                                values.push(msp.Name);
                            }
                            
                        }
                    )
                }
                organizations.push(organization.Name);
             });
            schema.properties.LocalMSPID.enum    = values;
            schema.properties.Organization.enum  = organizations;
            values = [];
            data.consortiums.forEach(function (consortium) {
                values.push(consortium.Name);
            });
            schema.properties.Consortiums.items.enum = values;
            that.setState({schema:schema,isInit:true});
        }).catch(function(e) {
            console.log(e);
        });
    }

  

    componentWillMount = () => {
        this.getData();
        let that = this
        let data = JSON.parse(this.props.match.params.data);
        let {formMode,key} = data;
        
        if(key){
            var url = 'api/entity/orderers/'+key;
            fetch(url,{
                method: 'get',
            }).then(response=>{
                return response.json();
            }).then(function(data) {
                that.setState({formData:data,formMode:formMode});
            }).catch(function(e) {
                console.log("Oops, error");
            });
        }else {
            this.setState({formMode:formMode});
        }
    }

    render() {
        let that = this;
        const { intl } = this.props;
        const handleFormSubmit = ({formData}) => {
            var url = `api/entity/orderers/${formData.Name}`;
            fetch(url,{
                method: 'post',
                body:JSON.stringify(formData)
            }).then(function(response) {
                return response;
            }).then(function(data) {
                that.props.history.push({
                    pathname: '/orderer',
                  });
            }).catch(function(e) {
                console.log("Oops, error");
            });
        }
        const handleFormChange = ({formData}) => {
           console.log(formData)
        }
        return (
            <div className='container'>

                <div >
                        <div className='col-sm-3    '/>
                        <div className='col-sm-6    '>
                            <div className='panel panel-default'>
                                <div className='panel-heading'>{this.state.formMode=="view"?intl.formatMessage({id:'view'}):intl.formatMessage({id:'add_orderer'}) } </div>
                                <div className='panel-body'>
                                { this.state.isInit && <JsonForm schema={this.state.schema} uiSchema={uiSchema} handleForm={handleFormSubmit} onChange={handleFormChange} formData={this.state.formData} formMode={this.state.formMode} history={this.props.history}/>}
                                </div>
                            </div>
                        </div>
                        <div className='col-sm-3 '/>
                </div>

              
            </div>
        )
    }
}

export default injectIntl(OrdererCard);

