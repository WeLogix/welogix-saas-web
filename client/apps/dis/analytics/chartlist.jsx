import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { Card, Layout, Button, Icon, Menu, Checkbox, Radio, Row, Col, Empty, Pagination, Modal, message } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { toggleCreateAnalyticsModal, deleteAnalytics, loadAnalyticsList } from 'common/reducers/disAnalytics';
import { TRANS_MODES, INV_SHIPRECV_STATUS, CMS_DECL_STATUS, DECL_TYPE, CMS_DECL_CHANNEL, CMS_FEE_UNIT, CMS_DECL_TYPE, CMS_ENTRY_TYPE, CMS_BILL_TYPE, PARTNER_ROLES } from 'common/constants';
import { loadPartners } from 'common/reducers/partner';
import { loadPartnerFlowList } from 'common/reducers/scofFlow';
import connectNav from 'client/common/decorators/connect-nav';
import withPrivilege, { PrivilegeCover, hasPermission } from 'client/common/decorators/withPrivilege';
import DataTable from 'client/components/DataTable';
import SearchBox from 'client/components/SearchBox';
import RowAction from 'client/components/RowAction';
import UserAvatar from 'client/components/UserAvatar';
import PageHeader from 'client/components/PageHeader';
import ChartContainer from '../common/chartContainer';
import CreateAnalyticsModal from './modal/createAnalyticsModal';
import { formatMsg } from './message.i18n';
import './style.less';

const { Content } = Layout;

@injectIntl
@connect(
  state => ({
    analyticsList: state.disAnalytics.analyticsList,
    listFilter: state.disAnalytics.listFilter,
    whetherUpdate: state.disAnalytics.whetherUpdate,
    loading: state.disAnalytics.loading,
    chartParams: {
      certMark: state.saasParams.latest.certMark.map(item =>
        ({ value: item.cert_code, text: item.cert_spec })),
      ciqOrganization: state.saasParams.latest.ciqOrganization.map(item =>
        ({ value: item.org_code, text: item.org_name })),
      cnport: state.saasParams.latest.cnport.map(item =>
        ({ value: item.port_code, text: item.port_name })),
      cnregion: state.saasParams.latest.cnregion.map(item =>
        ({ value: item.region_code, text: item.region_name })),
      country: state.saasParams.latest.country.map(item =>
        ({ value: item.cntry_co, text: item.cntry_name_cn })),
      currency: state.saasParams.latest.currency.map(item =>
        ({ value: item.curr_code, text: item.curr_name })),
      customs: state.saasParams.latest.customs.map(item =>
        ({ value: item.customs_code, text: item.customs_name })),
      district: state.saasParams.latest.district.map(item =>
        ({ value: item.district_code, text: item.district_name })),
      origPlace: state.saasParams.latest.origPlace.map(item =>
        ({ value: item.place_code, text: item.place_name })),
      port: state.saasParams.latest.port.map(item =>
        ({ value: item.port_code, text: item.port_c_cod })),
      remissionMode: state.saasParams.latest.remissionMode.map(item =>
        ({ value: item.rm_mode, text: item.rm_abbr })),
      tradeMode: state.saasParams.latest.tradeMode.map(item =>
        ({ value: item.trade_mode, text: item.trade_abbr })),
      transMode: state.saasParams.latest.transMode.map(item =>
        ({ value: item.trans_code, text: item.trans_spec })),
      trxnMode: state.saasParams.latest.trxnMode.map(item =>
        ({ value: item.trx_mode, text: item.trx_spec })),
      unit: state.saasParams.latest.unit.map(item =>
        ({ value: item.unit_code, text: item.unit_name })),
      exemptionWay: state.saasParams.latest.exemptionWay.map(item =>
        ({ value: item.value, text: item.text })),
      wrapType: state.saasParams.latest.wrapType.map(item =>
        ({ value: item.value, text: item.text })),
      intlTransMode: TRANS_MODES,
      invShipRecv: INV_SHIPRECV_STATUS,
      ieflag: [{
        value: 1,
        text: '进口',
      }, {
        value: 2,
        text: '出口',
      }],
      inspectResultKind: [{
        value: 'released',
        text: '放行',
      }, {
        value: 'caught',
        text: '待处理',
      }],
      declStatus: Object.keys(CMS_DECL_STATUS).map(dsk => ({
        value: CMS_DECL_STATUS[dsk].value,
        text: CMS_DECL_STATUS[dsk].text,
      })),
      declWay: DECL_TYPE,
      declChannel: Object.keys(CMS_DECL_CHANNEL).map(dck => ({
        value: CMS_DECL_CHANNEL[dck].value,
        text: CMS_DECL_CHANNEL[dck].text,
      })),
      ediDeclType: CMS_DECL_TYPE,
      cdfFlag: CMS_ENTRY_TYPE,
      ftzFlag: CMS_BILL_TYPE,
      cmsIEFlag: [{
        value: 0,
        text: '进口',
      }, {
        value: 1,
        text: '出口',
      }],
      declFeeMark: CMS_FEE_UNIT,
      paasFlow: state.scofFlow.partnerFlows.map(fl => ({
        value: String(fl.id),
        text: fl.name,
      })),
      userMember: state.account.userMembers.map(member =>
        ({ value: member.login_id, text: member.name })),
      customer: state.partner.partners.filter(p => p.role === PARTNER_ROLES.CUS).map(p =>
        ({ value: p.id, text: [p.partner_code, p.name].filter(pt => pt).join('|') })),
      vendor: state.partner.partners.filter(p => p.role === PARTNER_ROLES.VEN).map(p =>
        ({ value: p.id, text: [p.partner_code, p.name].filter(pt => pt).join('|') })),
      supplier: state.partner.partners.filter(p => p.role === PARTNER_ROLES.SUP).map(p =>
        ({ value: p.id, text: p.partner_code || p.name })),
    },
    privileges: state.account.privileges,
  }),
  {
    toggleCreateAnalyticsModal,
    deleteAnalytics,
    loadAnalyticsList,
    loadPartners,
    loadPartnerFlowList,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'dis',
  title: 'featDisAnalytics',
})
@withPrivilege({ module: 'dis', feature: 'analytics', action: 'view' })
export default class ChartList extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    displayMode: 'chart',
    checkedList: [],
  }
  componentDidMount() {
    this.handleLoadDataSource();
    this.props.loadPartners();
    this.props.loadPartnerFlowList({ simple: true });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.whetherUpdate && !this.props.whetherUpdate) {
      this.handleLoadDataSource();
    }
  }
  msg = formatMsg(this.props.intl)
  editPermission = hasPermission(this.props.privileges, {
    module: 'dis', feature: 'analytics', action: 'edit',
  });
  deletePermission = hasPermission(this.props.privileges, {
    module: 'dis', feature: 'analytics', action: 'delete',
  });
  columns = [{
    title: '图表名称',
    dataIndex: 'dana_chart_name',
    width: 150,
    render: (o, row) => (
      <a onClick={() => this.handleViewChart(row)}>{o}</a>
    ),
  }, {
    title: '数据主题',
    width: 150,
    dataIndex: 'dana_chart_subject',
  }, {
    title: '最后更新时间',
    width: 200,
    dataIndex: 'last_updated_date',
    render: o => o && moment(o).format('YYYY-MM-DD HH:MM'),
  }, {
    title: '创建时间',
    width: 200,
    dataIndex: 'created_date',
    render: o => moment(o).format('YYYY-MM-DD HH:MM'),
  }, {
    title: '创建人',
    width: 150,
    dataIndex: 'created_by',
    render: loginId => <UserAvatar size="small" loginId={loginId} showName />,
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: '操作',
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    fixed: 'right',
    width: 120,
    render: (o, row) => {
      const menus = [];
      if (this.editPermission) {
        menus.push(
          <Menu.Item key="rename">重命名</Menu.Item>,
          <Menu.Item key="share">共享</Menu.Item>
        );
      }
      if (this.deletePermission) {
        menus.push(<Menu.Item key="delete">删除</Menu.Item>);
      }
      let menuEntry;
      if (menus.length > 0) {
        menuEntry = (<Menu onClick={({ key }) => this.handleMenuClick(key, row)}>{menus}</Menu>);
      }
      return (<span>
        <PrivilegeCover module="dis" feature="analytics" action="edit">
          <RowAction icon="setting" onClick={this.handleSetChart} label="配置" row={row} />
        </PrivilegeCover>
        {menuEntry && <RowAction overlay={menuEntry} />}
      </span>);
    },
  }]
  handleViewChart = (chartInfo) => {
    this.context.router.push(`/dis/analytics/chart/${chartInfo.dana_chart_uid}`);
  }
  handleLoadDataSource = (currentParam, pageSizeParam, paramFilter) => {
    const filter = paramFilter || this.props.listFilter;
    const current = currentParam || this.props.analyticsList.current;
    let pageSize;
    let { chartPageSize } = this.props.analyticsList;
    if (this.state.displayMode !== 'chart') {
      chartPageSize = undefined;
      pageSize = pageSizeParam || this.props.analyticsList.pageSize;
    }
    this.props.loadAnalyticsList(current, pageSize, chartPageSize, filter);
  }
  handleToggleDisplayMode = (ev) => {
    this.setState({ displayMode: ev.target.value, checkedList: [] });
  }
  handleShowCreateAnalytics = (chartInfo) => {
    this.props.toggleCreateAnalyticsModal(true, chartInfo);
  }
  handleSearch = (value) => {
    const paramFilter = { ...this.props.listFilter, filterNo: value };
    this.handleLoadDataSource(null, null, paramFilter);
  }
  handleMenuClick = (key, row) => {
    if (key === 'rename') {
      this.handleRenameChart(row);
    } else if (key === 'share') {
      this.handleShareChart(row.dana_chart_uid);
    } else if (key === 'delete') {
      this.handleDeleteChart([row.dana_chart_uid]);
    }
  }
  handleSetChart = (chart) => {
    if (this.editPermission) {
      this.context.router.push(`/dis/analytics/edit/${chart.dana_chart_uid}`);
    } else {
      message.warn('暂无权限', 3);
    }
  }
  handleShareChart = () => {
    // do sth
  }
  handleDeleteChart = (uids) => {
    Modal.confirm({
      title: '是否确认删除分析图表?',
      onOk: () => {
        this.props.deleteAnalytics(uids);
      },
    });
  }
  handleBatchDeleteCharts = () => {
    this.handleDeleteChart(this.state.checkedList);
    this.handleDeselect();
  }
  handleRenameChart = (chartItem) => {
    if (this.editPermission) {
      this.handleShowCreateAnalytics({
        chart_uid: chartItem.dana_chart_uid,
        chart_name: chartItem.dana_chart_name,
      });
    } else {
      message.warn('暂无权限', 3);
    }
  }
  handleCheckedChange = (checkedValues) => {
    this.setState({ checkedList: checkedValues });
  }
  handleDeselect = () => {
    this.setState({ checkedList: [] });
  }
  render() {
    const {
      analyticsList, listFilter, loading, chartParams,
    } = this.props;
    const { displayMode, checkedList } = this.state;
    const rowSelection = {
      selectedRowKeys: checkedList,
      onChange: (selectedRowKeys) => {
        this.setState({ checkedList: selectedRowKeys });
      },
    };
    const toolbarActions = [<SearchBox placeholder="搜索图表" onSearch={this.handleSearch} value={listFilter.filterNo} key="search" />];
    const toolbarExtra = (<Radio.Group
      value={displayMode}
      buttonStyle="solid"
      onChange={this.handleToggleDisplayMode}
    >
      <Radio.Button value="chart">
        <Icon type="appstore" />
      </Radio.Button>
      <Radio.Button value="table">
        <Icon type="table" />
      </Radio.Button>
    </Radio.Group>);
    const bulkActions = (<span>
      <PrivilegeCover module="dis" feature="analytics" action="delete">
        <Button type="danger" onClick={this.handleBatchDeleteCharts}>删除</Button>
      </PrivilegeCover>
      <PrivilegeCover module="dis" feature="analytics" action="edit">
        <Button onClick={() => {}}>共享</Button>
      </PrivilegeCover>
    </span>);
    const menus = [];
    if (this.editPermission) {
      menus.push(<Menu.Item key="rename">重命名</Menu.Item>);
      menus.push(<Menu.Item key="share">共享</Menu.Item>);
    }
    if (this.deletePermission) {
      menus.push(<Menu.Item key="delete">删除</Menu.Item>);
    }
    let analyticContent = <Empty />;
    if (displayMode === 'chart') {
      if (analyticsList.data.length > 0) {
        analyticContent = (<Card
          size="small"
          title={toolbarActions}
          extra={toolbarExtra}
          loading={loading}
          bodyStyle={{ padding: 24 }}
        >
          <Checkbox.Group style={{ width: '100%' }} onChange={this.handleCheckedChange} value={checkedList}>
            <Row gutter={24}>
              {analyticsList.data.map(item => (
                <Col span={8} key={item.dana_chart_name}>
                  <Card
                    hoverable
                    title={<a onClick={() => this.handleViewChart(item)}>{item.dana_chart_name}</a>}
                    headStyle={{ borderBottom: 'none', paddingLeft: 16, paddingRight: 16 }}
                    bodyStyle={{ padding: 8 }}
                    extra={[
                      <RowAction icon="setting" tooltip={this.msg('configChart')} onClick={this.handleSetChart} row={item} key="config" />,
                      <RowAction
                        icon="ellipsis"
                        overlay={<Menu onClick={({ key }) => this.handleMenuClick(key, item)}>
                          {menus}</Menu>}
                        key="more"
                      />,
                    ]}
                    style={{ position: 'relative', overflow: 'hidden' }}
                  >
                    <div onClick={() => this.handleViewChart(item)}>
                      <ChartContainer
                        chartUid={item.dana_chart_uid}
                        chartParams={chartParams}
                        thumbnailMode
                      />
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
          <Card.Meta title={<Pagination
            style={{ float: 'right' }}
            size="small"
            hideOnSinglePage
            onChange={this.handleLoadDataSource}
            total={analyticsList.totalCount}
            current={analyticsList.current}
            defaultPageSize={analyticsList.chartPageSize}
          />}
          />
        </Card>);
      }
    } else {
      const dataSource = new DataTable.DataSource({
        fetcher: params => this.handleLoadDataSource(params.current, params.pageSize),
        resolve: result => result.data,
        getPagination: (result, resolve) => ({
          total: result.totalCount,
          current: resolve(result.totalCount, result.current, result.pageSize),
          showSizeChanger: true,
          showQuickJumper: false,
          pageSize: result.pageSize,
          showTotal: total => `共 ${total} 条`,
        }),
        getParams: (pagination) => {
          const params = {
            pageSize: pagination.pageSize,
            current: pagination.current,
          };
          return params;
        },
        remotes: analyticsList,
      });
      analyticContent = (
        <DataTable
          columns={this.columns}
          dataSource={dataSource}
          toolbarActions={toolbarActions}
          toolbarExtra={toolbarExtra}
          bulkActions={bulkActions}
          selectedRowKeys={checkedList}
          onDeselectRows={this.handleDeselect}
          rowSelection={rowSelection}
          rowKey="dana_chart_uid"
          loading={loading}
        />
      );
    }
    return (
      <Layout>
        <PageHeader>
          <PageHeader.Actions>
            <PrivilegeCover module="dis" feature="analytics" action="create">
              <Button type="primary" onClick={() => this.handleShowCreateAnalytics()} icon="plus">新建图表</Button>
            </PrivilegeCover>
          </PageHeader.Actions>
        </PageHeader>
        <Content className="page-content">
          {analyticContent}
        </Content>
        <CreateAnalyticsModal />
      </Layout>
    );
  }
}
