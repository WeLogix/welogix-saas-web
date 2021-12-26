/* eslint-disable camelcase */
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import { Avatar, Card, Tag, Typography } from 'antd';
import RowAction from 'client/components/RowAction';
import './style.less';

const { Paragraph } = Typography;

function getAvatar(bizobject) {
  if (bizobject === 'sofOrder') {
    return <Avatar src="https://welogix-web-static.oss-cn-shanghai.aliyuncs.com/images/icon-shipment.png" />;
  } else if (bizobject === 'cmsCustomsDecl') {
    return <Avatar src="https://welogix-web-static.oss-cn-shanghai.aliyuncs.com/images/icon-import.png" />;
  } else if (bizobject === 'tmsShipment') {
    return <Avatar src="https://welogix-web-static.oss-cn-shanghai.aliyuncs.com/images/icon-transport.png" />;
  } else if (bizobject === 'cwmReceiving') {
    return <Avatar src="https://welogix-web-static.oss-cn-shanghai.aliyuncs.com/images/icon-receiving.png" />;
  } else if (bizobject === 'cwmShipping') {
    return <Avatar src="https://welogix-web-static.oss-cn-shanghai.aliyuncs.com/images/icon-shipping.png" />;
  }
  return <Avatar icon="file-text" />;
}

export default class Activity extends React.Component {
  static propTypes = {
    activity: PropTypes.shape({
      title: PropTypes.string,
      status: PropTypes.number,
    }),
  }
  state = {
    expanded: false,
  }
  toggle = () => {
    this.setState({ expanded: !this.state.expanded });
  }
  renderTitle(title) {
    return (<span><a onClick={this.toggle}>{title}</a></span>);
  }
  renderExtra() {
    const { op_bizobject, created_date } = this.props.activity;
    const { expanded } = this.state;
    if (expanded) {
      const actions = (<span>
        <RowAction icon="close" onClick={this.toggle} />
      </span>);
      return actions;
    }
    return (<span>{created_date && <Tag>{moment(created_date).fromNow()}</Tag>}
      {getAvatar(op_bizobject)}
    </span>);
  }

  render() {
    const {
      op_ref_billno, op_content,
    } = this.props.activity;
    const { expanded } = this.state;
    const classes = classNames('welo-activity', {
      'welo-activity-expanded': expanded,
    });
    return (
      <div className={classes}>
        <Card
          title={this.renderTitle(op_content)}
          extra={this.renderExtra()}
        >
          <div className="welo-activity-content-wrapper">
            <Paragraph >{op_ref_billno}</Paragraph>
          </div>
        </Card>
      </div>
    );
  }
}
