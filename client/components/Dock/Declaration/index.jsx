import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Col, Row, Tabs } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { loadEntry } from 'common/reducers/cmsManifest';
import { showPreviewer } from 'common/reducers/cmsDelegationDock';
import InfoItem from 'client/components/InfoItem';
import DockPanel from 'client/components/DockPanel';
import DeclStatusPopover from 'client/apps/cms/common/popover/declStatusPopover';
import DutyTaxPane from 'client/apps/cms/declaration/tabpane/dutyTaxPane';
import { SCOF_BIZ_OBJECT_KEY } from 'common/constants';
import MasterPane from './tabpanes/masterPane';
import DeclTrackPane from './tabpanes/declTrack';
import CustomsDeclPane from '../Delegation/tabpanes/customsDeclPane';
import DeclContainer from './tabpanes/declContainer';
import DeclCertDocs from './tabpanes/declCertDocs';
import AttachmentPane from '../common/attachmentPane';
import LogsPane from '../common/logsPane';
import { formatMsg } from './message.i18n';

const { TabPane } = Tabs;

@injectIntl
@connect(
  state => ({
    visible: state.saasDockPool.cmsDeclaration.visible,
    preEntrySeqNo: state.saasDockPool.cmsDeclaration.preEntrySeqNo,
    customsDeclLoading: state.cmsManifest.customsDeclLoading,
    head: state.cmsManifest.entryHead,
    bodies: state.cmsManifest.entryBodies,
  }),
  {
    showPreviewer,
    loadEntry,
  }
)
export default class DeclarationDock extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.preEntrySeqNo && nextProps.preEntrySeqNo !== this.props.preEntrySeqNo) {
      this.props.loadEntry(nextProps.preEntrySeqNo);
    }
  }
  componentWillUnmount() {
    this.props.onDockClose();
  }
  msg = formatMsg(this.props.intl)
  handlePreview = (delgNo) => {
    this.props.onDockClose();
    this.props.showPreviewer(delgNo, 'shipment');
  }
  renderExtra() {
    const { head } = this.props;
    return (
      <Row>
        <Col span={8}>
          <InfoItem
            label={this.msg('delgNo')}
            field={
              <a className="ant-dropdown-link" onClick={() => this.handlePreview(head.delg_no)}>
                {head.delg_no}
              </a>
            }
          />
        </Col>
        <Col span={8}>
          <InfoItem label={this.msg('formEntryId')} field={head.entry_id} />
        </Col>
        <Col span={8}>
          <InfoItem
            label={this.msg('declStatus')}
            field={
              <DeclStatusPopover
                entryId={head.entry_id}
                declStatus={head.status}
                declSent={{
                  sent_status: head.sent_status,
                  sent_fail_msg: head.sent_fail_msg,
                  // send_date: head.epsend_date,
                }}
                returnFile={head.return_file}
              />
            }
          />
        </Col>
      </Row>
    );
  }
  render() {
    const {
      visible, preEntrySeqNo, customsDeclLoading, head, bodies, onDockClose,
    } = this.props;
    return (
      <DockPanel
        size="large"
        visible={visible}
        onClose={onDockClose}
        label={this.msg('preEntryId')}
        title={head.dec_unified_no || preEntrySeqNo}
        extra={this.renderExtra()}
        loading={customsDeclLoading}
      >
        <Tabs defaultActiveKey="masterInfo">
          <TabPane tab={this.msg('masterInfo')} key="masterInfo"><MasterPane /></TabPane>
          <TabPane tab={this.msg('declBody')} key="declBody">
            <CustomsDeclPane cusDecl={{ bodylist: bodies }} />
          </TabPane>
          <TabPane tab={this.msg('declTrack')} key="declTrack">
            <DeclTrackPane head={head} />
          </TabPane>
          <TabPane tab={this.msg('containers')} key="declContainer">
            <DeclContainer />
          </TabPane>
          <TabPane tab={this.msg('declCertDocs')} key="declCertDocs">
            <DeclCertDocs />
          </TabPane>
          <TabPane tab={this.msg('docsArchive')} key="attachment">
            <AttachmentPane
              bizObject={SCOF_BIZ_OBJECT_KEY.CMS_CUSTOMS.key}
              billNo={preEntrySeqNo}
              ownerPartnerId={head.owner_cuspartner_id}
              ownerTenantId={head.owner_custenant_id}
            />
          </TabPane>
          <TabPane tab={this.msg('declTax')} key="declTax">
            <div className="pane-content tab-pane">
              <DutyTaxPane head={head} />
            </div>
          </TabPane>
          <TabPane tab={this.msg('logs')} key="logs">
            <LogsPane
              billNo={head.pre_entry_seq_no}
              bizObject={SCOF_BIZ_OBJECT_KEY.CMS_CUSTOMS.key}
            />
          </TabPane>
        </Tabs>
      </DockPanel>
    );
  }
}
