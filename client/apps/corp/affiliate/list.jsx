import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { Avatar, Card, Form, Layout, Table, Select, Row, Col } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { getUnionTenants, togglebuModal, getUnionBuList, setUnionBu } from 'common/reducers/saasTenant';
import withPrivilege from 'client/common/decorators/withPrivilege';
import PageHeader from 'client/components/PageHeader';
import RowAction from 'client/components/RowAction';
import { TENANT_LEVEL } from 'common/constants';
import AddBuModal from './modal/addBuModal';
import CorpSiderMenu from '../menu';
import { formatMsg } from './message.i18n';

const { Content } = Layout;
const { Option } = Select;

@injectIntl
@withPrivilege({ module: 'corp', feature: 'affiliate' })
@connect(
  state => ({
    unionId: state.account.unionId,
    unionTenants: state.saasTenant.unionTenants,
    unionBus: state.saasTenant.unionBus,
    tenantLevel: state.account.tenantLevel,
  }),
  {
    getUnionTenants, togglebuModal, getUnionBuList, setUnionBu,
  }
)
@Form.create()
export default class CorpAffiliate extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    editItem: {},
  }
  componentDidMount() {
    this.props.getUnionTenants(this.props.unionId);
    this.props.getUnionBuList(this.props.unionId);
  }
  msg = formatMsg(this.props.intl);
  handleAddBu = () => {
    this.props.togglebuModal(true);
  }
  handleEdit = (editItem) => {
    this.setState({
      editItem,
    });
  }
  handleCancel = () => {
    this.setState({
      editItem: {},
    });
  }
  handleSave = (row) => {
    this.props.setUnionBu(row.union_bu_id, row.tenant_id).then((result) => {
      if (!result.error) {
        this.handleCancel();
      }
    });
  }
  handleSelectBu = (value) => {
    const editItem = { ...this.state.editItem };
    editItem.union_bu_id = value;
    this.setState({
      editItem,
    });
  }
  columns = [{
    title: this.msg('seqNo'),
    dataIndex: 'seq_no',
    width: 45,
    align: 'center',
    className: 'table-col-seq',
    render: (col, row, index) => index + 1,
  }, {
    title: this.msg('companyName'),
    dataIndex: 'name',
    width: 250,
  }, {
    title: this.msg('enterpriseCode'),
    dataIndex: 'code',
    width: 200,
  }, {
    title: this.msg('joinedDate'),
    dataIndex: 'union_joined_date',
    width: 150,
    render: o => o && moment(o).format('YYYY-MM-DD'),
  }, {
    title: <span>
      {this.msg('unionBu')}
      {this.props.tenantLevel === TENANT_LEVEL[2].value && this.props.unionId && <RowAction
        shape="circle"
        icon="bars"
        onClick={this.handleAddBu}
        style={{ marginLeft: 8 }}
      />}
    </span>,
    dataIndex: 'union_bu_id',
    render: (o, record) => {
      if (this.state.editItem.tenant_id === record.tenant_id) {
        return (<Select
          value={this.state.editItem.union_bu_id}
          style={{ width: 150 }}
          onSelect={this.handleSelectBu}
        >
          {this.props.unionBus.map(bu => (
            <Option value={bu.id} key={bu.id}>{bu.bu_name}</Option>
          ))}
        </Select>);
      }
      const unionBu = this.props.unionBus.find(bu => bu.id === o);
      return unionBu && unionBu.bu_name;
    },
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OPS_COL',
    width: 120,
    render: (o, record) => {
      if (this.props.tenantLevel === TENANT_LEVEL[2].value && this.props.unionId) {
        if (this.state.editItem.tenant_id === record.tenant_id) {
          return [<RowAction icon="save" onClick={this.handleSave} row={this.state.editItem} />, <RowAction onClick={this.handleCancel} icon="close" />];
        }
        return <RowAction onClick={this.handleEdit} icon="edit" row={record} />;
      }
      return null;
    },
  }]
  render() {
    const { unionTenants, unionId } = this.props;
    return (
      <Layout>
        <CorpSiderMenu currentKey="affiliate" />
        <Layout>
          <PageHeader title={this.msg('affiliate')} />
          <Content className="page-content layout-fixed-width layout-fixed-width-lg" key="main">
            <Card title={this.msg('HQTenant')}>
              <Row type="flex" gutter={16}>
                {unionTenants.filter(tenant => tenant.level === 4).map(tenant =>
                  (<Col span={8}>
                    <Card
                      size="small"
                      style={{ background: '#f5f5f5', marginBottom: 8 }}
                    >
                      <Card.Meta
                        avatar={<Avatar size="large" src={tenant.logo} />}
                        title={tenant.name}
                        description={tenant.code}
                      />
                    </Card>
                  </Col>))}
              </Row>
            </Card>
            <Card title={this.msg('ENTTenant')}>
              <Table
                size="middle"
                columns={this.columns}
                dataSource={unionTenants.filter(ut => ut.level !== 4)}
              />
            </Card>
            <AddBuModal unionId={unionId} />
          </Content>
        </Layout>
      </Layout>
    );
  }
}
