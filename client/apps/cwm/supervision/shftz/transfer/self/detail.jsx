import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { Layout, Steps, Col, Form, Row, Button, Tabs, Tag, Radio, message, notification } from 'antd';
import connectNav from 'client/common/decorators/connect-nav';
import SidePanel from 'client/components/SidePanel';
import PageHeader from 'client/components/PageHeader';
import MagicCard from 'client/components/MagicCard';
import DataPane from 'client/components/DataPane';
import SearchBox from 'client/components/SearchBox';
import EditableCell from 'client/components/EditableCell';
import Summary from 'client/components/Summary';
import { loadVirtualTransferDetails, updateEntryReg, putCustomsRegFields, transferToOwnWhse, queryOwnTransferOutIn, loadEntryTotalValue } from 'common/reducers/cwmShFtz';
import { CWM_SHFTZ_APIREG_STATUS } from 'common/constants';
import { PrivilegeCover, hasPermission } from 'client/common/decorators/withPrivilege';
import { formatMsg } from '../../message.i18n';

const { Content } = Layout;
const { Step } = Steps;
const { TabPane } = Tabs;
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
    transfSelfReg: state.cwmShFtz.entry_asn,
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
    owners: state.cwmContext.whseAttrs.owners,
    submitting: state.cwmShFtz.submitting,
    privileges: state.account.privileges,
  }),
  {
    loadVirtualTransferDetails,
    updateEntryReg,
    transferToOwnWhse,
    queryOwnTransferOutIn,
    putCustomsRegFields,
    loadEntryTotalValue,
  }
)
@connectNav({
  depth: 3,
  moduleName: 'cwm',
  title: 'featCwmShftz',
})
export default class SHFTZTransferSelfDetail extends Component {
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
    const { params: { asnNo } } = this.props;
    this.props.loadEntryTotalValue(asnNo, true);
    this.handleLoadEntryList(1, 20);
  }
  columns = [{
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
    dataIndex: 'stock_netwt',
  }, {
    title: '??????',
    width: 100,
    dataIndex: 'stock_grosswt',
  }, {
    title: '??????',
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
  handleLoadEntryList = (currentParam, pageSizeParam, filterParam) => {
    const { transfSelfReg: { details, filter }, params: { asnNo } } = this.props;
    const currentPage = currentParam || details.current;
    const currentSize = pageSizeParam || details.pageSize;
    const currentFilter = JSON.stringify(filterParam || filter || {});
    this.props.loadVirtualTransferDetails(asnNo, currentPage, currentSize, currentFilter);
  }
  handlePageChange = (page, pageSize) => {
    this.handleLoadEntryList(page, pageSize);
  }
  handleTransfOwnerChange= (value) => {
    const owner = this.props.owners.filter(own => own.customs_code === value)[0];
    const { transfSelfReg } = this.props;
    if (owner) {
      this.props.putCustomsRegFields(
        { pre_ftz_ent_no: transfSelfReg.pre_ftz_ent_no },
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
    const { transfSelfReg, updateEntryReg: upERfunc } = this.props;
    upERfunc(transfSelfReg.pre_ftz_ent_no, field, value, true)
      .then((result) => {
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
  handleCancelReg = () => {
    const { transfSelfReg } = this.props;
    this.props.putCustomsRegFields(
      { pre_ftz_ent_no: transfSelfReg.pre_ftz_ent_no },
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
  handleSelfTransfExport = () => {
    const { transfSelfReg, params: { asnNo } } = this.props;
    const sheetCode = transfSelfReg.ftz_rel_no || transfSelfReg.pre_ftz_ent_no;
    window.open(`${API_ROOTS.default}v1/cwm/shftz/transfer/self/export/??????????????????_${sheetCode}.xlsx?asnNo=${asnNo}`);
  }
  handleTransToWhs = () => {
    const { params, whse } = this.props;
    this.props.transferToOwnWhse({
      asnNo: params.asnNo,
      whseCode: whse.code,
      ftzWhseCode: whse.ftz_whse_code,
    }).then((result) => {
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
            placement: 'topLeft',
          });
          this.props.loadVirtualTransferDetails(params.asnNo);
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
  handleOwnTransferQuery = () => {
    const { params: { asnNo }, username, whse } = this.props;
    this.props.queryOwnTransferOutIn({
      asn_no: asnNo,
      whse: whse.code,
      ftzWhseCode: this.props.whse.ftz_whse_code,
      username,
    }).then((result) => {
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
            placement: 'topLeft',
          });
          this.props.loadVirtualTransferDetails(asnNo);
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
  handleSearch = (searchText) => {
    const { filter } = this.props.transfSelfReg;
    const currentFilter = {
      ...filter,
      filterNo: searchText,
    };
    this.handleLoadEntryList(1, null, currentFilter);
  }
  handleViewChange = (ev) => {
    const { filter } = this.props.transfSelfReg;
    const currentFilter = {
      ...filter,
      merged: ev.target.value === 'merged',
    };
    this.handleLoadEntryList(1, null, currentFilter);
  }
  render() {
    const {
      owners, transfSelfReg, submitting, entryTotalValue,
    } = this.props;
    const { details, filter } = transfSelfReg;
    if (!details) {
      return null;
    }
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
            this.msg('ftzTransferSelf'),
            this.props.params.asnNo,
          ]}
        >
          <PageHeader.Actions>
            <PrivilegeCover module="cwm" feature="supervision" action="edit">
              {transfSelfReg.reg_status === CWM_SHFTZ_APIREG_STATUS.pending &&
                <Button icon="export" loading={submitting} onClick={this.handleTransToWhs}>???????????????</Button>}
            </PrivilegeCover>
            <Button icon="export" loading={submitting} onClick={this.handleSelfTransfExport}>??????</Button>
            <PrivilegeCover module="cwm" feature="supervision" action="edit">
              {transfSelfReg.reg_status === CWM_SHFTZ_APIREG_STATUS.processing &&
                <Button icon="close" loading={submitting} onClick={this.handleCancelReg}>??????</Button>}
              {transfSelfReg.reg_status === CWM_SHFTZ_APIREG_STATUS.processing &&
                transfSelfReg.ftz_ent_no &&
                <Button icon="export" loading={submitting} onClick={this.handleOwnTransferQuery}>?????????????????????ID</Button>}
            </PrivilegeCover>
          </PageHeader.Actions>
        </PageHeader>
        <Layout>
          <SidePanel top onCollapseChange={this.handleCollapseChange}>
            <Row style={{ padding: 16 }}>
              <Col span={12}>
                <FormItem label={this.msg('??????????????????')} {...formItemLayout}>
                  <EditableCell
                    value={transfSelfReg.owner_cus_code}
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
                <FormItem label={this.msg('????????????')} {...formItemLayout}>
                  <EditableCell
                    value={transfSelfReg.ftz_ent_no}
                    onSave={value => this.handleInfoSave('ftz_ent_no', value)}
                    editable={this.editPermission}
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={this.msg('??????????????????')} {...formItemLayout}>
                  <EditableCell
                    editable={false}
                    value={`${transfSelfReg.sender_cus_code || ''}|${transfSelfReg.sender_name || ''}`}
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={this.msg('????????????')} {...formItemLayout}>
                  <EditableCell
                    editable={false}
                    value={transfSelfReg.ftz_rel_no}
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={this.msg('???????????????')} {...formItemLayout}>
                  <EditableCell
                    editable={false}
                    value={transfSelfReg.sender_ftz_whse_code}
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={this.msg('????????????')} {...formItemLayout}>
                  <EditableCell
                    editable={false}
                    value={transfSelfReg.ftz_rel_date && moment(transfSelfReg.ftz_rel_date).format('YYYY.MM.DD HH:mm')}
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={this.msg('???????????????')} {...formItemLayout}><EditableCell
                  editable={false}
                  value={transfSelfReg.receiver_ftz_whse_code}
                /></FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={this.msg('????????????')} {...formItemLayout}>
                  <EditableCell
                    type="date"
                    value={transfSelfReg.ftz_ent_date && moment(transfSelfReg.ftz_ent_date).format('YYYY-MM-DD')}
                    onSave={value => this.handleInfoSave('ftz_ent_date', new Date(value))}
                    editable={this.editPermission}
                  />
                </FormItem>
              </Col>
            </Row>
            <Steps progressDot current={transfSelfReg.reg_status} className="progress-tracker">
              <Step title="?????????" />
              <Step title="????????????" />
              <Step title="?????????" />
            </Steps>
          </SidePanel>
          <Content className="page-content">
            <MagicCard bodyStyle={{ padding: 0 }}>
              <Tabs defaultActiveKey="transitDetails">
                <TabPane tab="????????????" key="transitDetails">
                  <DataPane
                    columns={this.columns}
                    rowSelection={rowSelection}
                    indentSize={8}
                    dataSource={details.data}
                    pagination={pagination}
                    rowKey="id"
                    loading={this.state.loading}
                  >
                    <DataPane.Toolbar>
                      <SearchBox value={this.props.transfSelfReg.filter.filterNo} placeholder={this.msg('searchPlaceholder')} onSearch={this.handleSearch} />
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
                </TabPane>
              </Tabs>
            </MagicCard>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
