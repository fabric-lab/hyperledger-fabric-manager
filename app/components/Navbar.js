import React from 'react';
import {Link} from 'react-router-dom';

class Navbar extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <nav className='navbar navbar-default navbar-static-top'>
        <div className='navbar-header'>
          
          <Link to='/' className='navbar-brand'>
            Fabric Manager
          </Link>
        </div>
        <div id='navbar' className='navbar-collapse collapse'>
          
          <ul className='nav navbar-nav'>
            <li><Link to='/Organizations'>组织管理</Link></li>
            <li><Link to='/consortium'>联盟管理</Link></li>
            <li><Link to='/orderer'>Orderer节点</Link></li>
            <li><Link to='/peer'>Peer节点</Link></li>
            <li><Link to='/channel'>通道(Channel)管理</Link></li>
            <li><Link to='/chaincode'>链码管理</Link></li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default Navbar;