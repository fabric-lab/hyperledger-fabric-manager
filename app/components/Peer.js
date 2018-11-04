import React from 'react';
import PeerTable from './PeerTable';
import { injectIntl  } from 'react-intl';


class Peer extends React.Component {

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
        document.title = "Fabric Manager "+this.props.intl.formatMessage({id:'peer_manage'});

        let that = this;
    
        var url = 'api/entity/peers';
        fetch(url, {
          method: 'get',
        }).then(response => {
          return response.json();
        })
        .then(function (data) {
            that.setState({ data: data.peers==null?[]:data.peers });
        }).catch(function (e) {
            console.log(e);
        });
      }

    render() {

        const { history } = this.props;

        return (
            <div className='container'>
              <PeerTable history={this.props.history} data={this.state.data} callback ={this.callback}/>
            </div>
        )
    }
}

export default injectIntl(Peer);

