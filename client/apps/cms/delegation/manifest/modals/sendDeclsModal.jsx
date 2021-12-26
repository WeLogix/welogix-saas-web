import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Modal, Card, Radio, Select, message, Table } from 'antd';
import { sendMutiDecl } from 'common/reducers/cmsCustomsDeclare';
import { loadAllSingleWindowApps, getEasipassList } from 'common/reducers/hubIntegration';
import { showSendDeclsModal } from 'common/reducers/cmsManifest';
import { CMS_DECL_CHANNEL, CMS_DECL_TYPE } from 'common/constants';
import { formatMsg } from '../../message.i18n';

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
        options.map(opt => <Option value={opt.value} key={String(opt.value)}>{opt.text}</Option>)
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
    visible: state.cmsManifest.sendDeclsModal.visible,
    delgNo: state.cmsManifest.sendDeclsModal.delgNo,
    agentCustCo: state.cmsManifest.sendDeclsModal.agentCustCo,
    agentCode: state.cmsManifest.sendDeclsModal.agentCode,
    loginName: state.account.username,
    epList: state.hubIntegration.epList,
    swClientList: state.hubIntegration.swClientList,
  }),
  {
    showSendDeclsModal, loadAllSingleWindowApps, getEasipassList, sendMutiDecl,
  }
)
export default class SendDeclsModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    ietype: PropTypes.oneOf(['import', 'export']),
    subdomain: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    delgNo: PropTypes.string.isRequired,
    showSendDeclsModal: PropTypes.func.isRequired,
    getEasipassList: PropTypes.func.isRequired,
    reload: PropTypes.func,
    entries: PropTypes.arrayOf(PropTypes.shape({ pre_entry_seq_no: PropTypes.string })),
  }
  state = {
    declChannel: CMS_DECL_CHANNEL.SW.value,
    bodies: [],
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && !this.props.visible) {
      this.props.getEasipassList(nextProps.agentCustCo);
      this.props.loadAllSingleWindowApps(nextProps.agentCode);
      const bodies = nextProps.entries.map(entry => ({
        pre_entry_seq_no: entry.pre_entry_seq_no,
        chanclient: '',
        declType: undefined,
      }));
      this.setState({ bodies });
    }
  }
  handleCancel = () => {
    this.props.showSendDeclsModal({ visible: false });
  }
  handleOk = () => {
    const {
      delgNo, subdomain, loginName,
    } = this.props;
    const values = this.state.bodies.map(val => ({
      delg_no: delgNo,
      pre_entry_seq_no: val.pre_entry_seq_no,
      client: val.chanclient,
      declType: val.declType,
    }));
    this.props.sendMutiDecl({
      values, subdomain, username: loginName, channel: this.state.declChannel,
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
  handleEditChange = (record, index, field, value) => {
    const newSendDecls = this.state.bodies.map((sd, idx) => {
      if (idx === index) {
        const row = { ...sd };
        row[field] = value;
        return row;
      }
      return sd;
    });
    this.setState({ bodies: newSendDecls });
  }
  handleChannelChange = (rcEvn) => {
    const bodies = this.props.entries.map(entry => ({
      pre_entry_seq_no: entry.pre_entry_seq_no,
      chanclient: '',
      declType: undefined,
    }));
    this.setState({ bodies, declChannel: rcEvn.target.value });
  }
  msg = formatMsg(this.props.intl)
  render() {
    const { visible, ietype } = this.props;
    const { declChannel } = this.state;
    const swclientOpts = this.props.swClientList.map(swc => ({
      value: swc.app_uuid,
      text: swc.name,
    }));
    let columns = [{
      title: this.msg('preEntrySeqNo'),
      width: 200,
      dataIndex: 'pre_entry_seq_no',
    }, {
      title: this.msg('swClientList'),
      render: (o, record, index) =>
        (<ColumnSelect
          field="chanclient"
          onChange={this.handleEditChange}
          options={swclientOpts}
          record={record}
          index={index}
        />),
    }];
    if (declChannel === CMS_DECL_CHANNEL.EP.value) {
      const epIeSel = ietype === 'import' ? 'i' : 'e';
      const declList = CMS_DECL_TYPE.filter(cdt => cdt.ietype === epIeSel);
      const easipassOpt = this.props.epList.map(easi => ({
        value: easi.app_uuid,
        text: easi.name,
      }));
      columns = [{
        title: this.msg('preEntrySeqNo'),
        width: 200,
        dataIndex: 'pre_entry_seq_no',
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
        render: (o, record, index) =>
          (<ColumnSelect
            field="chanclient"
            onChange={this.handleEditChange}
            options={easipassOpt}
            record={record}
            index={index}
          />),
      }];
    }
    return (
      <Modal
        maskClosable={false}
        title={this.msg('sendMultiDecls')}
        visible={visible}
        width={800}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
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
        <Table size="small" rowKey="id" columns={columns} dataSource={this.state.bodies} pagination={false} />
      </Modal>
    );
  }
}
