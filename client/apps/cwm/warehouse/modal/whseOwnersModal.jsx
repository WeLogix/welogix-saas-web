import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Alert, Modal, Table, message, Input } from 'antd';
import { loadwhseOwners, addWhseOwners, hideWhseOwnersModal, saveOwnerCode } from 'common/reducers/cwmWarehouse';
import { loadWhse } from 'common/reducers/cwmContext';
import { loadPartners } from 'common/reducers/partner';
import { PARTNER_BUSINESSE_TYPES, PARTNER_ROLES, WHSE_OPERATION_MODES } from 'common/constants';
import { formatMsg } from '../message.i18n';

@injectIntl
@connect(
  state => ({
    visible: state.cwmWarehouse.whseOwnersModal.visible,
    partners: state.partner.partners.filter(pt =>
      (pt.role === PARTNER_ROLES.CUS || pt.role === PARTNER_ROLES.OWN) &&
      pt.business_type.indexOf(PARTNER_BUSINESSE_TYPES.warehousing) !== -1),
  }),
  {
    loadwhseOwners, loadPartners, addWhseOwners, hideWhseOwnersModal, saveOwnerCode, loadWhse,
  }
)
export default class WhseOwnersModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    whseCode: PropTypes.string.isRequired,
    whseOwners: PropTypes.arrayOf(PropTypes.shape({ owner_partner_id: PropTypes.number })),
  }
  state = {
    selectedRowKeys: [],
    selectedRows: [],
    filterPartners: [],
  }
  componentDidMount() {
    const filterPartners = this.props.partners.filter(partner =>
      !this.props.whseOwners.filter(whow => whow.active)
        .find(owners => owners.owner_partner_id === partner.id));
    this.setState({
      filterPartners,
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.whseOwners !== this.props.whseOwners) {
      this.props.loadPartners({
        role: PARTNER_ROLES.CUS,
        businessType: PARTNER_BUSINESSE_TYPES.warehousing,
      }).then((result) => {
        if (!result.error) {
          const filterPartners = result.data.filter(partner =>
            !nextProps.whseOwners.filter(whow => whow.active)
              .find(owners => owners.owner_partner_id === partner.id));
          this.setState({
            filterPartners,
          });
        }
      });
    }
  }
  setOwnerCode = (index, code) => {
    const filterPartners = [...this.state.filterPartners];
    filterPartners[index].partner_code = code;
    this.setState({
      filterPartners,
    });
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: '????????????',
    dataIndex: 'partner_code',
    width: 120,
    render: (o, record, index) =>
      <Input onChange={e => this.setOwnerCode(index, e.target.value)} value={o} />,
  },
  {
    title: '????????????',
    dataIndex: 'name',
  }]
  handleCancel = () => {
    this.props.hideWhseOwnersModal();
  }
  handleAdd = () => {
    const { whseCode } = this.props;
    const validation = this.state.selectedRows.find(item => !item.partner_code);
    if (validation) {
      message.info('?????????????????????????????????');
      return;
    }
    if (this.state.selectedRows.length === 0) {
      message.info('???????????????');
      return;
    }
    const data = this.state.selectedRows.map(obj => ({
      partnerId: obj.id,
      name: obj.name,
      code: obj.partner_code,
      tenantId: obj.partner_tenant_id,
      customsCode: obj.customs_code,
      sccCode: obj.partner_unique_code,
      receivingMode: WHSE_OPERATION_MODES.manual.value,
      shippingMode: WHSE_OPERATION_MODES.manual.value,
    }));
    this.props.addWhseOwners(data, whseCode).then((result) => {
      if (!result.error) {
        message.info('????????????');
        this.props.hideWhseOwnersModal();
        this.props.loadwhseOwners(whseCode);
        this.props.loadWhse(whseCode);
        const filterPartners = this.state.filterPartners.filter(partner =>
          !this.state.selectedRows.find(owners => owners.id === partner.id));
        this.setState({
          filterPartners,
          selectedRowKeys: [],
          selectedRows: [],
        });
      }
    });
  }
  render() {
    const { visible } = this.props;
    const { filterPartners } = this.state;
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows });
      },
      selectedRowKeys: this.state.selectedRowKeys,
    };
    return (
      <Modal maskClosable={false} title="????????????" visible={visible} onCancel={this.handleCancel} onOk={this.handleAdd}>
        <Alert message="????????????????????????????????????????????????????????????????????????" type="info" showIcon />
        <Table size="small" columns={this.columns} dataSource={filterPartners} rowKey="id" rowSelection={rowSelection} pagination={false} scroll={{ y: 400 }} />
      </Modal>
    );
  }
}
