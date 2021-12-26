import React from 'react';
import { connect } from 'react-redux';
import { HeaderSearch } from 'ant-design-pro';
import { intlShape, injectIntl } from 'react-intl';
import { showSearchPanel, hideSearchPanel } from 'common/reducers/saasInfra';
import { setNavTitle } from 'common/reducers/navbar';
import { format } from 'client/common/i18n/helpers';
import messages from '../message.i18n';

const formatMsg = format(messages);

@injectIntl
@connect(state => ({
  navTitle: state.navbar.navTitle,
}), {
  showSearchPanel, hideSearchPanel, setNavTitle,
})
export default class SearchIcon extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }

  msg = (descriptor, values) => formatMsg(this.props.intl, descriptor, values)
  togglePanel = () => {
    if (this.props.visible) {
      this.props.hideSearchPanel();
      this.props.setNavTitle({ dropDown: false });
    } else {
      this.props.showSearchPanel();
      this.props.setNavTitle({ dropDown: true });
    }
  }
  render() {
    return (
      <HeaderSearch
        key="searchInput"
        placeholder="全局搜索"
        dataSource={['Press Enter']}
        onSearch={(value) => {
              console.log('input', value); // eslint-disable-line
            }}
        onPressEnter={this.togglePanel}
      />);
  }
}
