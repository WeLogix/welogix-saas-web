import React from 'react';
import PropTypes from 'prop-types';
import { Row } from 'antd';

export default function Container(props) {
  return (
    <div className="welo-tile-container">
      <h3>{props.title}</h3>
      <Row type="flex">{props.children}</Row>
    </div>
  );
}
Container.props = {
  title: PropTypes.node,
  children: PropTypes.node,
};
