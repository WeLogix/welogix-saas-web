import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import moment from 'moment';
import { Button, Tag, message } from 'antd';
import { toggleBrokerModal, loadBrokers, deleteBroker, changeBrokerStatus, authorizeBroker } from 'common/reducers/cwmWarehouse';
import RowAction from 'client/components/RowAction';
import DataPane from 'client/components/DataPane';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import BrokerModal from '../modal/whseBrokersModal';
import { formatMsg } from '../message.i18n';

@injectIntl
@connect(
  state => ({
    loginId: state.account.loginId,
    brokers: state.cwmWarehouse.brokers,
    whseOwners: state.cwmWarehouse.whseOwners,
    defaultWhse: state.cwmContext.defaultWhse,
  }),
  {
    toggleBrokerModal, loadBrokers, deleteBroker, changeBrokerStatus, authorizeBroker,
  }
)
export default class BrokersPane extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    whseCode: PropTypes.string.isRequired,
  }
  componentWillMount() {
    this.props.loadBrokers(this.props.whseCode);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.whseCode !== this.props.whseCode) {
      this.props.loadBrokers(nextProps.whseCode);
    }
  }
  columns = [{
    title: '报关企业名称',
    dataIndex: 'name',
    width: 250,
  }, {
    title: '统一社会信用代码',
    dataIndex: 'uscc_code',
    width: 200,
  }, {
    title: '海关编码',
    dataIndex: 'customs_code',
    width: 150,
  }, {
    title: '状态',
    dataIndex: 'active',
    render: (o) => {
      if (o) {
        return <Tag color="green">正常</Tag>;
      }
      return <Tag color="red">停用</Tag>;
    },
  }, {
    title: '最后修改时间',
    dataIndex: 'last_updated_date',
    width: 140,
    render: o => o && moment(o).format('YYYY.MM.DD HH:mm'),
  }, {
    title: '创建时间',
    dataIndex: 'created_date',
    width: 140,
    render: o => o && moment(o).format('YYYY.MM.DD HH:mm'),
  }, {
    title: '操作',
    width: 130,
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    fixed: 'right',
    render: (o, record) => (
      <span>
        <PrivilegeCover module="cwm" feature="settings" action="edit">
          {!!record.active && (!record.authority ?
            <RowAction onClick={() => this.authorizeBroker(true, record.partner_id)} icon="check-circle" tooltip="仓库授权" row={record} /> :
            <RowAction onClick={() => this.authorizeBroker(false, record.partner_id)} icon="stop" tooltip="取消授权" row={record} />)}
          {record.active === 0 ?
            <RowAction onClick={() => this.changeBrokerStatus(record.id, true, this.props.loginId)} icon="play-circle" tooltip="启用" row={record} /> :
            <RowAction onClick={() => this.changeBrokerStatus(record.id, false, this.props.loginId)} icon="pause-circle" tooltip="停用" row={record} />}
        </PrivilegeCover>
        <PrivilegeCover module="cwm" feature="settings" action="delete">
          <RowAction danger confirm="确定删除?" onConfirm={() => this.handleDeleteBroker(record.id)} icon="delete" row={record} />
        </PrivilegeCover>
      </span>
    ),
  }]
  msg = formatMsg(this.props.intl)
  authorizeBroker = (value, partnerId) => {
    const msg = value ? '授权成功' : '已取消授权';
    this.props.authorizeBroker(value, this.props.whseCode, partnerId).then((result) => {
      if (!result.error) {
        this.props.loadBrokers(this.props.whseCode);
        message.info(msg);
      }
    });
  }
  changeBrokerStatus = (id, status) => {
    this.props.changeBrokerStatus(id, status).then((result) => {
      if (!result.error) {
        this.props.loadBrokers(this.props.whseCode);
      }
    });
  }
  handleDeleteBroker = (id) => {
    this.props.deleteBroker(id).then((result) => {
      if (!result.error) {
        this.props.loadBrokers(this.props.whseCode);
      }
    });
  }
  render() {
    const { whseCode, brokers } = this.props;
    return (
      <DataPane
        columns={this.columns}
        dataSource={brokers}
        rowKey="id"
      >
        <DataPane.Toolbar>
          <PrivilegeCover module="cwm" feature="settings" action="create">
            <Button type="primary" icon="plus-circle" onClick={() => this.props.toggleBrokerModal(true)}>添加报关企业</Button>
          </PrivilegeCover>
        </DataPane.Toolbar>
        <BrokerModal whseCode={whseCode} />
      </DataPane>
    );
  }
}
