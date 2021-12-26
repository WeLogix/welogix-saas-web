import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Input, Select, Button, Tag } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import DataPane from 'client/components/DataPane';
import RowAction from 'client/components/RowAction';
import Summary from 'client/components/Summary';
import EditableCell from 'client/components/EditableCell';
import { updateFee, deleteFee, getExpenseDetails, updateFeeByInputQty, updateAPFee, copyAPFee } from 'common/reducers/tmsExpense';
import { toggleAddSpecialModal } from 'common/reducers/bssSetting';
import { BSS_FEE_TYPE, CMS_EVENTS } from 'common/constants';
import { formatMsg } from '../message.i18n';

const { Option } = Select;

@injectIntl
@connect(
  state => ({
    tenantId: state.account.tenantId,
    currencies: state.tmsExpense.currencies,
    feeEventMap: state.cmsPrefEvents.feeEventMap,
    expenseReloadType: state.bssSetting.expenseReloadType,
  }),
  {
    updateFee,
    deleteFee,
    toggleAddSpecialModal,
    getExpenseDetails,
    updateFeeByInputQty,
    updateAPFee,
    copyAPFee,
  }
)
export default class FeesPane extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    loading: PropTypes.bool.isRequired,
    type: PropTypes.oneOf(['receivable', 'payable']),
    expense: PropTypes.shape({
      expense_no: PropTypes.string,
      special_fee_allowed: PropTypes.bool,
      tax_rate: PropTypes.number,
      quote_no: PropTypes.string,
      feeElements: PropTypes.arrayOf(PropTypes.shape({
        fee_code: PropTypes.string,
        fee_name: PropTypes.string,
      })),
    }).isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
    feePaneCond: PropTypes.shape({
      queryEvents: PropTypes.arrayOf(PropTypes.string).isRequired,
      enabledFeeEvents: PropTypes.arrayOf(PropTypes.string).isRequired,
      disallowSrvEdit: PropTypes.bool.isRequired,
      subscribe: PropTypes.func.isRequired,
    }),
  }
  state = {
    dataSource: [],
    editItem: {},
  }
  /*
     expenseNo异步获取 首个tabPane加载时expenseNo为空 走componentWillReceiveProps
     切换到其他tabpane时 数据已经获取 走componentWillMount
   * */
  componentDidMount() {
    this.handleReload(this.props.expense.expense_no);
    const { feePaneCond } = this.context;
    if (feePaneCond) {
      feePaneCond.subscribe(() => { this.forceUpdate(); });
    }
  }
  componentWillReceiveProps(nextProps) {
    if ((nextProps.expense !== this.props.expense) ||
    (nextProps.expenseReloadType === this.props.type)) {
      this.handleReload(nextProps.expense.expense_no);
    }
  }
  handleReload = (expenseNo) => {
    const { feePaneCond } = this.context;
    this.props.getExpenseDetails({
      expenseNo,
      expType: this.props.type,
      queryEvents: feePaneCond ? JSON.stringify(feePaneCond.queryEvents) : undefined,
    }).then((result) => {
      if (!result.error) {
        this.setState({
          dataSource: result.data,
        });
      }
    });
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('seqNo'),
    dataIndex: 'seq_no',
    width: 45,
    align: 'center',
    className: 'table-col-seq',
    render: (col, row, index) => index + 1,
    visibleFn: () => this.filterColumnByEvent(),
  }, {
    title: this.msg('feeCode'),
    dataIndex: 'fee_code',
    width: 80,
  }, {
    title: this.msg('feeName'),
    dataIndex: 'fee_name',
    width: 120,
  }, {
    title: this.msg('feeType'),
    dataIndex: 'fee_type',
    width: 80,
    align: 'center',
    render: (o) => {
      const type = BSS_FEE_TYPE.filter(fe => fe.key === o)[0];
      return type ? <Tag color={type.tag}>{type.text}</Tag> : <span />;
    },
  }, {
    title: this.msg('inputQty'),
    dataIndex: 'input_qty',
    width: 130,
    align: 'center',
    render: (o, record) => {
      let editable = true;
      if (record.billing_way === 'manusemi') {
        const { feeEventMap } = this.props;
        const { feePaneCond } = this.context;
        if (feePaneCond) {
          const { enabledFeeEvents } = feePaneCond;
          const event = feeEventMap[record.fee_code];
          editable = enabledFeeEvents.findIndex(ev => ev === event) !== -1;
        }
      } else {
        editable = false;
      }
      if (editable) {
        return (<EditableCell
          value={o}
          onChange={e => this.handleColumnChange(e.target.value, 'input_qty')}
          onSave={value => this.handleUpdateFeeByInputQty(record.id, value)}
          style={{ width: '100%' }}
          btnPosition="right"
        />);
      }
      return '--';
    },
  }, {
    title: this.msg('feeEvent'),
    dataIndex: 'fee_event',
    width: 100,
    align: 'center',
    visibleFn: () => this.filterColumnByEvent(),
    render: (o, record) => {
      const event = CMS_EVENTS.find(eve => eve.key === this.props.feeEventMap[record.fee_code]);
      if (event) {
        return event.text;
      }
      return '--';
    },
  }, {
    title: this.msg('origAmount'),
    dataIndex: 'orig_amount',
    width: 100,
    align: 'right',
    render: (o, record) => {
      if (this.state.editItem.id === record.id) {
        return (<Input
          type="number"
          size="small"
          value={this.state.editItem.orig_amount}
          onChange={e => this.handleColumnChange(e.target.value, 'orig_amount')}
        />);
      }
      return o;
    },
  }, {
    title: this.msg('origCurrency'),
    dataIndex: 'currency',
    width: 80,
    align: 'center',
    visibleFn: () => this.filterColumnByEvent(),
    render: (o, record) => {
      if (this.state.editItem.id === record.id) {
        return (
          <Select
            size="small"
            showSearch
            optionFilterProp="children"
            value={this.state.editItem.currency}
            style={{ width: '100%' }}
            allowClear
            onChange={value => this.handleColumnChange(value, 'currency')}
          >
            {this.props.currencies.map(currency =>
              (<Option key={currency.currency} value={currency.currency}>
                {currency.name}
              </Option>))}
          </Select>
        );
      }
      return this.props.currencies.find(curr => curr.currency === o) &&
        this.props.currencies.find(curr => curr.currency === o).name;
    },
  }, {
    title: this.msg('exchangeRate'),
    dataIndex: 'exchange_rate',
    width: 80,
    align: 'right',
    visibleFn: () => this.filterColumnByEvent(),
    render: (o, record) => {
      if (this.state.editItem.id === record.id) {
        return (<Input
          type="number"
          size="small"
          value={this.state.editItem.exchange_rate}
          onChange={e => this.handleColumnChange(e.target.value, 'exchange_rate')}
        />);
      }
      return o;
    },
  }, {
    title: this.msg('baseAmount'),
    dataIndex: 'base_amount',
    width: 100,
    align: 'right',
    visibleFn: () => this.filterColumnByEvent(),
    render: (o, record) => {
      if (this.state.editItem.id === record.id) {
        return (<Input
          type="number"
          size="small"
          disabled
          value={this.state.editItem.base_amount}
        />);
      }
      return o;
    },
  }, {
    title: this.msg('invoiceParty'),
    dataIndex: 'invoice_party',
    width: 150,
    render: (o, record) => {
      if (record.fee_type === 'AP') {
        const { tenantId, type } = this.props;
        const feeItem = this.state.editItem.id === record.id ?
          this.state.editItem : record;
        let party = feeItem.invoice_party;
        if (party && feeItem.adv_tenant_id && feeItem.adv_tenant_id !== tenantId) {
          if (type === 'payable') {
            party = feeItem.invoice_party + 1;
            if (party > 4) {
              party = 4;
            }
          } else if (type === 'receivable') {
            party = feeItem.invoice_party - 1;
            if (party < 1) {
              party = 1;
            }
          }
        }
        if (this.state.editItem.id === record.id) {
          return (<Select
            size="small"
            value={String(party || '')}
            style={{ width: '100%' }}
            onChange={value => this.handleColumnChange(Number(value), 'invoice_party')}
          >
            <Option value="1" key="1">货主</Option>
            <Option value="2" key="2">上游客户</Option>
            <Option value="3" key="3">我方</Option>
            <Option value="4" key="4">下游服务商</Option>
          </Select>);
        }
        switch (party) {
          case 1:
            return '货主';
          case 2:
            return '上游客户';
          case 3:
            return '我方';
          case 4:
            return '下游服务商';
          default:
            return '--';
        }
      }
      return '--';
    },
  }, {
    title: this.msg('invoiceCat'),
    dataIndex: 'invoice_cat',
    width: 180,
    render: (o, record) => {
      if (record.fee_type === 'AP') {
        if (this.state.editItem.id === record.id) {
          return (<Select
            size="small"
            value={this.state.editItem.invoice_cat}
            style={{ width: '100%' }}
            onChange={value => this.handleColumnChange(value, 'invoice_cat')}
          >
            <Option value="VAT_S" key="VAT_S">增值税专用发票</Option>
            <Option value="VAT_N" key="VAT_N">增值税普通发票</Option>
          </Select>);
        }
        if (o === 'VAT_S') {
          return '增值税专用发票';
        } else if (o === 'VAT_N') {
          return '增值税普通发票';
        }
      }
      return '--';
    },
  }, {
    title: this.msg('invoiceNo'),
    dataIndex: 'fee_invoice_no',
    width: 100,
    render: (o, record) => {
      if (record.fee_type === 'AP') {
        if (this.state.editItem.id === record.id) {
          return (<Input
            size="small"
            value={this.state.editItem.fee_invoice_no}
            onChange={e => this.handleColumnChange(e.target.value, 'fee_invoice_no')}
          />);
        }
        return o;
      }
      return '--';
    },
  }, {
    title: this.msg('taxRate'),
    dataIndex: 'tax_rate',
    width: 60,
    align: 'right',
    visibleFn: () => this.filterColumnByEvent(),
    render: (o, record) => {
      if (record.fee_type === 'AP') {
        return this.props.expense.tax_rate;
      }
      return '--';
    },
  }, {
    title: this.msg('plusTax'),
    dataIndex: 'tax',
    width: 100,
    align: 'right',
    visibleFn: () => this.filterColumnByEvent(),
    render: (o, record) => {
      if (record.fee_type === 'AP') {
        if (this.state.editItem.id === record.id) {
          return (<Input
            type="number"
            size="small"
            value={this.state.editItem.tax}
            onChange={e => this.handleColumnChange(e.target.value, 'tax')}
          />);
        }
        return o || '--';
      }
      return '--';
    },
  }, {
    title: this.props.type === 'receivable' ? this.msg('accountReceivable') : this.msg('accountPayable'),
    dataIndex: this.props.type === 'receivable' ? 'recvable_account' : 'payable_account',
    align: 'right',
    width: 100,
    visibleFn: () => this.filterColumnByEvent(),
  }, {
    title: this.props.type === 'receivable' ? this.msg('otherReceivable') : this.msg('otherPayable'),
    dataIndex: this.props.type === 'receivable' ? 'recvable_other' : 'payable_other',
    align: 'right',
    width: 100,
    visibleFn: () => this.filterColumnByEvent(),
  }, {
    title: this.msg('remark'),
    dataIndex: 'remark',
    width: 200,
    render: (o, record) => {
      if (this.state.editItem.id === record.id) {
        return (<Input
          size="small"
          value={this.state.editItem.remark}
          onChange={e => this.handleColumnChange(e.target.value, 'remark')}
        />);
      }
      return o;
    },
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OPS_COL',
    width: 126,
    fixed: (this.context.feePaneCond && this.context.feePaneCond.queryEvents.length > 0) ? false : 'right',
    className: 'table-col-ops',
    render: (o, record) => {
      const { feePaneCond } = this.context;
      const { feeEventMap } = this.props;
      let multiAdv = false;
      const event = feeEventMap[record.fee_code];
      if (event === CMS_EVENTS[0].key && record.fee_type === BSS_FEE_TYPE[1].key) {
        multiAdv = true;
      }
      let opable = true;
      if (feePaneCond) {
        if (feePaneCond.disallowSrvEdit && record.fee_type === BSS_FEE_TYPE[0].key) {
          opable = false;
        } else {
          const { enabledFeeEvents } = feePaneCond;
          opable = enabledFeeEvents.findIndex(ev => ev === event) !== -1;
        }
      }
      if (record.fee_status < 2) {
        if (this.state.editItem.id === record.id) {
          return (<span>
            <RowAction icon="save" onClick={this.handleOk} tooltip={this.msg('confirm')} row={record} />
            <RowAction icon="close" onClick={this.handleCancel} tooltip={this.msg('cancel')} row={record} />
          </span>);
        }
        if (opable) {
          return (<span>
            <RowAction icon="edit" onClick={this.handleEdit} tooltip={this.msg('adjust')} row={record} />
            {multiAdv && <RowAction icon="plus-circle-o" onClick={this.handleAddAdv} tooltip={this.msg('add')} row={record} />}
            <RowAction danger icon="delete" confirm={this.msg('deleteConfirm')} onConfirm={this.handleDelete} tooltip={this.msg('delete')} row={record} />
          </span>);
        }
      }
      return null;
    },
  }]
  filterColumnByEvent = () => {
    const { feePaneCond } = this.context;
    if (feePaneCond && feePaneCond.queryEvents.length > 0) {
      return false;
    }
    return true;
  }
  handleEdit = (row) => {
    this.setState({
      editItem: { ...row },
    });
  }
  handleColumnChange = (value, field) => {
    const editOne = { ...this.state.editItem };
    if (field === 'orig_amount') {
      const amount = parseFloat(value);
      if (!Number.isNaN(amount)) {
        if (editOne.exchange_rate) {
          editOne.base_amount = editOne.exchange_rate * amount;
        } else {
          editOne.base_amount = amount;
        }
        editOne[field] = amount;
      } else {
        editOne.orig_amount = null;
        editOne.base_amount = null;
      }
    } else if (field === 'exchange_rate') {
      const rate = parseFloat(value);
      if (!Number.isNaN(rate)) {
        if (editOne.orig_amount) {
          editOne.base_amount = editOne.orig_amount * rate;
        }
        editOne.exchange_rate = rate;
      } else {
        editOne[field] = null;
      }
    } else if (field === 'tax') {
      const float = parseFloat(value);
      if (!Number.isNaN(float)) {
        editOne[field] = float;
      } else {
        editOne[field] = null;
      }
    } else if (field === 'currency') {
      const { currencies } = this.props;
      if (value) {
        const currency = currencies.find(curr => curr.currency === value);
        editOne.exchange_rate = currency.exchange_rate;
        editOne.base_amount = editOne.orig_amount * currency.exchange_rate;
      } else {
        editOne.exchange_rate = null;
        editOne.base_amount = editOne.orig_amount;
      }
      editOne[field] = value;
    } else {
      if (field === 'invoice_party') {
        editOne.adv_tenant_id = this.props.tenantId;
      }
      editOne[field] = value;
    }
    this.setState({
      editItem: editOne,
    });
  }
  handleOk = () => {
    const item = this.state.editItem;
    const { tenantId } = this.props;
    const dataSource = [...this.state.dataSource];
    const index = dataSource.findIndex(data => data.id === item.id);
    const delta = item.base_amount - dataSource[index].base_amount;
    item.adv_tenant_id = tenantId;
    let prom;
    if (item.id && item.fee_type !== BSS_FEE_TYPE[1].key) {
      prom = this.props.updateFee({
        base_amount: item.base_amount,
        currency: item.currency,
        exchange_rate: item.exchange_rate,
        orig_amount: item.orig_amount,
        remark: item.remark,
        fee_type: item.fee_type,
        delta,
        id: item.id,
      }, this.props.expense.expense_no);
    } else if (item.id && item.fee_type === BSS_FEE_TYPE[1].key) {
      prom = this.props.updateAPFee(
        {
          base_amount: item.base_amount,
          currency: item.currency,
          exchange_rate: item.exchange_rate,
          orig_amount: item.orig_amount,
          remark: item.remark,
          fee_type: item.fee_type,
          invoice_cat: item.invoice_cat,
          invoice_party: item.invoice_party && Number(item.invoice_party),
          fee_invoice_no: item.fee_invoice_no,
          fee_code: item.fee_code,
          id: item.id,
        },
        this.props.expense.expense_no,
      );
    } else if (!item.id) {
      prom = this.props.copyAPFee(
        {
          base_amount: item.base_amount,
          currency: item.currency,
          exchange_rate: item.exchange_rate,
          orig_amount: item.orig_amount,
          remark: item.remark,
          fee_type: item.fee_type,
          invoice_cat: item.invoice_cat,
          invoice_party: item.invoice_party && Number(item.invoice_party),
          fee_invoice_no: item.fee_invoice_no,
          fee_code: item.fee_code,
        },
        this.props.expense.expense_no,
      );
    }
    prom.then((result) => {
      if (!result.error) {
        item.recvable_account = result.data.recvable_account;
        item.recvable_other = result.data.recvable_other;
        item.payable_account = result.data.payable_account;
        item.payable_other = result.data.payable_other;
        item.sum_amount = result.data.sum_amount || item.base_amount;
        if (result.data.tax) {
          item.tax = result.data.tax;
        }
        if (result.data.id) {
          item.id = result.data.id;
        }
        dataSource[index] = item;
        this.setState({
          editItem: {},
          dataSource,
        });
      }
    });
  }
  handleCancel = (row) => {
    if (row.id) {
      this.setState({
        editItem: {},
      });
    } else {
      const dataSource = [...this.state.dataSource];
      const index = dataSource.findIndex(data => data.id === row.id);
      dataSource.splice(index, 1);
      this.setState({
        dataSource,
      });
    }
  }
  handleDelete = (row) => {
    this.props.deleteFee(row.id);
    const dataSource = [...this.state.dataSource];
    const index = dataSource.findIndex(data => data.id === row.id);
    dataSource.splice(index, 1);
    this.setState({ dataSource });
  }
  handleAddSpecial = () => {
    const { expense, type } = this.props;
    let feeCodes = [];
    if (expense.feeElements) {
      feeCodes = expense.feeElements.map(fee => ({ code: fee.fee_code, name: fee.fee_name }));
    }
    this.props.toggleAddSpecialModal(
      true,
      { feeCodes, expenseNo: expense.expense_no, expenseType: type }
    );
  }
  handleUpdateFeeByInputQty = (id, value) => {
    const dataSource = [...this.state.dataSource];
    this.props.updateFeeByInputQty(id, value).then((result) => {
      if (!result.error) {
        const index = dataSource.findIndex(data => data.id === id);
        dataSource[index].orig_amount = result.data.origAmount;
        dataSource[index].base_amount = result.data.origAmount;
        dataSource[index].sum_amount = result.data.origAmount;
        dataSource[index].recvable_account = result.data.origAmount;
        dataSource[index].recvable_other = 0;
        dataSource[index].remark = result.data.remark;
        this.setState({
          dataSource,
        });
      }
    });
  }
  handleAddAdv = (row) => {
    const dataSource = [...this.state.dataSource];
    if (dataSource.find(data => !data.id)) {
      return;
    }
    const index = dataSource.findIndex(data => data.id === row.id);
    const newData = {
      billing_way: row.billing_way,
      fee_code: row.fee_code,
      fee_name: row.fee_name,
      fee_type: BSS_FEE_TYPE[1].key,
      recvable_account: 0,
      recvable_other: 0,
      fee_status: 0,
      invoice_cat: row.invoice_cat,
      invoice_party: row.invoice_party,
    };
    dataSource.splice(index + 1, 0, newData);
    this.setState({
      editItem: newData,
      dataSource,
    });
  }
  render() {
    const {
      loading, expense,
    } = this.props;
    const {
      dataSource,
    } = this.state;
    const feeStat = dataSource.reduce((acc, ds) => {
      const total = { ...acc };
      if (ds.fee_type === 'AP') {
        total.total_ap += ds.sum_amount || 0;
      } else if (ds.fee_type === 'SC') {
        total.total_sc += ds.sum_amount || 0;
      } else if (ds.fee_type === 'SP') {
        total.total_sp += ds.sum_amount || 0;
      }
      return total;
    }, {
      total_ap: 0,
      total_sc: 0,
      total_sp: 0,
    });
    const columns = this.columns.filter(col => !col.visibleFn || col.visibleFn());
    return (
      <DataPane
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        loading={loading}
        bordered
      >
        <DataPane.Toolbar>
          <Button
            icon="plus-circle-o"
            onClick={this.handleAddSpecial}
            disabled={!expense.special_fee_allowed}
          >添加特殊费用</Button>
          <DataPane.Actions>
            <Summary>
              <Summary.Item label="服务费">{feeStat.total_sc.toFixed(2)}</Summary.Item>
              <Summary.Item label="代垫费">{feeStat.total_ap.toFixed(2)}</Summary.Item>
              <Summary.Item label="特殊费">{feeStat.total_sp.toFixed(2)}</Summary.Item>
            </Summary>
          </DataPane.Actions>
        </DataPane.Toolbar>
      </DataPane>
    );
  }
}
