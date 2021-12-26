import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Col, Icon, Menu, Row, Tabs, Dropdown, Tooltip } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { CMS_DELEGATION_STATUS, SCOF_BIZ_OBJECT_KEY } from 'common/constants';
import { hideDock, setPreviewTabkey, loadBasicInfo, loadDelgCusDecls } from 'common/reducers/cmsDelegationDock';
import { getShipmtOrderNo, showDock } from 'common/reducers/sofOrders';
import InfoItem from 'client/components/InfoItem';
import DockPanel from 'client/components/DockPanel';
import MasterPane from './tabpanes/masterPane';
import ManifestPane from './tabpanes/manifestPane';
import CustomsDeclPane from './tabpanes/customsDeclPane';
import AttachmentPane from '../common/attachmentPane';
import DelgLogsPane from './tabpanes/delgLogsPane';
import { formatMsg } from './message.i18n';

const { TabPane } = Tabs;

@injectIntl
@connect(
  state => ({
    visible: state.cmsDelegationDock.previewer.visible,
    previewLoading: state.cmsDelegationDock.basicPreviewLoading,
    previewer: state.cmsDelegationDock.previewer,
    tabKey: state.cmsDelegationDock.tabKey,
    previewKey: state.cmsDelegationDock.previewKey,
    cusdeclList: state.cmsDelegationDock.cusdeclList,
    partnerId: state.cmsDelegationDock.previewer.delgDispatch.send_partner_id,
    shipmtOrderNos: state.sofOrders.shipmtOrderNos,
  }),
  {
    hideDock,
    showDock,
    setPreviewTabkey,
    loadBasicInfo,
    loadDelgCusDecls,
    getShipmtOrderNo,
  }
)
export default class DelegationDock extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    tabKey: PropTypes.string,
    previewKey: PropTypes.string,
    hideDock: PropTypes.func.isRequired,
  }
  // componentDidMount() {
  //   const delgNo = this.props.previewer.delegation.delg_no;
  //   this.handleLoad(delgNo);
  // }
  componentWillReceiveProps(nextProps) {
    if (nextProps.previewKey !== this.props.previewKey) {
      nextProps.loadBasicInfo(nextProps.previewKey, nextProps.tabKey);
    }
    const delgNo = nextProps.previewer.delegation.delg_no;
    if (delgNo !== this.props.previewer.delegation.delg_no) {
      this.handleLoad(delgNo);
    }
  }
  componentWillUnmount() {
    this.props.hideDock();
  }
  msg = formatMsg(this.props.intl)
  handleLoad = (delgNo) => {
    this.props.loadDelgCusDecls({ delgNo });
    this.props.getShipmtOrderNo(delgNo);
  }
  handleTabChange = (tabKey) => {
    this.props.setPreviewTabkey(tabKey);
  }
  handlePreview = (orderNo) => {
    this.props.hideDock();
    this.props.showDock(orderNo);
  }
  renderExtra() {
    const { previewer: { delegation }, shipmtOrderNos } = this.props;
    let orderField = null;
    if (shipmtOrderNos.length === 1) {
      const orderNo = shipmtOrderNos[0];
      orderField = (<a className="ant-dropdown-link" onClick={() => this.handlePreview(orderNo)}>{orderNo}</a>);
    } else if (shipmtOrderNos.length > 1) {
      orderField = (<Dropdown
        overlay={
          <Menu>
            {shipmtOrderNos.slice(0).map(orderNo => (<Menu.Item>
              <a onClick={() => this.handlePreview(orderNo)}>{orderNo}</a>
            </Menu.Item>))}
          </Menu>}
      >
        <a className="ant-dropdown-link" onClick={() => this.handlePreview(shipmtOrderNos[0])}>
          {shipmtOrderNos[0]} <Icon type="down" />
        </a>
      </Dropdown>);
    }
    return (
      <Row>
        <Col span={8}>
          <InfoItem label={this.msg('relShipmentNo')} field={orderField} />
        </Col>
        <Col span={8}>
          <InfoItem label={this.msg('owner')} field={delegation.customer_name} />
        </Col>
        <Col span={8}>
          <InfoItem label={this.msg('custOrderNo')} field={delegation.order_no} />
        </Col>
      </Row>);
  }
  renderMenu() {
    const { previewer } = this.props;
    const { delgDispatch } = previewer;
    const menuItems = [];
    if (delgDispatch.status < CMS_DELEGATION_STATUS.declaring) {
      menuItems.push(<Menu.Item key="cancel"><Icon type="delete" />取消委托</Menu.Item>);
    } else if (delgDispatch.status === CMS_DELEGATION_STATUS.declaring) {
      menuItems.push(<Menu.Item key="close"><Icon type="close-square" />关闭委托</Menu.Item>);
    }
    menuItems.push(<Menu.Item key="share"><Icon type="share-alt" /><span onClick={this.handleExportExcel}>共享委托</span></Menu.Item>);
    return <Menu onClick={this.handleMenuClick}>{menuItems}</Menu>;
  }
  render() {
    const {
      visible, previewLoading, previewer, cusdeclList,
    } = this.props;
    const { delegation } = previewer;
    const logoUrl = delegation.i_e_type === 1 ? 'https://welogix-web-static.oss-cn-shanghai.aliyuncs.com/images/icon-export.png'
      : 'https://welogix-web-static.oss-cn-shanghai.aliyuncs.com/images/icon-import.png';
    return (
      <DockPanel
        size="large"
        visible={visible}
        onClose={this.props.hideDock}
        logo={logoUrl}
        label={this.msg('delgNo')}
        title={delegation.delg_no}
        extra={this.renderExtra()}
        loading={previewLoading}
        overlay={this.renderMenu()}
      >
        <Tabs defaultActiveKey="masterInfo" onChange={this.handleTabChange}>
          <TabPane tab={this.msg('masterInfo')} key="masterInfo"><MasterPane /></TabPane>
          <TabPane tab={this.msg('declManifest')} key="declManifest"><ManifestPane /></TabPane>
          {
            cusdeclList.map(decl => (
              <TabPane
                tab={<span>
                  {decl.head.law_ciq === 'MUST' &&
                  <Tooltip title={decl.head.ciq_no}><Icon type="security-scan" /></Tooltip>}
                  <span>{decl.head.entry_id || decl.head.pre_entry_seq_no}</span>
                </span>}
                key={decl.head.pre_entry_seq_no}
              >
                <CustomsDeclPane cusDecl={decl} />
              </TabPane>
            ))
          }
          <TabPane tab={this.msg('docsArchive')} key="attachment">
            <AttachmentPane
              bizObject={SCOF_BIZ_OBJECT_KEY.CMS_DELEGATION.key}
              billNo={delegation.delg_no}
              ownerPartnerId={delegation.customer_partner_id}
              ownerTenantId={delegation.customer_tenant_id}
            />
          </TabPane>
          <TabPane tab={this.msg('logs')} key="logs">
            <DelgLogsPane delgNo={delegation.delg_no} />
          </TabPane>
        </Tabs>
      </DockPanel>
    );
  }
}
