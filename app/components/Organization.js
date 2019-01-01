import React from 'react';
import OrganizationTable from './OrganizationTable';
import CertTable from './CertTable';
import MspTable from './MspTable';
import { injectIntl } from 'react-intl';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';


class Organization extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: 0,
            activeTab: 0,
            organizations: []
        };
    }

    callback = (state) => {
        this.setState(state);
    }

    componentDidMount = () => {
        document.title = "Fabric Manager " + this.props.intl.formatMessage({ id: 'organization_manage' });
        let that = this;
        var headers = new Headers();

        var url = 'api/entity/organizations';
        fetch(url, {
            method: 'get',
            headers: headers,
            mode: "cors"
        }).then(response => {
            return response.json();
        })
            .then(function (data) {
                that.setState({ organizations: data.organizations == null ? [] : data.organizations });
            }).catch(function (e) {
                console.log(e);
            });
    }

    render() {
        const { history,intl } = this.props;
        const { activeTab, organizations,selected } = this.state;
        
        const handleChange = (event, value) => {
            this.setState({ activeTab: value });

        };
        let orgName = organizations[selected]!=undefined?organizations[selected].Name:"";
        return (
            <div className='container'>
                <OrganizationTable history={this.props.history} data={organizations} callback={this.callback} />
                <div style={{ marginTop: 25, width: "100%", flexGrow: 1 }}>
                    <Tabs value={activeTab} onChange={handleChange}>
                        <Tab label={orgName+" "+intl.formatMessage({id:"certificate"})} />
                        <Tab label={orgName+" "+"MSPs"} />
                    </Tabs>
                    {activeTab === 0 && <CertTable history={this.props.history} data={organizations} callback={this.callback} selected={this.state.selected} />}
                    {activeTab === 1 && <MspTable activeTab={activeTab} history={this.props.history} data={organizations} callback={this.callback} selected={this.state.selected} />}
                    
                </div>
            </div>
        )


    }
}

export default injectIntl(Organization);

