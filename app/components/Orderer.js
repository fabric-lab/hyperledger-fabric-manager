import React from 'react';
import OrdererTable from './OrdererTable';
import { injectIntl  } from 'react-intl';


class Orderer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selected:0,
            data: []
          };
    }

    callback =(state)=>{
        this.setState(state)
    }

    componentDidMount = () => {
        document.title = "Fabric Manager "+this.props.intl.formatMessage({id:'orderer_manage'});
        let that = this;
    
        var url = 'api/entity/orderers';
        fetch(url, {
          method: 'get',
        }).then(response => {
          return response.json();
        })
        .then(function (data) {
            that.setState({ data: data.orderers==null?[]:data.orderers });
        }).catch(function (e) {
            console.log(e);
        });
      }

    render() {

        const { history } = this.props;

        return (
            <div className='container'>
              <OrdererTable history={this.props.history} data={this.state.data} callback ={this.callback}/>
            </div>
        )
    }
}

export default injectIntl(Orderer);

