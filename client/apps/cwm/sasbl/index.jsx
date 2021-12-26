import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { SASBL_SASDEC_MENU, SASBL_DISBAT_E_MENU, SASBL_SASTSF_MENU, SASBL_BNDINVT_MENU, PARTNER_ROLES } from 'common/constants';
import connectNav from 'client/common/decorators/connect-nav';
import ListContentLayout from 'client/components/ListContentLayout';
import { setNavTitle } from 'common/reducers/navbar';
import { loadPartners } from 'common/reducers/partner';
import WhseSelect from '../common/whseSelect';
import { formatMsg } from './message.i18n';


@injectIntl
@connect(state => ({
  whse: state.cwmContext.defaultWhse,
  navTitle: state.navbar.navTitle,
}), { setNavTitle, loadPartners })
@connectNav({
  depth: 2,
  moduleName: 'cwm',
  title: 'featCwmSasbl',
})
export default class SASBondedLogisticsWrapper extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    menuStack: [[]],
    currentKey: '',
    openKey: '',
  }
  componentDidMount() {
    const { whse } = this.props;
    this.initSasblMenus(whse);
    const menuLinks = SASBL_SASDEC_MENU.children
      .concat(SASBL_DISBAT_E_MENU.children)
      .concat(SASBL_SASTSF_MENU.children)
      .concat(SASBL_BNDINVT_MENU);
    this.props.loadPartners({
      role: [PARTNER_ROLES.VEN, PARTNER_ROLES.CUS],
    });
    this.setState({ menuLinks });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.whse.code !== this.props.whse.code) {
      this.initSasblMenus();
    }
    if (nextProps.params !== this.props.params && JSON.stringify(nextProps.params) === '{}') {
      /*
      this.props.setNavTitle({
        depth: 2,
        moduleName: 'cwm',
      });
      */
    }
  }
  initSasblMenus() {
    const menuStack = [[]];
    const openKey = 'SASDEC';
    menuStack[0].push(
      SASBL_SASDEC_MENU,
      SASBL_DISBAT_E_MENU,
      SASBL_SASTSF_MENU,
      SASBL_BNDINVT_MENU,
    );
    this.setState({ openKey, menuStack });
  }
  msg = formatMsg(this.props.intl);
  handleMenuClick = (ev) => {
    const currentMenu = this.state.menuLinks.find(menu => menu.key === ev.key);
    if (currentMenu) {
      this.setState({
        currentKey: currentMenu.key,
        openKey: currentMenu.key.slice(0, 5),
      });
      this.context.router.push(currentMenu.link);
    }
  }
  render() {
    return (
      <ListContentLayout
        extra={<WhseSelect bonded disabled={this.props.navTitle.depth === 3} />}
        collapsed={this.props.navTitle.depth === 3}
        stack={this.state.menuStack}
        listWidth={200}
        onMenuClick={this.handleMenuClick}
        defaultSelectedKey={this.state.currentKey}
        defaultOpenKeys={[this.state.openKey]}
      >
        {this.props.children}
      </ListContentLayout>);
  }
}
