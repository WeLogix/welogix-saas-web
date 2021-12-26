import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Form, Modal, Table } from 'antd';
import { toggleRefReportModal, getSearchedReports, getReportWhereClauses } from 'common/reducers/disAnalytics';
import SearchBox from 'client/components/SearchBox';
import UserAvatar from 'client/components/UserAvatar';
import { formatMsg } from '../message.i18n';

@injectIntl
@connect(
  state => ({
    visible: state.disAnalytics.quoteReportModal.visible,
    reportList: state.disAnalytics.quoteReportModal.reportList,
    currentChart: state.disAnalytics.currentChart,
  }),
  { toggleRefReportModal, getSearchedReports, getReportWhereClauses }
)

@Form.create()
export default class QuoteReportModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
    handleReportRef: PropTypes.func.isRequired,
  }
  state = {
    selectedRowKeys: [],
  }
  handleCancel = () => {
    this.props.toggleRefReportModal(false);
  }
  handleOk = () => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length > 0) {
      this.props.getReportWhereClauses({ reportId: selectedRowKeys[0] }).then((result) => {
        if (!result.error) {
          this.props.handleReportRef(result.data);
          this.handleCancel();
        }
      });
    }
  }
  handleSearch = (searchText) => {
    const { currentChart } = this.props;
    this.props.getSearchedReports(searchText, currentChart.dana_chart_subject);
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('reportName'),
    dataIndex: 'rpt_name',
    width: 200,
  }, {
    title: this.msg('createdDate'),
    width: 200,
    dataIndex: 'created_date',
    render: o => o && moment(o).format('YYYY-MM-DD'),
  }, {
    title: this.msg('createdBy'),
    width: 150,
    dataIndex: 'created_by',
    render: lid => <UserAvatar size="small" loginId={lid} showName />,
  }]
  render() {
    const {
      visible, reportList,
    } = this.props;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      type: 'radio',
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    return (
      <Modal
        maskClosable={false}
        title="选择引用报表"
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        width={800}
      >
        <SearchBox
          onSearch={this.handleSearch}
          style={{ width: 200, marginBottom: 16 }}
          placeholder="报表名称"
        />
        <Table
          size="small"
          columns={this.columns}
          dataSource={reportList}
          rowSelection={rowSelection}
          rowKey="id"
        />
      </Modal>
    );
  }
}
