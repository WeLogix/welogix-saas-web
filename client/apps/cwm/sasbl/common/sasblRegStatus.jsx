import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { Badge, Tooltip, Icon, Tag } from 'antd';
import { SASBL_REG_STATUS } from 'common/constants';
import { formatMsg } from '../message.i18n';


@injectIntl
export default class SasblRegStatus extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    sasblReg: PropTypes.shape({ pre_sasbl_seqno: PropTypes.string }),
    statusCode: PropTypes.number,
  }
  msg = formatMsg(this.props.intl)

  render() {
    const {
      sasblReg, statusCode,
    } = this.props;

    const regStatus = SASBL_REG_STATUS.filter(reg => reg.value === statusCode)[0];
    if (sasblReg.sent_status === 2) { // 发送报文异常
      return (
        <span>
          {regStatus && (
            <Tooltip title={regStatus.text}>
              <Badge status={regStatus.badge} />
            </Tooltip>
          )}
          <Tooltip title={sasblReg.receipt_err_msg}>
            <Tag color="red">{this.msg('sendFail')}</Tag>
          </Tooltip>
        </span>
      );
    } else if (sasblReg.sent_status === 1) { // 报文已发送，尚未收到技术回执
      return (
        <span>
          {regStatus && (
            <Tooltip title={regStatus.text}>
              <Badge status={regStatus.badge} />
            </Tooltip>
          )}
          {this.msg('sending')} <Icon type="loading" />
        </span>
      );
    } else if (statusCode === 3 && sasblReg.sent_status === 3) { // 发送成功，数据中心已处理成功
      return (
        <span>
          {regStatus && (
            <Tooltip title={regStatus.text}>
              <Badge status={regStatus.badge} />
            </Tooltip>
          )}
          <Tooltip title={sasblReg.receipt_err_msg}>
            <Tag color="lime">{this.msg('sendSuccess')}</Tag>
          </Tooltip>
        </span>
      );
    } else if (statusCode === 3 && sasblReg.sent_status === 4) { // 接收成功，海关系统已接收入库
      return (
        <span>
          {regStatus && (
            <Tooltip title={regStatus.text}>
              <Badge status={regStatus.badge} />
            </Tooltip>
          )}
          <Tooltip title={sasblReg.receipt_err_msg}>
            <Tag color="green">{this.msg('recvSuccess')}</Tag>
          </Tooltip>
        </span>
      );
    } else if (regStatus) {
      return (
        <Badge status={regStatus.badge} color={regStatus.tagcolor} text={regStatus.text} />
      );
    }
    return <Tooltip title={`${this.msg('statusCode')}:${statusCode},${this.msg('sendCode')}:${sasblReg.sent_status}`}>{this.msg('unknownStatus')}</Tooltip>;
  }
}
