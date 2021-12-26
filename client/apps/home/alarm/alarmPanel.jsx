import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, Drawer, Layout } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import SearchBox from 'client/components/SearchBox';
import { turnFullRiskAlarmPanel } from 'common/reducers/saasInfra';
import { setNavTitle } from 'common/reducers/navbar';
import AlarmList from './alarmList';
import { formatMsg } from '../message.i18n';

const { Content, Sider } = Layout;

@injectIntl
@connect(
  state => ({
    visible: state.saasInfra.riskAlarmPanel.fulPanelVisible,
  }),
  {
    turnFullRiskAlarmPanel, setNavTitle,
  }
)
export default class AlarmPanel extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
  }
  msg = formatMsg(this.props.intl)
  handleClosePanel = () => {
    this.props.turnFullRiskAlarmPanel(false);
    this.props.setNavTitle({ dropDown: false });
  }
  handleSearch = () => {}
  render() {
    const { visible } = this.props;
    return (
      <Drawer
        title={this.msg('alarms')}
        placement="top"
        visible={visible}
        onClose={this.handleClosePanel}
        getContainer={() => document.getElementById('module-layout')}
        height="100%"
        style={{ position: 'absolute', zIndex: 50, bottom: 0 }}
      >
        <Card bodyStyle={{ padding: 0 }}>
          <Layout className="main-wrapper">
            <Sider width={400} className="nav-sider">
              <div className="nav-sider-head">
                <SearchBox
                  onSearch={this.handleSearch}
                  placeholder={this.msg('userSearchPlaceHolder')}
                />
              </div>
              <div className="nav-sider-body">
                <AlarmList />
              </div>
            </Sider>
            <Content className="nav-content" />
          </Layout>
        </Card>
      </Drawer>
    );
  }
}
