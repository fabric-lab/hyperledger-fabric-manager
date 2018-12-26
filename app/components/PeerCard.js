import React from 'react';
import PropTypes from 'prop-types';
import JsonForm from './JsonForm';
import {schema,uiSchema,formData} from '../json_schema/peer'
import { injectIntl  } from 'react-intl';


class PeerCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           formData:{},
           formMode:"edit",
           schema:schema,
           isInit:false
        }
    }

    getMsp = () => {
        let that=this;
        var url = 'api/entity/organizations';
        fetch(url,{
            method: 'get',
        }).then(response=>{
            return response.json();
        }).then(function(data) {
           let localMsps = [],adminMsps = [],organizationNames=[];

            data.organizations.forEach(function (organization) {
                if(organization.MSPs){
                    organization.MSPs.forEach(
                        function (msp) {
                            if(msp.Type=="peer"){
                                localMsps.push(msp.Name);
                                adminMsps.push(msp.Name);
                            }
                        }
                    )
                }
                organizationNames.push(organization.Name);
             });
            schema.properties.LocalMSPID.enum = localMsps;
            schema.properties.AdminMSPID.enum = adminMsps;
            schema.properties.Organization.enum = organizationNames;
            that.setState({schema:schema,isInit:true,organizations:data.organizations});
        }).catch(function(e) {
            console.log(e);
        });
    }

    componentDidMount = () => {
        this.getMsp();
        let that = this
        let data = JSON.parse(this.props.match.params.data);
        let {formMode,key} = data;
        if(key){
            var url = 'api/entity/peers/'+key;
            fetch(url,{
                method: 'get',
            }).then(response=>{
                return response.json();
            }).then(function(data) {
                that.setState({formData:data,formMode:formMode});
            }).catch(function(e) {
                console.log(e)
            });
        }else{
            this.setState({formMode:formMode});

        }
    }

    

    render() {
        let that = this;
        const { intl } = this.props;
        let { schema, formData, organizations } = this.state;

        const handleFormSubmit = ({formData}) => {
            var url = `api/entity/peers/${formData.Name}`;
            fetch(url,{
                method: 'post',
                body:JSON.stringify(formData)
            }).then(function(response) {
                return response;
            }).then(function(data) {
                that.props.history.push({
                    pathname: '/peer',
                  });
            }).catch(function(e) {
                console.log("Oops, error");
            });
        }
        const handleFormChange = ({ formData }) => {
            this.setState({ formData: formData });
        }

        schema = JSON.parse(JSON.stringify(schema));
        if (formData.Organization) {
            schema.properties.LocalMSPID.enum = [];
            schema.properties.AdminMSPID.enum = [];
            organizations.forEach(organization => {
                if (organization.Name == formData.Organization) {
                    organization.MSPs.forEach(msp => {
                        if (msp.Type == "peer") {
                            schema.properties.LocalMSPID.enum.push(msp.Name);
                            schema.properties.AdminMSPID.enum.push(msp.Name);
                        }
                    })
                }
            })
        }

        return (
            <div className='container'>

                <div >
                        <div className='col-sm-3    '/>
                        <div className='col-sm-6    '>
                            <div className='panel panel-default'>
                                <div className='panel-heading'>{this.state.formMode=="view"?intl.formatMessage({id:'view'}):intl.formatMessage({id:'add_peer'}) }</div>
                                <div className='panel-body'>
                                     { this.state.isInit && <JsonForm schema={schema} uiSchema={uiSchema} handleForm={handleFormSubmit} onChange={handleFormChange} formData={this.state.formData} formMode={this.state.formMode} history={this.props.history}/>}
                                </div>
                            </div>
                        </div>
                        <div className='col-sm-3 '/>
                </div>

              
            </div>
        )
    }
}

export default injectIntl(PeerCard);

