import React from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { routerShape, locationShape } from 'react-router';
import Navigation from 'client/components/Navigation';
import { findForemostRoute, hasPermission } from 'client/common/decorators/withPrivilege';
import AppModuleBase from '../appModuleBase';
import { formatMsg } from './message.i18n';

@connect(state => ({
  aspect: state.account.aspect,
  opencode: state.account.opencode,
  privileges: state.account.privileges,
  // trackings: state.sofTracking.trackings,
  sofApps: state.account.apps.sof,
}))
@injectIntl
export default class ModuleSOF extends React.Component {
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
      privileges, sofApps, opencode,
    } = this.props;
    const linkMenus = [];
    if (hasPermission(privileges, { module: 'scof', feature: 'dashboard' })) {
      linkMenus.push({
        single: true,
        key: 'sof-dashboard',
        path: '/scof/dashboard',
        icon: 'icon-dashboard-o',
        text: this.msg('dashboard'),
      });
    }
    if (hasPermission(privileges, { module: 'scof', feature: 'purchaseOrder' })) {
      linkMenus.push({
        single: true,
        key: 'sof-purchaseorders',
        path: '/scof/purchaseorders',
        icon: 'icon-purchase-order',
        text: this.msg('purchaseOrders'),
      });
    }
    if (hasPermission(privileges, { module: 'scof', feature: 'salesOrder' })) {
      linkMenus.push({
        single: true,
        key: 'sof-salesorders',
        path: '/scof/salesorders',
        icon: 'icon-sales-order',
        text: this.msg('salesOrders'),
        disabled: true,
      });
    }
    if (hasPermission(privileges, { module: 'scof', feature: 'invoice' })) {
      linkMenus.push({
        single: true,
        key: 'sof-invoice',
        path: '/scof/invoices',
        icon: 'icon-commercial-invoice',
        text: this.msg('invoices'),
      });
    }
    if (hasPermission(privileges, { module: 'scof', feature: 'shipments' })) {
      linkMenus.push({
        single: true,
        key: 'sof-shipments',
        path: '/scof/shipments',
        icon: 'icon-container',
        text: this.msg('shipments'),
      });
    }
    if (hasPermission(privileges, { module: 'scof', feature: 'tracking' })) {
      linkMenus.push({
        single: true,
        key: 'sof-tracking',
        path: '/scof/tracking',
        icon: 'icon-order-tracking',
        text: this.msg('tracking'),
      });
    }
    if (hasPermission(privileges, { module: 'scof', feature: 'partner' })) {
      const parnerSubMenus = [];
      parnerSubMenus.push({
        key: 'sof-customer',
        path: '/scof/customers',
        text: this.msg('customers'),
      });
      parnerSubMenus.push({
        single: true,
        key: 'sof-supplier',
        path: '/scof/suppliers',
        text: this.msg('suppliers'),
      });
      parnerSubMenus.push({
        single: true,
        key: 'sof-vendor',
        path: '/scof/vendors',
        text: this.msg('vendors'),
      });
      parnerSubMenus.push({
        single: true,
        key: 'sof-contacts',
        path: '/scof/contacts',
        text: this.msg('contacts'),
      });
      linkMenus.push({
        single: false,
        key: 'sof-partner',
        icon: 'icon-partner-o',
        text: this.msg('partner'),
        sublinks: parnerSubMenus,
      });
    }
    const appMenus = AppModuleBase.formDevAppLinks(sofApps, opencode, 'sof', this.msg);

    this.setState({ linkMenus, appMenus });
    if (this.props.children === null) {
      this.redirectInitialRoute(this.props.privileges);
    }
  }
  /*
  componentWillReceiveProps(nextProps) {
    let trackingSublinks = [];
    if (nextProps.trackings.length > 0) {
      trackingSublinks = nextProps.trackings.map((item, index) => ({
        key: `sof-tracking-${index}`,
        path: `/scof/tracking/${item.id}`,
        text: item.name,
      }));
    }
    if (trackingSublinks.length > 0) {
      const linkMenus = this.state.linkMenus.filter(lm => lm.key !== 'sof-tracking');
      linkMenus.splice(3, 0, {
        single: false,
        key: 'sof-tracking',
        icon: 'icon-monitor',
        text: this.msg('tracking'),
        sublinks: trackingSublinks.concat([{
          key: 'sof-tracking-999',
          icon: 'icon-install',
          path: '/scof/tracking/customize',
          text: this.msg('customizeTracking'),
        }]),
      });
      this.setState({ linkMenus });
    }
  }
  */
  componentWillReceiveProps(nextProps) {
    if (nextProps.children === null && this.props.children !== nextProps.children) {
      this.redirectInitialRoute(nextProps.privileges);
    }
  }
  msg = formatMsg(this.props.intl)
  redirectInitialRoute(privileges) {
    // 首页跳转第一个有权限页面
    const route = findForemostRoute(privileges, 'scof', [{
      feat: 'dashboard',
      route: 'dashboard',
    }, {
      feat: 'shipments',
      route: 'shipments',
    }, {
      feat: 'purchaseOrder',
      route: 'purchaseorders',
    }, {
      feat: 'invoice',
      route: 'invoices',
    }, {
      feat: 'tracking',
      route: 'tracking',
    }, {
      feat: 'partner',
      route: 'customers',
    }]);
    if (route) {
      this.context.router.replace(`/scof/${route}`);
    } else {
      this.context.router.replace('/scof/forbidden');
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
