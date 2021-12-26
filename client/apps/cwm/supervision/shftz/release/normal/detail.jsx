import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import FileSaver from 'file-saver';
import { createFilename } from 'client/util/dataTransform';
import { intlShape, injectIntl } from 'react-intl';
import { Alert, Badge, Col, Row, Form, Tabs, Layout, Steps, Button, Radio, Tag, Tooltip, notification, message } from 'antd';
import connectNav from 'client/common/decorators/connect-nav';
import SidePanel from 'client/components/SidePanel';
import EditableCell from 'client/components/EditableCell';
import PageHeader from 'client/components/PageHeader';
import SearchBox from 'client/components/SearchBox';
import MagicCard from 'client/components/MagicCard';
import DataPane from 'client/components/DataPane';
import Summary from 'client/components/Summary';
import {
  loadRelDetails, loadRelBody, updateRelReg, fileRelStockouts, exportNormalExitByRel,
  fileRelPortionouts, queryPortionoutInfos, cancelRelReg, editReleaseWt, clearNormalRel,
  loadRelNormalTotalValue,
} from 'common/reducers/cwmShFtz';
import { showNormalRegSplitModal, undoNormalRegSplit } from 'common/reducers/cwmShFtzDecl';
import { CWM_SHFTZ_APIREG_STATUS, CWM_SHFTZ_OUT_REGTYPES, CWM_OUTBOUND_STATUS, CWM_OUTBOUND_STATUS_INDICATOR } from 'common/constants';
import { PrivilegeCover, hasPermission } from 'client/common/decorators/withPrivilege';
import NormalRegMergeSplitModal from './modal/normalRegMergeSplitModal';
import { formatMsg } from '../../message.i18n';

const { Content } = Layout;
const { Step } = Steps;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { TabPane } = Tabs;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  style: { marginBottom: 0 },
};
const renderCombineData = (fieldVal, options) => {
  const foundOpts = options.filter(opt => opt.value === fieldVal);
  const label = foundOpts.length === 1 ? `${foundOpts[0].value}|${foundOpts[0].text}` : fieldVal;
  return label && label.length > 0 ? <Tag>{label}</Tag> : <span />;
};

@injectIntl
@connect(
  state => ({
    relSo: state.cwmShFtz.rel_so,
    relRegs: state.cwmShFtz.rel_regs,
    multiTotalValue: state.cwmShFtz.multiRegStats,
    country: state.saasParams.latest.country.map(tc => ({
      value: tc.cntry_co,
      text: tc.cntry_name_cn,
    })),
    currency: state.saasParams.latest.currency.map(cr => ({
      value: cr.curr_code,
      text: cr.curr_name,
    })),
    trxnMode: state.saasParams.latest.trxnMode.map(tx => ({
      value: tx.trx_mode,
      text: tx.trx_spec,
    })),
    whse: state.cwmContext.defaultWhse,
    submitting: state.cwmShFtz.submitting,
    privileges: state.account.privileges,
  }),
  {
    loadRelDetails,
    loadRelBody,
    updateRelReg,
    fileRelStockouts,
    exportNormalExitByRel,
    fileRelPortionouts,
    queryPortionoutInfos,
    cancelRelReg,
    editReleaseWt,
    clearNormalRel,
    showNormalRegSplitModal,
    undoNormalRegSplit,
    loadRelNormalTotalValue,
  }
)
@connectNav({
  depth: 3,
  moduleName: 'cwm',
  title: 'featCwmShftz',
  jumpOut: true,
})
export default class SHFTZNormalRelRegDetail extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    regIndex: 0, // 对应不同单号
    selectedRowKeys: [],
  }
  componentDidMount() {
    const { soNo } = this.props.params;
    this.props.loadRelDetails(soNo, 'normal');
    this.props.loadRelNormalTotalValue({ soNo });
  }
  getStep = (status) => {
    if (status < 3) {
      return status;
    } else if (status === 3 || status === 4) {
      return 3;
    } else if (status === 5 || status === 6) {
      return 4;
    } else if (status === 7 || status === 8) {
      return 5;
    }
    return -1;
  }
  msg = formatMsg(this.props.intl)
  editPermission = hasPermission(this.props.privileges, {
    module: 'cwm', feature: 'supervision', action: 'edit',
  })
  handleSend = () => {
    const { params: { soNo }, whse: { ftz_whse_code: ftzWhseCode, code: whseCode } } = this.props;
    const fileOp = this.props.fileRelStockouts(soNo, whseCode, ftzWhseCode);
    const relType = CWM_SHFTZ_OUT_REGTYPES[0].text;
    if (fileOp) {
      fileOp.then((result) => {
        if (!result.error) {
          if (result.data.errorMsg) {
            notification.warn({
              message: '结果异常',
              description: result.data.errorMsg,
              duration: 15,
            });
          } else {
            notification.success({
              message: '操作成功',
              description: `${soNo} 已发送至 上海自贸区海关监管系统 ${relType}`,
              placement: 'topLeft',
            });
          }
        } else if (result.error.message === 'WHSE_FTZ_UNEXIST') {
          notification.error({
            message: '操作失败',
            description: '仓库监管系统未配置',
          });
        } else {
          notification.error({
            message: '操作失败',
            description: result.error.message,
            duration: 15,
          });
        }
      });
    }
  }
  handleCancelReg = () => {
    // 同一单下所有备案的状态从待备案到已备案阶段是一致的
    // 任一备案下操作回退备案将所有备案的状态切回待备案
    const { soNo } = this.props.params;
    this.props.cancelRelReg(soNo).then((result) => {
      if (result.error) {
        notification.error({
          message: '操作失败',
          description: result.error.message,
          duration: 15,
        });
      } else {
        this.handleRelAndDetailsReload();
      }
    });
  }
  handleWtChange = (val, id) => {
    const change = { gross_wt: val };
    this.props.editReleaseWt({ change, id }).then((result) => {
      if (!result.error) {
        // 更新当页的备案明细数据
        const relReg = this.props.relRegs[this.state.regIndex];
        const { current, pageSize } = relReg.filingDetails;
        const currentFilter = JSON.stringify(relReg.filingFilter);
        this.props.loadRelBody(relReg.pre_entry_seq_no, current, pageSize, currentFilter);
      }
    });
  }
  handleTabChange = regIndex => this.setState({ regIndex: Number(regIndex) })
  handleInfoSave = (preRegNo, field, value) => {
    this.props.updateRelReg(preRegNo, field, value).then((result) => {
      if (result.error) {
        notification.error({
          message: '操作失败',
          description: result.error.message,
          duration: 15,
        });
      } else {
        message.success('修改成功');
      }
    });
  }
  handleNormalCustomDecl = (preRegNo, cusDeclNo, oldValue) => {
    if (oldValue === cusDeclNo) {
      return;
    } if (!cusDeclNo) {
      message.error('报关单号不能为空');
      return;
    }
    this.props.clearNormalRel(preRegNo, cusDeclNo)
      .then((result) => {
        if (result.error) {
          message.error(result.error.message);
        }
      });
  }
  handleOutboundPage = () => {
    this.context.router.push(`/cwm/shipping/outbound/${this.props.relSo.outbound_no}`);
  }
  handleRegMergeSplit = () => {
    const { relSo, relRegs } = this.props;
    this.props.showNormalRegSplitModal({
      visible: true,
      pre_entry_seq_no: relRegs[0].pre_entry_seq_no,
      owner: {
        partner_id: relSo.owner_partner_id,
        tenant_id: relSo.owner_tenant_id,
      },
    });
  }
  handleUndoRegMergeSplit =() => {
    const { soNo } = this.props.params;
    this.props.undoNormalRegSplit(soNo).then((result) => {
      if (!result.error) {
        this.handleRelAndDetailsReload();
      }
    });
  }
  handleRelAndDetailsReload = () => {
    this.props.loadRelDetails(this.props.params.soNo, 'normal');
  }
  handleViewChange = (e) => {
    // 只有备案明细可以切换归并前后明细，切换后页码重置为1
    const relReg = this.props.relRegs[this.state.regIndex];
    const currentFilter = JSON.stringify({
      ...relReg.filingFilter,
      merged: e.target.value === 'merged', // 归并前、后明细
      normalDetType: 0, // 备案明细，1-出区明细
    });
    this.props.loadRelBody(relReg.pre_entry_seq_no, 1, 20, currentFilter);
  }
  handleExportExitVoucher = () => {
    const { reg } = this.state;
    this.props.exportNormalExitByRel(reg.ftz_rel_no).then((resp) => {
      if (!resp.error) {
        FileSaver.saveAs(
          new window.Blob([Buffer.from(resp.data)], { type: 'application/octet-stream' }),
          `${reg.ftz_rel_no}_出区凭单.xlsx`
        );
      } else {
        notification.error({
          message: '导出失败',
          description: resp.error.message,
        });
      }
    });
  }
  mergedColumns = [{
    title: '进库提货单号',
    dataIndex: 'ftz_ent_no',
    width: 150,
  }]
  columns = [{
    title: '行号',
    dataIndex: 'seq_no',
    width: 50,
    align: 'center',
    className: 'table-col-seq',
  }, {
    title: '入库明细ID',
    dataIndex: 'ftz_ent_detail_id',
    width: 100,
  }, {
    title: '备案料号',
    dataIndex: 'ftz_cargo_no',
    width: 160,
  }, {
    title: '商品货号',
    dataIndex: 'product_no',
    width: 160,
  }, {
    title: '商品编号',
    dataIndex: 'hscode',
    width: 100,
  }, {
    title: '中文品名',
    dataIndex: 'g_name',
    width: 150,
  }, {
    title: '规格型号',
    dataIndex: 'model',
    width: 150,
  }, {
    title: '数量',
    dataIndex: 'qty',
    width: 100,
    render: o => (<b>{o}</b>),
  }, {
    title: '毛重',
    dataIndex: 'gross_wt',
    width: 150,
    render: (o, record) => {
      const reg = this.props.relRegs[this.state.regIndex];
      const filingFilter = reg && reg.filingFilter;
      return (<EditableCell
        size="small"
        value={o}
        onSave={value => this.handleWtChange(value, record.id)}
        editable={!record.ftz_rel_no && !(filingFilter && filingFilter.merged)}
      />);
    },
  }, {
    title: '净重',
    dataIndex: 'net_wt',
    width: 100,
  }, {
    title: '金额',
    dataIndex: 'amount',
    width: 100,
  }, {
    title: '币制',
    dataIndex: 'currency',
    width: 100,
    render: o => renderCombineData(o, this.props.currency),
  }, {
    title: '供货商',
    width: 100,
    dataIndex: 'supplier',
  }, {
    title: '成交方式',
    width: 100,
    dataIndex: 'trxn_mode',
    render: o => renderCombineData(o, this.props.trxnMode),
  }, {
    title: '运费',
    width: 100,
    dataIndex: 'freight',
  }, {
    title: '运费币制',
    width: 100,
    dataIndex: 'freight_currency',
    render: o => renderCombineData(o, this.props.currency),
  }, {
    title: '原产国',
    dataIndex: 'country',
    width: 100,
    render: o => renderCombineData(o, this.props.country),
  }, {
    title: '报关单号',
    width: 150,
    dataIndex: 'out_cus_decl_no',
  }, {
    title: 'SO编号',
    width: 120,
    dataIndex: 'so_no',
  }]
  exitColumns = [{
    title: '出区编号',
    dataIndex: 'normalreg_exit_no',
    width: 160,
  }, {
    title: '入库明细ID',
    dataIndex: 'ftz_ent_detail_id',
    width: 100,
  }, {
    title: '商品货号',
    dataIndex: 'product_no',
    width: 160,
  }, {
    title: '商品编号',
    dataIndex: 'hscode',
    width: 100,
  }, {
    title: '中文品名',
    dataIndex: 'g_name',
    width: 150,
  }, {
    title: '数量',
    dataIndex: 'exit_qty',
    width: 100,
    render: o => (<b>{o}</b>),
  }, {
    title: '毛重',
    dataIndex: 'exit_grosswt',
    width: 150,
  }, {
    title: '净重',
    dataIndex: 'exit_netwt',
    width: 100,
  }, {
    title: '金额',
    dataIndex: 'exit_amount',
    width: 100,
  }, {
    title: '币制',
    dataIndex: 'currency',
    width: 100,
    render: o => renderCombineData(o, this.props.currency),
  }]
  handleFilSearch = (searchText) => {
    const relReg = this.props.relRegs[this.state.regIndex];
    const currentFilter = JSON.stringify({
      ...relReg.filingFilter,
      filterNo: searchText,
      normalDetType: 0,
    });
    this.props.loadRelBody(relReg.pre_entry_seq_no, 1, 20, currentFilter);
  }
  handleExitSearch = (searchText) => {
    const relReg = this.props.relRegs[this.state.regIndex];
    const currentFilter = JSON.stringify({
      ...relReg.exitFilter,
      filterNo: searchText,
      normalDetType: 1,
    });
    this.props.loadRelBody(relReg.pre_entry_seq_no, 1, 20, currentFilter);
  }
  handleFilPageChange = (page, size) => {
    const relReg = this.props.relRegs[this.state.regIndex];
    const currentFilter = JSON.stringify({
      ...relReg.filingFilter,
      normalDetType: 0,
    });
    this.props.loadRelBody(relReg.pre_entry_seq_no, page, size, currentFilter);
  }
  handleExitPageChange = (page, size) => {
    const relReg = this.props.relRegs[this.state.regIndex];
    const currentFilter = JSON.stringify({
      ...relReg.exitFilter,
      normalDetType: 1,
    });
    this.props.loadRelBody(relReg.pre_entry_seq_no, page, size, currentFilter);
  }
  handleExport = () => {
    const relReg = this.props.relRegs[this.state.regIndex];
    const { filingFilter } = relReg;
    const merged = filingFilter && filingFilter.merged;
    const mergeString = merged ? `&merge=${merged}` : '';
    window.open(`${API_ROOTS.default}v1/cwm/shftz/release/details/export/${createFilename(relReg.pre_entry_seq_no)}.xlsx?pre_entry_seq_no=${relReg.pre_entry_seq_no}${mergeString}`);
  }
  render() {
    const {
      relSo, relRegs, submitting, multiTotalValue,
    } = this.props;
    const reg = relRegs[this.state.regIndex];
    if (!reg || !reg.filingDetails || !reg.exitDetails) {
      return null;
    }
    const entryTotalValue = multiTotalValue.find(f =>
      f.pre_entry_seq_no === reg.pre_entry_seq_no) || {
      total_qty: 0,
      total_net_wt: 0,
      total_gross_wt: 0,
      total_amount: 0,
      total_freight: 0,
    };
    const {
      filingDetails, exitDetails, filingFilter, exitFilter,
    } = reg;
    const outboundStatus = relSo.outbound_status || CWM_OUTBOUND_STATUS.ALL_ALLOC.value;
    const relType = CWM_SHFTZ_OUT_REGTYPES[0];
    const regStatus = reg.status;
    const relEditable = regStatus < CWM_SHFTZ_APIREG_STATUS.completed;
    const sent = regStatus === CWM_SHFTZ_APIREG_STATUS.processing;
    const sendText = sent ? '重新发送' : '发送备案';
    let sendable = true;
    let whyunsent = '';
    if (outboundStatus < CWM_OUTBOUND_STATUS.PARTIAL_ALLOC.value) {
      sendable = false;
      whyunsent = '出库单未配货';
    } else if (outboundStatus === CWM_OUTBOUND_STATUS.PARTIAL_ALLOC.value) {
      whyunsent = '出库单部分配货';
    }
    if (sendable) {
      const nonOutDates = relRegs.filter(f => !f.ftz_rel_date);
      if (nonOutDates.length > 0) {
        sendable = false;
        const preEntrySeqNos = nonOutDates.map(f => f.pre_entry_seq_no);
        whyunsent = `${preEntrySeqNos.join(',')}预计出区日期未填`;
      }
    }
    const outStatus = relSo.outbound_no && CWM_OUTBOUND_STATUS_INDICATOR.filter(status =>
      status.value === relSo.outbound_status)[0];
    const menus = relRegs.map((r, index) => ({
      menu: r.ftz_rel_no || r.pre_entry_seq_no,
      key: String(index),
    }));
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    const filingPagination = {
      current: filingDetails.current,
      pageSize: filingDetails.pageSize,
      total: filingDetails.totalCount,
      showQuickJumper: false,
      showSizeChanger: true,
      onChange: this.handleFilPageChange,
      showTotal: total => `共 ${total} 条`,
    };
    const exitPagination = {
      current: exitDetails.current,
      pageSize: exitDetails.pageSize,
      total: exitDetails.totalCount,
      showQuickJumper: false,
      showSizeChanger: true,
      onChange: this.handleExitPageChange,
      showTotal: total => `共 ${total} 条`,
    };
    let freightCurrName = '';
    if (entryTotalValue.total_freight) {
      const firstData = reg.filingDetails.data[0];
      const freightCurrCode = firstData && firstData.freight_currency;
      const freightCurr = freightCurrCode &&
        this.props.currency.find(f => f.value === freightCurrCode);
      freightCurrName = freightCurr && freightCurr.text;
    }
    const columns = filingFilter && filingFilter.merged ?
      [this.columns[0]].concat(this.mergedColumns).concat(this.columns.slice(1)) :
      this.columns;
    return (
      <Layout>
        <PageHeader
          breadcrumb={[
            relType && relType.ftztext,
            this.props.params.soNo,
          ]}
          menus={menus}
          onTabChange={this.handleTabChange}
        >
          <PageHeader.Nav>
            {relSo.outbound_no &&
              <Tooltip title="关联出库单" placement="bottom">
                <Button icon="link" onClick={this.handleOutboundPage}>
                  <Badge status={outStatus.badge} text={outStatus.text} />
                </Button>
              </Tooltip>
            }
          </PageHeader.Nav>
          <PageHeader.Actions>
            <PrivilegeCover module="cwm" feature="supervision" action="edit">
              {relEditable && relRegs.length === 1 &&
                <div>
                  <Button onClick={this.handleRegMergeSplit}>拆分明细</Button>
                  <NormalRegMergeSplitModal reload={this.handleRelAndDetailsReload} />
                </div>
              }
              {relEditable && relRegs.length > 1 &&
                <Button onClick={this.handleUndoRegMergeSplit}>取消明细拆分</Button>
              }
              {regStatus === CWM_SHFTZ_APIREG_STATUS.completed &&
                <Button loading={submitting} icon="close" onClick={this.handleCancelReg}>回退备案</Button>}
              {relEditable &&
                <Button type="primary" ghost={sent} icon="cloud-upload-o" onClick={this.handleSend} loading={submitting} disabled={!sendable}>{sendText}</Button>}
            </PrivilegeCover>
          </PageHeader.Actions>
        </PageHeader>
        <Layout>
          <SidePanel top>
            <Row style={{ padding: 16 }}>
              <Col span={6}>
                <FormItem label={this.msg('出区提货单号')} {...formItemLayout}>
                  <EditableCell
                    value={reg.ftz_rel_no}
                    editable={regStatus <= CWM_SHFTZ_APIREG_STATUS.completed && this.editPermission}
                    onSave={value => this.handleInfoSave(reg.pre_entry_seq_no, 'ftz_rel_no', value)}
                  />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('货主')} {...formItemLayout}>
                  <EditableCell
                    editable={false}
                    value={`${reg.owner_cus_code}|${reg.owner_name}`}
                  />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('提货单位')} {...formItemLayout}>
                  <EditableCell
                    value={reg.receiver_name}
                    editable={relEditable && this.editPermission}
                    onSave={value => this.handleInfoSave(reg.pre_entry_seq_no, 'receiver_name', value)}
                  />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('运输单位')} {...formItemLayout}>
                  <EditableCell
                    value={reg.carrier_name}
                    editable={relEditable && this.editPermission}
                    onSave={value => this.handleInfoSave(reg.pre_entry_seq_no, 'carrier_name', value)}
                  />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('报关单号')} {...formItemLayout}>
                  <EditableCell
                    value={reg.cus_decl_no}
                    onSave={value =>
                      this.handleNormalCustomDecl(reg.pre_entry_seq_no, value, reg.cus_decl_no)}
                    editable={regStatus <= 6 && this.editPermission}
                  />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('合同发票号')} {...formItemLayout}>
                  <EditableCell
                    value={reg.contract_no}
                    editable={relEditable && this.editPermission}
                    onSave={value => this.handleInfoSave(reg.pre_entry_seq_no, 'contract_no', value)}
                  />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('封志')} {...formItemLayout}>
                  <EditableCell
                    value={reg.seal_no}
                    editable={relEditable && this.editPermission}
                    onSave={value => this.handleInfoSave(reg.pre_entry_seq_no, 'seal_no', value)}
                  />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('唛头')} {...formItemLayout}>
                  <EditableCell
                    value={reg.marks}
                    editable={relEditable && this.editPermission}
                    onSave={value => this.handleInfoSave(reg.pre_entry_seq_no, 'marks', value)}
                  />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('出口日期')} {...formItemLayout}>
                  <EditableCell
                    type="date"
                    editable={relEditable && this.editPermission}
                    value={reg.ie_date && moment(reg.ie_date).format('YYYY-MM-DD')}
                    onSave={value => this.handleInfoSave(reg.pre_entry_seq_no, 'ie_date', new Date(value))}
                  />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('报关日期')} {...formItemLayout}>
                  <EditableCell
                    type="date"
                    editable={relEditable && this.editPermission}
                    value={reg.cus_decl_date && moment(reg.cus_decl_date).format('YYYY-MM-DD')}
                    onSave={value => this.handleInfoSave(reg.pre_entry_seq_no, 'cus_decl_date', new Date(value))}
                  />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('预计出区日期')} {...formItemLayout}>
                  <EditableCell
                    type="date"
                    editable={relEditable && this.editPermission}
                    value={reg.ftz_rel_date && moment(reg.ftz_rel_date).format('YYYY-MM-DD')}
                    onSave={value => this.handleInfoSave(reg.pre_entry_seq_no, 'ftz_rel_date', new Date(value))}
                  />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('备案日期')} {...formItemLayout}>
                  <EditableCell
                    type="date"
                    editable={false}
                    value={reg.ftz_reg_date && moment(reg.ftz_reg_date).format('YYYY-MM-DD')}
                  />
                </FormItem>
              </Col>
            </Row>
            <Steps progressDot current={this.getStep(regStatus)} className="progress-tracker">
              <Step title="待备案" />
              <Step title="已发送" />
              <Step title="已备案" />
              <Step title="已委托" />
              <Step title="已清关" />
              <Step title="已出区" />
            </Steps>
          </SidePanel>
          <Content className="page-content">
            {relEditable && whyunsent && <Alert message={whyunsent} type="info" showIcon closable />}
            <MagicCard bodyStyle={{ padding: 0 }}>
              <Tabs defaultActiveKey="regd">
                <TabPane tab="备案明细" key="regd">
                  <DataPane
                    columns={columns}
                    rowSelection={rowSelection}
                    indentSize={8}
                    dataSource={filingDetails.data}
                    pagination={filingPagination}
                    rowKey="id"
                  >
                    <DataPane.Toolbar>
                      <SearchBox value={filingFilter && filingFilter.filterNo} placeholder={this.msg('searchPlaceholder')} onSearch={this.handleFilSearch} />
                      <RadioGroup value={(filingFilter && filingFilter.merged) ? 'merged' : 'splitted'} onChange={this.handleViewChange} >
                        <RadioButton value="splitted">拆分明细</RadioButton>
                        <RadioButton value="merged">合并明细</RadioButton>
                      </RadioGroup>
                      <Button icon="download" onClick={this.handleExport} style={{ marginLeft: 8 }}>导出</Button>
                      <DataPane.Extra>
                        <Summary>
                          <Summary.Item label="总数量">{entryTotalValue.total_qty}</Summary.Item>
                          <Summary.Item label="总毛/净重" addonAfter="KG">{`${entryTotalValue.total_gross_wt.toFixed(2)}/${entryTotalValue.total_net_wt.toFixed(4)}`}</Summary.Item>
                          <Summary.Item label="总金额">{entryTotalValue.total_amount.toFixed(2)}</Summary.Item>
                          {!!entryTotalValue.total_freight && <Summary.Item label="总运费">{entryTotalValue.total_freight.toFixed(2)}</Summary.Item>}
                          {!!entryTotalValue.total_freight && !!freightCurrName &&
                            <Tag style={{ marginLeft: 5 }}>
                              {freightCurrName}
                            </Tag>}
                        </Summary>
                      </DataPane.Extra>
                    </DataPane.Toolbar>
                  </DataPane>
                </TabPane>
                <TabPane tab="出区明细" key="exitd">
                  <DataPane
                    columns={this.exitColumns}
                    rowSelection={rowSelection}
                    indentSize={8}
                    dataSource={exitDetails.data}
                    pagination={exitPagination}
                    rowKey="id"
                  >
                    <DataPane.Toolbar>
                      <SearchBox value={exitFilter && exitFilter.filterNo} placeholder={this.msg('searchPlaceholder')} onSearch={this.handleExitSearch} />
                      {exitDetails.length > 0 &&
                      <DataPane.Actions>
                        <Button type="primary" onClick={this.handleExportExitVoucher}>导出出区凭单</Button>
                      </DataPane.Actions>}
                    </DataPane.Toolbar>
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
