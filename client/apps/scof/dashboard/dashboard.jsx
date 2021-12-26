import React from 'react';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { DatePicker, Layout } from 'antd';
import QueueAnim from 'rc-queue-anim';
import PageHeader from 'client/components/PageHeader';
import PageContent from 'client/components/PageContent';
import connectNav from 'client/common/decorators/connect-nav';
import { connect } from 'react-redux';
import { loadSofStatsCard } from 'common/reducers/saasBase';
import ProcurementTiles from './tile/procurementTiles';
import ShipmentTiles from './tile/shipmentTiles';
import PartnerTiles from './tile/partnerTiles';
import { formatMsg } from './message.i18n';

const { RangePicker } = DatePicker;

@injectIntl
@connectNav({
  depth: 2,
  moduleName: 'scof',
  title: 'featSofDashboard',
})
@connect(
  () => ({

  }),
  { loadSofStatsCard }
)
export default class SOFDashboard extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  state = {
    startDate: moment(new Date(new Date().setDate(1))).format('YYYY-MM-DD'),
    endDate: moment(new Date()).format('YYYY-MM-DD'),
    selectedMenuKey: 'all',
  }
  componentWillMount() {
    const { startDate } = this.state;
    this.props.loadSofStatsCard(moment(startDate).format('YYYY-MM-DD'), moment(new Date()).format('YYYY-MM-DD'));
  }
  onDateChange = (data, dataString) => {
    this.props.loadSofStatsCard(dataString[0], dataString[1]);
    this.setState({
      startDate: dataString[0],
      endDate: dataString[1],
    });
  }
  msg = key => formatMsg(this.props.intl, key);
  render() {
    const { startDate, endDate } = this.state;
    const dropdownMenu = {
      selectedMenuKey: this.state.selectedMenuKey,
      onMenuClick: this.handleFilterChange,
    };
    return (
      <Layout id="page-layout">
        <PageHeader dropdownMenu={dropdownMenu} showCollab={false}>
          <PageHeader.Actions>
            <RangePicker
              onChange={this.onDateChange}
              defaultValue={[moment(startDate, 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')]}
              ranges={{ Today: [moment(), moment()], 'This Month': [moment().startOf('month'), moment()] }}
              allowClear={false}
            />
          </PageHeader.Actions>
        </PageHeader>
        <PageContent>
          <QueueAnim type={['bottom', 'up']}>
            <ProcurementTiles startDate={startDate} endDate={endDate} key="procurement" />
            <ShipmentTiles startDate={startDate} endDate={endDate} key="shipment" />
            <PartnerTiles key="partner" />
          </QueueAnim>
        </PageContent>
      </Layout>
    );
  }
}
