import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Badge, Popover, Icon, Col, Menu, Modal, Row, Tabs, message } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { CRM_ORDER_STATUS, SCOF_BIZ_OBJECT_KEY } from 'common/constants';
import { hideDock, changeDockTab, cancelOrder, closeOrder, loadOrderNodes, toggleFlowPopover, loadOrderDetail } from 'common/reducers/sofOrders';
import InfoItem from 'client/components/InfoItem';
import DockPanel from 'client/components/DockPanel';
import MasterPane from './tabpanes/masterPane';
import DetailsPane from './tabpanes/detailsPane';
import FlowOverlay from './flowOverlay';
import InvoicesPane from './tabpanes/invoicesPane';
import ContainersPane from './tabpanes/containersPane';
import AttachmentPane from '../common/attachmentPane';
import LogsPane from '../common/logsPane';
import { formatMsg } from './message.i18n';

const { TabPane } = Tabs;
function renderStatus(status) {
  switch (status) {
    case CRM_ORDER_STATUS.created: return 'default';
    case CRM_ORDER_STATUS.processing: return 'processing';
    case CRM_ORDER_STATUS.finished: return 'success';
    default: return 'default';
  }
}

@injectIntl
@connect(
  state => ({
    tenantId: state.account.tenantId,
    dock: state.sofOrders.dock,
    visible: state.sofOrders.dock.visible,
    tabKey: state.sofOrders.dock.tabKey,
    order: state.sofOrders.dock.order,
    orderFlow: state.sofOrders.dock.flow,
    flowPopoverVisible: state.sofOrders.dock.flowPopoverVisible,
    privileges: state.account.privileges,
  }),
  {
    hideDock,
    changeDockTab,
    cancelOrder,
    closeOrder,
    loadOrderNodes,
    toggleFlowPopover,
    loadOrderDetail,
  }
)
export default class ShipmentDock extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    tenantId: PropTypes.number.isRequired,
    visible: PropTypes.bool.isRequired,
    hideDock: PropTypes.func.isRequired,
    changeDockTab: PropTypes.func.isRequired,
    order: PropTypes.shape({
      shipmt_order_no: PropTypes.string,
    }).isRequired,
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && !this.props.visible) {
      const orderNo = nextProps.order.shipmt_order_no;
      this.props.loadOrderDetail(orderNo);
      this.props.loadOrderNodes(orderNo);
    }
  }
  msg = formatMsg(this.props.intl)
  handleTabChange = (tabKey) => {
    this.props.changeDockTab(tabKey);
  }
  handleClose = () => {
    this.props.hideDock();
  }
  handleMenuClick = (e) => {
    if (e.key === 'cancel') {
      Modal.confirm({
        title: '确认取消订单?',
        content: '取消订单后，该订单将会被删除',
        onOk: () => {
          this.handleCancelOrder();
        },
        onCancel() {},
      });
    } else if (e.key === 'close') {
      Modal.confirm({
        title: '确认关闭订单?',
        content: '关闭订单后订单会被提前结束，但是订单不会被删除',
        onOk: () => {
          this.handleCloseOrder();
        },
        onCancel() {},
      });
    }
  }
  handleCancelOrder = () => {
    this.props.cancelOrder(this.props.order.shipmt_order_no, this.props.tenantId).then((result) => {
      if (!result.error) {
        message.info('订单已取消');
        this.props.hideDock();
      }
    });
  }
  handleCloseOrder = () => {
    this.props.closeOrder(this.props.order.shipmt_order_no, this.props.tenantId).then((result) => {
      if (!result.error) {
        message.info('订单已关闭');
        this.props.hideDock();
      }
    });
  }
  renderMenu() {
    const { order } = this.props;
    const menuItems = [];
    if (order.order_status === CRM_ORDER_STATUS.processing) {
      menuItems.push(<Menu.Item key="cancel"><Icon type="close-circle" />取消订单</Menu.Item>);
      menuItems.push(<Menu.Item key="close"><Icon type="stop" />关闭订单</Menu.Item>);
    }
    menuItems.push(<Menu.Item key="share"><Icon type="share-alt" /><span onClick={this.handleExportExcel}>共享订单</span></Menu.Item>);
    return <Menu onClick={this.handleMenuClick}>{menuItems}</Menu>;
  }
  renderStatusMsg(status) {
    switch (status) {
      case CRM_ORDER_STATUS.created: return this.msg('created');
      case CRM_ORDER_STATUS.processing: return this.msg('processing');
      case CRM_ORDER_STATUS.finished: return this.msg('finished');
      default: return '';
    }
  }
  renderTabs() {
    return (
      <Tabs defaultActiveKey="masterInfo" onChange={this.handleTabChange}>
        <TabPane tab={this.msg('masterInfo')} key="masterInfo">
          <MasterPane />
        </TabPane>
        {/*
          <TabPane tab={this.msg('flowInfo')} key="flowInfo">
          <FlowPane />
        </TabPane>
        */}
        <TabPane tab={this.msg('commInvoices')} key="commInvoices">
          <InvoicesPane />
        </TabPane>
        <TabPane tab={this.msg('container')} key="container">
          <ContainersPane />
        </TabPane>
        <TabPane tab={this.msg('shipmentDetails')} key="detailsInfo">
          <DetailsPane />
        </TabPane>
        <TabPane tab={this.msg('attachment')} key="attachment">
          <AttachmentPane
            bizObject={SCOF_BIZ_OBJECT_KEY.SOF_ORDER.key}
            billNo={this.props.order.shipmt_order_no}
            ownerPartnerId={this.props.order.customer_partner_id}
            ownerTenantId={this.props.order.customer_tenant_id}
          />
        </TabPane>
        <TabPane tab={this.msg('logs')} key="logs">
          <LogsPane
            billNo={this.props.order.shipmt_order_no}
            bizObject={SCOF_BIZ_OBJECT_KEY.SOF_ORDER.key}
          />
        </TabPane>
      </Tabs>
    );
  }
  renderExtra() {
    const { order, orderFlow } = this.props;
    return (
      <Row>
        <Col span={6}>
          <InfoItem
            label={this.msg('flowInfo')}
            field={(<Popover
              content={<FlowOverlay />}
              placement="bottomLeft"
              visible={this.props.flowPopoverVisible}
              onVisibleChange={(visible) => { this.props.toggleFlowPopover(visible); }}
            >
              <a role="presentation"><Icon type="deployment-unit" /> {orderFlow && orderFlow.name}</a>
            </Popover>)}
          />
        </Col>
        <Col span={6}>
          <InfoItem label={this.msg('owner')} field={order.customer_name} />
        </Col>
        <Col span={6}>
          <InfoItem label={this.msg('custOrderNo')} field={order.cust_order_no} />
        </Col>
        <Col span={6}>
          <InfoItem label={this.msg('status')} field={<Badge status={renderStatus(order.order_status)} text={this.renderStatusMsg(order.order_status)} />} />
        </Col>
      </Row>);
  }

  render() {
    const { order, visible } = this.props;
    return (
      <DockPanel
        size="large"
        visible={visible}
        onClose={this.props.hideDock}
        logo="https://welogix-web-static.oss-cn-shanghai.aliyuncs.com/images/icon-shipment.png"
        label={this.msg('shipmentNo')}
        title={order.shipmt_order_no}
        overlay={this.renderMenu()}
        extra={this.renderExtra()}
      >
        {visible && this.renderTabs()}
      </DockPanel>
    );
  }
}
