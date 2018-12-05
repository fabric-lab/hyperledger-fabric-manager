import React from 'react';
import PropTypes from 'prop-types';
import JsonForm from './JsonForm';
import {organizationSchema} from '../json_schema/organization'
import { injectIntl  } from 'react-intl';


class OrganizationCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           formData:{},
           formMode:"edit"
        }
    }

    componentDidMount = () => {
        let that = this
        let data = JSON.parse(this.props.match.params.data);
        let {key,formMode} = data;
        this.setState({formMode:formMode});
        if(key){
            var url = 'api/entity/organizations/'+key;
            fetch(url,{
                method: 'get',
                mode: "cors",
            }).then(response=>{
                return response.json();
            }).then(function(data) {
                that.setState({formData:data});
            }).catch(function(e) {
                console.log("Oops, error");
            });
        }
    }

    render() {
        let that = this;
        const { intl } = this.props;

        const handleFormSubmit = ({formData}) => {

            var url = `api/entity/organizations/${formData.Name}`;
            fetch(url,{
                method: 'post',
                mode: "no-cors",
                body:JSON.stringify(formData)
            }).then(function(response) {
                return response;
            }).then(function(data) {
                that.props.history.push({
                    pathname: '/organizations',
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
                                <div className='panel-heading'>{this.state.formMode=="view"?intl.formatMessage({id:'view'}):intl.formatMessage({id:'add_organization'}) }</div>
                                <div className='panel-body'>
                                <JsonForm schema={organizationSchema}  handleForm={handleFormSubmit} formData={this.state.formData} formMode={this.state.formMode} history={this.props.history}/>
                                </div>
                            </div>
                        </div>
                        <div className='col-sm-3 '/>
                    </div>
            </div>
        )
    }
}

export default injectIntl(OrganizationCard);

