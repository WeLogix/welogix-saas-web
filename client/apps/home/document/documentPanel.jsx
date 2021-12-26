import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Drawer, Icon } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { hideDocumentPanel } from 'common/reducers/saasInfra';
import { setNavTitle } from 'common/reducers/navbar';
import ClientFolder from './clientFolder';
import EditFolderModal from './modal/editFolderModal';
import DocTaskPanel from './panel/docTaskPanel';
import { formatMsg } from '../message.i18n';

@injectIntl
@connect(
  state => ({
    visible: state.saasInfra.documentPanelVisible,
    aspect: state.account.aspect,
  }),
  {
    hideDocumentPanel, setNavTitle,
  }
)
export default class DocumentPanel extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
  }
  state = {
    navList: [],
  }
  msg = formatMsg(this.props.intl)
  handleClosePanel = () => {
    this.props.hideDocumentPanel();
    this.props.setNavTitle({ dropDown: false });
  }
  handleViewData = (nav) => {
    const navList = [...this.state.navList];
    navList.push(nav);
    this.setState({ navList });
  }
  handleReturnFolder = () => {
    const navList = [...this.state.navList];
    navList.pop();
    this.setState({ navList });
  }
  render() {
    const { visible } = this.props;
    const { navList } = this.state;
    const drawerTitle = (<span>
      <Icon type="arrow-left" onClick={this.handleReturnFolder} /> {['资料列表'].concat(navList.map(f => f.doc_name)).join('/')}
    </span>);
    const currentFolder = navList[navList.length - 1];
    const parentFolderId = currentFolder ? currentFolder.id : null;
    return (
      <Drawer
        title={drawerTitle}
        placement="top"
        visible={visible}
        onClose={this.handleClosePanel}
        getContainer={() => document.getElementById('module-layout')}
        height="100%"
        style={{ position: 'absolute', zIndex: 50, bottom: 0 }}
      >
        <ClientFolder
          viewData={this.handleViewData}
          parentFolderId={parentFolderId}
        />
        <EditFolderModal parentFolder={currentFolder} />
        <DocTaskPanel folderId={parentFolderId} />
      </Drawer>
    );
  }
}
