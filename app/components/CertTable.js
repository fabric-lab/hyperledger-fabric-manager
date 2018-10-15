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
import EnhancedTableToolbar from './EnhancedTableToolbar';
import EnhancedTableHead from './EnhancedTableHead'
import { injectIntl  } from 'react-intl';


const columnData = [
  { id: 'Name', numeric: true, disablePadding: false, label: 'common_name' }
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
});

class CertTable extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      order: 'asc',
      orderBy: 'Name',
      selected: [],
      commonName: '',
      pems: [],
      data: []
    };
  }


  componentWillReceiveProps(newProps) {
    if (this.state.data !== newProps.data || 
      this.state.selected !== newProps.selected) {
      let data = newProps.data;
      let selected = newProps.selected;
      if (data[selected] != undefined) {
        let pems = data[selected].PEMs;
        let commonName = data[selected].CommonName;
        this.setState({ data: newProps.data, pems: pems, commonName: commonName });
      } else {
        this.setState({ data: [], pems: [], commonName: '' });
      }
    }
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }
    const pems =
      order === 'desc'
        ? this.state.pems.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.state.pems.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({ pems, order, orderBy });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected });
  };

  handleViewClick = (event, caName, commonName) => {
    let data = JSON.stringify({ caName: caName, commonName: commonName });
    this.props.history.push({
      pathname: `/addcert/${data}`,
    });
  };




  render() {

    const { classes, history, data, selected,intl } = this.props;
    const { order, orderBy, pems, commonName } = this.state;


    return (
      <div className='container'>
        <div className='row flipInX'>
          <Paper className={classes.root}>
            <EnhancedTableToolbar title={intl.formatMessage({id:"certificate"}) } />
            <div className={classes.tableWrapper}>
              <Table className={classes.table} aria-labelledby="tableTitle">
                <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  columnData={columnData}
                  onRequestSort={this.handleRequestSort}
                />
                <TableBody>
                  {pems.map(n => {
                    return (
                      <TableRow
                        hover key={n.Name}
                      >
                        <TableCell numeric>{n.Name}</TableCell>
                        <TableCell>
                          <Button variant="contained" size="small" color="primary" onClick={event => this.handleViewClick(event, n.Name, commonName)} >  {intl.formatMessage({id:"view"}) }  </Button>
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

CertTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(injectIntl(CertTable));