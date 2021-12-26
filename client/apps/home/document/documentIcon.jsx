import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Badge, Icon } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { showDocumentPanel, hideDocumentPanel } from 'common/reducers/saasInfra';
import { setNavTitle } from 'common/reducers/navbar';
import { formatMsg } from '../message.i18n';

@injectIntl
@connect(state => ({
  navTitle: state.navbar.navTitle,
  visible: state.saasInfra.documentPanelVisible,
}), {
  showDocumentPanel, hideDocumentPanel, setNavTitle,
})
export default class DocumentIcon extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  msg = formatMsg(this.props.intl)
  togglePanel = () => {
    if (this.props.visible) {
      this.props.hideDocumentPanel();
      this.props.setNavTitle({ dropDown: false });
    } else {
      this.props.showDocumentPanel();
      this.props.setNavTitle({ dropDown: true });
    }
  }
  render() {
    const { visible } = this.props;
    return (
      <div onClick={this.togglePanel} className={visible ? 'active' : ''}>
        <Badge overflowCount={99} style={{ backgroundColor: '#1890ff' }}>
          <Icon type={visible ? 'folder-open' : 'folder'} />
        </Badge>
      </div>
    );
  }
}
