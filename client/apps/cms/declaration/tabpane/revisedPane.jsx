import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Tag } from 'antd';
import DataPane from 'client/components/DataPane';
import CustomsInpsectionTip from 'client/components/customsInpsectionTip';
import { getRevisedDecl } from 'common/reducers/cmsCustomsDeclare';
import { formatMsg } from '../message.i18n';

const renderCombineData = (fieldVal, options) => {
  const foundOpts = options.filter(opt => opt.value === fieldVal);
  const label = foundOpts.length === 1 ? `${foundOpts[0].value}|${foundOpts[0].text}` : fieldVal;
  return label && label.length > 0 ? <Tag>{label}</Tag> : <span />;
};

@injectIntl
@connect(
  (state) => {
    const params = state.saasParams.latest;
    return {
      units: params.unit.map(un => ({
        value: un.unit_code,
        text: un.unit_name,
      })),
      countries: params.country.map(tc => ({
        value: tc.cntry_co,
        text: tc.cntry_name_cn,
      })),
      currencies: params.currency.map(cr => ({
        value: cr.curr_code,
        text: cr.curr_name,
        rate_cny: cr.rate_CNY,
      })),
      districts: params.district.map(dt => ({
        value: dt.district_code,
        text: dt.district_name,
      })),
      regions: (params.cnregion || []).map(re => ({
        value: re.region_code,
        text: re.region_name,
      })),
      exemptions: params.exemptionWay,
      entryHead: state.cmsManifest.entryHead,
      originEntryBodyList: state.cmsManifest.entryBodies,
      revisedBodies: state.cmsCustomsDeclare.revisedBodies,
    };
  },
  { getRevisedDecl }
)
export default class RevisedPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    ietype: PropTypes.oneOf(['import', 'export']),
    ftz: PropTypes.oneOf(['CDF', 'FTZ']),
  }
  componentDidMount() {
    this.props.getRevisedDecl(this.props.entryHead.pre_entry_seq_no);
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('itemNo'),
    dataIndex: 'g_no',
    width: 45,
    align: 'center',
    className: 'table-col-seq',
  }, {
    title: this.msg('emGNo'),
    width: 100,
    dataIndex: 'em_g_no',
  }, {
    title: this.msg('codeT'),
    width: 110,
    dataIndex: 'hscode',
    render: (o, record) => {
      const originBody =
      this.props.originEntryBodyList.find(body => body.g_no === record.g_no);
      if (originBody.hscode !== o) {
        return <Tag color="red">{o}</Tag>;
      }
      return o;
    },
  }, {
    title: this.msg('ciqCode'),
    width: 110,
    dataIndex: 'ciqcode',
    render: (cc, record) => [cc, record.ciqname].filter(cqc => cqc).join('|'),
  }, {
    title: this.msg('gName'),
    width: 200,
    dataIndex: 'g_name',
    render: (o, record) => {
      const originBody =
      this.props.originEntryBodyList.find(body => body.g_no === record.g_no);
      if (originBody.g_name !== o) {
        return <Tag color="red">{o}</Tag>;
      }
      return o;
    },
  }, {
    title: this.msg('gModel'),
    width: 400,
    dataIndex: 'g_model',
    render: (o, record) => {
      const originBody =
      this.props.originEntryBodyList.find(body => body.g_no === record.g_no);
      if (originBody.g_model !== o) {
        return <Tag color="red">{o}</Tag>;
      }
      return o;
    },
  }, {
    title: this.msg('quantity'),
    width: 80,
    align: 'right',
    dataIndex: 'g_qty',
  }, {
    title: this.msg('unit'),
    width: 110,
    align: 'center',
    dataIndex: 'g_unit',
    render: o => renderCombineData(o, this.props.units),
  }, {
    title: this.msg('unitPrice'),
    width: 100,
    align: 'right',
    dataIndex: 'dec_price',
  }, {
    title: this.msg('totalPrice'),
    width: 100,
    align: 'right',
    dataIndex: 'trade_total',
  }, {
    title: this.msg('currency'),
    width: 100,
    align: 'center',
    dataIndex: 'trade_curr',
    render: o => renderCombineData(o, this.props.currencies),
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
    title: this.msg('qty1'),
    width: 80,
    align: 'right',
    dataIndex: 'qty_1',
  }, {
    title: this.msg('unit1'),
    width: 80,
    align: 'center',
    dataIndex: 'unit_1',
    render: o => renderCombineData(o, this.props.units),
  }, {
    title: this.msg('qty2'),
    width: 80,
    align: 'right',
    dataIndex: 'qty_2',
  }, {
    title: this.msg('unit2'),
    width: 80,
    align: 'center',
    dataIndex: 'unit_2',
    render: o => renderCombineData(o, this.props.units),
  }, {
    title: this.msg('origCountry'),
    width: 150,
    dataIndex: 'orig_country',
    render: o => renderCombineData(o, this.props.countries),
  }, {
    title: this.msg('destCountry'),
    width: 150,
    dataIndex: 'dest_country',
    render: o => renderCombineData(o, this.props.countries),
  }].concat(this.props.ftz ? [] : [{
    title: this.msg('exemptionWay'),
    width: 150,
    dataIndex: 'duty_mode',
    render: o => renderCombineData(o, this.props.exemptions),
  }]).concat([{
    title: this.props.ietype === 'import' ? this.msg('domesticDest') : this.msg('domesticOrig'),
    width: 150,
    dataIndex: 'district_code',
    render: o => renderCombineData(o, this.props.districts),
  }, {
    title: this.props.ietype === 'import' ? this.msg('regionDest') : this.msg('regionOrig'),
    width: 150,
    dataIndex: 'district_region',
    render: o => renderCombineData(o, this.props.regions),
  }, {
    title: this.msg('customs'),
    width: 150,
    dataIndex: 'customs',
    render: col => (<CustomsInpsectionTip str={col} type="customs" />),
  }, {
    title: this.msg('inspection'),
    width: 150,
    dataIndex: 'inspection',
    render: col => (<CustomsInpsectionTip str={col} type="inspection" />),
  }])
  render() {
    return (
      <DataPane
        columns={this.columns}
        dataSource={this.props.revisedBodies}
        rowKey="id"
      />
    );
  }
}
