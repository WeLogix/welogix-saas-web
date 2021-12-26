import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { Icon, message } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { WRAP_TYPE, CWM_INBOUND_STATUS } from 'common/constants';
import { loadWholeInboundPutaways, loadWholeInboundProductDetails } from 'common/reducers/cwmReceive';
import { getPrintAdvisedLocations } from 'common/reducers/cwmWhseLocation';
import { formatMsg } from '../../message.i18n';

@injectIntl
@connect(state => ({
  defaultWhse: state.cwmContext.defaultWhse,
  inboundHead: state.cwmReceive.inboundFormHead,
  wholeInbProducts: state.cwmReceive.wholeInbProducts,
  wholeInboundDetails: state.cwmReceive.wholePutawayDetails,
}), {
  loadWholeInboundPutaways, loadWholeInboundProductDetails, getPrintAdvisedLocations,
})
export default class PDFInboundList extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    inboundNo: PropTypes.string.isRequired,
  }
  componentDidMount() {
    this.props.loadWholeInboundProductDetails(this.props.inboundNo);
    if (this.props.inboundHead.status === CWM_INBOUND_STATUS.COMPLETED.value &&
      this.props.wholeInboundDetails.length === 0) {
      this.props.loadWholeInboundPutaways(this.props.inboundNo);
    }
    let script;
    if (!document.getElementById('pdfmake-min')) {
      script = document.createElement('script');
      script.id = 'pdfmake-min';
      script.src = `${__CDN__}/assets/pdfmake/pdfmake.min.js`;
      script.async = true;
      document.body.appendChild(script);
    }
    if (!document.getElementById('pdfmake-vfsfont')) {
      script = document.createElement('script');
      script.id = 'pdfmake-vfsfont';
      script.src = `${__CDN__}/assets/pdfmake/vfs_fonts.js`;
      script.async = true;
      document.body.appendChild(script);
    }
  }
  msg = formatMsg(this.props.intl)
  pdfInboundHead = () => {
    const {
      inboundHead, defaultWhse, inboundNo, entryRegs,
    } = this.props;
    let wrapType = WRAP_TYPE.filter(wt => wt.value === inboundHead.shipmt_wrap_type)[0];
    if (wrapType) {
      wrapType = wrapType.text;
    }
    const ftzEntNos = entryRegs.filter(er => er.ftz_ent_no).map(er => er.ftz_ent_no).join(',');
    const weight = parseFloat(inboundHead.shipmt_weight) >= 0 ? `${inboundHead.shipmt_weight}KG` : '';
    const pdf = [];
    const header = [];
    header.push({
      text: '入库单', style: 'tableHeader', colSpan: 6, alignment: 'center', bold: true,
    }, {}, {}, {}, {}, {});
    pdf.push(header);
    pdf.push([{ text: '入库单号', style: 'table' }, { text: inboundNo, style: 'table' }, { text: '订单追踪号', style: 'table' },
      { text: inboundHead.cust_order_no, style: 'table' }, { text: '入库日期', style: 'table' }, { text: '', style: 'table' }]);
    pdf.push([{ text: '保税类型', style: 'table' }, { text: inboundHead.bonded ? '保税' : '非保税', style: 'table' }, { text: '客户', style: 'table' },
      { text: inboundHead.owner_name, style: 'table' }, { text: '仓库', style: 'table' }, { text: defaultWhse.name, style: 'table' }]);
    pdf.push([{ text: '供货商', style: 'table' }, { text: inboundHead.supplier_name, style: 'table' }, { text: '提运单号', style: 'table' },
      { text: inboundHead.bl_wb_no, style: 'table' }, { text: '进区单号', style: 'table' }, { text: ftzEntNos, style: 'table' }]);
    pdf.push([{ text: '包装大件数', style: 'table' }, { text: `${inboundHead.shipmt_pieces || ''}${wrapType || ''}`, style: 'table' },
      { text: '总毛重', style: 'table' },
      { text: weight, style: 'table' }, { text: '总个数', style: 'table' }, { text: inboundHead.total_expect_qty, style: 'table' }]);
    pdf.push([{ text: '备注', style: 'table' }, { text: `${inboundHead.sof_invno_list || ''}`, colSpan: 5 }, {}, {}, {}, {}]);
    return pdf;
  }
  pdfInboundDetails = (adviseProducts) => {
    const { inboundHead, wholeInbProducts, wholeInboundDetails } = this.props;
    const completed = this.props.inboundHead.status === CWM_INBOUND_STATUS.COMPLETED.value;
    const pdf = [];
    const header = [];
    header.push({
      text: '货物清单', style: 'tableHeader', colSpan: 8, alignment: 'center', border: [true, true, true, true],
    }, {}, {}, {}, {}, {}, {}, {});
    pdf.push(header);
    pdf.push([{ text: '项', style: 'table', alignment: 'center' }, { text: '产品名称', style: 'table', alignment: 'center' },
      { text: '仓库料号', style: 'table', alignment: 'center' }, { text: '计划数量', style: 'table', alignment: 'center' },
      { text: '实际数量', style: 'table', alignment: 'center' }, { text: '建议库位', style: 'table', alignment: 'center' },
      { text: '实际库位', style: 'table', alignment: 'center' }, { text: '扩展属性1', style: 'table', alignment: 'center' }]);
    let pdfData;
    if (completed) { // 收货完成按detail级别打印
      for (let i = 0; i < wholeInbProducts.length; i++) {
        const inPrd = wholeInbProducts[i];
        const rows = wholeInboundDetails.filter(wid => wid.asn_seq_no === inPrd.asn_seq_no);
        if (rows.length > 1) { // // 同product项的第一行 需要合并
          pdf.push([{ text: i + 1, rowSpan: rows.length },
            { text: inPrd.name, rowSpan: rows.length },
            { text: inPrd.product_no, rowSpan: rows.length },
            { text: inPrd.expect_qty, rowSpan: rows.length },
            rows[0].inbound_qty, '', rows[0].location, '']);
          for (let j = 1; j < rows.length; j++) {
            pdf.push(['', '', '', '', rows[j].inbound_qty,
              '', rows[j].location, '']);
          }
        } else {
          pdf.push([i + 1, inPrd.name, inPrd.product_no,
            inPrd.expect_qty, rows[0].inbound_qty, '', rows[0].location, '']);
        }
      }
    } else { // 收货未完成按product级别打印
      pdfData = wholeInbProducts;
      if (adviseProducts) {
        for (let i = 0; i < adviseProducts.length; i++) {
          const product = pdfData[adviseProducts[i].index];
          pdf.push([i + 1, product.name, product.product_no,
            adviseProducts[i].qty || product.expect_qty, '', adviseProducts[i].location, '', '']);
        }
      } else {
        for (let i = 0; i < pdfData.length; i++) {
          pdf.push([i + 1, pdfData[i].name, pdfData[i].product_no, pdfData[i].expect_qty,
            '', '', '', '']);
        }
      }
    }
    pdf.push(['合计', '', '', inboundHead.total_expect_qty, '', '', '', '']);
    return pdf;
  }
  pdfSign = () => {
    const pdf = [];
    pdf.push([{
      text: '签字', style: 'tableHeader', colSpan: 8, alignment: 'center',
    }, {}, {}, {}, {}, {}, {}, {}]);
    pdf.push([{ text: '计划', style: 'table' }, '', { text: '收货', style: 'table' }, '', { text: '上架', style: 'table' },
      '', { text: '归档', style: 'table' }, '']);
    pdf.push([{ text: '实收包装件数', style: 'table' }, { text: '', colSpan: 2 }, {}, { text: '实测计价体积', style: 'table' },
      { text: '', colSpan: 2 }, {}, { text: '记录人', style: 'table' }, '']);
    return pdf;
  }
  handleDocDef = (adviseLocs) => {
    const docDefinition = {
      content: [],
      styles: {
        eachheader: {
          fontSize: 9,
          margin: [40, 20, 30, 30],
        },
        table: {
          fontSize: 9,
          color: 'black',
        },
        tableHeader: {
          fontSize: 12,
          bold: true,
          color: 'black',
          margin: [2, 2, 2, 2],
        },
      },
      defaultStyle: {
        font: 'yahei',
      },
    };
    docDefinition.header = {
      columns: [
        { text: moment(new Date()).format('YYYY/MM/DD'), style: 'eachheader' },
      ],
    };
    docDefinition.content = [
      {
        style: 'table',
        table: {
          widths: ['*', 150, '*', 75, '*', 75],
          body: this.pdfInboundHead(),
        },
      },
      {
        style: 'table',
        table: {
          headerRows: 1,
          widths: [20, 100, 60, '*', '*', '*', '*', '*'],
          body: this.pdfInboundDetails(adviseLocs),
        },
      },
      {
        style: 'table',
        table: {
          widths: ['*', 75, '*', 75, '*', 75, '*', 75],
          body: this.pdfSign(),
          headerRows: 1,
        },
      },
    ];
    return docDefinition;
  }
  handlePrint = () => {
    // pdfMake.vfs = pdfFonts.pdfMake.vfs;
    window.pdfMake.fonts = {
      yahei: {
        normal: 'msyh.ttf',
        bold: 'msyh.ttf',
        italics: 'msyh.ttf',
        bolditalics: 'msyh.ttf',
      },
    };
    const completed = this.props.inboundHead.status === CWM_INBOUND_STATUS.COMPLETED.value;
    if (completed) {
      const docDefinition = this.handleDocDef();
      window.pdfMake.createPdf(docDefinition).open();
    } else {
      const { wholeInbProducts } = this.props;
      this.props.getPrintAdvisedLocations(
        wholeInbProducts.map(obj => ({ product_no: obj.product_no, qty: obj.expect_qty })),
        this.props.defaultWhse.code
      )
        .then((result) => {
          if (result.error) {
            message.error(result.error.message, 10);
            const docDefinition = this.handleDocDef();
            window.pdfMake.createPdf(docDefinition).open();
          } else {
            const docDefinition = this.handleDocDef(result.data);
            window.pdfMake.createPdf(docDefinition).open();
          }
        });
    }
  }
  render() {
    return <a onClick={this.handlePrint}><Icon type="file-pdf" /> 入库单PDF</a>;
  }
}
