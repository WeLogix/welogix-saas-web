import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Avatar, Button, Card, Layout, List } from 'antd';
import { Ellipsis } from 'ant-design-pro';
import PageHeader from 'client/components/PageHeader';
import SearchBox from 'client/components/SearchBox';
import { intlShape, injectIntl } from 'react-intl';
import { toggleBizExportTemplateModal, loadBizExportTemplates, deleteBizExportTemplate } from 'common/reducers/hubDataAdapter';
import RowAction from 'client/components/RowAction';
import CreateModal from './modal/createModal';
import PaaSMenu from '../../menu';
import { formatMsg } from '../message.i18n';

const { Content } = Layout;

@injectIntl
@connect(
  state => ({
    adapterList: state.hubDataAdapter.adapterList,
    pageSize: state.hubDataAdapter.adapterList.pageSize,
    current: state.hubDataAdapter.adapterList.current,
    filter: state.hubDataAdapter.exportListFilter,
  }),
  { toggleBizExportTemplateModal, loadBizExportTemplates, deleteBizExportTemplate }
)
export default class ExportAdapterList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    this.props.loadBizExportTemplates({
      pageSize: this.props.pageSize,
      current: 1,
      filter: {},
    });
  }
  msg = formatMsg(this.props.intl);
  toggleBizExportTemplateModal = () => {
    this.props.toggleBizExportTemplateModal(true);
  }
  handleSearch = (value) => {
    const filter = { ...this.props.filter, searchText: value };
    this.props.loadBizExportTemplates({
      pageSize: this.props.pageSize,
      current: 1,
      filter,
    });
  }
  handleReload = () => {
    const { filter } = this.props;
    this.props.loadBizExportTemplates({
      pageSize: this.props.pageSize,
      current: this.props.current,
      filter,
    });
  }
  handleClick = (row) => {
    this.props.toggleBizExportTemplateModal(true, row);
  }
  handleDel = (id) => {
    this.props.deleteBizExportTemplate(id).then((result) => {
      if (!result.error) {
        this.handleReload();
      }
    });
  }
  handleTabChange = (tabKey) => {
    if (tabKey === 'importAdapter') {
      this.context.router.push('/paas/adapter');
    }
  }
  render() {
    const { adapterList, filter } = this.props;
    const pagination = {
      hideOnSinglePage: true,
      pageSize: Number(adapterList.pageSize),
      current: Number(adapterList.current),
      total: adapterList.total,
      showTotal: total => `共 ${total} 条`,
      onChange: (page, pageSize) => {
        this.props.loadBizExportTemplates({
          pageSize,
          current: page,
          filter,
        });
      },
    };
    const menus = [
      {
        key: 'importAdapter',
        menu: this.msg('importAdapter'),
      },
      {
        key: 'exportAdapter',
        menu: this.msg('exportAdapter'),
        default: true,
      },
    ];
    return (
      <Layout>
        <PaaSMenu currentKey="adapter" openKey="bizObject" />
        <Layout>
          <PageHeader title={this.msg('bizExport')} menus={menus} onTabChange={this.handleTabChange}>
            <PageHeader.Actions>
              <Button type="primary" icon="plus" onClick={this.toggleBizExportTemplateModal}>
                {this.msg('createBizExportTemplate')}
              </Button>
            </PageHeader.Actions>
          </PageHeader>
          <Content className="page-content">
            <Card>
              <List
                grid={{
                  gutter: 16, column: 4,
                }}
                split={false}
                dataSource={this.props.adapterList.data}
                header={<SearchBox placeholder={this.msg('search')} onSearch={this.handleSearch} style={{ width: 300 }} />}
                pagination={pagination}
                renderItem={item => (
                  <List.Item key={item.id}>
                    <Card
                      hoverable
                      className="list-item-card"
                    >
                      <RowAction onDelete={() => this.handleDel(item.id)} row={item} />
                      <Card.Meta
                        avatar={<Avatar size="large" icon="file-excel" />}
                        title={item.name}
                        description={<Ellipsis lines={1}>{item.title || <span className="text-disabled">暂无描述</span>}</Ellipsis>}
                        onClick={() => this.handleClick(item)}
                      />
                    </Card>
                  </List.Item>
                  )}
              />
            </Card>
            <CreateModal />
          </Content>
        </Layout>
      </Layout>
    );
  }
}
