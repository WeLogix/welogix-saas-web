import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';
import DataPane from 'client/components/DataPane';
import { loadBizObjLogs } from 'common/reducers/operationLog';
import { formatMsg } from '../message.i18n';

@injectIntl
@connect(state => ({
  permitEditLog: state.operationLog.bizObjLogs,
  users: state.account.userMembers,
}), {
  loadBizObjLogs,
})
export default class PermitLogPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    this.props.loadBizObjLogs(this.context.router.params.id, 'cmsPermit');
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('no'),
    width: 45,
    align: 'center',
    className: 'table-col-seq',
    render: (o, record, index) => index + 1,
  }, {
    title: this.msg('editTime'),
    dataIndex: 'created_date',
    width: 200,
    render: o => o && moment(o).format('YYYY-MM-DD HH:mm'),
  }, {
    title: this.msg('editer'),
    dataIndex: 'login_id',
    width: 200,
    render: (o) => {
      const user = this.props.users.find(f => f.login_id === o);
      return user && user.name;
    },
  }, {
    title: this.msg('editContent'),
    dataIndex: 'op_content',
  }];
  render() {
    const { permitEditLog } = this.props;
    const dataSource = permitEditLog[this.context.router.params.id] || [];
    const pagination = {
      showSizeChanger: true,
      showQuickJumper: false,
      showTotal: total => `共 ${total} 条`,
    };
    return (
      <DataPane
        columns={this.columns}
        dataSource={dataSource}
        rowKey="id"
        pagination={pagination}
        scrollOffset={292}
      />
    );
  }
}
