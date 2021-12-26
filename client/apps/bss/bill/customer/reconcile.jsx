import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Badge, Button, Layout, Steps, Tabs } from 'antd';
import connectNav from 'client/common/decorators/connect-nav';
import { intlShape, injectIntl } from 'react-intl';
import PageHeader from 'client/components/PageHeader';
import MagicCard from 'client/components/MagicCard';
import { createFilename } from 'client/util/dataTransform';
import { BSS_BILL_TYPE, SETTLE_TYPE, BSS_BILL_STATUS } from 'common/constants';
import { loadBillHead, getBillReconcilingStatements, acceptBill, recallBill, rejectBill } from 'common/reducers/bssBill';
import BillHeadPane from '../tabpane/billHeadPane';
import ReconciliationPane from '../tabpane/reconciliationPane';
import StatementsPane from '../tabpane/statementsPane';
import ImportBillReconcile from '../importBillReconcile';
import { formatMsg } from '../message.i18n';

const { Content } = Layout;
const { Step } = Steps;
const { TabPane } = Tabs;

@injectIntl
@connect(
  state => ({
    tenantId: state.account.tenantId,
    billHead: state.bssBill.billHead,
    billStatements: state.bssBill.billStatements,
    billHeadReload: state.bssBill.billHeadReload,
    statementReload: state.bssBill.reconcileStatementReload,
  }),
  {
    loadBillHead, getBillReconcilingStatements, acceptBill, recallBill, rejectBill,
  }
)
@connectNav({
  depth: 3,
  moduleName: 'bss',
  title: 'featBssBill',
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
    this.props.getBillReconcilingStatements(this.props.params.billNo);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.billHeadReload) {
      this.props.loadBillHead(this.props.params.billNo);
    }
    if (nextProps.statementReload) {
      this.props.getBillReconcilingStatements(this.props.params.billNo);
    }
  }
  msg = formatMsg(this.props.intl)
  handleAcceptBill = () => {
    this.props.acceptBill({ bill_no: this.props.params.billNo }).then((result) => {
      if (!result.error) {
        this.context.router.push('/bss/bill');
      }
    });
  }
  handleRecallBill = () => {
    this.props.recallBill({ bill_no: this.props.params.billNo }).then((result) => {
      if (!result.error) {
        this.context.router.push('/bss/bill');
      }
    });
  }
  handleRejectBill = () => {
    this.props.rejectBill({ bill_no: this.props.params.billNo }).then((result) => {
      if (!result.error) {
        this.context.router.push('/bss/bill');
      }
    });
  }
  handleExport = () => {
    window.open(`${API_ROOTS.default}v1/bss/bill/export/${createFilename(`${this.props.billHead.bill_title}`)}.xlsx?billNo=${this.props.params.billNo}`);
  }
  render() {
    const { billHead, tenantId, billStatements } = this.props;
    const unaccepted = [];
    const accepted = [];
    const bothAccepted = [];
    billStatements.forEach((statemt) => {
      if (statemt.seller_settle_status === 1 && statemt.buyer_settle_status === 1) {
        bothAccepted.push(statemt);
        return;
      }
      if (statemt.settle_type === SETTLE_TYPE.owner) {
        if (tenantId === statemt.owner_tenant_id) {
          if (statemt.buyer_settle_status === 0 && statemt.seller_settle_status === 1) {
            unaccepted.push(statemt);
          }
          if (statemt.seller_settle_status === 0 && statemt.buyer_settle_status === 1) {
            accepted.push(statemt);
          }
        } else if (tenantId === statemt.tenant_id) {
          if (statemt.seller_settle_status === 0 && statemt.buyer_settle_status === 1) {
            unaccepted.push(statemt);
          }
          if (statemt.buyer_settle_status === 0 && statemt.seller_settle_status === 1) {
            accepted.push(statemt);
          }
        }
      } else if (statemt.settle_type === SETTLE_TYPE.vendor) {
        if (tenantId === statemt.vendor_tenant_id) {
          if (statemt.seller_settle_status === 0 && statemt.buyer_settle_status === 1) {
            unaccepted.push(statemt);
          }
          if (statemt.buyer_settle_status === 0 && statemt.seller_settle_status === 1) {
            accepted.push(statemt);
          }
        } else if (tenantId === statemt.tenant_id) {
          if (statemt.buyer_settle_status === 0 && statemt.seller_settle_status === 1) {
            unaccepted.push(statemt);
          }
          if (statemt.seller_settle_status === 0 && statemt.buyer_settle_status === 1) {
            accepted.push(statemt);
          }
        }
      }
    });
    let actions = null;
    if (billHead.bill_type === BSS_BILL_TYPE.OFB.key) {
      if (billHead.bill_status === BSS_BILL_STATUS.RECONCILING.value) {
        actions = (
          <span>
            <Button icon="check" onClick={this.handleAcceptBill}>
              {this.msg('接受账单')}
            </Button>
            <Button icon="close" onClick={this.handleRecallBill} style={{ marginLeft: 8 }}>
              {this.msg('撤销账单')}
            </Button>
          </span>
        );
      }
    } else {
      actions = [];
      if (billHead.bill_status === BSS_BILL_STATUS.RECONCILING.value) {
        actions.push(<Button icon="check" onClick={this.handleAcceptBill} key="accept">
          {this.msg('接受账单')}
        </Button>);
        if (tenantId !== billHead.tenant_id) {
          actions.push(<Button icon="exclamation" key="reject" onClick={this.handleRejectBill} style={{ marginLeft: 8 }}>
            {this.msg('拒绝账单')}
          </Button>);
        }
      }
      if (tenantId === billHead.tenant_id && billHead.bill_status === 3) {
        actions.push(<Button icon="close" key="recall" onClick={this.handleRecallBill}>
          {this.msg('撤销账单')}
        </Button>);
      }
    }
    const tabs = [<TabPane tab="账单表头" key="billHead" >
      <BillHeadPane billHead={billHead} />
    </TabPane>];
    if (billHead.bill_type === BSS_BILL_TYPE.IPB.key) {
      tabs.push(<TabPane tab="账单核对" key="reconcile" ><ImportBillReconcile billNo={this.props.params.billNo} editable /></TabPane>);
    } else if (billHead.bill_type === BSS_BILL_TYPE.FPB.key ||
      billHead.bill_type === BSS_BILL_TYPE.BPB.key ||
      billHead.bill_type === BSS_BILL_TYPE.OFB.key) {
      tabs.push(<TabPane tab={<span>待我方认可<Badge count={unaccepted.length} /></span>} key="unaccepted" >
        <ReconciliationPane
          dataSource={unaccepted}
          billNo={this.props.params.billNo}
          status="unaccepted"
        />
      </TabPane>);
      tabs.push(<TabPane tab={<span>需对方认可<Badge count={accepted.length} /></span>} key="accepted" >
        <ReconciliationPane
          dataSource={accepted}
          billNo={this.props.params.billNo}
          status="accepted"
        />
      </TabPane>);
      tabs.push(<TabPane tab="双方已认可" key="bothAccepted" >
        <ReconciliationPane
          dataSource={bothAccepted}
          billNo={this.props.params.billNo}
          status="bothAccepted"
        />
      </TabPane>);
      tabs.push(<TabPane tab="账单清单" key="statements" >
        <StatementsPane
          billNo={this.props.params.billNo}
        />
      </TabPane>);
    }
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
            {actions}
            <Button icon="download" onClick={this.handleExport} style={{ marginLeft: 8 }}>导出</Button>
          </PageHeader.Actions>
        </PageHeader>
        <Content className="page-content">
          <MagicCard bodyStyle={{ padding: 0 }}>
            <Tabs
              defaultActiveKey={billHead.bill_type === BSS_BILL_TYPE.IPB.key ? 'reconcile' : 'unaccepted'}
              onChange={this.handleTabChange}
            >
              {tabs}
            </Tabs>
          </MagicCard>
        </Content>
      </Layout>
    );
  }
}
