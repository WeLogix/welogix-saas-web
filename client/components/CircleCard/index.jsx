/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Card } from 'antd';
import './style.less';


export default class CircleCard extends React.Component {
  static propTypes = {
    size: PropTypes.string,
  }

  render() {
    const { children, size } = this.props;
    const classes = classNames('welo-circle-card', {
      'welo-circle-card-lg': size === 'large',
      'welo-circle-card-sm': size === 'small',
    });
    return (
      <div className={classes}>
        <Card {...this.props} >
          {children}
        </Card>
      </div>
    );
  }
}
