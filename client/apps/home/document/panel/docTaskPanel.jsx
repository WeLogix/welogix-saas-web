import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Drawer, Tabs, DatePicker } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import DataPane from 'client/components/DataPane';
import SearchBox from 'client/components/SearchBox';
import UserAvatar from 'client/components/UserAvatar';
import { toggleDocTaskPanelVisible, loadUploadList } from 'common/reducers/saasInfra';
import { ARCHIVE_TYPE } from 'common/constants';
import { formatMsg } from '../../message.i18n';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

@injectIntl
@connect(state => ({
  docUploadList: state.saasInfra.docUploadList,
  docUploadFilter: state.saasInfra.docUploadFilter,
  visible: state.saasInfra.docTaskPanel.visible,
}), {
  toggleDocTaskPanelVisible, loadUploadList,
})

export default class DocTaskPanel extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  componentDidMount() {
    this.handleLoadUploadList();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.parentFolderId !== this.props.parentFolderId) {
      this.handleLoadUploadList(1, null, null, nextProps);
    }
  }
  msg = formatMsg(this.props.intl)
  handleLoadUploadList = (page, size, paramFilter, nextProps) => {
    const {
      docUploadList: { pageSize, current }, docUploadFilter, folderId,
    } = nextProps || this.props;
    const currentPage = page || current;
    const currentSize = size || pageSize;
    const currentFilter = paramFilter || docUploadFilter;
    currentFilter.folderId = folderId;
    currentFilter.billNo = null;
    this.props.loadUploadList(currentPage, currentSize, currentFilter);
  }
  handleSearch = (value) => {
    const filter = { ...this.props.filter, searchText: value };
    this.handleLoadUploadList(1, null, filter);
  }
  uploadColumns = [{
    title: '文件名称',
    dataIndex: 'doc_name',
    width: 150,
  }, {
    title: '文件大小',
    dataIndex: 'doc_storagekb',
    width: 80,
    render: (o, row) => {
      const size = `${((o || 0) / (2 ** 10)).toFixed(3)}M`;
      if (row.doc_isfolder) {
        return `${row.doc_folder_filenum || 0}/${size}`;
      }
      return size;
    },
  }, {
    title: '文件类型',
    dataIndex: 'doc_type',
    width: 100,
    render: (o) => {
      const obj = ARCHIVE_TYPE.find(f => f.value === o);
      return obj && obj.text;
    },
  }, {
    title: '上传时间',
    dataIndex: 'created_date',
    width: 150,
    render: o => o && moment(o).format('YYYY-MM-DD'),
  }, {
    title: '操作人',
    dataIndex: 'created_by',
    width: 100,
    render: loginId => <UserAvatar size="small" loginId={loginId} showName />,
  }];
  handleClose = () => {
    this.props.toggleDocTaskPanelVisible(false);
  }
  handleSearch = (value) => {
    const listFilter = { ...this.props.docUploadList.filter, searchText: value };
    this.handleLoadUploadList(1, null, listFilter);
  }
  handleDateRangeChange = (data, dataString) => {
    const listFilter = {
      ...this.props.docUploadFilter,
      startDate: dataString[0],
      endDate: dataString[1],
    };
    this.handleLoadUploadList(1, null, listFilter);
  }
  render() {
    const { visible, docUploadList, docUploadFilter } = this.props;
    if (!visible) return null;
    let initDate = [];
    if (docUploadFilter.startDate && docUploadFilter.endDate) {
      initDate = [moment(docUploadFilter.startDate), moment(docUploadFilter.endDate)];
    }
    return (
      <Drawer
        title="上传下载任务列表"
        width={960}
        visible={visible}
        placement="right"
        onClose={this.handleClose}
      >
        <Tabs onChange={this.handleTabChange}>
          <TabPane tab="上传任务" key="upload">
            <DataPane
              columns={this.uploadColumns}
              dataSource={docUploadList.data}
              rowKey="id"
              nosetting
            >
              <DataPane.Toolbar>
                <SearchBox value={docUploadFilter.searchText} placeholder="文件名称" onSearch={this.handleSearch} />
                <RangePicker value={initDate} onChange={this.handleDateRangeChange} />
              </DataPane.Toolbar>
            </DataPane>
          </TabPane>
          <TabPane tab="下载任务" key="download" />
          <TabPane tab="用量实况" key="usage" />
        </Tabs>
      </Drawer>
    );
  }
}
