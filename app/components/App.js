import React from 'react';
import {Route,Switch} from 'react-router-dom';
import Home from './Home';
import Navbar from './Navbar';
import Footer from './Footer';
import JsonForm from './JsonForm';
import Orderer from './Orderer';
import Peer from './Peer';
import CertTable from './CertTable';

import Organization from './Organization';
import OrdererCard from './OrdererCard';
import PeerCard from './PeerCard';
import CertCard from './CertCard';
import OrganizationCard from './OrganizationCard';
import Consortium from './Consortium';
import ConsortiumCard from './ConsortiumCard';
import Channel from './Channel';
import ChannelCard from './ChannelCard';
import ChainCode from './ChainCode';
import ChainCodeCard from './ChainCodeCard';
import ChainCodeConsoleCard from './ChainCodeConsoleCard';
import OrdererConsoleCard from './OrdererConsoleCard';
import PeerConsoleCard from './PeerConsoleCard'
import ChannelConsoleCard from './ChannelConsoleCard'


class App extends React.Component {
  render() {
    return (
      <div>
        <Navbar history={this.props.history} />
         <Switch>
                <Route exact path="/" component={Home}/>
                <Route path='/test' component={JsonForm} />
                <Route path='/certs' component={CertTable} history={this.props.history} />
                <Route path='/addcert/:data' component={CertCard} />
                <Route path='/organizationcard/:data' component={OrganizationCard} />
                <Route path='/Organizations' component={Organization} history={this.props.history} />
                <Route path='/Orderer' component={Orderer} history={this.props.history}/>
                <Route path='/Peer' component={Peer} history={this.props.history}/>
                <Route path='/orderercard/:data' component={OrdererCard} />
                <Route path='/peercard/:data' component={PeerCard} />
                <Route path='/consortium' component={Consortium} />
                <Route path='/consortiumcard/:data' component={ConsortiumCard} />
                <Route path='/channel' component={Channel} />
                <Route path='/channelcard/:data' component={ChannelCard} />
                <Route path='/chaincode' component={ChainCode} />
                <Route path='/chaincodecard/:data' component={ChainCodeCard} />
                <Route path='/chainCodeconsolecard/:data' component={ChainCodeConsoleCard} />
                
                <Route path='/channelConsoleCard/:data' component={ChannelConsoleCard} />
                <Route path='/ordererconsolecard/:data' component={OrdererConsoleCard} />
                <Route path='/peerconsolecard/:data' component={PeerConsoleCard} />
         </Switch>
        <Footer />
      </div>
    );
  }
}

// class App extends React.Component {
//   render() {
//     return (
//       <div>
//         aaaaa
//       </div>
//     );
//   }
// }

export default App;