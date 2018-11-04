import React from 'react';
import ChainCodeTable from './ChainCodeTable';
import { injectIntl  } from 'react-intl';


class ChainCode extends React.Component {

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
        document.title = "Fabric Manager "+this.props.intl.formatMessage({id:'chaincode_manage'});

        let that = this;
    
        var url = 'api/entity/chaincodes';
        fetch(url, {
          method: 'get',
        }).then(response => {
          return response.json();
        })
        .then(function (data) {
            that.setState({ data: data.chaincodes==null?[]:data.chaincodes });
        }).catch(function (e) {
            console.log(e);
        });
      }

    render() {

        const { history } = this.props;

        return (
            <div className='container'>
              <ChainCodeTable history={this.props.history} data={this.state.data} callback ={this.callback}/>
            </div>
        )
    }
}

export default injectIntl(ChainCode);

