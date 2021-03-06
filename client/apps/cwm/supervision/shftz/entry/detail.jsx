import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { Alert, Badge, Card, Row, Col, Form, Layout, InputNumber, Popover, Radio, Button, Tag, Tabs, message, notification } from 'antd';
import connectNav from 'client/common/decorators/connect-nav';
import EditableCell from 'client/components/EditableCell';
import SearchBox from 'client/components/SearchBox';
import PageHeader from 'client/components/PageHeader';
import MagicCard from 'client/components/MagicCard';
import DataPane from 'client/components/DataPane';
import FormPane from 'client/components/FormPane';
import Summary from 'client/components/Summary';
import {
  updateEntryReg, refreshEntryRegFtzCargos, splitCustomEntryDetails, fileEntryRegs,
  queryEntryRegInfos, putCustomsRegFields, loadInboundTotalValue, loadEntryDetails, loadEntryBody,
  updateRegDetailByEntGNo,
} from 'common/reducers/cwmShFtz';
import { CWM_SHFTZ_APIREG_STATUS, CWM_SHFTZ_IN_REGTYPES, CWM_SHFTZ_ENTRY_STATUS } from 'common/constants';
import { PrivilegeCover, hasPermission } from 'client/common/decorators/withPrivilege';
import InboundTreePopover from '../../../common/popover/inboundTreePopover';
import { formatMsg } from '../message.i18n';

const { Content } = Layout;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const FormItem = Form.Item;
const { TabPane } = Tabs;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
  colon: false,
};
const renderCombineData = (fieldVal, options) => {
  const foundOpts = options.filter(opt => opt.value === fieldVal);
  const label = foundOpts.length === 1 ? foundOpts[0].text : fieldVal;
  return label && label.length > 0 ? <Tag>{label}</Tag> : <span />;
};
const wrapTextByTag = text => <Tag>{text}</Tag>;

@injectIntl
@connect(
  state => ({
    primaryEntryReg: state.cwmShFtz.entry_asn,
    entryRegs: state.cwmShFtz.entry_regs,
    inboundTotalValue: state.cwmShFtz.multiRegStats,
    unit: state.saasParams.latest.unit.map(un => ({
      value: un.unit_code,
      text: `${un.unit_code}|${un.unit_name}`,
    })),
    country: state.saasParams.latest.country.map(tc => ({
      value: tc.cntry_co,
      text: `${tc.cntry_co}|${tc.cntry_name_cn}`,
    })),
    currency: state.saasParams.latest.currency.map(cr => ({
      value: cr.curr_code,
      text: `${cr.curr_code}|${cr.curr_name}`,
    })),
    whse: state.cwmContext.defaultWhse,
    whseOwners: state.cwmContext.whseAttrs.owners.map(whown => ({
      key: whown.customs_code,
      text: `${whown.customs_code}|${whown.name}`,
      name: whown.name,
    })),
    submitting: state.cwmShFtz.submitting,
    privileges: state.account.privileges,
  }),
  {
    updateEntryReg,
    refreshEntryRegFtzCargos,
    splitCustomEntryDetails,
    fileEntryRegs,
    queryEntryRegInfos,
    putCustomsRegFields,
    loadInboundTotalValue,
    loadEntryDetails,
    loadEntryBody,
    updateRegDetailByEntGNo,
  }
)
@connectNav({
  depth: 3,
  moduleName: 'cwm',
  title: 'featCwmShftz',
  jumpOut: true,
})
export default class SHFTZEntryDetail extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    activeTabKey: 'regDetails',
    selectedRowKeys: [],
    regIndex: 0, // ??????????????????????????????????????????
    splitNum: 2,
  }
  componentDidMount() {
    // ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
    // TabChange????????????????????????????????????????????????????????????????????????????????????????????????????????????
    const { preEntrySeqNo } = this.props.params;
    this.props.loadEntryDetails({ preEntrySeqNo });
    this.props.loadInboundTotalValue(preEntrySeqNo);
  }
  columns = [{
    title: '??????',
    dataIndex: 'asn_seq_no',
    width: 50,
    align: 'center',
    className: 'table-col-seq',
  }, {
    title: '?????????',
    dataIndex: 'ftz_cargo_no',
    width: 160,
  }, {
    title: '????????????',
    dataIndex: 'cargo_type',
    width: 100,
    render: cargo => (cargo === '14' ? <Tag color="green">????????????</Tag> : <Tag>????????????</Tag>),
  }, {
    title: '????????????ID',
    dataIndex: 'ftz_ent_detail_id',
    width: 120,
  }, {
    title: '??????',
    dataIndex: 'ent_g_no',
    width: 120,
    render: (o, record) => (
      this.isEntryDetailEditable(CWM_SHFTZ_APIREG_STATUS.processing)
        ? <EditableCell
          value={o}
          btnPosition="right"
          onSave={value => this.props.updateRegDetailByEntGNo(
            { id: record.id },
        { ent_g_no: value ? Number(value) : null }
      )}
        /> : o),
  }, {
    title: '????????????',
    dataIndex: 'product_no',
    width: 160,
  }, {
    title: '????????????',
    dataIndex: 'hscode',
    width: 150,
  }, {
    title: '????????????',
    dataIndex: 'g_name',
    width: 150,
    render: (o, record) => (
      record.ent_g_no && this.isEntryDetailEditable(CWM_SHFTZ_APIREG_STATUS.processing)
        ? <EditableCell
          value={o}
          btnPosition="right"
          onSave={value => this.props.updateRegDetailByEntGNo(
            {
              pre_ftz_ent_no: this.props.entryRegs[this.state.regIndex].pre_ftz_ent_no,
              ent_g_no: record.ent_g_no,
            },
        { g_name: value }
      )}
        /> : o),
  }, {
    title: '????????????',
    dataIndex: 'model',
    width: 250,
  }, {
    title: '??????',
    dataIndex: 'qty',
    width: 100,
    render: o => (<b>{o}</b>),
  }, {
    title: '????????????',
    dataIndex: 'stock_qty',
    width: 100,
    render: o => (<b>{o}</b>),
  }, {
    title: '??????',
    dataIndex: 'unit',
    width: 200,
    render: (o, record) => (record.ent_g_no && this.isEntryDetailEditable() ? <EditableCell
      renderMiddleWare={wrapTextByTag}
      value={o}
      btnPosition="right"
      type="select"
      options={this.props.unit}
      onSave={value => this.props.updateRegDetailByEntGNo(
        {
          pre_ftz_ent_no: this.props.entryRegs[this.state.regIndex].pre_ftz_ent_no,
          ent_g_no: record.ent_g_no,
        },
        { unit: value }
      )}
    /> : renderCombineData(o, this.props.unit)),
  }, {
    title: '??????',
    width: 100,
    dataIndex: 'net_wt',
  }, {
    title: '????????????',
    width: 100,
    dataIndex: 'stock_netwt',
  }, {
    title: '??????',
    width: 100,
    dataIndex: 'gross_wt',
  }, {
    title: '??????',
    width: 100,
    dataIndex: 'amount',
  }, {
    title: '????????????',
    width: 100,
    dataIndex: 'stock_amount',
  }, {
    title: '??????',
    width: 200,
    dataIndex: 'currency',
    render: (o, record) => (record.ent_g_no && this.isEntryDetailEditable() ? <EditableCell
      renderMiddleWare={wrapTextByTag}
      value={o}
      btnPosition="right"
      type="select"
      options={this.props.currency}
      onSave={value => this.props.updateRegDetailByEntGNo(
        {
        pre_ftz_ent_no: this.props.entryRegs[this.state.regIndex].pre_ftz_ent_no,
        ent_g_no: record.ent_g_no,
        },
        { currency: value }
      )}
    /> : renderCombineData(o, this.props.currency)),
  }, {
    title: '?????????',
    dataIndex: 'country',
    width: 200,
    render: (o, record) => (record.ent_g_no && this.isEntryDetailEditable() ? <EditableCell
      renderMiddleWare={wrapTextByTag}
      value={o}
      btnPosition="right"
      type="select"
      options={this.props.country}
      onSave={value => this.props.updateRegDetailByEntGNo(
        {
          pre_ftz_ent_no: this.props.entryRegs[this.state.regIndex].pre_ftz_ent_no,
          ent_g_no: record.ent_g_no,
        },
        { country: value }
      )}
    /> : renderCombineData(o, this.props.country)),
  }, {
    title: '??????',
    width: 100,
    dataIndex: 'freight',
  }, {
    title: '????????????',
    width: 100,
    dataIndex: 'stock_freight',
  }, {
    title: '????????????',
    width: 100,
    dataIndex: 'freight_currency',
    render: o => renderCombineData(o, this.props.currency),
  }];
  msg = formatMsg(this.props.intl)
  editPermission = hasPermission(this.props.privileges, {
    module: 'cwm', feature: 'supervision', action: 'edit',
  })
  handleLoadEntryBodyList = (currentParam, pageSizeParam, filterParam) => {
    const { entryRegs } = this.props;
    const { regIndex } = this.state;
    const { pre_ftz_ent_no: regFtzEntNo, details, filter } = entryRegs[regIndex];
    const currentPage = currentParam || details.current;
    const currentSize = pageSizeParam || details.pageSize;
    const currentFilter = JSON.stringify(filterParam || filter || {});
    this.props.loadEntryBody(regFtzEntNo, currentPage, currentSize, currentFilter, 'entry');
  }
  isEntryDetailEditable = (allowRegStatus) => {
    const entryReg = this.props.entryRegs[this.state.regIndex];
    let allowEditStatus = allowRegStatus;
    if (!allowEditStatus) {
      allowEditStatus = CWM_SHFTZ_APIREG_STATUS.pending;
    }
    return entryReg.reg_status <= allowEditStatus && this.editPermission;
  }
  handlePageChange = (page, pageSize) => {
    this.handleLoadEntryBodyList(page, pageSize);
  }
  handleRefreshFtzCargo = () => {
    const { preEntrySeqNo } = this.props.params;
    const asnNo = this.props.primaryEntryReg.asn_no;
    this.props.refreshEntryRegFtzCargos(asnNo, preEntrySeqNo).then((result) => {
      if (!result.error) {
        this.props.loadEntryDetails({ preEntrySeqNo });
        notification.success({
          message: '????????????',
          description: '?????????????????????',
          placement: 'topLeft',
        });
      } else {
        notification.error({
          message: '????????????',
          description: result.error.message,
          duration: 15,
        });
      }
    });
  }
  handleSend = () => {
    if (this.props.primaryEntryReg.nonCargo) {
      notification.warn({
        message: '???????????????',
        description: '???????????????????????????, ?????????????????????????????????????????????',
        btn: (<div>
          <a role="presentation" onClick={() => this.handleRegSend(true)}>????????????</a>
          <span className="ant-divider" />
          <a role="presentation" onClick={this.handleCargoAdd}>????????????????????????</a>
        </div>),
        key: 'confirm-cargono',
        duration: 0,
      });
    } else {
      this.handleRegSend(false);
    }
  }
  handleRegSend = (close) => {
    if (close) {
      notification.close('confirm-cargono');
    }
    const { primaryEntryReg, params: { preEntrySeqNo } } = this.props;
    this.props.fileEntryRegs(
      primaryEntryReg.asn_no, preEntrySeqNo,
      this.props.whse.code
    ).then((result) => {
      if (!result.error) {
        const entType = CWM_SHFTZ_IN_REGTYPES.filter(regtype =>
          regtype.value === primaryEntryReg.ftz_ent_type)[0];
        this.props.loadEntryDetails({ preEntrySeqNo });
        if (result.data.errorMsg) {
          notification.warn({
            message: '????????????',
            description: result.data.errorMsg,
            duration: 15,
          });
        } else {
          notification.success({
            message: '????????????',
            description: `${preEntrySeqNo} ???????????? ????????????????????????????????? ${entType && entType.text}`,
            placement: 'topLeft',
          });
        }
      } else if (result.error.message === 'WHSE_FTZ_UNEXIST') {
        notification.error({
          message: '????????????',
          description: '???????????????????????????',
        });
      } else {
        notification.error({
          message: '????????????',
          description: result.error.message,
          duration: 15,
        });
      }
    });
  }
  handleEntryRegsExport = () => {
    const { primaryEntryReg, params } = this.props;
    window.open(`${API_ROOTS.default}v1/cwm/shftz/entryreg/export/????????????_${primaryEntryReg.cus_decl_no}.xlsx?preEntrySeqNo=${params.preEntrySeqNo}`);
  }
  handleQuery = () => {
    const {
      params: { preEntrySeqNo },
      primaryEntryReg: { asn_no: asnNo },
      whse: { code: whseCode, ftz_whse_code: ftzWhseCode },
    } = this.props;
    this.props.queryEntryRegInfos(asnNo, preEntrySeqNo, whseCode, ftzWhseCode).then((result) => {
      if (!result.error) {
        if (result.data.errorMsg) {
          notification.warn({
            message: '????????????',
            description: result.data.errorMsg,
            duration: 15,
          });
        } else {
          this.props.loadEntryDetails({ preEntrySeqNo });
          notification.success({
            message: '????????????',
            description: '????????????ID?????????',
          });
        }
      } else if (result.error.message === 'WHSE_FTZ_UNEXIST') {
        notification.error({
          message: '????????????',
          description: '???????????????????????????',
        });
      } else {
        notification.error({
          message: '????????????',
          description: result.error.message,
          duration: 15,
        });
      }
    });
  }
  handleCancelReg = () => {
    const { preEntrySeqNo } = this.props.params;
    this.props.putCustomsRegFields(
      { pre_entry_seq_no: preEntrySeqNo },
      { status: CWM_SHFTZ_APIREG_STATUS.pending }
    ).then((result) => {
      if (result.error) {
        notification.error({
          message: '????????????',
          description: result.error.message,
          duration: 15,
        });
      }
    });
  }
  handleCargoAdd = () => {
    notification.close('confirm-cargono');
    this.context.router.push('/cwm/supervision/shftz/cargo');
  }
  handleListMenuChange = (key) => {
    const regIndex = Number(key);
    this.setState({
      regIndex,
    });
    this.handleDeselectRows();
  }
  handleInfoSave = (preFtzEntNo, field, value) => { // ??????????????????????????????
    this.props.updateEntryReg(preFtzEntNo, field, value).then((result) => {
      if (result.error) {
        notification.error({
          message: '????????????',
          description: result.error.message,
          duration: 15,
        });
      } else {
        message.success('????????????');
      }
    });
  }
  handleInfoSaveAll = (field, value) => { // ???????????????????????????????????????
    const { preEntrySeqNo } = this.props.params;
    this.props.putCustomsRegFields(
      { pre_entry_seq_no: preEntrySeqNo },
      { [field]: value }
    ).then((result) => {
      if (result.error) {
        notification.error({
          message: '????????????',
          description: result.error.message,
          duration: 15,
        });
      } else {
        message.success('????????????');
      }
    });
  }
  handleEntryOwnerChange = (ownerCusCode) => {
    const owner = this.props.whseOwners.filter(whow => whow.key === ownerCusCode)[0];
    if (owner) {
      const { preEntrySeqNo } = this.props.params;
      this.props.putCustomsRegFields(
        { pre_entry_seq_no: preEntrySeqNo },
        { owner_cus_code: owner.key, owner_name: owner.name }
      ).then((result) => {
        if (result.error) {
          notification.error({
            message: '????????????',
            description: result.error.message,
            duration: 15,
          });
        }
      });
    }
  }
  handleInboundPage = () => {
    this.context.router.push(`/cwm/receiving/inbound/${this.props.primaryEntryReg.inbound_no}`);
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  handleViewChange = (ev) => {
    // ???????????????????????????????????????
    const { regIndex } = this.state;
    const { filter } = this.props.entryRegs[regIndex];
    const currentFilter = {
      ...filter,
      merged: ev.target.value === 'merged',
    };
    this.handleLoadEntryBodyList(1, null, currentFilter);
  }
  handleSplitNumber = (value) => {
    this.setState({ splitNum: value });
  }
  handleRegSequenceSplit = () => {
    const { splitNum } = this.state;
    const { preEntrySeqNo } = this.props.params;
    this.props.splitCustomEntryDetails({ preEntrySeqNo, splitNum }).then((result) => {
      if (!result.error) {
        this.props.loadEntryDetails({ preEntrySeqNo });
        notification.success({
          message: '????????????',
          description: `???????????????${splitNum}???????????????`,
        });
      } else {
        notification.error({
          message: '????????????',
          description: result.error.message,
          duration: 15,
        });
      }
    });
  }
  handleTabChange = (key) => {
    this.setState({ activeTabKey: key });
  }
  handleRegChange = (key) => {
    const regIndex = Number(key);
    this.setState({
      regIndex,
    });
    this.handleDeselectRows();
  }
  handleSearch = (filterNo) => {
    const { regIndex } = this.state;
    const { filter } = this.props.entryRegs[regIndex];
    const currentFilter = {
      ...filter,
      filterNo,
    };
    this.handleLoadEntryBodyList(1, null, currentFilter);
  }
  render() {
    const {
      primaryEntryReg, entryRegs, submitting, whseOwners, inboundTotalValue,
    } = this.props;
    const {
      splitNum, regIndex,
    } = this.state;
    const entryReg = entryRegs[regIndex];
    if (!entryReg) return null;
    const entryTotalValue = inboundTotalValue.find(f =>
      f.pre_ftz_ent_no === entryReg.pre_ftz_ent_no) || {
      total_qty: 0,
      total_net_wt: 0,
      total_gross_wt: 0,
      total_amount: 0,
      total_freight: 0,
    };
    const {
      details, filter, invalidDets,
    } = entryReg;
    // ???????????????????????????queryable??????true??????????????????id,sendable??????true??????????????????
    let queryable = true;
    let sendable = true;
    entryRegs.forEach((reg) => {
      if (!reg.queryable) queryable = false;
      if (!reg.sendable) sendable = false;
    });
    const entType = CWM_SHFTZ_IN_REGTYPES.filter(regtype =>
      regtype.value === primaryEntryReg.ftz_ent_type)[0];
    const entryEditable = entryReg.reg_status < CWM_SHFTZ_APIREG_STATUS.completed;
    const sent = entryReg.reg_status === CWM_SHFTZ_APIREG_STATUS.processing;
    const sendText = sent ? '????????????' : '??????';
    // const inbStatus = primaryEntryReg.inbound_no && CWM_INBOUND_STATUS_INDICATOR.filter(status =>
    //  status.value === primaryEntryReg.inbound_status)[0];
    const regStatus = CWM_SHFTZ_ENTRY_STATUS.filter(st => st.value === entryReg.reg_status)[0];
    let alertInfo = '';
    if (!primaryEntryReg.inbound_no) {
      alertInfo = `????????????${primaryEntryReg.asn_no}????????????`;
    }
    if (primaryEntryReg.cus_decl_no && primaryEntryReg.ie_date) {
      if (invalidDets.length) {
        alertInfo = `${alertInfo ? '\n' : ''}${entryReg.pre_ftz_ent_no}: ??????${invalidDets.join(',')}???????????????`;
      }
    } else {
      alertInfo = `${alertInfo ? '\n' : ''}?????????????????????????????????`;
    }
    const menus = entryRegs.map((r, i) => ({
      menu: r.ftz_ent_no || r.pre_ftz_ent_no,
      key: String(i),
    }));
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    const pagination = {
      current: details.current,
      pageSize: details.pageSize,
      total: details.totalCount,
      showQuickJumper: false,
      showSizeChanger: true,
      onChange: this.handlePageChange,
      showTotal: total => `??? ${total} ???`,
    };
    return (
      <Layout>
        <PageHeader
          breadcrumb={[
            entType && entType.ftztext,
            primaryEntryReg.cus_decl_no || this.props.params.preEntrySeqNo,
            primaryEntryReg.inbound_no && <InboundTreePopover
              inbound={primaryEntryReg}
              regType="entry"
              bondRegs={entryRegs}
              currentKey={`bond-reg-${this.props.params.preEntrySeqNo}`}
            />,
          ]}
          menus={menus}
          onTabChange={this.handleRegChange}
        >
          <PageHeader.Nav>
            <Badge status={regStatus.badge} text={regStatus.text} />
          </PageHeader.Nav>
          <PageHeader.Actions>
            <PrivilegeCover module="cwm" feature="supervision" action="edit">
              {/*
                primaryEntryReg.reg_status === CWM_SHFTZ_APIREG_STATUS.completed &&
                <Button icon="close" loading={submitting} onClick={this.handleCancelReg}>
                  ????????????</Button>
              */}
              {primaryEntryReg.nonCargo &&
                <Button icon="sync" loading={submitting} onClick={this.handleRefreshFtzCargo}>???????????????</Button>}
              { entryRegs.length === 1 &&
                    entryRegs[0].reg_status === CWM_SHFTZ_APIREG_STATUS.pending &&
                    <Popover
                      placement="bottom"
                      title="??????????????????"
                      content={<span>
                        <InputNumber
                          min={2}
                          max={primaryEntryReg.dataCount}
                          value={splitNum}
                          onChange={this.handleSplitNumber}
                        />
                        <Button type="primary" style={{ marginLeft: 8 }} onClick={this.handleRegSequenceSplit}>??????</Button>
                      </span>}
                      trigger="click"
                    >
                      <Button icon="fork" disabled={primaryEntryReg.dataCount === 1}>??????</Button>
                    </Popover>}
            </PrivilegeCover>
            {entryReg.reg_status === CWM_SHFTZ_APIREG_STATUS.pending &&
              <Button icon="file-excel" onClick={this.handleEntryRegsExport}>??????????????????</Button>}
            <PrivilegeCover module="cwm" feature="supervision" action="edit">
              {entryEditable && entryRegs.length === 1 && // ??????????????????????????????????????????????????????
                <Button type="primary" ghost={sent} icon="cloud-upload-o" loading={submitting} onClick={this.handleSend} disabled={!sendable}>{sendText}</Button>
              }
              {queryable &&
                <Button type="primary" icon="sync" loading={submitting} onClick={this.handleQuery}>????????????ID</Button>}
            </PrivilegeCover>
          </PageHeader.Actions>
        </PageHeader>
        <Layout>
          <Content className="page-content">
            {entryEditable && alertInfo && <Alert message={alertInfo} type="info" showIcon closable />}
            <MagicCard bodyStyle={{ padding: 0 }}>
              <Tabs activeKey={this.state.activeTabKey} onChange={this.handleTabChange}>
                <TabPane tab="????????????" key="regHead">
                  <FormPane hideRequiredMark>
                    <Card>
                      <Row>
                        <Col span={8}>
                          <FormItem label={this.msg('???????????????')} {...formItemLayout}>
                            <EditableCell
                              value={entryReg.ftz_ent_no}
                              editable={entryEditable && this.editPermission}
                              onSave={value => this.handleInfoSave(entryReg.pre_ftz_ent_no, 'ftz_ent_no', value)}
                            />
                          </FormItem>
                        </Col>
                        <Col span={8}>
                          <FormItem label={this.msg('????????????')} {...formItemLayout}>
                            <EditableCell
                              value={primaryEntryReg.cus_decl_no}
                              editable={entryEditable && this.editPermission}
                              onSave={value => this.handleInfoSaveAll('cus_decl_no', value)}
                            />
                          </FormItem>
                        </Col>
                        <Col span={8}>
                          <FormItem label={this.msg('???????????????')} {...formItemLayout}>
                            <EditableCell
                              type="select"
                              options={whseOwners}
                              value={primaryEntryReg.owner_cus_code}
                              editable={entryEditable && this.editPermission}
                              onSave={this.handleEntryOwnerChange}
                            />
                          </FormItem>
                        </Col>
                        <Col span={8}>
                          <FormItem label={this.msg('???????????????')} {...formItemLayout}>
                            <EditableCell
                              type="date"
                              editable={entryEditable && this.editPermission}
                              value={primaryEntryReg.ie_date && moment(primaryEntryReg.ie_date).format('YYYY.MM.DD')}
                              onSave={value => this.handleInfoSaveAll('ie_date', new Date(value))}
                            />
                          </FormItem>
                        </Col>
                        <Col span={8}>
                          <FormItem label={this.msg('??????????????????')} {...formItemLayout}>
                            <EditableCell
                              editable={false}
                              value={entryReg.last_update_date && moment(entryReg.last_update_date).format('YYYY.MM.DD')}
                            />
                          </FormItem>
                        </Col>
                        <Col span={8}>
                          <FormItem label={this.msg('??????????????????')} {...formItemLayout}>
                            <EditableCell
                              editable={false}
                              value={primaryEntryReg.ftz_ent_date && moment(primaryEntryReg.ftz_ent_date).format('YYYY.MM.DD')}
                            />
                          </FormItem>
                        </Col>
                      </Row>
                    </Card>
                  </FormPane>
                </TabPane>
                <TabPane tab="????????????" key="regDetails" >
                  <DataPane
                    columns={this.columns}
                    rowSelection={rowSelection}
                    indentSize={0}
                    dataSource={details ? details.data : []}
                    pagination={pagination}
                    rowKey="id"
                    loading={this.state.loading}
                  >
                    <DataPane.Toolbar>
                      <SearchBox value={filter && filter.filterNo} placeholder={this.msg('searchPlaceholder')} onSearch={this.handleSearch} />
                      <DataPane.Extra>
                        <RadioGroup value={(filter && filter.merged) ? 'merged' : 'splitted'} onChange={this.handleViewChange} >
                          <RadioButton value="splitted">???????????????</RadioButton>
                          <RadioButton value="merged">???????????????</RadioButton>
                        </RadioGroup>
                      </DataPane.Extra>
                    </DataPane.Toolbar>
                    <Summary>
                      <Summary.Item label="?????????">{entryTotalValue.total_qty}</Summary.Item>
                      <Summary.Item label="?????????" addonAfter="KG">{entryTotalValue.total_net_wt.toFixed(3)}</Summary.Item>
                      <Summary.Item label="?????????">{entryTotalValue.total_amount.toFixed(3)}</Summary.Item>
                    </Summary>
                  </DataPane>
                </TabPane>
              </Tabs>
            </MagicCard>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
