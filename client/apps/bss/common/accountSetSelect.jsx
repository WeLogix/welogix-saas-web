import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Select } from 'antd';
import { switchAccountSet, loadAccountSets } from 'common/reducers/bssSetting';
import { LogixIcon } from 'client/components/FontIcon';
import { formatMsg } from './message.i18n';

const { Option } = Select;

@injectIntl
@connect(
  state => ({
    accountSets: state.bssSetting.accountSets,
    currentAccountSet: state.bssSetting.currentAccountSet,
  }),
  { switchAccountSet, loadAccountSets }
)
export default class AccountSetSelect extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
  }
  componentDidMount() {
    this.props.loadAccountSets();
  }
  msg = formatMsg(this.props.intl)
  handleAccountSetChange = (value) => {
    this.props.switchAccountSet(value);
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  }
  render() {
    const {
      disabled, currentAccountSet, accountSets,
    } = this.props;
    return (
      <Select
        showArrow={false}
        value={currentAccountSet.id}
        placeholder={this.msg('selectWhse')}
        onSelect={this.handleAccountSetChange}
        disabled={disabled}
        dropdownMatchSelectWidth={false}
      >
        {accountSets.map(set =>
          (<Option key={set.id} value={set.id}><LogixIcon style={{ marginRight: 8 }} type="icon-account-set" />{set.company_name}</Option>))
        }
      </Select>
    );
  }
}
