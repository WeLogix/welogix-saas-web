import React from 'react';
import PropTypes from 'prop-types';
import { Table, Tooltip, Button, Popover, message } from 'antd';
import classNames from 'classnames';
import update from 'immutability-helper';
import SearchBox from 'client/components/SearchBox';
import { Resizable } from 'react-resizable';
import SelectItem from './selectItem';
// import AnimTableBody from './animTableBody';
import './style.less';

function noop() {
}
function isLocalDataSource(dataSource) {
  return Array.isArray(dataSource);
}
function resolveCurrent(total, current, pageSize) {
  // 删除完一页时返回上一页
  return total > 0 && (current - 1) * pageSize === total ? current - 1 : current;
}
export function ResizeableTitle(props) {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      axis="x"
      onResize={onResize}
      minConstraints={[60, 0]}
      maxConstraints={[800, 0]}
    >
      <th {...restProps} />
    </Resizable>
  );
}

ResizeableTitle.propTypes = {
  onResize: PropTypes.func,
  width: PropTypes.number,
};

class DataSource {
  init(config) {
    this.fetcher = config.fetcher || noop;
    this.resolve = config.resolve || noop;
    this.getParams = config.getParams || noop;
    this.getPagination = config.getPagination || noop;
    this.extraParams = config.extraParams || {};
    this.needUpdate = config.needUpdate || false;
    this.remotes = config.remotes || {}; // 远程返回数据
  }

  constructor(config) {
    if (config) {
      this.init(config);
    }
  }
}

class DataTable extends React.Component {
  static propTypes = {
    baseCls: PropTypes.string,
    scrollOffset: PropTypes.number,
    dataSource: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.instanceOf(DataSource),
    ]),
    node: PropTypes.node,
    toolbarActions: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
    toolbarExtra: PropTypes.node,
    bulkActions: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
    selectedRowKeys: PropTypes.arrayOf(PropTypes.string),
    onDeselectRows: PropTypes.func,
    onSearch: PropTypes.func,
    searchTips: PropTypes.string,
    cardView: PropTypes.bool,
    fixedBody: PropTypes.bool,
    noSetting: PropTypes.bool,
    total: PropTypes.node,
    paginationSize: PropTypes.string,
    showToolbar: PropTypes.bool,
    minWidth: PropTypes.number,
    storageSlug: PropTypes.string,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  static defaultProps = {
    baseCls: 'welo-data-table',
    fixedBody: true,
    showToolbar: true,
    cardView: true,
    scrollOffset: 274,
    paginationSize: 'small',
  }
  state = {
    scrollY: null,
    popoverColumns: [],
    tableColumns: [],
    visible: false,
  }
  componentDidMount() {
    if (typeof document !== 'undefined' && typeof window !== 'undefined') {
      this.setState({ scrollY: window.innerHeight - this.props.scrollOffset });
      window.addEventListener('resize', this.onResize, false);
    }
    this.initColumnState(this.props.columns);
  }
  componentWillReceiveProps(nextProps) {
    if (!this.isSameColumns(nextProps.columns, this.props.columns)) {
      this.initColumnState(nextProps.columns);
    }
    if (nextProps.scrollOffset !== this.props.scrollOffset) {
      this.setState({ scrollY: window.innerHeight - nextProps.scrollOffset });
    }
  }
  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize);
    }
  }
  onResize = () => {
    if (typeof window !== 'undefined') {
      this.setState({ scrollY: window.innerHeight - this.props.scrollOffset });
    }
  }
  isSameColumns = (nextColumns, currColumns) => {
    if (nextColumns === currColumns) {
      return true;
    } if (nextColumns.length === currColumns.length) {
      for (let i = 0; i < nextColumns.length; i++) {
        if (nextColumns[i] !== currColumns[i]) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  fetch = (params = {}) => {
    const { dataSource } = this.props;
    const builtinParams = { ...params, ...dataSource.extraParams };
    return dataSource.fetcher(builtinParams);
  }
  handleColumnResize = index => (e, { size }) => {
    this.setState(({ tableColumns }) => {
      const nextColumns = [...tableColumns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return { tableColumns: nextColumns };
    });
  };
  handleTableChange = (pagination, filters, sorter) => {
    const { dataSource, onChange } = this.props;
    if (!isLocalDataSource(dataSource)) {
      const builtinParams = dataSource.getParams.call(this, pagination, filters, sorter);
      this.fetch(builtinParams);
    } else if (onChange) {
      onChange(pagination, filters, sorter);
    }
  }
  handleCheckBoxChange = (index) => {
    const columns = [...this.state.popoverColumns];
    const changeOne = columns.find(column => column.index === index);
    changeOne.checked = !changeOne.checked;
    delete changeOne.fixed;
    let newColumns = [];
    if (!changeOne.checked) {
      newColumns = columns.filter(column => column.index !== index).concat(changeOne);
    } else {
      newColumns = columns.filter(column => column.index !== index);
      const checkedColumns = newColumns.filter(column => column.checked);
      const uncheckedColumns = newColumns.filter(column => !column.checked);
      checkedColumns.push(changeOne);
      newColumns = checkedColumns.concat(uncheckedColumns);
    }
    this.setState({
      popoverColumns: newColumns,
    });
  }
  handleVisibleChange = (visible) => {
    this.setState({ visible });
  }
  handleReset = () => {
    if (window.localStorage) {
      window.localStorage.removeItem(this.renderStorageSlug());
    }

    let popoverColumns = this.props.columns.filter(column =>
      (column.dataIndex !== 'OPS_COL' && column.dataIndex !== 'SPACER_COL'));
    popoverColumns = popoverColumns.map((column, index) => ({
      ...column,
      checked: true,
      index,
    }));
    this.setState({
      tableColumns: this.props.columns,
      popoverColumns,
      visible: false,
    });
    message.info('列表视图已重置');
  }
  handleSave = () => {
    const tableColumns = [...this.state.tableColumns];
    const popoverColumns = [...this.state.popoverColumns];
    let columns = popoverColumns.filter(column => column.checked);
    const operation = tableColumns.filter(column =>
      (column.dataIndex === 'OPS_COL' || column.dataIndex === 'SPACER_COL'));
    if (operation) { columns = columns.concat(operation); }
    const newColumns = columns.map(column => ({ ...column }));
    this.setState({
      tableColumns: newColumns,
      visible: false,
    });
    if (window.localStorage) {
      const popoverStorage = popoverColumns.map(column =>
        ({ dataIndex: column.dataIndex, fixed: column.fixed, checked: column.checked }));
      const tableStorage = newColumns.map(column =>
        ({ dataIndex: column.dataIndex, fixed: column.fixed, checked: column.checked }));
      const obj = { popoverStorage, tableStorage };
      window.localStorage.setItem(this.renderStorageSlug(), JSON.stringify(obj));
    }
    message.info('列表视图已更新');
  }
  moveSelect = (dragIndex, hoverIndex) => {
    let popoverColumns = [...this.state.popoverColumns];
    const dragSelect = popoverColumns[dragIndex];
    const state = update(this.state, {
      popoverColumns: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragSelect],
        ],
      },
    });
    popoverColumns = state.popoverColumns.map((column) => {
      const newColumn = column;
      delete newColumn.fixed;
      return newColumn;
    });
    this.setState({ popoverColumns });
  }
  fixedColumns = (index) => {
    const popoverColumns = [...this.state.popoverColumns];
    const position = popoverColumns.findIndex(column => column.index === index);
    for (let i = 0; i < popoverColumns.length; i++) {
      const column = popoverColumns[i];
      if (i <= position) {
        column.fixed = 'left';
      } else {
        delete column.fixed;
      }
    }
    this.setState({ popoverColumns });
  }
  initColumnState = (columns) => {
    let location = {};
    if (this.context.router) {
      ({ location } = this.context.router);
    }
    let columnRule;
    if (window.localStorage && location) {
      columnRule = JSON.parse(window.localStorage.getItem(this.renderStorageSlug()));
    }
    const columnsMap = new Map();
    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      columnsMap.set(col.dataIndex || '', col);
    }
    if (columnRule && !this.props.noSetting) {
      const newTableColumns = [];
      const newPopoverColumns = [];
      for (let i = 0; i < columnRule.tableStorage.length; i++) {
        const item = columnRule.tableStorage[i];
        const currentOne = columnsMap.get(item.dataIndex || '');
        if (currentOne) {
          currentOne.index = i;
          newTableColumns.push(currentOne);
        }
      }
      for (let i = 0; i < columnRule.popoverStorage.length; i++) {
        const item = columnRule.popoverStorage[i];
        const currentOne = columnsMap.get(item.dataIndex || '');
        if (currentOne) {
          currentOne.index = i;
          currentOne.checked = item.checked;
          newPopoverColumns.push(currentOne);
        }
      }
      this.setState({
        tableColumns: newTableColumns,
        popoverColumns: newPopoverColumns,
      });
    } else {
      const tableColumns = columns.map((column, index) => ({
        ...column,
        index,
      }));
      let popoverColumns = columns.filter(column =>
        (column.dataIndex !== 'OPS_COL' && column.dataIndex !== 'SPACER_COL'));
      popoverColumns = popoverColumns.map((column, index) => ({
        ...column,
        checked: true,
        index,
      }));
      this.setState({
        tableColumns,
        popoverColumns,
      });
    }
  }
  renderStorageSlug = () => {
    let location = {};
    if (this.context.router) {
      ({ location } = this.context.router);
    }
    return `${location.pathname}#${this.props.storageSlug || ''}`;
  }
  render() {
    const {
      baseCls, cardView, fixedBody, noSetting, paginationSize, minWidth,
      selectedRowKeys, onDeselectRows, bulkActions, rowSelection,
      showToolbar, toolbarActions, onSearch, searchTips, toolbarExtra,
    } = this.props;
    let { dataSource } = this.props;
    let { pagination } = this.props;
    if (dataSource && !isLocalDataSource(dataSource)) {
      const data = dataSource.resolve(dataSource.remotes);
      pagination = pagination !== false ? {
        ...pagination,
        ...dataSource.getPagination(dataSource.remotes, resolveCurrent),
      } : pagination;
      dataSource = data;
    }
    if (pagination) {
      pagination.size = paginationSize;
    } else if (pagination !== false) {
      pagination = { size: paginationSize };
    }
    let scrollProp;
    if (this.state.scrollY) {
      scrollProp = this.props.scroll ? { ...this.props.scroll, y: this.state.scrollY } :
        {
          x: (dataSource && dataSource.length === 0) ? false
            : (minWidth || (this.state.tableColumns.reduce((acc, cur) =>
              acc + (cur.width ? cur.width : 100), 0))),
          y: this.state.scrollY,
        };
    }
    const content = this.state.popoverColumns.map((column, index) => (
      <SelectItem
        id={index}
        key={column.index}
        index={column.index}
        checked={column.checked}
        title={column.title}
        moveSelect={this.moveSelect}
        onChange={this.handleCheckBoxChange}
        onFixed={this.fixedColumns}
        fixed={column.fixed}
      />));
    content.push(<div className="col-selection-actions" key="col-sel-buttons">
      <Button size="small" type="primary" style={{ marginRight: 8 }} onClick={this.handleSave}>确定</Button>
      <Button size="small" onClick={this.handleReset}>重置</Button>
    </div>);
    const classes = classNames(baseCls, {
      [`${baseCls}-no-border`]: !cardView,
    });
    const bodyClasses = classNames(`${baseCls}-body`, {
      [`${baseCls}-body-fixed`]: fixedBody,
    });
    // const animateBody = props => <AnimTableBody {...props} />;
    const columns = this.state.tableColumns.map((col, index) => ({
      ...col,
      onHeaderCell: (column) => {
        if (!column.fixed || column.fixed === 'left') {
          return ({
            width: column.width,
            onResize: this.handleColumnResize(index),
          });
        }
        return null;
      },
    }));
    if (rowSelection && rowSelection.fixed === undefined) {
      rowSelection.fixed = true;
    }
    return (
      <div className={classes} id="welo-data-table">
        {showToolbar &&
        <div className={`${baseCls}-toolbar`}>
          {onSearch && <SearchBox placeholder={searchTips} onSearch={onSearch} />}
          {toolbarActions}
          {toolbarExtra}
        </div>}
        <div className={bodyClasses}>
          {!noSetting &&
          <div className={`${baseCls}-setting`}>
            <Popover
              placement="bottomRight"
              trigger="click"
              title="选择、排序显示字段"
              content={<div className="col-selection">{content}</div>}
              visible={this.state.visible}
              onVisibleChange={this.handleVisibleChange}
            >
              <Tooltip title="表头设置">
                <Button shape="circle" icon="setting" />
              </Tooltip>
            </Popover>
          </div>}
          <Table
            {...this.props}
            dataSource={dataSource}
            pagination={pagination}
            onChange={this.handleTableChange}
            scroll={scrollProp}
            columns={columns}
            components={{
              header: {
                cell: ResizeableTitle,
              },
              //  body: { wrapper: animateBody },
            }}
          />
          {selectedRowKeys &&
            <div className={`${baseCls}-body-row-selection ${selectedRowKeys.length === 0 ? 'hide' : ''}`}>
              <h4 className={`${baseCls}-body-row-selection-text`}>
                已选中 <b>{selectedRowKeys.length}</b> 项
              </h4>
              <a onClick={onDeselectRows}>取消</a>
              {bulkActions}
            </div>}
          {this.props.total}
        </div>
      </div>
    );
  }
}

DataTable.DataSource = DataSource;
export default DataTable;
