import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import DataTable from 'client/components/DataTable';
import { formatMsg } from '../message.i18n';


@injectIntl
@connect(
  state => ({
    units: state.saasParams.latest.unit,
    transModes: state.saasParams.latest.transMode,
    currencies: state.saasParams.latest.currency,
    countries: state.saasParams.latest.country,
    cusdeclList: state.cmsDelegationDock.cusdeclList,
    tenantId: state.account.tenantId,
    delgNo: state.cmsDelegationDock.previewer.delegation.delg_no,
    customsSpinning: state.cmsDelegationDock.customsPanelLoading,
    exemptions: state.saasParams.latest.exemptionWay,
  }),
  { }
)
export default class CustomsDeclPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    cusDecl: PropTypes.shape({ pre_entry_seq_no: PropTypes.string }),
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('itemNo'),
    dataIndex: 'g_no',
    width: 50,
    align: 'center',
  }, {
    title: this.msg('codeT'),
    dataIndex: 'hscode',
    width: 110,
  }, {
    title: this.msg('gName'),
    dataIndex: 'g_name',
    width: 100,
  }, {
    title: this.msg('gModel'),
    width: 100,
    dataIndex: 'g_model',
  }, {
    title: this.msg('quantity'),
    width: 80,
    dataIndex: 'g_qty',
    align: 'right',
  }, {
    title: this.msg('unit'),
    width: 80,
    align: 'center',
    dataIndex: 'g_unit',
    render: (o) => {
      const uni = this.props.units.find(gu => gu.unit_code === o);
      if (uni) {
        return `${uni.unit_code}|${uni.unit_name}`;
      }
      return '';
    },
  }, {
    title: this.msg('decPrice'),
    width: 100,
    dataIndex: 'dec_price',
    align: 'right',
  }, {
    title: this.msg('decTotal'),
    width: 100,
    dataIndex: 'trade_total',
    align: 'right',
  }, {
    title: this.msg('currency'),
    width: 100,
    align: 'center',
    dataIndex: 'trade_curr',
    render: (o) => {
      const trade = this.props.currencies.find(tr => tr.curr_code === o);
      if (trade) {
        return `${trade.curr_code}|${trade.curr_name}`;
      }
      return '';
    },
  }, {
    title: this.msg('grossWeight'),
    width: 80,
    align: 'right',
    dataIndex: 'gross_wt',
  }, {
    title: this.msg('netWeight'),
    width: 80,
    align: 'right',
    dataIndex: 'wet_wt',
  }, {
    title: this.msg('exemptionWay'),
    width: 100,
    align: 'center',
    dataIndex: 'duty_mode',
    render: (o) => {
      const exemption = this.props.exemptions.filter(cur => cur.value === o)[0];
      const text = exemption ? `${exemption.value}| ${exemption.text}` : o;
      return text && text.length > 0 ? text : <span />;
    },
  }, {
    title: this.msg('destCountry'),
    width: 120,
    dataIndex: 'dest_country',
    render: (o) => {
      const ori = this.props.countries.find(oc => oc.cntry_co === o);
      if (ori) {
        return `${ori.cntry_co}|${ori.cntry_name_cn}`;
      }
      return '';
    },
  }, {
    title: this.msg('origCountry'),
    width: 120,
    dataIndex: 'orig_country',
    render: (o) => {
      const ori = this.props.countries.find(oc => oc.cntry_co === o);
      if (ori) {
        return `${ori.cntry_co}|${ori.cntry_name_cn}`;
      }
      return '';
    },
  }]

  render() {
    const {
      cusDecl,
    } = this.props;
    return (
      <div className="pane-content tab-pane">
        <DataTable
          columns={this.columns}
          dataSource={cusDecl.bodylist}
          rowKey="id"
          showToolbar={false}
          scrollOffset={360}
        />
      </div>

    );
  }
}
