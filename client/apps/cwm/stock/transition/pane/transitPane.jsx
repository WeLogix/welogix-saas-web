import React from 'react';
import { connect } from 'react-redux';
// import { intlShape, injectIntl } from 'react-intl';
import { Button, message } from 'antd';
import { splitTransit, moveTransit } from 'common/reducers/cwmTransition';
import TransitForm from './transitAttribForm';

// @injectIntl
@connect(
  state => ({
    loginName: state.account.username,
    detail: state.cwmTransition.transitionModal.detail,
    submitting: state.cwmTransition.submitting,
  }),
  { splitTransit, moveTransit }
)
export default class TransitPane extends React.Component {
  static propTypes = {
    // intl: intlShape.isRequired,
  }
  formValue = {
    target_location: null,
    movement_no: null,
  }
  handleValueChange = (keyValue) => {
    this.formValue[keyValue.key] = keyValue.value;
  }
  handleTransit = () => {
    const transitValues = this.props.form.getFieldsValue();
    const transit = {};
    let valueChanged = false;
    Object.keys(transitValues).forEach((transitKey) => {
      if (transitValues[transitKey] !== this.props.detail[transitKey]) {
        valueChanged = true;
        transit[transitKey] = transitValues[transitKey] || null;
      }
    });
    const { loginName } = this.props;
    let transitOp;
    if (this.formValue.target_location) {
      if ((transitValues.virtual_whse !== this.props.detail.virtual_whse) &&
      !(!transitValues.virtual_whse && !this.props.detail.virtual_whse)) {
        message.error('库别修改后不能移动库存');
      } else if (this.formValue.movement_no) {
        transitOp = this.props.moveTransit(
          [this.props.detail.trace_id], transit, this.formValue.target_location,
          this.formValue.movement_no, loginName
        );
      } else {
        message.error('库存移动单未选');
      }
    } else if (valueChanged) {
      transitOp = this.props.splitTransit([this.props.detail.trace_id], transit, loginName);
    }
    if (transitOp) {
      transitOp.then((result) => {
        if (!result.error) {
          const virtualWhseArr = result.data;
          if (virtualWhseArr && virtualWhseArr.length > 0) {
            const virtualWhseStr = `${virtualWhseArr.slice(0, 3).join(',')}${virtualWhseArr.length >= 3 ? '...' : ''}`;
            message.error(`库别${virtualWhseStr}的未预配数量不足, 需要先取消预分配`);
          }
          this.formValue = {
            target_location: null,
            movement_no: null,
          };
        } else if (result.error.message === 'invalid-movement') {
          message.error('移库单已删除或已完成');
        } else {
          message.error(result.error.message);
        }
      });
    }
  }
  render() {
    const { detail, form, submitting } = this.props;
    return (
      <div>
        <TransitForm
          batched={false}
          detail={detail}
          form={form}
          onChange={this.handleValueChange}
        />
        <Button loading={submitting} type="primary" onClick={this.handleTransit}>执行转移</Button>
      </div>
    );
  }
}
