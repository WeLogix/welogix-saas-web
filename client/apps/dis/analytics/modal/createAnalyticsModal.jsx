import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Form, Modal, Input, Select } from 'antd';
import { toggleCreateAnalyticsModal, createAnalytics, renameAnalytics } from 'common/reducers/disAnalytics';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;

@injectIntl
@connect(
  state => ({
    visible: state.disAnalytics.createAnalyticsModal.visible,
    chartInfo: state.disAnalytics.createAnalyticsModal.chartInfo,
  }),
  { toggleCreateAnalyticsModal, createAnalytics, renameAnalytics }
)

@Form.create()
export default class CreateAnalyticsModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
  }
  handleCancel = () => {
    this.props.form.resetFields();
    this.props.toggleCreateAnalyticsModal(false);
  }
  handleOk = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        let prom;
        const chartName = values.dana_chart_name;
        if (this.props.chartInfo) {
          const chartUid = this.props.chartInfo.chart_uid;
          const opContent = `图表名称${this.props.chartInfo.chart_name}改为${chartName}`;
          prom = this.props.renameAnalytics(chartName, chartUid, opContent);
        } else {
          prom = this.props.createAnalytics(chartName, values.dana_chart_subject);
        }
        prom.then((result) => {
          if (!result.error) this.handleCancel();
        });
      }
    });
  }
  msg = formatMsg(this.props.intl)
  render() {
    const {
      visible, chartInfo, form: { getFieldDecorator },
    } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Modal
        maskClosable={false}
        title={chartInfo ? '图表重命名' : '新建图表'}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form>
          <FormItem label="图表名称" {...formItemLayout}>
            {getFieldDecorator('dana_chart_name', {
              rules: [{ required: true }],
              initialValue: chartInfo && chartInfo.chart_name,
            })(<Input />)}
          </FormItem>
          { !chartInfo &&
          <FormItem label="选择数据主题" {...formItemLayout}>
            {getFieldDecorator('dana_chart_subject', {
              rules: [{ required: true }],
            })(<Select showSearch optionFilterProp="children">
              <Option key="DWD_GLOBAL" value="DWD_GLOBAL">进出口料号级明细</Option>
              <Option key="DWD_CDS" value="DWD_CDS">报关单项号级明细</Option>
            </Select>)}
          </FormItem>}
        </Form>
      </Modal>
    );
  }
}
