import React, { Component } from 'react';
import { Button } from 'antd';
import { connect } from 'react-redux';
import { toggleItemPermitModal, loadModelItems, deleteModelItem, loadPermitModels, toggleTradeItemModal } from 'common/reducers/cmsPermit';
import DataTable from 'client/components/DataTable';
import RowAction from 'client/components/RowAction';
import FullscreenModal from 'client/components/FullscreenModal';
import { PrivilegeCover, hasPermission } from 'client/common/decorators/withPrivilege';
import { intlShape, injectIntl } from 'react-intl';
import { formatMsg } from '../message.i18n';


@injectIntl
@connect(
  state => ({
    itemPermitModal: state.cmsPermit.itemPermitModal,
    visible: state.cmsPermit.itemPermitModal.visible,
    currentPermit: state.cmsPermit.currentPermit,
    modelItems: state.cmsPermit.modelItems,
    pageSize: state.cmsPermit.modelItems.pageSize,
    current: state.cmsPermit.modelItems.current,
    loading: state.cmsPermit.modelItems.loading,
    privileges: state.account.privileges,
  }),
  {
    toggleItemPermitModal, loadModelItems, deleteModelItem, loadPermitModels, toggleTradeItemModal,
  }
)

export default class ItemPermitModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible !== this.props.visible && nextProps.visible) {
      const {
        modelItems: { pageSize, current }, itemPermitModal: { permitId, modelSeq },
      } = nextProps;
      this.props.loadModelItems({
        permitId, modelSeq, pageSize, current,
      });
    }
  }
  msg = formatMsg(this.props.intl)
  handleClose = () => {
    this.props.toggleItemPermitModal(false);
  }
  handleDelete = (row) => {
    this.props.deleteModelItem(row.item_id).then((result) => {
      if (!result.error) {
        const {
          modelItems: { pageSize, current }, itemPermitModal: { permitId, modelSeq },
        } = this.props;
        this.props.loadModelItems({
          permitId, modelSeq, pageSize, current,
        });
        this.props.loadPermitModels(permitId);
      }
    });
  }
  toggleTradeItemModal = () => {
    this.props.toggleTradeItemModal(true);
  }
  columns = [{
    title: this.msg('productNo'),
    dataIndex: 'cop_product_no',
  }, {
    title: this.msg('hscode'),
    dataIndex: 'hscode',
    width: 120,
  }, {
    title: this.msg('gName'),
    dataIndex: 'g_name',
  }, {
    title: this.msg('customsControl'),
    dataIndex: 'customs',
  }, {
    title: this.msg('inspectionQuarantine'),
    dataIndex: 'inspection',
  }, {
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    width: 60,
    render: (o, record) => (<PrivilegeCover module="clearance" feature="compliance" action="delete">
      <RowAction danger confirm={this.msg('ensureDelete')} onConfirm={this.handleDelete} icon="delete" tooltip={this.msg('delete')} row={record} />
    </PrivilegeCover>),
  }]
  render() {
    const { visible, loading } = this.props;
    const dataSource = new DataTable.DataSource({
      fetcher: params => this.props.loadModelItems(params),
      resolve: result => result.data,
      getPagination: (result, resolve) => ({
        total: result.totalCount,
        current: resolve(result.totalCount, result.current, result.pageSize),
        showSizeChanger: true,
        showQuickJumper: false,
        pageSize: result.pageSize,
        showTotal: total => `共 ${total} 条`,
      }),
      getParams: (pagination) => {
        const params = {
          pageSize: pagination.pageSize,
          current: pagination.current,
          permitId: this.props.itemPermitModal.permitId,
          modelSeq: this.props.itemPermitModal.modelSeq,
        };
        return params;
      },
      remotes: this.props.modelItems,
    });
    const toolbarActions = (<PrivilegeCover module="clearance" feature="compliance" action="create">
      <Button type="primary" icon="plus-circle-o" onClick={this.toggleTradeItemModal}>{this.msg('add')}</Button>
    </PrivilegeCover>);
    const editPermission = hasPermission(this.props.privileges, {
      module: 'clearance', feature: 'compliance', action: 'edit',
    });
    return (
      <FullscreenModal
        title={this.msg('productNoManage')}
        onSave={editPermission && this.handleClose}
        onClose={this.handleClose}
        visible={visible}
      >
        <DataTable
          noSetting
          columns={this.columns}
          dataSource={dataSource}
          loading={loading}
          toolbarActions={toolbarActions}
          rowKey="id"
        />
      </FullscreenModal>
    );
  }
}
