import React from 'react';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { DatePicker, Layout } from 'antd';
import QueueAnim from 'rc-queue-anim';
import PageHeader from 'client/components/PageHeader';
import connectNav from 'client/common/decorators/connect-nav';
import { loadCwmStatsCard } from 'common/reducers/saasBase';
import WhseSelect from '../common/whseSelect';
import InboundTiles from './tile/inboundTiles';
import OutboundTiles from './tile/outboundTiles';
import BondedTiles from './tile/bondedTiles';
import { formatMsg } from '../message.i18n';

const { Content } = Layout;
const { RangePicker } = DatePicker;

@injectIntl
@connect(
  state => ({
    whses: state.cwmContext.whses,
    defaultWhse: state.cwmContext.defaultWhse,
  }),
  { loadCwmStatsCard }
)
@connectNav({
  depth: 2,
  moduleName: 'cwm',
  title: 'featCwmDashboard',
})
export default class CWMDashboard extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  state = {
    startDate: moment(new Date(new Date().setDate(1))).format('YYYY-MM-DD'),
    endDate: moment(new Date()).format('YYYY-MM-DD'),
  }
  componentWillMount() {
    const { defaultWhse } = this.props;
    const { startDate, endDate } = this.state;
    this.props.loadCwmStatsCard(startDate, endDate, defaultWhse.code);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultWhse.code !== this.props.defaultWhse.code) {
      const { defaultWhse } = nextProps;
      const { startDate, endDate } = this.state;
      this.props.loadCwmStatsCard(moment(startDate).format('YYYY-MM-DD'), moment(endDate).format('YYYY-MM-DD'), defaultWhse.code);
    }
  }
  onDateChange = (data, dataString) => {
    const { defaultWhse } = this.props;
    this.setState({
      startDate: dataString[0],
      endDate: dataString[1],
    });
    this.props.loadCwmStatsCard(dataString[0], dataString[1], defaultWhse.code);
  }
  msg = formatMsg(this.props.intl)
  render() {
    const { startDate, endDate } = this.state;
    return (
      <Layout>
        <PageHeader
          breadcrumb={[
            <WhseSelect />,
          ]}
        >
          <PageHeader.Actions>
            <RangePicker
              onChange={this.onDateChange}
              defaultValue={[moment(startDate, 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')]}
              value={[moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')]}
              ranges={{ Today: [moment(), moment()], 'This Month': [moment().startOf('month'), moment()] }}
              allowClear={false}
            />
          </PageHeader.Actions>
        </PageHeader>
        <Content className="page-content" key="main">
          <QueueAnim type={['bottom', 'up']}>
            <InboundTiles startDate={startDate} endDate={endDate} key="inbound" />
            <OutboundTiles startDate={startDate} endDate={endDate} key="outbound" />
            <BondedTiles startDate={startDate} endDate={endDate} key="bonded" />
          </QueueAnim>
        </Content>
      </Layout>
    );
  }
}
