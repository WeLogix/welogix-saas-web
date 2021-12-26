import React, { Component } from 'react';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { loadPaymentBizOrder } from 'common/reducers/bssSettlement';
import { Select, message } from 'antd';
import { formatMsg } from './message.i18n';

const { Option } = Select;

@injectIntl
@connect(
  () => ({}),
  { loadPaymentBizOrder }
)
export default class OrderSelect extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    bizType: PropTypes.number,
    handleSelect: PropTypes.func,
    index: PropTypes.number,
    value: PropTypes.string,
  };
  state = {
    options: [],
  }
  handleSearch = (value) => {
    const { bizType } = this.props;
    if (!bizType) {
      message.warn('请先选择业务单据类型');
      return;
    }
    if (value.length >= 4) {
      this.props.loadPaymentBizOrder(value, bizType).then((result) => {
        if (!result.error) {
          this.setState({
            options: result.data,
          });
        }
      });
    }
  }
  handleSelect = (value) => {
    this.props.handleSelect('biz_no', value, this.props.index);
  }
  msg = formatMsg(this.props.intl);
  render() {
    const { value } = this.props;
    const { options } = this.state;
    return (
      <Select
        showSearch
        allowClear
        onSearch={this.handleSearch}
        notFoundContent={null}
        onSelect={this.handleSelect}
        value={value}
      >
        {options.map(op => (
          <Option key={op} value={op}>{op}</Option>
        ))}
      </Select>
    );
  }
}
