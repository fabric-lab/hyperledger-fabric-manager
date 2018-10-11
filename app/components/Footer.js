import React from 'react';
import {Link} from 'react-router';


class Footer extends React.Component {
  constructor(props) {
    super(props);
 
  }

 

  render() {
    

    return (
      <footer>
        <div className='container'>
          <div className='row'>
            <div className='col-sm-5'>
              <h3 className='lead'><strong>Information</strong> and <strong>Copyright</strong></h3>
              <p>Powered by <strong>golang</strong>, <strong>bolt</strong> and <strong>React</strong> with Flux architecture and server-side rendering.</p>
              <p>You may view the <a href='https://github.com/fabric-lab/fabric-manager'>Source Code</a> behind this project on GitHub.</p>
           </div>
      
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;