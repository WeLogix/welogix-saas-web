import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Select, message } from 'antd';
import { switchDefaultWhse } from 'common/reducers/cwmContext';
import { LogixIcon } from 'client/components/FontIcon';
import { formatMsg } from './message.i18n';

const { Option } = Select;

@injectIntl
@connect(
  state => ({
    whses: state.cwmContext.whses,
    defaultWhse: state.cwmContext.defaultWhse,
  }),
  { switchDefaultWhse }
)
export default class WhseSelect extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    bonded: PropTypes.bool,
  }
  msg = formatMsg(this.props.intl)
  handleWhseChange = (value) => {
    this.props.switchDefaultWhse(value);

    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
    message.info(this.msg('whseChanged'));
  }
  render() {
    const {
      whses, defaultWhse, bonded, disabled,
    } = this.props;
    const bondedWhses = whses.filter(wh => wh.bonded);
    const whseList = bonded ? bondedWhses : whses;
    return (
      <Select
        showArrow={false}
        value={defaultWhse.code}
        placeholder={this.msg('selectWhse')}
        onSelect={this.handleWhseChange}
        disabled={disabled}
      >
        {whseList.map(warehouse =>
          (<Option key={warehouse.code} value={warehouse.code}><LogixIcon style={{ marginRight: 8 }} type="icon-warehouse-o" />{warehouse.name}</Option>))
        }
      </Select>
    );
  }
}
