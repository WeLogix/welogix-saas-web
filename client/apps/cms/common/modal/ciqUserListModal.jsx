import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal, Form, Row, Col, Input, Button, Table } from 'antd';
import { loadCiqUserList, saveCiqUser, deleteCiqUsers } from 'common/reducers/cmsCiqInDecl';
import RowAction from 'client/components/RowAction';

const FormItem = Form.Item;

@connect(
  () => ({}),
  {
    loadCiqUserList, saveCiqUser, deleteCiqUsers,
  }
)
@Form.create()
export default class CiqUserListModal extends Component {
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
    userList: [],
  }
  componentDidMount() {
    if (this.props.declInfo.delg_no) {
      this.handleUserListLoad(this.props.declInfo.delg_no, this.props.declInfo.pre_entry_seq_no);
    }
  }
  componentWillReceiveProps(nextProps) {
    if ((nextProps.declInfo.delg_no !== this.props.declInfo.delg_no ||
      nextProps.declInfo.pre_entry_seq_no !== this.props.declInfo.pre_entry_seq_no)) {
      this.handleUserListLoad(nextProps.declInfo.delg_no, nextProps.declInfo.pre_entry_seq_no);
    }
  }
  handleUserListLoad = (delgNo, preEntrySeqNo) => {
    this.props.loadCiqUserList(delgNo, preEntrySeqNo).then((result) => {
      if (!result.error) {
        const fetchData = result.data;
        const userList = fetchData ? fetchData.map((fd, ind) => ({ ...fd, user_no: ind + 1 })) : [];
        this.setState({ userList });
      }
    });
  }
  handleCancel = () => {
    this.props.onModalClose();
  }
  handleSave = () => {
    const { form, declInfo: { delg_no: delgNo, pre_entry_seq_no: preEntrySeqNo } } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const opContent = `新增使用人${values.user_org_person}(${values.user_org_tel})`;
        const data = {
          user_org_person: values.user_org_person,
          user_org_tel: values.user_org_tel,
          delg_no: delgNo,
          pre_entry_seq_no: preEntrySeqNo,
          opContent,
        };
        this.props.saveCiqUser(data).then((result) => {
          if (!result.error) {
            const userList = [...this.state.userList];
            data.user_no = userList.length + 1;
            data.id = result.data;
            userList.push(data);
            this.setState({
              userList,
            });
            form.resetFields();
          }
        });
      }
    });
  }
  handleDelete = (row) => {
    const { declInfo: { delg_no: delgNo, pre_entry_seq_no: preEntrySeqNo } } = this.props;
    const opContent = `删除使用人${row.user_org_person}(${row.user_org_tel})`;
    this.props.deleteCiqUsers({
      ids: [row.id], delgNo, preEntrySeqNo, opContent,
    }).then((result) => {
      if (!result.error) {
        const userList = [...this.state.userList].filter(eq => eq.id !== row.id)
          .map((fd, ind) => ({ ...fd, user_no: ind + 1 }));
        this.setState({ userList });
      }
    });
  }
  columns = [{
    title: this.props.msg('seqNo'),
    dataIndex: 'user_no',
    width: 45,
    align: 'center',
    className: 'table-col-seq',
  }, {
    title: this.props.msg('userOrgPerson'),
    dataIndex: 'user_org_person',
    width: 400,
  }, {
    title: this.props.msg('userOrgTel'),
    dataIndex: 'user_org_tel',
  }, {
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    width: 90,
    render: (o, record) => (<span>
      <RowAction danger confirm={this.props.msg('deleteConfirm')} onConfirm={this.handleDelete} icon="delete" tooltip={this.props.msg('delete')} row={record} disabled={this.props.disabled} />
    </span>),
  }];
  render() {
    const {
      visible, msg, form: { getFieldDecorator }, disabled,
    } = this.props;
    const { userList } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <Modal width={960} title={msg('declUser')} visible={visible} maskClosable={false} onCancel={this.handleCancel} footer={null}>
        <Form layout="horizontal" hideRequiredMark className="form-layout-multi-col">
          <Row>
            <Col span={10}>
              <FormItem {...formItemLayout} label={msg('userOrgPerson')}>
                {getFieldDecorator('user_org_person', {
                  rules: [
                    { required: true },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem {...formItemLayout} label={msg('userOrgTel')}>
                {getFieldDecorator('user_org_tel', {
                  rules: [
                    { required: true },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={4} style={{ textAlign: 'right' }}>
              <Button type="primary" icon="save" onClick={this.handleSave} disabled={disabled}>{msg('save')}</Button>
            </Col>
          </Row>
        </Form>
        <Table size="small" columns={this.columns} dataSource={userList} pagination={false} rowKey="id" />
      </Modal>
    );
  }
}
