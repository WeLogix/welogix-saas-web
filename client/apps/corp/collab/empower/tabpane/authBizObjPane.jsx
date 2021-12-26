import React, { Component } from 'react';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Collapse } from 'antd';
import { loadBizAuthConfig } from 'common/reducers/saasCollab';
import { loadPartnerFlowList } from 'common/reducers/scofFlow';
import BizAuthCard from './card/bizAuthCard';
import { formatMsg } from '../../message.i18n';

const { Panel } = Collapse;

@injectIntl
@connect(state => ({
  currentPartner: state.saasCollab.currentPartner,
}), { loadBizAuthConfig, loadPartnerFlowList })

export default class authBizObjPane extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  componentDidMount() {
    const partnerId = this.props.currentPartner.id;
    this.props.loadBizAuthConfig({ partnerId });
    this.props.loadPartnerFlowList({ partnerId, simple: true });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.currentPartner !== this.props.currentPartner) {
      const partnerId = nextProps.currentPartner.id;
      this.props.loadBizAuthConfig({ partnerId });
      this.props.loadPartnerFlowList({ partnerId, simple: true });
    }
  }
  msg = formatMsg(this.props.intl);
  bizOptions = {
    DELG: [{
      msg: this.msg('transMode'),
      bawField: 'trans_mode',
      paramType: 'transMode',
      dataType: 'string',
    }, {
      msg: this.msg('declareWay'),
      bawField: 'decl_way_code',
      paramType: 'declWayCodes',
      dataType: 'string',
    }, {
      msg: this.msg('createdDate'),
      bawField: 'created_date',
      dataType: 'date',
    }],
    DECL: [{
      msg: this.msg('tradeMode'),
      bawField: 'trade_mode',
      paramType: 'tradeMode',
      dataType: 'string',
    }, {
      msg: this.msg('declareWay'),
      bawField: 'decl_way_code',
      paramType: 'declWayCodes',
      dataType: 'string',
    }, {
      msg: this.msg('createdDate'),
      bawField: 'created_date',
      dataType: 'date',
    }],
    SOFORDER: [{
      msg: this.msg('collabFlow'),
      bawField: 'flow_id',
      paramType: 'flowList',
      dataType: 'number',
    }, {
      msg: this.msg('ownBy'),
      bawField: 'exec_login_id',
      paramType: 'userList',
      dataType: 'number',
    }, {
      msg: this.msg('transMode'),
      bawField: 'trans_mode',
      paramType: 'transMode',
      dataType: 'string',
    }, {
      msg: this.msg('createdDate'),
      bawField: 'created_date',
      dataType: 'date',
    }],
    INVOICE: [{
      msg: this.msg('invoiceDate'),
      bawField: 'invoice_date',
      dataType: 'date',
    }, {
      msg: this.msg('createdDate'),
      bawField: 'created_date',
      dataType: 'date',
    }],
  };
  render() {
    return (
      <Collapse accordion>
        <Panel header={this.msg('moduleSCOF')} key="scof">
          <BizAuthCard authBizObject="SOF_COMMINV" bizOptions={this.bizOptions.INVOICE} />
          <BizAuthCard authBizObject="SOF_ORDER" bizOptions={this.bizOptions.SOFORDER} />
        </Panel>
        <Panel header={this.msg('moduleCLEARANCE')} key="cms">
          <BizAuthCard authBizObject="CMS_DELEGATION" bizOptions={this.bizOptions.DELG} />
          <BizAuthCard authBizObject="CMS_CUSTOMS" bizOptions={this.bizOptions.DECL} />
        </Panel>
        {/* <Panel header={this.msg('moduleCWM')} key="cwm">
        </Panel>
        <Panel header={this.msg('moduleTRANSPORT')} key="tms">
        </Panel> */}
      </Collapse>
    );
  }
}
