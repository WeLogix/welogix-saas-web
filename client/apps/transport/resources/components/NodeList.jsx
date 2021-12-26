import React from 'react';
import PropTypes from 'prop-types';
import { Card, Menu, Button, Layout, Radio, Popconfirm } from 'antd';
import DataTable from 'client/components/DataTable';
import PageHeader from 'client/components/PageHeader';
import { Link } from 'react-router';
import NavLink from 'client/components/NavLink';
import SearchBox from 'client/components/SearchBox';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import { addUniqueKeys } from 'client/util/dataTransform';
import * as Location from 'client/util/location';
import { nodeTypes } from '../utils/dataMapping';
import NodeModal from '../modals/nodeModal';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Content, Sider } = Layout;

const rowSelection = {
  onSelect() {

  },
};

export default function NodeList(props) {
  const {
    onDeleteBtnClick, dataSource, nodeType, onRadioButtonChange, onAddNoteBtnClick,
  } = props;
  const columns = [
    {
      title: '唯一id',
      dataIndex: 'node_id',
      width: 70,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '别名',
      dataIndex: 'byname',
      key: 'byname',
      width: 150,
    },
    {
      title: '外部代码',
      dataIndex: 'node_code',
      key: 'node_code',
      width: 100,
    },
    {
      title: '关联方',
      dataIndex: 'ref_partner_name',
      key: 'ref_partner_name',
      filters: props.partners.map(item => ({ text: item.partner_code ? `${item.partner_code} | ${item.name}` : item.name, value: item.id })),
      render: (col, row) => {
        if (row.ref_partner_id === -1) return '公用';
        return col;
      },
      width: 200,
    },
    {
      title: '省/城市/县区',
      dataIndex: 'region',
      key: 'region',
      render: (col, row) => Location.renderLocation(row),
      width: 170,
    },
    {
      title: '地址/坐标',
      dataIndex: 'addr',
      key: 'addr',
      width: 150,
    },
    {
      title: '联系人',
      dataIndex: 'contact',
      key: 'contact',
      width: 100,
    },
    {
      title: '联系电话',
      dataIndex: 'mobile',
      key: 'mobile',
      width: 100,
    },
    {
      title: '联系邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 100,
    },
    {
      title: '围栏及范围',
      dataIndex: 'geo_longitude',
      key: 'geo_longitude',
      width: 100,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 100,
    },
    {
      title: '操作',
      dataIndex: 'OPS_COL',
      key: 'operations',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <span>
          <PrivilegeCover module="transport" feature="resources" action="edit">
            <Link to={`/transport/resources/node/edit/${record.node_id}`}>修改</Link>
          </PrivilegeCover>
          <span className="ant-divider" />
          <PrivilegeCover module="transport" feature="resources" action="delete">
            <Popconfirm title="确定删除？" onConfirm={() => onDeleteBtnClick(record.node_id)}>
              <a>删除</a>
            </Popconfirm>
          </PrivilegeCover>
        </span>
      ),
    },
  ];
  const toolbarActions = (<span>
    <SearchBox value={props.searchText} placeholder="名称/地址/联系人/电话/邮箱" onSearch={props.onSearch} />
    <RadioGroup defaultValue={nodeType} onChange={e => onRadioButtonChange(e.target.value)} >
      <RadioButton value={0}>发货地</RadioButton>
      <RadioButton value={1}>收货地</RadioButton>
      <RadioButton value={2}>中转地</RadioButton>
    </RadioGroup>
    <PrivilegeCover module="transport" feature="resources" action="create">
      <Button type="primary" onClick={onAddNoteBtnClick} icon="plus-circle-o">新增{nodeTypes[nodeType]}</Button>
    </PrivilegeCover>
  </span>);
  return (
    <Layout>
      <PageHeader breadcrumb={['资源设置', '收发货地']} />
      <Content className="page-content" key="main">
        <Card bodyStyle={{ padding: 0 }}>
          <Layout className="main-wrapper">
            <Sider className="nav-sider">
              <Menu
                defaultSelectedKeys={['location']}
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
                rowSelection={rowSelection}
                columns={columns}
                dataSource={addUniqueKeys(dataSource)}
                onChange={props.handleTableChange}
                scrollOffset={292}
              />
              <NodeModal />
            </Content>
          </Layout>
        </Card>
      </Content>
    </Layout>
  );
}

NodeList.propsTypes = {
  dataSource: PropTypes.array.isRequired,
  nodeType: PropTypes.number.isRequired, // 当前选中的node类型
  onDeleteBtnClick: PropTypes.func.isRequired, // 删除按钮点击时触发的回调函数
  onRadioButtonChange: PropTypes.func.isRequired, // radio button改变时触发的回调函数
  onAddNoteBtnClick: PropTypes.func.isRequired, // 新建按钮点击后执行的回调函数
  onSearch: PropTypes.func.isRequired,
  searchText: PropTypes.string.isRequired,
  partners: PropTypes.array.isRequired,
  handleTableChange: PropTypes.func.isRequired,
};
