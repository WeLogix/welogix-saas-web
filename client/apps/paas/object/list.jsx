import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { Layout } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import connectNav from 'client/common/decorators/connect-nav';
import PageHeader from 'client/components/PageHeader';
import DataTable from 'client/components/DataTable';
import RowAction from 'client/components/RowAction';
import UserAvatar from 'client/components/UserAvatar';
import { loadDwObjectMeta } from 'common/reducers/paasBizModelMeta';
import { PAAS_DW_OBJECT_MSG } from 'common/constants';
import PaaSMenu from '../menu';
import { formatMsg } from './message.i18n';

const { Content } = Layout;

@injectIntl
@connect(
  state => ({
    dwObjectMeta: state.paasBizModelMeta.dwObjectList,
  }),
  { loadDwObjectMeta }
)
@connectNav({
  depth: 2,
  moduleName: 'paas',
})
export default class BizObjectList extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    this.props.loadDwObjectMeta();
  }
  handleEdit = (row) => {
    const link = `/paas/object/meta/${row.name}`;
    this.context.router.push(link);
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('dwObjectTitle'),
    dataIndex: 'object_name',
    width: 400,
  }, {
    title: this.msg('lastUpdatedBy'),
    dataIndex: 'last_updated_by',
    key: 'last_updated_by',
    width: 200,
    render: lid => lid && <UserAvatar size="small" loginId={lid} showName />,
  }, {
    title: this.msg('lastUpdatedDate'),
    dataIndex: 'last_updated_date',
    key: 'last_updated_date',
    width: 140,
    render: o => o && moment(o).format('YYYY.MM.DD HH:mm'),
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    width: 60,
    render: (o, record) => <RowAction onClick={this.handleEdit} icon="setting" row={record} />,
  }];
  render() {
    const { dwObjectMeta } = this.props;
    const dataSource = dwObjectMeta.metaList.map(dwom => ({
      name: dwom.bm_object,
      object_name: this.msg(PAAS_DW_OBJECT_MSG[dwom.bm_object].title),
      last_updated_date: dwom.last_updated_date,
      last_updated_by: dwom.last_updated_by,
    }));
    return (
      <Layout>
        <PaaSMenu currentKey="objectMeta" openKey="bizObject" />
        <Layout>
          <PageHeader title={this.msg('objectMeta')} />
          <Content className="page-content">
            <DataTable
              noSetting
              showToolbar={false}
              columns={this.columns}
              dataSource={dataSource}
              rowKey="name"
              pagination={false}
              scroll={{ x: false, y: false }}
              loading={dwObjectMeta.loading}
            />
          </Content>
        </Layout>
      </Layout>
    );
  }
}
