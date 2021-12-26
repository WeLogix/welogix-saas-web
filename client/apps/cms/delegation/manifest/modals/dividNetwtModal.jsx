import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Alert, Form, Modal, InputNumber, notification } from 'antd';
import { showNetwtDividModal, dividTotalNetwt } from 'common/reducers/cmsManifest';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;

@injectIntl
@connect(
  state => ({
    visNetwtDivModal: state.cmsManifest.visNetwtDivModal,
  }),
  {
    showNetwtDividModal, dividTotalNetwt,
  }
)
@Form.create()
export default class AmountModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visNetwtDivModal: PropTypes.bool.isRequired,
    delgNo: PropTypes.string,
    billGrossWt: PropTypes.number,
  }
  state = {
    totalNetwt: null,
  }
  handleNetwtChange = (value) => {
    this.setState({ totalNetwt: value });
  }
  handleCancel = () => {
    this.props.showNetwtDividModal(false);
  }
  handleOk = () => {
    const { totalNetwt } = this.state;
    if (totalNetwt === 0) {
      return;
    }
    if (totalNetwt >= this.props.billGrossWt) {
      notification.error({
        message: '错误',
        description: `分摊总净重不能大于清单总毛重${this.props.billGrossWt}千克`,
      });
      return;
    }
    this.props.dividTotalNetwt(this.props.delgNo, totalNetwt).then((result) => {
      if (result.error) {
        notification.error({
          message: '报错',
          description: result.error.message,
        });
      } else {
        notification.success({
          message: '操作成功',
          description: `总净重${totalNetwt}千克已平摊`,
        });
      }
      this.handleCancel();
    });
  }
  msg = formatMsg(this.props.intl)
  render() {
    const { visNetwtDivModal, billGrossWt } = this.props;
    return (
      <Modal
        maskClosable={false}
        title="金额平摊"
        visible={visNetwtDivModal}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Alert message="将按每项净重的占比重新分摊输入的总净重" type="info" showIcon />
        <FormItem label="待分摊总净重" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
          <InputNumber min={0} max={billGrossWt} onChange={this.handleNetwtChange} value={this.state.totalNetwt} style={{ width: '80%' }} />
        </FormItem>
      </Modal>
    );
  }
}
