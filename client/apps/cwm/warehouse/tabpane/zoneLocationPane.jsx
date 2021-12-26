import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import moment from 'moment';
import { Layout, Dropdown, Icon, Button, Input, Popover, Menu, Modal, Form, message, Popconfirm } from 'antd';
import { LogixIcon } from 'client/components/FontIcon';
import RowAction from 'client/components/RowAction';
import SearchBox from 'client/components/SearchBox';
import ExcelUploader from 'client/components/ExcelUploader';
import DataTable from 'client/components/DataTable';
import { createFilename } from 'client/util/dataTransform';
import { loadZones, deleteZone, addZone, loadPagedLocations, showLocationModal, switchZone, deleteLocation, showZoneModal, loadLocationStat, toggleProductConfigModal } from 'common/reducers/cwmWhseLocation';
import { CWM_LOCATION_TYPES, CWM_LOCATION_STATUS } from 'common/constants';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import ZoneEditModal from '../modal/zoneEditModal';
import LocationModal from '../modal/locationModal';
import WhseLocProductRelModal from '../modal/whseLocProductRelModal';
import { formatMsg } from '../message.i18n';

const { Content, Sider } = Layout;
const FormItem = Form.Item;
const { SubMenu } = Menu;
const { confirm } = Modal;

@injectIntl
@connect(
  state => ({
    loginId: state.account.loginId,
    warehouseList: state.cwmWarehouse.warehouseList,
    zoneList: state.cwmWhseLocation.zoneList,
    currentZone: state.cwmWhseLocation.currentZone,
    locations: state.cwmWhseLocation.locations,
    locationStat: state.cwmWhseLocation.locationStat,
    locationFilter: state.cwmWhseLocation.locationFilter,
    locationLoading: state.cwmWhseLocation.locationLoading,
    locationReload: state.cwmWhseLocation.locationReload,
    zoneReload: state.cwmWhseLocation.zoneReload,
  }),
  {
    addZone,
    loadZones,
    showLocationModal,
    loadPagedLocations,
    loadLocationStat,
    deleteLocation,
    deleteZone,
    showZoneModal,
    switchZone,
    toggleProductConfigModal,
  }
)
@Form.create()
export default class ZoneLocationPane extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    warehouse: PropTypes.shape({ code: PropTypes.string }).isRequired,
  }
  state = {
    visible: false,
    selectedRowKeys: [],
    pagination: {
      pageSize: 20,
      current: 1,
    },
  }
  componentDidMount() {
    this.handleZoneReload();
  }
  componentWillReceiveProps(nextProps) {
    const zoneReload = nextProps.zoneReload && this.props.zoneReload !== nextProps.zoneReload;
    const whChanged = nextProps.warehouse.code !== this.props.warehouse.code;
    if (whChanged || zoneReload) {
      this.handleZoneReload(nextProps.warehouse.code);
    } else if (nextProps.locationReload && this.props.locationReload !== nextProps.locationReload
      && nextProps.currentZone) {
      this.handleLocationReload({
        warehouseCode: nextProps.warehouse.code, zoneCode: nextProps.currentZone.zone_code,
      }, 1);
    }
  }
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }
  handleZoneReload(whCodeParam) {
    const warehouseCode = whCodeParam || this.props.warehouse.code;
    this.props.loadZones(warehouseCode);
  }
  handleLocationReload = (filterParam, currentParam, pageSizeParam, onlyLoadList) => {
    const filter = filterParam || this.props.locationFilter;
    const current = currentParam || this.state.pagination.current;
    const pageSize = pageSizeParam || this.state.pagination.pageSize;

    this.props.loadPagedLocations(current, pageSize, JSON.stringify(filter))
      .then((result) => {
        if (!result.error) {
          this.setState({ pagination: { current, pageSize } });
        }
      });
    if (!onlyLoadList) {
      this.props.loadLocationStat(filter.warehouseCode, filter.zoneCode);
      this.setState({ selectedRowKeys: [] });
    }
  }
  handlePageChange = (current, pageSize) => {
    this.handleLocationReload(null, current, pageSize, true);
  }
  createZone = (ev) => {
    ev.preventDefault();
    const { loginId } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { zoneCode, zoneName } = values;
        const whseCode = this.props.warehouse.code;
        this.props.addZone({
          zoneCode,
          zoneName,
          whseCode,
          loginId,
        }).then((result) => {
          if (!result.error) {
            message.info('添加库区成功');
            this.setState({
              visible: false,
            });
            this.props.form.setFieldsValue({
              zoneCode: '',
              zoneName: '',
            });
          }
          this.props.loadZones(whseCode).then((data) => {
            if (!data.error) {
              this.setState({
                selectedRowKeys: [data.data[0].zone_code],
              });
            }
          });
        });
      }
    });
  }
  showLocationModal = () => {
    this.props.showLocationModal();
  }
  handleVisibleChange = (visible) => {
    this.setState({ visible });
  }
  handleZoneClick = (item) => {
    this.props.switchZone(this.props.zoneList.find(zone => zone.zone_code === item.key));
    this.setState({ selectedRowKeys: [] });
  }
  handleDeleteLocation = (row) => {
    this.props.deleteLocation(row.id).then((result) => {
      if (!result.error) {
        message.info('库位已删除');
        this.handleLocationReload();
      }
    });
  }
  handleDeleteZone = () => {
    const whseCode = this.props.warehouse.code;
    const zoneCode = this.props.currentZone.zone_code;
    this.props.deleteZone(whseCode, zoneCode).then((result) => {
      if (!result.error) {
        message.info('库区已删除');
        this.props.loadZones(whseCode);
      }
    });
  }
  handleLocBatchDel= () => {
    this.props.deleteLocation(this.state.selectedRowKeys).then((result) => {
      if (!result.error) {
        message.info('库位已删除');
        this.handleLocationReload();
        this.setState({
          selectedRowKeys: [],
        });
      }
    });
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  showZoneModal = () => {
    this.props.showZoneModal();
  }

  handleEditLocation = (row) => {
    this.props.showLocationModal(row);
  }
  handleProductConfig = (row) => {
    this.props.toggleProductConfigModal(true, row);
  }
  locationsUploaded = () => {
    const whseCode = this.props.warehouse.code;
    this.props.loadZones(whseCode).then((result) => {
      if (!result.error) {
        this.handleLocationReload();
      }
    });
  }
  handleSearch = (search) => {
    this.handleLocationReload({ ...this.props.locationFilter, search }, 1, null, true);
    this.setState({ selectedRowKeys: [] });
  }
  handleMenuClick = (ev) => {
    if (ev.key === 'export') {
      this.exportLocations();
    } else if (ev.key === 'edit') {
      this.showZoneModal();
    } else if (ev.key === 'delete') {
      const self = this;
      confirm({
        title: this.msg('deleteConfirm'),
        onOk() {
          self.handleDeleteZone();
        },
        onCancel() {},
      });
    }
  }
  exportLocations = () => {
    const whseCode = this.props.warehouse.code;
    window.open(`${API_ROOTS.default}v1/cwm/export/locations/${createFilename('locations')}.xlsx?whseCode=${whseCode}`);
  }
  locationColumns = [{
    title: '库位编号',
    dataIndex: 'location',
    key: 'location',
  }, {
    title: '库位类型',
    dataIndex: 'type',
    key: 'type',
    render: o => (CWM_LOCATION_TYPES.find(item => item.value === o) ? CWM_LOCATION_TYPES.find(item => item.value === o).text : ''),
  }, {
    title: '库位状态',
    dataIndex: 'status',
    key: 'status',
    render: o => (CWM_LOCATION_STATUS.find(item => item.value === o) ? CWM_LOCATION_STATUS.find(item => item.value === o).text : ''),
  }, {
    title: '最后修改时间',
    dataIndex: 'last_updated_date',
    width: 120,
    render: o => o && moment(o).format('YYYY.MM.DD HH:mm'),
  }, {
    title: '创建时间',
    dataIndex: 'created_date',
    width: 120,
    render: o => o && moment(o).format('YYYY.MM.DD HH:mm'),
  }, {
    title: '操作',
    width: 80,
    render: record => (
      <span>
        <PrivilegeCover module="cwm" feature="settings" action="edit">
          <RowAction onClick={this.handleProductConfig} icon="database" row={record} />
        </PrivilegeCover>
        <PrivilegeCover module="cwm" feature="settings" action="edit">
          <RowAction onClick={this.handleEditLocation} icon="edit" row={record} />
        </PrivilegeCover>
        <PrivilegeCover module="cwm" feature="settings" action="delete">
          <RowAction danger confirm="确定删除?" onConfirm={this.handleDeleteLocation} icon="delete" row={record} />
        </PrivilegeCover>
      </span>
    ),
  }]
  msg = formatMsg(this.props.intl)
  handleDownloadTemp = () => {
    window.open(`${API_ROOTS.default}v1/cwm/export/locations/${createFilename('库区库位导入模板')}.xlsx?isTemp=${true}`);
  }
  render() {
    const {
      form: { getFieldDecorator }, zoneList, locations, locationLoading, warehouse,
      locationStat, locationFilter, currentZone: zone,
    } = this.props;
    const {
      selectedRowKeys, pagination,
    } = this.state;
    const { search } = locationFilter;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      selections: [{
        key: 'all-data',
        text: '全选',
        onSelect: () => {
          this.setState({ selectedRowKeys: this.props.locationStat.locationIds });
        },
      }, {
        key: 'clear-selected',
        text: '清空',
        onSelect: () => {
          this.setState({ selectedRowKeys: [] });
        },
      }],
      onSelection: this.onSelection,
    };
    const zonePopoverContent = (
      <Form layout="vertical">
        <FormItem>
          {
            getFieldDecorator('zoneCode', {
              rules: [{ required: true, message: 'please input zoneCode' }],
            })(<Input placeholder="库区编号" />)
          }
        </FormItem>
        <FormItem>
          {
            getFieldDecorator('zoneName', {
              rules: [{ required: true, message: 'please input zoneName' }],
            })(<Input placeholder="库区描述" />)
          }
        </FormItem>
        <FormItem>
          <Button type="primary" style={{ width: '100%' }} onClick={this.createZone}>创建</Button>
        </FormItem>
      </Form>);
    const toolbarActions = <SearchBox key="searchbox" value={search} placeholder={this.msg('locationPh')} onSearch={this.handleSearch} />;
    const toolbarExtra = (<span>
      <PrivilegeCover module="cwm" feature="settings" action="create" key="createLoc">
        {zoneList.length > 0 && <Button type="primary" icon="plus-circle" onClick={this.showLocationModal}>
          {this.msg('createLocation')}
        </Button>}
      </PrivilegeCover>
      {zoneList.length > 0 &&
      <Dropdown overlay={<Menu onClick={this.handleMenuClick} placement="bottomLeft">
        <Menu.Item key="export"><Icon type="export" /> {this.msg('exportLocations')}</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="edit"><Icon type="edit" /> {this.msg('editZone')}</Menu.Item>
        <Menu.Item key="delete"><Icon type="delete" /> {this.msg('deleteZone')}</Menu.Item>
      </Menu>}
      >
        <Button>{this.msg('more')}<Icon type="caret-down" /></Button>
      </Dropdown>}
    </span>);
    return (
      <Layout>
        <Sider className="nav-sider">
          <div className="nav-sider-head">
            <PrivilegeCover module="cwm" feature="settings" action="edit">
              <ExcelUploader
                endpoint={`${API_ROOTS.default}v1/cwm/warehouse/locations/import`}
                formData={{
                  data: JSON.stringify({
                    loginId: this.props.loginId,
                  }),
                }}
                onUploaded={this.locationsUploaded}
              >
                <Button type="primary" icon="upload">
                  导入库区库位
                </Button>
              </ExcelUploader>
            </PrivilegeCover>
            <Button onClick={this.handleDownloadTemp} icon="download" style={{ width: '100%', marginTop: 8 }}>
              下载导入模版
            </Button>
          </div>
          <Menu defaultOpenKeys={['zoneMenu']} mode="inline" selectedKeys={[zone && zone.zone_code]} onClick={this.handleZoneClick}>
            <SubMenu key="zoneMenu" title={<span><LogixIcon type="icon-zone" />库区</span>} >
              {
                zoneList.map(item => (<Menu.Item key={item.zone_code}>
                  <span>{item.zone_code}</span>
                </Menu.Item>))
              }
            </SubMenu>
          </Menu>
          <div className="nav-sider-footer">
            <PrivilegeCover module="cwm" feature="settings" action="create">
              <Popover
                content={zonePopoverContent}
                placement="bottom"
                title={this.msg('createZone')}
                trigger="click"
                visible={this.state.visible}
                onVisibleChange={this.handleVisibleChange}
              >
                <Button type="dashed" icon="plus-circle" >{this.msg('createZone')}</Button>
              </Popover>
            </PrivilegeCover>
          </div>
        </Sider>
        <Content className="nav-content">
          <DataTable
            cardView={false}
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
            toolbarActions={toolbarActions}
            toolbarExtra={toolbarExtra}
            bulkActions={<Popconfirm title="确定删除?" onConfirm={this.handleLocBatchDel} okText="是" cancelText="否">
              <Button type="danger" ghost icon="delete">批量删除库位</Button>
            </Popconfirm>}
            columns={this.locationColumns}
            dataSource={locations}
            rowKey="id"
            loading={locationLoading}
            rowSelection={rowSelection}
            scrollOffset={340}
            pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: locationStat.totalCount,
                showTotal: total => `共 ${total} 条`,
                showSizeChanger: true,
                size: 'small',
                onChange: this.handlePageChange,
                onShowSizeChange: this.handlePageChange,
              }}
          />
          {zone && <LocationModal whseCode={warehouse.code} zoneCode={zone.zone_code} />}
        </Content>
        {zone && <ZoneEditModal
          zone={zone}
          whseCode={warehouse.code}
          stateChange={this.handleStateChange}
        />}
        <WhseLocProductRelModal whseCode={warehouse.code} />
      </Layout>
    );
  }
}
