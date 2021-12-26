import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';
import { Badge, Layout, Col, Form, Row, Tabs, Steps, Button, Tag } from 'antd';
import connectNav from 'client/common/decorators/connect-nav';
import SidePanel from 'client/components/SidePanel';
import PageHeader from 'client/components/PageHeader';
import MagicCard from 'client/components/MagicCard';
import EditableCell from 'client/components/EditableCell';
import SearchBox from 'client/components/SearchBox';
import DataPane from 'client/components/DataPane';
import Summary from 'client/components/Summary';
import { loadNormalDelg, loadDeclRelDetails, loadDeclRelStat } from 'common/reducers/cwmShFtz';
import { DELG_STATUS } from 'common/constants';
import { formatMsg } from '../../message.i18n';

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
@connect(state => ({
  normalDecl: state.cwmShFtz.normalDecl,
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
}), {
  loadNormalDelg, loadDeclRelDetails, loadDeclRelStat,
})

@connectNav({
  depth: 3,
  moduleName: 'cwm',
  title: 'featCwmShftz',
  jumpOut: true,
})
export default class NormalDeclDetail extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    listFilterNo: '',
    selectedRowKeys: [],
  }
  componentDidMount() {
    const { clearanceNo } = this.props.params;
    this.props.loadNormalDelg(clearanceNo);
    this.props.loadDeclRelDetails(clearanceNo);
    this.props.loadDeclRelStat(clearanceNo);
  }
  msg = formatMsg(this.props.intl)
  regColumns = [{
    title: '出区提货单号',
    dataIndex: 'ftz_rel_no',
    width: 180,
  }, {
    title: 'SO编号',
    dataIndex: 'so_no',
    width: 250,
  }, {
    title: '供货商',
    dataIndex: 'supplier',
  }, {
    title: '成交方式',
    dataIndex: 'trxn_mode',
    render: o => renderCombineData(o, this.props.trxnMode),
  }, {
    title: '币制',
    dataIndex: 'currency',
    render: o => renderCombineData(o, this.props.currency),
  }]
  columns = [{
    title: '出区提货单号',
    dataIndex: 'ftz_rel_no',
    width: 180,
  }, {
    title: '商品货号',
    dataIndex: 'product_no',
    width: 150,
  }, {
    title: '商品编号',
    dataIndex: 'hscode',
    width: 120,
  }, {
    title: '中文品名',
    dataIndex: 'g_name',
    width: 150,
  }, {
    title: '规格型号',
    dataIndex: 'model',
    width: 240,
  }, {
    title: '原产国',
    dataIndex: 'country',
    width: 150,
    render: o => renderCombineData(o, this.props.country),
  }, {
    title: '单位',
    dataIndex: 'out_unit',
    width: 100,
    render: o => renderCombineData(o, this.props.unit),
  }, {
    title: '数量',
    width: 100,
    dataIndex: 'qty',
  }, {
    title: '毛重',
    width: 100,
    dataIndex: 'gross_wt',
  }, {
    title: '净重',
    width: 100,
    dataIndex: 'net_wt',
  }, {
    title: '金额',
    width: 100,
    dataIndex: 'amount',
  }, {
    title: '币制',
    width: 100,
    dataIndex: 'currency',
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
    dataIndex: 'freight',
    width: 100,
  }, {
    title: '运费币制',
    dataIndex: 'freight_currency',
    width: 100,
    render: o => renderCombineData(o, this.props.currency),
  }, {
    title: '目的国',
    dataIndex: 'dest_country',
    width: 150,
    render: o => renderCombineData(o, this.props.country),
  }]
  handleDelgManifest = () => {
    const decl = this.props.normalDecl;
    const link = '/clearance/delegation/manifest/';
    this.context.router.push(`${link}${decl.delg_no}`);
  }
  handleLoadDeclDetails = (currentParam, pageSizeParam, filterParam) => {
    const { params: { clearanceNo }, details: { current, pageSize }, declRelFilter } = this.props;
    const currentPage = currentParam || current;
    const currentSize = pageSizeParam || pageSize;
    const currentFilter = JSON.stringify(filterParam || declRelFilter);
    this.props.loadDeclRelDetails(clearanceNo, currentPage, currentSize, currentFilter);
  }
  handleListSearch = (searchText) => {
    this.setState({ listFilterNo: searchText });
  }
  handleDetailsSearch = (searchText) => {
    const filter = { filterNo: searchText };
    this.handleLoadDeclDetails(1, null, filter);
  }
  handleDetailsPageChange = (page, size) => {
    this.handleLoadDeclDetails(page, size);
  }
  render() {
    const {
      normalDecl, trxnMode, regs, details, entryTotalValue,
    } = this.props;
    const { listFilterNo } = this.state;
    if (!details) return null;
    let filterRegs = regs;
    if (listFilterNo) {
      filterRegs = regs.filter((item) => {
        const reg = new RegExp(listFilterNo);
        return reg.test(item.ftz_rel_no) || reg.test(item.so_no);
      });
    }
    const mode = trxnMode.filter(cur => cur.value === normalDecl.trxn_mode)[0];
    let declStatusText;
    let declStep;
    if (normalDecl.status <= DELG_STATUS.undeclared) {
      declStatusText = '制单中';
      declStep = 0;
    } else if (normalDecl.status === DELG_STATUS.declared) {
      declStatusText = '已申报';
      declStep = 1;
    } else if (normalDecl.status === DELG_STATUS.finished) {
      declStatusText = '已放行';
      declStep = 2;
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
      onChange: this.handleDetailsPageChange,
      showTotal: total => `共 ${total} 条`,
    };
    return (
      <Layout>
        <PageHeader
          breadcrumb={[
            this.msg('ftzNormalDecl'),
            this.props.params.clearanceNo,
          ]}
        >
          <PageHeader.Nav>
            <Button icon="link" onClick={this.handleDelgManifest}>关联报关清单 <Badge status="default" text={declStatusText} /></Button>
          </PageHeader.Nav>
          <PageHeader.Actions />
        </PageHeader>
        <Layout>
          <SidePanel top onCollapseChange={this.handleCollapseChange}>
            <Row style={{ padding: 16 }}>
              <Col span={6}>
                <FormItem label={this.msg('提货单位')} {...formItemLayout}>
                  <EditableCell
                    editable={false}
                    value={normalDecl.owner_name}
                  />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('报关企业')} {...formItemLayout}>
                  <EditableCell
                    editable={false}
                    value={normalDecl.customs_name}
                  /></FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('成交方式')} {...formItemLayout}>
                  <EditableCell
                    editable={false}
                    value={mode && `${mode.value}| ${mode.text}`}
                  />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label={this.msg('备案时间')} {...formItemLayout}>
                  <EditableCell
                    editable={false}
                    value={normalDecl.reg_date && moment(normalDecl.reg_date).format('YYYY.MM.DD HH:mm')}
                  />
                </FormItem>
              </Col>
            </Row>
            <Steps progressDot current={declStep} className="progress-tracker">
              <Step title="委托制单" />
              <Step title="已申报" />
              <Step title="报关放行" />
            </Steps>
          </SidePanel>
          <Content className="page-content">
            <MagicCard bodyStyle={{ padding: 0 }}>
              <Tabs defaultActiveKey="details">
                <TabPane tab="提货单列表" key="list">
                  <DataPane
                    columns={this.regColumns}
                    indentSize={8}
                    dataSource={filterRegs}
                    rowKey="ftz_rel_no"
                  >
                    <DataPane.Toolbar>
                      <SearchBox placeholder={this.msg('searchRelDeclPlaceholder')} onSearch={this.handleListSearch} />
                    </DataPane.Toolbar>
                  </DataPane>
                </TabPane>
                <TabPane tab="出库报关明细" key="details">
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
                      <SearchBox placeholder={this.msg('searchPlaceholder')} onSearch={this.handleDetailsSearch} />
                      <DataPane.Extra>
                        <Summary>
                          <Summary.Item label="总数量" addonAfter="KG">{entryTotalValue.total_qty}</Summary.Item>
                          <Summary.Item label="总净重" addonAfter="KG">{entryTotalValue.total_net_wt.toFixed(3)}</Summary.Item>
                          <Summary.Item label="总毛重" addonAfter="KG">{entryTotalValue.total_gross_wt.toFixed(3)}</Summary.Item>
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
