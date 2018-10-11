import React from 'react';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';

class EnhancedTableHead extends React.Component {

    constructor(props, context) {
      super(props, context);
    }
    
    createSortHandler = property => event => {
      this.props.onRequestSort(event, property);
    };

 

    render() {
        const { order, orderBy,columnData,data  } = this.props;

        return (
          <TableHead>
            <TableRow>
    
              {columnData.map(column => {
                return (
                  <TableCell
                    key={column.id}
                    numeric={column.numeric}
                    padding={column.disablePadding ? 'none' : 'default'}
                    sortDirection={orderBy === column.id ? order : false}
                  >
                    <Tooltip
                      title="Sort"
                      placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                      enterDelay={300}
                    >
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={order}
                        onClick={this.createSortHandler(column.id)}
                      >
                        {column.label}
                      </TableSortLabel>
                    </Tooltip>
                  </TableCell>
                );
              }, this)}
              <TableCell >
                操作
              </TableCell>
            </TableRow>
          </TableHead>

        )
    }
}

export default EnhancedTableHead;