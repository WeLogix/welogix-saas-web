import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Form, Layout, Button, Tabs, message } from 'antd';
import moment from 'moment';
import MagicCard from 'client/components/MagicCard';
import PageHeader from 'client/components/PageHeader';
import connectNav from 'client/common/decorators/connect-nav';
import { loadPermit, updatePermit } from 'common/reducers/cmsPermit';
import { createPermitEditLog } from 'common/reducers/operationLog';
import { CIQ_GOODS_LIMITS_TYPE } from 'common/constants';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import PermitHeadPane from './tabpane/permitHeadPane';
import PermitItemsPane from './tabpane/permitItemsPane';
import PermitUsagePane from './tabpane/permitUsagePane';
import PermitLogPane from './tabpane/permitLogPane';
import { formatMsg } from './message.i18n';


const { Content } = Layout;
const { TabPane } = Tabs;

@injectIntl
@connect(
  (state) => {
    const certParams = state.saasParams.latest.certMark
      .map(f => ({ value: f.cert_code, text: f.cert_spec }));
    return {
      loginName: state.account.username,
      currentPermit: state.cmsPermit.currentPermit,
      certType: certParams.concat(CIQ_GOODS_LIMITS_TYPE),
      formParams: state.saasParams.latest,
    };
  },
  { loadPermit, updatePermit, createPermitEditLog }
)
@connectNav({
  depth: 3,
  moduleName: 'clearance',
})
@Form.create()
export default class PermitDetail extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    this.props.loadPermit(this.context.router.params.id);
  }
  msg = formatMsg(this.props.intl)
  handleSave = () => {
    const permitKeys = {
      permit_no: '证书编号',
      owner_partner_id: '所属企业',
      permit_category: '涉证标准',
      permit_code: '证书类型',
      usage_control: '次数管控',
      max_usage: '总使用次数',
      ava_usage: '剩余次数',
      expiry_control: '有效期管控',
      start_date: '发证日期',
      stop_date: '到期日期',
      // status: '证书状态',
      permit_file: '证书文件',
      permit_match_rule: '表体匹配规则',
      match_decl_way_code: '匹配规则-报关类型',
      match_trade_mode: '匹配规则-监管方式',
      match_remission_mode: '匹配规则-征免方式',
      match_trxn_mode: '匹配规则-成交方式',
    };
    const matchRule = {
      1: '商品货号',
      2: 'HS编码+品名',
    };
    const matchDeclWay = {
      IMPT: '进口',
      EXPT: '出口',
      IBND: '进境',
      EBND: '出境',
    };
    const {
      currentPermit, certType, formParams: { tradeMode, trxnMode, remissionMode },
    } = this.props;
    const certMap = new Map();
    certType.forEach(f => certMap.set(f.value, f.text));
    const tradeModeMap = new Map();
    tradeMode.forEach(f => tradeModeMap.set(f.trade_mode, f.trade_abbr));
    const trxnModeMap = new Map();
    trxnMode.forEach(f => trxnModeMap.set(f.trx_mode, f.trx_abbr));
    const remissionModeMap = new Map();
    remissionMode.forEach(f => remissionModeMap.set(f.rm_mode, f.rm_abbr));
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        const permitId = this.context.router.params.id;
        if (values.start_date) values.start_date.set({ hour: 0, minute: 0, second: 0 });
        if (values.stop_date) values.stop_date.set({ hour: 0, minute: 0, second: 0 });
        const data = { permit_file: currentPermit.permit_file, attach_id: currentPermit.attach_id };
        const opContent = [];
        // 排除未加载的字段(匹配条件)
        Object.keys(values).forEach((key) => {
          let currVal = values[key] || null; // 单选框清空后值为undefined需转为null
          if (Array.isArray(currVal)) currVal = currVal.join(',');
          if (key === 'expiry_control' || key === 'usage_control') currVal = Number(currVal); // switch值为true/null
          data[key] = currVal;
          let originVal = currentPermit[key];
          if (key !== 'check_match_decl_way_code' && key !== 'check_match_trade_mode' && key !== 'check_match_remission_mode' && key !== 'check_match_trxn_mode' &&
            key !== 'permit_file' && currVal !== originVal) {
            if (key === 'usage_control' || key === 'expiry_control') {
              opContent.push(`[${permitKeys[key]}]由'${originVal ? '开启' : '关闭'}'改为'${currVal ? '开启' : '关闭'}'`);
            } else if (key === 'start_date' || key === 'stop_date') {
              if (moment(originVal).toString() !== moment(currVal).toString()) {
                opContent.push(`[${permitKeys[key]}]由'${moment(originVal).format('YYYY-MM-DD')}'改为'${moment(currVal).format('YYYY-MM-DD')}'`);
              }
            } else if (key === 'permit_category') {
              opContent.push(`[${permitKeys[key]}]由'${originVal === 'customs' ? '海关监管证件' : '检验检疫证件'}'改为'${currVal === 'customs' ? '海关监管证件' : '检验检疫证件'}'`);
            } else if (key === 'permit_code') {
              opContent.push(`[${permitKeys[key]}]由'${certMap.get(originVal) || '空值'}'改为'${certMap.get(currVal) || '空值'}'`);
            } else if (key === 'permit_match_rule') {
              originVal = originVal || 1;
              if (originVal !== currVal) opContent.push(`[${permitKeys[key]}]由'${matchRule[originVal] || '空值'}'改为'${matchRule[currVal] || '空值'}'`);
            } else if (key === 'match_decl_way_code') {
              const oldData = originVal ? originVal.split(',').map(f => matchDeclWay[f]).join(',') : '空值';
              const newData = currVal ? currVal.split(',').map(f => matchDeclWay[f]).join(',') : '空值';
              if (oldData !== newData) opContent.push(`[${permitKeys[key]}]由'${oldData}'改为'${newData}'`);
            } else if (key === 'match_trade_mode') {
              const oldData = originVal ? originVal.split(',').map(f => tradeModeMap.get(f)).join(',') : '空值';
              const newData = currVal ? currVal.split(',').map(f => tradeModeMap.get(f)).join(',') : '空值';
              if (oldData !== newData) opContent.push(`[${permitKeys[key]}]由'${oldData}'改为'${newData}'`);
            } else if (key === 'match_trxn_mode') {
              opContent.push(`[${permitKeys[key]}]由'${trxnModeMap.get(originVal) || '空值'}'改为'${trxnModeMap.get(currVal) || '空值'}'`);
            } else if (key === 'match_remission_mode') {
              opContent.push(`[${permitKeys[key]}]由'${remissionModeMap.get(originVal) || '空值'}'改为'${remissionModeMap.get(currVal) || '空值'}'`);
            } else if (key === 'permit_file') {
              if (!!originVal !== !!currVal) opContent.push(`[${permitKeys[key]}]由'${remissionModeMap.get(originVal) || '空值'}'改为'${remissionModeMap.get(currVal) || '空值'}'`);
            } else {
              opContent.push(`[${permitKeys[key]}]由'${originVal || '空值'}'改为'${currVal || '空值'}'`);
            }
          }
        });
        this.props.updatePermit(permitId, data, opContent).then((result) => {
          if (!result.error) {
            message.info(this.msg('updateSuccess'));
            this.props.loadPermit(this.context.router.params.id);
          }
        });
      }
    });
  }
  handleCancel = () => {
    this.context.router.push('/clearance/permit/');
  }
  render() {
    const { form, currentPermit } = this.props;
    const readonly = currentPermit.status === -2;
    const tabs = [];
    tabs.push(<TabPane tab={this.msg('infoTab')} key="head">
      <PermitHeadPane readonly={readonly} action="edit" form={form} />
    </TabPane>);
    tabs.push(<TabPane tab={this.msg('itemsTab')} key="items">
      <PermitItemsPane readonly={readonly} form={form} />
    </TabPane>);
    tabs.push(<TabPane tab={this.msg('usageTab')} key="usage">
      <PermitUsagePane />
    </TabPane>);
    tabs.push(<TabPane tab={this.msg('editTab')} key="edit">
      <PermitLogPane />
    </TabPane>);
    return (
      <Layout>
        <PageHeader breadcrumb={[this.msg('permit'), this.msg('editPermit')]}>
          <PageHeader.Actions>
            <Button onClick={this.handleCancel}>
              {this.msg('cancel')}
            </Button>
            <PrivilegeCover module="clearance" feature="compliance" action="edit">
              <Button type="primary" icon="save" onClick={this.handleSave}>
                {this.msg('save')}
              </Button>
            </PrivilegeCover>
          </PageHeader.Actions>
        </PageHeader>
        <Content className="page-content">
          <MagicCard bodyStyle={{ padding: 0 }}>
            <Tabs defaultActiveKey="head">
              {tabs}
            </Tabs>
          </MagicCard>
        </Content>
      </Layout>
    );
  }
}
