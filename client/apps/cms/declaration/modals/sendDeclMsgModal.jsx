import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Alert, Modal, Form, Radio, Select, message } from 'antd';
import DescriptionList from 'client/components/DescriptionList';
import { showSendDeclModal, loadLatestSendRecord, sendDecl } from 'common/reducers/cmsCustomsDeclare';
import { loadAllSingleWindowApps, getEasipassList } from 'common/reducers/hubIntegration';
import { CMS_DECL_CHANNEL, CMS_DECL_TYPE } from 'common/constants';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { Description } = DescriptionList;

@injectIntl
@connect(
  state => ({
    subdomain: state.account.subdomain,
    visible: state.cmsCustomsDeclare.sendDeclModal.visible,
    defaultDecl: state.cmsCustomsDeclare.sendDeclModal.defaultDecl,
    ietype: state.cmsCustomsDeclare.sendDeclModal.ietype,
    preEntrySeqNo: state.cmsCustomsDeclare.sendDeclModal.preEntrySeqNo,
    delgNo: state.cmsCustomsDeclare.sendDeclModal.delgNo,
    agentCustCo: state.cmsCustomsDeclare.sendDeclModal.agentCustCo,
    agentCode: state.cmsCustomsDeclare.sendDeclModal.agentCode,
    ieDate: state.cmsCustomsDeclare.sendDeclModal.ieDate,
    loginName: state.account.username,
    swClientList: state.hubIntegration.swClientList,
    epList: state.hubIntegration.epList,
  }),
  {
    showSendDeclModal, loadLatestSendRecord, getEasipassList, sendDecl, loadAllSingleWindowApps,
  }
)
@Form.create()
export default class SendDeclMsgModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    subdomain: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    preEntrySeqNo: PropTypes.string.isRequired,
    delgNo: PropTypes.string.isRequired,
    showSendDeclModal: PropTypes.func.isRequired,
    getEasipassList: PropTypes.func.isRequired,
    sendDecl: PropTypes.func.isRequired,
    reload: PropTypes.func.isRequired,
  }
  state = {
    preSentRecord: {},
    declChannel: '',
  }
  componentWillMount() {
    if (window.localStorage) {
      const declChannel = window.localStorage.getItem('decl-channel');
      this.setState({
        declChannel,
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && !this.props.visible && nextProps.visible) {
      this.props.getEasipassList(nextProps.agentCustCo);
      // 保证每次打开时发送记录更新
      this.props.loadLatestSendRecord(nextProps.preEntrySeqNo).then((result) => {
        this.setState({ preSentRecord: result.data.data[0] });
      });
      this.props.loadAllSingleWindowApps(nextProps.agentCode);
    }
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.props.showSendDeclModal({ visible: false });
  }
  handleOk = () => {
    const {
      delgNo, preEntrySeqNo, subdomain, loginName, ieDate, ietype,
    } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const uuid = values.easipass || values.singleWindow;
        if (values.singleWindow && !ieDate) {
          const ieDateStr = ietype === 'import' ? this.msg('idate') : this.msg('edate');
          message.info(`${ieDateStr}未填写`, 15);
          return;
        }
        const { declType } = values;
        const channel = values.declChannel;
        this.props.sendDecl({
          preEntrySeqNo, delgNo, subdomain, uuid, channel, declType, username: loginName,
        }).then((result) => {
          if (result.error) {
            message.error(result.error.message, 10);
          } else {
            message.info('发送成功');
            this.props.showSendDeclModal({ visible: false });
            this.props.reload();
            // this.props.loadSendRecords();
          }
        });
      }
    });
  }
  render() {
    const {
      visible,
      form: { getFieldDecorator, getFieldValue },
      ietype,
      defaultDecl,
      swClientList,
      epList,
    } = this.props;
    const {
      preSentRecord,
    } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    let declList = [];
    if (ietype === 'import') {
      declList = CMS_DECL_TYPE.filter(cdt => cdt.ietype === 'i');
    } else if (ietype === 'export') {
      declList = CMS_DECL_TYPE.filter(cdt => cdt.ietype === 'e');
    }
    const declInitialForm = {
    };
    if (defaultDecl) {
      declInitialForm.channel = defaultDecl.channel || this.state.declChannel;
    }
    const fieldDeclChannel = getFieldValue('declChannel') || declInitialForm.channel;
    if (defaultDecl) {
      if (fieldDeclChannel === CMS_DECL_CHANNEL.SW.value) {
        if (!getFieldValue('singleWindow')) {
          const swClient = swClientList.filter(swc => swc.app_uuid === defaultDecl.appuuid)[0];
          if (swClient) {
            declInitialForm.singleWindow = swClient.app_uuid;
          }
        }
      } else if (fieldDeclChannel === CMS_DECL_CHANNEL.EP.value) {
        declInitialForm.declType = defaultDecl.dectype;
        if (!getFieldValue('easipass')) {
          const epClient = epList.filter(epc => epc.app_uuid === defaultDecl.appuuid)[0];
          if (epClient) {
            declInitialForm.easipass = epClient.app_uuid;
          }
        }
      }
    }
    return (
      <Modal
        maskClosable={false}
        title={this.msg('sendDeclMsg')}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form layout="horizontal">
          {preSentRecord &&
          <Alert message={<DescriptionList col={1}>
            <Description term="上次发送时间" key={preSentRecord.sent_date}>{moment(preSentRecord.sent_date).format('YY.MM.DD HH:mm')}</Description>
            <Description term="发送人" key={preSentRecord.sender_name}>{preSentRecord.sender_name}</Description>
          </DescriptionList>}
          />
          }
          <FormItem label={this.msg('declChannel')} {...formItemLayout}>
            {getFieldDecorator('declChannel', { initialValue: declInitialForm.channel, rules: [{ required: true, message: '请选择申报通道' }] })(<RadioGroup>
              {Object.keys(CMS_DECL_CHANNEL).map((declChannel) => {
                  const channel = CMS_DECL_CHANNEL[declChannel];
                  return (<RadioButton
                    value={channel.value}
                    key={channel.value}
                    disabled={channel.disabled}
                  >
                    {channel.text}
                  </RadioButton>);
                })}
            </RadioGroup>)}
          </FormItem>
          {fieldDeclChannel === CMS_DECL_CHANNEL.SW.value &&
          <FormItem label={this.msg('swClientList')} {...formItemLayout}>
              {getFieldDecorator('singleWindow', { initialValue: declInitialForm.singleWindow, rules: [{ required: true, message: '请选择导入客户端' }] })(<Select
                allowClear
                showSearch
                optionFilterProp="children"
              >
                {swClientList.map(item => (
                  <Option key={item.app_uuid} value={item.app_uuid}>
                    {item.name}
                  </Option>))}
              </Select>)}
          </FormItem>}
          {fieldDeclChannel === CMS_DECL_CHANNEL.EP.value &&
          <FormItem label={this.msg('declType')} {...formItemLayout}>
            {getFieldDecorator('declType', { initialValue: declInitialForm.declType, rules: [{ required: true, message: '请选择单证类型' }] })(<Select
              allowClear
              showSearch
              optionFilterProp="children"
            >
              {declList.map(item => (
                <Option key={item.value} value={item.value}>
                  {item.text}
                </Option>))}
            </Select>)}
          </FormItem>}
          {fieldDeclChannel === CMS_DECL_CHANNEL.EP.value &&
          <FormItem label={this.msg('epClientList')} {...formItemLayout}>
              {getFieldDecorator('easipass', { initialValue: declInitialForm.easipass, rules: [{ required: true, message: '请选择EDI' }] })(<Select
                allowClear
                showSearch
                optionFilterProp="children"
              >
                {epList.map(item => (
                  <Option key={item.app_uuid} value={item.app_uuid}>
                    {item.name}
                  </Option>))}
              </Select>)}
          </FormItem>}
        </Form>
      </Modal>
    );
  }
}
