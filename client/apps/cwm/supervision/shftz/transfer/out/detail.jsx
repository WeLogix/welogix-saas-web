import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { Alert, Badge, Col, Form, Row, Tooltip, Layout, Steps, Button, Tag, message, notification, Radio } from 'antd';
import connectNav from 'client/common/decorators/connect-nav';
import SidePanel from 'client/components/SidePanel';
import PageHeader from 'client/components/PageHeader';
import MagicCard from 'client/components/MagicCard';
import SearchBox from 'client/components/SearchBox';
import DataPane from 'client/components/DataPane';
import Summary from 'client/components/Summary';
import {
  loadRelDetails, updateRelReg, fileRelTransfers, cancelRelReg,
  editReleaseWt, loadRelTotalValue, loadRelBody,
} from 'common/reducers/cwmShFtz';
import { CWM_SHFTZ_APIREG_STATUS, CWM_OUTBOUND_STATUS, CWM_SHFTZ_OUT_REGTYPES, CWM_OUTBOUND_STATUS_INDICATOR } from 'common/constants';
import EditableCell from 'client/components/EditableCell';
import { PrivilegeCover, hasPermission } from 'client/common/decorators/withPrivilege';
import { formatMsg } from '../../message.i18n';

const { Content } = Layout;
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
    entryTotalValue: state.cwmShFtz.singleRegStat,
    unit: state.saasParams.latest.unit.map(un => ({
      value: un.unit_code,
      text: un.unit_name,
    })),
    country: state.saasParams.latest.country.map(tc => ({
      value: tc.cntry_co,
      text: tc.cntry_name_cn,
    })),
    currency: state.saasParams.latest.currency.map(cr => ({
      value: cr.curr_code,
      text: cr.curr_name,
    })),
    whse: state.cwmContext.defaultWhse,
    receivers: state.cwmContext.whseAttrs.receivers.filter(recv =>
      recv.customs_code && recv.ftz_whse_code && recv.name),
    submitting: state.cwmShFtz.submitting,
    privileges: state.account.privileges,
  }),
  {
    loadRelDetails,
    updateRelReg,
    fileRelTransfers,
    cancelRelReg,
    editReleaseWt,
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
export default class SHFTZTransferOutDetail extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    regIndex: 0,
    selectedRowKeys: [],
  }
  componentDidMount() {
    const { soNo } = this.props.params;
    this.props.loadRelDetails(soNo, 'transfer');
    this.props.loadRelTotalValue({ soNo });
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
    width: 120,
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
    title: '????????????',
    dataIndex: 'out_qty',
    width: 100,
  }, {
    title: '????????????',
    width: 100,
    dataIndex: 'out_unit',
    render: o => renderCombineData(o, this.props.unit),
  }, {
    title: '??????',
    dataIndex: 'qty',
    width: 100,
    render: o => (<b>{o}</b>),
  }, {
    title: '??????',
    dataIndex: 'net_wt',
    width: 100,
  }, {
    title: '??????',
    dataIndex: 'gross_wt',
    width: 130,
    render: (o, record) => {
      const reg = this.props.relRegs[this.state.regIndex];
      const regFilter = reg && reg.filter;
      return (<EditableCell
        size="small"
        value={o}
        onSave={value => this.handleWtChange(value, record.id)}
        editable={!(regFilter && regFilter.merged)}
      />);
    },
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
    dataIndex: 'country',
    width: 100,
    render: o => renderCombineData(o, this.props.country),
  }];
  msg = formatMsg(this.props.intl)
  editPermission = hasPermission(this.props.privileges, {
    module: 'cwm', feature: 'supervision', action: 'edit',
  })
  handleLoadRelBodyList = (currentParam, pageSizeParam, filterParam) => {
    const relReg = this.props.relRegs[this.state.regIndex];
    const { details, filter, pre_entry_seq_no: preEntrySeqNo } = relReg;
    const currentPage = currentParam || details.current;
    const currentSize = pageSizeParam || details.pageSize;
    const currentFilter = JSON.stringify(filterParam || filter || {});
    this.props.loadRelBody(preEntrySeqNo, currentPage, currentSize, currentFilter);
  }
  handlePageChange = (page, pageSize) => {
    this.handleLoadRelBodyList(page, pageSize);
  }
  handleSend = () => {
    const { soNo } = this.props.params;
    const ftzWhseCode = this.props.whse.ftz_whse_code;
    const whseCode = this.props.whse.code;
    const relType = CWM_SHFTZ_OUT_REGTYPES[2].text;
    this.props.fileRelTransfers(soNo, whseCode, ftzWhseCode).then((result) => {
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
  handleCancelReg = () => {
    const { soNo } = this.props.params;
    this.props.cancelRelReg(soNo).then((result) => {
      if (result.error) {
        notification.error({
          message: '????????????',
          description: result.error.message,
          duration: 15,
        });
      }
    });
  }
  handleWtChange = (val, id) => {
    const change = { gross_wt: val };
    this.props.editReleaseWt({ change, id }).then((result) => {
      if (!result.error) {
        this.props.loadRelDetails(this.props.params.soNo, 'transfer');
      }
    });
  }
  handleTabChange = (tabKey) => {
    this.setState({ regIndex: Number(tabKey) });
  }
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
  handleReceiverChange = (preRegNo, recvCode) => {
    const receiver = this.props.receivers.filter(recv => recv.code === recvCode)[0];
    if (receiver) {
      Promise.all([
        this.props.updateRelReg(preRegNo, 'receiver_cus_code', receiver.customs_code),
        this.props.updateRelReg(preRegNo, 'receiver_name', receiver.name),
        this.props.updateRelReg(preRegNo, 'receiver_ftz_whse_code', receiver.ftz_whse_code),
      ]);
    }
  }
  handleSearch = (filterNo) => {
    const relReg = this.props.relRegs[this.state.regIndex];
    const currentFilter = {
      ...relReg.filter,
      filterNo,
    };
    this.handleLoadRelBodyList(1, null, currentFilter);
  }
  handleViewChange = (ev) => {
    const relReg = this.props.relRegs[this.state.regIndex];
    const currentFilter = {
      ...relReg.filter,
      merged: ev.target.value === 'merged',
    };
    this.handleLoadRelBodyList(1, null, currentFilter);
  }
  render() {
    const {
      relSo, relRegs, submitting, receivers, entryTotalValue,
    } = this.props;
    const reg = relRegs[this.state.regIndex];
    if (!reg || !reg.details) return null;
    const { details, filter } = reg;
    const relType = CWM_SHFTZ_OUT_REGTYPES[2]; // ????????????
    const regStatus = reg.status;
    const relEditable = regStatus < CWM_SHFTZ_APIREG_STATUS.completed;
    const outboundStatus = relSo.outbound_status || CWM_OUTBOUND_STATUS.ALL_ALLOC.value;
    const sent = regStatus === CWM_SHFTZ_APIREG_STATUS.processing;
    const sendText = sent ? '????????????' : '????????????';
    let sendable = true;
    let whyunsent;
    if (outboundStatus < CWM_OUTBOUND_STATUS.PARTIAL_ALLOC.value) {
      sendable = false;
      whyunsent = '??????????????????';
    } else if (outboundStatus === CWM_OUTBOUND_STATUS.PARTIAL_ALLOC.value) {
      whyunsent = '?????????????????????';
    } else if (!reg.ftz_rel_date || !reg.receiver_ftz_whse_code) {
      sendable = false;
      whyunsent = '????????????????????????????????????';
    }
    const recvOpts = receivers.map(recv => ({ key: recv.code, text: `${recv.customs_code} | ${recv.name} | ${recv.ftz_whse_code}` }));
    const receiver = receivers.filter(recv => recv.customs_code === reg.receiver_cus_code
      && recv.name === reg.receiver_name
      && recv.ftz_whse_code === reg.receiver_ftz_whse_code)[0];
    const outStatus = relSo.outbound_no
      && CWM_OUTBOUND_STATUS_INDICATOR.find(status => status.value === relSo.outbound_status);
    const menus = relRegs.map((r, i) => ({
      menu: r.ftz_rel_no || r.pre_entry_seq_no,
      key: String(i),
    }));
    const pagination = {
      current: details.current,
      pageSize: details.pageSize,
      total: details.totalCount,
      showQuickJumper: false,
      showSizeChanger: true,
      onChange: this.handlePageChange,
      showTotal: total => `??? ${total} ???`,
    };
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    return (
      <Layout>
        <PageHeader
          breadcrumb={[
            relType.ftztext,
            this.props.params.soNo,
          ]}
          menus={menus}
          onTabChange={this.handleTabChange}
        >
          <PageHeader.Nav>
            {relSo.outbound_no && <Tooltip title="????????????" placement="bottom">
              <Button icon="link" onClick={this.handleOutboundPage}><Badge status={outStatus.badge} text={outStatus.text} /></Button>
            </Tooltip>}
          </PageHeader.Nav>
          <PageHeader.Actions>
            <PrivilegeCover module="cwm" feature="supervision" action="edit">
              {regStatus === CWM_SHFTZ_APIREG_STATUS.completed && <Button icon="close" loading={submitting} onClick={this.handleCancelReg}>????????????</Button>}
              {relEditable &&
              <Button type="primary" ghost={sent} icon="cloud-upload-o" loading={submitting} onClick={this.handleSend} disabled={!sendable}>{sendText}</Button>}
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
                    editable={regStatus <= CWM_SHFTZ_APIREG_STATUS.completed && this.editPermission}
                    onSave={value => this.handleInfoSave(reg.pre_entry_seq_no, 'ftz_rel_no', value)}
                  />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('????????????????????????')} {...formItemLayout}>{reg.owner_cus_code}</FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('????????????')} {...formItemLayout}>{reg.owner_name}</FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('???????????????')} {...formItemLayout}>{reg.sender_ftz_whse_code}</FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('??????????????????')} {...formItemLayout}>
                  <EditableCell
                    value={reg.ftz_ent_no}
                    editable={relEditable && this.editPermission}
                    onSave={value => this.handleInfoSave(reg.pre_entry_seq_no, 'ftz_ent_no', value)}
                  />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('????????????????????????')} {...formItemLayout}>{reg.receiver_cus_code}</FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('????????????')} {...formItemLayout}>
                  <EditableCell
                    type="select"
                    value={receiver && receiver.code}
                    options={recvOpts}
                    editable={relEditable && this.editPermission}
                    onSave={value => this.handleReceiverChange(reg.pre_entry_seq_no, value)}
                  />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('???????????????')} {...formItemLayout}>{reg.receiver_ftz_whse_code}</FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('????????????')} {...formItemLayout}>
                  <EditableCell
                    type="date"
                    value={reg.ftz_rel_date && moment(reg.ftz_rel_date).format('YYYY-MM-DD')}
                    onSave={value => this.handleInfoSave(reg.pre_entry_seq_no, 'ftz_rel_date', new Date(value))}
                    editable={this.editPermission}
                  />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('??????????????????')} {...formItemLayout}>
                  <EditableCell
                    type="date"
                    value={reg.ftz_reg_date && moment(reg.ftz_reg_date).format('YYYY-MM-DD')}
                    onSave={value => this.handleInfoSave(reg.pre_entry_seq_no, 'ftz_reg_date', new Date(value))}
                    editable={this.editPermission}
                  />
                </FormItem>
              </Col>
            </Row>
            <Steps progressDot current={regStatus} className="progress-tracker">
              <Step title="?????????" />
              <Step title="?????????" />
              <Step title="?????????" />
            </Steps>
          </SidePanel>
          <Content className="page-content">
            {relEditable && whyunsent && <Alert message={whyunsent} type="info" showIcon closable />}
            <MagicCard bodyStyle={{ padding: 0 }}>
              <DataPane
                header="????????????"
                columns={this.columns}
                rowSelection={rowSelection}
                indentSize={8}
                dataSource={details.data}
                pagination={pagination}
                rowKey="id"
                loading={this.state.loading}
              >
                <DataPane.Toolbar>
                  <SearchBox value={filter && filter.filterNo} placeholder={this.msg('searchPlaceholder')} onSearch={this.handleSearch} />
                  <RadioGroup value={(filter && filter.merged) ? 'merged' : 'splitted'} onChange={this.handleViewChange} >
                    <RadioButton value="splitted">???????????????</RadioButton>
                    <RadioButton value="merged">???????????????</RadioButton>
                  </RadioGroup>
                  <DataPane.Extra>
                    <Summary>
                      <Summary.Item label="?????????">{entryTotalValue.total_qty}</Summary.Item>
                      <Summary.Item label="?????????" addonAfter="KG">{entryTotalValue.total_net_wt.toFixed(3)}</Summary.Item>
                      <Summary.Item label="?????????">{entryTotalValue.total_amount.toFixed(3)}</Summary.Item>
                    </Summary>
                  </DataPane.Extra>
                </DataPane.Toolbar>
              </DataPane>
            </MagicCard>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
