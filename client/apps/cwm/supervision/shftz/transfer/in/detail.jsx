import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { Badge, Layout, Col, Form, Row, Steps, Button, Radio, Tabs, Tag, Tooltip, message, notification } from 'antd';
import connectNav from 'client/common/decorators/connect-nav';
import SidePanel from 'client/components/SidePanel';
import PageHeader from 'client/components/PageHeader';
import MagicCard from 'client/components/MagicCard';
import SearchBox from 'client/components/SearchBox';
import EditableCell from 'client/components/EditableCell';
import DataPane from 'client/components/DataPane';
import Summary from 'client/components/Summary';
import { loadEntryDetails, loadEntryBody, updateEntryReg, pairEntryRegProducts, putCustomsRegFields, loadEntryTotalValue } from 'common/reducers/cwmShFtz';
import { CWM_SHFTZ_APIREG_STATUS, CWM_SHFTZ_IN_REGTYPES, CWM_INBOUND_STATUS_INDICATOR } from 'common/constants';
import { PrivilegeCover, hasPermission } from 'client/common/decorators/withPrivilege';
import { formatMsg } from '../../message.i18n';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { Content } = Layout;
const { TabPane } = Tabs;
const { Step } = Steps;
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
    transfInReg: state.cwmShFtz.entry_asn,
    entryRegs: state.cwmShFtz.entry_regs,
    entryTotalValue: state.cwmShFtz.singleRegStat,
    owners: state.cwmContext.whseAttrs.owners,
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
    submitting: state.cwmShFtz.submitting,
    privileges: state.account.privileges,
  }),
  {
    loadEntryDetails,
    loadEntryBody,
    updateEntryReg,
    pairEntryRegProducts,
    putCustomsRegFields,
    loadEntryTotalValue,
  }
)
@connectNav({
  depth: 3,
  moduleName: 'cwm',
  title: 'featCwmShftz',
  jumpOut: true,
})
export default class SHFTZTransferInDetail extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    selectedRowKeys: [],
  }
  componentDidMount() {
    const { preFtzEntNo } = this.props.params;
    this.props.loadEntryDetails({ preEntrySeqNo: preFtzEntNo });
    this.props.loadEntryTotalValue(preFtzEntNo);
  }
  columns = [{
    title: '??????',
    dataIndex: 'asn_seq_no',
    width: 50,
    align: 'center',
    className: 'table-col-seq',
  }, {
    title: '????????????',
    dataIndex: 'ftz_ent_no',
    width: 120,
  }, {
    title: '????????????',
    dataIndex: 'ftz_cargo_no',
    width: 160,
  }, {
    title: '????????????ID',
    dataIndex: 'ftz_ent_detail_id',
    width: 120,
  }, {
    title: '????????????',
    dataIndex: 'product_no',
    width: 160,
  }, {
    title: '????????????',
    dataIndex: 'hscode',
    width: 180,
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
    title: '????????????',
    dataIndex: 'stock_qty',
    width: 100,
    render: o => (<b>{o}</b>),
  }, {
    title: '??????',
    dataIndex: 'unit',
    width: 100,
    render: o => renderCombineData(o, this.props.unit),
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
    title: '????????????',
    width: 100,
    dataIndex: 'stock_grosswt',
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
  handleLoadEntryBodyList = (currentParam, pageSizeParam, filterParam) => {
    const { entryRegs, params: { preFtzEntNo } } = this.props;
    const { details, filter } = entryRegs[0];
    const currentPage = currentParam || details.current;
    const currentSize = pageSizeParam || details.pageSize;
    const currentFilter = JSON.stringify(filterParam || filter || {});
    this.props.loadEntryBody(preFtzEntNo, currentPage, currentSize, currentFilter, 'transfer');
  }
  handlePageChange = (page, pageSize) => {
    this.handleLoadEntryBodyList(page, pageSize);
  }
  handleEnqueryPairing = () => {
    const {
      username: loginName, params: { preFtzEntNo }, whse, transfInReg,
    } = this.props;
    this.props.pairEntryRegProducts(
      preFtzEntNo, transfInReg.asn_no, whse.code,
      whse.ftz_whse_code, loginName
    ).then((result) => {
      if (!result.error) {
        if (result.data.remainFtzStocks.length > 0 || result.data.remainProducts.length > 0) {
          // todo ???????????? ????????????
          const { remainFtzStocks, remainProducts } = result.data;
          let remainFtzMsg = null;
          if (remainFtzStocks.length > 0) {
            remainFtzMsg = (<span>???????????????????????????????????????: <br />{
              remainFtzStocks.map(rfs =>
                (<span key={rfs.ftz_ent_detail_id}>{rfs.hscode}-{rfs.name}
                  <br />??????: {rfs.stock_wt.toFixed(6)} ??????: {rfs.stock_qty} <br /></span>))
            }</span>);
          }
          let remainPrdtMsg = null;
          if (remainProducts.length > 0) {
            remainPrdtMsg = (<span>????????????????????????: <br />{
          remainProducts.map(rps =>
            (<span key={`${rps.product_no}${rps.asn_seq_no}`}>{rps.product_no}-{rps.hscode || '???hscode'}-{rps.name}
              <br />??????: {rps.expect_qty}<br /></span>))
            }</span>);
          }
          notification.warn({
            message: '???????????????',
            description: <span>{remainFtzMsg}<br />{remainPrdtMsg}</span>,
            duration: 0,
            placement: 'topLeft',
          });
        } else {
          notification.success({
            message: '????????????',
            description: '????????????ID????????????',
          });
        }
        this.props.loadEntryDetails({ preEntrySeqNo: preFtzEntNo });
      } else if (result.error.message.key === 'prd-ftz-qty-unmatch') {
        const { ftzTotalQty, prdTotalQty } = result.error.message;
        notification.error({
          message: '????????????: ??????????????????',
          description: <span>???????????????: {prdTotalQty}<br />?????????????????????: {ftzTotalQty}</span>,
          duration: 0,
          placement: 'topLeft',
        });
      } else if (result.error.message.key === 'prd-ftz-amount-unmatch') {
        const { currAmountMap } = result.error.message;
        const { currency } = this.props;
        const descSpans = [];
        Object.keys(currAmountMap).forEach((curr) => {
          let currName = curr;
          const foundCurr = currency.find(currInst => currInst.value === curr);
          if (foundCurr) {
            currName = foundCurr.text;
          }
          const amountPart = currAmountMap[curr];
          descSpans.push(<span key={curr}>????????????: {amountPart.prd} {currName}<br />
            ????????????: {amountPart.ftz} {currName}<br /></span>);
        });
        notification.error({
          message: '????????????: ??????????????????',
          description: <span>{descSpans}</span>,
          duration: 0,
          placement: 'topLeft',
        });
      } else if (result.error.message === 'WHSE_FTZ_UNEXIST') {
        notification.error({
          message: '????????????',
          description: '???????????????????????????',
        });
      } else {
        notification.error({
          message: '????????????????????????',
          description: result.error.message,
          duration: 15,
        });
      }
    });
  }
  handleTransfOwnerChange= (value) => {
    const owner = this.props.owners.filter(own => own.customs_code === value)[0];
    if (owner) {
      const { preFtzEntNo } = this.props.params;
      this.props.putCustomsRegFields(
        { pre_ftz_ent_no: preFtzEntNo },
        { owner_cus_code: owner.customs_code, owner_name: owner.name }
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
  }
  handleInfoSave = (field, value) => {
    const { preFtzEntNo } = this.props.params;
    this.props.updateEntryReg(preFtzEntNo, field, value, undefined, true).then((result) => {
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
  handleInboundPage = () => {
    this.context.router.push(`/cwm/receiving/inbound/${this.props.transfInReg.inbound_no}`);
  }
  handlePairingConfirmed = () => {
    const { preFtzEntNo } = this.props.params;
    this.props.putCustomsRegFields(
      { pre_ftz_ent_no: preFtzEntNo },
      { status: CWM_SHFTZ_APIREG_STATUS.completed }
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
  handleViewChange = (ev) => {
    const { filter } = this.props.entryRegs[0];
    const currentFilter = {
      ...filter,
      merged: ev.target.value === 'merged',
    };
    this.handleLoadEntryBodyList(1, null, currentFilter);
  }
  handleSearch = (filterNo) => {
    const { entryRegs } = this.props;
    const { filter } = entryRegs[0];
    const currentFilter = {
      ...filter,
      filterNo,
    };
    this.handleLoadEntryBodyList(1, null, currentFilter);
  }
  render() {
    const {
      transfInReg, entryRegs, submitting, owners, entryTotalValue,
    } = this.props;
    if (entryRegs.length !== 1 || !entryRegs[0].details) {
      return null;
    }
    const { details, filter } = entryRegs[0];
    const entType = CWM_SHFTZ_IN_REGTYPES[2];
    const inbStatus = CWM_INBOUND_STATUS_INDICATOR.filter(status =>
      status.value === transfInReg.inbound_status)[0];
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
    let enPairBtn = null;
    if (entryRegs[0].ftz_ent_no && entryRegs[0].reg_status === CWM_SHFTZ_APIREG_STATUS.pending) {
      if (transfInReg.inbound_status !== 0) {
        enPairBtn = (<Tooltip title="?????????????????????????????????,???????????????" placement="bottom">
          <Button type="primary" icon="sync" loading={submitting} disabled onClick={this.handleEnqueryPairing}>??????????????????</Button>
        </Tooltip>);
      } else {
        enPairBtn = <Button type="primary" icon="sync" loading={submitting} onClick={this.handleEnqueryPairing}>??????????????????</Button>;
      }
    }
    return (
      <Layout>
        <PageHeader
          breadcrumb={[
            entType.ftztext,
            this.props.params.preFtzEntNo,
          ]}
        >
          <PageHeader.Nav>
            {transfInReg.inbound_no && <Tooltip title="???????????????" placement="bottom">
              <Button icon="link" onClick={this.handleInboundPage}>
                {inbStatus && <Badge status={inbStatus.badge} text={inbStatus.text} />}
              </Button>
            </Tooltip>
            }
          </PageHeader.Nav>
          <PageHeader.Actions>
            <PrivilegeCover module="cwm" feature="supervision" action="edit">
              {enPairBtn}
              {details.data.length > 0 &&
                entryRegs[0].reg_status < CWM_SHFTZ_APIREG_STATUS.completed &&
                <Button type="primary" loading={submitting} onClick={this.handlePairingConfirmed}>????????????</Button>}
            </PrivilegeCover>
          </PageHeader.Actions>
        </PageHeader>
        <Layout>
          <SidePanel top onCollapseChange={this.handleCollapseChange}>
            <Row style={{ padding: 16 }}>
              <Col span={12}>
                <FormItem label={this.msg('????????????')} {...formItemLayout}>
                  <EditableCell
                    value={transfInReg.owner_cus_code}
                    type="select"
                    options={owners.map(data => ({
                      key: data.customs_code,
                      text: `${data.customs_code}|${data.name}`,
                    }))}
                    onSave={this.handleTransfOwnerChange}
                    editable={this.editPermission}
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={this.msg('??????????????????')} {...formItemLayout}>
                  <EditableCell
                    value={entryRegs[0].ftz_ent_no}
                    onSave={value => this.handleInfoSave('ftz_ent_no', value)}
                    editable={this.editPermission}
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={this.msg('????????????')} {...formItemLayout}>
                  <EditableCell
                    editable={false}
                    value={`${transfInReg.sender_cus_code}|${transfInReg.sender_name}`}
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={this.msg('??????????????????')} {...formItemLayout}>
                  <EditableCell
                    value={transfInReg.ftz_rel_no}
                    onSave={value => this.handleInfoSave('ftz_rel_no', value)}
                    editable={this.editPermission}
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={this.msg('???????????????')} {...formItemLayout}>
                  <EditableCell
                    editable={false}
                    value={transfInReg.receiver_ftz_whse_code}
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={this.msg('??????????????????')} {...formItemLayout}>
                  <EditableCell
                    type="date"
                    value={transfInReg.ftz_ent_date && moment(transfInReg.ftz_ent_date).format('YYYY-MM-DD')}
                    onSave={value => this.handleInfoSave('ftz_ent_date', new Date(value))}
                    editable={this.editPermission}
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={this.msg('???????????????')} {...formItemLayout}>
                  <EditableCell
                    editable={false}
                    value={transfInReg.sender_ftz_whse_code}
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={this.msg('????????????')} {...formItemLayout}>
                  <EditableCell
                    type="date"
                    value={transfInReg.ftz_rel_date && moment(transfInReg.ftz_rel_date).format('YYYY-MM-DD')}
                    onSave={value => this.handleInfoSave('ftz_rel_date', new Date(value))}
                    editable={this.editPermission}
                  />
                </FormItem>
              </Col>
            </Row>
            <Steps progressDot current={entryRegs[0].reg_status} className="progress-tracker">
              <Step title="?????????" />
              <Step title="?????????" />
              <Step title="?????????" />
            </Steps>
          </SidePanel>
          <Content className="page-content">
            <MagicCard bodyStyle={{ padding: 0 }} >
              <Tabs defaultActiveKey="transitDetails">
                <TabPane tab="????????????" key="transitDetails">
                  <DataPane
                    columns={this.columns}
                    rowSelection={rowSelection}
                    indentSize={0}
                    dataSource={details.data}
                    pagination={pagination}
                    rowKey="id"
                    loading={this.state.loading}
                  >
                    <DataPane.Toolbar>
                      <SearchBox value={filter && filter.filterNo} placeholder={this.msg('searchPlaceholder')} onSearch={this.handleSearch} />
                      {details.data.length > 0 &&
                      <RadioGroup value={(filter && filter.merged) ? 'merged' : 'splitted'} onChange={this.handleViewChange} >
                        <RadioButton value="splitted">???????????????</RadioButton>
                        <RadioButton value="merged">???????????????</RadioButton>
                      </RadioGroup>}
                      <DataPane.Extra>
                        <Summary>
                          <Summary.Item label="???????????????">{entryTotalValue.total_qty}</Summary.Item>
                          <Summary.Item label="???????????????" addonAfter="KG">{entryTotalValue.total_net_wt.toFixed(3)}</Summary.Item>
                          <Summary.Item label="???????????????">{entryTotalValue.total_amount.toFixed(3)}</Summary.Item>
                        </Summary>
                      </DataPane.Extra>
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
