import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { Button } from 'antd';
import moment from 'moment';
import { connect } from 'react-redux';
import DataTable from 'client/components/DataTable';
import RowAction from 'client/components/RowAction';
import { loadTradeUnits, deleteTradeUnit, toggleTradeUnitModal, toggleUnitRuleSetModal, loadBusinessUnitUsers } from 'common/reducers/cmsResources';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import TraderModal from '../modal/traderModal';
import TraderUserModal from '../modal/traderUserModal';
import { formatMsg } from '../../message.i18n';

@injectIntl
@connect(state => ({
  whetherLoadTradeUnit: state.cmsResources.whetherLoadTradeUnit,
  tradeUnits: state.cmsResources.tradeUnits,
  tenantId: state.account.tenantId,
  customer: state.cmsResources.customer,
}), {
  loadTradeUnits,
  deleteTradeUnit,
  toggleTradeUnitModal,
  toggleUnitRuleSetModal,
  loadBusinessUnitUsers,
})
export default class TraderList extends Component {
  static propTyps = {
    intl: intlShape.isRequired,
    tenantId: PropTypes.number.isRequired,
    whetherLoadOverseaUnit: PropTypes.bool.isRequired,
    customer: PropTypes.object.isRequired,
    tradeUnits: PropTypes.array.isRequired,
    loadTradeUnits: PropTypes.func.isRequired,
    deleteTradeUnit: PropTypes.func.isRequired,
    toggleTradeUnitModal: PropTypes.func.isRequired,
  }
  state = {
    type: 'trade',
  }
  componentDidMount() {
    this.props.loadTradeUnits({
      relationType: this.state.type,
      tenantId: this.props.tenantId,
      customerPartnerId: this.props.customer.id,
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.whetherLoadTradeUnit || this.props.customer !== nextProps.customer) {
      this.props.loadTradeUnits({
        relationType: this.state.type,
        tenantId: nextProps.tenantId,
        customerPartnerId: nextProps.customer.id,
      });
    }
  }
  msg = formatMsg(this.props.intl)
  handleEditBtnClick = (businessUnit) => {
    this.props.toggleTradeUnitModal(true, 'edit', businessUnit);
  }
  handleAddBtnClick = () => {
    this.props.toggleTradeUnitModal(true, 'add');
  }
  handleRuleBtnClick = (record) => {
    this.props.toggleUnitRuleSetModal(true, record.id);
    this.props.loadBusinessUnitUsers(record.id);
  }
  handleDeleteBtnClick = (row) => {
    this.props.deleteTradeUnit(row.id);
  }
  render() {
    const { tradeUnits } = this.props;
    const columns = [{
      title: '????????????????????????',
      dataIndex: 'comp_name',
      key: 'comp_name',
      width: 250,
    }, {
      title: '????????????????????????',
      dataIndex: 'comp_code',
      key: 'comp_code',
      width: 180,
    }, {
      title: '????????????',
      dataIndex: 'customs_code',
      key: 'customs_code',
      width: 120,
    }, {
      title: '??????????????????',
      dataIndex: 'ciq_code',
      key: 'ciq_code',
      width: 120,
    }, {
      title: '????????????',
      dataIndex: 'comp_name_en',
      key: 'comp_name_en',
      width: 200,
    }, {
      title: '????????????',
      dataIndex: 'created_date',
      key: 'created_date',
      width: 140,
      render(o) {
        return moment(o).format('YYYY/MM/DD HH:mm');
      },
    }, {
      title: '?????????',
      dataIndex: 'creater_name',
      key: 'creater_name',
      width: 120,
    }, {
      dataIndex: 'SPACER_COL',
    }, {
      title: '??????',
      dataIndex: 'OPS_COL',
      width: 130,
      className: 'table-col-ops',
      fixed: 'right',
      render: (_, record) => (
        <span>
          <PrivilegeCover module="clearance" feature="delegation" action="edit">
            <RowAction onClick={this.handleEditBtnClick} icon="edit" tooltip={this.msg('modify')} row={record} />
          </PrivilegeCover>
          <PrivilegeCover module="clearance" feature="delegation" action="edit">
            <RowAction onClick={this.handleRuleBtnClick} icon="key" tooltip={this.msg('auth')} row={record} />
          </PrivilegeCover>
          <PrivilegeCover module="clearance" feature="delegation" action="delete">
            <RowAction danger confirm="???????????????" onConfirm={this.handleDeleteBtnClick} icon="delete" tooltip={this.msg('delete')} row={record} />
          </PrivilegeCover>
        </span>
      ),
    }];
    return (
      <div>
        <DataTable
          cardView={false}
          toolbarActions={<PrivilegeCover module="clearance" feature="delegation" action="create">
            <Button type="primary" onClick={this.handleAddBtnClick} icon="plus-circle-o">??????</Button>
          </PrivilegeCover>}
          dataSource={tradeUnits}
          columns={columns}
          rowKey="id"
          scrollOffset={340}
        />
        <TraderModal type={this.state.type} />
        <TraderUserModal />
      </div>

    );
  }
}
