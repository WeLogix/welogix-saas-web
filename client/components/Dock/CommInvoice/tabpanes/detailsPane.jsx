import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import DataTable from 'client/components/DataTable';
import { formatMsg } from '../../../../apps/scof/invoices/message.i18n';

@injectIntl
@connect(state => ({
  currencies: state.saasParams.latest.currency,
  countries: state.saasParams.latest.country,
  units: state.saasParams.latest.unit.map(un => ({
    value: un.unit_code,
    text: un.unit_name,
  })),
  commInvDetails: state.sofInvoice.invoiceDetails,
}))
export default class CommInvoiceDetailsPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    commInvDetails: PropTypes.arrayOf(PropTypes.shape({
      product_no: PropTypes.string,
    })).isRequired,
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: '序号',
    dataIndex: 'seq_no',
    width: 45,
    align: 'center',
    className: 'table-col-seq',
    render: (o, record, index) => index + 1,
  }, {
    title: '采购订单号',
    dataIndex: 'po_no',
    width: 150,
  }, {
    title: '货号',
    dataIndex: 'gt_product_no',
    width: 200,
  }, {
    title: '中文名称',
    dataIndex: 'gt_name_cn',
    width: 200,
  }, {
    title: '数量',
    width: 100,
    dataIndex: 'gt_qty_pcs',
    align: 'right',
  }, {
    title: '计量单位',
    dataIndex: 'gt_unit_pcs',
    width: 100,
    align: 'center',
    render: (o) => {
      const unit = this.props.units.find(un => un.value === o);
      if (unit) {
        return unit.text;
      }
      return '';
    },
  }, {
    title: '单价',
    dataIndex: 'gt_unit_price',
    width: 100,
  }, {
    title: '总价',
    dataIndex: 'gt_amount',
    width: 100,
    align: 'right',
  }, {
    title: '币制',
    dataIndex: 'gt_currency',
    align: 'center',
    width: 100,
    render: (o) => {
      const currency = this.props.currencies.find(curr => curr.curr_code === o);
      if (currency) {
        return currency.curr_name;
      }
      return o;
    },
  }, {
    title: '原产国',
    dataIndex: 'gt_origin_country',
    width: 100,
    render: (o) => {
      const country = this.props.countries.find(coun => coun.cntry_co === o);
      if (country) {
        return country.cntry_name_cn;
      }
      return o;
    },
  }, {
    title: '净重',
    dataIndex: 'gt_netwt',
    width: 100,
  }]
  render() {
    const { commInvDetails } = this.props;
    return (
      <div className="pane-content tab-pane">
        <DataTable
          columns={this.columns}
          dataSource={commInvDetails}
          showToolbar={false}
          scrollOffset={296}
        />
      </div>
    );
  }
}
