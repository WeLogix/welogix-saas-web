import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import moment from 'moment';
import { Card, Col, DatePicker, Layout, Select, Form, Input, Tag, Button, message } from 'antd';
import LocationSelect from 'client/apps/cwm/common/locationSelect';
import DataTable from 'client/components/DataTable';
import FullscreenModal from 'client/components/FullscreenModal';
import SidePanel from 'client/components/SidePanel';
import { closeMovementModal, searchOwnerStock, createMovement, setMovementsFilter } from 'common/reducers/cwmMovement';
import { CWM_MOVEMENT_TYPE } from 'common/constants';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Content } = Layout;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
  style: { marginBottom: 0 },
};

@injectIntl
@connect(
  state => ({
    visible: state.cwmMovement.movementModal.visible,
    defaultWhse: state.cwmContext.defaultWhse,
    loginId: state.account.loginId,
    loginName: state.account.username,
    owners: state.cwmContext.whseAttrs.owners,
    filter: state.cwmMovement.movementModal.filter,
  }),
  {
    closeMovementModal, searchOwnerStock, createMovement, setMovementsFilter,
  }
)
export default class MovementModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    reload: PropTypes.func.isRequired,
  }
  state = {
    stocks: [],
    movements: [],
    moveType: 1,
    reason: '',
    transactionNo: '',
    owner: {},
  }
  componentWillMount() {
    if (typeof document !== 'undefined' && typeof window !== 'undefined') {
      this.setState({
        contentHeight: window.innerHeight - 170,
      });
    }
  }
  msg = formatMsg(this.props.intl);
  stocksColumns = [{
    title: 'SKU',
    dataIndex: 'product_sku',
    width: 200,
    render: o => o && <Button>{o}</Button>,
  }, {
    title: '中文品名',
    dataIndex: 'name',
    width: 150,
  }, {
    title: '当前库位',
    dataIndex: 'location',
    width: 100,
    render: o =>
      o && <Tag>{o}</Tag>,
  }, {
    title: '可用数量',
    dataIndex: 'avail_qty',
    width: 100,
  }, {
    title: '待移动数量',
    dataIndex: 'moving_qty',
    width: 100,
  }, {
    title: '序列号',
    dataIndex: 'serial_no',
    width: 100,
  }, {
    title: '库别',
    dataIndex: 'virtual_whse',
    width: 100,
  }, {
    title: '扩展属性1',
    dataIndex: 'attrib_1_string',
    width: 100,
  }, {
    title: '扩展属性2',
    dataIndex: 'attrib_2_string',
    width: 100,
  }, {
    title: '追踪ID',
    dataIndex: 'trace_id',
    width: 200,
  }, {
    title: '入库日期',
    dataIndex: 'inbound_timestamp',
    width: 100,
    render: o => o && moment(o).format('YYYY.MM.DD'),
  }, {
    title: '目标库位',
    width: 200,
    dataIndex: 'target_location',
    fixed: 'right',
    render: (o, stockr) => (<LocationSelect
      style={{ width: 180 }}
      value={o}
      onSelect={value => this.handleLocSelect(value, stockr)}
      showSearch
    />),
  }, {
    title: '移动数量',
    width: 100,
    dataIndex: 'movement_qty',
    fixed: 'right',
    render: (mvqty, stockr) => {
      if (stockr.trace_pack_qty === -1) {
        return <Input value={mvqty} type="number" onChange={ev => this.handleMoveQtyChange(ev.target.value, stockr)} style={{ width: 80 }} />;
      }
      return <span>{stockr.avail_qty}</span>;
    },
  }, {
    title: '加入',
    dataIndex: 'OPS_COL',
    width: 80,
    fixed: 'right',
    render: (_, stockr) => <Button disabled={stockr.avail_qty === 0} type="primary" size="small" icon="plus" onClick={() => this.handleAddMovement(stockr)} />,
  }]

  movementColumns = [{
    title: 'SKU',
    dataIndex: 'product_sku',
    width: 180,
  }, {
    title: '目标库位',
    dataIndex: 'target_location',
    width: 150,
    render: o =>
      o && <Tag>{o}</Tag>,
  }, {
    title: '移动数量',
    width: 200,
    dataIndex: 'movement_qty',
    render: o => <Input disabled value={o} style={{ width: 80 }} />,
  }, {
    title: '来源库位',
    dataIndex: 'location',
    width: 100,
    render: o => <Tag>{o}</Tag>,
  }, {
    title: '来源追踪ID',
    dataIndex: 'trace_id',
    width: 200,
  }, {
    title: '中文品名',
    dataIndex: 'name',
    width: 150,
  }, {
    dataIndex: 'spacer',
  }, {
    title: '删除',
    width: 80,
    render: (_, mover) => (<Button type="danger" size="small" ghost icon="minus" onClick={() => this.handleDeleteMovement(mover)} />),
  }]

  handleCancel = () => {
    this.props.closeMovementModal();
    this.setState({
      stocks: [],
      movements: [],
      moveType: 1,
      reason: '',
      transactionNo: '',
      owner: {},
    });
  }
  handleSearch = () => {
    const { filter } = this.props;
    if (!this.state.owner.id) {
      message.info('请选择货主');
      return;
    }
    if (!filter.productNo && !filter.serialNo && !filter.location) {
      message.info('请填写货品或序列号或库位');
      this.setState({ stocks: [] });
      return;
    }
    this.props.searchOwnerStock(
      JSON.stringify(filter), this.props.defaultWhse.code,
      this.state.owner.id
    ).then((result) => {
      if (!result.err) {
        this.setState({
          stocks: result.data.map(item => ({ ...item, moving_qty: 0 })),
        });
      }
    });
  }
  handleOwnerChange = (value) => {
    const owner = this.props.owners.find(item => item.id === value);
    this.setState({ owner: owner || {}, stocks: [] });
  }
  handleProductChange = (e) => {
    const newFilter = { ...this.props.filter, productNo: e.target.value };
    this.props.setMovementsFilter(newFilter);
  }
  handleSerialNoChange = (ev) => {
    const newFilter = { ...this.props.filter, serialNo: ev.target.value };
    this.props.setMovementsFilter(newFilter);
  }
  handleLocationChange = (value) => {
    const newFilter = { ...this.props.filter, location: value || null };
    this.props.setMovementsFilter(newFilter);
  }
  handleDateChange = (dates, dateString) => {
    const newFilter = { ...this.props.filter, startTime: dateString[0], endTime: dateString[1] };
    this.props.setMovementsFilter(newFilter);
  }
  handleAddMovement = (stockMoveRow) => {
    if (!stockMoveRow.target_location) {
      message.info('请选择目标库位');
      return;
    }
    let moveQty = stockMoveRow.movement_qty;
    if (stockMoveRow.trace_pack_qty !== -1) {
      moveQty = stockMoveRow.avail_qty;
    } else if (Number.isNaN(parseFloat(moveQty))) {
      message.info('请输入移动数量');
      return;
    }
    const stocks = [...this.state.stocks];
    const stockIdx = stocks.findIndex(stk => stk.id === stockMoveRow.id);
    const stockItem = { ...stocks[stockIdx], movement_qty: '', target_location: undefined };
    stockItem.avail_qty -= moveQty;
    stockItem.moving_qty += moveQty;
    stocks[stockIdx] = stockItem;
    const movements = this.state.movements.concat({
      id: stockMoveRow.id,
      moveIdx: this.state.movements.length,
      name: stockMoveRow.name,
      product_sku: stockMoveRow.product_sku,
      target_location: stockMoveRow.target_location,
      movement_qty: moveQty,
      location: stockMoveRow.location,
      trace_id: stockMoveRow.trace_id,
    });
    this.setState({
      stocks,
      movements,
    });
  }
  handleDeleteMovement = (moveRow) => {
    const delMoveIdx = this.state.movements.findIndex(mvm => mvm.moveIdx === moveRow.moveIdx);
    if (delMoveIdx !== -1) {
      const stocks = [...this.state.stocks];
      const movements = [...this.state.movements].splice(delMoveIdx, 1);
      const originStockIndex = stocks.findIndex(stock => stock.id === moveRow.id);
      if (originStockIndex !== -1) {
        const origStock = { ...stocks[originStockIndex] };
        origStock.avail_qty += moveRow.movement_qty;
        origStock.moving_qty -= moveRow.movement_qty;
        stocks[originStockIndex] = origStock;
        this.setState({
          stocks,
          movements,
        });
      }
    }
  }
  handleLocSelect = (value, stockRow) => {
    const stockIdx = this.state.stocks.findIndex(stk => stk.id === stockRow.id);
    if (stockIdx !== -1) {
      const stocks = [...this.state.stocks];
      stocks[stockIdx] = { ...stocks[stockIdx], target_location: value };
      this.setState({
        stocks,
      });
    }
  }
  handleCreateMovement = () => {
    const {
      owner, moveType, transactionNo, reason,
    } = this.state;
    this.props.createMovement(
      {
        owner_id: owner.id,
        owner_name: owner.name,
        move_type: moveType,
        reason,
        transaction_no: transactionNo,
        whse_code: this.props.defaultWhse.code,
        login_name: this.props.loginName,
      },
      this.state.movements
    ).then((result) => {
      if (!result.err) {
        this.props.closeMovementModal();
        this.props.reload();
        this.setState({
          stocks: [],
          movements: [],
        });
        message.success('创建库存移动成功');
      } else {
        message.error('操作失败');
      }
    });
  }
  handleMoveQtyChange = (value, stockRow) => {
    const qty = parseFloat(value);
    if (Number.isNaN(qty) || qty > stockRow.avail_qty || qty < 0) {
      message.info('请输入正确的数量');
      return;
    }
    const stockIdx = this.state.stocks.findIndex(stk => stk.id === stockRow.id);
    if (stockIdx !== -1) {
      const stocks = [...this.state.stocks];
      stocks[stockIdx] = { ...stocks[stockIdx], movement_qty: qty };
      this.setState({
        stocks,
      });
    }
  }
  handleSelectMoveType = (value) => {
    this.setState({
      moveType: value,
    });
  }
  handleTransactNoChange = (ev) => {
    this.setState({
      transactionNo: ev.target.value,
    });
  }
  handleReasonChange= (ev) => {
    this.setState({
      reason: ev.target.value,
    });
  }
  render() {
    const { owners, visible } = this.props;
    const {
      stocks, movements, owner, transactionNo, reason,
    } = this.state;
    const inventoryQueryForm = [
      <Input onChange={this.handleProductChange} placeholder="按货号模糊匹配" disabled={!owner.id} />,
      <Input onChange={this.handleSerialNoChange} placeholder="按序列号模糊匹配" disabled={!owner.id} />,
      <LocationSelect
        style={{ width: 160 }}
        value={this.props.filter.location}
        onChange={this.handleLocationChange}
        disabled={!owner.id}
      />,
      <RangePicker onChange={this.handleDateChange} />,
      <Button type="primary" ghost onClick={this.handleSearch} disabled={!owner.id}>查询</Button>,
    ];
    return (
      <FullscreenModal
        title={this.msg('库存移动单')}
        onCancel={this.handleCancel}
        onSave={this.handleCreateMovement}
        saveDisabled={!owner.id}
        visible={visible}
        noBodyPadding
      >
        <Card bordered={false} bodyStyle={{ padding: 16 }} style={{ marginBottom: 0 }}>
          <Col span={6}><FormItem label="货主" {...formItemLayout}>
            <Select onChange={this.handleOwnerChange} style={{ width: '100%' }} placeholder="请选择货主">
              {owners.map(own => (<Option value={own.id} key={own.name}>{own.name}</Option>))}
            </Select>
          </FormItem></Col>
          <Col span={6}><FormItem label="指令单号" {...formItemLayout}>
            <Input value={transactionNo} onChange={this.handleTransactNoChange} />
          </FormItem></Col>
          <Col span={6}><FormItem label="库存移动类型" {...formItemLayout}>
            <Select
              style={{ width: '100%' }}
              onSelect={this.handleSelectMoveType}
              value={this.state.moveType}
            >
              {CWM_MOVEMENT_TYPE.map(item => (<Option value={item.value} key={item.value}>
                {item.text}</Option>))}
            </Select>
          </FormItem></Col>

          <Col span={6}><FormItem label="移动原因" {...formItemLayout}>
            <Input value={reason} onChange={this.handleReasonChange} />
          </FormItem></Col>


        </Card>
        <Layout style={{ padding: 16 }}>
          <SidePanel width="75%">
            <DataTable
              toolbarActions={inventoryQueryForm}
              columns={this.stocksColumns}
              dataSource={stocks}
              rowKey="id"
              scrollOffset={332}
              noSetting
            />

          </SidePanel>
          <Content style={{ paddingLeft: 16, height: this.state.contentHeight }}>
            <DataTable
              columns={this.movementColumns}
              dataSource={movements}
              rowKey="moveIdx"
              scrollOffset={332}
              noSetting
            />

          </Content>
        </Layout>

      </FullscreenModal>
    );
  }
}
