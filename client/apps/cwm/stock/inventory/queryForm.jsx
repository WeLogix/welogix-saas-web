import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Button, Form, Input, Select } from 'antd';
import { changeSearchType } from 'common/reducers/cwmInventoryStock';
import { CWM_STOCK_SEARCH_TYPE } from 'common/constants';
import LocationSelect from 'client/apps/cwm/common/locationSelect';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;


@injectIntl
@connect(
  state => ({
    filter: state.cwmInventoryStock.listFilter,
    owners: state.cwmContext.whseAttrs.owners,
  }),
  { changeSearchType }
)
@Form.create()
export default class QueryForm extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({ getFieldDecorator: PropTypes.func.isRequired }).isRequired,
    onSearch: PropTypes.func.isRequired,
  }
  state = {
    advSearch: false,
    relDateRange: [],
  };
  handleSearchTypeChange = (value) => {
    this.props.changeSearchType(value);
  }
  handleFormReset = () => {
    this.props.form.resetFields();
  }
  toggleAdvSearch = () => {
    this.setState({
      advSearch: !this.state.advSearch,
    });
  }
  handleStockSearch = (ev) => {
    ev.preventDefault();
    const { relDateRange } = this.state;
    this.props.form.validateFields((err) => {
      if (!err) {
        const formData = this.props.form.getFieldsValue();
        this.props.onSearch(Object.assign(
          formData,
          {
            whse_location: formData.whse_location || null, // search_type为货品库别时设为null用于覆盖原值
            start_date: relDateRange.length === 2 ? relDateRange[0].valueOf() : undefined,
            end_date: relDateRange.length === 2 ? relDateRange[1].valueOf() : undefined,
          }
        ));
      }
    });
  }
  handleRelRangeChange = (relDateRange) => {
    this.setState({ relDateRange });
  }
  msg = formatMsg(this.props.intl);
  render() {
    const { form: { getFieldDecorator, getFieldValue }, owners, filter } = this.props;
    return (
      <Form layout="inline">
        <FormItem>
          {getFieldDecorator('search_type', {
            initialValue: filter.search_type,
          })(<Select placeholder="汇总方式" onChange={this.handleSearchTypeChange} style={{ width: 150 }}>
            <Option value={CWM_STOCK_SEARCH_TYPE[1].value}>{CWM_STOCK_SEARCH_TYPE[1].text}</Option>
            <Option value={CWM_STOCK_SEARCH_TYPE[4].value}>{CWM_STOCK_SEARCH_TYPE[4].text}</Option>
            <Option value={CWM_STOCK_SEARCH_TYPE[3].value}>{CWM_STOCK_SEARCH_TYPE[3].text}</Option>
            <Option value={CWM_STOCK_SEARCH_TYPE[2].value}>{CWM_STOCK_SEARCH_TYPE[2].text}</Option>
            <Option value={CWM_STOCK_SEARCH_TYPE[0].value}>{CWM_STOCK_SEARCH_TYPE[0].text}</Option>
          </Select>)}
        </FormItem>
        <FormItem>
          {getFieldDecorator('owner', {
                initialValue: filter.owner,
          })(<Select placeholder="货主" showSearch optionFilterProp="children" allowClear >
            {owners.map(owner => (<Option value={owner.id} key={owner.id}>{owner.name}</Option>))}
          </Select>)}
        </FormItem>
        <FormItem>
          {getFieldDecorator('product_no', {
                initialValue: filter.product_no,
              })(<Input placeholder="货号" />)}
        </FormItem>
        {getFieldValue('search_type') !== CWM_STOCK_SEARCH_TYPE[4].value &&
        <FormItem>
          {getFieldDecorator('whse_location', {
                initialValue: filter.whse_location,
              })(<LocationSelect placeholder="库位" />)}
        </FormItem>}
        <FormItem>
          <Button type="primary" icon="search" onClick={this.handleStockSearch}>{this.msg('query')}</Button>
        </FormItem>
      </Form>
    );
  }
}
