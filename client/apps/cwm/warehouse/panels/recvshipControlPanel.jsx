import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { Tabs, Button, Form, Icon, Switch, Radio, message } from 'antd';
import DockPanel from 'client/components/DockPanel';
import { toggleRecShipDock, updateWhOwnerControl } from 'common/reducers/cwmWarehouse';
import { formatMsg } from '../message.i18n';
import OwnerPickPrintControlPane from './tabpane/ownerPickPrintControlPane';
import SuBarcodeSettingPane from './tabpane/suBarcodeSettingPane';

const { TabPane } = Tabs;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

@injectIntl
@connect(
  state => ({
    visible: state.cwmWarehouse.recShipAttrsDock.visible,
    whseCode: state.cwmWarehouse.recShipAttrsDock.whseCode,
    ownerAuth: state.cwmWarehouse.recShipAttrsDock.whOwnerAuth,
  }),
  { toggleRecShipDock, updateWhOwnerControl },
)
export default class RecvshipControlPanel extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    ownerAuth: PropTypes.shape({
      id: PropTypes.number.isRequired,
      portion_enabled: PropTypes.number.isRequired,
      owner_code: PropTypes.string.isRequired,
      shipping_mode: PropTypes.string.isRequired,
      receiving_mode: PropTypes.string.isRequired,
      pick_print: PropTypes.string.isRequired,
    }),
  }
  state = {
    ownerAuth: { },
    control: {}, // submit main body, only edited field in
    currKey: 'opMode',
  }
  componentDidMount() {
    if (this.props.visible) {
      this.handleAuthSetting(this.props.ownerAuth);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && !this.props.visible) {
      this.handleAuthSetting(nextProps.ownerAuth);
    }
  }
  handleRecModeChange = (ev) => {
    this.setState({
      ownerAuth: { ...this.state.ownerAuth, receiving_mode: ev.target.value },
      control: { ...this.state.control, receiving_mode: ev.target.value },
    });
  }
  handleShipModeChange = (ev) => {
    this.setState({
      ownerAuth: { ...this.state.ownerAuth, shipping_mode: ev.target.value },
      control: { ...this.state.control, shipping_mode: ev.target.value },
    });
  }
  handlePortionEnable = (checked) => {
    this.setState({
      ownerAuth: { ...this.state.ownerAuth, portion_enabled: checked },
      control: { ...this.state.control, portion_enabled: checked },
    });
  }
  handleAuthSetting = (ownerAuth) => {
    this.setState({ ownerAuth });
  }
  handleSubmit = () => {
    this.props.updateWhOwnerControl(
      this.props.ownerAuth.id,
      this.state.control,
      this.props.whseCode,
      `??????????????????, ??????[${this.props.ownerAuth.owner_code}]`,
    ).then((result) => {
      if (result.error) {
        message.error(result.error.message, 5);
      } else {
        message.success('????????????');
      }
    });
  }
  msg = formatMsg(this.props.intl)
  render() {
    const { ownerAuth, currKey } = this.state;
    const { visible } = this.props;
    return (
      <DockPanel
        title="???????????????"
        visible={visible}
        bodyStyle={{ backgroundColor: 'white' }}
        onClose={() => this.props.toggleRecShipDock(false)}
      >
        <Tabs
          activeKey={currKey}
          style={{ backgroundColor: '#fff' }}
          onChange={key => this.setState({ currKey: key })}
        >
          <TabPane tab="????????????" key="opMode">
            <Form>
              <FormItem {...formItemLayout} label="??????????????????">
                <RadioGroup value={ownerAuth.receiving_mode} onChange={this.handleRecModeChange}>
                  <RadioButton value="scan"><Icon type="wifi" /> ????????????</RadioButton>
                  <RadioButton value="manual"><Icon type="desktop" /> ????????????</RadioButton>
                </RadioGroup>
              </FormItem>
              <FormItem {...formItemLayout} label="??????????????????">
                <RadioGroup value={ownerAuth.shipping_mode} onChange={this.handleShipModeChange}>
                  <RadioButton value="scan"><Icon type="wifi" /> ????????????</RadioButton>
                  <RadioButton value="manual"><Icon type="desktop" /> ????????????</RadioButton>
                </RadioGroup>
              </FormItem>
              <FormItem {...formItemLayout} label="??????????????????">
                <Switch checked={!!ownerAuth.portion_enabled} onChange={this.handlePortionEnable} />
              </FormItem>
              <div className="ant-modal-footer" style={{ width: '100%', backgroundColor: 'white' }}>
                <Button type="primary" onClick={this.handleSubmit}>??????</Button>
              </div>
            </Form>
          </TabPane>
          {ownerAuth.receiving_mode === 'manual' && <TabPane tab="SU??????????????????" key="barCode">
            <SuBarcodeSettingPane />
          </TabPane>}
          <TabPane tab="?????????????????????" key="pick">
            <OwnerPickPrintControlPane />
          </TabPane>
        </Tabs>
      </DockPanel>
    );
  }
}
