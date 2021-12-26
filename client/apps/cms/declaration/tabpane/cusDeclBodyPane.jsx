import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Tag, Dropdown, Menu } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { CMS_DECL_STATUS, CMS_HS_EFFICIENCY } from 'common/constants';
import { showDeclElementsModal, showEditBodyModal } from 'common/reducers/cmsManifest';
import { getElementByHscode } from 'common/reducers/cmsHsCode';
import CustomsInpsectionTip from 'client/components/customsInpsectionTip';
import Summary from 'client/components/Summary';
import DataPane from 'client/components/DataPane';
import RowAction from 'client/components/RowAction';
import SearchBox from 'client/components/SearchBox';
import DeclElementsModal from '../../common/modal/declElementsModal';
import DeclDetailModal from '../../delegation/manifest/modals/declDetailModal';
import { formatMsg } from '../../message.i18n';

const renderCombineData = (fieldVal, options) => {
  const foundOpts = options.filter(opt => opt.value === fieldVal);
  const label = foundOpts.length === 1 ? `${foundOpts[0].value}|${foundOpts[0].text}` : fieldVal;
  return label && label.length > 0 ? <Tag>{label}</Tag> : <span />;
};

function calculateTotal(bodies/* , currencies */) {
  let totGrossWt = 0;
  let totWetWt = 0;
  let totTrade = 0;
  for (let i = 0; i < bodies.length; i++) {
    const body = bodies[i];
    if (body.gross_wt) {
      totGrossWt += Number(body.gross_wt);
    }
    if (body.wet_wt) {
      totWetWt += Number(body.wet_wt);
    }
    if (body.trade_total) {
      // const currency = currencies.find(curr => curr.value === body.trade_curr);
      // const rate = currency ? currency.rate_cny : 1;
      // totTrade += Number(body.trade_total * rate);
      totTrade += Number(body.trade_total);
    }
  }
  return {
    totGrossWt, totWetWt, totTrade,
  };
}

@injectIntl
@connect((state) => {
  const { entryHead } = state.cmsManifest;
  const params = entryHead.cdf_version === 'v201603' ? state.saasParams.v1 : state.saasParams.latest;
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
    entryHead,
    billMeta: state.cmsManifest.billMeta,
  };
}, { showDeclElementsModal, showEditBodyModal, getElementByHscode })
export default class CusDeclBodyPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    ietype: PropTypes.oneOf(['import', 'export']).isRequired,
    ftz: PropTypes.bool.isRequired,
    data: PropTypes.arrayOf(PropTypes.shape({ g_no: PropTypes.number })).isRequired,
    headNo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }
  constructor(props) {
    super(props);
    const calresult = calculateTotal(props.data);
    this.state = {
      totGrossWt: calresult.totGrossWt,
      totWetWt: calresult.totWetWt,
      totTrade: calresult.totTrade,
      pagination: {
        current: 1,
        total: 0,
        pageSize: 8,
        showQuickJumper: false,
        onChange: this.handlePageChange,
      },
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      const calresult = calculateTotal(nextProps.data);
      this.setState({
        totGrossWt: calresult.totGrossWt,
        totWetWt: calresult.totWetWt,
        totTrade: calresult.totTrade,
        pagination: { ...this.state.pagination, total: nextProps.data.length },
      });
    }
  }

  getColumns = () => {
    const {
      units, countries, currencies, exemptions, districts, regions,
    } = this.props;
    const columns = [{
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
      render: (hs, row) => (<RowAction onClick={this.handleViewBody} label={hs} row={row} href />),
    }, {
      title: this.msg('ciqCode'),
      width: 110,
      dataIndex: 'ciqcode',
      render: (cc, record) => [cc, record.ciqname].filter(cqc => cqc).join('|'),
    }, {
      title: this.msg('gName'),
      width: 200,
      dataIndex: 'g_name',
    }, {
      title: this.msg('gModel'),
      width: 400,
      dataIndex: 'g_model',
      onCellClick: record => this.handleShowDeclElementModal(record),
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
      render: o => renderCombineData(o, units),
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
      render: o => renderCombineData(o, currencies),
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
      render: o => renderCombineData(o, units),
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
      render: o => renderCombineData(o, units),
    }, {
      title: this.msg('origCountry'),
      width: 150,
      dataIndex: 'orig_country',
      render: o => renderCombineData(o, countries),
    }, {
      title: this.msg('destCountry'),
      width: 150,
      dataIndex: 'dest_country',
      render: o => renderCombineData(o, countries),
    }].concat(this.props.ftz ? [] : [{
      title: this.msg('exemptionWay'),
      width: 150,
      dataIndex: 'duty_mode',
      render: o => renderCombineData(o, exemptions),
    }]).concat(this.props.entryHead.cdf_version === 'v201603' ? [] : [{
      title: this.props.ietype === 'import' ? this.msg('domesticDest') : this.msg('domesticOrig'),
      width: 150,
      dataIndex: 'district_code',
      render: o => renderCombineData(o, districts),
    }, {
      title: this.props.ietype === 'import' ? this.msg('regionDest') : this.msg('regionOrig'),
      width: 150,
      dataIndex: 'district_region',
      render: o => renderCombineData(o, regions),
    }].concat([{
      title: this.msg('customs'),
      width: 150,
      dataIndex: 'customs',
      render: col => (<CustomsInpsectionTip str={col} type="customs" />),
    }, {
      title: this.msg('inspection'),
      width: 150,
      dataIndex: 'inspection',
      render: col => (<CustomsInpsectionTip str={col} type="inspection" />),
    }, {
      title: this.msg('efficiency'),
      width: 150,
      dataIndex: 'efficiency',
      render: (o) => {
        const efficiency = CMS_HS_EFFICIENCY.find(effi => effi.value === o);
        return efficiency && efficiency.text;
      },
    }])).concat([{
      title: this.msg('opCol'),
      dataIndex: 'OPS_COL',
      className: 'table-col-ops',
      fixed: 'right',
      width: 70,
      render: (o, record) => {
        let disabled = this.props.entryHead.status >= CMS_DECL_STATUS.sent.value;
        if (this.props.billMeta.permitHeadEdit) {
          disabled = false;
        }
        return (<span>
          <RowAction
            icon="edit"
            row={record}
            onClick={this.handleViewBody}
            disabled={disabled}
          />
        </span>);
      },
    }]);
    return columns;
  };
  msg = formatMsg(this.props.intl)
  handleViewBody = (row) => {
    const declareInfo = {
      delg_no: '',
      declBody: row,
      isCDF: true,
    };
    if (this.props.entryHead.status >= CMS_DECL_STATUS.sent.value &&
      !!this.props.billMeta.permitHeadEdit) {
      declareInfo.reviseEdit = true;
      declareInfo.delg_no = this.props.entryHead.delg_no;
    }
    this.props.showEditBodyModal(true, declareInfo);
  }
  handleShowDeclElementModal = (record) => {
    this.props.getElementByHscode(record.hscode).then((result) => {
      if (!result.error) {
        this.props.showDeclElementsModal(
          result.data.declared_elements,
          record.id, record.g_model,
          true,
          record.g_name,
        );
      }
    });
  }
  handlePageChange = (current) => {
    this.setState({
      pagination: {
        ...this.state.pagination,
        current,
      },
    });
  }
  handleMenuClick = ({ key }) => {
    const preSeqNo = this.props.entryHead.pre_entry_seq_no;
    const timestamp = Date.now().toString().substr(-6);
    if (key === 'export') {
      window.open(`${API_ROOTS.default}v1/cms/declare/export/entry_${preSeqNo}_${timestamp}.xlsx?headId=${this.props.headNo}`);
    } else if (key === 'swexport') {
      window.open(`${API_ROOTS.default}v1/cms/declare/export/entry_${preSeqNo}_${timestamp}.xlsx?headId=${this.props.headNo}&mode=swtpl`);
    }
  }
  render() {
    const { totGrossWt, totWetWt, totTrade } = this.state;
    const {
      entryHead, ietype, data, currencies,
    } = this.props;
    const columns = this.getColumns();
    const tradeCurr = data.length && data[0].trade_curr;
    const currObj = currencies.find(f => f.value === tradeCurr);
    const exportMenu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="export">表体导出</Menu.Item>
        <Menu.Item key="swexport">单一窗口模板导出</Menu.Item>
      </Menu>
    );
    return (
      <DataPane
        columns={columns}
        bordered
        dataSource={data}
        rowKey="id"
        loading={this.state.loading}
      >
        <DataPane.Toolbar>
          <SearchBox placeholder="商品编号/名称" onSearch={this.handleSearch} />
          <DataPane.Extra>
            <Dropdown overlay={exportMenu} placement="bottomLeft">
              <Button icon="export">导出表体数据</Button>
            </Dropdown>
          </DataPane.Extra>
        </DataPane.Toolbar>
        <DeclElementsModal />
        {entryHead.cdf_version !== 'v201603' &&
        <DeclDetailModal ietype={ietype} disabled />
        }
        <Summary>
          <Summary.Item label="总毛重" addonAfter="KG">{totGrossWt.toFixed(2)}</Summary.Item>
          <Summary.Item label="总净重" addonAfter="KG">{totWetWt.toFixed(3)}</Summary.Item>
          <Summary.Item label="总金额">{totTrade.toFixed(2)}</Summary.Item>
          {currObj && <Tag style={{ marginLeft: 5 }}>{currObj.text}</Tag>}
        </Summary>
      </DataPane>
    );
  }
}

