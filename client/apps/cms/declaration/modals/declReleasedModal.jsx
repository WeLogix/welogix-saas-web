import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { Form, Modal, Input, DatePicker, message } from 'antd';
import { closeDeclReleasedModal, setDeclReleased, validateEntryId } from 'common/reducers/cmsCustomsDeclare';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;

@injectIntl
@connect(
  state => ({
    visible: state.cmsCustomsDeclare.visibleClearModal,
    entry: state.cmsCustomsDeclare.clearFillModal,
    loginName: state.account.username,
    inSetReleased: state.cmsCustomsDeclare.declSubmitting,
  }),
  { closeDeclReleasedModal, setDeclReleased, validateEntryId }
)
export default class DeclReleasedModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
    entry: PropTypes.shape({ preEntrySeqNo: PropTypes.string.isRequired }),
    reload: PropTypes.func.isRequired,
  }
  state = {
    entryNo: '',
    clearTime: null,
    ieTime: null,
    validateStatus: '',
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.entry !== this.props.entry) {
      this.setState({
        entryNo: nextProps.entry.entryNo,
        ieLabel: nextProps.entry.ietype === 0 ? '进口日期' : '出口日期',
      });
    }
  }
  msg = formatMsg(this.props.intl)
  handleEntryNoChange = (ev) => {
    if (ev.target.value) {
      const declno = ev.target.value.trim();
      if (declno.length === 18) {
        this.setState({
          entryNo: declno,
          validateStatus: 'validating',
        });
        this.props.validateEntryId(declno).then((result) => {
          if (!result.error) {
            this.setState({
              validateStatus: result.data.exist ? 'error' : 'success',
            });
          }
        });
      } else {
        this.setState({
          entryNo: declno,
          validateStatus: '',
        });
      }
    } else {
      this.setState({ entryNo: '', validateStatus: '' });
    }
  }
  handleClearDateChange = (clearDt) => {
    this.setState({ clearTime: clearDt.valueOf() });
  }
  handleIEDateChange = (ieDate) => {
    this.setState({ ieTime: ieDate.valueOf() });
  }
  handleCancel = () => {
    this.props.closeDeclReleasedModal();
  }
  handleOk = () => {
    if (this.state.validateStatus === 'error') {
      message.error('海关编号已存在');
      return;
    }
    if (!this.state.entryNo || this.state.entryNo.length !== 18) {
      message.error('报关单号长度应为18位数字', 10);
      return;
    }
    if (!this.state.clearTime) {
      message.error('放行时间未填写', 10);
      return;
    }
    const { entry, loginName } = this.props;
    this.props.setDeclReleased({
      delgNo: entry.delgNo,
      preEntrySeqNo: entry.preEntrySeqNo,
      entryNo: this.state.entryNo === entry.entryNo ? null : this.state.entryNo,
      clearTime: this.state.clearTime,
      ieTime: this.state.ieTime,
      loginName,
    }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        this.setState({ entryNo: '', clearTime: null });
        this.handleCancel();
        this.props.reload();
      }
    });
  }
  render() {
    const { visible, inSetReleased } = this.props;
    const {
      entryNo, validateStatus, ieLabel, ieTime, clearTime,
    } = this.state;
    let validate = null;
    if (entryNo && entryNo.length === 18) {
      validate = { validateStatus };
    }
    // const ieLabel = entry.ietype === 0 ? '进口日期' : '出口日期';
    return (
      <Modal
        maskClosable={false}
        title={this.msg('customsClearModalTitle')}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        okButtonProps={{ disabled: inSetReleased }}
        cancelButtonProps={{ disabled: inSetReleased }}
      >
        <Form>
          <FormItem label="海关编号" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} hasFeedback={!!(entryNo && entryNo.length === 18)} {...validate}>
            <Input onChange={this.handleEntryNoChange} value={entryNo} />
          </FormItem>
          <FormItem label={ieLabel} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            <DatePicker
              onChange={this.handleIEDateChange}
              value={ieTime && moment(ieTime)}
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
            />
          </FormItem>
          <FormItem label="放行时间" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            <DatePicker
              onChange={this.handleClearDateChange}
              value={clearTime && moment(clearTime)}
              style={{ width: '100%' }}
              format="YYYY-MM-DD HH:mm"
              showTime
            />
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
