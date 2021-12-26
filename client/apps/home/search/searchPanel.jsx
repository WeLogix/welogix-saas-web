import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Drawer, Empty } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { hideSearchPanel } from 'common/reducers/saasInfra';
import { setNavTitle } from 'common/reducers/navbar';
import { formatMsg } from '../message.i18n';

@injectIntl
@connect(
  state => ({
    visible: state.saasInfra.searchPanelVisible,
  }),
  {
    hideSearchPanel, setNavTitle,
  }
)
export default class SearchPanel extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
  }
  msg = formatMsg(this.props.intl)
  handleClosePanel = () => {
    this.props.hideSearchPanel();
    this.props.setNavTitle({ dropDown: false });
  }
  render() {
    const { visible } = this.props;
    return (
      <Drawer
        title={this.msg('search')}
        placement="top"
        visible={visible}
        onClose={this.handleClosePanel}
        getContainer={() => document.getElementById('module-layout')}
        height="100%"
        style={{ position: 'absolute', zIndex: 50, bottom: 0 }}
      >
        <Empty description="Coming soon..." />
      </Drawer>
    );
  }
}
