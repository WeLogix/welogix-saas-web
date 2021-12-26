import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Drawer, Tag } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import DataTable from 'client/components/DataTable';
import SearchBox from 'client/components/SearchBox';
import { loadClientlogs, toggleClientLogPanel } from 'common/reducers/hubIntegration';
import { formatMsg } from '../../message.i18n';

@injectIntl
@connect(state => ({
  clientLogList: state.hubIntegration.clientLogsPanel.clientLogList,
  reload: state.hubIntegration.clientLogsPanel.reload,
  visible: state.hubIntegration.clientLogsPanel.visible,
  clientStatus: state.hubIntegration.currentApp.clientStatus,
  appId: state.hubIntegration.clientLogsPanel.appId,
}), {
  loadClientlogs, toggleClientLogPanel,
})
export default class ClientLogsPanel extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  componentDidMount() {
    this.handleReload();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.reload) {
      this.handleReload();
    }
  }
  handleReload = () => {
    const { pageSize, current } = this.props.clientLogList;
    const { appId } = this.props;
    this.props.loadClientlogs({
      appId,
      pageSize,
      current,
    });
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('logContent'),
    dataIndex: 'log_content',
    render: filename => filename && decodeURI(filename),
  }, {
    title: this.msg('logLevel'),
    dataIndex: 'log_level',
    width: 80,
    align: 'center',
    render: (o) => {
      switch (o) {
        case 10:
          return <Tag color="#66CDAA">{this.msg('logLevelTrace')}</Tag>;
        case 20:
          return <Tag color="#5CACEE">{this.msg('logLevelDebug')}</Tag>;
        case 30:
          return <Tag color="#76EE00">{this.msg('logLevelInfo')}</Tag>;
        case 40:
          return <Tag color="#EEEE00">{this.msg('logLevelWarn')}</Tag>;
        case 50:
          return <Tag color="#FF0000">{this.msg('logLevelError')}</Tag>;
        case 60:
          return <Tag color="#8B1C62">{this.msg('logLevelFatal')}</Tag>;
        default:
          return '';
      }
    },
  }, {
    title: this.msg('logHostName'),
    dataIndex: 'log_hostname',
    width: 150,
    align: 'center',
    render: hostname => hostname && decodeURI(hostname),
  }, {
    title: this.msg('logCreatedDate'),
    dataIndex: 'created_date',
    width: 150,
    align: 'center',
    render: o => o && moment(o).format('YYYY.MM.DD HH:mm:ss'),
  },
  ];
  handleClose = () => {
    const { pageSize } = this.props.clientLogList;
    const { appId } = this.props;
    this.props.toggleClientLogPanel(false);
    this.props.loadClientlogs({
      appId,
      pageSize,
      current: 1,
    });
  }
  render() {
    const { visible, clientStatus } = this.props;
    const { appId } = this.props;
    const dataSource = new DataTable.DataSource({
      fetcher: params => this.props.loadClientlogs(params),
      resolve: result => result.data,
      getPagination: (result, resolve) => ({
        total: result.totalCount,
        current: Number(resolve(result.totalCount, result.current, result.pageSize)),
        showSizeChanger: true,
        showQuickJumper: false,
        pageSize: Number(result.pageSize),
        showTotal: total => `共 ${total} 条`,
      }),
      getParams: (pagination) => {
        const params = {
          appId,
          pageSize: pagination.pageSize,
          current: pagination.current,
        };
        return params;
      },
      remotes: this.props.clientLogList,
    });
    const status = clientStatus ? [<Tag color="#76EE00">{this.msg('clientOnline')}</Tag>] : [<Tag color="#EE0000">{this.msg('clientOffline')}</Tag>];

    return (
      <Drawer
        title={<span>{this.msg('clientLogs')} {status}</span>}
        width={960}
        visible={visible}
        onClose={this.handleClose}
      >
        <DataTable
          size="middle"
          columns={this.columns}
          dataSource={dataSource}
          toolbarActions={
            <SearchBox onSearch={this.handleSearch} />
          }
          scrollOffset={260}
          noSetting
          bordered
        />
      </Drawer>
    );
  }
}
