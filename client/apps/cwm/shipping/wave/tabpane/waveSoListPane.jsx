import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';
import { Button, notification, Tag, Badge } from 'antd';
import DataPane from 'client/components/DataPane';
import SearchBox from 'client/components/SearchBox';
import UserAvatar from 'client/components/UserAvatar';
import { loadWaveOrders, removeWaveOrders } from 'common/reducers/cwmShippingOrder';
import { batchAutoAlloc, cancelProductsAlloc, loadAutoAllocTaskStatus } from 'common/reducers/cwmOutbound';
import { CWM_OUTBOUND_STATUS, ALLOC_ERROR_MESSAGE_DESC, CWM_SHFTZ_OUT_REGTYPES, SASBL_REG_TYPES, CWM_SO_OUTBOUND_STATUS } from 'common/constants';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import RowAction from 'client/components/RowAction';
import { formatMsg } from '../../message.i18n';


@injectIntl
@connect(
  state => ({
    loginId: state.account.loginId,
    loginName: state.account.username,
    waveOrders: state.cwmShippingOrder.waveOrders,
    reload: state.cwmOutbound.outboundReload,
    waveHead: state.cwmOutbound.outboundFormHead,
    submitting: state.cwmOutbound.submitting,
  }),
  {
    loadWaveOrders,
    removeWaveOrders,
    batchAutoAlloc,
    cancelProductsAlloc,
    loadAutoAllocTaskStatus,
  }
)
export default class WaveSoListPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  state = {
    selectedRowKeys: [],
    search: '',
  }
  componentDidMount() {
    this.props.loadWaveOrders(this.props.waveNo, null);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.reload && nextProps.reload !== this.props.reload) {
      this.props.loadWaveOrders(this.props.waveNo, null);
    }
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: '行号',
    width: 50,
    render: (o, record, index) => index + 1,
  }, {
    title: 'SO编号',
    dataIndex: 'so_no',
    width: 180,
  }, {
    title: '订单追踪号',
    dataIndex: 'cust_order_no',
    width: 100,
  }, {
    title: '状态',
    dataIndex: 'status',
    width: 120,
    render: (soStatus, row) => {
      if (soStatus === CWM_SO_OUTBOUND_STATUS.PENDING.value) {
        return (<Badge
          status={CWM_SO_OUTBOUND_STATUS.PENDING.badge}
          text={CWM_SO_OUTBOUND_STATUS.PENDING.text}
        />);
      } else if (row.outbound_status === CWM_OUTBOUND_STATUS.CREATED.value) {
        return (<Badge
          status={CWM_SO_OUTBOUND_STATUS.PREALLOC.badge}
          text={CWM_SO_OUTBOUND_STATUS.PREALLOC.text}
        />);
      } else if (row.outbound_status === CWM_OUTBOUND_STATUS.PARTIAL_ALLOC.value) {
        return (<Badge
          status={CWM_SO_OUTBOUND_STATUS.ALLOCATING.badge}
          text={CWM_SO_OUTBOUND_STATUS.ALLOCATING.text}
        />);
      } else if (row.outbound_status === CWM_OUTBOUND_STATUS.ALL_ALLOC.value ||
        row.outbound_status === CWM_OUTBOUND_STATUS.PARTIAL_PICKED.value) {
        return (<Badge
          status={CWM_SO_OUTBOUND_STATUS.ALLOCATED.badge}
          text={CWM_SO_OUTBOUND_STATUS.ALLOCATED.text}
        />);
      } else if (row.outbound_status === CWM_OUTBOUND_STATUS.ALL_PICKED.value ||
        row.outbound_status === CWM_OUTBOUND_STATUS.PACKED.value ||
        row.outbound_status === CWM_OUTBOUND_STATUS.SHIPPING.value) {
        return (<Badge
          status={CWM_SO_OUTBOUND_STATUS.PICKED.badge}
          text={CWM_SO_OUTBOUND_STATUS.PICKED.text}
        />);
      } else if (row.outbound_status === CWM_OUTBOUND_STATUS.COMPLETED.value) {
        return (<Badge
          status={CWM_SO_OUTBOUND_STATUS.SHIPPED.badge}
          text={CWM_SO_OUTBOUND_STATUS.SHIPPED.text}
        />);
      }
      return null;
    },
  }, {
    title: '货主',
    dataIndex: 'owner_name',
    width: 150,
  }, {
    title: '收货人',
    dataIndex: 'receiver_name',
    width: 150,
    render: o => (<b>{o}</b>),
  }, {
    title: '收获地址',
    dataIndex: 'receiver_address',
    width: 150,
  }, {
    title: '联系电话',
    dataIndex: 'receiver_phone',
    width: 100,
  }, {
    title: this.msg('bondType'),
    dataIndex: 'bonded',
    width: 100,
    render: (bonded, record) => {
      if (bonded === 1) {
        const regtype = CWM_SHFTZ_OUT_REGTYPES.concat(SASBL_REG_TYPES).filter(sbr =>
          sbr.value === record.bonded_outtype)[0];
        if (regtype) {
          return (<Tag color={regtype.tagcolor}>{regtype.ftztext || '保税'}</Tag>);
        }
      } else if (bonded === -1) {
        return (<Tag>不限</Tag>);
      } else {
        return (<Tag>非保税</Tag>);
      }
      return null;
    },
  }, {
    title: this.msg('regStatus'),
    dataIndex: 'reg_status',
    width: 100,
    render: (o) => {
      if (o === 0) {
        return (<Badge status="default" text="未申报" />);
      } else if (o === 1) {
        return (<Badge status="processing" text="申报中" />);
      } else if (o === 2) {
        return (<Badge status="success" text="审批通过" />);
      }
      return null;
    },
  }, {
    title: '出库时间',
    dataIndex: 'shipped_date',
    width: 120,
    render: o => o && moment(o).format('YYYY.MM.DD HH:mm'),
  }, {
    title: '快递单号',
    dataIndex: 'express_no',
    width: 120,
  }, {
    title: '生成快递单号时间',
    dataIndex: 'express_date',
    width: 120,
    render: o => o && moment(o).format('YYYY.MM.DD HH:mm'),
  }, {
    title: '创建时间',
    dataIndex: 'created_date',
    width: 120,
    render: o => moment(o).format('YYYY.MM.DD HH:mm'),
  }, {
    title: '创建人员',
    dataIndex: 'created_by',
    width: 80,
    render: lid => <UserAvatar size="small" loginId={lid} showName />,
  }, {
    title: '执行人员',
    dataIndex: 'exec_by',
    width: 80,
    render: lid => <UserAvatar size="small" loginId={lid} showName />,
  }, {
    title: '操作',
    dataIndex: '_OPS_',
    className: 'table-col-ops',
    width: 130,
    fixed: 'right',
    render: (o, record) => {
      const completed = this.props.waveHead.status === CWM_OUTBOUND_STATUS.COMPLETED.value;
      if (!completed && record.total_alloc_qty < record.total_qty) {
        return (<PrivilegeCover module="cwm" feature="shipping" action="edit">
          <RowAction onClick={this.handleAutoAlloc} icon="rocket" label="自动分配" row={record} disabled={this.props.submitting || this.props.waveHead.is_allocing} />
        </PrivilegeCover>);
      }
      return (<PrivilegeCover module="cwm" feature="shipping" action="edit">
        {!completed && record.total_picked_qty < record.total_alloc_qty &&
        <RowAction onClick={this.handleAllocCancel} icon="close-circle-o" label="取消分配" row={record} disabled={this.props.submitting} />}
      </PrivilegeCover>);
    },
  }]
  handleAutoAllocPoll = () => {
    this.pollTimer = setInterval(() => {
      this.props.loadAutoAllocTaskStatus(null, this.props.waveNo).then((result) => {
        if (!result.error && !result.data.isAllocing && this.pollTimer) {
          clearInterval(this.pollTimer);
        }
      });
    }, 3000);
  }
  handleAutoAlloc = (row) => {
    this.props.batchAutoAlloc(
      row.outbound_no,
      this.props.waveNo,
      null,
      this.props.loginId, this.props.loginName, row.cust_order_no
    ).then((result) => {
      if (!result.error) {
        this.handleAutoAllocPoll();
      } else {
        notification.error({
          message: result.error.message,
        });
      }
    });
  }
  handleWaveAutoAlloc = () => {
    this.props.batchAutoAlloc(
      null,
      this.props.waveNo,
      null,
      this.props.loginId, this.props.loginName,
    ).then((result) => {
      if (!result.error) {
        this.handleAutoAllocPoll();
      } else {
        notification.error({
          message: result.error.message,
        });
      }
    });
  }
  handleAllocCancel = (row) => {
    this.props.cancelProductsAlloc(
      row.outbound_no,
      this.props.waveNo,
      null,
      row.cust_order_no,
    ).then((result) => {
      if (result.error) {
        let msg = result.error.message;
        if (ALLOC_ERROR_MESSAGE_DESC[result.error.message]) {
          msg = ALLOC_ERROR_MESSAGE_DESC[result.error.message];
        }
        notification.error({
          message: msg,
        });
      }
    });
  }
  handleSoSearch = (value) => {
    this.setState({ search: value });
  }
  render() {
    const { waveHead, waveOrders } = this.props;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    let ordersList = waveOrders.data;
    if (this.state.search) {
      ordersList = waveOrders.data.filter((od) => {
        const reg = new RegExp(this.state.search);
        return reg.test(od.so_no) || reg.test(od.cust_order_no);
      });
    }
    return (
      <DataPane
        columns={this.columns}
        rowSelection={rowSelection}
        indentSize={0}
        dataSource={ordersList}
        rowKey="so_no"
        loading={this.state.loading}
      >
        <DataPane.Toolbar>
          <SearchBox placeholder="SO编号/订单追踪号" onSearch={this.handleSoSearch} />
          <DataPane.BulkActions
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
          />
          <DataPane.Actions>
            <PrivilegeCover module="cwm" feature="shipping" action="edit">
              { waveHead.status === CWM_OUTBOUND_STATUS.CREATED.value &&
                <Button loading={this.props.submitting || waveHead.is_allocing} type="primary" onClick={this.handleWaveAutoAlloc}>波次分配</Button>}
            </PrivilegeCover>
          </DataPane.Actions>
        </DataPane.Toolbar>
      </DataPane>
    );
  }
}
