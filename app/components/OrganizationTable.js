import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import EnhancedTableHead from './EnhancedTableHead';
import EnhancedTableToolbar from './EnhancedTableToolbar';



const columnData = [
  { id: 'Country', numeric: true, disablePadding: false, label: '国家' },
  { id: 'Province', numeric: true, disablePadding: false, label: '省份' },
  { id: 'Locality', numeric: true, disablePadding: false, label: '城市' },
  { id: 'Organization', numeric: true, disablePadding: false, label: '单位名称' },
  { id: 'CommonName', numeric: true, disablePadding: false, label: '公用名称' }
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

class OrganizationTable extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      order: 'asc',
      orderBy: 'CommonName',
      selected: [],
      data: []
    };
  }

  handleClick = (event, id) => {
    this.props.callback({ selected: id })
  };

  componentWillReceiveProps(newProps) {
    if (this.state.data !== newProps.data) {
      this.setState({data: newProps.data});
    }
  }

  handleViewClick = (event, key) => {
    let data = JSON.stringify({ key: key, formMode: "view" });
    this.props.history.push({
      pathname: `/organizationcard/${data}`,
    });
  };

  handleDelClick = (event, key) => {
    let that = this;
    var url = 'api/entity/organizations/' + key;
    fetch(url, {
      method: 'delete',
    }).then(response => {
      return response.json();
    }).then(function (data) {
        that.props.callback({ data: data == null ? [] : data, selected: 0 });
    }).catch(function (e) {
        console.log(e);
    });
  };

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

  addOrganization = event => {
    let data = JSON.stringify({ formMode: "edit" });
    this.props.history.push({
      pathname: `/organizationcard/${data}`
      
    });
  }


  render() {
    const { classes, history, data } = this.props;
    const { order, orderBy, selected } = this.state;
    const tooltip = (<Tooltip title="添加组织">
      <Button variant="raised" color="primary" className={classes.button} onClick={this.addOrganization}>
        <AddIcon className={classes.leftIcon} />
        添加组织
      </Button>
    </Tooltip>
    )

    return (
      <div className='container'>
        <div className='row flipInX'>
          <Paper className={classes.root}>
            <EnhancedTableToolbar title="组织" tooltip={tooltip} />
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
                      <TableRow
                        hover
                        onClick={event => this.handleClick(event, k)}
                        key ={n.CommonName}
                      >

                        <TableCell numeric>{n.Country}</TableCell>
                        <TableCell numeric>{n.Province}</TableCell>
                        <TableCell numeric>{n.Locality}</TableCell>
                        <TableCell numeric>{n.Organization}</TableCell>
                        <TableCell numeric>{n.CommonName}</TableCell>
                        <TableCell >
                          <Button className={classes.button} variant="contained" size="small" color="primary" onClick={event => this.handleDelClick(event, n.CommonName)} >  删 除 </Button>
                          <Button className={classes.button} variant="contained" size="small" color="primary" onClick={event => this.handleViewClick(event, n.CommonName)} >  查 看 </Button>
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

OrganizationTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrganizationTable);