import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Layout, message, Input, Select, Tag } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import connectNav from 'client/common/decorators/connect-nav';
import PageHeader from 'client/components/PageHeader';
import DataTable from 'client/components/DataTable';
import RowAction from 'client/components/RowAction';
import { loadInvoicingKinds, toggleCreateModal, updateInvoicingKind, deleteInvoicingKind } from 'common/reducers/saasInvoicingKind';
import BSSSettingMenu from '../menu';
import CreateModal from './modal/createModal';
import { formatMsg } from '../message.i18n';

const { Content } = Layout;
const { Option } = Select;

@injectIntl
@connect(
  state => ({
    invoicingKindList: state.saasInvoicingKind.saasInvoicingKindList,
  }),
  {
    loadInvoicingKinds, toggleCreateModal, updateInvoicingKind, deleteInvoicingKind,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'bss',
  title: 'featBssSetting',
})
export default class TaxRates extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    editItem: {},
  }
  componentDidMount() {
    this.handleReload(1);
  }
  handleReload = (currentPage) => {
    const { invoicingKindList: { pageSize, current } } = this.props;
    this.props.loadInvoicingKinds({
      pageSize,
      current: currentPage || current,
    }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      }
    });
  }
  handleCreateTax = () => {
    this.props.toggleCreateModal(true);
  }
  msg = formatMsg(this.props.intl)
  itemsColumns = [{
    title: this.msg('invoicingCode'),
    dataIndex: 'invoicing_code',
    width: 80,
  }, {
    title: this.msg('invoicingType'),
    dataIndex: 'invoicing_type',
    width: 200,
    render: (o, record) => {
      if (this.state.editItem.id === record.id) {
        return (<Input
          size="small"
          value={this.state.editItem.invoicing_type}
          onChange={e => this.handleEditChange('invoicing_type', e.target.value)}
          style={{ width: '100%' }}
        />);
      }
      return o;
    },
  }, {
    title: this.msg('taxRates'),
    dataIndex: 'tax_rate',
    width: 100,
    render: (o, record) => {
      if (this.state.editItem.id === record.id) {
        return (<Input
          size="small"
          value={this.state.editItem.tax_rate}
          onChange={e => this.handleEditChange('tax_rate', e.target.value)}
          style={{ width: '100%' }}
        />);
      }
      return o;
    },
  }, {
    title: this.msg('invoiceCategory'),
    dataIndex: 'invoice_cat',
    width: 200,
    render: (o, record) => {
      if (['1', '2', '3', '4'].indexOf(record.invoicing_code) === -1 && this.state.editItem.id === record.id) {
        return (<Select
          value={this.state.editItem.invoice_cat}
          onChange={value => this.handleEditChange('invoice_cat', value)}
          style={{ width: '100%' }}
          optionFilterProp="children"
        >
          <Option key="VAT_S" value="VAT_S"><Tag color="green">增值税专用发票</Tag></Option>
          <Option key="VAT_N" value="VAT_N"><Tag>增值税普通发票</Tag></Option>
        </Select>);
      }
      if (o === 'VAT_S') {
        return <Tag color="green">增值税专用发票</Tag>;
      } else if (o === 'VAT_N') {
        return <Tag>增值税普通发票</Tag>;
      }
      return '';
    },
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    fixed: 'right',
    width: 90,
    render: (o, record) => {
      if (this.state.editItem.id === record.id) {
        return (<span>
          <RowAction onClick={this.handleTaxSave} icon="save" row={record} />
          <RowAction onClick={this.handleTaxEditCancel} icon="close" tooltip={this.msg('cancel')} />
        </span>
        );
      }
      if (['1', '2', '3', '4'].indexOf(record.invoicing_code) >= 0) {
        return (
          <RowAction onClick={this.handleEdit} icon="edit" row={record} />
        );
      }
      return (<span>
        <RowAction onClick={this.handleEdit} icon="edit" row={record} />
        <RowAction danger confirm={this.msg('delete')} onConfirm={this.handleDelete} icon="delete" row={record} />
      </span>
      );
    },
  }];
  handleEdit = (row) => {
    this.setState({
      editItem: row,
    });
  }
  handleTaxEditCancel = () => {
    this.setState({ editItem: {} });
  };
  handleEditChange = (field, value) => {
    this.setState({
      editItem: { ...this.state.editItem, [field]: value },
    });
  }
  handleTaxSave = () => {
    const item = this.state.editItem;
    this.props.updateInvoicingKind({
      id: item.id,
      invoicingCode: item.invoicing_code,
      invoicingType: item.invoicing_type,
      invoiceCat: item.invoice_cat,
      taxRate: item.tax_rate,
    }).then((result) => {
      if (!result.error) {
        this.handleReload();
      }
    });
    this.setState({
      editItem: {},
    });
  }
  handleDelete = (row) => {
    this.props.deleteInvoicingKind(row.id).then((result) => {
      if (!result.error) {
        this.handleReload(1);
      }
    });
  }
  render() {
    const dataSource = new DataTable.DataSource({
      fetcher: params => this.props.loadInvoicingKinds(params),
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
      remotes: this.props.invoicingKindList,
    });
    return (
      <Layout>
        <BSSSettingMenu currentKey="taxes" openKey="paramPrefs" />
        <Layout>
          <PageHeader title={this.msg('taxes')}>
            <PageHeader.Actions>
              <Button type="primary" icon="plus" onClick={this.handleCreateTax}>
                {this.msg('添加税率')}
              </Button>
            </PageHeader.Actions>
          </PageHeader>
          <Content className="page-content">
            <DataTable
              showToolbar={false}
              columns={this.itemsColumns}
              dataSource={dataSource}
              rowKey="id"
              noSetting
            />
            <CreateModal reload={this.handleReload} />
          </Content>
        </Layout>
      </Layout>
    );
  }
}
