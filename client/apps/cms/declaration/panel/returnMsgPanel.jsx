import React from 'react';
import moment from 'moment';
import { Drawer, Button, Spin, Timeline } from 'antd';
import { injectIntl, intlShape } from 'react-intl';
import superagent from 'superagent';
import FileSaver from 'file-saver';
import { connect } from 'react-redux';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { toggleReturnMsgPanel, loadClearanceResults } from 'common/reducers/cmsCustomsDeclare';
import { formatMsg } from '../message.i18n';

const TimelineItem = Timeline.Item;

@injectIntl
@connect(
  state => ({
    visible: state.cmsCustomsDeclare.returnMsgPanel.visible,
    returnFile: state.cmsCustomsDeclare.returnMsgPanel.returnFile,
    activeEntryId: state.cmsCustomsDeclare.returnMsgPanel.entryId,
    customsResults: state.cmsCustomsDeclare.customsResults,
    crLoading: state.cmsCustomsDeclare.customsResultsLoading,
  }),
  { toggleReturnMsgPanel, loadClearanceResults }
)
export default class ReturnMsgPanel extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  state = {
    childrenVisible: false,
    currentFile: '',
    returnText: '',
    contentType: '',
  }
  componentWillReceiveProps(nextProps) {
    const { visible, activeEntryId, currentEntryId } = nextProps;
    if (visible && visible !== this.props.visible &&
      activeEntryId && activeEntryId === currentEntryId) {
      this.props.loadClearanceResults(activeEntryId);
    }
  }
  msg = formatMsg(this.props.intl)
  handleClose = () => {
    this.props.toggleReturnMsgPanel(false);
  }
  handleShowChildDrawer = (ev, filename) => {
    ev.preventDefault();
    if (filename) {
      this.setState({
        childrenVisible: true,
        currentFile: filename,
      });
      this.handleFetch(filename);
    }
  }
  handleCloseChildDrawer = () => {
    this.setState({ childrenVisible: false });
  }
  handleFetch = (filename) => {
    const self = this;
    superagent
      .get(`${API_ROOTS.default}v1/cms/customs/eprecv/xml?filename=${filename}`)
      .withCredentials()
      .type('text/xml')
      .end((err, res) => {
        if (!err) {
          self.setState({
            returnText: res.text,
            contentType: res.headers['content-type'],
          });
        } else {
          self.setState({
            returnText: `${filename} ${self.msg('fileNotFound')}`,
          });
        }
      });
  }
  handleDownload = () => {
    const { currentFile, returnText, contentType } = this.state;
    FileSaver.saveAs(new window.Blob([returnText], { type: contentType }), currentFile);
  }
  render() {
    const {
      visible, returnFile, activeEntryId, customsResults, crLoading, currentEntryId,
    } = this.props;
    if (!(visible && activeEntryId === currentEntryId)) return null;
    const dataSource = returnFile ? returnFile.split(';') : [];
    dataSource.sort().reverse();
    return (
      <Drawer
        title={<span>通关状态 {activeEntryId}</span>}
        width={520}
        closable
        onClose={this.handleClose}
        visible={visible}
      >
        <Spin spinning={crLoading}>
          <Timeline>
            {customsResults.map((res, index) => {
              let channelText;
              let dateFormat;
              let filename = res.return_file;
              if (res.channel === 'hg') {
                channelText = '海关信息网';
                dateFormat = 'YYYY-MM-DD';
              } else if (res.channel === 'manual') {
                channelText = '手动确认';
                dateFormat = 'YYYY-MM-DD HH:mm';
              } else {
                channelText = '查看回执';
                dateFormat = 'YYYY-MM-DD HH:mm';
                if (!filename) { // 老数据无return_file字段,只能从declhead上取
                  if (dataSource.length === 1) {
                    filename = returnFile;
                  } else if (dataSource.length > 1) {
                    filename = dataSource[index];
                  }
                }
              }
              return (
                <TimelineItem key={res.id} color={res.channel_status === 1 ? 'green' : 'blue'}>
                  <h4>{res.process_note}</h4>
                  <p>
                    {`${moment(res.process_date).format(dateFormat)}`}
                    <a className="pull-right mdc-text-grey" disabled={!filename} onClick={ev => this.handleShowChildDrawer(ev, filename)}>{channelText}</a>
                  </p>
                </TimelineItem>
              );
            })}
          </Timeline>
        </Spin>
        {returnFile &&
        <div>
          <Drawer
            title="回执报文"
            width={520}
            closable
            onClose={this.handleCloseChildDrawer}
            visible={this.state.childrenVisible}
          >
            <CodeMirror
              autoScroll
              value={this.state.returnText}
              options={{
                mode: 'application/xml',
                lineWrapping: true,
            }}
              onChange={() => {}}
              className="code-viewer"
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                borderTop: '1px solid #e8e8e8',
                padding: '10px 16px',
                textAlign: 'right',
                left: 0,
                background: '#fff',
                borderRadius: '0 0 4px 4px',
              }}
            >
              <Button
                style={{ marginRight: 8 }}
                onClick={this.handleCloseChildDrawer}
              >
                取消
              </Button>
              <Button onClick={this.handleDownload} type="primary">下载</Button>
            </div>
          </Drawer>
        </div>}
      </Drawer>
    );
  }
}
