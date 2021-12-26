import React from 'react';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { DatePicker, Layout } from 'antd';
import QueueAnim from 'rc-queue-anim';
import PageHeader from 'client/components/PageHeader';
import PageContent from 'client/components/PageContent';
import connectNav from 'client/common/decorators/connect-nav';
import { connect } from 'react-redux';
import ExpenseTiles from './tile/expenseTiles';
import IncomeTiles from './tile/incomeTiles';
import { formatMsg } from './message.i18n';

const { RangePicker } = DatePicker;

@injectIntl
@connect(
  state => ({
    loginId: state.account.loginId,
  }),
  { }
)
@connectNav({
  depth: 2,
  moduleName: 'bss',
  title: 'featBssDashboard',
})
export default class BSSDashboard extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  state = {
    startDate: new Date(new Date().setDate(1)),
    endDate: new Date(),
    selectedMenuKey: 'all',
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
            <IncomeTiles startDate={startDate} endDate={endDate} key="income" />
            <ExpenseTiles startDate={startDate} endDate={endDate} key="expense" />
          </QueueAnim>
        </PageContent>
      </Layout>
    );
  }
}
