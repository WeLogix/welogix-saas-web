import React from 'react';
import PropTypes from 'prop-types';
import { Button, Drawer, Form, Icon, Radio, Select, Steps, Upload } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import superagent from 'superagent';
import UploadProgress from '../UploadProgress';
import SegmentProgress from '../SegmentProgress';
import { formatMsg } from './message.i18n';
import './style.less';

const { Option } = Select;
const { Dragger } = Upload;
const { Step } = Steps;

@injectIntl
export default class ImportDataPanel extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool,
    title: PropTypes.string,
    endpoint: PropTypes.string.isRequired,
    template: PropTypes.string,
    onGenTemplate: PropTypes.func,
    children: PropTypes.node,
    onUploaded: PropTypes.func,
    onClose: PropTypes.func,
    adaptors: PropTypes.arrayOf(PropTypes.shape({ code: PropTypes.string })),
    onAdaptorChange: PropTypes.func,
    customizeOverwrite: PropTypes.bool,
  }
  state = {
    uploading: false,
    importInfo: null,
    segmentInfo: {},
    adaptor: '',
    skipMode: 2,
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.adaptors !== this.props.adaptors) {
      this.setState({
        // adaptor: '',
      });
    }
  }
  handleSkipModeChange= (e) => {
    this.setState({
      skipMode: e.target.value,
    });
  }
  msg = formatMsg(this.props.intl)
  handleUploadFile = (info) => {
    this.setState({ importInfo: info, uploading: true });
    if (this.props.chunked) {
      const chunkSize = 1024 * 1024 * 5;
      const chunks = Math.ceil(info.file.size / chunkSize);
      let prom = Promise.resolve();
      for (let i = 0; i < chunks; i++) {
        const start = i * chunkSize;
        const end = (i + 1) * chunkSize;
        const metaData = JSON.stringify({
          uid: info.file.uid,
          name: info.file.name,
          chunk: i,
        });
        prom = prom.then(() => new Promise((resolve, reject) => {
          superagent
            .post(`${API_ROOTS.default}v1/upload/multipart`)
            .withCredentials()
            .field('filedata', metaData)
            .attach('subfile', info.file.slice(start, end))
            .end((err, res) => {
              if (!err) {
                this.setState({
                  segmentInfo: {
                    tmpPath: res.body.data,
                    info,
                    uploadPercent: Number((((i + 1) / chunks) * 100).toFixed(0)),
                  },
                }, resolve);
              } else {
                reject(err);
              }
            });
        }));
      }
    }
  }
  handleUploaded = (resp) => {
    this.setState({ uploading: false });
    if (this.props.onUploaded) {
      this.props.onUploaded(resp);
    }
  }
  handleCancel = () => {
    this.setState({ uploading: false });
  }
  handleDownloadTemplate = () => {
    const { onGenTemplate, template } = this.props;
    if (onGenTemplate) {
      onGenTemplate();
      return;
    }
    window.open(template);
  }
  handleAdaptorChange = (value) => {
    this.setState({ adaptor: value });
    if (this.props.onAdaptorChange) {
      this.props.onAdaptorChange(value);
    }
  }
  handleBeforeUpload = () => {
    if (!this.props.chunked) {
      if (this.props.onBeforeUpload) {
        const upload = this.props.onBeforeUpload(true);
        return upload;
      }
      return true;
    }
    return false;
  }
  handleClose = () => {
    this.setState({
      adaptor: '',
      importInfo: null,
    });
    if (this.props.onClose) {
      this.props.onClose();
    }
  }
  renderOptions() {
    const {
      children, adaptors, customizeOverwrite,
    } = this.props;
    const { adaptor, skipMode } = this.state;
    return (<Form layout="vertical">
      {children}
      {adaptors &&
        <Form.Item label="数据适配器">
          <Select
            allowClear
            showSearch
            placeholder="选择数据适配器"
            onChange={this.handleAdaptorChange}
            value={adaptor}
            notFoundContent={this.msg('adaptorNotFound')}
          >
            {adaptors.map(opt => <Option value={opt.code} key={opt.code}>{opt.name}</Option>)}
          </Select>
        </Form.Item>
        }
      {!customizeOverwrite &&
        <Form.Item label={this.msg('handlingDuplicated')}>
          <Radio.Group onChange={this.handleSkipModeChange} value={skipMode}>
            <Radio value={1}>{this.msg('overwrite')}</Radio>
            <Radio value={2}>{this.msg('ignore')}</Radio>
          </Radio.Group>
        </Form.Item>}
    </Form>);
  }
  renderUpload() {
    const {
      endpoint,
      formData = {},
    } = this.props;
    return (<div style={{ height: 200, marginBottom: 16 }}>
      <Dragger
        accept=".xls,.xlsx,.csv,.txt"
        action={endpoint}
        showUploadList={false}
        data={{ data: JSON.stringify(formData) }}
        onChange={this.handleUploadFile}
        withCredentials
        beforeUpload={this.handleBeforeUpload}
        disabled={this.state.uploading}
      >
        <p className="ant-upload-drag-icon">
          <Icon type="inbox" />
        </p>
        <p className="ant-upload-text">点击或拖拽文件至此区域上传</p>
      </Dragger>
    </div>);
  }
  render() {
    const {
      formData = {}, visible, title, importAfterSegement,
      template, onGenTemplate, chunked,
    } = this.props;
    const {
      adaptor, skipMode, segmentInfo, importInfo,
    } = this.state;
    if (adaptor) {
      formData.adaptor = adaptor;
    }
    formData.skipMode = skipMode;
    let panelClosable = true;
    if (this.props.chunked && this.state.uploading && this.state.segmentInfo.uploadPercent < 100) {
      panelClosable = false;// 分段上传保证adaptor数据在实际导入时可用
    }
    return (
      <Drawer
        title={title || '导入'}
        width={460}
        visible={visible}
        onClose={this.handleClose}
        maskClosable={false}
        closable={panelClosable}
        className="welo-import-data-panel"
      >
        <Steps direction="vertical" size="small">
          <Step title="设置选项" status="wait" description={this.renderOptions()} />
          {(adaptor === undefined || adaptor === '') && (template || onGenTemplate) &&
          <Step
            title="下载模板"
            status="wait"
            description={(template || onGenTemplate) &&
              <Button
                block
                icon="download"
                style={{ marginBottom: 16 }}
                onClick={this.handleDownloadTemplate}
              >
                标准导入模板
              </Button>}
          />}
          <Step title="上传文件" status="wait" description={this.renderUpload()} />
        </Steps>
        <div style={{ marginLeft: 40 }}>
          <UploadProgress
            uploadInfo={importInfo}
            onUploaded={this.handleUploaded}
            onCancel={this.handleCancel}
            chunked={chunked}
          />
          <SegmentProgress
            uploadInfo={segmentInfo}
            onUploaded={this.handleUploaded}
            onCancel={this.handleCancel}
            importAfterSegement={importAfterSegement}
            formData={formData}
          />
        </div>
      </Drawer>
    );
  }
}
