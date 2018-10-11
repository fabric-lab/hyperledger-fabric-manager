import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

const toolbarStyles = theme => ({
    root: {
      paddingRight: theme.spacing.unit,
    },
    highlight:
      theme.palette.type === 'light'
        ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
        : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
    spacer: {
      flex: '1 1 100%',
    },
    actions: {
      color: theme.palette.text.secondary,
      flex: '0 0 auto',
    },
    title: {
      flex: '0 0 auto',
    },
    button: {
      margin: theme.spacing.unit,
    },
    leftIcon: {
      marginRight: theme.spacing.unit,
    }
  });

class EnhancedTableToolbar extends React.Component {

    constructor(props, context) {
      super(props, context);
    }

    render() {
        const {  classes, title,tooltip } = this.props;
        return (
          <Toolbar>
            <div className={classes.title}>
              <Typography variant="title" id="tableTitle">
                {title}
              </Typography>
            </div>
            <div className={classes.spacer} />
            <div className={classes.actions}>
      
              <div>
                  {tooltip}
               
      
              </div>
      
            </div>
      
          </Toolbar>
        );
    }
}

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

export default EnhancedTableToolbar;