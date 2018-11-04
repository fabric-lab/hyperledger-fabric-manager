import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { injectIntl,FormattedMessage  } from 'react-intl';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  }
});


class Navbar extends React.Component {
  constructor(props) {
    super(props);

  }

  changeLang = (lang) => {
    window.location.href = `?${lang}`
  }


  render() {
    const { classes,intl } = this.props;
    return (
      <nav className='navbar navbar-default navbar-static-top'>
        <div className='navbar-header'>
          <Link to='/' className='navbar-brand'>
            Fabric Manager
          </Link>
        </div>
        <div id='navbar' className='navbar-collapse collapse'>
          <ul className='nav navbar-nav'>
            <li><Link to='/Organizations'>{intl.formatMessage({id:'organization_manage'}) }</Link></li>
            <li><Link to='/consortium'><FormattedMessage id="consortium_manage" /></Link></li>
            <li><Link to='/orderer'><FormattedMessage id="orderer_manage" /></Link></li>
            <li><Link to='/peer'><FormattedMessage id="peer_manage" /></Link></li>
            <li><Link to='/channel'><FormattedMessage id="channel_manage" /></Link></li>
            <li><Link to='/chaincode'><FormattedMessage id="chaincode_manage" /></Link></li>
          </ul>
            <Button  size="small" color="primary" onClick={event=>this.changeLang("en_US")}>
              English
            </Button>
            <Button  size="small" color="primary" onClick={event=>this.changeLang("zh_CN")}>
              中文
            </Button>
        </div>

      </nav>
    );
  }
}
export default withStyles(styles)(injectIntl(Navbar));
