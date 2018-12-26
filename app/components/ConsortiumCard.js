
import React from 'react';
import PropTypes from 'prop-types';
import JsonForm from './JsonForm';
import {schema,uiSchema,formData} from '../json_schema/consortium'
import { injectIntl  } from 'react-intl';


class ConsortiumCard extends React.Component {

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
            let values = [];
            data.organizations.forEach(function (organization) {
                if(organization.MSPs){
                    organization.MSPs.forEach(
                        function (msp) {
                            if(msp.Type=="network"){
                                values.push(organization.Name+"|"+msp.Name);
                            }
                        }
                    )
                }
            });
            schema.properties.MspNames.items.enum      = values;
            that.setState({schema:schema,isInit:true});
        }).catch(function(e) {
            console.log("Oops, error");
        });
    }

     componentWillMount =  () => {
        this.getMsp();
        let that = this
        let data = JSON.parse(this.props.match.params.data);
        let {formMode,key} = data;
        
        if(key){
            var url = 'api/entity/consortiums/'+key;
            fetch(url,{
                method: 'get',
            }).then(response=>{
                return response.json();
            }).then(function(data) {
                let mspNames = [];
                for(let i=0;i<data.MspNames.length;i++){
                   let mspName = data.Organizations[i]+"|"+ data.MspNames[i];
                   mspNames.push(mspName);
                }
                data.MspNames = mspNames;
                that.setState({formMode:formMode,formData:data});
            }).catch(function(e) {
                console.log("Oops, error");
            });
        }else{
            this.setState({formMode:formMode});
        }
    }

    render() {
        const { intl } = this.props;
        let that = this;
        const handleFormSubmit = ({formData}) => {
            // formData.OrderName = this.props.location.state.OrderName;
            // console.log(formData);
            var url = `api/entity/consortiums/${formData.Name}`;
            fetch(url,{
                method: 'post',
                body:JSON.stringify(formData)
            }).then(function(response) {
                return response;
            }).then(function(data) {
                that.props.history.push({
                    pathname: '/consortium',
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
                                <div className='panel-heading'>{this.state.formMode=="view"?intl.formatMessage({id:'view'}):intl.formatMessage({id:'add_consortium'}) }</div>
                                <div className='panel-body'>
                               { this.state.isInit && <JsonForm schema={this.state.schema} uiSchema={uiSchema} handleForm={handleFormSubmit} formData={this.state.formData} formMode={this.state.formMode} history={this.props.history}/>}
                                </div>
                            </div>
                        </div>
                        <div className='col-sm-3 '/>
                </div>

              
            </div>
        )
    }
}

export default injectIntl(ConsortiumCard);

