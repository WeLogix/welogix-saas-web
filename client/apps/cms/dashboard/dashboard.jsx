import React from 'react';
import { intlShape, injectIntl } from 'react-intl';
import { DatePicker, Layout } from 'antd';
import moment from 'moment';
import { connect } from 'react-redux';
import QueueAnim from 'rc-queue-anim';
import connectNav from 'client/common/decorators/connect-nav';
import PageHeader from 'client/components/PageHeader';
import PageContent from 'client/components/PageContent';
import { loadCmsStatistics } from 'common/reducers/saasBase';
import CustomsDeclTiles from './tile/customsDeclTiles';
import ComplianceTiles from './tile/complianceTiles';
import { formatMsg } from './message.i18n';

const { RangePicker } = DatePicker;

@injectIntl
@connectNav({
  depth: 2,
  moduleName: 'clearance',
  title: 'featCdmDashboard',
})
@connect(
  state => ({
    cmsStat: state.saasBase.cmsStat,
  }),
  { loadCmsStatistics }
)
export default class CMSDashboard extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  state = {
    startDate: moment(new Date().setDate(1)).format('YYYY-MM-DD'),
    endDate: moment(new Date()).format('YYYY-MM-DD'),
    selectedMenuKey: 'all',
  }
  componentDidMount() {
    const { startDate, endDate } = this.state;
    this.props.loadCmsStatistics({
      startDate, endDate,
    });
  }
  handleRangePick = (value, dateString) => {
    const startDate = dateString[0];
    const endDate = dateString[1];
    this.props.loadCmsStatistics({ startDate, endDate });
    this.setState({ startDate, endDate });
  }
  msg = formatMsg(this.props.intl)
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
              onChange={this.handleRangePick}
              value={[moment(startDate), moment(endDate)]}
              ranges={{ 'This Month': [moment().startOf('month'), moment()] }}
              allowClear={false}
              format="YYYY-MM-DD"
            />
          </PageHeader.Actions>
        </PageHeader>
        <PageContent>
          <QueueAnim type={['bottom', 'up']}>
            <ComplianceTiles key="compliance" />
            <CustomsDeclTiles key="customs" dateRange={{ startDate, endDate }} />
          </QueueAnim>
        </PageContent>
      </Layout>
    );
  }
}
