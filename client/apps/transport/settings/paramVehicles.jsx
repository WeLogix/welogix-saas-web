import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { loadParamVehicles, removeParamVehicle, addParamVehicle, updateParamVehicle } from 'common/reducers/transportSettings';
import withPrivilege from 'client/common/decorators/withPrivilege';
import connectFetch from 'client/common/decorators/connect-fetch';
import connectNav from 'client/common/decorators/connect-nav';
import { Card, Layout, Menu, Icon, Popconfirm, Input, Select, message } from 'antd';
import DataTable from 'client/components/DataTable';
import { format } from 'client/common/i18n/helpers';
import NavLink from 'client/components/NavLink';
import PageHeader from 'client/components/PageHeader';
import messages from './message.i18n';


const formatMsg = format(messages);
const { Content, Sider } = Layout;
const { Option } = Select;

function fetchData({ dispatch, state }) {
  return dispatch(loadParamVehicles(state.account.tenantId));
}

@connectFetch()(fetchData)
@injectIntl
@connect(
  state => ({
    tenantId: state.account.tenantId,
    paramVehicles: state.transportSettings.paramVehicles,
  }),
  {
    loadParamVehicles, removeParamVehicle, addParamVehicle, updateParamVehicle,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'transport',
})
@withPrivilege({ module: 'transport', feature: 'setting', action: 'edit' })
export default class ParamVehicles extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    tenantId: PropTypes.number.isRequired,
    removeParamVehicle: PropTypes.func.isRequired,
    addParamVehicle: PropTypes.func.isRequired,
    updateParamVehicle: PropTypes.func.isRequired,
  }
  state = {
    editId: -2,
    paramVehicles: [],
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      paramVehicles: nextProps.paramVehicles.concat([{
        id: -1, text: '', value: '', kind: null,
      }]),
    });
  }
  msg = key => formatMsg(this.props.intl, key)
  handleEdit = (id) => {
    const { paramVehicles } = this.state;
    const vehicle = paramVehicles.find(item => item.id === id);
    if (vehicle && vehicle.text) {
      this.props.updateParamVehicle(vehicle).then(() => {
        this.setState({ editId: -2 });
      });
    } else {
      message.error('名称不能为空');
    }
  }
  handleAdd = () => {
    const { paramVehicles } = this.state;
    const index = paramVehicles.length - 1;
    if (paramVehicles[index].text) {
      this.props.addParamVehicle({
        tenant_id: this.props.tenantId,
        value: paramVehicles[index].value,
        text: paramVehicles[index].text,
        kind: paramVehicles[index].kind,
      }).then((result) => {
        if (result.error) {
          message.error(result.error.message, 10);
        } else {
          this.setState({ editId: -2 });
        }
      });
    } else {
      message.error('名称不能为空');
    }
  }
  handleRemove = (record) => {
    this.props.removeParamVehicle(record.id).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      }
    });
  }
  render() {
    const columns = [
      {
        title: '名称',
        dataIndex: 'text',
        key: 'text',
        render: (col, row) => {
          if (this.state.editId === row.id) {
            return (<Input
              value={col}
              onChange={(e) => {
              const paramVehicles = this.state.paramVehicles.map((item) => {
                if (item.id === row.id) {
                  return { ...item, text: e.target.value };
                }
                  return item;
              });
              this.setState({ paramVehicles });
            }}
            />);
          }
          return col;
        },
      }, {
        title: '代码',
        dataIndex: 'value',
        key: 'value',
      }, {
        title: '车型/车长',
        dataIndex: 'kind',
        key: 'kind',
        render: (col, row) => {
          if (this.state.editId === row.id) {
            return (<Select
              value={col}
              onChange={(value) => {
              const paramVehicles = this.state.paramVehicles.map((item) => {
                if (item.id === row.id) {
                  return { ...item, kind: Number(value) };
                }
                  return item;
              });
              this.setState({ paramVehicles });
            }}
              style={{ width: '100%' }}
            >
              <Option value={0}>车型</Option>
              <Option value={1}>车长</Option>
            </Select>);
          } else if (col === 0) return '车型';
          else if (col === 1) return '车长';
          return '';
        },
      }, {
        title: '操作',
        dataIndex: 'OPS_COL',
        key: 'enabled',
        render: (_, row) => {
          if (this.state.editId === row.id) {
            if (row.id === -1) {
              return (<a onClick={this.handleAdd}><Icon type="save" /></a>);
            }
            return (<a onClick={() => this.handleEdit(row.id)}><Icon type="save" /></a>);
          } else if (row.id === -1) {
            return (<a onClick={() => {
              this.setState({ editId: row.id });
            }}
            ><Icon type="plus" />
            </a>);
          }
          return (
            <span>
              <a onClick={() => {
                  this.setState({ editId: row.id });
                }}
              ><Icon type="edit" />
              </a>
              <span className="ant-divider" />
              <Popconfirm title="确认删除?" onConfirm={() => this.handleRemove(row)}>
                <a role="presentation"><Icon type="delete" /></a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];
    return (
      <Layout>
        <PageHeader breadcrumb={[this.msg('appSettings'), '车辆参数']} />
        <Content className="page-content" key="main">
          <Card bodyStyle={{ padding: 0 }}>
            <Layout className="main-wrapper">
              <Sider className="nav-sider">
                <Menu
                  defaultOpenKeys={['bizdata']}
                  defaultSelectedKeys={['paramVehicles']}
                  mode="inline"
                >
                  <Menu.Item key="transportModes"><NavLink to="/transport/settings/transportModes">运输模式</NavLink></Menu.Item>
                  <Menu.Item key="paramVehicles"><NavLink to="/transport/settings/paramVehicles">车型车长</NavLink></Menu.Item>
                </Menu>
              </Sider>
              <Content className="nav-content">
                <DataTable columns={columns} dataSource={this.state.paramVehicles} rowKey="id" cardView={false} scrollOffset={292} />
              </Content>
            </Layout>
          </Card>
        </Content>
      </Layout>
    );
  }
}
