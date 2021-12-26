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
    ptsApps: state.account.apps.pts,
  }),
  {}
)
export default class ModulePTS extends React.Component {
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
      privileges, // opencode, ptsApps,
    } = this.props;
    const linkMenus = [];
    const movementMenu = [];
    if (hasPermission(privileges, { module: 'pts', feature: 'dashboard' })) {
      linkMenus.push({
        single: true,
        key: 'pts-dashboard',
        path: '/pts/dashboard',
        icon: 'icon-dashboard',
        text: this.msg('dashboard'),
      });
    }
    if (hasPermission(privileges, { module: 'pts', feature: 'ptbook' })) {
      linkMenus.push({
        single: true,
        key: 'pts-analytics',
        group: this.msg('备案'),
        icon: 'icon-ebook',
        text: this.msg('加贸手/账册'),
        path: '/pts/ptbook',
      });
    }
    if (hasPermission(privileges, { module: 'pts', feature: 'bom' })) {
      linkMenus.push({
        single: true,
        key: 'pts-share',
        group: this.msg('备案'),
        icon: 'icon-bom',
        text: this.msg('BOM物料清单'),
        path: '/pts/bom',
        ptsabled: true,
      });
    }
    if (hasPermission(privileges, { module: 'pts', feature: 'import' })) {
      linkMenus.push({
        single: true,
        key: 'pts-import',
        group: this.msg('流转'),
        icon: 'icon-import',
        text: this.msg('进口料件'),
        path: '/pts/import/i',
      });
    }
    if (hasPermission(privileges, { module: 'pts', feature: 'export' })) {
      linkMenus.push({
        single: true,
        key: 'pts-export',
        group: this.msg('流转'),
        icon: 'icon-export',
        text: this.msg('出口成品/料件'),
        path: '/pts/export/e',
      });
    }
    if (hasPermission(privileges, { module: 'pts', feature: 'movement' })) {
      linkMenus.push({
        single: false,
        key: 'pts-movement',
        group: this.msg('流转'),
        icon: 'icon-movement',
        text: this.msg('特殊流程'),
        sublinks: movementMenu,
      });
    }
    if (hasPermission(privileges, { module: 'pts', feature: 'movement' })) {
      movementMenu.push({
        key: 'pts-movement-cp',
        text: this.msg('外发加工'),
        path: '/pts/movement/cp',
      });
    }
    if (hasPermission(privileges, { module: 'pts', feature: 'movement' })) {
      movementMenu.push({
        key: 'pts-movement-fp',
        text: this.msg('深加工结转'),
        path: '/pts/movement/fp',
      });
    }
    if (hasPermission(privileges, { module: 'pts', feature: 'movement' })) {
      movementMenu.push({
        key: 'pts-movement-ds',
        text: this.msg('内销'),
        path: '/pts/movement/ds',
      });
    }
    if (hasPermission(privileges, { module: 'pts', feature: 'movement' })) {
      movementMenu.push({
        key: 'pts-movement-rr',
        text: this.msg('退换货'),
        path: '/pts/movement-rr',
      });
    }
    if (hasPermission(privileges, { module: 'pts', feature: 'movement' })) {
      movementMenu.push({
        key: 'pts-movement-sc',
        text: this.msg('报废'),
        path: '/pts/movement/sc',
      });
    }
    if (hasPermission(privileges, { module: 'pts', feature: 'movement' })) {
      movementMenu.push({
        key: 'pts-movement-tie',
        text: this.msg('暂时进出口'),
        path: '/pts/movement/tie',
      });
    }
    if (hasPermission(privileges, { module: 'pts', feature: 'inventory' })) {
      linkMenus.push({
        single: true,
        key: 'pts-inventory',
        group: this.msg('核销'),
        icon: 'icon-resource-o',
        text: this.msg('库存底账'),
        path: '/pts/import',
      });
    }
    if (hasPermission(privileges, { module: 'pts', feature: 'settlement' })) {
      linkMenus.push({
        single: true,
        key: 'pts-settlement',
        group: this.msg('核销'),
        icon: 'icon-settlement',
        text: this.msg('核销平衡'),
        path: '/pts/import',
      });
    }
    // const appMenus = AppModuleBase.formDevAppLinks(ptsApps, opencode, 'pts', this.msg);
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
    const route = findForemostRoute(privileges, 'pts', [{
      feat: 'dashboard',
      route: 'dashboard',
    }, {
      feat: 'analytics',
      route: 'analytics',
    }]);
    if (route) {
      this.context.router.replace(`/pts/${route}`);
    } else {
      this.context.router.replace('/pts/forbidden');
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
