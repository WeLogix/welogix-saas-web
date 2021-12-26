import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { routerShape, locationShape } from 'react-router';
import { TENANT_ASPECT } from 'common/constants';
import { findForemostRoute, hasPermission } from 'client/common/decorators/withPrivilege';
import Navigation from 'client/components/Navigation';
import AppModuleBase from '../appModuleBase';
import { formatMsg } from './message.i18n';

@injectIntl
@connect(state => ({
  aspect: state.account.aspect,
  opencode: state.account.opencode,
  privileges: state.account.privileges,
  cmsApps: state.account.apps.cms,
}))
export default class Clearance extends React.Component {
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
  componentDidMount() {
    const {
      privileges, opencode, cmsApps, aspect,
    } = this.props;
    const linkMenus = [];
    if (hasPermission(privileges, { module: 'clearance', feature: 'dashboard' })) {
      linkMenus.push({
        single: true,
        key: 'cms-dashboard',
        path: '/clearance/dashboard',
        icon: 'icon-dashboard-o',
        text: this.msg('dashboard'),
      });
    }
    if (hasPermission(privileges, { module: 'clearance', feature: 'delegation' })) {
      linkMenus.push({
        single: true,
        key: 'cms-delegation',
        path: '/clearance/delegation',
        icon: 'icon-delegation',
        text: this.msg('delegation'),
        group: this.msg('clearance'),
      });
    }
    if (hasPermission(privileges, { module: 'clearance', feature: 'customs' })) {
      linkMenus.push({
        single: true,
        key: 'cms-customs',
        path: '/clearance/declaration',
        icon: 'icon-customs-o',
        text: this.msg('customsDecl'),
        group: this.msg('clearance'),
      });
    }
    if (hasPermission(privileges, { module: 'clearance', feature: 'delegation' })) {
      linkMenus.push({
        single: true,
        key: 'cms-setting',
        path: '/clearance/setting',
        icon: 'icon-rule-alt',
        text: this.msg('clearanceSetting'),
        group: this.msg('clearance'),
      });
    }
    if (hasPermission(privileges, { module: 'clearance', feature: 'compliance' })) {
      linkMenus.push({
        single: true,
        key: 'cms-tradeitem',
        path: '/clearance/tradeitem',
        icon: 'icon-hscode',
        text: this.msg('tradeItem'),
        group: this.msg('compliance'),
      });
      linkMenus.push({
        single: true,
        key: 'cms-permit',
        path: '/clearance/permit',
        icon: 'icon-permit',
        text: this.msg('permit'),
        group: this.msg('compliance'),
      });
    }
    if (hasPermission(privileges, { module: 'clearance', feature: 'declTax' })) {
      linkMenus.push({
        single: true,
        key: 'cms-tax',
        path: '/clearance/tax',
        icon: 'icon-tax',
        text: this.msg('declTax'),
        group: this.msg('taxExpense'),
      });
    }
    if (hasPermission(privileges, { module: 'clearance', feature: 'billing' })) {
      const billingSublinks = [];
      if (aspect === TENANT_ASPECT.LSP) {
        billingSublinks.push({
          key: 'cms-billing-0',
          path: '/clearance/billing/revenue',
          text: this.msg('revenueBilling'),
        });
      }
      billingSublinks.push({
        key: 'cms-billing-1',
        path: '/clearance/billing/expense',
        text: this.msg('expenseBilling'),
      });
      billingSublinks.push({
        key: 'cms-billing-3',
        path: '/clearance/billing/quote',
        text: this.msg('quote'),
      });
      linkMenus.push({
        single: false,
        key: 'cms-billing',
        icon: 'icon-finance-o',
        text: this.msg('billing'),
        sublinks: billingSublinks,
        group: this.msg('taxExpense'),
      });
    }
    /*
    if (hasPermission(privileges, { module: 'clearance', feature: 'analytics' })) {
      linkMenus.push({
        single: true,
        key: 'cms-analytics',
        icon: 'icon-report',
        text: formatMsg(intl, 'analytics'),
        path: '/clearance/analytics',
      });
    }
    if (hasPermission(privileges, { module: 'clearance', feature: 'settings' })) {
      linkMenus.push({
        single: true,
        bottom: true,
        key: 'cms-settings',
        path: '/clearance/settings',
        icon: 'icon-setting-o',
        text: formatMsg(intl, 'settings'),
      });
    }
    */
    const appMenus = AppModuleBase.formDevAppLinks(cmsApps, opencode, 'cms', this.msg);

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
    const route = findForemostRoute(privileges, 'clearance', [{
      feat: 'dashboard',
      route: 'dashboard',
    }, {
      feat: 'delegation',
      route: 'delegation',
    }, {
      feat: 'customs',
      route: 'declaration',
    }, {
      feat: 'compliance',
      route: 'tradeitem',
    }, {
      feat: 'billing',
      route: 'billing/quote',
    }, {
      feat: 'declTax',
      route: 'tax',
    }]);
    if (route) {
      this.context.router.replace(`/clearance/${route}`);
    } else {
      this.context.router.replace('/clearance/forbidden');
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
