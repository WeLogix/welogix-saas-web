import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import connectNav from 'client/common/decorators/connect-nav';
import { Button, Layout, Select, message, Menu, Icon, Modal } from 'antd';
import DataTable from 'client/components/DataTable';
import PageHeader from 'client/components/PageHeader';
import SearchBox from 'client/components/SearchBox';
import RowAction from 'client/components/RowAction';
import UserAvatar from 'client/components/UserAvatar';
import withPrivilege, { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import { TENANT_ASPECT, PARTNER_ROLES, PARTNER_BUSINESSE_TYPES } from 'common/constants';
import { toggleQuoteCreateModal, loadQuoteTable, deleteQuotes } from 'common/reducers/cmsQuote';
import { loadPartners } from 'common/reducers/partner';
import CreateQuoteModal from '../modals/createQuoteModal';
import { formatMsg } from '../message.i18n';

const { Content } = Layout;
const { Option } = Select;

@injectIntl
@connect(
  state => ({
    tenantId: state.account.tenantId,
    aspect: state.account.aspect,
    quotesList: state.cmsQuote.quotesList,
    listFilter: state.cmsQuote.listFilter,
    partners: state.partner.partners,
  }),
  {
    loadPartners,
    toggleQuoteCreateModal,
    loadQuoteTable,
    deleteQuotes,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'clearance',
  title: 'featCdmQuote',
})
@withPrivilege({ module: 'clearance', feature: 'billing' })
export default class RatesList extends Component {
  static propTypes = {
    tenantId: PropTypes.number.isRequired,
    intl: intlShape.isRequired,
    listFilter: PropTypes.shape({ viewStatus: PropTypes.string.isRequired }).isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    selectedRowKeys: [],
  }
  componentDidMount() {
    const filters = { ...this.props.listFilter };
    // if (!filters.viewStatus) {
    filters.viewStatus = this.props.aspect ? 'clientQuote' : 'providerQuote';
    // }
    this.props.loadQuoteTable({
      filter: JSON.stringify(filters),
      pageSize: this.props.quotesList.pageSize,
      current: 1,
    });
    const role = [PARTNER_ROLES.VEN];
    if (this.props.aspect === TENANT_ASPECT.LSP) {
      role.push(PARTNER_ROLES.CUS);
    }
    this.props.loadPartners({
      role,
      businessType: PARTNER_BUSINESSE_TYPES.clearance,
    });
  }
  msg = formatMsg(this.props.intl)
  dataSource = new DataTable.DataSource({
    fetcher: params => this.props.loadQuoteTable(params),
    resolve: result => result.data,
    getPagination: (result, resolve) => ({
      total: result.totalCount,
      current: resolve(result.totalCount, result.current, result.pageSize),
      showSizeChanger: true,
      showQuickJumper: false,
      pageSize: result.pageSize,
      showTotal: total => `共 ${total} 条`,
    }),
    getParams: (pagination, filters, sorter) => {
      const params = {
        pageSize: pagination.pageSize,
        current: pagination.current,
      };
      const filter = { ...this.props.listFilter, sortField: sorter.field, sortOrder: sorter.order };
      params.filter = JSON.stringify(filter);
      return params;
    },
    remotes: this.props.quotesList,
  })
  handleQuoteTableLoad = (currentPage, filter) => {
    const {
      listFilter,
      quotesList: { pageSize, current },
    } = this.props;
    this.props.loadQuoteTable({
      filter: JSON.stringify(filter || listFilter),
      pageSize,
      current: currentPage || current,
    }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      }
    });
  }
  handleTabChange = (key) => {
    if (key === this.props.listFilter.viewStatus) {
      return;
    }
    const filter = { ...this.props.listFilter, viewStatus: key };
    this.handleQuoteTableLoad(1, filter);
  }
  handleQuoteEdit = (row) => {
    this.context.router.push(`/clearance/billing/quote/${row.quote_no}`);
  }
  handleDeleteQuote = (quoteNo) => {
    this.props.deleteQuotes(quoteNo).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        this.handleDeselectRows();
        this.handleQuoteTableLoad();
        message.info(this.msg('deletedSucceed'), 5);
      }
    });
  }
  handleCreate = () => {
    const originQuoteData = {
      origin_quote_no: '',
      buyer_partner_id: '',
      seller_partner_id: '',
      quote_name: '',
      quote_type: this.props.listFilter.viewStatus === 'clientQuote' ? 'sales' : 'cost',
    };
    this.props.toggleQuoteCreateModal(true, originQuoteData);
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  handleSearch = (value) => {
    const filter = { ...this.props.listFilter, quoteSearch: value };
    this.handleQuoteTableLoad(1, filter);
  }
  handlePartnerChange = (partnerId) => {
    const filter = { ...this.props.listFilter, partnerId };
    this.handleQuoteTableLoad(1, filter);
  }
  handleRowMenuClick = (key, quoteNo) => {
    if (key === 'delete') {
      Modal.confirm({
        title: this.msg('deleteConfirm'),
        onOk: () => {
          this.handleDeleteQuote(quoteNo);
        },
      });
    }
  }
  columns = [
    {
      title: this.msg('quoteNo'),
      dataIndex: 'quote_no',
      width: 180,
    }, {
      title: this.msg('quoteName'),
      dataIndex: 'quote_name',
      width: 250,
    }, {
      title: this.props.listFilter.viewStatus === 'clientQuote' ? this.msg('buyerName') : this.msg('sellerName'),
      width: 250,
      render: (text, record) => {
        let partnerName = '';
        if (record.buyer_tenant_id === this.props.tenantId) {
          partnerName = record.seller_name;
        } else if (record.seller_tenant_id === this.props.tenantId) {
          partnerName = record.buyer_name;
        }
        return partnerName;
      },
    }, {
      title: this.msg('lastUpdatedBy'),
      dataIndex: 'last_updated_by',
      key: 'last_updated_by',
      width: 120,
      render: lid => lid && <UserAvatar size="small" loginId={lid} showName />,
    }, {
      title: this.msg('lastUpdatedDate'),
      dataIndex: 'last_updated_date',
      key: 'last_updated_date',
      width: 140,
      render: o => o && moment(o).format('YYYY.MM.DD HH:mm'),
    }, {
      title: this.msg('createdBy'),
      dataIndex: 'created_by',
      width: 120,
      render: lid => lid && <UserAvatar size="small" loginId={lid} showName />,
    }, {
      title: this.msg('createdDate'),
      dataIndex: 'created_date',
      width: 120,
      render: o => o && moment(o).format('YYYY.MM.DD HH:mm'),
    }, {
      dataIndex: 'SPACER_COL',
    }, {
      title: this.msg('opCol'),
      dataIndex: 'OPS_COL',
      fixed: 'right',
      className: 'table-col-ops',
      width: 120,
      render: (o, record) => {
        if (record.tenant_id === this.props.tenantId) {
          return (
            <span>
              <RowAction onClick={this.handleQuoteEdit} icon="edit" row={record} />
              <PrivilegeCover module="clearance" feature="billing" action="delete">
                <RowAction
                  overlay={
                    <Menu onClick={({ key }) => this.handleRowMenuClick(key, record.quote_no)}>
                      <Menu.Item key="delete"><Icon type="delete" />{this.msg('delete')}</Menu.Item>
                    </Menu>}
                />
              </PrivilegeCover>
            </span>
          );
        }
        return <RowAction onClick={this.handleQuoteEdit} icon="eye-o" row={record} />;
      },
    },
  ];
  render() {
    const {
      quotesList, listFilter, partners, aspect,
    } = this.props;
    this.dataSource.remotes = quotesList;
    const menus = [];
    if (aspect === TENANT_ASPECT.LSP) {
      menus.push({
        key: 'clientQuote',
        menu: this.msg('clientQuote'),
      });
    }
    menus.push({
      key: 'providerQuote',
      menu: this.msg('providerQuote'),
    });
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    let quotePartners = partners.filter(pt => pt.role === PARTNER_ROLES.VEN);
    let allPartnerLabel = '全部服务商';
    if (listFilter.viewStatus === 'clientQuote') {
      quotePartners = partners.filter(pt => pt.role === PARTNER_ROLES.CUS);
      allPartnerLabel = '全部客户';
    }
    const toolbarActions = (<span>
      <SearchBox value={listFilter.quoteSearch} placeholder={this.msg('quoteSearchTip')} key="quotesearch" onSearch={this.handleSearch} />
      <Select
        showSearch
        optionFilterProp="children"
        onChange={this.handlePartnerChange}
        value={listFilter.partnerId}
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: 360 }}
        key="partnersearch"
      >
        <Option value="all" key="all">{allPartnerLabel}</Option>
        {quotePartners.map(data => (<Option key={data.id} value={data.id}>{[data.partner_code, data.name].filter(dt => dt).join('|')}</Option>))}
      </Select>
    </span>);
    return (
      <Layout id="page-layout">
        <PageHeader
          menus={menus}
          currentKey={listFilter.viewStatus}
          onTabChange={this.handleTabChange}
        >
          <PageHeader.Actions>
            <PrivilegeCover module="clearance" feature="billing" action="create">
              <Button type="primary" icon="plus" onClick={this.handleCreate}>
                {this.msg('createQuote')}
              </Button>
            </PrivilegeCover>
          </PageHeader.Actions>
        </PageHeader>
        <Content className="page-content" key="main">
          <DataTable
            toolbarActions={toolbarActions}
            rowSelection={rowSelection}
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
            columns={this.columns}
            dataSource={this.dataSource}
            loading={quotesList.loading}
            rowKey="quote_no"
          />
        </Content>
        <CreateQuoteModal />
      </Layout>
    );
  }
}
