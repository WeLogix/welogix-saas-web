import React from 'react';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Modal, Icon, Tabs } from 'antd';
import { closeSubFlowAuthModal, deleteProviderFlow } from 'common/reducers/scofFlow';
import FlowInfoPane from '../tabpane/flowInfoPane';
import ShareFlowPane from '../tabpane/shareFlowPane';
// import TrackPointsPane from '../tabpane/trackPointsPane';
import { formatMsg } from '../message.i18n';

const { TabPane } = Tabs;

@injectIntl
@connect(
  state => ({
    submitting: state.scofFlow.submitting,
    visible: state.scofFlow.flowProviderModal.visible,
    currentFlow: state.scofFlow.currentFlow,
  }),
  {
    closeSubFlowAuthModal, deleteProviderFlow,
  }
)
export default class FlowSettingModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }

  msg = formatMsg(this.props.intl)

  handleCancel = () => {
    this.props.closeSubFlowAuthModal();
  }
  render() {
    const { visible, currentFlow } = this.props;
    return (
      <Modal
        title="流程设置"
        width={680}
        style={{ top: 24 }}
        visible={visible}
        maskClosable={false}
        footer={null}
        onCancel={this.handleCancel}
        destroyOnClose
      >
        <Tabs defaultActiveKey="info">
          <TabPane tab={<span><Icon type="profile" />流程信息</span>} key="info">
            <FlowInfoPane />
          </TabPane>
          {!currentFlow.main_flow_id &&
          <TabPane tab={<span><Icon type="key" />共享授权</span>} key="share">
            <ShareFlowPane />
          </TabPane>}
        </Tabs>
      </Modal>
    );
  }
}

