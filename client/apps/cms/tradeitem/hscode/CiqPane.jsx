import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { Table } from 'antd';
import DockPanel from 'client/components/DockPanel';
import { loadCiqCodeList, showCiqPanel } from 'common/reducers/cmsHsCode';
import { formatMsg } from '../message.i18n';

@injectIntl
@connect(
  state => ({
    ciqPanel: state.cmsHsCode.ciqPanel,
    ciqInfo: state.cmsHsCode.ciqInfo,
  }),
  { loadCiqCodeList, showCiqPanel }
)
export default class CiqPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    hscode: PropTypes.string.isRequired,
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.ciqPanel.visible && nextProps.ciqPanel.visible !== this.props.ciqPanel.visible) {
      nextProps.loadCiqCodeList(nextProps.ciqPanel.hscode);
    }
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('ciqCode'),
    dataIndex: 'ciqcode',
    width: 120,
    align: 'center',
  }, {
    title: this.msg('ciqName'),
    dataIndex: 'ciqname',
    width: 200,
    align: 'center',
  }]
  handleClose=() => {
    this.props.showCiqPanel(false);
  }
  render() {
    const { ciqPanel } = this.props;
    return (
      <div className="pane-content tab-pane table-list">
        <DockPanel
          title="检验检疫列表"
          visible={ciqPanel.visible}
          onClose={this.handleClose}
        >
          <Table
            columns={this.columns}
            dataSource={ciqPanel.ciqcdList}
            showToolbar={false}
          />
        </DockPanel>
      </div>
    );
  }
}
