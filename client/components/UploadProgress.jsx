import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Progress } from 'antd';

export default class UploadProgress extends React.Component {
  static propTypes = {
    onUploaded: PropTypes.func,
    onCancel: PropTypes.func,
    uploadInfo: PropTypes.shape({
      file: PropTypes.PropTypes.shape({ status: PropTypes.string.isRequired }),
    }),
  }
  constructor(...args) {
    super(...args);
    this.uploadChangeCount = 0;
    this.startTimestamp = Date.now();
    this.state = {
      uploading: false,
      uploadPercent: 10,
      uploadStatus: 'active',
      errorMsg: '',
    };
  }
  componentWillReceiveProps(nextProps) {
    if (!nextProps.chunked && nextProps.uploadInfo !== this.props.uploadInfo) {
      if (nextProps.uploadInfo === null) {
        this.handleClose();
        return;
      }
      this.handleUpload(nextProps.uploadInfo);
    }
  }
  handleUpload = (info) => {
    if (this.uploadChangeCount === 0) {
      this.startTimestamp = Date.now();
      this.uploadChangeCount += 1;
      this.setState({ uploading: true, uploadStatus: 'active', uploadPercent: 10 });
    } else if (info.event) {
      this.uploadChangeCount += 1;
      this.setState({ uploadPercent: Number((info.event.percent * 0.8).toFixed(1)) });
    } else if (info.file.status === 'done') {
      const { response } = info.file;
      this.uploadChangeCount = 0;
      if (response.status !== 200) {
        this.setState({ uploadStatus: 'exception', errorMsg: response.msg });
      } else {
        this.setState({ uploadPercent: 100, uploadStatus: 'success' });
        if (this.props.onUploaded) {
          this.props.onUploaded(response.data);
        }
        setTimeout(() => {
          this.setState({ uploading: false });
        }, 5000);
      }
    } else if (info.file.status === 'error') {
      let errorMsg = '文件处理超时,请考虑分批导入';
      if (Date.now() - this.startTimestamp < 60 * 60 * 1000) { // 1min以内提示网络问题
        errorMsg = '检查网络连接或者询问应用服务是否正常';
      }
      this.setState({ uploadStatus: 'exception', errorMsg });
      this.uploadChangeCount = 0;
    }
  }
  handleClose = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
    this.setState({ uploading: false, errorMsg: '' });
  }
  render() {
    const {
      uploading, uploadPercent, uploadStatus, errorMsg,
    } = this.state;
    if (!uploading) {
      return null;
    }
    return [
      <Progress
        type="line"
        key="progress"
        percent={uploadPercent}
        status={uploadStatus}
        style={{ visibility: uploading ? 'visible' : 'none' }}
      />,
      errorMsg && <Alert key="alert" message="上传失败" description={errorMsg} showIcon type="error" style={{ marginTop: 24 }} />,
    ];
  }
}

