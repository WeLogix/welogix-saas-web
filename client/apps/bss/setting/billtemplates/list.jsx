import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Layout, message } from 'antd';
import { PARTNER_ROLES } from 'common/constants';
import { loadPartners } from 'common/reducers/partner';
import { loadBillTemplates, toggleNewTemplateModal, deleteBillTemplates } from 'common/reducers/bssBillTemplate';
import connectNav from 'client/common/decorators/connect-nav';
import DataTable from 'client/components/DataTable';
import PageHeader from 'client/components/PageHeader';
import SearchBox from 'client/components/SearchBox';
import RowAction from 'client/components/RowAction';
import { intlShape, injectIntl } from 'react-intl';
import BSSSettingMenu from '../menu';
import { formatMsg } from '../message.i18n';
import CreateTemplateModal from './modals/createTemplateModal';

const { Content } = Layout;

@injectIntl
@connect(
  state => ({
    billTemplatelist: state.bssBillTemplate.billTemplatelist,
    listFilter: state.bssBillTemplate.templateListFilter,
    reload: state.bssBillTemplate.templatesReload,
  }),
  {
    toggleNewTemplateModal, loadBillTemplates, loadPartners, deleteBillTemplates,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'bss',
  title: 'featBssSetting',
})
export default class BillTemplates extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    this.handleTemplatesLoad(1);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.reload) {
      this.handleTemplatesLoad();
    }
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('name'),
    dataIndex: 'name',
    width: 200,
  }, {
    title: this.msg('往来单位'),
    dataIndex: 'settle_name',
    width: 200,
  }, {
    title: this.msg('账单开始日'),
    dataIndex: 'bill_start_date',
    width: 120,
  }, {
    title: this.msg('账期(月)'),
    dataIndex: 'bill_term',
    width: 120,
  }, {
    title: this.msg('对账日'),
    dataIndex: 'reconcile_date',
    width: 150,
  }, {
    title: this.msg('结款日'),
    dataIndex: 'payment_date',
    width: 150,
    // render: o => o && moment(o).format('YYYY-MM-DD'),
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    fixed: 'right',
    width: 90,
    render: (o, record) => (<span>
      <RowAction onClick={this.handleEdit} icon="edit" row={record} />
      <RowAction onDelete={this.handleDelete} row={record} />
    </span>
    ),
  }]
  dataSource = new DataTable.DataSource({
    fetcher: params => this.props.loadBillTemplates(params),
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
    remotes: this.props.billTemplatelist,
  })
  handleCreateTemplate = () => {
    this.props.toggleNewTemplateModal(true);
    this.props.loadPartners({
      role: [PARTNER_ROLES.VEN, PARTNER_ROLES.CUS],
    });
  }
  handleTemplatesLoad = (currentPage, filter) => {
    const { listFilter, billTemplatelist: { pageSize, current } } = this.props;
    this.props.loadBillTemplates({
      filter: JSON.stringify(filter || listFilter),
      pageSize,
      current: currentPage || current,
    }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      }
    });
  }
  handleSearch = (value) => {
    const filter = { ...this.props.listFilter, searchText: value };
    this.handleTemplatesLoad(1, filter);
  }
  handleEdit = (row) => {
    const link = `/bss/setting/billtemplates/${row.id}/fees`;
    this.context.router.push(link);
  }
  handleDelete = (row) => {
    this.props.deleteBillTemplates({ ids: [row.id] }).then((result) => {
      if (!result.error) {
        this.handleTemplatesLoad(1);
      }
    });
  }
  render() {
    const { billTemplatelist } = this.props;
    this.dataSource.remotes = billTemplatelist;
    return (
      <Layout>
        <BSSSettingMenu currentKey="billTemplates" openKey="paramPrefs" />
        <Layout id="page-layout">
          <PageHeader title={this.msg('billTemplates')}>
            <PageHeader.Actions>
              <Button type="primary" icon="plus" onClick={this.handleCreateTemplate}>
                {this.msg('newBillTemplate')}
              </Button>
            </PageHeader.Actions>
          </PageHeader>
          <Content className="page-content" key="main">
            <DataTable
              toolbarActions={<SearchBox value={this.props.listFilter.searchText} placeholder={this.msg('templateSearchTips')} onSearch={this.handleSearch} />}
              columns={this.columns}
              dataSource={this.dataSource}
              rowKey="id"
              noSetting
            />
          </Content>
          <CreateTemplateModal />
        </Layout>
      </Layout>
    );
  }
}
