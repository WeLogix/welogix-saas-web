import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { Icon, message } from 'antd';
import FileSaver from 'file-saver';
import XLSX from 'xlsx';
import { string2Bytes } from 'client/util/dataTransform';
import { intlShape, injectIntl } from 'react-intl';
import { loadPrintPickDetails } from 'common/reducers/cwmOutbound';
import { CWM_OUTBOUND_STATUS } from 'common/constants';
import { formatMsg } from '../../message.i18n';

@injectIntl
@connect(
  state => ({
    defaultWhse: state.cwmContext.defaultWhse,
    outboundHead: state.cwmOutbound.outboundFormHead,
  }),
  { loadPrintPickDetails }
)
export default class XLSPickingList extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    outboundNo: PropTypes.string.isRequired,
  }
  msg = formatMsg(this.props.intl);

  handleExportPickingListXLS = () => {
    const {
      defaultWhse, outboundHead, outboundNo, waveNo,
    } = this.props;
    // this.setState({ expLoad: true });
    this.props.loadPrintPickDetails(outboundNo, waveNo).then((result) => {
      if (!result.error) {
        const outboundList = result.data.details;
        const wb = {
          SheetNames: outboundList.map(ot => ot.outbound.outbound_no), Sheets: {}, Props: {},
        };
        for (let t = 0; t < outboundList.length; t++) {
          const { rows: pickDetails, outbound } = outboundList[t];
          const csvData = pickDetails.map((dv, index) => {
            const out = {};
            out['项'] = index + 1;
            out['货号'] = dv.product_no;
            out['产品名称'] = dv.name || '';
            out['批次号'] = dv.external_lot_no || '';
            out['客户属性'] = dv.attrib_1_string || '';
            out['库位'] = dv.location || '';
            out['待拣数'] = Number(dv.alloc_qty);
            out['余量数'] = Number((dv.stock_qty - dv.alloc_qty) + dv.shipped_qty);
            out['实拣数'] = Number(dv.picked_qty === 0 ? '' : dv.picked_qty);
            out['商品分类'] = dv.sku_category || '';
            return out;
          });
          const _headers = ['项', '货号', '产品名称', '批次号', '客户属性', '库位', '待拣数', '余量数', '实拣数', '商品分类'];
          const headers = _headers.map((v, i) =>
            Object.assign({}, { v, position: String.fromCharCode(65 + i) + 5 }))
            .reduce((prev, next) =>
              Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
          const data = csvData.map((v, i) => _headers.map((k, j) =>
            Object.assign({}, { v: v[k], position: String.fromCharCode(65 + j) + (i + 6) })))
            .reduce((prev, next) => prev.concat(next), [])
            .reduce((prev, next) =>
              Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
          const ref = `A1:J${csvData.length + 8}`;
          const ws = Object.assign({}, headers, data, { '!ref': ref });
          ws.A1 = { v: '拣货单' };
          ws.A2 = { v: `出库单号:  ${outboundNo || outbound.outbound_no}` };
          ws.D2 = { v: `订单追踪号:  ${outboundHead.cust_order_no || ''}` };
          ws.G2 = { v: `订单数量:  ${outboundHead.total_alloc_qty || outbound.total_alloc_qty}` };
          ws.A3 = { v: `保税类型:  ${outboundHead.bonded ? '保税' : '非保税'}` };
          ws.D3 = { v: `客户:  ${outboundHead.owner_name || ''}` };
          ws.G3 = { v: `仓库:  ${defaultWhse.name || ''}` };
          ws.A4 = { v: '备注: ' };
          ws[`A${csvData.length + 6}`] = { v: '合计' };
          ws[`G${csvData.length + 6}`] = { v: `${outboundHead.total_alloc_qty || outbound.total_alloc_qty}` };
          ws[`I${csvData.length + 7}`] = { v: `${moment(new Date()).format('YYYY/MM/DD')}` };
          ws[`A${csvData.length + 8}`] = { v: '计划:' };
          ws[`C${csvData.length + 8}`] = { v: '收货:' };
          ws[`E${csvData.length + 8}`] = { v: '上架:' };
          ws[`G${csvData.length + 8}`] = { v: '归档:' };
          const merge = { s: { r: 0, c: 0 }, e: { r: 0, c: 10 } };
          if (!ws['!merges']) { ws['!merges'] = []; }
          ws['!merges'].push(merge);
          ws['!rows'] = [
            { hpx: 25 }, // "pixels"
          ];
          /* change cell format of range G6:I~ to number */
          const irow = csvData.length + 5;
          const range = { s: { r: 5, c: 6 }, e: { r: irow, c: 8 } };
          for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
              const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
              if (cell) cell.t = 'n';
            }
          }
          wb.Sheets[outbound.outbound_no] = ws;
        }
        const wopts = { bookType: 'xlsx', bookSST: false, type: 'binary' };
        const title = waveNo ? `波次_${waveNo}_${Date.now()}.xlsx` : `拣货单_${outboundNo}_${Date.now()}.xlsx`;
        FileSaver.saveAs(new window.Blob([string2Bytes(XLSX.write(wb, wopts))], { type: 'application/octet-stream' }), title);
        // this.setState({ expLoad: false });
      } else {
        message.error(result.error.message);
        // this.setState({ expLoad: false });
      }
    });
  }
  render() {
    const { outboundHead } = this.props;
    const printable = outboundHead.status >= CWM_OUTBOUND_STATUS.PARTIAL_ALLOC.value;
    return <a onClick={this.handleExportPickingListXLS} disabled={!printable}><Icon type={printable ? 'file-excel' : 'file-unknown'} /> {this.props.waveNo ? '波次拣货单Excel' : '拣货单Excel'}</a>;
  }
}
