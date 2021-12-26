import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Menu, Layout, Button, Popconfirm } from 'antd';
import DataTable from 'client/components/DataTable';
import PageHeader from 'client/components/PageHeader';
import RowAction from 'client/components/RowAction';
import moment from 'moment';
import NavLink from 'client/components/NavLink';
import SearchBox from 'client/components/SearchBox';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import CarrierModal from '../modals/carrierModal';

const { Content, Sider } = Layout;
const rowSelection = {
  onSelect() {},
};

export default class DriverList extends Component {
  static propTyps = {
    dataSource: PropTypes.array,
    onAddBtnClicked: PropTypes.func.isRequired,
    onStopBtnClick: PropTypes.func.isRequired,
    onDeleteBtnClick: PropTypes.func.isRequired,
    onResumeBtnClick: PropTypes.func.isRequired,
    onEditBtnClick: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    searchText: PropTypes.string.isRequired,
  }
  renderEditAndStopOperations = itemInfo => (
    <PrivilegeCover module="corp" feature="partners" action="edit">
      <RowAction icon="edit" onClick={() => this.props.onEditBtnClick(itemInfo)} />
      <RowAction icon="pause-circle-o" onClick={() => this.props.onStopBtnClick(itemInfo.id)} />
    </PrivilegeCover>
  )

  renderDeleteAndResumeOperations = (itemInfo) => {
    const { id } = itemInfo;
    return (
      <span>
        <PrivilegeCover module="corp" feature="partners" action="delete">
          <Popconfirm title="确定删除？" onConfirm={() => this.props.onDeleteBtnClick(id)}>
            <a>删除</a>
          </Popconfirm>
        </PrivilegeCover>
        <span className="ant-divider" />
        <PrivilegeCover module="corp" feature="partners" action="edit">
          <a onClick={() => this.props.onResumeBtnClick(id)}>启用</a>
        </PrivilegeCover>
      </span>
    );
  }
  render() {
    const { dataSource, onAddBtnClicked } = this.props;

    const columns = [
      {
        title: '承运商名称',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '承运商代码',
        dataIndex: 'partner_code',
        key: 'partner_code',
      }, {
        title: '统一社会信用代码',
        dataIndex: 'partner_unique_code',
        key: 'partner_unique_code',
      }, {
        title: '创建日期',
        dataIndex: 'created_date',
        key: 'created_date',
        render(o) {
          return moment(o).format('YYYY/MM/DD HH:mm');
        },
      }, {
        title: '操作',
        dataIndex: 'OPS_COL',
        key: 'status',
        render: (_, record, index) => {
          if (record.status === 1) {
            return this.renderEditAndStopOperations(record, index);
          }
          return this.renderDeleteAndResumeOperations(record);
        },
      },
    ];
    const toolbarActions = (<span>
      <SearchBox value={this.props.searchText} placeholder="承运商/承运商代码/统一社会信用代码" onSearch={this.props.onSearch} />
      <PrivilegeCover module="transport" feature="resources" action="create">
        <Button type="primary" onClick={onAddBtnClicked} icon="plus-circle-o">新增承运商</Button>
      </PrivilegeCover>
    </span>);
    return (
      <Layout>
        <PageHeader breadcrumb={['资源设置', '承运商']} />
        <Content className="page-content" key="main">
          <Card bodyStyle={{ padding: 0 }}>
            <Layout className="main-wrapper">
              <Sider className="nav-sider">
                <Menu
                  defaultSelectedKeys={['carrier']}
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
                  dataSource={dataSource}
                  columns={columns}
                  rowSelection={rowSelection}
                  scrollOffset={292}
                />
              </Content>
            </Layout>
            <CarrierModal />
          </Card>
        </Content>
      </Layout>
    );
  }
}
