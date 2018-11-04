import React from 'react';
import ChannelTable from './ChannelTable';
import { injectIntl  } from 'react-intl';


class Channel extends React.Component {

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
        document.title = "Fabric Manager "+this.props.intl.formatMessage({id:'channel_manage'})
        let that = this;
    
        var url = 'api/entity/channels';
        fetch(url, {
          method: 'get',
        }).then(response => {
          return response.json();
        })
        .then(function (data) {
            that.setState({ data: data.channels==null?[]:data.channels });
        }).catch(function (e) {
            console.log(e);
        });
      }

    render() {

        const { history } = this.props;

        return (
            <div className='container'>
              <ChannelTable history={this.props.history} data={this.state.data} callback ={this.callback}/>
            </div>
        )
    }
}

export default injectIntl(Channel);

