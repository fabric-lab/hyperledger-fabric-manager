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
import { injectIntl } from 'react-intl';


const columnData = [
  { id: 'Name', numeric: true, disablePadding: false, label: 'msp_name' },
  { id: 'Path', numeric: true, disablePadding: false, label: 'path' },
  { id: 'Type', numeric: true, disablePadding: false, label: 'node_type' },
  { id: 'Role', numeric: true, disablePadding: false, label: 'role' }
];


const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  button: {
    margin: theme.spacing.unit,
  },
});

class MspTable extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      order: 'asc',
      orderBy: 'Name',
      selected: [],
      commonName: '',
      data: [],
      msps: [],
    };
  }

  componentWillReceiveProps(newProps) {
    if (this.state.data !== newProps.data ||
      this.state.selected !== newProps.selected) {
      let data = newProps.data;
      let selected = newProps.selected;
      if (data[selected] != undefined) {
        let msps = data[selected].MSPs;
        let commonName = data[selected].CommonName;

        this.setState({ data: newProps.data, msps: msps==undefined?[]:msps, commonName: commonName });
      } else {
        this.setState({ data: [], msps: [], commonName: '' });
      }
    }
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    const msps =
      order === 'desc'
        ? this.state.msps.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.state.msps.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({ msps, order, orderBy });
  };

  handleExportClick = (event, commonName,mspName) => {
      let formData = {};
      formData["Oper"] = "export_msp";
      formData["MspName"] = mspName;
      var url = `api/entity/organizations/${commonName}`;
      fetch(url,{
          method: 'put',
          body:JSON.stringify(formData)
      }).then(function(response) {
          return response;
      }).then(function(data) {
          console.log(data);
      }).catch(function(e) {
          console.log("Oops, error");
      });
  };

  handleDelClick = (event, commonName,mspName) => {
    let that  = this;
    let formData = {};
    formData["Oper"] = "del_msp";
    formData["MspName"] = mspName;
    var url = `api/entity/organizations/${commonName}`;
    fetch(url,{
        method: 'put',
        body:JSON.stringify(formData)
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        that.props.callback({ data: data == null ? [] : data, selected: 0 });
    }).catch(function(e) {
        console.log("Oops, error");
    });
  }

  handleViewClick = (event, commonName,mspName) => {
    let data = JSON.stringify({ formMode: "view", commonName: commonName, mspName:mspName });
    this.props.history.push({
      pathname: `/mspcard/${data}`

    });
  }

  addMsp = (event,commonName) => {
    let data = JSON.stringify({ formMode: "edit", commonName: commonName  });
    this.props.history.push({
      pathname: `/mspcard/${data}`

    });
  }

  render() {

    const { classes, history, data, selected, intl } = this.props;
    const { order, orderBy, msps ,commonName} = this.state;
    const tooltip = (<Tooltip title={intl.formatMessage({ id: "add_msp" })}>
      <Button variant="raised" color="primary" className={classes.button} onClick={event => this.addMsp(event, commonName)}>
        <AddIcon className={classes.leftIcon} />
        {intl.formatMessage({ id: "add_msp" })}
      </Button>
    </Tooltip>
    )

    return (
      <div className='container'>
        <div className='row flipInX'>
          <Paper className={classes.root}>
            <EnhancedTableToolbar title="MSPs" tooltip={tooltip} />
            <div className={classes.tableWrapper}>
              <Table className={classes.table} aria-labelledby="tableTitle">
                <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  columnData={columnData}
                  onRequestSort={this.handleRequestSort}
                />
                <TableBody>
                  {msps.map(n => {
                    return (
                      <TableRow key={n.Name}
                        hover
                      >
                        <TableCell numeric>{n.Name}</TableCell>
                        <TableCell numeric>{n.Path}</TableCell>
                        <TableCell numeric>{n.Type}</TableCell>
                        <TableCell numeric>{n.Role}</TableCell>
                        <TableCell >
                          <Button className={classes.button} variant="contained" size="small" color="primary" onClick={event => this.handleExportClick(event,commonName, n.Name)} >   {intl.formatMessage({id:"export"}) } </Button>
                          <Button className={classes.button} variant="contained" size="small" color="primary" onClick={event => this.handleViewClick(event,commonName, n.Name)} >   {intl.formatMessage({id:"view"}) } </Button>
                          <Button className={classes.button} variant="contained" size="small" color="primary" onClick={event => this.handleDelClick(event,commonName, n.Name)} >   {intl.formatMessage({id:"delete"}) } </Button>
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

MspTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(injectIntl(MspTable));