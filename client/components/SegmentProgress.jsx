import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Progress } from 'antd';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { loadUploadProgress, setUploadProgress } from '../../common/reducers/uploadRecords';
import { formatMsg } from './message.i18n';


@injectIntl
@connect(
  state => ({
    uploadProgress: state.uploadRecords.uploadProgress,
  }),
  { loadUploadProgress, setUploadProgress }
)
export default class SegmentUploadProgress extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    uploadInfo: PropTypes.shape({
      file: PropTypes.PropTypes.shape({ status: PropTypes.string.isRequired }),
    }),
    onCancel: PropTypes.func,
  }
  constructor(...args) {
    super(...args);
    this.uploadChangeCount = 0;
    this.startTimestamp = Date.now();
    this.state = {
      uploadPercent: 0,
      uploading: false,
      errorMsg: '',
      timer: null,
      importPercent: 0,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.uploadInfo === null) {
      this.handleClose();
      return;
    }
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
        timer: null,
      });
      this.props.setUploadProgress(0);
      nextProps.onUploaded();
      setTimeout(() => {
        this.setState({
          uploading: false,
          uploadPercent: 0,
          importPercent: 0,
          errorMsg: '',
        });
      }, 5000);
    }
  }

  msg = formatMsg(this.props.intl)
  handleUpload = (uploadinfo, formData) => {
    this.setState({ uploadPercent: uploadinfo.uploadPercent });
    if (uploadinfo.uploadPercent > 0) {
      this.setState({
        uploading: true,
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
  handleClose = () => {
    if (this.state.timer) {
      clearInterval(this.state.timer);
    }
    this.setState({
      importPercent: 0,
      timer: null,
      uploadPercent: 0,
      uploading: false,
      errorMsg: '',
    });
    this.props.setUploadProgress(0);
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }
  render() {
    const {
      uploadPercent, errorMsg, uploading, importPercent,
    } = this.state;
    if (!uploading) {
      return null;
    }
    return [
      <Progress
        key="progress"
        type="line"
        percent={uploadPercent}
        successPercent={importPercent}
        style={{ visibility: uploading ? 'visible' : 'none' }}
      />,
      errorMsg && <Alert key="alert" message="上传失败" description={errorMsg} showIcon type="error" style={{ marginTop: 24 }} />,
    ];
  }
}

