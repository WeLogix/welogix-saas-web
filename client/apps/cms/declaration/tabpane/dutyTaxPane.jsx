import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Button, Popconfirm, Tag, Radio } from 'antd';
import currencyFormatter from 'currency-formatter';
import { getDeclTax } from 'common/reducers/cmsCustomsDeclare';
import { taxRecalculate } from 'common/reducers/cmsDelegationDock';
import DataPane from 'client/components/DataPane';
import Summary from 'client/components/Summary';
import { formatMsg } from '../message.i18n';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

@injectIntl
@connect(
  state => ({
    tenantId: state.account.tenantId,
    loginId: state.account.loginId,
    countries: state.saasParams.latest.country.map(tc => ({
      value: tc.cntry_co,
      text: tc.cntry_name_cn,
    })),
    currencies: state.saasParams.latest.currency.map(cr => ({
      value: cr.curr_code,
      text: cr.curr_name,
    })),
  }),
  { getDeclTax, taxRecalculate }
)
export default class DutyTaxPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    head: PropTypes.shape({
      pre_entry_seq_no: PropTypes.string,
    }).isRequired,
  }
  state = {
    dataSource: [],
    total: {},
    loading: false,
    viewMerged: true,
  };
  componentDidMount() {
    this.handleReload();
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('seqNo'),
    dataIndex: 'g_no',
    width: 45,
    align: 'center',
    className: 'table-col-seq',
    render: (o, record, index) => index + 1,
  }, {
    title: this.msg('codeT'),
    dataIndex: 'hscode',
    width: 110,
  }, {
    title: this.msg('gName'),
    dataIndex: 'g_name',
    width: 150,
  }, {
    title: this.msg('origCountry'),
    dataIndex: 'orig_country',
    width: 120,
    render: (o) => {
      const { countries } = this.props;
      const country = countries.find(coun => coun.value === o);
      return country && <Tag>{`${o}|${country.text}`}</Tag>;
    },
  }, {
    title: this.msg('totalPrice'),
    dataIndex: 'trade_tot_cny',
    width: 120,
  }, {
    title: this.msg('currency'),
    dataIndex: 'currency',
    align: 'center',
    width: 100,
    render: (o) => {
      const { currencies } = this.props;
      const currency = currencies.find(curr => curr.value === o);
      return currency ? <Tag>{`${o}|${currency.text}`}</Tag> : o;
    },
  }, {
    title: this.msg('exchangeRate'),
    dataIndex: 'exchange_rate',
    width: 80,
    render: o => o && o.toFixed(4),
  }, {
    title: this.msg('dutiableTradeTotal'),
    dataIndex: 'dutiable_trade_total',
    width: 80,
    render(o) {
      return o ? currencyFormatter.format(o, { code: 'CNY', precision: 2 }) : '-';
    },
  }, {
    title: this.msg('dutyRate'),
    dataIndex: 'duty_rate',
    width: 80,
    render(o) {
      const val = o ? o * 100 : 0;
      return val ? `${val.toFixed(1)}%` : '-';
    },
  }, {
    title: this.msg('dutyTax'),
    dataIndex: 'est_duty',
    width: 80,
    render(o) {
      return o ? currencyFormatter.format(o, { code: 'CNY', precision: 2 }) : '-';
    },
  }, {
    title: this.msg('actualDutyTax'),
    dataIndex: 'alc_duty',
    width: 80,
    className: 'text-emphasis',
    render(o) {
      return o ? currencyFormatter.format(o, { code: 'CNY', precision: 2 }) : '-';
    },
  }, {
    title: this.msg('vatRate'),
    dataIndex: 'vat_rate',
    width: 80,
    render(o) {
      const val = o ? o * 100 : 0;
      return val ? `${val.toFixed(1)}%` : '-';
    },
  }, {
    title: this.msg('vatTax'),
    dataIndex: 'est_vat',
    width: 120,
    render(o) {
      return o ? currencyFormatter.format(o, { code: 'CNY', precision: 2 }) : '-';
    },
  }, {
    title: this.msg('actualVatTax'),
    dataIndex: 'alc_vat',
    width: 120,
    className: 'text-emphasis',
    render(o) {
      return o ? currencyFormatter.format(o, { code: 'CNY', precision: 2 }) : '-';
    },
  }, {
    title: this.msg('gstRate'),
    dataIndex: 'gst_rate',
    width: 80,
    render(o) {
      const val = o ? o * 100 : 0;
      return val ? `${val.toFixed(1)}%` : '-';
    },
  }, {
    title: this.msg('gstTax'),
    dataIndex: 'est_gst',
    width: 120,
    render(o) {
      return o ? currencyFormatter.format(o, { code: 'CNY', precision: 2 }) : '-';
    },
  }, {
    title: this.msg('actualGstTax'),
    dataIndex: 'alc_gst',
    width: 120,
    className: 'text-emphasis',
    render(o) {
      return o ? currencyFormatter.format(o, { code: 'CNY', precision: 2 }) : '-';
    },
  }, {
    dataIndex: 'SPACER_COL',
  }]
  handleCalculator = () => {
    this.setState({
      loading: true,
    });
    this.props.taxRecalculate(this.props.head.delg_no).then((result) => {
      if (!result.error) {
        this.setState({
          loading: false,
        });
        this.handleReload();
      }
    });
  }
  handleReload = () => {
    this.props.getDeclTax(this.props.head.pre_entry_seq_no, this.state.viewMerged)
      .then((result) => {
        if (!result.error) {
          const summary = result.data.reduce((prev, next) => {
            const dutyTax = prev.dutyTax + Number(next.est_duty);
            const vatTax = prev.vatTax + Number(next.est_vat);
            const gstTax = prev.gstTax + Number(next.est_gst);
            return {
              dutyTax,
              vatTax,
              gstTax,
            };
          }, {
            dutyTax: 0,
            vatTax: 0,
            gstTax: 0,
          });
          this.setState({
            dataSource: result.data,
            total: summary,
          });
        }
      });
  }
  handleViewChange = (ev) => {
    const viewMerged = ev.target.value === 'merged';
    this.setState({ viewMerged }, () => this.handleReload());
  }
  render() {
    const {
      dataSource, total, loading, viewMerged,
    } = this.state;
    return (
      <DataPane
        bordered
        columns={this.columns}
        dataSource={dataSource}
        rowKey="id"
      >
        <DataPane.Toolbar>
          <Popconfirm title="确定重新估算?" onConfirm={this.handleCalculator} okText={this.msg('yes')} placement="right">
            <Button type="primary" ghost loading={loading} icon="calculator">{this.msg('estimate')}</Button>
          </Popconfirm>
          <DataPane.Extra>
            <RadioGroup value={viewMerged ? 'merged' : 'splitted'} onChange={this.handleViewChange} >
              <RadioButton value="splitted">归并前明细</RadioButton>
              <RadioButton value="merged">归并后明细</RadioButton>
            </RadioGroup>
          </DataPane.Extra>
        </DataPane.Toolbar>
        <Summary>
          <Summary.Item label="关税">{currencyFormatter.format(total.dutyTax, { code: 'CNY', precision: 2 })}</Summary.Item>
          <Summary.Item label="增值税">{currencyFormatter.format(total.vatTax, { code: 'CNY', precision: 2 })}</Summary.Item>
          <Summary.Item label="消费税">{currencyFormatter.format(total.exciseTax, { code: 'CNY', precision: 2 })}</Summary.Item>
        </Summary>
      </DataPane>
    );
  }
}
