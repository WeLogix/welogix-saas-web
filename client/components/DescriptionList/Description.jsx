import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Col } from 'antd';
import EditableCell from 'client/components/EditableCell';
import responsive from './responsive';
import './style.less';

export default class Description extends PureComponent {
  static propTypes = {
    prefixCls: PropTypes.string,
    term: PropTypes.string,
    column: PropTypes.number,
    className: PropTypes.string,
    addonAfter: PropTypes.string,
    editable: PropTypes.bool,
    onSave: PropTypes.func,
  }
  static defaultProps = {
    prefixCls: 'welo-desc-list-item',
  };
  render() {
    const {
      prefixCls, className, term, children, column, addonAfter, editable, onSave,
    } = this.props;
    const clsString = classNames(prefixCls, className);
    return (
      <Col className={clsString} {...responsive[column]}>
        {term && <div className={`${prefixCls}-term`}>{term}</div>}
        <div className={`${prefixCls}-detail`}>
          {editable ? <EditableCell
            value={children}
            onSave={onSave}
          /> : (<span className={`${prefixCls}-detail-contennt`}>{children || '--'}</span>)}
          {addonAfter && <span className={`${prefixCls}-detail-addon-after`}>{addonAfter}</span>}
        </div>
      </Col>
    );
  }
}

