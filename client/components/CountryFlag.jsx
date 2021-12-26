import React from 'react';
import PropTypes from 'prop-types';

export default function CountryFlag(props) {
  const { code, currency } = props;
  const cdnUrl = currency ? 'https://static-cdn.welogix.cn/currency/' : 'https://static-cdn.welogix.cn/flags/';
  const flagUrl = `${cdnUrl}${code ? code.toLowerCase() : 'zzz'}.svg`;

  return (<span
    aria-label={code}
    role="img"
    style={{
      position: 'relative',
      display: 'inline-block',
      width: '1.3333333333em',
      height: '1em',
      backgroundImage: `url(${flagUrl})`,
      backgroundPosition: '50%',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      fontSize: '1em',
      lineHeight: '1em',
      verticalAlign: 'middle',
    }}
    title={code}
  />);
}
CountryFlag.propTypes = {
  code: PropTypes.string.isRequired,
  currency: PropTypes.bool,
};
