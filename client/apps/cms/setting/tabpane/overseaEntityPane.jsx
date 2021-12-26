import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { Button } from 'antd';
import moment from 'moment';
import { connect } from 'react-redux';
import DataTable from 'client/components/DataTable';
import RowAction from 'client/components/RowAction';
import { loadOverseaUnits, deleteOverseaUnit, toggleOverseaUnitModal, toggleUnitRuleSetModal, loadBusinessUnitUsers } from 'common/reducers/cmsResources';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import OverseaEntityModal from '../modal/overseaEntityModal';
import TraderUserModal from '../modal/traderUserModal';
import { formatMsg } from '../../message.i18n';

@injectIntl
@connect(state => ({
  whetherLoadOverseaUnit: state.cmsResources.whetherLoadOverseaUnit,
  overseaUnits: state.cmsResources.overseaUnits,
  tenantId: state.account.tenantId,
  customer: state.cmsResources.customer,
}), {
  loadOverseaUnits,
  deleteOverseaUnit,
  toggleOverseaUnitModal,
  toggleUnitRuleSetModal,
  loadBusinessUnitUsers,
})
export default class OverseaEntiryPane extends Component {
  static propTyps = {
    intl: intlShape.isRequired,
    tenantId: PropTypes.number.isRequired,
    whetherLoadOverseaUnit: PropTypes.bool.isRequired,
    customer: PropTypes.object.isRequired,
    overseaUnits: PropTypes.array.isRequired,
    loadOverseaUnits: PropTypes.func.isRequired,
    deleteOverseaUnit: PropTypes.func.isRequired,
    toggleOverseaUnitModal: PropTypes.func.isRequired,
  }
  state = {
    type: 'oversea',
  }
  componentDidMount() {
    this.props.loadOverseaUnits({
      relationType: this.state.type,
      tenantId: this.props.tenantId,
      customerPartnerId: this.props.customer.id,
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.whetherLoadOverseaUnit || this.props.customer !== nextProps.customer) {
      this.props.loadOverseaUnits({
        relationType: this.state.type,
        tenantId: nextProps.tenantId,
        customerPartnerId: nextProps.customer.id,
      });
    }
  }
  msg = formatMsg(this.props.intl)
  handleEditBtnClick = (businessUnit) => {
    this.props.toggleOverseaUnitModal(true, 'edit', businessUnit);
  }
  handleAddBtnClick = () => {
    this.props.toggleOverseaUnitModal(true, 'add');
  }
  handleRuleBtnClick = (record) => {
    this.props.toggleUnitRuleSetModal(true, record.id);
    this.props.loadBusinessUnitUsers(record.id);
  }
  handleDeleteBtnClick = (row) => {
    this.props.deleteOverseaUnit(row.id);
  }
  render() {
    const { overseaUnits } = this.props;
    const columns = [{
      title: '收发货人外文名称',
      dataIndex: 'comp_name_en',
      key: 'comp_name_en',
      width: 200,
    }, {
      title: 'AEO编码',
      dataIndex: 'aeo_code',
      key: 'aeo_code',
      width: 200,
    }, {
      title: '中文名称',
      dataIndex: 'comp_name',
      key: 'comp_name',
      width: 250,
    }, {
      title: '地址',
      dataIndex: 'comp_entity_addr',
      key: 'comp_entity_addr',
      width: 200,
    }, {
      title: '创建日期',
      dataIndex: 'created_date',
      key: 'created_date',
      width: 140,
      render(o) {
        return moment(o).format('YYYY/MM/DD HH:mm');
      },
    }, {
      title: '创建人',
      dataIndex: 'creater_name',
      key: 'creater_name',
      width: 120,
    }, {
      dataIndex: 'SPACER_COL',
    }, {
      title: '操作',
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
            <RowAction danger confirm="确定删除？" onConfirm={this.handleDeleteBtnClick} icon="delete" tooltip={this.msg('delete')} row={record} />
          </PrivilegeCover>
        </span>
      ),
    }];
    return (
      <div>
        <DataTable
          cardView={false}
          toolbarActions={<PrivilegeCover module="clearance" feature="delegation" action="create">
            <Button type="primary" onClick={this.handleAddBtnClick} icon="plus-circle-o">新增</Button>
          </PrivilegeCover>}
          dataSource={overseaUnits}
          columns={columns}
          rowKey="id"
          scrollOffset={340}
        />
        <OverseaEntityModal type={this.state.type} />
        <TraderUserModal />
      </div>

    );
  }
}
