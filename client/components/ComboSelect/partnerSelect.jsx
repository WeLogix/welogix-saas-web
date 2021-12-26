import React from 'react';
import PropTypes from 'prop-types';
import { Select, Tooltip } from 'antd';
import { injectIntl, intlShape } from 'react-intl';
import { LogixIcon } from 'client/components/FontIcon';
import { PARTNER_ROLES } from 'common/constants';
import { formatMsg } from '../message.i18n';

const { Option } = Select;

@injectIntl
export default class PartnerSelect extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    onPartnerChange: PropTypes.func,
    selectedPartner: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    showCus: PropTypes.bool,
    showSup: PropTypes.bool,
    showVen: PropTypes.bool,
  }
  state = {
    type: 'customer',
  }
  componentDidMount() {
    if (!this.props.showCus) {
      if (this.props.showSup) {
        this.setState({ type: 'supplier' });
      } else if (this.props.showVen) {
        this.setState({ type: 'vendor' });
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    if (!nextProps.showCus) {
      if (nextProps.showSup) {
        this.setState({ type: 'supplier' });
      } else if (nextProps.showVen) {
        this.setState({ type: 'vendor' });
      }
    }
  }
  msg = formatMsg(this.props.intl)
  hanldeSwitchMode = (type) => {
    this.setState({ type });
  }
  render() {
    const {
      paramPartners, selectedPartner, onPartnerChange, style,
      showCus, showSup, showVen,
    } = this.props;
    let filterPartners = paramPartners || [];
    const partnerType = this.state.type;
    if (partnerType === 'customer') {
      filterPartners = filterPartners.filter(f =>
        [PARTNER_ROLES.CUS, PARTNER_ROLES.DCUS, PARTNER_ROLES.OWN].includes(f.role));
    } else if (partnerType === 'supplier') {
      filterPartners = filterPartners.filter(f => f.role === PARTNER_ROLES.SUP);
    } else if (partnerType === 'vendor') {
      filterPartners = filterPartners.filter(f => f.role === PARTNER_ROLES.VEN);
    }
    const options = [];
    if (showCus) {
      options.push(<Option key="customer"><Tooltip title={this.msg('customer')} placement="left"><LogixIcon type="icon-customer" /></Tooltip></Option>);
    }
    if (showSup) {
      options.push(<Option key="supplier"><Tooltip title={this.msg('supplier')} placement="left"><LogixIcon type="icon-supplier" /></Tooltip></Option>);
    }
    if (showVen) {
      options.push(<Option key="vendor"><Tooltip title={this.msg('vendor')} placement="left"><LogixIcon type="icon-vendor" /></Tooltip></Option>);
    }
    return (
      <span className="select-combobox" style={style}>
        <Select
          style={{ width: 38, margin: 0 }}
          value={this.state.type}
          showArrow={false}
          disabled={options.length === 1}
          onChange={this.hanldeSwitchMode}
        >
          {options}
        </Select>
        <Select
          allowClear
          showSearch
          optionFilterProp="children"
          dropdownMatchSelectWidth={false}
          dropdownStyle={{ width: 360, maxHeight: 400, overflow: 'auto' }}
          placeholder={`选择${this.msg(this.state.type)}`}
          value={selectedPartner}
          onChange={onPartnerChange}
          style={{ width: 'calc(100% - 38px)', margin: 0, marginLeft: -1 }}
        >
          {filterPartners.map(data => (<Option key={data.id} value={data.id}>
            {[data.partner_code, data.name].filter(dd => dd).join(' | ')}
          </Option>))}
        </Select>
      </span>
    );
  }
}
