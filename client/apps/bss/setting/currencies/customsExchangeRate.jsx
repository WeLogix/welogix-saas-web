import React, { Component } from 'react';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { loadCustomsExchangeList, toggleCusExchangeHistoryModal } from 'common/reducers/bssExRateSettings';
import DataTable from 'client/components/DataTable';
import RowAction from 'client/components/RowAction';
import CountryFlag from 'client/components/CountryFlag';
import { formatMsg } from '../message.i18n';


@injectIntl
@connect(
  state => ({
    customsExchangeList: state.bssExRateSettings.customsExchangeList,
  }),
  { loadCustomsExchangeList, toggleCusExchangeHistoryModal }
)

export default class CustomsExchangeRate extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  componentDidMount() {
    this.handleRateLoad();
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('currCode'),
    dataIndex: 'curr_code',
    width: 200,
    render: (o, record) => <span><CountryFlag code={o} currency /> {record.curr_name}</span>,
  }, {
    title: this.msg('customsExRates'),
    dataIndex: 'rate_cny',
    width: 200,
  }, {
    title: this.msg('publishDate'),
    dataIndex: 'publish_date',
    width: 120,
  }, {
    title: this.msg('effectDate'),
    dataIndex: 'effect_date',
    width: 150,
    render: o => o && moment(o).format('YYYY-MM-DD'),
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    fixed: 'right',
    width: 120,
    render: (o, record) => (
      <RowAction onClick={this.handleRatesHistory} icon="line-chart" row={record} />
    ),
  }]
  dataSource = new DataTable.DataSource({
    fetcher: params => this.props.loadCustomsExchangeList(params),
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
    remotes: this.props.customsExchangeList,
  })
  handleRateLoad = () => {
    this.props.loadCustomsExchangeList({
      pageSize: this.props.customsExchangeList.pageSize,
      current: this.props.customsExchangeList.current,
    });
  }
  handleRatesHistory = (row) => {
    this.props.toggleCusExchangeHistoryModal(true, row.curr_code, row.curr_name);
  }
  render() {
    const { customsExchangeList } = this.props;
    this.dataSource.remotes = customsExchangeList;
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
