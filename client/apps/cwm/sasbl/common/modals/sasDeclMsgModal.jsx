import React, { Component } from 'react';
import { connect } from 'react-redux';
import superagent from 'superagent';
import FileSaver from 'file-saver';
import { Modal } from 'antd';
import { toggleSasDeclMsgModal } from 'common/reducers/cwmSasblReg';
import { UnControlled as CodeMirror } from 'react-codemirror2';

require('codemirror/lib/codemirror.css');
require('codemirror/mode/xml/xml');

@connect(
  state => ({
    visible: state.cwmSasblReg.msgModal.visible,
    sasDecl: state.cwmSasblReg.msgModal.sasDecl,
  }),
  { toggleSasDeclMsgModal }
)
export default class SasDeclMsgModal extends Component {
  state = {
    text: '',
    contentType: '',
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible !== this.props.visible && nextProps.visible) {
      const me = this;
      superagent
        .get(`${API_ROOTS.default}v1/paas/swjg2/recvsend/xmlcontent?copNo=${nextProps.sasDecl.copNo}&sasRegType=${nextProps.sasDecl.sasRegType}`)
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
    this.props.toggleSasDeclMsgModal(false, this.props.sasDecl);
  }
  handleDownload = () => {
    const { text, contentType } = this.state;
    FileSaver.saveAs(new window.Blob([text], { type: contentType }), this.props.fileName);
  }
  render() {
    const { visible, sasDecl } = this.props;
    return (
      <Modal
        width={960}
        style={{ top: 24 }}
        title={sasDecl.sasRegType === 'sent' ? '申报报文' : '回执报文'}
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
