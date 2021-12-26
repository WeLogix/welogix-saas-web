import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Modal, Form, Select, Tooltip, message, Radio } from 'antd';
import { SASBL_DECTYPE, BAPPL_DECTYPE } from 'common/constants';
import { showSendSwJG2File, sendSwJG2File } from 'common/reducers/cwmSasblReg';
import { loadAllSingleWindowApps } from 'common/reducers/hubIntegration';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
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
    visible: state.cwmSasblReg.sendSwJG2FileModal.visible,
    copNo: state.cwmSasblReg.sendSwJG2FileModal.copNo,
    agentCode: state.cwmSasblReg.sendSwJG2FileModal.agentCode,
    swClientList: state.hubIntegration.swClientList,
    regType: state.cwmSasblReg.sendSwJG2FileModal.regType,
    sendFlag: state.cwmSasblReg.sendSwJG2FileModal.sendFlag,
    decType: state.cwmSasblReg.sendSwJG2FileModal.decType,
  }),
  {
    showSendSwJG2File, loadAllSingleWindowApps, sendSwJG2File,
  }
)
@Form.create()
export default class SendSwJG2FileModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
    showSendSwJG2File: PropTypes.func.isRequired,
    copNo: PropTypes.string,
    agentCode: PropTypes.string,
    reload: PropTypes.func.isRequired,
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && !this.props.visible && nextProps.visible) {
      this.props.loadAllSingleWindowApps(nextProps.agentCode);
    }
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.props.showSendSwJG2File({ visible: false });
  }
  handleOk = () => {
    const { copNo, regType, sendFlag } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.sendSwJG2File({
          copNo,
          swClientUid: values.singleWindow,
          delcFlag: values.sw_send_flag,
          regType, // 单证类型
          sendFlag, // 对应单一窗口模块类型
        }).then((result) => {
          if (result.error) {
            message.error(result.error.message, 10);
          } else {
            message.success('已发送');
            this.props.showSendSwJG2File({ visible: false });
            this.props.reload();
          }
        });
      }
    });
  }
  render() {
    const {
      visible,
      form: { getFieldDecorator },
      swClientList,
      regType,
      decType,
    } = this.props;
    const msgDecType = regType === 'bappl' ? BAPPL_DECTYPE : SASBL_DECTYPE;
    return (
      <Modal
        maskClosable={false}
        title={this.msg('sendMsg')}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form>
          <FormItem label={this.msg('decType')} {...formItemLayout}>
            {getFieldDecorator('decType', {
              initialValue: decType,
            })(<Select disabled>
              {msgDecType.map(item => (
                <Option key={item.value} value={item.value}>
                  {item.value} | {item.text}
                </Option>))}
            </Select>)}
          </FormItem>
          <FormItem label={this.msg('swClientList')} {...formItemLayout}>
            {getFieldDecorator('singleWindow', {
              rules: [{ required: true, message: '请选择单一窗口导入客户端' }],
            })(<Select
              allowClear
              showSearch
              optionFilterProp="children"
            >
              {swClientList.map(item => (
                <Option key={item.app_uuid} value={item.app_uuid}>
                  {item.name}
                </Option>))}
            </Select>)}
          </FormItem>
          <FormItem label={this.msg('swSendFlag')} {...formItemLayout} >
            {getFieldDecorator('sw_send_flag', {
              rules: [{ required: true, message: '请选择发送方式' }], // TODO: 业务申报表结案时，只能直接申报
            })(<RadioGroup buttonStyle="solid">
              <Tooltip title="单一窗口中点击申报后再发送至海关" mouseEnterDelay={0.8} placement="bottom"><RadioButton value={0} key={0} >暂存报文</RadioButton></Tooltip>
              <Tooltip title="无须再次点击申报直接发送至海关" mouseEnterDelay={0.8} placement="bottom"><RadioButton value={1} key={1} >直接申报</RadioButton></Tooltip>
            </RadioGroup>)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
