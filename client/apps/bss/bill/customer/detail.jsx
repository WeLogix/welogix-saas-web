import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Layout, Steps, Tabs } from 'antd';
import connectNav from 'client/common/decorators/connect-nav';
import { intlShape, injectIntl } from 'react-intl';
import PageHeader from 'client/components/PageHeader';
import MagicCard from 'client/components/MagicCard';
import { loadBillHead } from 'common/reducers/bssBill';
import { BSS_BILL_TYPE } from 'common/constants';
import { createFilename } from 'client/util/dataTransform';
import BillHeadPane from '../tabpane/billHeadPane';
import StatementsPane from '../tabpane/statementsPane';
import ImportBillReconcile from '../importBillReconcile';
// import BillTypeTag from './common/billTypeTag';
import { formatMsg } from '../message.i18n';

const { Content } = Layout;
const { Step } = Steps;
const { TabPane } = Tabs;

@injectIntl
@connect(
  state => ({
    tenantId: state.account.tenantId,
    billHead: state.bssBill.billHead,
    billHeadReload: state.bssBill.billHeadReload,
  }),
  { loadBillHead }
)
@connectNav({
  depth: 3,
  moduleName: 'bss',
  title: 'featBssCustomerBill',
  jumpOut: true,
})
export default class ReceivableBillDetail extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    this.props.loadBillHead(this.props.params.billNo);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.billHeadReload) {
      this.props.loadBillHead(this.props.params.billNo);
    }
  }
  msg = formatMsg(this.props.intl)
  handleExport = () => {
    window.open(`${API_ROOTS.default}v1/bss/bill/export/${createFilename(`${this.props.billHead.bill_title}`)}.xlsx?billNo=${this.props.params.billNo}`);
  }
  render() {
    const { billHead } = this.props;
    return (
      <Layout>
        <PageHeader
          breadcrumb={[this.props.params.billNo]}
          extra={<Steps size="small" current={billHead.bill_status - 1} className="progress-tracker">
            <Step title="草稿" />
            <Step title="对账中" />
            <Step title="已接受" />
          </Steps>}
        >
          <PageHeader.Actions>
            <Button icon="download" onClick={this.handleExport}>导出</Button>
          </PageHeader.Actions>
        </PageHeader>
        <Layout>
          <Content className="page-content">
            <MagicCard bodyStyle={{ padding: 0 }}>
              <Tabs defaultActiveKey="statements">
                <TabPane tab="账单表头" key="billHead" >
                  <BillHeadPane billHead={billHead} />
                </TabPane>
                {billHead.bill_type === BSS_BILL_TYPE.IPB.key &&
                  <TabPane tab="账单清单" key="statements" >
                    <ImportBillReconcile billNo={this.props.params.billNo} editable={false} />
                  </TabPane>}
                {(billHead.bill_type === BSS_BILL_TYPE.FPB.key ||
                billHead.bill_type === BSS_BILL_TYPE.BPB.key ||
                billHead.bill_type === BSS_BILL_TYPE.OFB.key) &&
                  <TabPane tab="账单清单" key="statements" >
                    <StatementsPane
                      billNo={this.props.params.billNo}
                    />
                  </TabPane>}
              </Tabs>
            </MagicCard>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
