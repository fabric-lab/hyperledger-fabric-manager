import React from 'react';
import PropTypes from 'prop-types';
import JsonForm from './JsonForm';
import { schema, uiSchema, formData } from '../json_schema/orderer'
import { injectIntl } from 'react-intl';

let localFormData = {};

class OrdererCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            formData: {},
            formMode: "edit",
            schema: schema,
            isInit: false,
            organizations: [],
        }
    }

    getData = () => {
        let that = this;
        var url = 'api/entity/organizations,consortiums';
        fetch(url, {
            method: 'get',
        }).then(response => {
            return response.json();
        }).then(function (data) {
            let mspNames = [], organizationNames = [];
            data.organizations.forEach(function (organization) {
                if (organization.MSPs) {
                    organization.MSPs.forEach(
                        function (msp) {
                            if (msp.Type == "orderer") {
                                mspNames.push(msp.Name);
                            }
                        }
                    )
                }
                organizationNames.push(organization.Name);
            });
            schema.properties.LocalMSPID.enum = mspNames;
            schema.properties.Organization.enum = organizationNames;
            let consortiumNames = [];
            data.consortiums.forEach(function (consortium) {
                consortiumNames.push(consortium.Name);
            });
            schema.properties.Consortiums.items.enum = consortiumNames;
            that.setState({ schema: schema, organizations: data.organizations, isInit: true });
        }).catch(function (e) {
            console.log(e);
        });
    }



    componentWillMount = () => {
        this.getData();
        let that = this
        let data = JSON.parse(this.props.match.params.data);
        let { formMode, key } = data;

        if (key) {
            var url = 'api/entity/orderers/' + key;
            fetch(url, {
                method: 'get',
            }).then(response => {
                return response.json();
            }).then(function (data) {
                that.setState({ formData: data, formMode: formMode });
            }).catch(function (e) {
                console.log("Oops, error");
            });
        } else {
            this.setState({ formMode: formMode });
        }
    }

    render() {
        let that = this;
        const { intl } = this.props;
        let { schema, formData, organizations } = this.state;
        const handleFormSubmit = ({ formData }) => {
            var url = `api/entity/orderers/${formData.Name}`;
            fetch(url, {
                method: 'post',
                body: JSON.stringify(formData)
            }).then(function (response) {
                return response;
            }).then(function (data) {
                that.props.history.push({
                    pathname: '/orderer',
                });
            }).catch(function (e) {
                console.log("Oops, error");
            });
        }
        const handleFormChange = ({ formData }) => {
            this.setState({ formData: formData });
        }

        schema = JSON.parse(JSON.stringify(schema));
        if (formData.Organization) {
            schema.properties.LocalMSPID.enum = [];
            organizations.forEach(organization => {
                if (organization.Name == formData.Organization) {
                    organization.MSPs.forEach(msp => {
                        if (msp.Type == "orderer") {
                            schema.properties.LocalMSPID.enum.push(msp.Name);
                        }
                    })
                }
            })
        }
        return (

            <div className='container'>

                <div >
                    <div className='col-sm-3    ' />
                    <div className='col-sm-6    '>
                        <div className='panel panel-default'>
                            <div className='panel-heading'>{this.state.formMode == "view" ? intl.formatMessage({ id: 'view' }) : intl.formatMessage({ id: 'add_orderer' })} </div>
                            <div className='panel-body'>
                                {this.state.isInit && <JsonForm schema={schema} uiSchema={uiSchema} handleForm={handleFormSubmit} onChange={handleFormChange} formData={this.state.formData} formMode={this.state.formMode} history={this.props.history} />}
                            </div>
                        </div>
                    </div>
                    <div className='col-sm-3 ' />
                </div>


            </div>
        )
    }
}

export default injectIntl(OrdererCard);

