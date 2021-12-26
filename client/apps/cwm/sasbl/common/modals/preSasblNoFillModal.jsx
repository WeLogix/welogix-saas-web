import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { Modal, Form, Row, Col, Input, message } from 'antd';
import { toggleFillPreSasblNoModal, manualFillPreSasblNo } from 'common/reducers/cwmSasblReg';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

@injectIntl
@connect(
  state => ({
    visible: state.cwmSasblReg.preSasblNoModal.visible,
    sasblreg: state.cwmSasblReg.preSasblNoModal.sasblreg,
  }),
  {
    toggleFillPreSasblNoModal, manualFillPreSasblNo,
  }
)
@Form.create()
export default class PreSasblNoFillModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
  }
  msg = formatMsg(this.props.intl);
  handleCancel = () => {
    this.props.form.resetFields();
    this.props.toggleFillPreSasblNoModal(false, this.props.sasblreg);
  }
  handleSaveGoods = () => {
    this.props.form.validateFields((errors) => {
      if (errors) {
        message.error('表单信息错误');
      } else {
        const { sasblreg } = this.props;
        const editForm = this.props.form.getFieldsValue();
        const data = {
          preSasblSeqNo: editForm.pre_sasbl_seqno,
          businessNo: editForm.business_no,
          copNo: sasblreg.copNo,
          sasRegType: sasblreg.sasRegType,
        };
        this.props.manualFillPreSasblNo(data).then((result) => {
          if (result.error) {
            message.error(result.error.message, 10);
          } else {
            message.success('修改成功');
            this.handleCancel();
            this.props.reload();
          }
        });
      }
    });
  }
  render() {
    const {
      visible, form: { getFieldDecorator }, preSasblSeqno, sasblreg,
    } = this.props;
    return (
      <Modal
        width={580}
        title={this.msg('回填编号')}
        visible={visible}
        maskClosable={false}
        onCancel={this.handleCancel}
        okText={this.msg('confirm')}
        onOk={this.handleSaveGoods}
      >
        <Form hideRequiredMark>
          <Row>
            <Col span={24}>
              <FormItem label={this.msg('preSasblSeqno')} hasFeedback {...formItemLayout}>
                {getFieldDecorator('pre_sasbl_seqno', {
                    rules: [{ len: 18 }],
                    initialValue: preSasblSeqno,
                })(<Input disabled={!!preSasblSeqno} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem label={`${this.msg(sasblreg.sasRegType)}号`} hasFeedback {...formItemLayout}>
                {getFieldDecorator('business_no', {
                    rules: [{ len: 18 }],
                    initialValue: '',
                  })(<Input />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
