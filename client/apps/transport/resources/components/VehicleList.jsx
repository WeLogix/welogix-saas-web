import React from 'react';
import PropTypes from 'prop-types';
import { Card, Menu, Layout, Button, Popconfirm } from 'antd';
import DataTable from 'client/components/DataTable';
import PageHeader from 'client/components/PageHeader';
import NavLink from 'client/components/NavLink';
import SearchBox from 'client/components/SearchBox';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import { addUniqueKeys } from 'client/util/dataTransform';
import VehicleModal from '../modals/vehicleModal';

const { Content, Sider } = Layout;
const rowSelection = {
  onSelect() {
  },
};

export default function VehicleList(props) {
  const {
    onAddCarBtnClick, dataSource, onStopCarBtnClick, onResumeCarBtnClick, onEditVehicleBtnClick,
    onRemoveVehicle,
  } = props;

  function editAndStopCarOperations(record) {
    return (
      <PrivilegeCover module="transport" feature="resources" action="edit">
        <span>
          <a
            onClick={() => onEditVehicleBtnClick(record.vehicle_id)}
            disabled={
            record.status === '在途中'
          }
          >
            修改
          </a>
          <span className="ant-divider" />
          <a
            onClick={() => onStopCarBtnClick(record.vehicle_id)}
            disabled={
            record.status === '在途中'
          }
          >
            停用
          </a>
        </span>
      </PrivilegeCover>
    );
  }

  function resumeCarOperaions(record) {
    return (
      <PrivilegeCover module="transport" feature="resources" action="edit">
        <span>
          <a onClick={() => onResumeCarBtnClick(record.vehicle_id)}>
            启用
          </a>
          <span className="ant-divider" />
          <Popconfirm title="确定删除？" onConfirm={() => onRemoveVehicle(record.vehicle_id)}>
            <a>删除</a>
          </Popconfirm>
        </span>
      </PrivilegeCover>
    );
  }

  const columns = [
    {
      title: '车牌号',
      dataIndex: 'plate_number',
      key: 'plaste_number',
    },
    {
      title: '车型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '车长',
      dataIndex: 'length',
      key: 'length',
    },
    {
      title: '载重',
      dataIndex: 'load_weight',
      key: 'load_weight',
    },
    {
      title: '容积',
      dataIndex: 'load_volume',
      key: 'load_volume',
    },
    {
      title: '司机',
      dataIndex: 'driver_name',
      key: 'driver_name',
    },
    {
      title: '连接类型',
      dataIndex: 'connect_type',
      key: 'connect_type',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '操作',
      dataIndex: 'OPS_COL',
      key: 'operations',
      render: (_, record) => {
        if (record.status === '已停用') {
          return resumeCarOperaions(record);
        }
        return editAndStopCarOperations(record);
      },
    },
  ];
  const toolbarActions = (<span>
    <SearchBox value={props.searchText} placeholder="车牌号/司机" onSearch={props.onSearch} />
    <PrivilegeCover module="transport" feature="resources" action="create">
      <Button type="primary" onClick={onAddCarBtnClick} icon="plus-circle-o">新增车辆</Button>
    </PrivilegeCover>
  </span>);
  return (
    <Layout>
      <PageHeader breadcrumb={['资源设置', '车辆']} />
      <Content className="page-content" key="main">
        <Card bodyStyle={{ padding: 0 }}>
          <Layout className="main-wrapper">
            <Sider className="nav-sider">
              <Menu
                defaultSelectedKeys={['vehicle']}
                mode="inline"
              >
                <Menu.Item key="carrier"><NavLink to="/transport/resources/carrier">承运商</NavLink></Menu.Item>
                <Menu.Item key="vehicle"><NavLink to="/transport/resources/vehicle">车辆</NavLink></Menu.Item>
                <Menu.Item key="driver"><NavLink to="/transport/resources/driver">司机</NavLink></Menu.Item>
                <Menu.Item key="location"><NavLink to="/transport/resources/node">收发货地</NavLink></Menu.Item>
              </Menu>
            </Sider>
            <Content className="nav-content">
              <DataTable
                cardView={false}
                toolbarActions={toolbarActions}
                columns={columns}
                dataSource={addUniqueKeys(dataSource)}
                rowSelection={rowSelection}
                scrollOffset={292}
              />
              <VehicleModal />
            </Content>
          </Layout>
        </Card>
      </Content>
    </Layout>
  );
}

VehicleList.propTypes = {
  dataSource: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  onAddCarBtnClick: PropTypes.func.isRequired, // 点击新建车辆时触发的回调函数
  onStopCarBtnClick: PropTypes.func.isRequired, // 停用按钮点击后执行的回调函数
  onResumeCarBtnClick: PropTypes.func.isRequired, // 启用按钮点击后执行的回调函数
  onEditVehicleBtnClick: PropTypes.func.isRequired,
  onRemoveVehicle: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  searchText: PropTypes.string.isRequired,
};
