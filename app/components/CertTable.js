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
  { id: 'Name', numeric: true, disablePadding: false, label: 'common_name' },
  { id: 'Type', numeric: true, disablePadding: false, label: 'ca_type' },
  { id: 'Key', numeric: true, disablePadding: false, label: 'key' }
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

const propsToPem=(props) => {
  let data = props.data;
  let selected = props.selected;
  if (data[selected] != undefined ) {
    let pems = data[selected].PEMs;
    let organization = data[selected].Name;
    return {  pems: pems==undefined?[]:pems, organization: organization };
  } else {
    return {  pems: [], organization: '' };
  }
}

class CertTable extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      order: 'asc',
      orderBy: 'Name',
      selected: [],
      ...propsToPem(props)
    };
  }


  componentWillReceiveProps(props) {
      this.setState(propsToPem(props));
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

  handleViewClick = (event, caName, organization) => {
    let data = JSON.stringify({ caName: caName, organization: organization, formMode: "view"  });
    this.props.history.push({
      pathname: `/certcard/${data}`,
    });
  };

  handleDelClick = (event, caName, organization) => {
    let that  = this;
    let formData = {};
    formData["Oper"] = "del_cert";
    formData["CaName"] = caName;
    var url = `api/entity/organizations/${organization}`;
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
};

  addCert = (event, organization) => {
    let data = JSON.stringify({ formMode: "edit", organization: organization });
    this.props.history.push({
      pathname: `/certcard/${data}`

    });
  }

  getCATypeName=(type) =>{
    if(type=="ca.root"){
        return this.props.intl.formatMessage({id:"ca_root"})
    }else if(type=="ca.common"){
      return this.props.intl.formatMessage({id:"ca_common"})
    }if(type=="tlsca.root"){
      return this.props.intl.formatMessage({id:"ca_tls_root"})
    }else if(type=="tlsca.common"){
      return this.props.intl.formatMessage({id:"ca_tls_common"})
    }
    return ""
  }

  render() {

    const { classes,intl } = this.props;
    const { order, orderBy, pems, organization } = this.state;

    const tooltip = (<Tooltip title={intl.formatMessage({ id: "add_cert" })}>
    <Button variant="raised" color="primary" className={classes.button} onClick={event => this.addCert(event, organization)}>
      <AddIcon className={classes.leftIcon} />
      {intl.formatMessage({ id: "add_cert" })}
    </Button>
  </Tooltip>)

    return (
      <div className='container'>
        <div className='row flipInX'>
          <Paper className={classes.root}>
            <EnhancedTableToolbar title={intl.formatMessage({id:"certificate"}) } tooltip={tooltip} />
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
                        <TableCell numeric>{this.getCATypeName(n.Type)}</TableCell>
                        <TableCell numeric>{n.Key==""?intl.formatMessage({id:"no"}):intl.formatMessage({id:"yes"})}</TableCell>
                        <TableCell>
                          <Button className={classes.button}  variant="contained" size="small" color="primary" onClick={event => this.handleViewClick(event, n.Name, organization)} >  {intl.formatMessage({id:"view"}) }  </Button>
                          <Button className={classes.button}  variant="contained" size="small" color="primary" onClick={event => this.handleDelClick(event, n.Name, organization)} >  {intl.formatMessage({id:"delete"}) }  </Button>
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