import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Popover } from 'antd';
import { INSPECTIONS } from 'common/constants';

@connect(state => ({
  certMark: state.saasParams.latest.certMark.map(f => ({ value: f.cert_code, text: f.cert_spec })),
}))
export default class CustomsInpsectionTip extends React.Component {
  static propTypes = {
    str: PropTypes.string.isRequired,
    type: PropTypes.string,
  }
  render() {
    const { str, type, certMark } = this.props;
    if (!str || str === '-') {
      return (<span>{str}</span>);
    }
    const data = type === 'customs' ? certMark : INSPECTIONS;
    const arr = [];
    for (let i = 0; i < str.length; i++) {
      const k = str[i];
      if (k !== '/' && k !== '.') {
        const item = data.find(f => f.value === k);
        if (item) arr.push(<span key={item.value}>{item.value}:{item.text} <br /></span>);
      }
    }
    return (<Popover content={arr}><a role="presentation">{str}</a></Popover>);
  }
}
