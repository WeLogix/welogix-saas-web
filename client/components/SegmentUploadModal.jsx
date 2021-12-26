import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Alert, Progress, Modal } from 'antd';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { loadUploadProgress, setUploadProgress } from '../../common/reducers/uploadRecords';
import { formatMsg } from './message.i18n';

const FormItem = Form.Item;

@injectIntl
@connect(
  state => ({
    uploadProgress: state.uploadRecords.uploadProgress,
  }),
  { loadUploadProgress, setUploadProgress }
)
export default class SegmentUploadMoadl extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    uploadInfo: PropTypes.shape({
      file: PropTypes.PropTypes.shape({ status: PropTypes.string.isRequired }),
    }),
  }
  constructor(...args) {
    super(...args);
    this.uploadChangeCount = 0;
    this.startTimestamp = Date.now();
    this.state = {
      uploadPercent: 0,
      inUpload: false,
      errorMsg: '',
      timer: null,
      importPercent: 0,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.uploadInfo !== this.props.uploadInfo
    && this.state.uploadPercent !== 100) {
      this.handleUpload(nextProps.uploadInfo, nextProps.formData);
    }
    if (nextProps.uploadProgress > 0) {
      this.setState({
        importPercent: nextProps.uploadProgress,
      });
    }
    if (nextProps.uploadProgress === 100) {
      clearInterval(this.state.timer);
      this.setState({
        importPercent: 0,
        timer: null,
        uploadPercent: 0,
        inUpload: false,
        errorMsg: '',
      });
      this.props.setUploadProgress(0);
      nextProps.onUploaded();
    }
  }

  msg = formatMsg(this.props.intl)
  handleUpload = (uploadinfo, formData) => {
    this.setState({ uploadPercent: uploadinfo.uploadPercent });
    if (uploadinfo.uploadPercent > 0) {
      this.setState({
        inUpload: true,
      });
    }
    if (uploadinfo.uploadPercent === 100) {
      this.props.importAfterSegement(
        formData,
        { tmpPath: uploadinfo.tmpPath, name: uploadinfo.info.file.name }
      ).then((result) => {
        const uploadNo = result.data;
        const timer = setInterval(() => {
          this.props.loadUploadProgress(uploadNo);
        }, 5000);
        this.setState({
          timer,
        });
      });
    }
  }
  handleCancel = () => {
    if (this.state.timer) {
      clearInterval(this.state.timer);
    }
    this.setState({
      importPercent: 0,
      timer: null,
      uploadPercent: 0,
      inUpload: false,
      errorMsg: '',
    });
    this.props.setUploadProgress(0);
  }
  render() {
    const {
      uploadPercent, errorMsg, inUpload, importPercent,
    } = this.state;
    if (!inUpload) {
      return null;
    }
    return (
      <Modal
        title={this.msg('segmentupload')}
        maskClosable={false}
        closable={importPercent >= 100}
        footer={<Button onClick={this.handleCancel}>{this.msg('close')}</Button>}
        visible={inUpload}
        onCancel={this.handleCancel}
      >
        <Form>
          <FormItem
            label={this.msg('uploadprogress')}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 8 }}
          >
            <Progress
              type="line"
              percent={uploadPercent}
              style={{ width: 330 }}
            />
          </FormItem>
          <FormItem
            label={this.msg('importprogress')}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 4 }}
          >
            <Progress
              type="line"
              percent={importPercent}
              style={{ width: 330 }}
            />
          </FormItem>
        </Form>
        {errorMsg && <Alert message={errorMsg} showIcon type="error" style={{ marginTop: 24 }} /> }
      </Modal>
    );
  }
}

