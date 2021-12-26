import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Card, Layout, List } from 'antd';
import { Ellipsis } from 'ant-design-pro';
import PageHeader from 'client/components/PageHeader';
import SearchBox from 'client/components/SearchBox';
import { intlShape, injectIntl } from 'react-intl';
import { toggleTemplateModal, loadTemplates, deleteTemplate } from 'common/reducers/template';
import RowAction from 'client/components/RowAction';
import PaaSMenu from '../../menu';
import CreateModal from './modal/createModal';
import { formatMsg } from '../../message.i18n';

const { Content } = Layout;

@injectIntl
@connect(
  state => ({
    templates: state.template.templates,
    pageSize: state.template.templates.pageSize,
    current: state.template.templates.current,
    filter: state.template.filter,
  }),
  { toggleTemplateModal, loadTemplates, deleteTemplate }
)
export default class NoticeTemplateList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    this.props.loadTemplates({
      pageSize: this.props.pageSize,
      current: 1,
      filter: JSON.stringify({}),
    });
  }
  msg = formatMsg(this.props.intl);
  toggleTemplateModal = () => {
    this.props.toggleTemplateModal(true);
  }
  handleSearch = (value) => {
    const filter = { ...this.props.filter, searchText: value };
    this.props.loadTemplates({
      pageSize: this.props.pageSize,
      current: 1,
      filter: JSON.stringify(filter),
    });
  }
  handleReload = () => {
    const { filter } = this.props;
    this.props.loadTemplates({
      pageSize: this.props.pageSize,
      current: this.props.current,
      filter: JSON.stringify(filter),
    });
  }
  handleClick = (row) => {
    this.props.toggleTemplateModal(true, row);
  }
  handleDel = (id) => {
    this.props.deleteTemplate(id).then((result) => {
      if (!result.error) {
        this.handleReload();
      }
    });
  }
  render() {
    const { templates, filter } = this.props;
    const pagination = {
      hideOnSinglePage: true,
      pageSize: Number(templates.pageSize),
      current: Number(templates.current),
      total: templates.total,
      showTotal: total => `共 ${total} 条`,
      onChange: (page, pageSize) => {
        this.props.loadTemplates({
          pageSize,
          current: page,
          filter: JSON.stringify(filter),
        });
      },
    };
    const menus = [
      {
        key: 'noticeTempl',
        menu: this.msg('noticeTempl'),
        default: true,
      },
      {
        key: 'printTempl',
        menu: this.msg('printTempl'),
      },
    ];
    return (
      <Layout>
        <PaaSMenu currentKey="templates" openKey="bizObject" />
        <Layout>
          <PageHeader menus={menus}>
            <PageHeader.Actions>
              <Button type="primary" icon="plus" onClick={this.toggleTemplateModal}>
                {this.msg('create')}
              </Button>
            </PageHeader.Actions>
          </PageHeader>
          <Content className="page-content">
            <Card
              size="small"
              title={<SearchBox placeholder={this.msg('searchTip')} onSearch={this.handleSearch} />}
            >
              <List
                grid={{
                  gutter: 16, column: 6,
                }}
                split={false}
                dataSource={this.props.templates.data}
                pagination={pagination}
                renderItem={item => (
                  <List.Item key={item.id}>
                    <Card
                      hoverable
                      className="list-item-card"
                    >
                      <RowAction onDelete={() => this.handleDel(item.id)} row={item} />
                      <Card.Meta
                        title={item.name}
                        description={<Ellipsis lines={1}>{item.title || <span className="text-disabled">暂无描述</span>}</Ellipsis>}
                        onClick={() => this.handleClick(item)}
                      />
                    </Card>
                  </List.Item>
                  )}
              />
            </Card>
            <CreateModal reload={this.handleReload} />
          </Content>
        </Layout>
      </Layout>
    );
  }
}
