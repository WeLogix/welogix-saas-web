import React from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Layout } from 'antd';
import './style.less';

const { Content } = Layout;

export default function ExceptionState(props) {
  const {
    exceptionCode = '403', description, actionText, onClick,
    imageUrl = 'https://gw.alipayobjects.com/zos/rmsportal/wZcnGqRDyhPOEYFcZDnb.svg',
  } = props;
  const bgImage = `url(${imageUrl})`;
  return (
    <Content className="exception-state" key="main">
      <Col lg={12} sm={24}>
        <div className="exception-state-img" style={{ backgroundImage: bgImage }} />
      </Col>
      <Col lg={{ span: 10, offset: 2 }} sm={24} className="exception-state-content">
        <h1>{exceptionCode}</h1>
        <div className="exception-state-content-desc">{description}</div>
        <div className="exception-state-content-action">{onClick && <Button type="primary" block onClick={onClick}>{actionText}</Button>}</div>
      </Col>
    </Content>
  );
}

ExceptionState.props = {
  exceptionCode: PropTypes.string.isRequired,
  description: PropTypes.string,
  actionText: PropTypes.string,
  onClick: PropTypes.func,
  imageUrl: PropTypes.string,
};
