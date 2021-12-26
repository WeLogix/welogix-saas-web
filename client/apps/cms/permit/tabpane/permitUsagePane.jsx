import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';
import { loadPermitUsageLogs } from 'common/reducers/cmsPermit';
import DataPane from 'client/components/DataPane';
import { formatMsg } from '../message.i18n';


@injectIntl
@connect(state => ({
  permitUseLogs: state.cmsPermit.permitUseLogs,
  whetherLoadUsageLog: state.cmsPermit.whetherLoadUsageLog,
}), { loadPermitUsageLogs })
export default class PermitUsagePane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    const { current, pageSize } = this.props.permitUseLogs;
    this.props.loadPermitUsageLogs(this.context.router.params.id, current, pageSize);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.whetherLoadUsageLog &&
      nextProps.whetherLoadUsageLog !== this.props.whetherLoadUsageLog) {
      const { current, pageSize } = nextProps.permitUseLogs;
      this.props.loadPermitUsageLogs(this.context.router.params.id, current, pageSize);
    }
  }
  handlePageChange(page, size) {
    this.props.loadPermitUsageLogs(this.context.router.params.id, page, size);
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('no'),
    width: 45,
    align: 'center',
    className: 'table-col-seq',
    render: (o, record, index) => index + 1,
  }, {
    title: this.msg('model'),
    dataIndex: 'permit_model',
    width: 200,
  }, {
    title: this.msg('relProductNos'),
    dataIndex: 'product_no',
    width: 250,
  }, {
    title: this.msg('usageCount'),
    dataIndex: 'usage_qty',
    width: 200,
  }, {
    title: this.msg('usageDate'),
    dataIndex: 'created_date',
    width: 200,
    render: o => o && moment(o).format('YYYY-MM-DD HH:mm'),
  }, {
    title: this.msg('usageObject'),
    dataIndex: 'pre_entry_seq_no',
  }];
  render() {
    const {
      permitUseLogs: {
        current, pageSize, totalCount, data,
      },
    } = this.props;
    const pagination = {
      total: totalCount,
      current,
      pageSize,
      showSizeChanger: true,
      showQuickJumper: false,
      showTotal: total => `共 ${total} 条`,
      onChange: this.handlePageChange,
    };
    return (
      <DataPane
        columns={this.columns}
        dataSource={data}
        rowKey="id"
        pagination={pagination}
        scrollOffset={292}
      />
    );
  }
}
