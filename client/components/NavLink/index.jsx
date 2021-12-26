import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

export default function NavLink(props) {
  const {
    to,
    disabled,
    onChange,
    className,
    component,
    children,
  } = props;
  const NavComp = component || Link;
  return (
    <NavComp
      to={!disabled && to}
      className={className}
      onChange={ev => onChange(ev)}
      onClick={onChange}
      disabled={disabled}
    >
      {children}
    </NavComp>
  );
}
NavLink.props = {
  to: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  component: PropTypes.object,
  onChange: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
    PropTypes.number,
    PropTypes.array]),
};
