import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Modal, Card, Radio, Select, message, Table } from 'antd';
import { sendMutiDecl, closeBatchSendModal } from 'common/reducers/cmsCustomsDeclare';
import { CMS_DECL_CHANNEL, CMS_DECL_TYPE } from 'common/constants';
import Expander from './expander';
import { formatMsg } from '../message.i18n';

const { Option } = Select;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

function ColumnSelect(props) {
  const {
    record, field, options, onChange, index,
  } = props;
  function handleChange(value) {
    if (onChange) {
      onChange(record, index, field, value);
    }
  }
  return (
    <Select showArrow optionFilterProp="search" value={record[field] || ''} onChange={handleChange} style={{ width: '100%' }}>
      {
        options.map(opt => <Option value={opt.value} key={`${opt.value}`}>{`${opt.text}`}</Option>)
      }
    </Select>
  );
}

ColumnSelect.propTypes = {
  record: PropTypes.shape({ id: PropTypes.number }).isRequired,
  index: PropTypes.number,
  field: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    value: PropTypes.string,
    key: PropTypes.string,
  })).isRequired,
};

@injectIntl
@connect(
  state => ({
    subdomain: state.account.subdomain,
    visible: state.cmsCustomsDeclare.batchSendModal.visible,
    sendDecls: state.cmsCustomsDeclare.batchSendModal.sendDecls,
    sendAgents: state.cmsCustomsDeclare.batchSendModal.sendAgents,
    easilist: state.cmsCustomsDeclare.batchSendModal.easilist,
    agentSwclientMap: state.cmsCustomsDeclare.batchSendModal.agentSwclientMap,
    ietype: state.cmsCustomsDeclare.batchSendModal.ietype,
    loginName: state.account.username,
  }),
  { closeBatchSendModal, sendMutiDecl }
)
export default class BatchSendModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    subdomain: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    closeBatchSendModal: PropTypes.func.isRequired,
    reload: PropTypes.func,
  }
  state = {
    declChannel: CMS_DECL_CHANNEL.SW.value,
    agentList: [],
    expandDatas: {},
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && !this.props.visible &&
      nextProps.sendDecls.length > 0 && nextProps.sendAgents.length > 0) {
      this.initAgentData(nextProps.sendAgents, nextProps.sendDecls);
    }
  }
  msg = formatMsg(this.props.intl)
  initAgentData = (sendAgents, sendDecls) => {
    const agentList = [];
    const expandDatas = {};
    for (let i = 0; i < sendAgents.length; i++) {
      const sda = sendAgents[i];
      agentList.push({
        agent_name: sda.agent_name,
        agent_custco: sda.agent_custco,
        agent_code: sda.agent_code,
        chanclient: '',
        declType: undefined,
      });
      expandDatas[sda.agent_name] = sendDecls.filter(sdd =>
        sdd.agent_name === sda.agent_name).map(sdd => ({
        ...sdd,
        chanclient: '',
        declType: undefined,
      }));
    }
    this.setState({ agentList, expandDatas });
  }
  handleCancel = () => {
    this.props.closeBatchSendModal();
  }
  handleOk = () => {
    const { subdomain, loginName } = this.props;
    const { declChannel } = this.state;
    const expDatas = Object.values(this.state.expandDatas);
    const sendVals = [];
    for (let i = 0; i < expDatas.length; i++) {
      for (let j = 0; j < expDatas[i].length; j++) {
        const data = expDatas[i][j];
        if (!data.chanclient) {
          message.error('客户端未选择', 5);
          return;
        } else if (declChannel === CMS_DECL_CHANNEL.EP.value && !data.declType) {
          message.error('EDI单证类型未填写', 5);
          return;
        }
        sendVals.push({
          delg_no: data.delg_no,
          pre_entry_seq_no: data.pre_entry_seq_no,
          client: data.chanclient,
          declType: data.declType,
        });
      }
    }
    if (sendVals.length > 0) {
      this.props.sendMutiDecl({
        values: sendVals, channel: declChannel, subdomain, username: loginName,
      }).then((result) => {
        if (result.error) {
          message.error(result.error.message, 10);
        } else {
          message.info('发送成功');
        }
        this.handleCancel();
        this.props.reload();
      });
    }
  }
  handleEditChange = (record, index, field, value) => {
    const { agentList } = this.state;
    agentList[index][field] = value;
    const row = agentList[index];
    const { expandDatas } = this.state;
    const expDatas = [...expandDatas[row.agent_name]];
    for (let i = 0; i < expDatas.length; i++) {
      expDatas[i][field] = value;
    }
    expandDatas[row.agent_name] = expDatas;
    this.setState({ agentList, expandDatas });
  }
  handleExpChange = (value) => {
    const { expandDatas } = this.state;
    expandDatas[value.custname] = value.changeData;
    this.setState({ expandDatas });
  }
  handleExpandDetail = (row) => {
    const subData = this.state.expandDatas[row.agent_name];
    let easipassOpt = [];
    if (this.props.easilist[row.agent_custco]) {
      easipassOpt = this.props.easilist[row.agent_custco].map(easi => ({
        value: easi.app_uuid,
        text: easi.name,
      }));
    }
    let swclientOpts = [];
    if (this.props.agentSwclientMap[row.agent_code]) {
      swclientOpts = this.props.agentSwclientMap[row.agent_code].map(easi => ({
        value: easi.app_uuid,
        text: easi.name,
      }));
    }
    return (<Expander
      custkey={row.agent_name}
      subData={subData}
      declChannel={this.state.declChannel}
      easipassOpts={easipassOpt}
      swclientOpts={swclientOpts}
      onDeclChange={this.handleExpChange}
    />);
  }
  handleChannelChange = (rcEvn) => {
    this.initAgentData(this.props.sendAgents, this.props.sendDecls);
    this.setState({ declChannel: rcEvn.target.value });
  }
  render() {
    const {
      visible, ietype, easilist, agentSwclientMap,
    } = this.props;
    const { declChannel, agentList } = this.state;
    let columns = [{
      title: this.msg('agent'),
      dataIndex: 'agent_name',
    }, {
      title: this.msg('swClientList'),
      width: 200,
      render: (o, record, index) => {
        let swclientOpts = [];
        if (agentSwclientMap[record.agent_code]) {
          swclientOpts = agentSwclientMap[record.agent_code].map(easi => ({
            value: easi.app_uuid,
            text: easi.name,
          }));
        }
        return (<ColumnSelect
          field="chanclient"
          onChange={this.handleEditChange}
          options={swclientOpts}
          record={record}
          index={index}
        />);
      },
    }];
    if (declChannel === CMS_DECL_CHANNEL.EP.value) {
      let declList = CMS_DECL_TYPE;
      if (ietype === 0) {
        declList = declList.filter(dl => dl.ietype === 'i');
      } else if (ietype === 1) {
        declList = declList.filter(dl => dl.ietype === 'e');
      }
      columns = [{
        title: this.msg('agent'),
        dataIndex: 'agent_name',
      }, {
        title: this.msg('declType'),
        width: 200,
        render: (o, record, index) =>
          (<ColumnSelect
            field="declType"
            onChange={this.handleEditChange}
            options={declList}
            record={record}
            index={index}
          />),
      }, {
        title: this.msg('epClientList'),
        width: 200,
        render: (o, record, index) => {
          let easipassOpt = [];
          if (easilist[record.agent_custco]) {
            easipassOpt = easilist[record.agent_custco].map(easi => ({
              value: easi.app_uuid,
              text: easi.name,
            }));
          }
          return (
            <ColumnSelect
              field="chanclient"
              onChange={this.handleEditChange}
              options={easipassOpt}
              record={record}
              index={index}
            />);
        },
      }];
    }
    return (
      <Modal
        maskClosable={false}
        title={this.msg('sendMultiDecls')}
        visible={visible}
        width={860}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        bodyStyle={{ padding: 0 }}
      >
        <Card title={this.msg('declChannel')}>
          <RadioGroup value={declChannel} onChange={this.handleChannelChange}>
            {Object.keys(CMS_DECL_CHANNEL).map((dchan) => {
                  const channel = CMS_DECL_CHANNEL[dchan];
                  return (<RadioButton
                    value={channel.value}
                    key={channel.value}
                    disabled={channel.disabled}
                  >
                    {channel.text}
                  </RadioButton>);
                })}
          </RadioGroup>
        </Card>
        <Table
          size="middle"
          rowKey="agent_name"
          columns={columns}
          dataSource={agentList}
          expandedRowRender={this.handleExpandDetail}
          pagination={false}
        />
      </Modal>
    );
  }
}
