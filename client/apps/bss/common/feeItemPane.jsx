import React, { Component } from 'react';
import { intlShape, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Select, Input } from 'antd';
import { loadAllFeeElements } from 'common/reducers/bssSetting';
import RowAction from 'client/components/RowAction';
import DataGrid from 'client/components/DataGrid';
import { BSS_BIZ_TYPE, BSS_PRESET_FEE, BSS_INV_TYPE, BSS_FEE_TYPE } from 'common/constants';
import OrderSelect from './orderSelect';
import { formatMsg } from './message.i18n';

const { Option } = Select;
@injectIntl
@connect(
  state => ({
    allFeeElements: state.bssSetting.allFeeElements,
  }),
  { loadAllFeeElements },
)
export default class FeeItemPane extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    invType: PropTypes.number,
    bizType: PropTypes.number,
    form: PropTypes.shape({
      setFieldsValue: PropTypes.func,
    }),
    feeItems: PropTypes.arrayOf(PropTypes.shape({
      fee_code: PropTypes.string,
      fee_name: PropTypes.string,
      fee_type: PropTypes.string,
    })),
    onFeeItemChange: PropTypes.func.isRequired,
    paymentType: PropTypes.number,
    disabled: PropTypes.bool,
  };
  componentDidMount() {
    this.props.loadAllFeeElements();
  }
  msg = formatMsg(this.props.intl);
  columns = [
    {
      title: this.msg('seqNo'),
      dataIndex: 'feeIndex',
      width: 45,
      align: 'center',
      className: 'table-col-seq',
      render: o => o + 1,
    },
    {
      title: this.msg('bizType'),
      dataIndex: 'biz_type',
      width: 120,
      align: 'center',
      render: (o, record) => {
        if (this.props.paymentType === 1 && !this.props.disabled) {
          return (<Select value={o} onSelect={value => this.handleChange('biz_type', value, record.feeIndex)}>
            {BSS_BIZ_TYPE.map(type => (
              <Option key={type.key} value={type.value}>{type.text}</Option>
            ))}
          </Select>);
        }
        const type = BSS_BIZ_TYPE.find(bizType =>
          bizType.value === (this.props.bizType || record.biz_type));
        return type ? type.text : null;
      },
    },
    {
      title: this.msg('bizNo'),
      dataIndex: 'biz_no',
      width: 200,
      render: (o, record) => {
        let value;
        if (record.biz_type === BSS_BIZ_TYPE[0].value) {
          value = record.cust_order_no;
        } else if (record.biz_type === BSS_BIZ_TYPE[1].value) {
          value = record.decl_entry_no;
        } else if (record.biz_type === BSS_BIZ_TYPE[2].value) {
          value = record.po_no;
        } else if (record.biz_type === BSS_BIZ_TYPE[3].value) {
          value = record.shipmt_no;
        }
        if (this.props.paymentType === 2 || this.props.disabled) {
          return value;
        }
        return (<OrderSelect
          index={record.feeIndex}
          handleSelect={this.handleChange}
          bizType={this.props.bizType || record.biz_type}
          value={o || value}
        />);
      },
    },
    {
      title: this.msg('feeCode'),
      dataIndex: 'fee_code',
      width: 150,
      render: (o, record) => {
        const options = this.props.invType === BSS_INV_TYPE[2].value ?
          BSS_PRESET_FEE : this.props.allFeeElements;
        return (<Select
          disabled={this.props.disabled || this.props.paymentType === 2}
          value={o}
          onChange={value => this.handleFeeSelect(value, record.feeIndex)}
        >
          {options.map(op => (
            <Option key={op.fee_code} value={op.fee_code}>{`${op.fee_code} | ${op.fee_name}`}</Option>
          ))}
        </Select>);
      },
    },
    {
      title: this.msg('feeType'),
      dataIndex: 'fee_type',
      width: 100,
      align: 'center',
      render: (o, record) => {
        if (this.props.invType === BSS_INV_TYPE[2].value) {
          return null;
        }
        return (<Select disabled={this.props.disabled || this.props.paymentType === 2} value={o} onChange={value => this.handleChange('fee_type', value, record.feeIndex)}>
          {BSS_FEE_TYPE.map(type => (
            <Option key={type.key} value={type.key}>{type.text}</Option>
          ))}
        </Select>);
      },
    },
    {
      title: this.msg('amount'),
      dataIndex: 'base_amount',
      width: 100,
      align: 'right',
      render: (o, record) => {
        if (this.props.invType === BSS_INV_TYPE[2].value) {
          return null;
        } else if (this.props.paymentType === 2 || this.props.disabled) {
          return o;
        }
        return (<Input
          value={o}
          onChange={e => this.handleAmountChange(e.target.value, 'base_amount', record)}
          disabled={this.props.invType === BSS_INV_TYPE[2].value}
        />);
      },
    },
    {
      title: this.msg('taxRate'),
      dataIndex: 'tax_rate',
      width: 100,
      align: 'right',
      render: (o, record) => {
        if (this.props.paymentType === 2 || this.props.disabled) {
          return o;
        }
        return <Input value={o} onChange={e => this.handleAmountChange(e.target.value, 'tax_rate', record)} />;
      },
    },
    {
      title: this.msg('taxAmount'),
      dataIndex: 'tax',
      width: 100,
      align: 'right',
      render: (o, record) => {
        if (this.props.paymentType === 2 || this.props.disabled) {
          return o;
        }
        return <Input value={o} onChange={e => this.handleAmountChange(e.target.value, 'tax', record)} />;
      },
    },
    {
      title: this.msg('includedAmount'),
      dataIndex: 'sum_amount',
      width: 100,
      align: 'right',
      render: (o, record) => {
        if (this.props.invType === BSS_INV_TYPE[2].value) {
          return null;
        } else if (this.props.paymentType === 2 || this.props.disabled) {
          return o;
        }
        return <Input value={o} onChange={e => this.handleAmountChange(e.target.value, 'sum_amount', record)} />;
      },
    },
    {
      title: this.msg('remark'),
      dataIndex: 'remark',
      render: (o, record) => {
        if (this.props.paymentType === 2 || this.props.disabled) {
          return o;
        }
        return <Input value={o} onChange={e => this.handleChange('remark', e.target.value, record.feeIndex)} />;
      },
    },
    {
      title: this.msg('opCol'),
      dataIndex: 'OPS_COL',
      className: 'ops-col',
      width: 70,
      fixed: 'right',
      render: (o, record) => {
        if (this.props.paymentType === 2 || this.props.disabled) {
          return null;
        }
        return (
          <span>
            <RowAction
              shape="circle"
              icon="plus-circle"
              onClick={this.handleAddRow}
              tooltip={this.msg('add')}
              row={record}
            />
            <RowAction
              danger
              shape="circle"
              icon="close-circle"
              onClick={() => this.handleDelRow(record.feeIndex)}
              tooltip={this.msg('delete')}
              row={record}
            />
          </span>
        );
      },
    },
  ];
  handleAddRow = () => {
    const feeItems = [...this.props.feeItems];
    feeItems.push({ feeIndex: feeItems.length });
    this.props.onFeeItemChange(feeItems);
  }
  handleDelRow = (feeIndex) => {
    const feeItems = [...this.props.feeItems];
    if (feeItems.length === 1) {
      return;
    }
    const index = feeItems.findIndex(item => item.feeIndex === feeIndex);
    feeItems.splice(index, 1);
    if (this.props.invType !== BSS_INV_TYPE[2].value) {
      this.props.form.setFieldsValue({
        invoice_amount: feeItems.reduce((pre, cur) => pre + cur.sum_amount || 0, 0),
      });
    } else {
      this.props.form.setFieldsValue({
        invoice_amount: feeItems.reduce((pre, cur) => pre + cur.tax || 0, 0),
      });
    }
    this.props.onFeeItemChange(feeItems.map((fee, idx) => ({ ...fee, feeIndex: idx })));
  }
  handleAmountChange = (value, field, row) => {
    const feeItems = [...this.props.feeItems];
    let record;
    if (row.id) {
      record = feeItems.find(item => item.id === row.id);
    } else {
      const index = feeItems.findIndex(item => item.feeIndex === row.feeIndex);
      record = feeItems[index];
    }
    const { form, invType } = this.props;
    if (field === 'base_amount') {
      const amount = Number(value);
      if (!Number.isNaN(amount)) {
        record.base_amount = amount;
        if (record.tax_rate) {
          record.tax = parseFloat((amount * (record.tax_rate / 100)).toFixed(3));
        }
      }
    } else if (field === 'tax_rate') {
      const rate = Number(value);
      if (!Number.isNaN(rate)) {
        record.tax_rate = rate;
        if (record.base_amount) {
          record.tax = parseFloat((record.base_amount * (rate / 100)).toFixed(3));
        } else if (record.tax && invType !== BSS_INV_TYPE[2].value) {
          record.base_amount = parseFloat((record.tax / (rate / 100)).toFixed(3));
        }
      }
    } else if (field === 'tax') {
      const taxAmount = Number(value);
      if (!Number.isNaN(taxAmount)) {
        record.tax = taxAmount;
        if (record.tax_rate && invType !== BSS_INV_TYPE[2].value) {
          record.base_amount = parseFloat(taxAmount * (record.tax_rate / 100).toFixed(3));
        } else if (record.base_amount) {
          record.tax_rate = parseFloat(((taxAmount / record.base_amount) * 100).toFixed(3));
        }
      }
    } else if (field === 'sum_amount') {
      const sumAmount = Number(value);
      if (!Number.isNaN(sumAmount)) {
        record.sum_amount = sumAmount;
        if (record.base_amount) {
          record.tax = sumAmount - record.base_amount;
          record.tax_rate = parseFloat((record.tax / record.base_amount / 100).toFixed(3));
        } else if (record.tax) {
          record.base_amount = sumAmount - record.tax;
          record.tax_rate = parseFloat((record.tax / record.base_amount / 100).toFixed(3));
        } else if (record.tax_rate) {
          record.base_amount =
            parseFloat((sumAmount / (1 + (record.tax_rate / 100))).toFixed(3));
          record.tax = sumAmount - record.base_amount;
        }
      }
    }
    if (field !== 'sum_amount' && record.base_amount && record.tax) {
      record.sum_amount = parseFloat((record.base_amount + record.tax).toFixed(3));
    }
    if (invType !== BSS_INV_TYPE[2].value) {
      form.setFieldsValue({
        invoice_amount: feeItems.reduce((pre, cur) => pre + cur.sum_amount || 0, 0),
      });
    } else {
      form.setFieldsValue({
        invoice_amount: feeItems.reduce((pre, cur) => pre + cur.tax || 0, 0),
      });
    }
    this.props.onFeeItemChange(feeItems);
  }
  handleFeeSelect = (value, feeIndex) => {
    const options = this.props.invType === BSS_INV_TYPE[2].value ?
      BSS_PRESET_FEE : this.props.allFeeElements;
    const feeItems = [...this.props.feeItems];
    const fee = options.find(op => op.fee_code === value);
    const index = feeItems.findIndex(item => item.feeIndex === feeIndex);
    feeItems[index].fee_code = value;
    feeItems[index].fee_name = fee.fee_name;
    feeItems[index].fee_type = fee.fee_type;
    feeItems[index].fee_group = fee.fee_group;
    feeItems[index].apportion_rule = fee.apportion_rule;
    this.props.onFeeItemChange(feeItems);
  }
  handleChange = (dataIndex, value, feeIndex) => {
    const feeItems = [...this.props.feeItems];
    const index = feeItems.findIndex(item => item.feeIndex === feeIndex);
    const record = feeItems[index];
    record[dataIndex] = value;
    this.props.onFeeItemChange(feeItems);
  }
  render() {
    const { feeItems } = this.props;
    return (
      <DataGrid
        columns={this.columns}
        dataSource={feeItems}
        rowKey="id"
      />
    );
  }
}
