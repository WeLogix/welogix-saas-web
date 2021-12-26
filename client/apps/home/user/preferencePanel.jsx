import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Drawer, Switch, Icon, Radio, Tabs } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import InfoItem from 'client/components/InfoItem';
import { hidePreferencePanel, changeUserLocale, loadTranslation } from 'common/reducers/saasUser';
import { formatMsg } from '../message.i18n';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { TabPane } = Tabs;

@injectIntl
@connect(
  state => ({
    visible: state.saasUser.prefVisible,
    loginId: state.account.loginId,
    locale: state.saasUser.locale,
  }),
  { changeUserLocale, hidePreferencePanel, loadTranslation }
)
export default class PreferencePanel extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
    locale: PropTypes.oneOf(['en', 'zh']),
    changeUserLocale: PropTypes.func.isRequired,
    loadTranslation: PropTypes.func.isRequired,
  }
  msg = formatMsg(this.props.intl)

  handleLocaleChange = (ev) => {
    this.props.loadTranslation(ev.target.value);
    this.props.changeUserLocale(this.props.loginId, ev.target.value);
    this.props.hidePreferencePanel();
  }
  render() {
    const { visible, locale } = this.props;
    return (
      <Drawer
        width={480}
        visible={visible}
        onClose={this.props.hidePreferencePanel}
        title={<span>{this.msg('preference')}</span>}
      >
        <Tabs defaultActiveKey="language">
          <TabPane
            tab={<span><Icon type="global" />{this.msg('preferenceLanguage')}</span>}
            key="language"
          >
            <div className="tab-wrapper">
              <InfoItem
                label={this.msg('labelChooseLanguage')}
                field={<RadioGroup onChange={this.handleLocaleChange} value={locale}>
                  <RadioButton value="zh">简体中文</RadioButton>
                  <RadioButton value="en">English</RadioButton>
                </RadioGroup>}
              />
            </div>
          </TabPane>
          <TabPane
            tab={<span><Icon type="bell" />{this.msg('preferenceNotification')}</span>}
            key="notification"
          >
            <div className="tab-wrapper">
              <InfoItem
                label={this.msg('labelDesktopPush')}
                field={this.msg('descDesktopPush')}
                action={<Switch defaultChecked={false} onChange={this.onChange} />}
              />
            </div>
          </TabPane>
        </Tabs>
      </Drawer>
    );
  }
}
