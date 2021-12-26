import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Popover, Table, Tooltip } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { loadTraceTransactions } from 'common/reducers/cwmTransaction';
import RowAction from 'client/components/RowAction';
import { CWM_TRANSACTIONS_TYPE } from 'common/constants';
import { formatMsg } from '../../message.i18n';

@injectIntl
@connect(
  () => ({
  }),
  { loadTraceTransactions }
)
export default class TraceIdPopover extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    traceId: PropTypes.string.isRequired,
  }
  state = {
    visible: false,
    loading: true,
    dataSource: [],
  }
  msg = formatMsg(this.props.intl)
  column = [{
    title: this.msg('transactionType'),
    width: 80,
    dataIndex: 'type',
    align: 'center',
    render: type => <span className="text-emphasis">{CWM_TRANSACTIONS_TYPE[type].text}</span>,
  }, {
    title: this.msg('transactionQty'),
    width: 80,
    dataIndex: 'transaction_qty',
    align: 'right',
    render: (text) => {
      if (text > 0) {
        return <span className="text-success">+{text}</span>;
      }
      return <span className="text-warning">{text}</span>;
    },
  }, {
    title: this.msg('transactionTimestamp'),
    width: 150,
    dataIndex: 'transaction_timestamp',
    render: traxTime => traxTime && moment(traxTime).format('YYYY.MM.DD HH:mm'),
    sorter: (a, b) => a.transaction_timestamp - b.transaction_timestamp,
  }, {
    title: this.msg('location'),
    width: 100,
    dataIndex: 'location',
  }, {
    title: this.msg('traceId'),
    width: 180,
    dataIndex: 'trace_id',
  }, {
    title: this.msg('divertTraceId'),
    width: 180,
    dataIndex: 'divert_trace_id',
  }, {
    title: this.msg('refOrderNo'),
    width: 180,
    dataIndex: 'ref_order_no',
    render: (o, record) => {
      if (o) {
        return <Tooltip title={record.transaction_no}>{o}</Tooltip>;
      }
      return record.transaction_no;
    },
  }, {
    title: this.msg('reason'),
    width: 100,
    dataIndex: 'reason',
    className: 'text-normal',
  }]
  handleVisibleChange = (visible) => {
    this.setState({ visible });
    if (visible) {
      this.props.loadTraceTransactions(this.props.traceId).then((result) => {
        if (!result.error) {
          this.setState({
            dataSource: result.data,
            loading: false,
          });
        }
      });
    }
  }
  render() {
    const { traceId } = this.props;
    const { dataSource } = this.state;
    const content = (
      <div style={{ width: 1080 }}>
        <Table size="small" columns={this.column} dataSource={dataSource} loading={this.state.loading} rowKey="id" pagination={{ defaultPageSize: 10, hideOnSinglePage: true }} />
      </div>
    );
    return (
      <Popover content={content} title="变更记录" placement="right" trigger="click" visible={this.state.visible} onVisibleChange={this.handleVisibleChange}>
        <RowAction label={traceId} href />
      </Popover>
    );
  }
}
