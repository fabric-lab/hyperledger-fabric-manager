import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { injectIntl  } from 'react-intl';


const styles = {
  card: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    marginBottom: 16,
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  row: {
    marginTop: 12,
  }
};


class Home extends React.Component {
  constructor(props) {
    super(props);

  }



  render() {
    const { classes,intl } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    return (
      <div className='container'>
        <h3 className='text-center'>{intl.formatMessage({id:'desc_15'})}</h3>
        <div className={'row ' + classes.row}>
          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.title} color="textSecondary">
              {intl.formatMessage({id:'desc_14'})} 
                </Typography>
              <Typography className={classes.pos} color="textSecondary">
              {intl.formatMessage({id:'desc_13'})}
                </Typography>
              <Typography className={classes.pos} color="textSecondary">
               {intl.formatMessage({id:'desc_12'})}
                </Typography>
              <Typography className={classes.pos} color="textSecondary">
                {intl.formatMessage({id:'desc_11'})}
              </Typography>
            </CardContent>
          </Card>
        </div>
        <div className={'row ' + classes.row}>
          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.title} color="textSecondary">
              {intl.formatMessage({id:'desc_10'})}
                </Typography>

              <Typography className={classes.pos} color="textSecondary">
                {intl.formatMessage({id:'desc_6'})}
              </Typography>
              <Typography className={classes.pos} color="textSecondary">
              {intl.formatMessage({id:'desc_7'})}
                </Typography>
              <Typography className={classes.pos} color="textSecondary">
              {intl.formatMessage({id:'desc_8'})}
                </Typography>
              <Typography className={classes.pos} color="textSecondary">
              {intl.formatMessage({id:'desc_9'})}
                </Typography>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(injectIntl(Home));