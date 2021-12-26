import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { routerShape, locationShape } from 'react-router';
import { findForemostRoute, hasPermission } from 'client/common/decorators/withPrivilege';
import Navigation from 'client/components/Navigation';
// import AppModuleBase from '../appModuleBase';
import { formatMsg } from './message.i18n';

@injectIntl
@connect(
  state => ({
    aspect: state.account.aspect,
    opencode: state.account.opencode,
    privileges: state.account.privileges,
    disApps: state.account.apps.dis,
  }),
  {}
)
export default class ModuleDIS extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    privileges: PropTypes.shape({
      module_id: PropTypes.string,
      feature_id: PropTypes.string,
      action_id: PropTypes.string,
    }).isRequired,
    location: locationShape.isRequired,
    children: PropTypes.node,
  };
  static contextTypes = {
    router: routerShape.isRequired,
  }
  state = {
    linkMenus: [],
    appMenus: [],
  }
  componentWillMount() {
    const {
      privileges, // opencode, disApps,
    } = this.props;
    const linkMenus = [];
    if (hasPermission(privileges, { module: 'dis', feature: 'report' })) {
      linkMenus.push({
        single: true,
        key: 'dis-report',
        icon: 'icon-table',
        text: this.msg('report'),
        path: '/dis/report',
      });
    }
    if (hasPermission(privileges, { module: 'dis', feature: 'analytics' })) {
      linkMenus.push({
        single: true,
        key: 'dis-analytics',
        icon: 'icon-pie-chart',
        text: this.msg('analytics'),
        path: '/dis/analytics',
      });
    }
    if (hasPermission(privileges, { module: 'dis', feature: 'dashboard' })) {
      linkMenus.push({
        single: true,
        key: 'dis-dashboard',
        path: '/dis/dashboard',
        icon: 'icon-dashboard-alt',
        text: this.msg('dashboard'),
        disabled: true,
      });
    }
    // const appMenus = AppModuleBase.formDevAppLinks(disApps, opencode, 'dis', this.msg);
    const appMenus = [];
    this.setState({ linkMenus, appMenus });
    if (this.props.children === null) {
      this.redirectInitialRoute(this.props.privileges);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.children === null && this.props.children !== nextProps.children) {
      this.redirectInitialRoute(nextProps.privileges);
    }
  }
  msg = formatMsg(this.props.intl)
  redirectInitialRoute(privileges) {
    // 首页跳转第一个有权限页面
    const route = findForemostRoute(privileges, 'dis', [{
      feat: 'report',
      route: 'report',
    }, {
      feat: 'analytics',
      route: 'analytics',
    }]);
    if (route) {
      this.context.router.replace(`/dis/${route}`);
    } else {
      this.context.router.replace('/dis/forbidden');
    }
  }
  render() {
    return (
      <Navigation
        links={this.state.linkMenus}
        appMenus={this.state.appMenus}
        childContent={this.props.children}
        location={this.props.location}
      />
    );
  }
}
