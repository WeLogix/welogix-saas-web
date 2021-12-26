import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { routerShape, locationShape } from 'react-router';
import Navigation from 'client/components/Navigation';
import { loadWhse, switchDefaultWhse } from 'common/reducers/cwmContext';
import { hasPermission, findForemostRoute } from 'client/common/decorators/withPrivilege';
import { formatMsg } from './message.i18n';

@injectIntl
@connect(
  state => ({
    whses: state.cwmContext.whses,
    whse: state.cwmContext.defaultWhse,
    bwmApps: state.account.apps.bwm,
    privileges: state.account.privileges,
    tenantId: state.account.tenantId,
  }),
  { loadWhse, switchDefaultWhse }
)
export default class ModuleCWM extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
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
    const { bwmApps, privileges } = this.props;
    const { msg } = this;
    const appMenus = [];
    if (bwmApps.length > 0) {
      if (bwmApps.length === 1) {
        appMenus.push({
          single: true,
          key: bwmApps[0].app_id,
          path: bwmApps[0].url,
          icon: 'icon-apps',
          text: msg(bwmApps[0].app_name),
        });
      } else {
        appMenus.push({
          single: false,
          key: 'bwm-app',
          icon: 'icon-apps',
          text: msg('devApps'),
          sublinks: [],
        });
        bwmApps.forEach((b, index) => {
          appMenus[0].sublinks.push({
            key: `bwm-app-${index}`,
            path: b.url,
            text: msg(b.app_name),
          });
        });
      }
    }
    this.setState({ appMenus });
    this.initWhseMenus(this.props.whse, privileges);
    if (!this.props.whse.code) {
      let defaultWhse = this.props.whses.length > 0 ? this.props.whses[0].code : null;
      if (window.localStorage) {
        const contextWhse = window.localStorage.getItem('whse-code');
        if (contextWhse === null) {
          window.localStorage.setItem('whse-code', defaultWhse);
        } else {
          defaultWhse = contextWhse;
        }
      }
      this.props.switchDefaultWhse(defaultWhse);
    }
    if (this.props.children === null) {
      this.redirectInitialRoute(this.props.privileges);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.whse.code !== this.props.whse.code) {
      if (window.localStorage) {
        const contextWhse = window.localStorage.getItem('whse-code');
        if (contextWhse !== nextProps.whse.code) {
          window.localStorage.setItem('whse-code', nextProps.whse.code);
        }
      }
      nextProps.loadWhse(nextProps.whse.code);
      this.initWhseMenus(nextProps.whse, nextProps.privileges);
    }
    if (nextProps.children === null && this.props.children !== nextProps.children) {
      this.redirectInitialRoute(nextProps.privileges);
    }
  }
  initWhseMenus(whse, privileges) {
    if (!whse || !whse.code) {
      return;
    }
    const linkMenus = [];
    const { msg } = this;
    if (whse.wh_ent_tenant_id === this.props.tenantId) {
      if (hasPermission(privileges, { module: 'cwm', feature: 'dashboard' })) {
        linkMenus.push({
          single: true,
          key: 'cwm-dashboard',
          path: '/cwm/dashboard',
          icon: 'icon-dashboard-o',
          text: msg('dashboard'),
        });
      }
      if (hasPermission(privileges, { module: 'cwm', feature: 'receiving' })) {
        linkMenus.push({
          single: true,
          key: 'cwm-receiving',
          icon: 'icon-inbound-o',
          text: msg('receiving'),
          group: msg('whseWork'),
          path: '/cwm/receiving/asn',
          /*
          sublinks: [{
            key: 'cwm-receiving-0',
            path: '/cwm/receiving/asn',
            text: msg('receivingASN'),
          }, {
            key: 'cwm-receiving-1',
            path: '/cwm/receiving/inbound',
            text: msg('receivingInbound'),
          },
          ],
          */
        });
      }
      if (hasPermission(privileges, { module: 'cwm', feature: 'stock' })) {
        linkMenus.push({
          single: false,
          key: 'cwm-stock',
          path: '/cwm/stock',
          icon: 'icon-stock-o',
          text: msg('stock'),
          group: msg('whseWork'),
          sublinks: [{
            key: 'cwm-stock-0',
            path: '/cwm/stock/inventory',
            text: msg('inventory'),
          }, {
            key: 'cwm-stock-1',
            path: '/cwm/stock/transition',
            text: msg('transition'),
          }, {
            key: 'cwm-stock-2',
            path: '/cwm/stock/movement',
            text: msg('movement'),
          }, {
            key: 'cwm-stock-3',
            path: '/cwm/stock/transactions',
            text: msg('transactions'),
          },
          ],
        });
      }
      if (hasPermission(privileges, { module: 'cwm', feature: 'shipping' })) {
        linkMenus.push({
          single: true,
          key: 'cwm-shipping',
          icon: 'icon-outbound-o',
          text: msg('shipping'),
          group: msg('whseWork'),
          path: '/cwm/shipping/order',
          /*
          sublinks: [{
            key: 'cwm-shipping-0',
            path: '/cwm/shipping/order',
            text: msg('shippingOrder'),
          }, {
            key: 'cwm-shipping-1',
            path: '/cwm/shipping/wave',
            text: msg('shippingWave'),
          }, {
            key: 'cwm-shipping-2',
            path: '/cwm/shipping/outbound',
            text: msg('shippingOutbound'),
          },
          ],
          */
        });
      }
      if (whse.bonded) {
        if (whse.ftz_type === 'SHFTZ') {
          if (hasPermission(privileges, { module: 'cwm', feature: 'supervision' })) {
            linkMenus.push({
              single: true,
              key: 'cwm-ftz',
              path: '/cwm/supervision/shftz',
              icon: 'icon-ftz',
              text: msg('supervisionSHFTZ'),
              group: msg('supervisionBonded'),
            });
          }
        }
        if (hasPermission(privileges, { module: 'cwm', feature: 'supervision' })) {
          linkMenus.push({
            single: true,
            key: 'cwm-sasbl',
            path: '/cwm/sasbl',
            icon: 'icon-sas',
            text: msg('supervisionSASBL'),
            group: msg('supervisionBonded'),
          });
        }
        if (hasPermission(privileges, { module: 'cwm', feature: 'blbook' })) {
          linkMenus.push({
            single: true,
            key: 'cwm-blbook',
            icon: 'icon-ebook',
            path: '/cwm/blbook',
            text: msg('blBook'),
            group: msg('supervisionBonded'),
          });
        }
      }
      if (hasPermission(privileges, { module: 'cwm', feature: 'products' })) {
        linkMenus.push({
          single: true,
          key: 'cwm-products',
          icon: 'icon-sku-alt',
          path: '/cwm/products/sku',
          text: msg('products'),
          group: msg('basicSettings'),
        });
      }
    } else {
      if (hasPermission(privileges, { module: 'cwm', feature: 'stockQuery' })) {
        linkMenus.push({
          single: true,
          key: 'cwm-query-stock',
          icon: 'icon-stock-o',
          path: '/cwm/query/stock',
          text: msg('queryStock'),
          group: msg('whseQuery'),
        });
      }
      if (hasPermission(privileges, { module: 'cwm', feature: 'inboundQuery' })) {
        linkMenus.push({
          single: true,
          key: 'cwm-query-inbound',
          icon: 'icon-inbound-o',
          path: '/cwm/query/inbound',
          text: msg('queryInbound'),
          disabled: true,
          group: msg('whseQuery'),
        });
      }
      if (hasPermission(privileges, { module: 'cwm', feature: 'outboundQuery' })) {
        linkMenus.push({
          single: true,
          key: 'cwm-query-outbound',
          icon: 'icon-outbound-o',
          path: '/cwm/query/outbound',
          text: msg('queryOutbound'),
          group: msg('whseQuery'),
        });
      }
    }
    if (hasPermission(privileges, { module: 'cwm', feature: 'settings' })) {
      linkMenus.push({
        single: true,
        key: 'cwm-settings',
        path: '/cwm/warehouse',
        icon: 'icon-warehouse-setting',
        text: msg('warehouses'),
        group: msg('basicSettings'),
      });
    }
    this.setState({ linkMenus });
  }

  redirectInitialRoute(privileges) {
    // 首页跳转第一个有权限页面
    const route = findForemostRoute(privileges, 'cwm', [{
      feat: 'dashboard',
      route: 'dashboard',
    }, {
      feat: 'supervision',
      route: 'supervision/shftz/entry',
    }, {
      feat: 'receiving',
      route: 'receiving/asn',
    }, {
      feat: 'stock',
      route: 'stock/inventory',
    }, {
      feat: 'shipping',
      route: 'shipping/order',
    }, {
      feat: 'inboundQuery',
      route: 'query/inbound',
    }, {
      feat: 'outboundQuery',
      route: 'query/outbound',
    }, {
      feat: 'stockQuery',
      route: 'query/stock',
    }, {
      feat: 'products',
      route: 'products/sku',
    }, {
      feat: 'settings',
      route: 'warehouse',
    }]);
    if (this.props.whses.length === 0) {
      this.context.router.replace('/cwm/warehouse/wizard');
    } else if (route) {
      this.context.router.replace(`/cwm/${route}`);
    } else {
      this.context.router.replace('/cwm/forbidden');
    }
  }
  msg = formatMsg(this.props.intl)
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
