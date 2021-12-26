import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { message } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import FullscreenModal from 'client/components/FullscreenModal';
import { toggleFeesWriteInModal, getBillingFeesByBizNo, updateAPFee, updateFee } from 'common/reducers/cmsExpense';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';
import { INVOICE_CAT, INVOICE_PARTY } from 'common/constants';
import { formatMsg } from '../message.i18n';

const invoiceCatMap = INVOICE_CAT.reduce((pre, cur) => {
  const data = { ...pre };
  data[cur.value] = cur.key;
  return data;
}, {});

const invoicePartyMap = INVOICE_PARTY.reduce((pre, cur) => {
  const data = { ...pre };
  data[cur.value] = cur.key;
  return data;
}, {});

@injectIntl
@connect(
  state => ({
    visible: state.cmsExpense.feesWriteInModal.visible,
    selFeeCodes: state.cmsExpense.feesWriteInModal.selFeeCodes,
    billingFees: state.cmsExpense.feesWriteInModal.billingFees,
  }),
  {
    toggleFeesWriteInModal,
    getBillingFeesByBizNo,
    updateAPFee,
    updateFee,
  }
)
export default class BatchFeeWriteInModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    type: PropTypes.oneOf(['receivable', 'payable']),
    reload: PropTypes.func.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    expenses: [],
    expenseFeesMap: {},
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.props.toggleFeesWriteInModal(false);
    this.setState({
      expenses: [],
    });
    this.props.reload();
  }
  handleAfterChange = (changes) => {
    if (changes && changes.length === 1) {
      const [row, col, oldVal, newVal] = changes[0];
      if ((col === 1 || col === 0) && newVal) {
        const selFeeCodes = this.props.selFeeCodes.map(fee => fee.fee_code);
        let bizType;
        if (col === 0) {
          bizType = 'bizNo';
        } else {
          bizType = 'delgNo';
        }
        this.props.getBillingFeesByBizNo(
          newVal,
          selFeeCodes,
          this.props.type,
          bizType
        ).then((result) => {
          if (!result.error) {
            const expenses = [...this.state.expenses];
            const expenseFeesMap = { ...this.state.expenseFeesMap };
            const { expNo } = result.data;
            expenses.push(expNo);
            expenseFeesMap[expNo] = {
              fees: [],
              recvableAccountSum: result.data.totalSum.recvable_account_sum,
              recvableOtherSum: result.data.totalSum.recvable_other_sum,
              customsEntryNos: result.data.customsEntryNos,
              blWbNo: result.data.blWbNo,
              delgNo: result.data.delgNo,
            };
            for (let i = 0; i < selFeeCodes.length; i++) {
              const feeCode = selFeeCodes[i];
              const selFee = this.props.selFeeCodes.find(f => f.fee_code === feeCode);
              const fee = result.data.fees.find(f => f.fee_code === feeCode);
              if (fee) {
                expenseFeesMap[expNo].fees.push({
                  ...fee,
                  fee_type: selFee.fee_type,
                });
              } else {
                expenseFeesMap[expNo].fees.push(null);
              }
            }
            this.setState({
              expenses,
              expenseFeesMap,
            });
          } else {
            let msg = '';
            if (result.error.message.key === 'noExpense') {
              msg = '没有找到相关费用';
            } else {
              msg = `未知错误: ${result.error.message}`;
            }
            message.error(msg);
          }
        });
      } else {
        const { expenses, expenseFeesMap } = this.state;
        const expNo = expenses[row - 2];
        if (expenseFeesMap[expNo]) {
          const fee = expenseFeesMap[expNo].fees[Math.floor((col - 2) / 3)];
          const { delgNo } = expenseFeesMap[expNo];
          const contentLog = `录入费用代码[${fee.fee_code}]`;
          if (fee) {
            const remainder = (col - 2) % 3;
            let field;
            if (remainder === 0) {
              field = 'base_amount';
            } else if (remainder === 1) {
              field = 'invoice_party';
            } else {
              field = 'invoice_cat';
            }
            fee[field] = newVal;
            if (fee.base_amount && fee.invoice_party && fee.invoice_cat) {
              let prom;
              if (fee.fee_type === 'AP') {
                prom = this.props.updateAPFee(
                  {
                    base_amount: fee.base_amount,
                    orig_amount: fee.base_amount,
                    fee_type: fee.fee_type,
                    invoice_cat: invoiceCatMap[fee.invoice_cat],
                    invoice_party: invoicePartyMap[fee.invoice_party],
                    fee_code: fee.fee_code,
                    id: fee.id,
                  },
                  expNo,
                  contentLog,
                  delgNo,
                );
              } else {
                let delta;
                if (field === 'base_amount' && oldVal) {
                  delta = newVal - oldVal;
                }
                prom = this.props.updateFee(
                  {
                    base_amount: fee.base_amount,
                    orig_amount: fee.orig_amount,
                    fee_type: fee.fee_type,
                    delta: delta || fee.base_amount,
                    id: fee.id,
                  },
                  expNo,
                  contentLog,
                  delgNo,
                );
              }
              prom.then((result) => {
                if (!result.error) {
                  expenseFeesMap[expNo].recvableAccountSum += result.data.recvable_account;
                  expenseFeesMap[expNo].recvableOtherSum += result.data.recvable_other;
                }
                this.setState({
                  expenseFeesMap,
                });
              });
            }
          }
        }
        this.setState({
          expenseFeesMap,
        });
      }
    }
  }
  renderCellProp = (row, col) => {
    const { expenses, expenseFeesMap } = this.state;
    const cellProperties = {};
    if (row < 2) {
      cellProperties.readOnly = true;
    }
    const expNo = expenses[row - 2];
    if (expNo) {
      const index = Math.floor((col - 2) / 3);
      if (!expenseFeesMap[expNo].fees[index]) {
        cellProperties.readOnly = true;
      }
    }
    return cellProperties;
  }
  render() {
    const { visible, selFeeCodes } = this.props;
    const { expenses, expenseFeesMap } = this.state;
    const data = [];
    const mergeCells = [];
    const columns = [
      {
        type: 'text',
      },
      {
        type: 'text',
      },
    ];
    const headInfo = selFeeCodes.reduce(
      (pre, cur) => {
        const head = pre;
        head.mainHead = head.mainHead.concat([`${cur.fee_code}|${cur.fee_name}`, '', '']);
        head.subHead = head.subHead.concat(['金额', '发票抬头', '发票类型']);
        mergeCells.push({
          row: 0, col: head.index, rowspan: 1, colspan: 3,
        });
        columns.push({
          type: 'numeric',
        }, {
          editor: 'select',
          selectOptions: ['货主', '上游客户', '我方', '下游服务商'],
        }, {
          editor: 'select',
          selectOptions: ['增值税专用发票', '增值税普通发票'],
        });
        head.index += 3;
        return head;
      },
      { mainHead: ['提运单号/报关单号', '委托编号'], subHead: ['', ''], index: 2 }
    );
    columns.push({ type: 'numeric' }, { type: 'numeric' });
    data.push(headInfo.mainHead.concat(['应收帐款', '其他应收款']), headInfo.subHead.concat(['', '']));
    for (let i = 0; i < expenses.length; i++) {
      const expNo = expenses[i];
      const { fees, delgNo } = expenseFeesMap[expNo];
      const body = [`${expenseFeesMap[expNo].customsEntryNos || ''}/${expenseFeesMap[expNo].blWbNo}`, delgNo];
      for (let j = 0; j < fees.length; j++) {
        const fee = fees[j];
        if (fee) {
          body.push(fee.base_amount, fee.invoice_party, fee.invoice_cat);
        } else {
          body.push('--', '--', '--');
        }
      }
      body.push(expenseFeesMap[expNo].recvableAccountSum, expenseFeesMap[expNo].recvableOtherSum);
      data.push(body);
    }
    return (
      <FullscreenModal
        maskClosable={false}
        title={this.msg('writeInFees')}
        visible={visible}
        onCancel={this.handleCancel}
        destroyOnClose
      >
        <div id="hot-app">
          <HotTable
            data={data}
            stretchH="all"
            autoWrapRow
            manualRowResize
            manualColumnResize
            rowHeaders
            colHeaders={false}
            fixedRowsTop={2}
            mergeCells={mergeCells}
            className="htCenter"
            columns={columns}
            afterChange={this.handleAfterChange}
            minSpareRows={10}
            cells={this.renderCellProp}
          />
        </div>
      </FullscreenModal>
    );
  }
}
