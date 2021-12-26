import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal, Form, Input, Table } from 'antd';
import { loadOtherPack, overwriteOtherPack } from 'common/reducers/cmsCiqInDecl';
import { WRAP_TYPE } from 'common/constants';

@connect(
  () => ({}),
  {
    loadOtherPack, overwriteOtherPack,
  }
)
@Form.create()
export default class OtherPackModal extends Component {
  static propTypes = {
    msg: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    declInfo: PropTypes.shape({
      delg_no: PropTypes.string,
      pre_entry_seq_no: PropTypes.string,
    }).isRequired,
    onModalClose: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
  }
  state = {
    documents: [],
    originData: [],
    selectedRowKeys: [],
    selectedRows: [],
  }
  componentDidMount() {
    const { delg_no: delgNo, pre_entry_seq_no: preEntrySeqNo } = this.props.declInfo;
    if (delgNo) {
      this.handleOtherPackLoad(delgNo, preEntrySeqNo);
    }
  }
  componentWillReceiveProps(nextProps) {
    if ((nextProps.declInfo.delg_no !== this.props.declInfo.delg_no ||
      nextProps.declInfo.pre_entry_seq_no !== this.props.declInfo.pre_entry_seq_no)) {
      this.handleOtherPackLoad(nextProps.declInfo.delg_no, nextProps.declInfo.pre_entry_seq_no);
    }
  }
  handleOtherPackLoad = (delgNo, preEntrySeqNo) => {
    this.props.loadOtherPack(delgNo, preEntrySeqNo).then((result) => {
      if (!result.error) {
        const fetchData = result.data;
        const selectedRowKeys = [];
        const selectedRows = [];
        const originData = [];
        const packs = [];
        for (let n = 0, l = WRAP_TYPE.length; n < l; n++) {
          const otherPack = WRAP_TYPE[n];
          const fetchItem = fetchData.find(fd => fd.wrap_type === otherPack.value);
          if (fetchItem) {
            packs.push({
              g_no: n + 1,
              wrap_type: otherPack.value,
              wrap_name: otherPack.text,
              wrap_qty: fetchItem.wrap_qty,
            });
            selectedRowKeys.push(fetchItem.wrap_type);
            selectedRows.push(fetchItem);
            originData.push(fetchItem);
          } else {
            packs.push({
              g_no: n + 1,
              wrap_type: otherPack.value,
              wrap_name: otherPack.text,
              wrap_qty: 0,
            });
          }
        }
        this.setState({
          originData,
          selectedRowKeys,
          selectedRows,
          documents: packs,
        });
      } else {
        const packs = WRAP_TYPE.map((item, ind) => ({
          g_no: ind + 1,
          wrap_type: item.value,
          wrap_name: item.text,
          wrap_qty: 0,
        }));
        this.setState({
          documents: packs,
          selectedRowKeys: [],
          selectedRows: [],
          originData: [],
        });
      }
    });
  }
  handleCancel = () => {
    this.props.onModalClose();
  }
  handleSave = () => {
    const { selectedRows, originData } = this.state;
    const { declInfo: { delg_no: delgNo, pre_entry_seq_no: preEntrySeqNo } } = this.props;
    const oldData = originData.map(f => (`类型${f.wrap_type}(${f.wrap_qty})`)).join(',');
    const newData = selectedRows.map(f => (`类型${f.wrap_type}(${f.wrap_qty})`)).join(',');
    const opContent = `其它包装由${oldData || '空'}改为${newData || '空'}`;
    this.props.overwriteOtherPack(delgNo, preEntrySeqNo, selectedRows, opContent).then((result) => {
      if (!result.error) {
        this.setState({ originData: selectedRows });
        this.handleCancel();
      }
    });
  }
  handleWrapQtyChange = (ev, index) => {
    const documents = [...this.state.documents];
    documents[index].wrap_qty = ev.target.value;
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
    title: this.props.msg('wrapType'),
    dataIndex: 'wrap_type',
    align: 'center',
    width: 100,
  }, {
    title: this.props.msg('wrapName'),
    dataIndex: 'wrap_name',
  }, {
    title: this.props.msg('wrapQty'),
    dataIndex: 'wrap_qty',
    width: 100,
    render: (o, record, index) => <Input size="small" value={o} onChange={ev => this.handleWrapQtyChange(ev, index)} disabled={this.props.disabled} />,
  }];
  render() {
    const { visible, msg, disabled } = this.props;
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
    return (
      <Modal destroyOnClose width={800} title={msg('otherPack')} visible={visible} onCancel={this.handleCancel} onOk={this.handleSave}>
        <Table size="small" columns={this.columns} dataSource={documents} scroll={{ y: 360 }} rowSelection={rowSelection} rowKey="wrap_type" pagination={false} />
      </Modal>
    );
  }
}
