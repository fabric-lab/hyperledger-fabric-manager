import React from 'react';
import PropTypes from 'prop-types';
import JsonForm from './JsonForm';
import {schema,uiSchema,formData} from '../json_schema/peer'


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
          
           let localMsps = [];
           let adminMsps = [];

            data.organizations.forEach(function (organization) {
                if(organization.MSPs){
                    organization.MSPs.forEach(
                        function (msp) {
                            if(msp.Type=="peer" && msp.Role=="peer"){
                                localMsps.push(msp.Name);
                            }else if(msp.Type=="peer" && msp.Role=="admin"){
                                adminMsps.push(msp.Name);
                            }
                            
                        }
                    )
                }
             });
            schema.properties.LocalMSPID.enum = localMsps;
            schema.properties.AdminMSPID.enum = adminMsps;
            that.setState({schema:schema,isInit:true});
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
        return (
            <div className='container'>

                <div >
                        <div className='col-sm-3    '/>
                        <div className='col-sm-6    '>
                            <div className='panel panel-default'>
                                <div className='panel-heading'>{this.state.formMode=="view"?"查看PEER节点":"添加PEER节点"}</div>
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

export default PeerCard;

