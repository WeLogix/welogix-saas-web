import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { Card, Collapse } from 'antd';
import DescriptionList from 'client/components/DescriptionList';
import { formatMsg } from '../../../../apps/scof/invoices/message.i18n';

const { Panel } = Collapse;
const { Description } = DescriptionList;

@injectIntl
@connect(state => ({
  commInvoice: state.sofInvoice.invoiceHead,
  currencies: state.saasParams.latest.currency,
  buyers: state.sofInvoice.buyers,
  sellers: state.sofInvoice.sellers,
}))
export default class CommInvoiceMasterPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    commInvoice: PropTypes.shape({ invoice_no: PropTypes.string }).isRequired,
  }

  msg = formatMsg(this.props.intl)
  render() {
    const {
      commInvoice, buyers, sellers, currencies,
    } = this.props;

    const invCurr = currencies.find(curr => curr.curr_code === commInvoice.currency);
    const buyerPt = buyers.find(buyer => buyer.id === Number(commInvoice.buyer));
    const sellerPt = sellers.find(seller => seller.id === Number(commInvoice.seller));
    return (
      <div className="pane-content tab-pane">
        <Card bodyStyle={{ padding: 0 }}>
          <Collapse bordered={false} defaultActiveKey={['basicInfo']}>
            <Panel header={this.msg('basicInfo')} key="basicInfo">
              <DescriptionList col={2}>
                <Description term={this.msg('invoiceNo')}>{commInvoice.invoice_no}</Description>
                <Description term={this.msg('invoiceDate')}>{commInvoice.invoice_date}</Description>
                <Description term={this.msg('buyer')}>{buyerPt ? buyerPt.name : commInvoice.buyer}</Description>
                <Description term={this.msg('seller')}>{sellerPt ? sellerPt.name : commInvoice.seller}</Description>
                <Description term={this.msg('poNoCount')}>{commInvoice.po_no_count}</Description>
                <Description term={this.msg('totalQty')}>{commInvoice.total_qty}</Description>
                <Description term={this.msg('totalAmount')}>{commInvoice.total_amount}</Description>
                <Description term={this.msg('currency')}>{invCurr ? invCurr.curr_name : commInvoice.currency}</Description>
                <Description term={this.msg('totalNetWt')}>{commInvoice.total_net_wt}</Description>
                <Description term={this.msg('grossWeight')}>{commInvoice.total_grosswt}</Description>
              </DescriptionList>
            </Panel>
            <Panel header={this.msg('sysInfo')} key="sysInfo">
              <DescriptionList col={2}>
                <Description term={this.msg('createdBy')}>{commInvoice.created_by}</Description>
                <Description term={this.msg('lastUpdatedBy')}>{commInvoice.last_updated_by}</Description>
                <Description term={this.msg('createdDate')}>{commInvoice.created_date && moment(commInvoice.created_date).format('YYYY.MM.DD HH:mm')}</Description>
                <Description term={this.msg('lastUpdatedDate')}>{commInvoice.last_updated_date && moment(commInvoice.last_updated_date).format('YYYY.MM.DD HH:mm')}</Description>
              </DescriptionList>
            </Panel>
          </Collapse>
        </Card>
      </div>
    );
  }
}
