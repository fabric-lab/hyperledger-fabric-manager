import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

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
    const { classes } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    return (
      <div className='container'>
        <h3 className='text-center'>超级账本管理端</h3>
        <div className={'row ' + classes.row}>
          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.title} color="textSecondary">
                项目简介
                </Typography>

              <Typography className={classes.pos} color="textSecondary">
                1 学习超级账本(hyperledger fabric) 入门必备工具。
                </Typography>
              <Typography className={classes.pos} color="textSecondary">
                2 轻松搭建学习环境,无需使用docker容器。目前仅支持单机环境。
                </Typography>
              <Typography className={classes.pos} color="textSecondary">
                3 多平台支持 windows,liunx,mac。
                </Typography>
            </CardContent>
          </Card>
        </div>
        <div className={'row ' + classes.row}>
          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.title} color="textSecondary">
                当前功能
                </Typography>

              <Typography className={classes.pos} color="textSecondary">
                1 组织管理 MSP管理 证书管理 联盟管理 通道管理
                </Typography>
              <Typography className={classes.pos} color="textSecondary">
                2 链码管理 添加链码 启动链码 停止链码
                </Typography>
              <Typography className={classes.pos} color="textSecondary">
                3 Orderer管理 启动节点 停止节点 查看区块
                </Typography>
              <Typography className={classes.pos} color="textSecondary">
                4 Peer管理 启动节点 停止节点 通道清单 加入通道 获取通道信息 安装链码 链码清单 初始化链码 调用链码 查询链码
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

export default withStyles(styles)(Home);