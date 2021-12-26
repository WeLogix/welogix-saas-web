import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Modal, Badge, Tag, notification } from 'antd';
import DataTable from 'client/components/DataTable';
import SearchBox from 'client/components/SearchBox';
import RowAction from 'client/components/RowAction';
import { CWM_SO_OUTBOUND_STATUS, CWM_OUTBOUND_STATUS, CWM_SHFTZ_OUT_REGTYPES, SASBL_REG_TYPES } from 'common/constants';
import UserAvatar from 'client/components/UserAvatar';
import { loadWaveOrders, hideWaveSoListModal, showDock, removeWaveOrders } from 'common/reducers/cwmShippingOrder';
import { formatMsg } from '../../message.i18n';

@injectIntl
@connect(
  state => ({
    loading: state.cwmShippingOrder.waveSoListModal.loading,
    visible: state.cwmShippingOrder.waveSoListModal.visible,
    waveNo: state.cwmShippingOrder.waveSoListModal.waveNo,
    waveOrders: state.cwmShippingOrder.waveOrders,
  }),
  {
    loadWaveOrders,
    hideWaveSoListModal,
    showDock,
    removeWaveOrders,
  }
)
export default class WaveSoListModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    waveNo: PropTypes.string.isRequired,
    viewOutbound: PropTypes.func.isRequired,
  }
  state = {
    search: '',
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && nextProps.visible !== this.props.visible) {
      const { waveNo } = nextProps;
      this.props.loadWaveOrders(waveNo, null);
    }
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: 'SO编号',
    width: 260,
    dataIndex: 'so_no',
    render: (o, record) => (
      <a onClick={() => this.handlePreview(o, record.outbound_no)}>
        {o}
      </a>),
  }, {
    title: '订单追踪号',
    dataIndex: 'cust_order_no',
    width: 160,
  }, {
    title: '货主',
    width: 200,
    dataIndex: 'owner_name',
  }, {
    title: '收货人',
    dataIndex: 'receiver_name',
    width: 180,
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
          status={CWM_SO_OUTBOUND_STATUS.PRE_ALLOC.badge}
          text={CWM_SO_OUTBOUND_STATUS.PRE_ALLOC.text}
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
    title: this.msg('bondType'),
    width: 100,
    dataIndex: 'bonded',
    render: (bonded, record) => {
      if (!record.so_no) {
        return null;
      }
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
    width: 120,
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
    width: 140,
    render: o => o && moment(o).format('MM.DD HH:mm'),
  }, {
    title: '创建时间',
    width: 140,
    dataIndex: 'created_date',
    render: o => moment(o).format('MM.DD HH:mm'),
  }, {
    title: '创建人员',
    dataIndex: 'created_by',
    width: 120,
    render: lid => <UserAvatar size="small" loginId={lid} showName />,
  }, {
    title: '执行人员',
    dataIndex: 'exec_by',
    width: 120,
    render: lid => <UserAvatar size="small" loginId={lid} showName />,
  }, {
    dataIndex: 'SPACER_COL',
    width: 80,
  }, {
    title: '操作',
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    width: 150,
    fixed: 'right',
    render: (o, record) => {
      const outbndActions = [];
      if (record.outbound_status < CWM_SO_OUTBOUND_STATUS.ALLOCATING.value) {
        outbndActions.push(<RowAction onClick={this.handleDeleteSoFromWave} icon="close" label="移出波次" row={record} />);
      }
      return outbndActions;
    },
  }]
  handleOutbound = (row) => {
    this.props.viewOutbound(row);
    this.props.hideWaveSoListModal();
  }
  handleSearch = (value) => {
    this.setState({ search: value });
  }
  handlePreview = (soNo, outboundNo) => {
    this.props.showDock(soNo, outboundNo);
    this.props.hideWaveSoListModal();
  }
  handleCancel = () => {
    this.props.hideWaveSoListModal();
  }
  handleSubmit = () => {
    this.props.hideWaveSoListModal();
  }
  handleDeleteSoFromWave = (row) => {
    this.props.removeWaveOrders([row.so_no], row.wave_no).then((result) => {
      if (!result.error) {
        notification.success({
          message: '移除成功',
        });
        this.handleReload();
      } else {
        notification.error({
          message: '移除失败',
          description: result.data,
        });
      }
    });
  }
  handleReload = () => {
    const { waveNo } = this.props;
    this.props.loadWaveOrders(waveNo, null);
  }
  render() {
    const {
      visible, loading, waveNo, waveOrders,
    } = this.props;
    let ordersList = waveOrders.data;
    if (this.state.search) {
      ordersList = waveOrders.data.filter((od) => {
        const reg = new RegExp(this.state.search);
        return reg.test(od.so_no) || reg.test(od.cust_order_no);
      });
    }
    const toolbarActions = (<span>
      <SearchBox value={this.props.filters && this.props.filters.search} placeholder={this.msg('SO编号/订单追踪号')} onSearch={this.handleSearch} />
    </span>);
    return (
      <Modal width={1500} maskClosable={false} title={`波次${waveNo}内全部订单`} visible={visible} onOk={this.handleSubmit} onCancel={this.handleCancel}>
        <DataTable
          size="middle"
          columns={this.columns}
          dataSource={ordersList}
          toolbarActions={toolbarActions}
          loading={loading}
          rowKey="so_no"
          scrollOffset={500}
        />
      </Modal>
    );
  }
}
