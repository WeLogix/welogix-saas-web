import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Badge, Icon, Col, Row, Tabs, Menu, Modal, message } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { CWM_ASN_STATUS, CWM_ASN_INBOUND_STATUS, SCOF_BIZ_OBJECT_KEY } from 'common/constants';
import { hideDock, changeDockTab, loadAsn, getInstanceUuid, getAsnUuid, cancelAsn, closeAsn } from 'common/reducers/cwmReceive';
import { showDock, getShipmtOrderNo } from 'common/reducers/sofOrders';
import InfoItem from 'client/components/InfoItem';
import DockPanel from 'client/components/DockPanel';
import { createFilename } from 'client/util/dataTransform';
import { hasPermission } from 'client/common/decorators/withPrivilege';
import MasterPane from './tabpane/masterPane';
import DetailsPane from './tabpane/detailsPane';
import FTZPane from './tabpane/ftzPane';
import InboundPane from './tabpane/inboundPane';
import LogsPane from '../common/logsPane';
import { formatMsg } from './message.i18n';

const { TabPane } = Tabs;

@injectIntl
@connect(
  state => ({
    visible: state.cwmReceive.dock.visible,
    asn: state.cwmReceive.dock.asn,
    uuid: state.cwmReceive.dock.asn.uuid,
    shipmtOrderNos: state.sofOrders.shipmtOrderNos,
    privileges: state.account.privileges,
  }),
  {
    hideDock,
    changeDockTab,
    loadAsn,
    getInstanceUuid,
    showDock,
    getAsnUuid,
    getShipmtOrderNo,
    cancelAsn,
    closeAsn,
  }
)
export default class ReceivingDock extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
    hideDock: PropTypes.func.isRequired,
    changeDockTab: PropTypes.func.isRequired,
    cancelAsn: PropTypes.func.isRequired,
    closeAsn: PropTypes.func.isRequired,
  }
  state = {
    asnHead: {},
    asnBody: [],
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.asn.asn_no && !this.props.visible && nextProps.visible) {
      const asnNo = nextProps.asn.asn_no;
      this.props.getAsnUuid(asnNo);
      this.props.loadAsn(asnNo).then((result) => {
        if (!result.error) {
          this.setState({
            asnHead: result.data.asnHead || {},
            asnBody: result.data.asnBody,
          });
        }
      });
      this.props.getShipmtOrderNo(asnNo);
    }
  }
  componentWillUnmount() {
    this.props.hideDock();
  }
  msg = formatMsg(this.props.intl)
  handleTabChange = (tabKey) => {
    this.props.changeDockTab(tabKey);
  }
  handleClose = () => {
    this.props.hideDock();
  }
  handleComplete = (asnNo) => {
    this.props.closeAsn(asnNo).then((result) => {
      if (result.error) {
        message.error(result.error.message);
      }
    });
  }
  handleDeleteASN = (asnNo) => {
    this.props.cancelAsn(asnNo).then((result) => {
      if (result.error) {
        message.error(result.error.message);
      }
    });
  }
  handleMenuClick = (e) => {
    const { asnHead } = this.state;
    if (e.key === 'cancel') {
      Modal.confirm({
        title: '确认取消ASN?',
        content: '确认后此ASN的相关信息将会被删除',
        onOk: () => {
          this.handleDeleteASN(asnHead.asn_no);
        },
        onCancel() {},
      });
    } else if (e.key === 'close') {
      Modal.confirm({
        title: '确认关闭ASN?',
        content: '确认后此ASN将会被提前完成',
        onOk: () => {
          this.handleComplete(asnHead.asn_no);
        },
        onCancel() {},
      });
    }
  }
  handlePreview = (orderNo) => {
    this.props.hideDock();
    this.props.showDock(orderNo);
  }
  handleExportExcel = () => {
    window.open(`${API_ROOTS.default}v1/cwm/receiving/exportAsnExcel/${createFilename('asn')}.xlsx?asnNo=${this.props.asn.asn_no}`);
  }
  renderTabs() {
    const { asn } = this.props;
    const { asnHead, asnBody } = this.state;
    const tabs = [
      <TabPane tab={this.msg('masterInfo')} key="masterInfo">
        <MasterPane asnHead={asnHead} />
      </TabPane>,
    ];
    tabs.push(<TabPane tab={this.msg('asnDetails')} key="asnDetails">
      <DetailsPane asnBody={asnBody} />
    </TabPane>);
    if (asnHead.bonded) {
      tabs.push(<TabPane tab={this.msg('tabFTZ')} key="ftzReg">
        <FTZPane asnNo={asn.asn_no} />
      </TabPane>);
    }
    if (asnHead.status > CWM_ASN_STATUS.PENDING.value) {
      tabs.push(<TabPane tab={this.msg('tabInbound')} key="inbound">
        <InboundPane asnNo={asn.asn_no} />
      </TabPane>);
    }
    tabs.push(<TabPane tab={this.msg('logs')} key="logs">
      <LogsPane
        billNo={asnHead.asn_no}
        bizObject={SCOF_BIZ_OBJECT_KEY.CWM_RECEIVING.key}
      />
    </TabPane>);
    return (
      <Tabs defaultActiveKey="masterInfo" onChange={this.handleTabChange}>
        { tabs }
      </Tabs>
    );
  }

  renderExtra() {
    const { asnHead } = this.state;
    const { uuid, shipmtOrderNos } = this.props;
    let asnStatusBadage = 'default';
    let asnStatusMsg = '';
    Object.keys(CWM_ASN_INBOUND_STATUS).forEach((statusKey) => {
      if (CWM_ASN_INBOUND_STATUS[statusKey].value === asnHead.status) {
        asnStatusBadage = CWM_ASN_INBOUND_STATUS[statusKey].badge;
        asnStatusMsg = CWM_ASN_INBOUND_STATUS[statusKey].text;
      }
    });
    return (
      <Row>
        <Col span={6}>
          <InfoItem
            label={this.msg('relShipmentNo')}
            field={shipmtOrderNos.length > 0 &&
            <a className="ant-dropdown-link" onClick={() => this.handlePreview(shipmtOrderNos[0])} disabled={!uuid}>
              {shipmtOrderNos[0]}
            </a>}
          />
        </Col>
        <Col span={6}>
          <InfoItem label={this.msg('owner')} field={asnHead.owner_name} />
        </Col>
        <Col span={6}>
          <InfoItem label={this.msg('custOrderNo')} field={asnHead.cust_order_no} />
        </Col>
        <Col span={6}>
          <InfoItem label={this.msg('status')} field={<Badge status={asnStatusBadage} text={asnStatusMsg} />} />
        </Col>
      </Row>);
  }
  renderMenu() {
    const { privileges } = this.props;
    const editPermission = hasPermission(privileges, {
      module: 'cwm', feature: 'receiving', action: 'edit',
    });
    const deletePermission = hasPermission(privileges, {
      module: 'cwm', feature: 'receiving', action: 'delete',
    });
    const { asnHead } = this.state;
    const menuItems = [];
    if ((asnHead.status === CWM_ASN_STATUS.PENDING.value
      || asnHead.status === CWM_ASN_STATUS.INBOUND.value) && deletePermission) {
      menuItems.push(<Menu.Item key="cancel"><Icon type="delete" />取消ASN</Menu.Item>);
    } else if (asnHead.status === CWM_ASN_STATUS.DISCREPANT.value && editPermission) {
      menuItems.push(<Menu.Item key="close"><Icon type="close-square" />关闭ASN</Menu.Item>);
    }
    menuItems.push(<Menu.Item key="export"><Icon type="export" /><span onClick={this.handleExportExcel}>导出ASN</span></Menu.Item>);
    return <Menu onClick={this.handleMenuClick}>{menuItems}</Menu>;
  }
  render() {
    const { visible, asn } = this.props;
    return (
      <DockPanel
        size="large"
        visible={visible}
        onClose={this.props.hideDock}
        logo="https://welogix-web-static.oss-cn-shanghai.aliyuncs.com/images/icon-receiving.png"
        label={this.msg('asnNo')}
        title={asn.asn_no}
        overlay={this.renderMenu()}
        extra={this.renderExtra()}
      >
        {this.renderTabs()}
      </DockPanel>
    );
  }
}
