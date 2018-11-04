import React from 'react';
import PropTypes from 'prop-types';
import JsonForm from './JsonForm';
import {nameSchema,pemSchema,uiPemSchema,widgets} from '../json_schema/cert'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import { injectIntl  } from 'react-intl';



class CertCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeTab:0,
            formData:{}
        }
    }

    componentDidMount = () => {
        let that = this
        let data = JSON.parse(this.props.match.params.data);
        let {commonName,caName} = data;
        if(commonName && caName){
            var url = 'api/organizations/'+commonName+"/"+caName;
            fetch(url,{
                method: 'get',
            }).then(response=>{
                return response.json();
            }).then(function(data) {
                let formData = {Cert:data.ca,Key:data.key}
                that.setState({formData:formData});
            }).catch(function(e) {
                console.log("Oops, error");
            });
        }
    }

    render() {
        const {intl} = this.props;
        const { activeTab } = this.state;

        let that = this;
        const handleFormSubmit = ({formData}) => {
            var url = 'api/certs';
            fetch(url,{
                method: 'post',
                body:JSON.stringify(formData)
            }).then(function(response) {
                return response;
            }).then(function(data) {
                that.props.history.push({
                    pathname: '/certs',
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
                                <div className='panel-heading'> {intl.formatMessage({id:"view"}) }</div>
                                <div className='panel-body'>
                                   
                                    <JsonForm widgets={widgets} schema={pemSchema} uiSchema={uiPemSchema} handleForm={()=>this.props.history.goBack()}   formData={this.state.formData} formMode="view" history={this.props.history}  />
                                </div>
                            </div>
                        </div>
                        <div className='col-sm-1    '/>
                    </div>
                
            </div>
        )
    }
}

export default injectIntl(CertCard);

