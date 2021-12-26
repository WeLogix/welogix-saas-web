import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Button, Input, notification } from 'antd';
import { LogixIcon } from 'client/components/FontIcon';
import DataPane from 'client/components/DataPane';
import connectNav from 'client/common/decorators/connect-nav';
import RowAction from 'client/components/RowAction';
import SearchBox from 'client/components/SearchBox';
// import { intlShape, injectIntl } from 'react-intl';
import { loadMovementDetails, executeMovement, loadMovementHead, removeMoveDetail, cancelMovement, updateMovementDetail } from 'common/reducers/cwmMovement';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import TraceIdPopover from '../../../common/popover/traceIdPopover';

// @injectIntl
@connect(
  state => ({
    username: state.account.username,
    movementHead: state.cwmMovement.movementHead,
    movementDetails: state.cwmMovement.movementDetails,
    reload: state.cwmMovement.movementReload,
    submitting: state.cwmMovement.moveSubmitting,
  }),
  {
    loadMovementDetails,
    executeMovement,
    loadMovementHead,
    removeMoveDetail,
    cancelMovement,
    updateMovementDetail,
  }
)
@connectNav({
  depth: 3,
  moduleName: 'cwm',
})
export default class MovementDetailsPane extends React.Component {
  static propTypes = {
    // intl: intlShape.isRequired,
    movementNo: PropTypes.string.isRequired,
    updateMovementDetail: PropTypes.func.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    selectedRowKeys: [],
  }
  componentDidMount() {
    this.handleReload();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reload && nextProps.reload !== this.props.reload) {
      this.handleReload();
    }
  }
  handleReload = () => {
    this.props.loadMovementDetails(this.props.movementNo);
    this.setState({
      selectedRowKeys: [],
    });
  }
  handleBatchDetailRemove = () => {
    const { username, movementNo } = this.props;
    if (this.props.movementDetails.length === this.state.selectedRowKeys.length) {
      this.props.cancelMovement(movementNo, username).then((result) => {
        if (!result.err) {
          this.context.router.push('/cwm/stock/movement');
        }
      });
    } else {
      this.props.removeMoveDetail(
        movementNo,
        this.state.selectedRowKeys,
        username
      ).then((result) => {
        if (!result.err) {
          this.props.loadMovementDetails(this.props.movementNo);
        }
      });
    }
  }
  removeMoveDetail = (row) => {
    const { username, movementNo } = this.props;
    if (this.props.movementDetails.length === 1) {
      this.props.cancelMovement(movementNo, username).then((result) => {
        if (!result.err) {
          this.context.router.push('/cwm/stock/movement');
        }
      });
    } else {
      this.props.removeMoveDetail(movementNo, [row.to_trace_id], username).then((result) => {
        if (!result.err) {
          this.props.loadMovementDetails(this.props.movementNo);
        }
      });
    }
  }
  handleUpdateToLocation = (id, value) => {
    this.props.updateMovementDetail(id, { to_location: value }).then(() => {
      this.props.loadMovementDetails(this.props.movementNo);
    });
  }
  handleExecuteMovement = () => {
    const { movementNo, username } = this.props;
    Modal.confirm({
      title: '是否确认库存移动已完成?',
      onOk: () => {
        this.props.executeMovement(movementNo, username).then((result) => {
          if (!result.error) {
            this.props.loadMovementHead(movementNo);
            this.handleReload();
          } else if (result.error.message.key === 'location_not_found') {
            const { nonexistFromLocs, nonexistToLocs } = result.error.message.data;
            notification.error({
              message: '库位不存在',
              description: <span>{nonexistFromLocs.length > 0 ? `不存在来源库位: ${nonexistFromLocs.join(',').slice(0, 100)}` : null}
                <br />{nonexistToLocs.length > 0 ? `不存在目标库位: ${nonexistToLocs.join(',').slice(0, 100)}` : null}</span>,
              duration: 0,
            });
          } else {
            notification.error({
              message: '执行失败',
              description: result.error.message,
              duration: 0,
            });
          }
        });
      },
      onCancel: () => {},
      okText: '执行库存移动',
    });
  }
  columns = [{
    title: '行号',
    dataIndex: 'seq_no',
    width: 50,
  }, {
    title: '商品货号',
    dataIndex: 'product_no',
    width: 150,
  }, {
    title: '品名',
    dataIndex: 'name',
    width: 150,
  }, {
    title: '库存移动数量',
    width: 180,
    dataIndex: 'move_qty',
    align: 'right',
  }, {
    title: '来源追踪ID',
    dataIndex: 'from_trace_id',
    width: 180,
    render: o => o && <TraceIdPopover traceId={o} />,
  }, {
    title: '来源库位',
    dataIndex: 'from_location',
    width: 180,
  }, {
    title: '目的追踪ID',
    dataIndex: 'to_trace_id',
    width: 180,
    render: o => o && <TraceIdPopover traceId={o} />,
  }, {
    title: '目的库位',
    dataIndex: 'to_location',
    width: 180,
    render: (o, row) => {
      if (this.props.movementHead.isdone) {
        return o;
      }
      return (<PrivilegeCover module="cwm" feature="stock" action="edit"><Input
        value={o}
        onBlur={e => this.handleUpdateToLocation(row.id, e.target.value)}
      /></PrivilegeCover>);
    },
  }, {
    title: '批次号',
    dataIndex: 'external_lot_no',
    width: 150,
  }, {
    title: '操作',
    width: 80,
    render: (o, record) => !record.isdone &&
    (<PrivilegeCover module="cwm" feature="stock" action="edit">
      <RowAction onClick={this.removeMoveDetail} label="取消明细" row={record} />
    </PrivilegeCover>),
  }]
  render() {
    const {
      movementDetails, mode, movementHead, submitting,
    } = this.props;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    return (
      <DataPane
        columns={this.columns}
        rowSelection={rowSelection}
        indentSize={0}
        dataSource={movementDetails}
        rowKey="to_trace_id"
        loading={this.state.loading}
      >
        <DataPane.Toolbar>
          <SearchBox placeholder="货号" onSearch={this.handleSearch} />
          <DataPane.BulkActions
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
          >
            {this.state.selectedRowKeys.length > 0 &&
              (<PrivilegeCover module="cwm" feature="stock" action="delete">
                <Button onClick={this.handleBatchDetailRemove}>
                  <LogixIcon type="icon-check-all" />批量移除明细
                </Button>
              </PrivilegeCover>)}
          </DataPane.BulkActions>
          <DataPane.Actions>
            {mode === 'manual' && movementHead.isdone === 0 &&
            <PrivilegeCover module="cwm" feature="stock" action="edit">
              <Button icon="check" onClick={this.handleExecuteMovement} disabled={submitting}>
                执行库存移动
              </Button>
            </PrivilegeCover>}
          </DataPane.Actions>
        </DataPane.Toolbar>
      </DataPane>
    );
  }
}
