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



const columnData = [
  { id: 'Name', numeric: true, disablePadding: false, label: 'node_name' },
  { id: 'LedgerType', numeric: true, disablePadding: false, label: 'ledger_type' },
  { id: 'ListenAddress', numeric: true, disablePadding: false, label: 'ip_address' },
  { id: 'ListenPort', numeric: true, disablePadding: false, label: 'port' },
  { id: 'LocalMSPID', numeric: true, disablePadding: false, label: 'msp_id' },
  { id: 'Consortiums', numeric: true, disablePadding: false, label: 'consortium' },
  
];

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  button: {
    margin: theme.spacing.unit,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

class OrdererTable extends React.Component {
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
      pathname: `/orderercard/${data}`
    });
  };

  handleConsoleClick = (event, key) => {
    let data = JSON.stringify({ key: key });
    this.props.history.push({
      pathname: `/ordererconsolecard/${data}`,
    });
  };

  handleDelClick = (event, key) => {
    let that = this;

    var url = 'api/entity/orderers/' + key;
    fetch(url, {
      method: 'delete',
    }).then(response => {
      return response.json();
    })
    .then(function (data) {
        that.props.callback({ data: data==null?[]:data ,selected:0});
    }).catch(function (e) {
        console.log(e);
    });
  };


  addOrderer = event => {
    let data = JSON.stringify({ formMode: "edit" });
    this.props.history.push({
      pathname: `/orderercard/${data}`,
    });
  }

  render() {
    const { classes, history,data } = this.props;
    const { order, orderBy, selected } = this.state;
    const tooltip = (<Tooltip title="添加order">
      <Button variant="raised" color="primary" className={classes.button} onClick={this.addOrderer}>
        <AddIcon className={classes.leftIcon} />
        添加order
      </Button>
    </Tooltip>
    )
    return (
      <div className='container'>
        <div className='row flipInX'>
          <Paper className={classes.root}>
          <EnhancedTableToolbar title="order节点" tooltip={tooltip} />
            <div className={classes.tableWrapper}>
              <Table className={classes.table} aria-labelledby="tableTitle">
              <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  columnData={columnData}
                  onRequestSort={this.handleRequestSort}
                />
                <TableBody>
                  {data.map((n,k) => {
                    return (
                      <TableRow key={n.Name}
                      >

                        <TableCell numeric>{n.Name}</TableCell>
                        <TableCell numeric>{n.LedgerType}</TableCell>
                        <TableCell numeric>{n.ListenAddress}</TableCell>
                        <TableCell numeric>{n.ListenPort}</TableCell>
                        <TableCell numeric>{n.LocalMSPID}</TableCell>
                        <TableCell numeric>{n.Consortiums==null?"":n.Consortiums.join()}</TableCell>
                        <TableCell>
                          <Button className={classes.button} variant="contained" size="small" color="primary" onClick={event => this.handleDelClick(event, n.Name)} >  删除 </Button>
                          <Button className={classes.button} variant="contained" size="small" color="primary" onClick={event => this.handleViewClick(event, n.Name)} >  查看 </Button>
                          <Button className={classes.button} variant="contained" size="small" color="primary" onClick={event => this.handleConsoleClick(event, n.Name)} >  控制台 </Button>
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

OrdererTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrdererTable);