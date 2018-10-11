import React from 'react';
import OrganizationTable from './OrganizationTable';
import CertTable from './CertTable';
import MspTable from './MspTable';



class Organization extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: 0,
            data:[]
        };
    }

    callback = (state) => {
        this.setState(state);
    }

    componentDidMount = () => {
        document.title = "Fabric Manager 组织管理"
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
                that.setState({ data: data.organizations == null ? [] : data.organizations });
            }).catch(function (e) {
                console.log(e);
            });
    }

    render() {
        const { history } = this.props;

        return (
            <div className='container'>
                <OrganizationTable history={this.props.history} data={this.state.data} callback={this.callback} />
                <MspTable history={this.props.history} data={this.state.data} callback={this.callback} selected={this.state.selected} />
                <CertTable history={this.props.history} data={this.state.data} callback={this.callback} selected={this.state.selected} />
            </div>
        )


    }
}

export default Organization;

