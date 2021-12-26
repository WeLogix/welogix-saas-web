import React, { Component } from 'react';
import { connect } from 'react-redux';
import superagent from 'superagent';
import FileSaver from 'file-saver';
import { Modal } from 'antd';
import { toggleDeclMsgModal } from 'common/reducers/cmsCustomsDeclare';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import './style.less';

require('codemirror/lib/codemirror.css');
require('codemirror/mode/xml/xml');

@connect(
  state => ({
    visible: state.cmsCustomsDeclare.declMsgModal.visible,
    fileName: state.cmsCustomsDeclare.declMsgModal.fileName,
    fileType: state.cmsCustomsDeclare.declMsgModal.fileType,
  }),
  { toggleDeclMsgModal }
)
export default class DeclMsgModal extends Component {
  state = {
    text: '',
    contentType: '',
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible !== this.props.visible && nextProps.visible) {
      let url = '';
      const me = this;
      if (nextProps.fileType === 'sent') {
        url = `${API_ROOTS.default}v1/cms/customs/epsend/xml?filename=${nextProps.fileName}`;
      } else {
        url = `${API_ROOTS.default}v1/cms/customs/eprecv/xml?filename=${nextProps.fileName}`;
      }
      superagent
        .get(url)
        .withCredentials()
        .type('text/xml')
        .end((err, res) => {
          if (!err) {
            me.setState({
              text: res.text,
              contentType: res.headers['content-type'],
            });
          } else {
            me.setState({
              text: `${nextProps.fileName} 报文未找到`,
            });
          }
        });
    }
  }
  handleCancel = () => {
    this.props.toggleDeclMsgModal(false);
  }
  handleDownload = () => {
    const { text, contentType } = this.state;
    FileSaver.saveAs(new window.Blob([text], { type: contentType }), this.props.fileName);
  }
  render() {
    const { visible, fileType } = this.props;
    return (
      <Modal
        width={960}
        style={{ top: 24 }}
        title={fileType === 'sent' ? '申报报文' : '回执报文'}
        visible={visible}
        okText="下载"
        onOk={this.handleDownload}
        onCancel={this.handleCancel}
      >
        <CodeMirror
          autoScroll
          value={this.state.text}
          options={{
            mode: 'application/xml',
            lineWrapping: true,
        }}
          onChange={() => {}}
          className="code-viewer"
        />
      </Modal>
    );
  }
}
