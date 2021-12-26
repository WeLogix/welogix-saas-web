import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { Button, Layout, Row, Tabs, Tag } from 'antd';
import connectNav from 'client/common/decorators/connect-nav';
import { intlShape, injectIntl } from 'react-intl';
import SidePanel from 'client/components/SidePanel';
import PageHeader from 'client/components/PageHeader';
import MagicCard from 'client/components/MagicCard';
import DescriptionList from 'client/components/DescriptionList';
import DataPane from 'client/components/DataPane';
import RowAction from 'client/components/RowAction';
import { getAudit, deleteFee, updateFee, confirmAudits } from 'common/reducers/bssAudit';
import { loadCurrencies } from 'common/reducers/cmsExpense';
import { BSS_FEE_TYPE } from 'common/constants';
import { formatMsg } from './message.i18n';

const { Content } = Layout;
const { Description } = DescriptionList;
const { TabPane } = Tabs;

@injectIntl
@connect(
  state => ({
    currencies: state.cmsExpense.currencies,
  }),
  {
    getAudit, loadCurrencies, deleteFee, updateFee, confirmAudits,
  }
)
@connectNav({
  depth: 3,
  moduleName: 'bss',
  title: 'featBssApplyPayment',
})
export default class PaymentRequest extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    head: {},
    receives: [],
    pays: [],
    editItem: {},
  }
  msg = formatMsg(this.props.intl)
  payColumns = [{
    title: this.msg('seqNo'),
    dataIndex: 'seq_no',
    width: 45,
    align: 'center',
    className: 'table-col-seq',
    render: (col, row, index) => index + 1,
  }, {
    title: this.msg('bizExpenseNo'),
    dataIndex: 'biz_expense_no',
    width: 200,
  }, {
    title: this.msg('feeName'),
    dataIndex: 'fee_name',
    width: 150,
  }, {
    title: this.msg('feeType'),
    dataIndex: 'fee_type',
    width: 100,
    render: (o) => {
      const type = BSS_FEE_TYPE.filter(fe => fe.key === o)[0];
      return type ? <Tag color={type.tag}>{type.text}</Tag> : <span />;
    },
  }, {
    title: this.msg('baseAmount'),
    dataIndex: 'base_amount',
    width: 150,
    align: 'right',
  }, {
    title: this.msg('税率%'),
    dataIndex: 'tax_rate',
    width: 150,
    align: 'right',
  }, {
    title: this.msg('税额'),
    dataIndex: 'tax_amount',
    width: 150,
    align: 'right',
  }, {
    title: this.msg('含税金额'),
    dataIndex: 'included_amount',
    width: 150,
    align: 'right',
  }, {
    title: this.msg('remark'),
    dataIndex: 'remark',
    width: 200,
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    width: 150,
    fixed: 'right',
    render: (o, record) => {
      if (this.state.head.status === 1) {
        if (this.state.editItem.id === record.id) {
          return (<span>
            <RowAction icon="save" onClick={() => this.handleOk('pays')} tooltip={this.msg('confirm')} row={record} />
            <RowAction icon="close" onClick={this.handleCancel} tooltip={this.msg('cancel')} row={record} />
          </span>);
        }
        return (<span>
          <RowAction icon="edit" onClick={this.handleEdit} label="调整" row={record} />
          <RowAction icon="close" confirm={this.msg('deleteConfirm')} onConfirm={() => this.handleDelete(record, 'pays')} label="排除" row={record} />
        </span>);
      }
      return null;
    },
  }]
  handleDelete = (row, dataType) => {
    this.props.deleteFee(row.id, dataType).then((result) => {
      if (!result.error) {
        const head = { ...this.state.head };
        let dataSource;
        if (dataType === 'receives') {
          dataSource = [...this.state.receives];
          const index = dataSource.findIndex(rec => rec.id === row.id);
          dataSource[index].fee_status = -1;
          head.receivable_amount = (head.receivable_amount - row.settled_amount).toFixed(3);
          head.profit_amount = (head.profit_amount - row.settled_amount).toFixed(3);
          const profitRatio = head.profit_amount / head.receivable_amount;
          head.gross_profit_ratio = Number((profitRatio * 100).toFixed(3));
          this.setState({ receives: dataSource, head });
        } else {
          dataSource = [...this.state.pays];
          const index = dataSource.findIndex(pay => pay.id === row.id);
          dataSource[index].fee_status = -1;
          head.payable_amount = (head.payable_amount - row.settled_amount).toFixed(3);
          head.profit_amount = (head.profit_amount + row.settled_amount).toFixed(3);
          const profitRatio = head.profit_amount / head.receivable_amount;
          head.gross_profit_ratio = Number((profitRatio * 100).toFixed(3));
          this.setState({ pays: dataSource, head });
        }
      }
    });
  }
  handleEdit = (row) => {
    this.setState({
      editItem: { ...row },
    });
  }
  handleCancel = () => {
    this.setState({
      editItem: {},
    });
  }
  handleColumnChange = (value, field) => {
    const editOne = { ...this.state.editItem };
    if (field === 'diff_amount') {
      editOne[field] = value;
      const diffAmount = parseFloat(value);
      if (!Number.isNaN(diffAmount)) {
        editOne.settled_amount = editOne.base_amount + diffAmount;
      } else {
        editOne.settled_amount = editOne.base_amount;
      }
    }
    this.setState({
      editItem: editOne,
    });
  }
  handleOk = (dataType) => {
    const item = this.state.editItem;
    const head = { ...this.state.head };
    let dataSource = [];
    if (dataType === 'receives') {
      dataSource = [...this.state.receives];
    } else {
      dataSource = [...this.state.pays];
    }
    const index = dataSource.findIndex(data => data.id === item.id);
    const diffAmount = parseFloat(item.diff_amount);
    if (!Number.isNaN(diffAmount)) {
      const delta = item.settled_amount - dataSource[index].settled_amount;
      dataSource[index] = item;
      item.delta = delta;
      if (dataType === 'receives') {
        head.receivable_amount += delta;
        head.profit_amount += delta;
      } else {
        head.payable_amount += delta;
        head.profit_amount -= delta;
      }
      const profitRatio = head.profit_amount / head.receivable_amount;
      head.gross_profit_ratio = Number((profitRatio * 100).toFixed(3));
      this.props.updateFee({
        id: item.id,
        settled_amount: item.settled_amount,
        seller_partner_id: item.seller_partner_id,
        buyer_partner_id: item.buyer_partner_id,
        delta: item.delta,
      }, dataType, this.props.params.orderRelNo);
      if (dataType === 'receives') {
        this.setState({
          editItem: {},
          head,
          receives: dataSource,
        });
      } else {
        this.setState({
          editItem: {},
          head,
          pays: dataSource,
        });
      }
    }
  }
  handleConfirm = () => {
    this.props.confirmAudits([this.props.params.orderRelNo]).then((result) => {
      if (!result.error) {
        this.context.router.push('/bss/audit');
      }
    });
  }
  render() {
    const { head, pays } = this.state;
    return (
      <Layout>
        <PageHeader title={this.msg('paymentRequest')}>
          <PageHeader.Actions>
            <Button type="primary" icon="save" onClick={this.handleConfirm}>
              {this.msg('save')}
            </Button>
          </PageHeader.Actions>
        </PageHeader>
        <Layout>
          <SidePanel top onCollapseChange={this.handleCollapseChange}>
            <Row>
              <DescriptionList col={4}>
                <Description term={this.msg('往来单位')}>{head.closed_date}</Description>
                <Description term={this.msg('业务类型')}>{head.closed_date}</Description>
                <Description term={this.msg('结算类别')}>{head.flow_name}</Description>
                <Description term={this.msg('单据日期')}>{head.created_date && moment(head.created_date).format('YYYY.MM.DD HH:mm')}</Description>
                <Description term={this.msg('票据类型')}>{head.owner_name}</Description>
                <Description term={this.msg('票据抬头')}>{head.owner_name}</Description>
                <Description term={this.msg('票据号码')}>{head.owner_name}</Description>
                <Description term={this.msg('结算方式')}>{head.closed_date}</Description>
              </DescriptionList>
            </Row>
          </SidePanel>
          <Content className="page-content">
            <MagicCard bodyStyle={{ padding: 0 }}>
              <Tabs defaultActiveKey="payableDetails">
                <TabPane tab="应付明细" key="payableDetails" >
                  <DataPane
                    columns={this.payColumns}
                    dataSource={pays}
                    rowKey="id"
                    loading={this.state.loading}
                    bordered
                    rowClassName={record => record.fee_status === -1 && 'table-row-disabled'}
                  />
                </TabPane>
              </Tabs>
            </MagicCard>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
