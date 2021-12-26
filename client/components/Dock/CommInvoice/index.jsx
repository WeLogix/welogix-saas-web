import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Tabs } from 'antd';
import DockPanel from 'client/components/DockPanel';
import { getInvoice } from 'common/reducers/sofInvoice';
import { SCOF_BIZ_OBJECT_KEY } from 'common/constants';
import MasterPane from './tabpanes/masterPane';
import DetailsPane from './tabpanes/detailsPane';
import LogsPane from '../common/logsPane';
import { formatMsg } from '../../../apps/scof/invoices/message.i18n';

const { TabPane } = Tabs;

@injectIntl
@connect(
  state => ({
    commInvDock: state.saasDockPool.sofCommInv,
  }),
  { getInvoice },
)
export default class CommInvoiceDock extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    commInvDock: PropTypes.shape({
      visible: PropTypes.bool.isRequired,
      inv_no: PropTypes.string.isRequired,
    }).isRequired,
    onDockClose: PropTypes.func.isRequired,
  }
  componentDidMount() {
    const { commInvDock } = this.props;
    if (commInvDock.visible && commInvDock.inv_no) {
      this.props.getInvoice(commInvDock.inv_no);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.commInvDock.visible && nextProps.commInvDock.inv_no
    && nextProps.commInvDock.inv_no !== this.props.commInvDock.inv_no) {
      this.props.getInvoice(nextProps.commInvDock.inv_no);
    }
  }
  msg = formatMsg(this.props.intl)
  render() {
    const { commInvDock } = this.props;
    return (
      <DockPanel
        size="large"
        label={this.msg('invoices')}
        title={commInvDock.inv_no}
        visible={commInvDock.visible}
        onClose={this.props.onDockClose}
      >
        <Tabs defaultActiveKey="masterInfo">
          <TabPane tab={this.msg('masterInfo')} key="masterInfo" >
            <MasterPane />
          </TabPane>
          <TabPane tab={this.msg('commInvoiceDetails')} key="details" >
            <DetailsPane />
          </TabPane>
          <TabPane tab={this.msg('logs')} key="logs" >
            <LogsPane
              billNo={commInvDock.inv_no}
              bizObject={SCOF_BIZ_OBJECT_KEY.SOF_COMMINV.key}
            />
          </TabPane>
        </Tabs>
      </DockPanel>);
  }
}
