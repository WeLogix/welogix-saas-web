import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, Col, Menu, Row, Tabs, Layout, Table } from 'antd';
import DataTable from 'client/components/DataTable';
import { intlShape, injectIntl } from 'react-intl';
import PageHeader from 'client/components/PageHeader';
import RowAction from 'client/components/RowAction';
import SearchBox from 'client/components/SearchBox';
import { LogixIcon } from 'client/components/FontIcon';
import PaaSMenu from '../../menu';
import { formatMsg } from '../message.i18n';

const { Content, Sider } = Layout;
const { TabPane } = Tabs;

@injectIntl
@connect(
  state => ({
    tenantId: state.account.tenantId,
  }),
  { }
)
// @withPrivilege({ module: 'paas', feature: 'member' })
export default class DWThemeList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
  }
  msg = formatMsg(this.props.intl)
  dwdColumns = []
  modelColumns = [{
    title: this.msg('fieldType'),
    dataIndex: 'type',
    width: 60,
    render: o => o && <LogixIcon type={o} />,
  }, {
    title: this.msg('fieldName'),
    dataIndex: 'name',
  }, {
    dataIndex: 'OPS_COL',
    width: 80,
    render: (o, record) => <RowAction row={record} />,
  }]
  handleSearch = () => {

  }
  handleMenuClick = () => {

  }

  render() {
    const selectMenuKeys = [];
    return (
      <Layout>
        <PaaSMenu currentKey="dataSubject" />
        <Layout>
          <PageHeader title={this.msg('dataSubject')} />
          <Content className="page-content" key="main">
            <Card bodyStyle={{ padding: 0 }}>
              <Layout className="main-wrapper">
                <Sider className="nav-sider">
                  <div className="nav-sider-head">
                    <SearchBox
                      onSearch={this.handleSearch}
                    />
                  </div>
                  <Menu
                    mode="inline"
                    selectedKeys={selectMenuKeys}
                    onClick={this.handleMenuClick}
                  >
                    <Menu.Item key="TRADING_ITEM">进出口明细(料号级)</Menu.Item>
                    <Menu.Item key="CUSDECL_ITEM">海关申报明细(项号级)</Menu.Item>
                  </Menu>
                </Sider>
                <Content className="nav-content">
                  <Tabs>
                    <TabPane tab={this.msg('model')} key="model">
                      <Row gutter={16} style={{ padding: 16 }}>
                        <Col span={12}>
                          <Card size="small" title={this.msg('dimension')} bodyStyle={{ padding: 0, paddingTop: 1 }}>
                            <Table
                              size="middle"
                              columns={this.modelColumns}
                            />
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card size="small" title={this.msg('measure')} bodyStyle={{ padding: 0, paddingTop: 1 }}>
                            <Table
                              size="middle"
                              columns={this.modelColumns}
                            />
                          </Card>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tab={this.msg('dwd')} key="dwd">
                      <DataTable
                        cardView={false}
                        columns={this.dwdColumns}
                        showToolbar={false}
                      />
                    </TabPane>
                  </Tabs>
                </Content>
              </Layout>
            </Card>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
