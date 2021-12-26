import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Layout, Radio, Empty, Icon, Card, Row, Col, Menu, Pagination, Button, Popover, Select, Divider, Modal, message } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { loadDocumentList, toggleFolderModal, toggleDocTaskPanelVisible, deleteOssFiles } from 'common/reducers/saasInfra';
import DataPane from 'client/components/DataPane';
import SearchBox from 'client/components/SearchBox';
import RowAction from 'client/components/RowAction';
import UserAvatar from 'client/components/UserAvatar';
// import ToolbarAction from 'client/components/ToolbarAction';
import { loadPartners } from 'common/reducers/partner';
import { ARCHIVE_TYPE, SCOF_BIZ_OBJECT_KEY } from 'common/constants';
import { formatMsg } from '../message.i18n';

const { Content } = Layout;
const { Option } = Select;

const sysFolders = ARCHIVE_TYPE.map(f => ({
  id: f.value,
  doc_name: f.text,
  doc_type: f.value,
  doc_isfolder: true,
}));

@injectIntl
@connect(
  state => ({
    dataList: state.saasInfra.documentList,
    listFilter: state.saasInfra.documentFilter,
    whetherReload: state.saasInfra.whetherReload,
    partners: state.partner.partners,
    aspect: state.account.aspect,
  }),
  {
    loadDocumentList,
    toggleFolderModal,
    loadPartners,
    toggleDocTaskPanelVisible,
    deleteOssFiles,
  }
)

export default class clientFolder extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  state = {
    displayMode: 'table',
  }
  componentDidMount() {
    this.props.loadPartners();
    this.handleLoad();
  }
  componentWillReceiveProps(nextProps) {
    if ((nextProps.parentFolderId !== this.props.parentFolderId) ||
    (nextProps.whetherReload && !this.props.whetherReload)) {
      this.handleLoad(1, null, null, nextProps);
    }
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: '名称',
    dataIndex: 'doc_name',
    width: 150,
    render: (o, row) => {
      if (row.doc_isfolder) { // 文件夹
        let folderName = o;
        if (!o) {
          const obj = ARCHIVE_TYPE.find(f => f.value === row.doc_type);
          folderName = obj && folderName.text;
        }
        return (<a onClick={() => this.handleViewData(row)}><Icon type="folder-open" /> {folderName}</a>);
      } else if (row.attach && row.attach.length > 0) {
        const bizMap = new Map();
        row.attach.forEach((f) => {
          const obj = f.bizobject;
          if (bizMap.has(obj)) {
            bizMap.get(obj).push(f.biz_billno);
          } else {
            bizMap.set(obj, [f.biz_billno]);
          }
        });
        const content = [];
        const bizObjs = Object.values(SCOF_BIZ_OBJECT_KEY);
        bizMap.forEach((value, key) => {
          const obj = bizObjs.find(f => f.key === key);
          content.push(<div>
            <span>{obj ? obj.defaultText : key}</span>
            <Divider style={{ margin: '3px 0' }} />
            <span>{value}</span>
          </div>);
        });
        return (<span>
          <Icon type="file" />
          <Popover content={content}>{decodeURI(o)}</Popover>
        </span>);
      }
      return <span><Icon type="file" />{decodeURI(o)}</span>;
    },
  }, {
    title: '数量/大小',
    width: 150,
    dataIndex: 'doc_storagekb',
    render: (o, row) => {
      const size = `${((o || 0) / (2 ** 10)).toFixed(3)}M`;
      if (row.doc_isfolder) {
        return `${row.doc_folder_filenum || 0}/${size}`;
      }
      return size;
    },
  }, {
    title: '资料类型',
    width: 150,
    dataIndex: 'doc_type',
    render: (o) => {
      const obj = ARCHIVE_TYPE.find(f => f.value === o);
      return obj && obj.text;
    },
  }, {
    title: '关联客户',
    width: 150,
    dataIndex: 'owner_partner_id',
    render: (o) => {
      const partner = this.props.partners.find(f => f.id === o);
      return partner && partner.name;
    },
  }, {
    title: '创建人',
    width: 150,
    dataIndex: 'created_by',
    render: loginId => (loginId ? (<UserAvatar size="small" loginId={loginId} showName />) : '-'),
  }, {
    title: '最后更新时间',
    width: 200,
    dataIndex: 'last_updated_date',
    render: o => o && moment(o).format('YYYY-MM-DD HH:MM:ss'),
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: '操作',
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    fixed: 'right',
    width: 120,
    render: (o, row) => {
      const opearation = [];
      let menuItems;
      if (!row.doc_isfolder) {
        menuItems = [
          // <Menu.Item key="relate">关联数据</Menu.Item>,
          <Menu.Item key="move">移动</Menu.Item>,
          <Menu.Item key="delete">删除</Menu.Item>,
        ];
        opearation.push(<RowAction icon="download" onClick={this.handleDownload} row={row} key="setting" />);
      } else {
        menuItems = [<Menu.Item key="delete">删除</Menu.Item>];
        opearation.push(<RowAction icon="setting" onClick={this.handleSetFolder} row={row} key="setting" />);
      }
      if (menuItems) {
        opearation.push(<RowAction
          icon="ellipsis"
          overlay={<Menu onClick={({ key }) => this.handleMenuClick(key, row)}>
            {menuItems}
          </Menu>}
          key="more"
          row={row}
        />);
      }
      return opearation;
    },
  }]
  handleLoad = (page, size, paramFilter, nextProps) => {
    const { dataList: { current, pageSize }, listFilter, parentFolderId } = nextProps || this.props;
    const currentPage = page || current;
    const currentSize = size || pageSize;
    const currentFilter = paramFilter || listFilter;
    currentFilter.folderId = parentFolderId;
    this.props.loadDocumentList(currentPage, currentSize, currentFilter);
  }
  handleToggleDisplayMode = (ev) => {
    this.setState({ displayMode: ev.target.value });
  }
  handleViewData = (row) => {
    this.props.viewData({
      id: row.id,
      doc_name: row.doc_name,
      owner_partner_id: row.owner_partner_id,
      doc_type: row.doc_type,
    });
  }
  handleDownload = (row) => {
    window.open(row.doc_cdnurl);
  }
  handleAddFolder = () => {
    this.props.toggleFolderModal(true);
  }
  handleSetFolder = (data) => {
    this.props.toggleFolderModal(true, data);
  }
  handleMenuClick = (key, row) => {
    if (row.id < 0) return;
    if (key === 'delete') {
      Modal.confirm({
        title: this.msg('deleteConfirm'),
        onOk: () => {
          this.hanldeDelete([row.id]);
        },
      });
    } else if (key === 'move') {
      // todo
    }
  }
  hanldeDelete = (docIds) => {
    this.props.deleteOssFiles(docIds).then((result) => {
      if (result.error.message === 'files-exist-in-folder') {
        message.error('不能删除含有文件的文件夹');
      }
    });
  }
  handPageChange = (page, size) => {
    this.handleLoad(page, size);
  }
  handlePartnerChange = (value) => {
    const listFilter = { ...this.props.listFilter, partnerId: value };
    this.handleLoad(1, null, listFilter);
  }
  handleSearch = (value) => {
    const listFilter = { ...this.props.listFilter, searchText: value };
    this.handleLoad(1, null, listFilter);
  }
  handleViewLogs = () => {
    this.props.toggleDocTaskPanelVisible(true);
  }
  // 对查询顶层文件夹的查询数据进行转换(预设文件夹和已创建的数据合并)
  handleConvertData = (list) => {
    if (!this.props.parentFolderId) {
      const initFolders = [...sysFolders];
      list.forEach((f) => {
        if (f.doc_type < 0) {
          const index = initFolders.findIndex(h => h.doc_type === f.doc_type);
          if (index >= 0) initFolders.splice(index, 1);
        }
      });
      return initFolders.concat(list);
    }
    return list;
  }
  render() {
    const { displayMode } = this.state;
    const {
      dataList, listFilter, partners, parentFolderId, aspect,
    } = this.props;
    const convertData = this.handleConvertData(dataList.data);
    const toolbarActions = [<SearchBox placeholder="搜索名称" onSearch={this.handleSearch} value={listFilter.searchText} key="search" />];
    if (aspect) {
      toolbarActions.push(<Select
        showSearch
        showArrow
        allowClear
        optionFilterProp="children"
        placeholder="搜索客户"
        value={listFilter.partnerId}
        onChange={this.handlePartnerChange}
        style={{ width: 250 }}
      >
        {partners.map(f => (<Option value={f.id} key={f.id}>
          {[f.partner_code, f.name].filter(h => h).join('|')}
        </Option>))
        }
      </Select>);
    }
    // const dropdown = (
    //   <Menu onClick={this.handleMenuClick}>
    //     <Menu.Item key="logs"><Icon type="profile" /> 查看上传下载记录</Menu.Item>
    //   </Menu>
    // );
    const toolbarExtra = [
      <Button onClick={this.handleAddFolder} icon="plus">创建文件夹</Button>,
      // <span style={{ margin: '8px 8px 0 0' }}>
      //   <ToolbarAction
      //     primary
      //     icon="upload"
      //     label={this.msg('upload')}
      //     dropdown={dropdown}
      //     onClick={this.handleUpload}
      //   />
      // </span>,
      <Button onClick={this.handleViewLogs} icon="profile" style={{ marginLeft: '8px' }}>查看上传下载记录</Button>,
      <Radio.Group
        value={displayMode}
        buttonStyle="solid"
        onChange={this.handleToggleDisplayMode}
        style={{ marginLeft: '8px' }}
      >
        <Radio.Button value="table">
          <Icon type="table" />
        </Radio.Button>
        <Radio.Button value="bars">
          <Icon type="bars" />
        </Radio.Button>
      </Radio.Group>,
    ];
    let listContent = <Empty />;
    if (displayMode === 'bars') {
      listContent = (<Card
        size="small"
        title={toolbarActions}
        extra={toolbarExtra}
        bodyStyle={{ padding: 24 }}
      >
        <Row gutter={24}>
          {convertData.length > 0 && convertData.map(item => (
            <Col span={8} key="">
              <Card
                hoverable
                bodyStyle={{ padding: 8 }}
                actions={[
                  <span>
                    {!item.parent_folder_id && parentFolderId &&
                    <RowAction icon="download" onClick={this.handleDownload} row={item} key="download" />}
                  </span>,
                  <RowAction icon="setting" onClick={this.handleSetFolder} row={item} key="setting" />,
                  <RowAction
                    icon="ellipsis"
                    overlay={<Menu onClick={({ key }) => this.handleMenuClick(key, item)}>
                      <Menu.Item key="delete">删除</Menu.Item>
                    </Menu>}
                    key="more"
                  />,
                ]}
                style={{ position: 'relative', overflow: 'hidden' }}
              >
                <div>
                  <div>{item.doc_type}</div>
                  <Icon type="folder-open" style={{ fontSize: '4em', display: 'block' }} />
                  <span>{item.folder_name || item.doc_name}</span>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
        <Card.Meta title={<Pagination
          style={{ float: 'right' }}
          size="small"
          hideOnSinglePage
          onChange={this.handPageChange}
          total={dataList.totalCount}
          current={dataList.current}
          defaultPageSize={dataList.pageSize}
        />}
        />
      </Card>);
    } else {
      listContent = (
        <DataPane
          columns={this.columns}
          dataSource={convertData}
          rowKey="id"
        >
          <DataPane.Toolbar>
            {toolbarActions}
            <DataPane.Extra>{toolbarExtra}</DataPane.Extra>
          </DataPane.Toolbar>
        </DataPane>);
    }
    return (
      <Layout>
        <Content className="page-content">
          {listContent}
        </Content>
      </Layout>
    );
  }
}
