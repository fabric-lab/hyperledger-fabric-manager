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
import { injectIntl  } from 'react-intl';



const columnData = [
  { id: 'Name', numeric: true, disablePadding: false, label: 'organization' },
  { id: 'CommonName', numeric: true, disablePadding: false, label:'common_name' },
  { id: 'Country', numeric: true, disablePadding: false, label: 'country' },
  { id: 'Province', numeric: true, disablePadding: false, label: 'province' },
  { id: 'Locality', numeric: true, disablePadding: false, label: 'locality' },

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
      orderBy: 'Organization',
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
    const { classes, history, data,intl } = this.props;
    const { order, orderBy, selected } = this.state;
    const tooltip = (<Tooltip title={intl.formatMessage({id:"add_organization"}) }>
      <Button variant="raised" color="primary" className={classes.button} onClick={this.addOrganization}>
        <AddIcon className={classes.leftIcon} />
        {intl.formatMessage({id:"add_organization"}) }
      </Button>
    </Tooltip>
    )

    return (
      <div className='container'>
        <div className='row flipInX'>
          <Paper className={classes.root}>
            <EnhancedTableToolbar title={intl.formatMessage({id:"organizations"}) } tooltip={tooltip} />
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
                        key ={n.Name}
                      >
                        <TableCell numeric>{n.Name}</TableCell>
                        <TableCell numeric>{n.CommonName}</TableCell>
                        <TableCell numeric>{n.Country}</TableCell>
                        <TableCell numeric>{n.Province}</TableCell>
                        <TableCell numeric>{n.Locality}</TableCell>
                        
                        <TableCell >
                          <Button key="delete" className={classes.button} variant="contained" size="small" color="primary" onClick={event => this.handleDelClick(event, n.Name)} >   {intl.formatMessage({id:"delete"}) } </Button>
                          <Button key="view" className={classes.button} variant="contained" size="small" color="primary" onClick={event => this.handleViewClick(event, n.Name)} >  {intl.formatMessage({id:"view"}) } </Button>
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

export default withStyles(styles)(injectIntl(OrganizationTable));