import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Alert, Badge, Form, Col, Row, Tooltip, Layout, Tabs, Steps, Button, Radio, Tag, message, notification } from 'antd';
import moment from 'moment';
import connectNav from 'client/common/decorators/connect-nav';
import SidePanel from 'client/components/SidePanel';
import PageHeader from 'client/components/PageHeader';
import MagicCard from 'client/components/MagicCard';
import SearchBox from 'client/components/SearchBox';
import DataPane from 'client/components/DataPane';
import Summary from 'client/components/Summary';
import {
  loadRelDetails, updateRelReg, fileRelPortionouts, queryPortionoutInfos, cancelRelReg,
  editReleaseWt, loadBatchDecl, loadRelTotalValue, loadRelBody,
} from 'common/reducers/cwmShFtz';
import { CWM_SHFTZ_APIREG_STATUS, CWM_SHFTZ_OUT_REGTYPES, CWM_OUTBOUND_STATUS, CWM_OUTBOUND_STATUS_INDICATOR } from 'common/constants';
import EditableCell from 'client/components/EditableCell';
import { PrivilegeCover, hasPermission } from 'client/common/decorators/withPrivilege';
import { formatMsg } from '../../message.i18n';

const { Content } = Layout;
const { TabPane } = Tabs;
const { Step } = Steps;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
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
    loginId: state.account.loginId,
    username: state.account.username,
    relSo: state.cwmShFtz.rel_so,
    relRegs: state.cwmShFtz.rel_regs,
    batchDecls: state.cwmShFtz.batchDecls,
    entryTotalValue: state.cwmShFtz.singleRegStat,
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
    updateRelReg,
    fileRelPortionouts,
    queryPortionoutInfos,
    cancelRelReg,
    editReleaseWt,
    loadBatchDecl,
    loadRelTotalValue,
    loadRelBody,
  }
)
@connectNav({
  depth: 3,
  moduleName: 'cwm',
  title: 'featCwmShftz',
  jumpOut: true,
})
export default class SHFTZRelDetail extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    regIndex: 0,
    batchFilterNo: '',
    selectedRowKeys: [],
  }
  componentDidMount() {
    const { soNo } = this.props.params;
    this.props.loadRelDetails(soNo, 'portion').then((result) => {
      if (!result.error && result.data.rel_so &&
        result.data.rel_so.status >= CWM_SHFTZ_APIREG_STATUS.completed) {
        this.props.loadBatchDecl(result.data.rel_regs[0].ftz_rel_no);
      }
    });
    this.props.loadRelTotalValue({ soNo });
  }
  getStep = (status) => {
    if (status < 3) {
      return status;
    } else if (status === 3 || status === 4) {
      return 3;
    } else if (status === 5 || status === 6) {
      return 4;
    }
    return -1;
  }
  msg = formatMsg(this.props.intl)
  editPermission = hasPermission(this.props.privileges, {
    module: 'cwm', feature: 'supervision', action: 'edit',
  })
  handleLoadRegDetails = (currentParam, pageSizeParam, filterParam) => {
    const relReg = this.props.relRegs[this.state.regIndex];
    const { details, filter, pre_entry_seq_no: preEntrySeqNo } = relReg;
    const currentPage = currentParam || details.current;
    const currentSize = pageSizeParam || details.pageSize;
    const currentFilter = JSON.stringify(filterParam || filter || {});
    this.props.loadRelBody(preEntrySeqNo, currentPage, currentSize, currentFilter);
  }
  handleSend = () => {
    const { params: { soNo }, whse: { ftz_whse_code: ftzWhseCode, code: whseCode } } = this.props;
    const fileOp = this.props.fileRelPortionouts(soNo, whseCode, ftzWhseCode);
    const relType = CWM_SHFTZ_OUT_REGTYPES[1].text;
    if (fileOp) {
      fileOp.then((result) => {
        if (!result.error) {
          if (result.data.errorMsg) {
            notification.warn({
              message: '????????????',
              description: result.data.errorMsg,
              duration: 15,
            });
          } else {
            notification.success({
              message: '????????????',
              description: `${soNo} ???????????? ????????????????????????????????? ${relType}`,
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
  }
  handleQuery = () => {
    const { soNo } = this.props.params;
    const ftzWhseCode = this.props.whse.ftz_whse_code;
    const whseCode = this.props.whse.code;
    this.props.queryPortionoutInfos(soNo, whseCode, ftzWhseCode).then((result) => {
      if (!result.error) {
        if (result.data.errorMsg) {
          notification.warn({
            message: '????????????',
            description: result.data.errorMsg,
            duration: 15,
          });
        } else {
          this.props.loadRelDetails(soNo, 'portion');
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
        });
      }
    });
  }
  handleCancelReg = () => {
    const { soNo } = this.props.params;
    this.props.cancelRelReg(soNo).then((result) => {
      if (result.error) {
        notification.error({
          message: '????????????',
          description: result.error.message,
          duration: 15,
        });
      } else {
        this.props.loadRelDetails(soNo, 'portion');
      }
    });
  }
  handleWtChange = (val, id) => {
    const change = { gross_wt: val };
    this.props.editReleaseWt({ change, id }).then((result) => {
      if (!result.error) {
        this.handleLoadRegDetails();
      }
    });
  }
  handleTabChange = tabKey => this.setState({ regIndex: Number(tabKey) })
  handleInfoSave = (preRegNo, field, value) => {
    this.props.updateRelReg(preRegNo, field, value).then((result) => {
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
  handleOutboundPage = () => {
    this.context.router.push(`/cwm/shipping/outbound/${this.props.relSo.outbound_no}`);
  }
  handleViewChange = (e) => {
    const relReg = this.props.relRegs[this.state.regIndex];
    const currentFilter = {
      ...relReg.filter,
      merged: e.target.value === 'merged', // ?????????????????????
    };
    this.handleLoadRegDetails(1, null, currentFilter);
  }
  columns = [{
    title: '??????',
    dataIndex: 'seq_no',
    width: 50,
    align: 'center',
    className: 'table-col-seq',
  }, {
    title: '????????????ID',
    dataIndex: 'ftz_ent_detail_id',
    width: 100,
  }, {
    title: '????????????ID',
    dataIndex: 'ftz_rel_detail_id',
    width: 100,
  }, {
    title: '????????????',
    dataIndex: 'ftz_cargo_no',
    width: 160,
  }, {
    title: '????????????',
    dataIndex: 'product_no',
    width: 160,
  }, {
    title: '????????????',
    dataIndex: 'hscode',
    width: 100,
  }, {
    title: '????????????',
    dataIndex: 'g_name',
    width: 150,
  }, {
    title: '????????????',
    dataIndex: 'model',
    width: 150,
  }, {
    title: '??????',
    dataIndex: 'qty',
    width: 100,
    render: o => (<b>{o}</b>),
  }, {
    title: '??????',
    dataIndex: 'gross_wt',
    width: 150,
    render: (o, record) => {
      const reg = this.props.relRegs[this.state.regIndex];
      const regFilter = reg && reg.filter;
      return (<EditableCell
        size="small"
        value={o}
        onSave={value => this.handleWtChange(value, record.id)}
        editable={!(regFilter && regFilter.merged) && this.editPermission}
      />);
    },
  }, {
    title: '??????',
    dataIndex: 'net_wt',
    width: 100,
  }, {
    title: '??????',
    dataIndex: 'amount',
    width: 100,
  }, {
    title: '??????',
    dataIndex: 'currency',
    width: 100,
    render: o => renderCombineData(o, this.props.currency),
  }, {
    title: '?????????',
    width: 100,
    dataIndex: 'supplier',
  }, {
    title: '????????????',
    width: 100,
    dataIndex: 'trxn_mode',
    render: o => renderCombineData(o, this.props.trxnMode),
  }, {
    title: '??????',
    width: 100,
    dataIndex: 'freight',
  }, {
    title: '????????????',
    width: 100,
    dataIndex: 'freight_currency',
    render: o => renderCombineData(o, this.props.currency),
  }, {
    title: '?????????',
    dataIndex: 'country',
    width: 100,
    render: o => renderCombineData(o, this.props.country),
  }]
  declColumns = [{
    title: '??????????????????',
    dataIndex: 'ftz_apply_nos',
    width: 200,
  }, {
    title: '????????????',
    dataIndex: 'status',
    width: 120,
    render: (st) => {
      switch (st) {
        case 'manifest':
        case 'generated':
          return (<Badge status="default" text="?????????" />);
        case 'processing':
        case 'applied':
        case 'cleared':
          return (<Badge status="success" text="????????????" />);
        default:
          return null;
      }
    },
  }, {
    title: '??????????????????',
    width: 120,
    dataIndex: 'delg_no',
  }, {
    title: '????????????',
    dataIndex: 'cus_decl_nos',
    width: 180,
  }, {
    title: '????????????',
    width: 100,
    render: (record) => {
      switch (record.status) {
        case 'manifest':
        case 'generated':
        case 'processing':
        case 'applied':
          return (<Badge status="default" text="?????????" />);
        case 'cleared':
          return (<Badge status="success" text="?????????" />);
        default:
          return null;
      }
    },
  }]
  handleRegDetailsSearch = (filterNo) => {
    const relReg = this.props.relRegs[this.state.regIndex];
    const currentFilter = {
      ...relReg.filter,
      filterNo,
    };
    this.handleLoadRegDetails(1, null, currentFilter);
  }
  handleBatchDeclsSearch = (filterNo) => {
    this.setState({ batchFilterNo: filterNo });
  }
  handleRegDetailsPageChange = (page, size) => {
    this.handleLoadRegDetails(page, size);
  }
  handleExport = () => {
    const relReg = this.props.relRegs[this.state.regIndex];
    const regFilter = relReg.filter;
    const merged = regFilter && regFilter.merged;
    const mergeString = merged ? `&merge=${merged}` : '';
    const exptFile = `${relReg.ftz_rel_no || relReg.pre_entry_seq_no}_??????_${moment().format('YYMMDDHHmmSS')}`;
    window.open(`${API_ROOTS.default}v1/cwm/shftz/release/details/export/${exptFile}.xlsx?pre_entry_seq_no=${relReg.pre_entry_seq_no}&portion=true${mergeString}`);
  }
  render() {
    const {
      relSo, relRegs, submitting, batchDecls, entryTotalValue,
    } = this.props;
    const { regIndex, batchFilterNo } = this.state;
    const reg = relRegs[regIndex];
    if (!reg || !reg.details || !batchDecls) {
      return null;
    }
    let batchDelData = batchDecls;
    if (batchFilterNo) {
      batchDelData = batchDecls.filter((item) => {
        const regExp = new RegExp(batchFilterNo);
        return regExp.test(item.ftz_apply_nos) || regExp.test(item.cus_decl_nos);
      });
    }
    const relType = CWM_SHFTZ_OUT_REGTYPES[1];
    const regStatus = reg.status;
    const relEditable = regStatus < CWM_SHFTZ_APIREG_STATUS.completed;
    const outboundStatus = relSo.outbound_status || CWM_OUTBOUND_STATUS.ALL_ALLOC.value;
    const sent = regStatus === CWM_SHFTZ_APIREG_STATUS.processing;
    const sendText = sent ? '????????????' : '????????????';
    let sendable = true;
    let whyunsent = '';
    if (outboundStatus < CWM_OUTBOUND_STATUS.PARTIAL_ALLOC.value) {
      sendable = false;
      whyunsent = '??????????????????';
    } else if (outboundStatus === CWM_OUTBOUND_STATUS.PARTIAL_ALLOC.value) {
      whyunsent = '?????????????????????';
    }
    const nonFtzRelNo = relRegs.filter(f => !f.ftz_rel_no);
    const queryable = regStatus < CWM_SHFTZ_APIREG_STATUS.completed
      && nonFtzRelNo.length === 0;
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
    const { details: regDetails, filter: regFilter } = reg;
    const regPagination = {
      current: regDetails.current,
      pageSize: regDetails.pageSize,
      total: regDetails.totalCount,
      showQuickJumper: false,
      showSizeChanger: true,
      onChange: this.handleRegDetailsPageChange,
      showTotal: total => `??? ${total} ???`,
    };
    return (
      <Layout>
        <PageHeader
          breadcrumb={[
            relType && <Tag color={relType.tagcolor}>{relType.ftztext}</Tag>,
            this.props.params.soNo,
          ]}
          menus={menus}
          onTabChange={this.handleTabChange}
        >
          <PageHeader.Nav>
            {relSo.outbound_no &&
            <Tooltip title="???????????????" placement="bottom">
              <Button icon="link" onClick={this.handleOutboundPage}>
                <Badge status={outStatus.badge} text={outStatus.text} />
              </Button>
            </Tooltip>
            }
          </PageHeader.Nav>
          <PageHeader.Actions>
            <PrivilegeCover module="cwm" feature="supervision" action="edit">
              {regStatus === CWM_SHFTZ_APIREG_STATUS.completed && <Button loading={submitting} icon="close" onClick={this.handleCancelReg}>????????????</Button>}
              {relEditable &&
              <Button type="primary" ghost={sent} icon="cloud-upload-o" onClick={this.handleSend} loading={submitting} disabled={!sendable}>{sendText}</Button>}
              {queryable && <Tooltip title="???????????????????????????????????????????????????????????????ID" placement="bottom">
                <Button type="primary" loading={submitting} icon="sync" onClick={this.handleQuery}>????????????ID</Button>
              </Tooltip>}
            </PrivilegeCover>
          </PageHeader.Actions>
        </PageHeader>
        <Layout>
          <SidePanel top onCollapseChange={this.handleCollapseChange}>
            <Row style={{ padding: 16 }}>
              <Col span={6}>
                <FormItem label={this.msg('??????????????????')} {...formItemLayout}>
                  <EditableCell
                    value={reg.ftz_rel_no}
                    editable={relEditable && this.editPermission}
                    onSave={value => this.handleInfoSave(reg.pre_entry_seq_no, 'ftz_rel_no', value)}
                  />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('??????')} {...formItemLayout}>
                  <EditableCell
                    editable={false}
                    value={`${reg.owner_cus_code}|${reg.owner_name}`}
                  />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('????????????')} {...formItemLayout}>
                  <EditableCell
                    editable={false}
                    value={reg.carrier_name}
                  />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('???????????????')} {...formItemLayout}>
                  <EditableCell
                    type="select"
                    editable={relEditable && this.editPermission}
                    value={reg.need_seal}
                    options={[{ key: '0', text: '???' }, { key: '1', text: '???' }]}
                    onSave={value => this.handleInfoSave(reg.pre_entry_seq_no, 'need_seal', value)}
                  />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('??????')} {...formItemLayout}>
                  <EditableCell
                    editable={relEditable && this.editPermission}
                    value={reg.seal_no}
                    onSave={value => this.handleInfoSave(reg.pre_entry_seq_no, 'seal_no', value)}
                  />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('??????')} {...formItemLayout}>
                  <EditableCell
                    editable={relEditable && this.editPermission}
                    value={reg.marks}
                    onSave={value => this.handleInfoSave(reg.pre_entry_seq_no, 'marks', value)}
                  />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('?????????')} {...formItemLayout}>
                  <EditableCell
                    editable={relEditable && this.editPermission}
                    value={reg.invoice_no}
                    onSave={value => this.handleInfoSave(reg.pre_entry_seq_no, 'invoice_no', value)}
                  />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('?????????')} {...formItemLayout}>
                  <EditableCell
                    editable={relEditable && this.editPermission}
                    value={reg.voucher_no}
                    onSave={value => this.handleInfoSave(reg.pre_entry_seq_no, 'voucher_no', value)}
                  />
                </FormItem>
              </Col>
            </Row>
            <Steps progressDot current={this.getStep(regStatus)} className="progress-tracker">
              <Step title="?????????" />
              <Step title="????????????" />
              <Step title="?????????" />
              <Step title="???????????????" />
              <Step title="?????????" />
            </Steps>
          </SidePanel>
          <Content className="page-content">
            {relEditable && whyunsent && <Alert message={whyunsent} type="info" showIcon closable />}
            <MagicCard bodyStyle={{ padding: 0 }}>
              <Tabs defaultActiveKey="regDetails">
                <TabPane tab="????????????" key="regDetails">
                  <DataPane
                    columns={this.columns}
                    rowSelection={rowSelection}
                    indentSize={8}
                    dataSource={regDetails.data}
                    pagination={regPagination}
                    rowKey="id"
                    loading={this.state.loading}
                  >
                    <DataPane.Toolbar>
                      <SearchBox value={regFilter && regFilter.filterNo} placeholder={this.msg('searchPlaceholder')} onSearch={this.handleRegDetailsSearch} />
                      <RadioGroup value={(regFilter && regFilter.merged) ? 'merged' : 'splitted'} onChange={this.handleViewChange} >
                        <RadioButton value="splitted">????????????</RadioButton>
                        <RadioButton value="merged">????????????</RadioButton>
                      </RadioGroup>
                      <Button icon="download" onClick={this.handleExport} style={{ marginLeft: 8 }}>??????</Button>
                      <DataPane.Extra>
                        <Summary>
                          <Summary.Item label="?????????">{entryTotalValue.total_qty}</Summary.Item>
                          <Summary.Item label="?????????" addonAfter="KG">{entryTotalValue.total_net_wt.toFixed(3)}</Summary.Item>
                          <Summary.Item label="?????????">{entryTotalValue.total_amount.toFixed(3)}</Summary.Item>
                        </Summary>
                      </DataPane.Extra>
                    </DataPane.Toolbar>
                  </DataPane>
                </TabPane>
                {regStatus >= CWM_SHFTZ_APIREG_STATUS.completed &&
                <TabPane tab="????????????" key="batchDecl">
                  <DataPane
                    columns={this.declColumns}
                    dataSource={batchDelData}
                    rowKey="id"
                    loading={this.state.loading}
                  >
                    <DataPane.Toolbar>
                      <SearchBox value={this.state.batchFilterNo} placeholder={this.msg('searchBatchDeclPlaceholder')} onSearch={this.handleBatchDeclsSearch} />
                    </DataPane.Toolbar>
                  </DataPane>
                </TabPane>
                }
              </Tabs>
            </MagicCard>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
