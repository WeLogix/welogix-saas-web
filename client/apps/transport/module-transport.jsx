import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { routerShape, locationShape } from 'react-router';
import { TENANT_ASPECT } from 'common/constants';
import { findForemostRoute, hasPermission } from 'client/common/decorators/withPrivilege';
import Navigation from 'client/components/Navigation';
import { format } from 'client/common/i18n/helpers';
import messages from './message.i18n';

const formatMsg = format(messages);

@injectIntl
@connect(state => ({
  aspect: state.account.aspect,
  privileges: state.account.privileges,
  tmsApps: state.account.apps.tms,
}))
export default class Transport extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    privileges: PropTypes.shape({
      module_id: PropTypes.string,
      feature_id: PropTypes.string,
      action_id: PropTypes.string,
    }).isRequired,
    location: locationShape.isRequired,
    children: PropTypes.node,
  }
  static contextTypes = {
    router: routerShape.isRequired,
  }
  state = {
    linkMenus: [],
    appMenus: [],
  }
  componentWillMount() {
    const {
      privileges, intl, tmsApps, aspect,
    } = this.props;
    const linkMenus = [];
    const appMenus = [];
    if (hasPermission(privileges, { module: 'transport', feature: 'dashboard' })) {
      linkMenus.push({
        single: true,
        key: 'tms-0',
        path: '/transport/dashboard',
        icon: 'icon-dashboard',
        text: formatMsg(intl, 'dashboard'),
      });
    }
    if (hasPermission(privileges, { module: 'transport', feature: 'shipment' })) {
      linkMenus.push({
        single: true,
        key: 'tms-1',
        path: '/transport/planning',
        icon: 'icon-order',
        text: formatMsg(intl, 'planning'),
      });
    }
    if (hasPermission(privileges, { module: 'transport', feature: 'dispatch' })) {
      linkMenus.push({
        single: true,
        key: 'tms-2',
        path: '/transport/dispatch',
        icon: 'icon-dispatch',
        text: formatMsg(intl, 'dispatch'),
      });
    }
    if (hasPermission(privileges, { module: 'transport', feature: 'tracking' })) {
      linkMenus.push({
        single: true,
        key: 'tms-3',
        path: '/transport/tracking',
        icon: 'icon-tracking',
        text: formatMsg(intl, 'tracking'),
      });
    }
    if (hasPermission(privileges, { module: 'transport', feature: 'tariff' })) {
      const billingSublinks = [];
      if (aspect === TENANT_ASPECT.LSP) {
        billingSublinks.push({
          key: 'tms-billing-0',
          path: '/transport/billing/receivable',
          text: formatMsg(intl, 'receivableExpense'),
        });
      }
      billingSublinks.push({
        key: 'tms-billing-1',
        path: '/transport/billing/payable',
        text: formatMsg(intl, 'payableExpense'),
      });
      billingSublinks.push({
        key: 'tms-billing-3',
        path: '/transport/billing/tariff',
        text: formatMsg(intl, 'tariff'),
      });
      linkMenus.push({
        single: false,
        key: 'tms-4',
        path: '/transport/billing',
        icon: 'icon-finance',
        text: formatMsg(intl, 'billingExpense'),
        sublinks: billingSublinks,
      });
    }
    if (hasPermission(privileges, { module: 'transport', feature: 'resources' })) {
      linkMenus.push({
        single: false,
        bottom: !tmsApps.length > 0,
        key: 'tms-6',
        icon: 'icon-vehicle-setting',
        text: formatMsg(intl, 'settings'),
        sublinks: [{
          key: 'tms-6-0',
          path: '/transport/resources',
          text: formatMsg(intl, 'settingsResources'),
        }, {
          key: 'tms-6-1',
          path: '/transport/settings',
          text: formatMsg(intl, 'settingsTransParam'),
        }],
      });
    }
    if (tmsApps.length > 0) {
      if (tmsApps.length === 1) {
        appMenus.push({
          single: true,
          key: tmsApps[0].app_id,
          path: tmsApps[0].url,
          icon: 'icon-apps',
          text: formatMsg(intl, tmsApps[0].app_name),
        });
      } else {
        appMenus.push({
          single: false,
          key: 'tms-app',
          icon: 'icon-apps',
          text: formatMsg(intl, 'devApps'),
          sublinks: [],
        });
        tmsApps.forEach((t, index) => {
          appMenus[0].sublinks.push({
            key: `tms-app-${index}`,
            path: t.url,
            text: formatMsg(intl, t.app_name),
          });
        });
      }
    }
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
  redirectInitialRoute(privileges) {
    // 首页跳转第一个有权限页面
    const route = findForemostRoute(privileges, 'transport', [{
      feat: 'dashboard',
      route: 'dashboard',
    }, {
      feat: 'shipment',
      route: 'planning',
    }, {
      feat: 'dispatch',
      route: 'dispatch',
    }, {
      feat: 'tracking',
      route: 'tracking',
    }, {
      feat: 'resources',
      route: 'resources',
    }, {
      feat: 'tariff',
      route: 'tariff',
    }]);
    if (route) {
      this.context.router.replace(`/transport/${route}`);
    } else {
      this.context.router.replace('/transport/forbidden');
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
