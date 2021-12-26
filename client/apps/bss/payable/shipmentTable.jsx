import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import connectFetch from 'client/common/decorators/connect-fetch';
import { Button, DatePicker, message } from 'antd';
import DataTable from 'client/components/DataTable';
import RowAction from 'client/components/RowAction';
import { loadAudits, confirmAudits, redoAudits } from 'common/reducers/bssAudit';
import SearchBox from 'client/components/SearchBox';
import { formatMsg } from './message.i18n';

const { RangePicker } = DatePicker;

@connectFetch()()
@injectIntl
@connect(
  state => ({
    partners: state.partner.partners,
    auditslist: state.bssAudit.auditslist,
    listFilter: state.bssAudit.listFilter,
    loading: state.bssAudit.loading,
  }),
  {
    loadAudits, confirmAudits, redoAudits,
  }
)
export default class ShipmentTable extends React.Component {
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
    // this.handleAuditsLoad(1);
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: '结算状态',
    width: 100,
    dataIndex: 'status',
    align: 'center',
    filters: [{
      text: '未结清',
      value: 'open',
    }, {
      text: '已结清',
      value: 'cleared',
    }],
  }, {
    title: '货运编号',
    dataIndex: 'sof_order_no',
    width: 180,
  }, {
    title: '费用金额',
    dataIndex: 'payable_amount',
    align: 'right',
    width: 150,
  }, {
    title: '代付金额',
    dataIndex: 'other_amount',
    align: 'right',
    width: 150,
  }, {
    title: '已核销金额',
    dataIndex: 'cleared_amount',
    align: 'right',
    width: 150,
  }, {
    title: '应结款余额',
    dataIndex: 'payable_balance',
    align: 'right',
    width: 150,
    render: o => ((o < 0) ? <span className="text-error">{o}</span> : o),
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    fixed: 'right',
    width: 90,
    render: (o, record) => {
      if (record.status === 1) {
        return (<span>
          <RowAction icon="stop" onClick={this.handleConfirm} tooltip={this.msg('block')} row={record} />
          <RowAction icon="eye-o" onClick={this.handleDetail} tooltip={this.msg('view')} row={record} />
        </span>);
      } else if (record.status === 2) {
        return (<span>
          <RowAction icon="close-circle-o" onClick={this.handleReturn} tooltip={this.msg('return')} row={record} />
          <RowAction icon="eye-o" onClick={this.handleDetail} tooltip={this.msg('view')} row={record} />
        </span>);
      }
      return (<RowAction icon="eye-o" onClick={this.handleDetail} tooltip={this.msg('view')} row={record} />);
    },
  }]
  dataSource = new DataTable.DataSource({
    fetcher: params => this.props.loadAudits(params),
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
      const filter = {
        ...this.props.listFilter,
      };
      params.filter = JSON.stringify(filter);
      return params;
    },
    remotes: this.props.auditslist,
  })

  handleAuditsLoad = (currentPage, filter) => {
    const { listFilter, auditslist: { pageSize, current } } = this.props;
    this.props.loadAudits({
      filter: JSON.stringify(filter || listFilter),
      pageSize,
      current: currentPage || current,
    }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        this.handleDeselectRows();
      }
    });
  }
  handleFilterMenuClick = (key) => {
    const filter = { ...this.props.listFilter, status: key };
    this.handleAuditsLoad(1, filter);
  }
  handleSearch = (value) => {
    const filter = { ...this.props.listFilter, searchText: value };
    this.handleAuditsLoad(1, filter);
  }
  handleDateRangeChange = (data, dataString) => {
    const filter = { ...this.props.listFilter, startDate: dataString[0], endDate: dataString[1] };
    this.handleAuditsLoad(1, filter);
  }
  handleClientSelectChange = (ev) => {
    const filters = { ...this.props.listFilter, clientPid: ev.key };
    this.handleAuditsLoad(1, filters);
  }
  handleConfirmAudits = (sofOrderNos) => {
    this.props.confirmAudits(sofOrderNos).then((result) => {
      if (!result.error) {
        this.handleAuditsLoad(1);
      }
    });
  }
  handleConfirm = (row) => {
    const sofOrderNos = [row.sof_order_no];
    this.handleConfirmAudits(sofOrderNos);
  }
  handleBatchConfirm = () => {
    const sofOrderNos = this.state.selectedRowKeys;
    this.handleConfirmAudits(sofOrderNos);
  }
  handleAllConfirm = () => {
    const sofOrderNos = null;
    this.handleConfirmAudits(sofOrderNos);
  }
  handleReturn = (row) => {
    this.props.redoAudits([row.sof_order_no]).then((result) => {
      if (!result.error) {
        this.handleAuditsLoad(1);
      }
    });
  }
  handleBatchReturn = () => {
    const sofOrderNos = this.state.selectedRowKeys;
    this.props.redoAudits(sofOrderNos).then((result) => {
      if (!result.error) {
        this.handleAuditsLoad(1);
      }
    });
  }
  handleDetail = (row) => {
    const link = `/bss/receivable/${row.sof_order_no}`;
    this.context.router.push(link);
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  render() {
    const { auditslist, loading } = this.props;
    const { status } = this.props.listFilter;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    this.dataSource.remotes = auditslist;
    const toolbarActions = (<span>
      <SearchBox value={this.props.listFilter.searchText} placeholder={this.msg('searchTips')} onSearch={this.handleSearch} />
      <RangePicker
        ranges={{ 当天: [moment(), moment()], 当月: [moment().startOf('month'), moment()] }}
        onChange={this.handleDateRangeChange}
      />
    </span>);
    const bulkActions = status === 'submitted' && (<span>
      <Button icon="check-circle-o" onClick={this.handleBatchConfirm}>付款申请</Button>
      <Button icon="check-circle-o" onClick={this.handleBatchConfirm}>冻结</Button>
      <Button icon="close-circle-o" onClick={this.handleBatchReturn}>取消冻结</Button>
    </span>);
    return (
      <DataTable
        toolbarActions={toolbarActions}
        // toolbarExtra={<Button icon="security-scan">审计</Button>}
        bulkActions={bulkActions}
        selectedRowKeys={this.state.selectedRowKeys}
        onDeselectRows={this.handleDeselectRows}
        columns={this.columns}
        dataSource={this.dataSource}
        rowSelection={rowSelection}
        rowKey="sof_order_no"
        loading={loading}
      />
    );
  }
}
