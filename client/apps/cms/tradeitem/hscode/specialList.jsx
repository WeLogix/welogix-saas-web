import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Input, message } from 'antd';
import { showCiqPanel, loadCategoryHsCode, removeCategoryHsCode, addCategoryHsCode } from 'common/reducers/cmsHsCode';
import DataTable from 'client/components/DataTable';
import SearchBox from 'client/components/SearchBox';
import RowAction from 'client/components/RowAction';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import { formatMsg } from '../message.i18n';
import { HscodeColumns } from './hscodeColumns';
import CiqPane from './CiqPane';

@injectIntl
@connect(
  state => ({
    categoryHscodes: state.cmsHsCode.categoryHscodes,
    listFilter: state.cmsHsCode.categoryHsListFilter,
    loading: state.cmsHsCode.categoryHscodesLoading,
  }),
  {
    loadCategoryHsCode, removeCategoryHsCode, addCategoryHsCode, showCiqPanel,
  }
)

export default class HSCodeSpecialList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    categoryHscodes: PropTypes.shape({ categoryId: PropTypes.number }).isRequired,
    hscodeCategory: PropTypes.shape({ id: PropTypes.number }).isRequired,
    loadCategoryHsCode: PropTypes.func.isRequired,
    removeCategoryHsCode: PropTypes.func.isRequired,
    addCategoryHsCode: PropTypes.func.isRequired,
  }
  state = {
    hscode: '',
  }
  componentDidMount() {
    this.handleTableLoad();
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.hscodeCategory.id !== nextProps.hscodeCategory.id) {
      const newFilter = {
        search: '',
        categoryId: nextProps.hscodeCategory.id,
      };
      this.handleTableLoad(1, null, newFilter);
    }
  }
  msg = formatMsg(this.props.intl)
  handleHscodeChange = (e) => {
    this.setState({ hscode: e.target.value });
  }
  handleAdd = () => {
    const { hscode } = this.state;
    const { hscodeCategory } = this.props;
    if (hscodeCategory.id) {
      this.props.addCategoryHsCode(hscodeCategory.id, hscode).then((result) => {
        if (result.error) {
          message.error(result.error.message, 10);
        } else {
          this.setState({ hscode: '' });
          this.handleTableLoad();
        }
      });
    } else {
      message.error('未选中分类');
    }
  }
  handleTableLoad = (page, size, paramFilter) => {
    const { hscodeCategory, categoryHscodes: { pageSize, current }, listFilter } = this.props;
    const params = {
      pageSize: size || pageSize,
      current: page || current,
      listFilter: paramFilter || { ...listFilter, categoryId: hscodeCategory.id },
    };
    this.props.loadCategoryHsCode(params);
  }
  handleRemove = (row) => {
    this.props.removeCategoryHsCode(row.id).then(() => {
      this.handleTableLoad();
    });
  }
  handleSearch = (value) => {
    const newFilter = { ...this.props.listFilter, search: value };
    this.handleTableLoad(1, null, newFilter);
  }
  handleCiqPanelView = (row) => {
    this.props.showCiqPanel(true, { hscode: row.hscode });
  }
  render() {
    const { hscode } = this.state;
    const { hscodeCategory, listFilter, loading } = this.props;
    const categoryHscodesDataSource = new DataTable.DataSource({
      fetcher: params => this.props.loadCategoryHsCode(params),
      resolve: (result) => {
        if (result.data.length === result.pageSize ||
          (hscodeCategory.judgment_rule && hscodeCategory.judgment_rule !== 'hscode')) {
          return result.data;
        }
        return result.data.concat([{ id: -1 }]);
      },
      getPagination: (result, resolve) => ({
        total: (hscodeCategory.judgment_rule && hscodeCategory.judgment_rule !== 'hscode') ? result.totalCount : result.totalCount + 1,
        current: resolve(hscodeCategory.judgment_rule && hscodeCategory.judgment_rule !== 'hscode' ? result.totalCount : result.totalCount + 1, result.current, result.pageSize),
        showSizeChanger: true,
        showQuickJumper: false,
        pageSize: result.pageSize,
        showTotal: total => `共 ${total} 条`,
      }),
      getParams: (pagination) => {
        const params = {
          pageSize: pagination.pageSize,
          current: pagination.current,
          listFilter,
        };
        return params;
      },
      remotes: this.props.categoryHscodes,
    });

    const columns = HscodeColumns({
      handleCiqPanelView: this.handleCiqPanelView,
    }).concat([{
      dataIndex: 'option',
      key: 'option',
      title: '操作',
      fixed: 'right',
      width: 60,
      render: (col, row) => {
        if (hscodeCategory.judgment_rule && hscodeCategory.judgment_rule !== 'hscode') return null;
        if (row.id === -1) {
          return (<PrivilegeCover module="clearance" feature="compliance" action="edit">
            <RowAction onClick={this.handleAdd} icon="save" />
          </PrivilegeCover>);
        }
        return (<PrivilegeCover module="clearance" feature="compliance" action="delete">
          <RowAction confirm="确认删除?" onConfirm={this.handleRemove} icon="delete" row={row} />
        </PrivilegeCover>);
      },
    }]);
    columns[0].width = 150;
    columns[0].render = (col, row) => {
      if (row.id === -1) {
        return <Input value={hscode} onChange={this.handleHscodeChange} style={{ width: '90%' }} />;
      }
      return col;
    };
    const toolbarActions = (<span><SearchBox
      value={listFilter.search}
      placeholder="编码/名称/描述/申报要素"
      onSearch={this.handleSearch}
    /></span>);


    return [
      <DataTable toolbarActions={toolbarActions} dataSource={categoryHscodesDataSource} columns={columns} rowKey="id" bordered loading={loading} key="datatable" />,
      <CiqPane key="ciqpane" />,
    ];
  }
}
