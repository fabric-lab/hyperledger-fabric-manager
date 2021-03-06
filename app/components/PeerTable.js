import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import EnhancedTableHead from './EnhancedTableHead';
import EnhancedTableToolbar from './EnhancedTableToolbar';
import { injectIntl  } from 'react-intl';



const columnData = [
  { id: 'Name', numeric: true, disablePadding: false, label: 'node_name' },
  { id: 'ListenAddress', numeric: true, disablePadding: false, label: 'ip_address' },
  { id: 'ListenPort', numeric: true, disablePadding: false, label: 'port' },
  { id: 'ChainCodeListenPort', numeric: true, disablePadding: false, label: 'chaincode_name' },
  { id: 'EventListenPort', numeric: true, disablePadding: false, label: 'event_port' },
  { id: 'LocalMSPID', numeric: true, disablePadding: false, label: 'peer_msp' },
  { id: 'AdminMSPID', numeric: true, disablePadding: false, label: 'admin_msp' },
  
];


const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  button: {
    margin: theme.spacing.unit,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

class PeerTable extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      order: 'asc',
      orderBy: 'calories',
      selected: [],
      data: []
    };
  }



  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    const data =
      order === 'desc'
        ? this.state.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.state.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({ data, order, orderBy });
  };


  handleViewClick = (event, key) => {
    let data = JSON.stringify({ key: key,formMode:"view" });
    this.props.history.push({
      pathname: `/peercard/${data}`
    });
  };

  handleConsoleClick = (event, key) => {
    let data = JSON.stringify({ key: key });
    this.props.history.push({
      pathname: `/peerconsolecard/${data}`
    });
  };

  handleDelClick = (event, key) => {
    let that = this;

    var url = `api/entity/peers/${key}`;
    fetch(url, {
      method: 'delete',
      mode: "cors"
    }).then(response => {
      return response.json();
    })
      .then(function (data) {
        that.props.callback({ data: data == null ? [] : data, selected: 0 });
      }).catch(function (e) {
        console.log(e);
      });
  };


  addPeer = event => {
    let data = JSON.stringify({ formMode:"edit" });
    this.props.history.push({
      pathname: `/peercard/${data}`
    });
  }

  render() {
    const { classes, history, data,intl } = this.props;
    const { order, orderBy, selected } = this.state;
    const tooltip = (<Tooltip title={intl.formatMessage({id:'add_peer'})}>
      <Button variant="raised" color="primary" className={classes.button} onClick={this.addPeer}>
        <AddIcon className={classes.leftIcon} />
        {intl.formatMessage({id:'add_peer'})}
      </Button>
    </Tooltip>
    )
    return (
      <div className='container'>
        <div className='row flipInX'>
          <Paper className={classes.root}>
            <EnhancedTableToolbar title={intl.formatMessage({id:'peer_manage'})} tooltip={tooltip} />
            <div className={classes.tableWrapper}>
              <Table className={classes.table} aria-labelledby="tableTitle">
                <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  columnData={columnData}
                  onRequestSort={this.handleRequestSort}
                />
                <TableBody>
                  {data.map((n, k) => {
                    return (
                      <TableRow key={n.Name}> 
                        <TableCell numeric>{n.Name}</TableCell>
                        <TableCell numeric>{n.ListenAddress}</TableCell>
                        <TableCell numeric>{n.ListenPort}</TableCell>
                        <TableCell numeric>{n.ChainCodeListenPort}</TableCell>
                        <TableCell numeric>{n.EventListenPort}</TableCell>
                        <TableCell numeric>{n.LocalMSPID}</TableCell>
                        <TableCell numeric>{n.AdminMSPID}</TableCell>
                        
                        <TableCell>
                          <Button className={classes.button} variant="contained" size="small" color="primary" onClick={event => this.handleDelClick(event, n.Name)} >  {intl.formatMessage({id:'delete'})} </Button>
                          <Button className={classes.button} variant="contained" size="small" color="primary" onClick={event => this.handleViewClick(event, n.Name)} >  {intl.formatMessage({id:'view'})} </Button>
                          <Button className={classes.button} variant="contained" size="small" color="primary" onClick={event => this.handleConsoleClick(event, n.Name)} >  {intl.formatMessage({id:'console_panel'})} </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}


                </TableBody>
              </Table>
            </div>

          </Paper>
        </div>
      </div>
    );
  }
}

PeerTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(injectIntl(PeerTable));