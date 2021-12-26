import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Layout, Card, Empty, Tabs, message, Tag } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import connectNav from 'client/common/decorators/connect-nav';
import PageHeader from 'client/components/PageHeader';
import DataPane from 'client/components/DataPane';
import RowAction from 'client/components/RowAction';
import { loadAccountSubjects, toggleSubjectModal, deleteAccountSubject } from 'common/reducers/bssSetting';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import { BSS_ACCOUNT_SUBJECT_TYPE } from 'common/constants';
import SubjectModal from './modal/subjectModal';
import AccountSetSelect from '../../common/accountSetSelect';
import BSSSettingMenu from '../menu';
import { formatMsg } from '../message.i18n';

const { Content } = Layout;
const { TabPane } = Tabs;

@injectIntl
@connect(state => ({
  currentAccountSet: state.bssSetting.currentAccountSet,
  accountSets: state.bssSetting.accountSets,
  accountSubjects: state.bssSetting.accountSubjects,
  subjectLoading: state.bssSetting.subjectLoading,
}), {
  loadAccountSubjects, toggleSubjectModal, deleteAccountSubject,
})
@connectNav({
  depth: 2,
  moduleName: 'bss',
  title: 'featBssSetting',
})
export default class AccountSubjects extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    if (this.props.currentAccountSet.id) {
      this.handleLoad(this.props.currentAccountSet.id);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.currentAccountSet.id &&
      nextProps.currentAccountSet.id !== this.props.currentAccountSet.id) {
      this.handleLoad(nextProps.currentAccountSet.id);
    }
  }
  handleLoad = (accountingSetId) => {
    this.props.loadAccountSubjects(accountingSetId || this.props.currentAccountSet.id);
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('subjectNo'),
    dataIndex: 'subject_no',
    width: 200,
  }, {
    title: this.msg('subjectName'),
    dataIndex: 'subject_name',
    width: 250,
  }, {
    title: this.msg('mnemonicCode'),
    dataIndex: 'mnemonic_code',
    width: 150,
  }, {
    title: this.msg('subjectBalance'),
    dataIndex: 'subject_balance',
    width: 200,
    align: 'center',
    render: (o) => {
      if (o === 1) {
        return this.msg('debit');
      }
      return this.msg('credit');
    },
  }, {
    title: this.msg('status'),
    dataIndex: 'status',
    width: 200,
    render: o => (o === 1 ? <Tag color="green">正常</Tag> : <Tag>禁用</Tag>),
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
          {record.status === 1 && <RowAction onClick={row => this.handleAddSubject(row)} icon="plus" tooltip="新增" row={record} />}
          {!record.children && <RowAction onClick={row => this.handleEditSubject(row)} icon="edit" tooltip="编辑" row={record} />}
        </PrivilegeCover>
        {record.parent_subject_no && !record.children && <PrivilegeCover module="bss" feature="settings" action="delete">
          <RowAction danger confirm="确定删除?" onConfirm={this.handleDeleteSubject} icon="delete" row={record} />
        </PrivilegeCover>}
      </span>
    ),
  }]
  handleAccountsetChange = (value) => {
    if (value === this.props.currentAccountSet.id) {
      return;
    }
    this.handleLoad(value);
    message.info(this.msg('accountSetChanged'));
  }
  handleDeleteSubject = (row) => {
    this.props.deleteAccountSubject(row.id, row.parent_subject_no).then((result) => {
      if (!result.error) {
        message.success(this.msg('deletedSucceed'));
      }
    });
  }
  handleAddSubject = (row) => {
    this.props.toggleSubjectModal(true, {
      subjectBalance: row.subject_balance,
      subjectType: row.subject_type,
      subjectStatus: row.status,
      parentSubjectNo: row.subject_no,
      subjectNo: '',
    });
  }
  handleEditSubject = (row) => {
    this.props.toggleSubjectModal(true, {
      subjectNo: row.subject_no,
      subjectBalance: row.subject_balance,
      subjectType: row.subject_type,
      parentSubjectNo: row.parent_subject_no,
      subjectStatus: row.status,
      subjectName: row.subject_name,
      mnemonicCode: row.mnemonic_code,
      id: row.id,
    });
  }
  render() {
    const { accountSets, accountSubjects, subjectLoading } = this.props;
    return (
      <Layout>
        <BSSSettingMenu currentKey="subjects" openKey="paramPrefs" />
        <Layout>
          <PageHeader breadcrumb={[<AccountSetSelect onChange={this.handleAccountsetChange} />]} />
          <Content className="page-content">
            <Card bodyStyle={{ padding: 0 }}>
              {accountSets.length > 0 ?
                <Tabs>
                  {BSS_ACCOUNT_SUBJECT_TYPE.map(type =>
                  (<TabPane tab={this.msg(type.text)} key={type.value}>
                    <DataPane
                      defaultExpandAllRows
                      columns={this.columns}
                      dataSource={accountSubjects.filter(subject =>
                        subject.subject_type === type.value)}
                      rowKey="id"
                      loading={subjectLoading}
                    />
                  </TabPane>))}
                </Tabs>
                : <Empty />}
            </Card>
            <SubjectModal />
          </Content>
        </Layout>
      </Layout>
    );
  }
}
