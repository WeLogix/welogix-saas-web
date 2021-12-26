import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Alert, Menu, message, Tag, Icon, Drawer } from 'antd';
import moment from 'moment';
import FileSaver from 'file-saver';
import DataTable from 'client/components/DataTable';
import RowAction from 'client/components/RowAction';
import ToolbarAction from 'client/components/ToolbarAction';
import { createRptExportBuf } from 'common/reducers/disReport';
import { loadExportHistory } from 'common/reducers/uploadRecords';
import { formatMsg } from '../message.i18n';

@injectIntl
@connect(state => ({
  listLoading: state.uploadRecords.listLoading,
  exportHistoryList: state.uploadRecords.exportHistoryList,
}), {
  createRptExportBuf, loadExportHistory,
})
export default class ReportExportButton extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    disabled: PropTypes.bool,
    passRptExportParam: PropTypes.func,
    rptName: PropTypes.string,
    rptId: PropTypes.number,
  }
  state = {
    visible: false,
    exporting: false,
  }
  msg = formatMsg(this.props.intl);
  columns = [{
    title: this.msg('gbProgress'),
    dataIndex: 'progress',
    width: 80,
    render: (prg, row) => {
      if (row.failed_msg) {
        return <Tag color="#f50">{row.failed_msg}</Tag>;
      }
      if (prg === 100) {
        return <Tag color="#87d068">{this.msg('completed')}</Tag>;
      }
      return <Tag color="#f50">{prg}%</Tag>;
    },
  }, {
    title: '文件名',
    dataIndex: 'filename',
    width: 260,
  }, {
    title: '文件大小',
    dataIndex: 'file_size',
    align: 'right',
    width: 80,
    render: (size) => {
      if (!size) {
        return <span>{this.msg('unknownSize')}</span>;
      } else if (size > 1024 * 1024) {
        return <span>{`${(size / 1024 / 1024).toFixed(1)}M`}</span>;
      }
      return <span>{`${(size / 1024).toFixed(1)}K`}</span>;
    },
  }, {
    title: this.msg('createdDate'),
    dataIndex: 'created_date',
    width: 150,
    render: o => o && moment(o).format('YYYY.MM.DD HH:mm'),
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OPS_COL',
    fixed: 'right',
    className: 'table-col-ops',
    width: 50,
    render: (o, record) => (<span>
      {record.file_cdn_path && <RowAction icon="download" onClick={this.handleDownload} tooltip={this.msg('download')} row={record} />}
    </span>),
  }];
  handleDownload = (row) => {
    window.open(row.file_cdn_path);
  }
  handleExport = () => {
    let rptParam = {};
    if (this.props.passRptExportParam) {
      rptParam = this.props.passRptExportParam();
    }
    const nowDt = new Date();
    rptParam.timezoneOffset = nowDt.getTimezoneOffset();
    rptParam.reportId = this.props.rptId;
    const { rptName } = this.props;
    this.setState({ exporting: true });
    this.props.createRptExportBuf(rptParam).then((result) => {
      if (result.error) {
        message.error(result.error.message);
      } else if (result.data) {
        if (result.data.action === 'async') {
          let asyncReason = '';
          const asyncResData = result.data;
          if (asyncResData.reason === 'exceed-row-limit') {
            asyncReason = `行数${asyncResData.row}超过${asyncResData.rowLimit}行限制`;
          } else if (asyncResData.reason === 'exceed-rowcol-limit') {
            asyncReason = `行数${asyncResData.row}*列数${asyncResData.column}超过${asyncResData.rowLimit}行*${asyncResData.colLimit}列限制`;
          }
          message.info(<span>{asyncReason}<br />报表文件请从导出文件列表下载</span>);
        } else {
          const year = nowDt.getFullYear();
          const month = nowDt.getMonth();
          const day = nowDt.getDate();
          const hour = nowDt.getHours();
          const min = nowDt.getMinutes();
          FileSaver.saveAs(
            new window.Blob([Buffer.from(result.data)], { type: 'application/octet-stream' }),
            `${rptName}-${year}${month + 1}${day}${hour}${min}.xlsx`
          );
        }
        this.setState({ exporting: false });
      }
    });
  }
  handleMenuClick = (ev) => {
    if (ev.key === 'rpthistory') {
      this.props.loadExportHistory(this.props.rptId);
      this.setState({ visible: true });
    }
  }
  handleDrawerClose = () => {
    this.setState({ visible: false });
  }
  render() {
    const {
      disabled, exportHistoryList, tooltip, listLoading,
    } = this.props;
    const { visible, exporting } = this.state;
    const rptExportMenu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="rpthistory"><Icon type="eye-o" /> {this.msg('viewRptExportFile')}</Menu.Item>
      </Menu>
    );
    return [<ToolbarAction
      key="button"
      tooltip={tooltip}
      icon="export"
      disabled={disabled || exporting}
      label={this.msg('export')}
      dropdown={rptExportMenu}
      onClick={this.handleExport}
    />,
      <Drawer
        title={this.msg('rptExportFiles')}
        width={960}
        visible={visible}
        onClose={this.handleDrawerClose}
        key="rptExportDrawer"
      >
        <Alert showIcon type="warning" message="文件下载链接会在12小时后失效,请尽快下载" />
        <DataTable
          size="middle"
          columns={this.columns}
          dataSource={exportHistoryList}
          scrollOffset={260}
          rowKey="upload_no"
          noSetting
          bordered
          loading={listLoading}
        />
      </Drawer>,
    ];
  }
}
