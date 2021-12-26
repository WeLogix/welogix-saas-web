import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Card, Col, Row, Switch, Form, Input } from 'antd';
import { toggleQuarantineModal, updateQuarantineInspect } from 'common/reducers/cmsDelegation';
import { updateEventFeeClear } from 'common/reducers/cmsExpense';
import FullscreenModal from 'client/components/FullscreenModal';
import { CMS_EVENTS } from 'common/constants';
import RecvablePayableExpenses from '../../billing/recvablePayableExpenses';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;

@injectIntl
@connect(
  state => ({
    visible: state.cmsDelegation.quarantineModal.visible,
    exchangeInfo: state.cmsDelegation.quarantineModal.exchangeInfo,
  }),
  { toggleQuarantineModal, updateQuarantineInspect, updateEventFeeClear }
)
@Form.create()
export default class QuarantineModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
    reload: PropTypes.func.isRequired,
  }
  static childContextTypes = {
    feePaneCond: PropTypes.shape({
      queryEvents: PropTypes.arrayOf(PropTypes.string).isRequired,
      enabledFeeEvents: PropTypes.arrayOf(PropTypes.string).isRequired,
      disallowSrvEdit: PropTypes.bool.isRequired,
      subscribe: PropTypes.func.isRequired,
    }),
  }
  state = {
    quarantineInspect: false,
  }
  getChildContext() {
    this.feePaneCond.enabledFeeEvents = [];
    const { quarantineInspect } = this.state;
    if (quarantineInspect) {
      this.feePaneCond.enabledFeeEvents.push(CMS_EVENTS[1].key);
    }
    return {
      feePaneCond: this.feePaneCond,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && nextProps.visible !== this.props.visible) {
      this.setState({
        quarantineInspect: nextProps.exchangeInfo.quarantineInspect,
      });
    }
  }
  subscription = null
  feePaneCond= {
    queryEvents: [CMS_EVENTS[1].key],
    disallowSrvEdit: true,
    enabledFeeEvents: [],
    subscribe: (f) => { this.subscription = f; },
  }
  handleCancel = () => {
    this.props.toggleQuarantineModal(false, {});
    this.setState({
      quarantineInspect: false,
    });
    this.props.updateEventFeeClear(false, []);
  }
  handleOk = () => {
    const { quarantineInspect } = this.state;
    this.props.updateQuarantineInspect(
      quarantineInspect,
      this.props.exchangeInfo.delg_no,
    ).then((result) => {
      if (!result.error) {
        this.handleCancel();
        this.props.reload();
      }
    });
  }
  msg = formatMsg(this.props.intl)
  handleQuaranInspect = (checked) => {
    this.setState({
      quarantineInspect: checked,
    });
    if (!checked) {
      this.props.updateEventFeeClear(!checked, [CMS_EVENTS[1].key]);
    }
    if (this.subscription) {
      this.subscription();
    }
  }
  render() {
    const {
      visible, exchangeInfo, form: { getFieldDecorator },
    } = this.props;
    const { quarantineInspect } = this.state;
    return (
      <FullscreenModal
        title={this.msg('检疫查验')}
        onCancel={this.handleCancel}
        onSave={this.handleOk}
        visible={visible}
      >
        <Form>
          <Row>
            <Col span={6}>
              <FormItem label="提运单号" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('bl_wb_no', {
                initialValue: exchangeInfo.bl_wb_no,
            })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="检疫查验" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                <Switch checkedChildren="是" unCheckedChildren="否" checked={quarantineInspect} onChange={this.handleQuaranInspect} />
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Card bodyStyle={{ padding: 0 }}>
          <RecvablePayableExpenses delgNo={exchangeInfo.delg_no} />
        </Card>
      </FullscreenModal>
    );
  }
}
