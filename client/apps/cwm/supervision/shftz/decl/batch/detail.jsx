import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import FileSaver from 'file-saver';
import { intlShape, injectIntl } from 'react-intl';
import { Tag, Badge, Col, Form, Row, Input, Layout, Tabs, Steps, Button, notification, Radio, message } from 'antd';
import connectNav from 'client/common/decorators/connect-nav';
import SidePanel from 'client/components/SidePanel';
import PageHeader from 'client/components/PageHeader';
import MagicCard from 'client/components/MagicCard';
import EditableCell from 'client/components/EditableCell';
import SearchBox from 'client/components/SearchBox';
import DataPane from 'client/components/DataPane';
import Summary from 'client/components/Summary';
import { exportBatchDeclDetails } from 'common/reducers/cwmShFtzDecl';
import { loadApplyDetails, fileBatchApply, makeBatchApplied, loadDeclRelDetails, loadSingleApplyDetails, loadDeclRelStat, cwmShFtzDecl } from 'common/reducers/cwmShFtz';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
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
    batchDecl: state.cwmShFtz.batch_decl,
    batchApplies: state.cwmShFtz.batch_applies,
    regs: state.cwmShFtz.declRelRegs,
    details: state.cwmShFtz.declRelDetails,
    declRelFilter: state.cwmShFtz.declRelFilter,
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
    trxnMode: state.saasParams.latest.trxnMode.map(tx => ({
      value: tx.trx_mode,
      text: tx.trx_spec,
    })),
    whse: state.cwmContext.defaultWhse,
    submitting: state.cwmShFtz.submitting,
  }),
  {
    loadApplyDetails,
    loadDeclRelDetails,
    fileBatchApply,
    makeBatchApplied,
    exportBatchDeclDetails,
    loadSingleApplyDetails,
    loadDeclRelStat,
    cwmShFtzDecl,
  }
)
@connectNav({
  depth: 3,
  moduleName: 'cwm',
  title: 'featCwmShftz',
  jumpOut: true,
})
export default class BatchDeclDetail extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    tabKey: 'details',
    regSearchText: '',
    selectedRowKeys: [],
  }
  componentDidMount() {
    const { batchNo } = this.props.params;
    this.props.loadApplyDetails(batchNo);
    this.props.loadDeclRelDetails(batchNo);
    this.props.loadDeclRelStat(batchNo);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.batchApplies !== this.props.batchApplies && nextProps.batchApplies.length > 0) {
      if (this.state.tabKey === 'details') {
        this.setState({
          tabKey: nextProps.batchApplies[0].pre_entry_seq_no,
        });
      }
    }
  }
  getMergedCols = () => {
    const cols = [...this.columns];
    const index = cols.findIndex(col => col.dataIndex === 'pre_ciqdec_no');
    cols[index] = Object.assign({}, cols[index], {
      render: (o, record) => (<EditableCell
        value={o}
        onSave={value => this.handleUpdateCiqNo(record.ftz_rel_detail_id, value)}
        style={{ width: '100%' }}
        btnPosition="right"
      />),
    });
    return cols;
  }
  msg = formatMsg(this.props.intl)
  regColumns = [{
    title: '??????????????????',
    dataIndex: 'ftz_rel_no',
    width: 220,
  }, {
    title: 'SO??????',
    dataIndex: 'so_no',
    width: 200,
  }, {
    title: '?????????',
    width: 200,
    dataIndex: 'supplier',
  }, {
    title: '????????????',
    width: 120,
    dataIndex: 'trxn_mode',
    render: o => renderCombineData(o, this.props.trxnMode),
  }, {
    title: '??????',
    width: 120,
    dataIndex: 'currency',
    render: o => renderCombineData(o, this.props.currency),
  }, {
    dataIndex: 'SPACER_COL',
  }]
  relColumns = [{
    title: '??????????????????',
    dataIndex: 'ftz_rel_no',
    width: 220,
  }, {
    title: '????????????ID',
    dataIndex: 'ftz_rel_detail_id',
    width: 150,
  }, {
    title: '????????????',
    dataIndex: 'product_no',
    width: 150,
  }, {
    title: '????????????',
    dataIndex: 'hscode',
    width: 120,
  }, {
    title: '????????????',
    dataIndex: 'g_name',
    width: 150,
  }, {
    title: '????????????',
    dataIndex: 'model',
    width: 240,
  }, {
    title: '?????????',
    dataIndex: 'country',
    width: 150,
    render: o => renderCombineData(o, this.props.country),
  }, {
    title: '??????',
    dataIndex: 'out_unit',
    width: 100,
    render: o => renderCombineData(o, this.props.unit),
  }, {
    title: '??????',
    width: 100,
    dataIndex: 'qty',
  }, {
    title: '??????',
    width: 100,
    dataIndex: 'gross_wt',
  }, {
    title: '??????',
    width: 100,
    dataIndex: 'net_wt',
  }, {
    title: '??????',
    width: 100,
    dataIndex: 'amount',
  }, {
    title: '??????',
    width: 100,
    dataIndex: 'currency',
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
    dataIndex: 'freight',
    width: 100,
  }, {
    title: '????????????',
    dataIndex: 'freight_currency',
    width: 100,
    render: o => renderCombineData(o, this.props.currency),
  }, {
    title: '?????????',
    dataIndex: 'dest_country',
    width: 150,
    render: o => renderCombineData(o, this.props.country),
  }]
  columns = [{
    title: '????????????ID',
    dataIndex: 'ftz_rel_detail_id',
    width: 110,
  }, {
    title: '??????',
    dataIndex: 'decl_g_no',
    width: 70,
  }, {
    title: this.msg('preCiqdecNo'),
    dataIndex: 'pre_ciqdec_no',
    width: 220,
    align: 'center',
    render: o => o,
  }, {
    title: '????????????',
    dataIndex: 'product_no',
    width: 150,
  }, {
    title: '????????????',
    dataIndex: 'g_name',
    width: 150,
  }, {
    title: '??????',
    width: 100,
    dataIndex: 'qty',
  }, {
    title: '??????',
    width: 100,
    dataIndex: 'gross_wt',
  }, {
    title: '??????',
    width: 100,
    dataIndex: 'net_wt',
  }, {
    title: '??????',
    dataIndex: 'amount',
    width: 200,
  }, {
    dataIndex: 'SPACER_COL',
  }]
  handleLoadDeclDetails = (currentParam, pageSizeParam, filterParam) => { // ?????????????????????????????????
    const { params: { batchNo }, details: { current, pageSize }, declRelFilter } = this.props;
    const currentPage = currentParam || current;
    const currentSize = pageSizeParam || pageSize;
    const currentFilter = JSON.stringify(filterParam || declRelFilter);
    this.props.loadDeclRelDetails(batchNo, currentPage, currentSize, currentFilter);
  }
  handleLoadSingleApply =
  (preEntrySeqNo, currentParam, pageSizeParam, filterParam) => { // ???????????????????????????????????????
    const currentApply = this.props.batchApplies.find(f => f.pre_entry_seq_no === preEntrySeqNo);
    if (!currentApply || !currentApply.details) return;
    const { details: { current, pageSize }, filter } = currentApply;
    const currentPage = currentParam || current;
    const currentSize = pageSizeParam || pageSize;
    const currentFilter = JSON.stringify(filterParam || filter || {});
    this.props.loadSingleApplyDetails(preEntrySeqNo, currentPage, currentSize, currentFilter);
  }
  handleSend = () => {
    const { batchNo } = this.props.params;
    const { batchDecl } = this.props;
    const ftzWhseCode = this.props.whse.ftz_whse_code;
    const { loginId } = this.props;
    this.props.fileBatchApply(batchNo, batchDecl.whse_code, ftzWhseCode, loginId).then((result) => {
      if (!result.error) {
        if (result.data.errorMsg) {
          notification.warn({
            message: '????????????',
            description: result.data.errorMsg,
          });
        } else {
          notification.success({
            message: '????????????',
            description: `${batchNo} ???????????? ????????????????????????????????? ??????????????????`,
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
        });
      }
    });
  }
  handleQuery = () => {
    const { batchNo } = this.props.params;
    this.props.makeBatchApplied(batchNo).then((result) => {
      if (!result.error) {
        this.props.loadApplyDetails(batchNo);
      } else if (result.error.message === 'WHSE_FTZ_UNEXIST') {
        notification.error({
          message: '????????????',
          description: '???????????????????????????',
        });
      }
    });
  }
  handleDelgManifest = () => {
    this.context.router.push(`/clearance/delegation/manifest/${this.props.batchDecl.delg_no}`);
  }
  handleTabChange = (key) => {
    this.setState({ tabKey: key });
  }
  handleListSearch = (searchText) => {
    this.setState({ regSearchText: searchText });
  }
  handleDetailsSearch = (searchText) => {
    const { declRelFilter } = this.props;
    const filter = { ...declRelFilter, filterNo: searchText };
    this.handleLoadDeclDetails(1, null, filter);
  }
  handleAppliesSearch = (searchText, preEntrySeqNo) => {
    const currentApply = this.props.batchApplies.find(f => f.pre_entry_seq_no === preEntrySeqNo);
    if (!currentApply) return;
    const currentFilter = { ...currentApply.filter, filterNo: searchText };
    this.handleLoadSingleApply(preEntrySeqNo, 1, null, currentFilter);
  }
  handleAppliesViewChange = (view, preEntrySeqNo) => {
    const currentApply = this.props.batchApplies.find(f => f.pre_entry_seq_no === preEntrySeqNo);
    if (!currentApply) return;
    const currentFilter = { ...currentApply.filter, merged: view === 'merged' };
    this.handleLoadSingleApply(preEntrySeqNo, 1, null, currentFilter);
  }
  handleDetailsPageChange = (page, size) => {
    this.handleLoadDeclDetails(page, size);
  }
  handleAppliesPageChange = (page, size, preEntrySeqNo) => {
    this.handleLoadSingleApply(preEntrySeqNo, page, size);
  }
  handleBatchDeclDetailExport = () => {
    const { batchNo } = this.props.params;
    this.props.exportBatchDeclDetails(batchNo).then((resp) => {
      if (!resp.error) {
        FileSaver.saveAs(
          new window.Blob([Buffer.from(resp.data)], { type: 'application/octet-stream' }),
          `${batchNo}_????????????????????????.xlsx`
        );
      } else {
        notification.error({
          message: '????????????',
          description: resp.error.message,
        });
      }
    });
  }
  handleUpdateCiqNo = (id, value) => {
    this.props.cwmShFtzDecl(id, value).then((result) => {
      if (!result.error) {
        message.info(this.msg('editSuccess'));
      } else {
        message.info(this.msg('editFail'));
      }
    });
  }
  render() {
    const {
      batchDecl, submitting, details, regs, batchApplies, entryTotalValue,
    } = this.props;
    const { regSearchText, tabKey } = this.state;
    if (!details || !batchApplies) return null;
    let filterRegs = regs;
    if (regSearchText) {
      filterRegs = regs.filter((item) => {
        const reg = new RegExp(regSearchText);
        return reg.test(item.ftz_rel_no) || reg.test(item.so_no);
      });
    }
    let applyStep = 0;
    let sendText;
    const sent = batchDecl.status === 'processing';
    if (batchDecl.status === 'generated') {
      applyStep = 1;
      sendText = '??????????????????';
    } else if (batchDecl.status === 'processing') {
      applyStep = 2;
      sendText = '????????????';
    } else if (batchDecl.status === 'applied') {
      applyStep = 2;
    } else if (batchDecl.status === 'cleared') {
      applyStep = 3;
    }
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    const detailsPagination = {
      current: details.current,
      pageSize: details.pageSize,
      total: details.totalCount,
      showQuickJumper: false,
      showSizeChanger: true,
      onChange: this.handleDetailsPageChange,
      showTotal: total => `??? ${total} ???`,
    };
    return (
      <Layout>
        <PageHeader
          breadcrumb={[
            this.msg('ftzBatchDecl'),
            this.props.params.batchNo,
          ]}
        >
          <PageHeader.Nav>
            <Button icon="link" onClick={this.handleDelgManifest}>?????????????????? <Badge status="default" text="?????????" /></Button>
          </PageHeader.Nav>
          <PageHeader.Actions>
            <PrivilegeCover module="cwm" feature="supervision" action="edit">
              {sent && <Button icon="check" loading={submitting} onClick={this.handleQuery}>??????????????????</Button>}
              {sendText &&
              <Button type="primary" ghost={sent} icon="export" onClick={this.handleSend} loading={submitting}>{sendText}</Button>}
            </PrivilegeCover>
          </PageHeader.Actions>
        </PageHeader>
        <Layout>
          <SidePanel top onCollapseChange={this.handleCollapseChange}>
            <Row style={{ padding: 16 }}>
              <Col span={6}>
                <FormItem label={this.msg('????????????')} {...formItemLayout}>
                  <EditableCell
                    editable={false}
                    value={batchDecl.owner_name}
                  />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('????????????')} {...formItemLayout}>
                  <EditableCell
                    editable={false}
                    value={batchDecl.receiver_name}
                  />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('????????????')} {...formItemLayout}>
                  <EditableCell
                    editable={false}
                    value={batchDecl.broker_name}
                  /></FormItem>
              </Col>

              <Col span={6}>
                <FormItem label={this.msg('????????????')} {...formItemLayout}>
                  <EditableCell
                    editable={false}
                    value={batchDecl.reg_date && moment(batchDecl.reg_date).format('YYYY.MM.DD HH:mm')}
                  />
                </FormItem>
              </Col>
            </Row>
            <Steps progressDot current={applyStep} className="progress-tracker">
              <Step title="????????????" />
              <Step title="???????????????" />
              <Step title="???????????????" />
              <Step title="?????????" />
            </Steps>
          </SidePanel>
          <Content className="page-content">
            <MagicCard bodyStyle={{ padding: 0 }}>
              <Tabs activeKey={tabKey} onChange={this.handleTabChange}>
                <TabPane tab="?????????????????????" key="list">
                  <DataPane
                    columns={this.regColumns}
                    rowSelection={rowSelection}
                    indentSize={0}
                    dataSource={filterRegs}
                    rowKey="ftz_rel_no"
                    loading={this.state.loading}
                  >
                    <DataPane.Toolbar>
                      <SearchBox placeholder={this.msg('searchRelDeclPlaceholder')} onSearch={this.handleListSearch} />
                    </DataPane.Toolbar>
                  </DataPane>
                </TabPane>
                <TabPane tab="??????????????????" key="details">
                  <DataPane
                    columns={this.relColumns}
                    rowSelection={rowSelection}
                    indentSize={0}
                    dataSource={details.data}
                    pagination={detailsPagination}
                    rowKey="id"
                    loading={this.state.loading}
                  >
                    <DataPane.Toolbar>
                      <SearchBox placeholder={this.msg('searchPlaceholder')} onSearch={this.handleDetailsSearch} />
                      <Button onClick={this.handleBatchDeclDetailExport}>??????</Button>
                      <DataPane.Extra>
                        <Summary>
                          <Summary.Item label="?????????" addonAfter="KG">{entryTotalValue.total_qty}</Summary.Item>
                          <Summary.Item label="?????????" addonAfter="KG">{entryTotalValue.total_net_wt.toFixed(3)}</Summary.Item>
                          <Summary.Item label="?????????" addonAfter="KG">{entryTotalValue.total_gross_wt.toFixed(3)}</Summary.Item>
                        </Summary>
                      </DataPane.Extra>
                    </DataPane.Toolbar>
                  </DataPane>
                </TabPane>
                {batchApplies.map(reg => (
                  <TabPane tab={`?????????${reg.ftz_apply_no || reg.pre_entry_seq_no}`} key={reg.pre_entry_seq_no}>
                    <DataPane
                      columns={(reg.filter && reg.filter.merged) ?
                        this.getMergedCols() : this.columns}
                      rowSelection={rowSelection}
                      indentSize={8}
                      dataSource={reg.details.data}
                      pagination={{
                        current: reg.details.current,
                        pageSize: reg.details.pageSize,
                        total: reg.details.totalCount,
                        showQuickJumper: false,
                        showSizeChanger: true,
                        onChange: (page, size) =>
                          this.handleAppliesPageChange(page, size, reg.pre_entry_seq_no),
                        showTotal: total => `??? ${total} ???`,
                      }}
                      rowKey="id"
                      loading={this.state.loading}
                    >
                      <DataPane.Toolbar>
                        <SearchBox
                          placeholder={this.msg('searchPlaceholder')}
                          value={reg.filter && reg.filter.filterNo}
                          onSearch={searchText =>
                              this.handleAppliesSearch(searchText, reg.pre_entry_seq_no)}
                        />
                        <Input placeholder="????????????" value={reg.cus_decl_no} style={{ width: 200, marginRight: 20 }} readOnly />
                        <RadioGroup value={(reg.filter && reg.filter.merged) ? 'merged' : 'splitted'} onChange={ev => this.handleAppliesViewChange(ev.target.value, reg.pre_entry_seq_no)} >
                          <RadioButton value="splitted">???????????????</RadioButton>
                          <RadioButton value="merged">???????????????</RadioButton>
                        </RadioGroup>
                        <DataPane.Extra>
                          <Summary>
                            <Summary.Item label="?????????" addonAfter="KG">{reg.totalvalue.total_qty}</Summary.Item>
                            <Summary.Item label="??????/??????" addonAfter="KG">{`${reg.totalvalue.total_gross_wt.toFixed(2)}/${reg.totalvalue.total_net_wt.toFixed(4)}`}</Summary.Item>
                          </Summary>
                        </DataPane.Extra>
                      </DataPane.Toolbar>
                    </DataPane>
                  </TabPane>))}
              </Tabs>
            </MagicCard>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
