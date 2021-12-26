import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import moment from 'moment';
import { Button, Tag } from 'antd';
import { toggleReceiverModal, loadReceivers, deleteReceiver, changeReceiverStatus } from 'common/reducers/cwmWarehouse';
import RowAction from 'client/components/RowAction';
import DataPane from 'client/components/DataPane';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import * as Location from 'client/util/location';
import WhseReceiversModal from '../modal/whseReceiversModal';
import { formatMsg } from '../message.i18n';


@injectIntl
@connect(
  state => ({
    whseOwners: state.cwmWarehouse.whseOwners,
    defaultWhse: state.cwmContext.defaultWhse,
    receivers: state.cwmWarehouse.receivers,
    loginId: state.account.loginId,
  }),
  {
    toggleReceiverModal, loadReceivers, deleteReceiver, changeReceiverStatus,
  }
)
export default class ReceiversPane extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    whseCode: PropTypes.string.isRequired,
    whseTenantId: PropTypes.number.isRequired,
    receivers: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
      owner_partner_id: PropTypes.number.isRequired,
      province: PropTypes.string.isRequired,
    })).isRequired,
    whseOwners: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      owner_code: PropTypes.string,
      owner_name: PropTypes.string.isRequired,
    })),
  }
  componentWillMount() {
    this.props.loadReceivers(this.props.whseCode, this.props.whseTenantId);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.whseCode !== this.props.whseCode) {
      this.props.loadReceivers(nextProps.whseCode, nextProps.whseTenantId);
    }
  }
  columns = [{
    title: '代码',
    dataIndex: 'code',
    width: 100,
  }, {
    title: '收货人名称',
    dataIndex: 'name',
    width: 200,
  }, {
    title: '海关编码',
    dataIndex: 'customs_code',
    width: 150,
  }, {
    title: '收货仓库号',
    dataIndex: 'ftz_whse_code',
    width: 100,
  }, {
    title: '地区',
    dataIndex: 'province',
    width: 150,
    rencer: (col, row) => Location.renderLocation(row),
  }, {
    title: '状态',
    dataIndex: 'active',
    width: 80,
    render: o => (o ? <Tag color="green">正常</Tag> : <Tag color="red">停用</Tag>),
  }, {
    title: '关联货主',
    dataIndex: 'owner_partner_id',
    width: 150,
    render: (col) => {
      const owner = this.props.whseOwners.find(item => item.owner_partner_id === col);
      return owner ? owner.owner_name : '';
    },
  }, {
    title: '最后修改时间',
    dataIndex: 'last_updated_date',
    width: 120,
    render: o => o && moment(o).format('YYYY.MM.DD HH:mm'),
  }, {
    title: '创建时间',
    dataIndex: 'created_date',
    width: 120,
    render: o => o && moment(o).format('YYYY.MM.DD HH:mm'),
  }, {
    title: '操作',
    width: 130,
    dataIndex: 'id',
    fixed: 'right',
    render: (o, record) => (
      <span>
        <PrivilegeCover module="cwm" feature="settings" action="edit">
          <RowAction onClick={() => this.handleEditReceiver(record)} icon="edit" tooltip="修改" row={record} />
          {record.active === 0 ?
            <RowAction onClick={() => this.changeReceiverStatus(record.id, true)} icon="play-circle" tooltip="启用" row={record} /> :
            <RowAction onClick={() => this.changeReceiverStatus(record.id, false)} icon="pause-circle" tooltip="停用" row={record} />}
        </PrivilegeCover>
        <PrivilegeCover module="cwm" feature="settings" action="delete">
          <RowAction danger confirm="确定删除?" onConfirm={() => this.handleDeleteReceiver(record.id)} icon="delete" row={record} />
        </PrivilegeCover>
      </span>
    ),
  }]
  msg = formatMsg(this.props.intl)
  changeReceiverStatus = (id, status) => {
    this.props.changeReceiverStatus(id, status, this.props.loginId).then((result) => {
      if (!result.error) {
        this.handleReceiverLoad();
      }
    });
  }
  handleDeleteReceiver = (id) => {
    this.props.deleteReceiver(id).then((result) => {
      if (!result.error) {
        this.handleReceiverLoad();
      }
    });
  }
  handleEditReceiver = (receiver) => {
    this.props.toggleReceiverModal(true, receiver);
  }
  handleReceiverLoad = () => {
    this.props.loadReceivers(this.props.whseCode, this.props.whseTenantId);
  }
  render() {
    const {
      whseCode, whseTenantId, whseOwners, receivers,
    } = this.props;
    return (
      <DataPane
        columns={this.columns}
        dataSource={receivers}
        rowKey="id"
      >
        <DataPane.Toolbar>
          <PrivilegeCover module="cwm" feature="settings" action="create">
            <Button type="primary" icon="plus-circle" onClick={() => this.props.toggleReceiverModal(true)}>添加收货人</Button>
          </PrivilegeCover>
        </DataPane.Toolbar>
        <WhseReceiversModal
          whseCode={whseCode}
          whseTenantId={whseTenantId}
          whseOwners={whseOwners}
        />
      </DataPane>
    );
  }
}
