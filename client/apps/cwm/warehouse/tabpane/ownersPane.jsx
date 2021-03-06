import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import moment from 'moment';
import { Icon, Dropdown, Menu, Switch, Button, Modal, message } from 'antd';
import RecvshipControlPanel from 'client/apps/cwm/warehouse/panels/recvshipControlPanel';
import { loadwhseOwners, showWhseOwnersModal, updateWhOwnerControl, toggleRecShipDock, toggleAllocSkuRulePanel } from 'common/reducers/cwmWarehouse';
import { clearTransition } from 'common/reducers/cwmTransition';
import { loadWhse } from 'common/reducers/cwmContext';
import { LogixIcon } from 'client/components/FontIcon';
import DataPane from 'client/components/DataPane';
import ImportDataPanel from 'client/components/ImportDataPanel';
import ExcelUploader from 'client/components/ExcelUploader';
import { createFilename } from 'client/util/dataTransform';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import WhseOwnersModal from '../modal/whseOwnersModal';
import AllocSkuRulePanel from '../panels/allocSkuRulePanel';
import { formatMsg } from '../message.i18n';

const { confirm } = Modal;

@injectIntl
@connect(
  state => ({
    loginId: state.account.loginId,
    loginName: state.account.username,
    tenantName: state.account.tenantName,
    customsCode: state.account.customsCode,
    whseOwners: state.cwmWarehouse.whseOwners,
    defaultWhse: state.cwmContext.defaultWhse,
    recShipDockVisible: state.cwmWarehouse.recShipAttrsDock.visible,
    allocSkuDockVisible: state.cwmWarehouse.allocRulePane.visible,
  }),
  {
    showWhseOwnersModal,
    updateWhOwnerControl,
    loadWhse,
    clearTransition,
    toggleRecShipDock,
    toggleAllocSkuRulePanel,
    loadwhseOwners,
  }
)
export default class OwnersPane extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    whseCode: PropTypes.string.isRequired,
    whseName: PropTypes.string.isRequired,
    whseOwners: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      owner_code: PropTypes.string,
      owner_name: PropTypes.string.isRequired,
    })),
  }
  state = {
    importPanelVisible: false,
  }
  componentDidMount() {
    if (this.props.defaultWhse.code) {
      this.props.loadwhseOwners(this.props.defaultWhse.code);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultWhse.code !== this.props.defaultWhse.code) {
      this.props.loadwhseOwners(nextProps.defaultWhse.code);
    }
  }
  columns = [{
    title: '??????',
    dataIndex: 'owner_code',
    width: 100,
  }, {
    title: '????????????',
    dataIndex: 'owner_name',
    width: 200,
  }, {
    title: '???????????????',
    dataIndex: 'rec_ship_attrs',
    width: 120,
    align: 'center',
    render: (o, record) => (<LogixIcon type="icon-saas" style={{ color: '#1890ff' }} onClick={() => this.showRecShipAttrsDock(record)} />),
  }, {
    title: '?????????SKU??????',
    dataIndex: 'alloc_sku_rules',
    width: 120,
    align: 'center',
    render: (o, record) => (<LogixIcon type="icon-biz-rule" style={{ color: '#1890ff' }} onClick={() => this.showAllocSkuRuleDock(record)} />),
  }, {
    title: '??????/??????',
    dataIndex: 'active',
    width: 80,
    render: (actv, record) => <Switch size="small" checked={actv} checkedChildren="??????" unCheckedChildren="??????" onChange={() => this.handleOwnerActiveSwitch(record)} />,
  }, {
    title: '??????',
    width: 80,
    render: (record) => {
      const superDisabled = (!record.active || record.owner_tenant_id === -1);
      const isSuper = !superDisabled && (record.auth_type === 'superowner');
      return <Switch size="small" disabled={superDisabled} checked={isSuper} onChange={() => this.handleSuperOwnerSwitch(record)} />;
    },
  }, {
    title: '??????????????????',
    dataIndex: 'last_updated_date',
    width: 150,
    render: o => o && moment(o).format('YYYY.MM.DD HH:mm'),
  }, {
    title: '????????????',
    dataIndex: 'created_date',
    render: o => o && moment(o).format('YYYY.MM.DD'),
  }, {
    title: '??????',
    width: 120,
    fixed: 'right',
    render: (record) => {
      const menu = (<Menu mode="inline">
        <Menu.Item onClick={() => this.handleBackupData(record)}>
          ????????????
        </Menu.Item>
        <Menu.Item>
          <PrivilegeCover module="cwm" feature="settings" action="edit">
            <ExcelUploader
              endpoint={`${API_ROOTS.default}v1/cwm/stock/restore`}
              formData={{
                data: JSON.stringify({
                  whseCode: this.props.whseCode,
                }),
              }}
            >
              <span>????????????</span>
            </ExcelUploader>
          </PrivilegeCover>
        </Menu.Item>
        <Menu.Item onClick={() => this.handleEmptyData(record)}>
          ????????????
        </Menu.Item>
        <Menu.Item onClick={() => this.handleInitData(record)}>
          ???????????????
        </Menu.Item>
      </Menu>);
      return (<Dropdown overlay={menu}>
        <span style={{ color: '#1890ff', marginRight: 8 }}>????????????<Icon style={{ marginLeft: 8 }} type="down" /></span>
      </Dropdown>);
    },
  }]
  msg = formatMsg(this.props.intl)
  showRecShipAttrsDock = (row) => {
    this.props.toggleRecShipDock(true, row);
  }
  showAllocSkuRuleDock = (row) => {
    const allocRule = {
      id: row.id,
      owner_code: row.owner_code,
      alloc_rule: row.alloc_rule ? JSON.parse(row.alloc_rule) : [],
      alloc_preced: row.alloc_preced,
    };
    const skuRule = {
      ownerAuthId: row.id,
      sku_rule: row.sku_rule ? JSON.parse(row.sku_rule) : { required_props: [] },
    };
    this.props.toggleAllocSkuRulePanel(true, allocRule, skuRule);
  }
  handleOwnerActiveSwitch = (row) => {
    const ownerAuth = { active: !row.active };
    if (!ownerAuth.active) {
      // ?????? ??????????????????
      ownerAuth.auth_type = 'owner';
    }
    const contentLog = `${ownerAuth.active ? '??????' : '??????'}??????[${row.owner_code}]`;
    this.props.updateWhOwnerControl(row.id, ownerAuth, this.props.whseCode, contentLog);
  }
  handleSuperOwnerSwitch = (row) => {
    if (!row.active || row.owner_tenant_id === -1) {
      return;
    }
    let ownerType = 'owner';
    if (row.auth_type === ownerType) {
      ownerType = 'superowner';
    }
    this.props.updateWhOwnerControl(row.id, { auth_type: ownerType }, this.props.whseCode, `????????????[${row.owner_code}]`);
  }
  handleInitData = (record) => {
    this.setState({
      seletedOwner: {
        id: record.owner_partner_id,
        partner_tenant_id: record.owner_tenant_id,
        name: record.owner_name,
        portion_enabled: record.portion_enabled,
        customs_code: record.customs_code,
      },
      importPanelVisible: true,
    });
  }
  handleBackupData = (record) => {
    const { whseCode } = this.props;
    window.open(`${API_ROOTS.default}v1/cwm/stock/backup/${createFilename('backup')}.xlsx?whseCode=${whseCode}&ownerPartnerId=${record.owner_partner_id}`);
  }
  handleEmptyData = (record) => {
    const { whseCode } = this.props;
    const self = this;
    confirm({
      title: '?????????????????????????',
      content: `????????????????????????????????????${record.owner_name}????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????`,
      okText: '???',
      okType: 'danger',
      cancelText: '???',
      onOk() {
        self.props.clearTransition(whseCode, record.owner_partner_id);
      },
    });
  };
  handleStockUploaded = () => {
    this.setState({ importPanelVisible: false });
    message.success('???????????????????????????', 3);
  }
  render() {
    const {
      warehouse, whseCode, whseName, whseOwners, recShipDockVisible,
      allocSkuDockVisible,
    } = this.props;
    return ([
      <DataPane columns={this.columns} dataSource={whseOwners} rowKey="id">
        <DataPane.Toolbar>
          <PrivilegeCover module="cwm" feature="settings" action="create">
            <Button
              disabled={warehouse.whse_mode === 'PRI'}
              type="primary"
              icon="plus-circle"
              onClick={() => this.props.showWhseOwnersModal()}
            >
              ????????????
            </Button>
          </PrivilegeCover>
        </DataPane.Toolbar>
        <WhseOwnersModal whseCode={whseCode} whseOwners={whseOwners} />
        <ImportDataPanel
          visible={this.state.importPanelVisible}
          endpoint={`${API_ROOTS.default}v1/cwm/receiving/import/asn/stocks`}
          formData={{
            tenantName: this.props.tenantName,
            customsCode: this.props.customsCode,
            loginId: this.props.loginId,
            loginName: this.props.loginName,
            whseCode,
            whseName,
            owner: this.state.seletedOwner,
          }}
          onClose={() => { this.setState({ importPanelVisible: false }); }}
          onUploaded={this.handleStockUploaded}
          template={`${XLSX_CDN}/ASN??????????????????201804.xlsx`}
        />
      </DataPane>,
      <RecvshipControlPanel whseCode={this.props.whseCode} visible={recShipDockVisible} />,
      <AllocSkuRulePanel
        visible={allocSkuDockVisible}
        onClose={() => this.props.toggleAllocSkuRulePanel(false, {}, {})}
      />,
    ]);
  }
}
