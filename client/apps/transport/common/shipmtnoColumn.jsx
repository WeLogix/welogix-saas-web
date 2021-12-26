import React from 'react';
import PropTypes from 'prop-types';

export default class ShipmtNoColumnRender extends React.Component {
  static propTypes = {
    shipmtNo: PropTypes.string.isRequired,
    shipment: PropTypes.shape({ shipmt_no: PropTypes.string.isRequired }).isRequired,
    onClick: PropTypes.func.isRequired,
  }
  handleClick = (ev) => {
    ev.stopPropagation();
    this.props.onClick(this.props.shipment);
    return false;
  }
  render() {
    const { shipmtNo, ...extra } = this.props;
    const { shipment, ...rest } = extra; // eslint-disable-line no-unused-vars
    return (
      <a {...rest} onClick={this.handleClick}>
        {shipmtNo}
      </a>
    );
  }
}
