import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Modal, Input, Table, Form, DatePicker } from 'antd';
import { loadCiqApplCert, overwriteCiqApplCert } from 'common/reducers/cmsCiqInDecl';
import { CIQ_APPL_CERTS } from 'common/constants';

const FormItem = Form.Item;

@connect(
  () => ({}),
  { loadCiqApplCert, overwriteCiqApplCert }
)
export default class CiqApplCertModal extends Component {
  static propTypes = {
    msg: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    declInfo: PropTypes.shape({
      delg_no: PropTypes.string,
      pre_entry_seq_no: PropTypes.string,
      ietype: PropTypes.oneOf(['import', 'export']),
    }).isRequired,
    onModalClose: PropTypes.func.isRequired,
    onModalChanged: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
  }
  state = {
    documents: [],
    selectedRowKeys: [],
    selectedRows: [],
    originData: [],
  }
  componentDidMount() {
    const { delg_no: delgNo, pre_entry_seq_no: preEntrySeqNo } = this.props.declInfo;
    if (delgNo) {
      this.handleApplCertLoad(delgNo, preEntrySeqNo);
    }
  }
  componentWillReceiveProps(nextProps) {
    if ((nextProps.declInfo.delg_no !== this.props.declInfo.delg_no ||
      nextProps.declInfo.pre_entry_seq_no !== this.props.declInfo.pre_entry_seq_no)) {
      this.handleApplCertLoad(nextProps.declInfo.delg_no, nextProps.declInfo.pre_entry_seq_no);
    }
  }
  handleApplCertLoad = (delgNo, preEntrySeqNo) => {
    this.props.loadCiqApplCert(delgNo, preEntrySeqNo).then((result) => {
      if (!result.error) {
        const fetchData = result.data;
        const selectedRowKeys = [];
        const selectedRows = [];
        const originData = [];
        const certs = [];
        const certNames = [];
        for (let n = 0, l = CIQ_APPL_CERTS.length; n < l; n++) {
          const applCert = CIQ_APPL_CERTS[n];
          const fetchItem = fetchData.find(fd => fd.applcert_code === applCert.certcode);
          if (fetchItem) {
            const data = {
              g_no: n + 1,
              appl_ori: fetchItem.appl_ori,
              appl_copyquan: fetchItem.appl_copyquan,
              applcert_code: applCert.certcode,
            };
            certs.push(data);
            selectedRowKeys.push(fetchItem.applcert_code);
            selectedRows.push(data);
            originData.push(data);
            certNames.push(applCert.certname);
          } else {
            certs.push({
              g_no: n + 1,
              applcert_code: applCert.certcode,
              appl_ori: applCert.appl_ori,
              appl_copyquan: applCert.appl_copyquan,
            });
          }
        }
        this.setState({
          selectedRowKeys,
          selectedRows,
          documents: certs,
          originData,
        });
        this.props.onModalChanged(certNames.join(','));
      } else {
        const certs = CIQ_APPL_CERTS.map((item, ind) => ({
          g_no: ind + 1,
          applcert_code: item.certcode,
          appl_ori: item.appl_ori,
          appl_copyquan: item.appl_copyquan,
        }));
        this.setState({
          documents: certs,
          selectedRowKeys: [],
          selectedRows: [],
        });
      }
    });
  }
  handleCancel = () => {
    const certNameStr = this.state.selectedRowKeys.map((srk) => {
      const cert = CIQ_APPL_CERTS.find(cac => cac.certcode === srk);
      return cert ? cert.certname : '';
    }).filter(crtn => crtn).join(',');
    this.props.onModalClose(certNameStr);
  }
  handleSave = () => {
    const { selectedRows, originData } = this.state;
    const { declInfo: { delg_no: delgNo, pre_entry_seq_no: preEntrySeqNo } } = this.props;
    const oldData = originData.map(f => (`代码${f.applcert_code}(正${f.appl_ori}|副${f.appl_copyquan})`)).join(',');
    const newData = selectedRows.map(f => (`代码${f.applcert_code}(正${f.appl_ori}|副${f.appl_copyquan})`)).join(',');
    const opContent = `所需单证由${oldData || '空'}改为${newData || '空'}`;
    this.props.overwriteCiqApplCert(delgNo, preEntrySeqNo, selectedRows, opContent)
      .then((result) => {
        if (!result.error) {
          this.setState({ originData: selectedRows });
          this.handleCancel();
        }
      });
  }
  handleOriChange = (e, index) => {
    const documents = [...this.state.documents];
    documents[index].appl_ori = e.target.value;
    this.setState({
      documents,
    });
  }
  handleCopyQuanChange = (e, index) => {
    const documents = [...this.state.documents];
    documents[index].appl_copyquan = e.target.value;
    this.setState({
      documents,
    });
  }
  columns = [{
    title: this.props.msg('seqNo'),
    dataIndex: 'g_no',
    width: 45,
    align: 'center',
    className: 'table-col-seq',
  }, {
    title: this.props.msg('appCertCode'),
    dataIndex: 'applcert_code',
    align: 'center',
    width: 80,
  }, {
    title: this.props.msg('appCertName'),
    render: (_, record) => {
      const cert = CIQ_APPL_CERTS.find(item =>
        item.certcode === record.applcert_code);
      return cert ? cert.certname : null;
    },
  }, {
    title: this.props.msg('applOri'),
    dataIndex: 'appl_ori',
    width: 100,
    render: (o, record, index) => <Input size="small" value={o} onChange={e => this.handleOriChange(e, index)} disabled={this.props.disabled} />,
  }, {
    title: this.props.msg('applCopyQuan'),
    dataIndex: 'appl_copyquan',
    width: 100,
    render: (o, record, index) => <Input size="small" value={o} onChange={e => this.handleCopyQuanChange(e, index)} disabled={this.props.disabled} />,
  }];
  render() {
    const {
      visible, msg, getFieldDecorator, declInfo, disabled,
    } = this.props;
    const { ietype } = declInfo;
    const { documents } = this.state;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys,
          selectedRows,
        });
      },
      getCheckboxProps: () => ({ disabled }),
    };
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const traderNameEnLabel = `${ietype === 'import' ? msg('domesticReceiver') : msg('domesticSender')}(${msg('nonCnName')})`;
    const overseaEntityNameLabel = `${ietype === 'import' ? msg('overseaSender') : msg('overseaReceiver')}(${msg('cnName')})`;
    return (
      <Modal width={800} title={msg('certNeeded')} visible={visible} maskClosable={false} onCancel={this.handleCancel} onOk={this.handleSave} style={{ top: 20 }}>
        <Table size="small" columns={this.columns} dataSource={documents} scroll={{ y: 360 }} rowSelection={rowSelection} rowKey="applcert_code" pagination={false} />
        <Form style={{ marginTop: 16 }}>
          <FormItem style={{ marginBottom: 8 }} {...formItemLayout} label={traderNameEnLabel}>
            {getFieldDecorator('trader_name_en', {
              initialValue: declInfo.trader_name_en,
            })(<Input disabled={disabled} />)}
          </FormItem>
          <FormItem style={{ marginBottom: 8 }} {...formItemLayout} label={overseaEntityNameLabel}>
            {getFieldDecorator('oversea_entity_cname', {
              initialValue: declInfo.oversea_entity_cname,
            })(<Input disabled={disabled} />)}
          </FormItem>
          {ietype === 'import' &&
          <FormItem style={{ marginBottom: 8 }} {...formItemLayout} label={msg('overseaSenderAddr')}>
            {getFieldDecorator('oversea_entity_addr', {
              initialValue: declInfo.oversea_entity_addr,
            })(<Input disabled={disabled} />)}
          </FormItem>}
          {ietype === 'import' &&
          <FormItem style={{ marginBottom: 8 }} {...formItemLayout} label={msg('unloadDate')}>
            {getFieldDecorator('complete_discharge_date', {
              initialValue: declInfo.complete_discharge_date ? moment(declInfo.complete_discharge_date) : '',
            })(<DatePicker disabled={disabled} style={{ width: '100%' }} />)}
          </FormItem>}
        </Form>
        {/* <Row style={{ marginTop: 20, textAlign: 'center' }}>
          <Button type="primary" onClick={this.handleSave}>{msg('save')}</Button>
        </Row> */}
      </Modal>
    );
  }
}
