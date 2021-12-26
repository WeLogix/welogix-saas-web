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
@connect(
  state => ({
    aspect: state.account.aspect,
    opencode: state.account.opencode,
    privileges: state.account.privileges,
    bssApps: state.account.apps.bss,
  }),
  {}
)
export default class ModuleBSS extends React.Component {
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
      privileges, opencode, bssApps, aspect,
    } = this.props;
    const linkMenus = [];
    if (hasPermission(privileges, { module: 'bss', feature: 'dashboard' })) {
      linkMenus.push({
        single: true,
        key: 'bss-dashboard',
        icon: 'icon-dashboard-o',
        text: this.msg('dashboard'),
        path: '/bss/dashboard',
      });
    }
    if (aspect === TENANT_ASPECT.LSP) {
      if (hasPermission(privileges, { module: 'bss', feature: 'receivable' })) {
        linkMenus.push({
          single: true,
          key: 'bss-receivable',
          group: this.msg('income'),
          icon: 'icon-receivable',
          text: this.msg('receivable'),
          path: '/bss/receivable',
        });
      }
      if (hasPermission(privileges, { module: 'bss', feature: 'customerBill' })) {
        linkMenus.push({
          single: true,
          key: 'bss-bill-customer',
          group: this.msg('income'),
          icon: 'icon-settlement',
          text: this.msg('customerBill'),
          path: '/bss/bill/customer',
        });
      }
      if (hasPermission(privileges, { module: 'bss', feature: 'claimPayment' })) {
        linkMenus.push({
          single: true,
          key: 'bss-incoming',
          group: this.msg('income'),
          icon: 'icon-payment-incoming',
          text: this.msg('claimPayment'),
          path: '/bss/payment/claim',
        });
      }
    }
    if (hasPermission(privileges, { module: 'bss', feature: 'vendorBill' })) {
      linkMenus.push({
        single: true,
        key: 'bss-bill-vendor',
        group: this.msg('expense'),
        icon: 'icon-bill-alt',
        text: this.msg('vendorBill'),
        path: '/bss/bill/vendor',
      });
    }
    if (hasPermission(privileges, { module: 'bss', feature: 'payable' })) {
      linkMenus.push({
        single: true,
        key: 'bss-payable',
        group: this.msg('expense'),
        icon: 'icon-payable',
        text: this.msg('payable'),
        path: '/bss/payable',
      });
    }
    if (hasPermission(privileges, { module: 'bss', feature: 'applyPayment' })) {
      linkMenus.push({
        single: true,
        key: 'bss-paying',
        group: this.msg('expense'),
        icon: 'icon-payment-paying',
        text: this.msg('applyPayment'),
        path: '/bss/payment/apply',
      });
    }
    if (hasPermission(privileges, { module: 'bss', feature: 'invoice' })) {
      linkMenus.push({
        single: false,
        key: 'bss-invoice',
        group: this.msg('accounting'),
        icon: 'icon-invoicing',
        text: this.msg('invoice'),
        sublinks: [{
          key: 'bss-invoice-output',
          text: this.msg('outputInvoice'),
          path: '/bss/invoice/output',
        }, {
          key: 'bss-invoice-input',
          text: this.msg('inputInvoice'),
          path: '/bss/invoice/input',
        }],
      });
    }
    if (hasPermission(privileges, { module: 'bss', feature: 'payment' })) {
      linkMenus.push({
        single: true,
        key: 'bss-fund',
        group: this.msg('accounting'),
        icon: 'icon-payment',
        text: this.msg('payment'),
        path: '/bss/payment',
      });
    }
    if (hasPermission(privileges, { module: 'bss', feature: 'voucher' })) {
      linkMenus.push({
        single: true,
        key: 'bss-voucher',
        group: this.msg('accounting'),
        icon: 'icon-accounting',
        text: this.msg('voucher'),
        path: '/bss/voucher',
      });
    }
    if (hasPermission(privileges, { module: 'bss', feature: 'setting' })) {
      linkMenus.push({
        single: true,
        key: 'bss-setting',
        group: this.msg('setting'),
        icon: 'icon-bss-setting',
        text: this.msg('settlementSetting'),
        path: '/bss/setting',
      });
    }
    const appMenus = AppModuleBase.formDevAppLinks(bssApps, opencode, 'bss', this.msg);
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
    const routePools = [{
      feat: 'dashboard',
      route: 'dashboard',
    }];
    const route = findForemostRoute(privileges, 'bss', routePools);
    if (route) {
      this.context.router.replace(`/bss/${route}`);
    } else {
      this.context.router.replace('/bss/forbidden');
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
