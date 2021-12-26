import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon, Badge, Popover } from 'antd';
import { toggleReturnMsgPanel } from 'common/reducers/cmsCustomsDeclare';
import { CMS_DECL_STATUS } from 'common/constants';
import RowAction from 'client/components/RowAction';
import ReturnMsgPanel from '../../declaration/panel/returnMsgPanel';


@connect(
  () => ({}),
  { toggleReturnMsgPanel }
)
export default class DeclStatusPopover extends React.Component {
  static propTypes = {
    declStatus: PropTypes.number.isRequired,
    declSent: PropTypes.shape({
      sent_status: PropTypes.number,
      sent_fail_msg: PropTypes.string,
      send_date: PropTypes.string,
    }),
    entryId: PropTypes.string,
    returnFile: PropTypes.string,
  }
  render() {
    const {
      entryId, declStatus, declSent, returnFile,
    } = this.props;
    let extra;
    const declStatusKey = Object.keys(CMS_DECL_STATUS).filter(stkey =>
      CMS_DECL_STATUS[stkey].value === declStatus)[0];
    if (declStatusKey) {
      const decl = CMS_DECL_STATUS[declStatusKey];
      let badgeStatus = decl.badge;
      if (declStatus === CMS_DECL_STATUS.sent.value) {
        if (declSent.sent_status === 1) {
          return <Badge status="processing" text="发送中" />;
        } else if (declSent.sent_status === 2) {
          extra = <Popover content={declSent.sent_fail_msg} placement="right"><Icon type="warning" style={{ color: '#f50' }} /></Popover>;
          return <span><Badge status="warning" text="发送失败" />{extra}</span>;
        } else if (declSent.send_date &&
          (Date.now() - new Date(declSent.send_date).getTime()) > 6 * 3600000) {
          extra = <Popover content="超过6小时未接收到回执" placement="right"><Icon type="warning" style={{ color: '#f50' }} /></Popover>;
          badgeStatus = 'warning';
        }
      }
      if (declStatus >= CMS_DECL_STATUS.entered.value && entryId) {
        extra = <RowAction shape="circle" icon="bars" tooltip="通关状态回执" onClick={() => { this.props.toggleReturnMsgPanel(true, returnFile, entryId); }} />;
      }
      return (<span>
        <Badge status={badgeStatus} text={decl.text} /> {extra}
        {entryId && <ReturnMsgPanel currentEntryId={entryId} />}
      </span>);
    }
    return null;
  }
}
