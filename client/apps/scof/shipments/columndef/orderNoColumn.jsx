import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon, Popover } from 'antd';
import { showDock } from 'common/reducers/sofOrders';
import { Ellipsis } from 'ant-design-pro';

@connect(
  () => ({}),
  { showDock }
)
export default class OrderNoColumn extends React.Component {
  static propTypes = {
    order: PropTypes.shape({
      shipmt_order_no: PropTypes.string,
    }).isRequired,
    showDock: PropTypes.func.isRequired,
  }

  render() {
    const { order } = this.props;
    if (order) {
      let content;
      if (order.cust_invoice_no) {
        const noArray = order.cust_invoice_no.split(',');
        content = (
          <div>
            {noArray.map(item => <p key={item}>{item}</p>)}
          </div>
        );
      }
      return (
        <div style={{ height: 68 }}>
          <a onClick={() => this.props.showDock(order.shipmt_order_no)}>
            {order.shipmt_order_no}
          </a>
          <div><Ellipsis length={14}>{order.customer_name}</Ellipsis></div>
          <div className="mdc-text-grey">{order.cust_order_no} {order.cust_invoice_no && <Popover placement="right" content={content}><Icon type="caret-right" /></Popover>}</div>
        </div>
      );
    }
    return <span />;
  }
}
