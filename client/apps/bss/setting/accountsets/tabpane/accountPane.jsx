import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { toggleAccountModal, deleteAccountsetAccount } from 'common/reducers/bssSetting';
import RowAction from 'client/components/RowAction';
import DataPane from 'client/components/DataPane';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import { formatMsg } from '../../message.i18n';

@injectIntl
@connect(
  state => ({
    allAccountSubjects: state.bssSetting.allAccountSubjects,
    accountSetAccounts: state.bssSetting.accountSetAccounts,
  }),
  {
    toggleAccountModal, deleteAccountsetAccount,
  }
)
export default class AccountPane extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    accountType: PropTypes.oneOf(['cash', 'bank']),
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('code'),
    dataIndex: 'code',
    width: 200,
  }, {
    title: this.msg('accountName'),
    dataIndex: 'name',
    width: 250,
  }, {
    title: this.msg('currency'),
    dataIndex: 'currency',
    width: 150,
  }, {
    title: this.msg('subjects'),
    dataIndex: 'subject_no',
    width: 200,
    render: (o) => {
      const subject = this.props.allAccountSubjects.find(sbj => sbj.subject_no === o);
      if (subject) {
        return `${o}|${subject.subject_name}`;
      }
      return null;
    },
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: '操作',
    width: 130,
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    fixed: 'right',
    render: (o, record) => (
      <span>
        <PrivilegeCover module="bss" feature="settings" action="edit">
          <RowAction onClick={() => this.handleEditAccount(record)} icon="edit" tooltip="编辑" row={record} />
        </PrivilegeCover>
        <PrivilegeCover module="bss" feature="settings" action="delete">
          <RowAction danger confirm="确定删除?" onConfirm={this.handleDeleteAccount} icon="delete" row={record} />
        </PrivilegeCover>
      </span>
    ),
  }]
  handleEditAccount = (record) => {
    this.props.toggleAccountModal(true, {
      code: record.code,
      name: record.name,
      currency: record.currency,
      subject_no: record.subject_no,
      bank_account: record.bank_account,
      id: record.id,
    });
  }

  handleAccountAdd = () => {
    this.props.toggleAccountModal(true);
  }
  handleDeleteAccount = (row) => {
    this.props.deleteAccountsetAccount(row.id);
  }
  render() {
    const { accountSetAccounts, accountType } = this.props;
    if (accountType === 'bank') {
      this.columns.splice(2, 0, {
        title: this.msg('bankAccount'),
        dataIndex: 'bank_account',
        width: 150,
      });
    }
    return (
      <DataPane
        columns={this.columns}
        dataSource={accountSetAccounts.filter(account => account.account_type === (accountType === 'cash' ? 1 : 2))}
        rowKey="id"
      >
        <DataPane.Toolbar>
          <PrivilegeCover module="bss" feature="settings" action="create">
            <Button type="primary" icon="plus" onClick={this.handleAccountAdd}>新增</Button>
          </PrivilegeCover>
        </DataPane.Toolbar>
      </DataPane>
    );
  }
}
