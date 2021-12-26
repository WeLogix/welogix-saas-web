/* eslint react/no-multi-comp: 0 */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { Button, DatePicker, InputNumber, Row, Steps } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { formatMsg } from '../../message.i18n';
import './style.less';

const { Step } = Steps;
const dateFormat = 'YYYY-MM-DD';

@injectIntl
@connect(
  state => ({
    asnDetails: state.cwmReceive.asnDetails,
    loginId: state.account.loginId,
  }),
  { }
)
export default class BillTermPane extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  state = {
    reconcileText: '下一个月5日',
    paymentText: '后下一个月15日',
  }
  msg = formatMsg(this.props.intl)
  render() {
    const { reconcileText, paymentText } = this.state;
    return (
      <div className="bill-term">
        <Steps status="wait" progressDot>
          <Step
            title={<span>账单开始日</span>}
            description={
              <span>
                <DatePicker defaultValue={moment('2019-01-01', dateFormat)} />
                <span className="bill-term-length">账期为 <InputNumber min={1} max={11} style={{ width: 60 }} /> 个月</span>
              </span>
            }
          />
          <Step
            title={<span>账单结束日</span>}
            description={
              <span>
                <DatePicker defaultValue={moment('2019-01-31', dateFormat)} disabled />
              </span>
            }
          />
          <Step
            title={<span>对账日</span>}
            description={
              <span>
                <DatePicker defaultValue={moment('2019-02-05', dateFormat)} />
                <span className="bill-term-desc-left">{reconcileText} 对账</span>
              </span>
            }
          />
          <Step
            title={<span>结款日</span>}
            description={
              <span>
                <DatePicker defaultValue={moment('2019-03-15', dateFormat)} />
                <span className="bill-term-desc-right">对账{paymentText} 结款</span>
              </span>
            }
          />
        </Steps>
        <Row style={{ marginTop: 24, textAlign: 'center' }}>
          <Button type="primary" icon="save">{this.msg('save')}</Button>
        </Row>
      </div>
    );
  }
}
