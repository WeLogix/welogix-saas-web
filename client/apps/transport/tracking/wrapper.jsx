import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import connectFetch from 'client/common/decorators/connect-fetch';
import { intlShape, injectIntl } from 'react-intl';
import { Layout } from 'antd';
import { format } from 'client/common/i18n/helpers';
import connectNav from 'client/common/decorators/connect-nav';
import withPrivilege, { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import { loadPartners } from 'common/reducers/shipment';
import { PARTNER_ROLES, PARTNER_BUSINESSE_TYPES } from 'common/constants';
import PageHeader from 'client/components/PageHeader';
import PageContent from 'client/components/PageContent';
import ShipmentAdvanceModal from './modals/shipment-advance-modal';
import CreateSpecialCharge from './modals/create-specialCharge';
import ExportExcel from './modals/export-excel';

import messages from './message.i18n';

const formatMsg = format(messages);

function fetchData({ dispatch }) {
  return dispatch(loadPartners(
    [PARTNER_ROLES.VEN],
    [PARTNER_BUSINESSE_TYPES.transport]
  ));
}
@connectFetch()(fetchData)
@injectIntl
@connect(
  state => ({
    statusfilters: state.trackingLandStatus.filters,
    podfilters: state.trackingLandPod.filters,
    excpfilters: state.trackingLandException.filters,
  }),
  { }
)
@connectNav({
  depth: 2,
  moduleName: 'transport',
  title: 'featTmsTracking',
})
@withPrivilege({ module: 'transport', feature: 'tracking' })
export default class TrackingLandWrapper extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    location: PropTypes.shape({ pathname: PropTypes.string }).isRequired,
    children: PropTypes.node.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    radioValue: '',
  }
  componentWillMount() {
    const locName = this.props.location.pathname.split('/')[3];
    let propFilters = [];
    if (locName === 'status') {
      propFilters = this.props.statusfilters;
    } else if (locName === 'pod') {
      propFilters = this.props.podfilters;
    } else if (locName === 'exception') {
      propFilters = this.props.excpfilters;
    }
    let typeValue;
    const types = propFilters.filter(flt => flt.name === 'type');
    if (types.length === 1) {
      typeValue = types[0].value;
    }
    this.setState({ radioValue: locName.concat('/').concat(typeValue) });
  }
  componentWillReceiveProps(nextProps) {
    const locName = nextProps.location.pathname.split('/')[3];
    let propFilters = [];
    if (locName === 'status') {
      propFilters = nextProps.statusfilters;
    } else if (locName === 'pod') {
      propFilters = nextProps.podfilters;
    } else if (locName === 'exception') {
      propFilters = nextProps.excpfilters;
    }
    let typeValue;
    const types = propFilters.filter(flt => flt.name === 'type');
    if (types.length === 1) {
      typeValue = types[0].value;
    }
    this.setState({ radioValue: locName.concat('/').concat(typeValue) });
  }
  msg = descriptor => formatMsg(this.props.intl, descriptor)
  handleNavChange = (key) => {
    this.context.router.push(`/transport/tracking/${key}`);
  }
  render() {
    const { radioValue } = this.state;
    const dropdownMenuItems = [
      {
        elementKey: 'gStatus',
        title: '状态跟踪',
        elements: [
          { elementKey: 'status/all', name: this.msg('allShipmt') },
          { elementKey: 'status/pending', name: this.msg('pendingShipmt') },
          { elementKey: 'status/accepted', name: this.msg('acceptedShipmt') },
          { elementKey: 'status/dispatched', name: this.msg('dispatchedShipmt') },
          { elementKey: 'status/intransit', name: this.msg('intransitShipmt') },
          { elementKey: 'status/delivered', name: this.msg('deliveredShipmt') },
        ],
      },
      {
        elementKey: 'gPod',
        title: '回单管理',
        elements: [
          { elementKey: 'pod/upload', name: this.msg('uploadPOD') },
          { elementKey: 'pod/audit', name: this.msg('auditPOD') },
          { elementKey: 'pod/passed', name: this.msg('passedPOD') },
        ],
      },
      {
        elementKey: 'gException',
        title: '异常管理',
        elements: [
          { elementKey: 'exception/delay', name: this.msg('exceptionDelay') },
        ],
      },
    ];
    const dropdownMenu = {
      selectedMenuKey: radioValue,
      onMenuClick: this.handleNavChange,
      dropdownMenuItems,
    };
    return (
      <Layout id="page-layout">
        <PageHeader dropdownMenu={dropdownMenu} showCollab={false} showScope={false}>
          <PageHeader.Actions>
            <PrivilegeCover module="transport" feature="tracking" action="create">
              <ExportExcel />
            </PrivilegeCover>
          </PageHeader.Actions>
        </PageHeader>
        <PageContent>
          {this.props.children}
        </PageContent>
        <ShipmentAdvanceModal />
        <CreateSpecialCharge />
      </Layout>
    );
  }
}
