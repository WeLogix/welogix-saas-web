import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Tabs } from 'antd';
import DockPanel from 'client/components/DockPanel';
import { formatMsg } from '../../../apps/cwm/sasbl/blbook/message.i18n';
import BlBookHeadPane from './tabpanes/masterPane';
import BlBookBodyPane from './tabpanes/detailsPane';


const { TabPane } = Tabs;

@injectIntl
@connect(
  state => ({
    cwmBlBook: state.saasDockPool.cwmBlBook,
    blBook: state.cwmBlBook.blBookData,
  }),
  { },
)
export default class CwmBlBookDock extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    cwmBlBook: PropTypes.shape({
      visible: PropTypes.bool.isRequired,
    }).isRequired,
    onDockClose: PropTypes.func.isRequired,
  }
  msg = formatMsg(this.props.intl)
  render() {
    const { visible } = this.props.cwmBlBook;
    const { blBook } = this.props;
    return (
      <DockPanel
        title={blBook.blbook_no || blBook.cop_manual_no}
        size="large"
        label={this.msg('blBook')}
        visible={visible}
        onClose={this.props.onDockClose}
      >
        <Tabs defaultActiveKey="blBookHead">
          <TabPane tab={this.msg('blbookHead')} key="blBookHead" >
            <BlBookHeadPane />
          </TabPane>
          {
            (blBook && blBook.blbook_status > 1) &&
            (<TabPane tab={this.msg('blbookGoods')} key="blBookbody" >
              <BlBookBodyPane />
            </TabPane>)
          }
        </Tabs>
      </DockPanel>);
  }
}
