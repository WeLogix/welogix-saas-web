import React, { Component } from 'react';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { toggleNewExRateModal, loadExRates, deleteExRate, alterExRateVal } from 'common/reducers/bssExRateSettings';
import DataTable from 'client/components/DataTable';
import RowAction from 'client/components/RowAction';
import EditableCell from 'client/components/EditableCell';
import CountryFlag from 'client/components/CountryFlag';
import { formatMsg } from '../message.i18n';


@injectIntl
@connect(
  state => ({
    visible: state.bssExRateSettings.visibleExRateModal,
    exRateList: state.bssExRateSettings.exRateList,
    currencies: state.saasParams.latest.currency,
  }),
  {
    toggleNewExRateModal, loadExRates, deleteExRate, alterExRateVal,
  }
)

export default class tenantExchangeRate extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  componentDidMount() {
    this.handleRateLoad();
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: '币种',
    dataIndex: 'currency',
    width: 200,
    render: (o) => {
      const currency = this.props.currencies.filter(cur => cur.curr_code === o)[0];
      return currency ? <span><CountryFlag code={o} currency /> {currency.curr_name}</span> : o;
    },
  }, {
    title: '本币',
    dataIndex: 'base_currency',
    width: 200,
    render: (o) => {
      const currency = this.props.currencies.filter(cur => cur.curr_code === o)[0];
      return currency ? <span><CountryFlag code={o} currency /> {currency.curr_name}</span> : o;
    },
  }, {
    title: '企业汇率',
    dataIndex: 'exchange_rate',
    width: 200,
    render: (o, record) =>
      <EditableCell size="small" value={o} onSave={value => this.handleAlter(record.id, 'exchange_rate', value)} btnPosition="right" />,
  }, {
    title: '更新时间',
    dataIndex: 'last_updated_date',
    width: 200,
    render: o => o && moment(o).format('YYYY.MM.DD'),
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    fixed: 'right',
    width: 120,
    render: (o, record) => (
      <RowAction danger confirm={this.msg('deleteConfirm')} onConfirm={this.handleDelete} icon="delete" row={record} />
    ),
  }]
  dataSource = new DataTable.DataSource({
    fetcher: params => this.props.loadExRates(params),
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
    remotes: this.props.exRateList,
  })
  handleCreateExRate = () => {
    this.props.toggleNewExRateModal(true);
  }
  handleAlter = (id, field, value) => {
    const change = {};
    change[field] = value;
    this.props.alterExRateVal({ id, change });
  }
  handleDelete = (row) => {
    this.props.deleteExRate(row.id).then((result) => {
      if (!result.error) {
        this.handleRateLoad();
      }
    });
  }
  handleRateLoad = () => {
    this.props.loadExRates({
      pageSize: this.props.exRateList.pageSize,
      current: this.props.exRateList.current,
    });
  }
  render() {
    const { exRateList } = this.props;
    this.dataSource.remotes = exRateList;
    return (
      <DataTable
        showToolbar={false}
        columns={this.columns}
        dataSource={this.dataSource}
        rowKey="id"
        noSetting
      />
    );
  }
}
