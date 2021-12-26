import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Tooltip } from 'antd';
import DataTable from '../DataTable';
import toolbar from './toolbar';
import actions from './actions';
import extra from './extra';
import BulkActions from './bulkActions';
import './style.less';

export const OffsetContext = React.createContext({
  upstreamOffset: false,
});

@connect(state => ({
  topPanelHeight: state.navbar.sidePanelInfo.topPanelHeight,
}))
export default class DataPane extends React.Component {
  static propTypes = {
    preCls: PropTypes.string,
    children: PropTypes.node,
    header: PropTypes.string,
    // fullscreen: PropTypes.bool,
    scrollOffset: PropTypes.number,
    bulkActions: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
    selectedRowKeys: PropTypes.arrayOf(PropTypes.string),
    onDeselectRows: PropTypes.func,
    onFilterSelected: PropTypes.func,
  }
  static contextTypes = {
    fullscreen: PropTypes.bool,
  }
  static defaultProps = {
    preCls: 'welo-data-pane',
    scrollOffset: 340,
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext.fullscreen !== this.context.fullscreen) {
      if (nextContext.fullscreen) {
        //
      } else {
        //
      }
    }
  }
  render() {
    const {
      preCls, children, header, pagination, topPanelHeight, scrollOffset,
      selectedRowKeys, onDeselectRows, onFilterSelected, bulkActions,
    } = this.props;
    return (
      <div className={preCls}>
        {header ? <div className={`${preCls}-header`}>{header}</div> : null}
        {children}
        <OffsetContext.Consumer>
          {context => (
            <DataTable
              {...this.props}
              pagination={pagination || {
                defaultPageSize: 20,
                showSizeChanger: true,
                showTotal: total => `共 ${total} 条`,
              }}
              showToolbar={false}
              cardView={false}
              scrollOffset={context.upstreamOffset !== false ?
                context.upstreamOffset : scrollOffset + topPanelHeight}
            />
          )}
        </OffsetContext.Consumer>
        {selectedRowKeys &&
          <div className={`${preCls}-toolbar-row-selection ${selectedRowKeys.length === 0 ? 'hide' : ''}`}>
            <Tooltip title="取消选择" placement="top">
              <Button type="primary" ghost size="small" shape="circle" icon="close" onClick={onDeselectRows} />
            </Tooltip>
            <span className={`${preCls}-toolbar-row-selection-text`}>
              已选中<a onClick={onFilterSelected}>{selectedRowKeys.length}</a>项
            </span>
            {bulkActions}
          </div>}
      </div>
    );
  }
}

DataPane.Toolbar = toolbar;
DataPane.Actions = actions;
DataPane.Extra = extra;
DataPane.BulkActions = BulkActions;
