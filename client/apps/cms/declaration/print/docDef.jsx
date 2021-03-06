import moment from 'moment';

function calFeeRate(curr, rate, mark) {
  const feeRate = { curr: '', rate: '', mark: '' };
  let rateStr = '';
  if (rate && rate > 0) {
    feeRate.rate = rate;
    if (mark === '1') {
      feeRate.mark = mark;
      feeRate.curr = '000';
    } else if (Number(mark) > 1) {
      feeRate.mark = mark;
      feeRate.curr = curr;
    }
    rateStr = `${feeRate.curr}/${feeRate.rate}/${feeRate.mark}`;
  }
  return rateStr;
}

function pdfHeader(head, declWayCode, orderNo, params, skeleton) {
  const labelStyle = skeleton ? 'invisibleLabel' : 'label';
  let headContent = [];
  const countries = params.country.map(tc => ({
    value: tc.cntry_co,
    text: tc.cntry_name_cn,
  }));
  const customs = params.customs.filter(cu => cu.customs_code === head.i_e_port)[0];
  const ieport = customs || { customs_code: '', customs_name: '' };
  const transmode = params.transMode.filter(tm => tm.trans_code === head.traf_mode)[0];
  const trafmode = transmode || { trans_code: '', trans_spec: '' };
  const tradeMd = params.tradeMode.filter(tr => tr.trade_mode === head.trade_mode)[0];
  const trademode = tradeMd || { trade_mode: '', trade_abbr: '' };
  const trcountry = countries.filter(cur => cur.value === head.trade_country)[0];
  const tradeCountry = trcountry || { value: '', text: '' };
  const decountry = countries.filter(cur => cur.value === head.dept_dest_country)[0];
  const deptCountry = decountry || { value: '', text: '' };
  const distCode = params.district.filter(ds => ds.district_code === head.district_code)[0];
  const district = distCode || { district_code: '', district_name: '' };
  const trxModecode = params.trxnMode.filter(tr => tr.trx_mode === head.trxn_mode)[0];
  const trxnmode = trxModecode || { trx_mode: '', trx_spec: '' };
  const pack = params.wrapType.filter(pk => pk.value === head.wrap_type)[0];
  const wrapType = pack || { value: '', text: '' };
  const port = params.port.filter(pt => pt.port_code === head.dept_dest_port)[0];
  const deptPort = port || { port_code: '', port_c_cod: '' };
  const origPort = params.port.filter(pt => pt.port_code === head.orig_port)[0];
  const originPort = origPort || { port_code: '', port_c_cod: '' };
  const zone = params.cnport.filter(pt => pt.port_code === head.entry_exit_zone)[0];
  const entryExitZone = zone || { port_code: '', port_name: '' };
  const remissionMode = params.remissionMode.filter(rm => rm.rm_mode === head.cut_mode)[0];
  const cutMode = remissionMode || { rm_mode: '', rm_abbr: '' };
  const feeRateStr = calFeeRate(head.fee_curr, head.fee_rate, head.fee_mark);
  const insurRateStr = calFeeRate(head.insur_curr, head.insur_rate, head.insur_mark);
  const otherRateStr = calFeeRate(head.other_curr, head.other_rate, head.other_mark);

  if (declWayCode === 'IBND' || declWayCode === 'EBND') {
    const rowHeight = 24;
    const ieTitle = declWayCode === 'IBND' ? '???????????????????????????????????????????????????' : '???????????????????????????????????????????????????';
    const title = skeleton ? '' : ieTitle;
    const tIEPort = declWayCode === 'IBND' ? '????????????' : '????????????';
    const tIEDate = declWayCode === 'IBND' ? '????????????' : '????????????';
    const tTrader = declWayCode === 'IBND' ? '??????????????????' : '??????????????????';
    const tDeptCountry = declWayCode === 'IBND' ? '?????????(??????)' : '?????????(??????)';
    const tEntryExitPort = declWayCode === 'IBND' ? '???????????????' : '???????????????';
    const tOrigDestCntry = declWayCode === 'IBND' ? '?????????(??????)' : '???????????????(??????)';
    headContent = [
      {
        style: 'table',
        table: {
          widths: ['100%'],
          heights: [40],
          body: [
            [{ text: `${title}`, style: 'title', border: [false, false, false, false] }],
          ],
        },
      },
      {
        style: 'table',
        table: {
          widths: [200, 200, '*'],
          heights: [10],
          body: [
            [
              { text: [{ text: '???????????????:', style: `${labelStyle}` }, { text: `${head.pre_entry_id || ''}` }], border: [false, false, false, false] },
              { text: [{ text: '????????????:', style: `${labelStyle}` }, { text: `${head.entry_id || ''}` }], border: [false, false, false, false] },
              { text: '', border: [false, false, false, false] },
            ],
          ],
        },
      },
      {
        style: 'table',
        table: {
          widths: [200, '*', '*', 82, 80],
          heights: [rowHeight, rowHeight],
          body: [
            [
              { text: [{ text: '????????????  ', style: `${labelStyle}` }, { text: `(${head.trade_custco})\n` }, { text: `${head.trade_name || ''}` }] },
              { text: [{ text: `${tIEPort}  `, style: `${labelStyle}` }, { text: `(${ieport.customs_code})\n` }, { text: `${ieport.customs_name || ''}` }] },
              { text: [{ text: '?????????  ', style: `${labelStyle}` }, { text: '\n' }, { text: `${head.manual_no || ''}` }] },
              { text: [{ text: `${tIEDate}  `, style: `${labelStyle}` }, { text: '\n' }, { text: `${head.i_e_date ? moment(head.i_e_date).format('YYYYMMDD') : ''}` }] },
              { text: [{ text: '????????????  ', style: `${labelStyle}` }, { text: '\n' }, { text: `${head.d_date ? moment(head.d_date).format('YYYYMMDD') : ''}` }] },
            ],
            [
              { text: [{ text: `${tTrader}  `, style: `${labelStyle}` }, { text: `(${head.owner_custco})\n` }, { text: `${head.owner_name || ''}` }] },
              { text: [{ text: '????????????  ', style: `${labelStyle}` }, { text: `(${trademode.trade_mode})\n` }, { text: `${trademode.trade_abbr || ''}` }] },
              { text: [{ text: '?????????(??????)  ', style: `${labelStyle}` }, { text: `(${tradeCountry.value})\n` }, { text: `${tradeCountry.text || ''}` }] },
              { text: [{ text: `${tDeptCountry}  `, style: `${labelStyle}` }, { text: `(${deptCountry.value})\n` }, { text: `${deptCountry.text || ''}` }] },
              { text: [{ text: `${tEntryExitPort}  `, style: `${labelStyle}` }, { text: `(${district.district_code})\n` }, { text: `${district.district_name || ''}` }] },
            ],
          ],
        },
        layout: {
          vLineWidth(i, node) {
            if (skeleton) { return 0; }
            return (i !== 0 && i !== node.table.widths.length) ? 0.8 : 1.2;
          },
          hLineWidth(i) {
            if (skeleton) { return 0; }
            return (i === 0) ? 1.2 : 0.8;
          },
        },
      },
      {
        style: 'table',
        table: {
          widths: [200, 95, '*', 118],
          heights: [rowHeight],
          body: [
            [
              { text: [{ text: '????????????  ', style: `${labelStyle}` }, { text: `(${head.agent_custco})\n` }, { text: `${head.agent_name || ''}` }], border: [true, false, true, false] },
              { text: [{ text: '????????????  ', style: `${labelStyle}` }, { text: `(${trafmode.trans_code})\n` }, { text: `${trafmode.trans_spec || ''}` }], border: [true, false, true, false] },
              { text: [{ text: '??????????????????  ', style: `${labelStyle}` }, { text: '\n' }, { text: `${head.traf_name || ''}` }], border: [true, false, true, false] },
              { text: [{ text: '????????????  ', style: `${labelStyle}` }, { text: '\n' }, { text: `${head.bl_wb_no || ''}` }], border: [true, false, true, false] },
            ],
          ],
        },
        layout: {
          vLineWidth(i, node) {
            if (skeleton) { return 0; }
            return (i !== 0 && i !== node.table.widths.length) ? 0.8 : 1.2;
          },
          hLineWidth() {
            if (skeleton) { return 0; }
            return 0.8;
          },
        },
      },
      {
        style: 'table',
        table: {
          widths: [131, 60, 95, '*', 118],
          heights: [rowHeight, rowHeight],
          body: [
            [
              { text: [{ text: '????????????  ', style: `${labelStyle}` }, { text: '\n' }, { text: `${head.license_no || ''}` }] },
              { text: [{ text: '????????????  ', style: `${labelStyle}` }, { text: `(${trxnmode.trx_mode})\n` }, { text: `${trxnmode.trx_spec || ''}` }] },
              { text: [{ text: '??????  ', style: `${labelStyle}` }, { text: '\n' }, { text: `${feeRateStr || ''}` }] },
              { text: [{ text: '??????  ', style: `${labelStyle}` }, { text: '\n' }, { text: `${insurRateStr || ''}` }] },
              { text: [{ text: '??????  ', style: `${labelStyle}` }, { text: '\n' }, { text: `${otherRateStr || ''}` }] },
            ],
            [
              { text: [{ text: '??????  ', style: `${labelStyle}` }, { text: '\n' }, { text: `${head.pack_count || ''}` }] },
              { text: [{ text: '??????(??????)  ', style: `${labelStyle}` }, { text: '\n' }, { text: `${head.gross_wt || ''}` }] },
              { text: [{ text: '??????(??????)  ', style: `${labelStyle}` }, { text: '\n' }, { text: `${head.net_wt || ''}` }] },
              { colSpan: 2, text: [{ text: '????????????  ', style: `${labelStyle}` }, { text: '\n' }, { text: `${head.cert_mark || ''}` }] },
              {},
            ],
          ],
        },
        layout: {
          vLineWidth(i, node) {
            if (skeleton) { return 0; }
            return (i !== 0 && i !== node.table.widths.length) ? 0.8 : 1.2;
          },
          hLineWidth() {
            if (skeleton) { return 0; }
            return 0.8;
          },
        },
      },
      {
        style: 'table',
        table: {
          widths: ['100%'],
          heights: [90],
          body: [[
            { text: [{ text: '?????????????????????  ', style: `${labelStyle}` }, { text: `${head.note || ''}` }], border: [true, false, true, false] },
          ]],
        },
        layout: {
          vLineWidth(i, node) {
            if (skeleton) { return 0; }
            return (i !== 0 && i !== node.table.widths.length) ? 0.8 : 1.2;
          },
          hLineWidth() {
            if (skeleton) { return 0; }
            return 0.8;
          },
        },
      },
      {
        style: 'table',
        table: {
          widths: ['4%', '10%', '33%', '10%', '*', '*', '*', '10%', '10%', '10%'],
          heights: [10],
          body: [[
            { text: '??????', style: `${labelStyle}` },
            { text: '????????????', style: `${labelStyle}` },
            { text: '???????????????????????????', style: `${labelStyle}` },
            { text: '???????????????', style: `${labelStyle}` },
            { text: '??????', style: `${labelStyle}` },
            { text: '??????', style: `${labelStyle}` },
            { text: '??????', style: `${labelStyle}` },
            { text: `${tOrigDestCntry}`, style: `${labelStyle}` },
            { text: '???????????????(??????)', style: `${labelStyle}` },
            { text: `${tEntryExitPort}`, style: `${labelStyle}` },
          ]],
        },
        layout: {
          paddingTop() { return 0; },
          paddingBottom() { return 0; },
          vLineWidth(i, node) {
            if (skeleton) { return 0; }
            return (i !== 0 && i !== node.table.widths.length) ? 0 : 1.2;
          },
          hLineWidth() {
            if (skeleton) { return 0; }
            return 0.8;
          },
        },
      },
    ];
  } else if (declWayCode === 'IMPT' || declWayCode === 'EXPT') {
    const ieTitle = declWayCode === 'IMPT' ? '????????????????????????????????????????????????' : '????????????????????????????????????????????????';
    const title = skeleton ? '' : ieTitle;
    const tDomesticTrader = declWayCode === 'IMPT' ? '???????????????' : '???????????????';
    const tOverseaEntity = declWayCode === 'IMPT' ? '???????????????' : '???????????????';
    const tIEPort = declWayCode === 'IMPT' ? '????????????' : '????????????';
    const tIEDate = declWayCode === 'IMPT' ? '????????????' : '????????????';
    const tTrader = declWayCode === 'IMPT' ? '??????????????????' : '??????????????????';
    const tDeptCountry = declWayCode === 'IMPT' ? '?????????(??????)' : '?????????(??????)';
    const tEntryExitPort = declWayCode === 'IMPT' ? '????????????' : '????????????';
    const tOrigDestCntry = declWayCode === 'IMPT' ? '?????????(??????)' : '???????????????(??????)';
    const tDistrict = declWayCode === 'IMPT' ? '???????????????' : '???????????????';
    headContent = [
      {
        style: 'table',
        table: {
          widths: ['100%'],
          heights: [40],
          body: [
            [{ text: `${title}`, style: 'title', border: [false, false, false, false] }],
          ],
        },
      },
      {
        style: 'table',
        table: {
          widths: [240, 230, '*'],
          heights: [10],
          body: [
            [
              { text: [{ text: '????????????????????????:', style: `${labelStyle}` }, { text: `${head.pre_entry_seq_no}` }], border: [false, false, false, false] },
              { text: [{ text: '???????????????:', style: `${labelStyle}` }, { text: `${head.pre_entry_id || ''}` }], border: [false, false, false, false] },
              { text: [{ text: '?????????:', style: `${labelStyle}` }, { text: '' }], border: [false, false, false, false] },
            ],
          ],
        },
      },
      {
        style: 'table',
        table: {
          widths: [240, 200, '*'],
          heights: [10],
          body: [
            [
              { text: [{ text: '???????????????:', style: `${labelStyle}` }, { text: `${head.pre_entry_id || ''}` }], border: [false, false, false, false] },
              { text: [{ text: '????????????:', style: `${labelStyle}` }, { text: `${head.entry_id || ''}` }], border: [false, false, false, false] },
              { text: '', border: [false, false, false, false] },
            ],
          ],
        },
      },
      {
        style: 'table',
        table: {
          widths: [240, 120, '*', 125, 130],
          body: [
            [
              { text: [{ text: `${tDomesticTrader}  `, style: `${labelStyle}` }, { text: `(${head.trade_custco})\n` }, { text: `${head.trade_name || ''}` }], border: [true, true, true, false] },
              { text: [{ text: `${tIEPort}  `, style: `${labelStyle}` }, { text: `(${ieport.customs_code})\n` }, { text: `${ieport.customs_name || ''}` }], border: [true, true, true, false] },
              { text: [{ text: `${tIEDate}  `, style: `${labelStyle}` }, { text: '\n' }, { text: `${head.i_e_date ? moment(head.i_e_date).format('YYYYMMDD') : ''}` }], border: [true, true, true, false] },
              { text: [{ text: '????????????  ', style: `${labelStyle}` }, { text: '\n' }, { text: `${head.d_date ? moment(head.d_date).format('YYYYMMDD') : ''}` }], border: [true, true, true, false] },
              { text: [{ text: '?????????  ', style: `${labelStyle}` }, { text: '\n' }, { text: `${head.manual_no || ''}` }], border: [true, true, true, false] },
            ],
          ],
        },
        layout: {
          paddingTop() { return 0; },
          vLineWidth(i, node) {
            if (skeleton) { return 0; }
            return (i !== 0 && i !== node.table.widths.length) ? 0.8 : 1.2;
          },
          hLineWidth(i) {
            if (skeleton) { return 0; }
            return (i === 0) ? 1.2 : 0.8;
          },
        },
      },
      {
        style: 'table',
        table: {
          widths: [240, 120, '*', 125, 130],
          body: [
            [
              { text: [{ text: `${tOverseaEntity}  `, style: `${labelStyle}` }, { text: `(${head.owner_custco})\n` }, { text: `${head.owner_name || ''}` }], border: [true, true, true, false] },
              { text: [{ text: '????????????  ', style: `${labelStyle}` }, { text: `(${trafmode.trans_code})\n` }, { text: `${trafmode.trans_spec || ''}` }], border: [true, true, true, false] },
              { text: [{ text: '??????????????????????????????  ', style: `${labelStyle}` }, { text: `${head.voyage_no}\n` }, { text: `${head.traf_name || ''}` }], border: [true, true, true, false] },
              { text: [{ text: '????????????  ', style: `${labelStyle}` }, { text: '\n' }, { text: `${head.bl_wb_no || ''}` }], border: [true, true, true, false] },
              { text: [{ text: '??????????????????  ', style: `${labelStyle}` }, { text: '\n' }, { text: `${head.storage_place || ''}` }], border: [true, true, true, false] },
            ],
          ],
        },
        layout: {
          paddingTop() { return 0; },
          vLineWidth(i, node) {
            if (skeleton) { return 0; }
            return (i !== 0 && i !== node.table.widths.length) ? 0.8 : 1.2;
          },
          hLineWidth() {
            if (skeleton) { return 0; }
            return 0.8;
          },
        },
      },
      {
        style: 'table',
        table: {
          widths: [240, 120, '*', 125, 130],
          body: [
            [
              // { text: [{ text: '????????????  ', style: `${labelStyle}` },
              // { text: `(${head.agent_custco})\n` }, { text: `${head.agent_name || ''}` }],
              // border: [true, true, true, false] },
              { text: [{ text: `${tTrader}  `, style: `${labelStyle}` }, { text: `(${head.owner_custco})\n` }, { text: `${head.owner_name || ''}` }], border: [true, true, true, false] },
              { text: [{ text: '????????????  ', style: `${labelStyle}` }, { text: `(${trademode.trade_mode})\n` }, { text: `${trademode.trade_abbr || ''}` }], border: [true, true, true, false] },
              { text: [{ text: '????????????  ', style: `${labelStyle}` }, { text: `(${cutMode.rm_mode})\n` }, { text: `${cutMode.rm_abbr || ''}` }], border: [true, true, true, false] },
              { text: [{ text: '????????????  ', style: `${labelStyle}` }, { text: '\n' }, { text: `${head.license_no || ''}` }], border: [true, true, true, false] },
              { text: [{ text: '?????????  ', style: `${labelStyle}` }, { text: `${originPort.port_code}\n` }, { text: `${originPort.port_c_cod || ''}` }], border: [true, true, true, false] },
            ],
          ],
        },
        layout: {
          paddingTop() { return 0; },
          vLineWidth(i, node) {
            if (skeleton) { return 0; }
            return (i !== 0 && i !== node.table.widths.length) ? 0.8 : 1.2;
          },
          hLineWidth() {
            if (skeleton) { return 0; }
            return 0.8;
          },
        },
      },
      {
        style: 'table',
        table: {
          widths: [240, 120, '*', 125, 130],
          body: [
            [
              { text: [{ text: '???????????????  ', style: `${labelStyle}` }, { text: '\n' }, { text: `${head.contr_no || ''}` }], border: [true, true, true, false] },
              { text: [{ text: '?????????(??????)  ', style: `${labelStyle}` }, { text: `(${tradeCountry.value})\n` }, { text: `${tradeCountry.text || ''}` }], border: [true, true, true, false] },
              { text: [{ text: `${tDeptCountry}  `, style: `${labelStyle}` }, { text: `(${deptCountry.value})\n` }, { text: `${deptCountry.text || ''}` }], border: [true, true, true, false] },
              { text: [{ text: '?????????  ', style: `${labelStyle}` }, { text: `(${deptPort.port_code})\n` }, { text: `${deptPort.port_c_cod || ''}` }], border: [true, true, true, false] },
              { text: [{ text: `${tEntryExitPort}  `, style: `${labelStyle}` }, { text: `(${entryExitZone.port_code})\n` }, { text: `${entryExitZone.port_name || ''}` }], border: [true, true, true, false] },
            ],
          ],
        },
        layout: {
          paddingTop() { return 0; },
          vLineWidth(i, node) {
            if (skeleton) { return 0; }
            return (i !== 0 && i !== node.table.widths.length) ? 0.8 : 1.2;
          },
          hLineWidth() {
            if (skeleton) { return 0; }
            return 0.8;
          },
        },
      },
      {
        style: 'table',
        table: {
          widths: [240, 40, 71, 72, '*', 82, 82, 82],
          body: [
            [
              { text: [{ text: '????????????  ', style: `${labelStyle}` }, { text: `(${wrapType.value})\n` }, { text: `${wrapType.text || ''}` }], border: [true, true, true, false] },
              { text: [{ text: '??????  ', style: `${labelStyle}` }, { text: '\n' }, { text: `${head.pack_count || ''}` }], border: [true, true, true, false] },
              { text: [{ text: '??????(??????)  ', style: `${labelStyle}` }, { text: '\n' }, { text: `${head.gross_wt || ''}` }], border: [true, true, true, false] },
              { text: [{ text: '??????(??????)  ', style: `${labelStyle}` }, { text: '\n' }, { text: `${head.net_wt || ''}` }], border: [true, true, true, false] },
              { text: [{ text: '????????????  ', style: `${labelStyle}` }, { text: `(${trxnmode.trx_mode})\n` }, { text: `${trxnmode.trx_spec || ''}` }], border: [true, true, true, false] },
              { text: [{ text: '??????  ', style: `${labelStyle}` }, { text: '\n' }, { text: `${feeRateStr || ''}` }], border: [true, true, true, false] },
              { text: [{ text: '??????  ', style: `${labelStyle}` }, { text: '\n' }, { text: `${insurRateStr || ''}` }], border: [true, true, true, false] },
              { text: [{ text: '??????  ', style: `${labelStyle}` }, { text: '\n' }, { text: `${otherRateStr || ''}` }], border: [true, true, true, false] },
            ],
          ],
        },
        layout: {
          paddingTop() { return 0; },
          vLineWidth(i, node) {
            if (skeleton) { return 0; }
            return (i !== 0 && i !== node.table.widths.length) ? 0.8 : 1.2;
          },
          hLineWidth() {
            if (skeleton) { return 0; }
            return 0.8;
          },
        },
      },
      {
        style: 'table',
        table: {
          widths: ['100%'],
          body: [[
            { text: [{ text: '?????????????????????  ', style: `${labelStyle}` }, { text: `${head.note || ''}` }], border: [true, true, true, false] },
          ]],
        },
        layout: {
          paddingTop() { return 0; },
          vLineWidth(i, node) {
            if (skeleton) { return 0; }
            return (i !== 0 && i !== node.table.widths.length) ? 0.8 : 1.2;
          },
          hLineWidth() {
            if (skeleton) { return 0; }
            return 0.8;
          },
        },
      },
      {
        style: 'table',
        table: {
          widths: ['100%'],
          heights: [48],
          body: [[
            { text: [{ text: '?????????????????????  ', style: `${labelStyle}` }, { text: `${head.note || ''}` }], border: [true, true, true, false] },
          ]],
        },
        layout: {
          paddingTop() { return 0; },
          vLineWidth(i, node) {
            if (skeleton) { return 0; }
            return (i !== 0 && i !== node.table.widths.length) ? 0.8 : 1.2;
          },
          hLineWidth() {
            if (skeleton) { return 0; }
            return 0.8;
          },
        },
      },
      {
        style: 'table',
        table: {
          widths: ['4%', '10%', '33%', '10%', '*', '*', '*', '10%', '10%', '10%', '*'],
          heights: [10],
          body: [[
            { text: '??????', style: `${labelStyle}` },
            { text: '????????????', style: `${labelStyle}` },
            { text: '???????????????????????????', style: `${labelStyle}` },
            { text: '???????????????', style: `${labelStyle}` },
            { text: '??????', style: `${labelStyle}` },
            { text: '??????', style: `${labelStyle}` },
            { text: '??????', style: `${labelStyle}` },
            { text: `${tOrigDestCntry}`, style: `${labelStyle}` },
            { text: '???????????????(??????)', style: `${labelStyle}` },
            { text: `${tDistrict}`, style: `${labelStyle}` },
            { text: '??????', style: `${labelStyle}` },
          ]],
        },
        layout: {
          paddingTop() { return 0; },
          paddingBottom() { return 0; },
          vLineWidth(i, node) {
            if (skeleton) { return 0; }
            return (i !== 0 && i !== node.table.widths.length) ? 0 : 1.2;
          },
          hLineWidth() {
            if (skeleton) { return 0; }
            return 0.8;
          },
        },
      },
    ];
  }
  return headContent;
}

function pdfBody(bodydatas, declWayCode, params) {
  const pdfbody = [];
  const countries = params.country.map(tc => ({
    value: tc.cntry_co,
    text: tc.cntry_name_cn,
  }));
  const units = params.unit.map(un => ({
    value: un.unit_code,
    text: un.unit_name,
  }));
  const currrencies = params.currency.map(cr => ({
    value: cr.curr_code,
    text: cr.curr_name,
  }));
  const districts = params.district.map(dt => ({
    value: dt.district_code,
    text: dt.district_name,
  }));
  let widths = ['4%', '10%', '33%', '10%', '*', '*', '*', '10%', '10%', '10%'];
  if (declWayCode === 'IMPT' || declWayCode === 'EXPT') {
    widths = ['4%', '10%', '33%', '10%', '*', '*', '*', '10%', '10%', '10%', '*'];
  }
  const height = 36;
  const heights = [10, height, height, height, height, height, height];
  for (let i = 0; i < bodydatas.length; i++) {
    const dbody = bodydatas[i];
    const body = [];
    const gunitFl = units.filter(ut => ut.value === dbody.g_unit)[0];
    const gunit = gunitFl ? gunitFl.text : '';
    const unit1Fl = units.filter(ut => ut.value === dbody.unit_1)[0];
    const unit1 = unit1Fl ? unit1Fl.text : '';
    const unit2Fl = units.filter(ut => ut.value === dbody.unit_2)[0];
    const unit2 = unit2Fl ? unit2Fl.text : '';
    const country = countries.filter(ct => ct.value === dbody.orig_country)[0];
    const origCountry = country ? `${country.text}\n(${country.value})` : '';
    const dtCountry = countries.filter(ct => ct.value === dbody.dest_country)[0];
    const destCountry = dtCountry ? `${dtCountry.text}\n(${dtCountry.value})` : '';
    const dist = districts.filter(dt => dt.value === dbody.district_code)[0];
    const district = dist ? `${dist.value}${dist.text}` : '';
    const currency = currrencies.filter(cr => cr.value === dbody.trade_curr)[0];
    const tradeCurr = currency ? `(${currency.value})\n${currency.text}` : '';
    const exemptions = params.exemptionWay.filter(ep => ep.value === dbody.duty_mode)[0];
    const dutyMode = exemptions || { value: '', text: '' };
    body.push(
      `${dbody.g_no || ''}`,
      dbody.hscode || '',
      `${dbody.g_name || ''}\n${dbody.g_model || ''}`,
      { text: `${dbody.qty_1 || ''}${unit1}\n${dbody.qty_2 || ''}${unit2}\n${dbody.g_qty || ''}${gunit}` },
      { text: `${dbody.dec_price || ''}` },
      { text: `${dbody.trade_total || ''}` },
      { text: `${tradeCurr || ''}` },
      origCountry || '',
      destCountry || '',
      district,
    );
    if (declWayCode === 'IMPT' || declWayCode === 'EXPT') {
      body.push(`${dutyMode.text}\n${dutyMode.value}`);
    }
    pdfbody.push(body);
  }
  const bodytable = { widths, heights, body: pdfbody };
  return bodytable;
}

export function StandardDocDef(head, bodies, declWayCode, orderNo, params, skeleton) {
  const docDefinition = {
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: [20, 15],
    content: [],
    styles: {
      header: {
        fontSize: 8,
        alignment: 'right',
        margin: [0, 2, 0, 5],
      },
      title: {
        fontSize: 15,
        bold: true,
        alignment: 'center',
        width: '100%',
        margin: [0, 10, 0, 0],
      },
      cdfTitle: {
        fontSize: 15,
        bold: true,
        alignment: 'center',
        width: '100%',
        margin: [0, 48, 0, 14],
      },
      table: {
        fontSize: 8,
      },
      tableCell: {
        height: 60,
      },
      tableHeader: {
        fontSize: 8,
      },
      tableHeaderAlignCenter: {
        fontSize: 8,
        alignment: 'center',
      },
      label: {
        color: '#000000',
      },
      invisibleLabel: {
        color: '#ffffff',
      },
    },
    defaultStyle: {
      font: 'yahei',
    },
  };
  const labelStyle = skeleton ? 'invisibleLabel' : 'label';
  const splitCount = Math.ceil(bodies.length / 8);
  for (let spIndex = 0; spIndex < splitCount; spIndex++) {
    let content = [];
    const datas = [];
    let end = false;
    for (let bIndex = spIndex * 8; bIndex < (spIndex + 1) * 8; bIndex++) {
      if (bIndex < bodies.length) {
        datas.push(bodies[bIndex]);
      } else {
        datas.push({});
        end = true;
      }
    }
    content = pdfHeader(head, declWayCode, orderNo, params, skeleton);
    content.push({
      style: 'table',
      table: pdfBody(datas, declWayCode, params, skeleton),
      layout: {
        paddingTop() { return 0; },
        paddingBottom() { return 0; },
        vLineWidth(i, node) {
          if (skeleton) { return 0; }
          return (i !== 0 && i !== node.table.widths.length) ? 0 : 1.2;
        },
        hLineColor(i, node) {
          return (i === 0 || i === 1 || i === node.table.body.length) ? 'black' : 'gray';
        },
        hLineWidth(i, node) {
          if (skeleton) { return 0; }
          if (i === 0) {
            return 0;
          } else if (i === node.table.body.length) {
            return 0.8;
          }
          return 0.2;
        },
      },
    });
    let pdfFooter = [
      [{ text: '\n', border: [true, false, false, true] },
        { text: '\n', border: [false, false, false, true] },
        { text: '\n', border: [false, false, false, true] },
        { text: '\n', border: [false, false, true, true] }],
      [{ text: '????????????\n', style: `${labelStyle}`, border: [true, true, false, true] },
        { text: '????????????\n', style: `${labelStyle}`, border: [false, true, true, true] },
        {
          text: '????????????????????????????????????????????????????????????????????????\n', style: `${labelStyle}`, margin: [12, 0, 10, 0], border: [true, true, true, false],
        },
        { text: '?????????????????????\n', style: `${labelStyle}`, border: [true, true, true, false] }],
      [{
        text: '\n????????????', style: `${labelStyle}`, colSpan: 2, border: [true, true, false, true],
      }, {},
      {
        text: '\n\n????????????????????????', style: `${labelStyle}`, margin: [12, 0, 10, 0], border: [false, false, true, true],
      },
      { text: '\n\n????????????', style: `${labelStyle}`, border: [true, false, true, true] }],
    ];
    if (declWayCode === 'IMPT' || declWayCode === 'EXPT') {
      pdfFooter = [
        [{ text: `??????????????????:${head.special_relation ? '???' : '???'}`, border: [true, false, false, true] },
          { text: `??????????????????:${head.price_effect ? '???' : '???'}`, border: [false, false, false, true] },
          { text: `??????????????????????????????:${head.payment_royalty ? '???' : '???'}`, colSpan: 2, border: [false, false, false, true] },
          {},
          { text: '????????????:???', border: [false, false, true, true] }],
        [{ text: [{ text: `???????????? ${head.decl_pensonnel_name || ''}\n\n`, style: `${labelStyle}` }, { text: `???????????? ${head.agent_name}`, style: `${labelStyle}` }], style: `${labelStyle}`, border: [true, true, false, true] },
          { text: `?????????????????? ${head.decl_pensonnel_code || ''}\n`, style: `${labelStyle}`, border: [false, false, false, true] },
          { text: `?????? ${head.decl_pensonnel_phone || ''}\n`, style: `${labelStyle}`, border: [false, false, false, true] },
          {
            text: [{ text: '????????????????????????????????????????????????????????????????????????\n', style: `${labelStyle}` }, { text: '\n????????????????????????', style: `${labelStyle}` }], margin: [12, 0, 10, 0], border: [false, true, true, true],
          },
          { text: '?????????????????????\n', style: `${labelStyle}`, border: [true, true, true, true] }],
        [{
          text: '?????????', style: `${labelStyle}`, colSpan: 5, border: [false, false, false, false],
        }, {}, {}, {}, {},
        ],
      ];
    }
    if (end) {
      content.push({
        style: 'table',
        table: { widths: ['18%', '11%', '12%', '29%', '30%'], heights: [14, 36, 42], body: pdfFooter },
        layout: {
          vLineWidth(i, node) {
            if (skeleton) { return 0; }
            return (i !== 0 && i !== node.table.widths.length) ? 0.8 : 1.2;
          },
          hLineWidth(i, node) {
            if (skeleton) { return 0; }
            return (i === node.table.body.length) ? 1.2 : 0.8;
          },
        },
      });
    } else {
      content.push({
        style: 'table',
        pageBreak: 'after',
        table: { widths: ['18%', '11%', '12%', '29%', '30%'], body: pdfFooter },
        layout: {
          vLineWidth(i, node) {
            if (skeleton) { return 0; }
            return (i !== 0 && i !== node.table.widths.length) ? 0.8 : 1.2;
          },
          hLineWidth(i, node) {
            if (skeleton) { return 0; }
            return (i === node.table.body.length) ? 1.2 : 0.8;
          },
        },
      });
    }
    docDefinition.content = docDefinition.content.concat(content);
  }
  return docDefinition;
}
