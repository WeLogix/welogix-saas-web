import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Modal, Row, Input, Form } from 'antd';
import { togglebuModal, createBu, updateUnionBu, deleteUnionBu } from 'common/reducers/saasTenant';
import RowAction from 'client/components/RowAction';
import { formatMsg } from '../message.i18n';


@injectIntl
@connect(
  state => ({
    visible: state.saasTenant.buModal.visible,
    unionBus: state.saasTenant.unionBus,
  }),
  {
    togglebuModal, createBu, updateUnionBu, deleteUnionBu,
  }
)
@Form.create()
export default class AddMemberModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    unionId: PropTypes.number.isRequired,
  }
  state = {
    editItem: {},
  }
  msg = formatMsg(this.props.intl)
  handleCreateBu = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        this.props.createBu(values.bu_name, this.props.unionId).then((result) => {
          if (!result.error) {
            this.props.form.resetFields();
          }
        });
      }
    });
  }
  handleCancel = () => {
    this.props.togglebuModal(false);
    this.setState({
      editItem: {},
    });
  }
  handleEdit = (row) => {
    this.setState({
      editItem: row,
    });
  }
  handleBuChange = (e) => {
    const editItem = { ...this.state.editItem };
    editItem.bu_name = e.target.value;
    this.setState({
      editItem,
    });
  }
  handleSaveBu = () => {
    const { editItem } = this.state;
    this.props.updateUnionBu(editItem.id, editItem.bu_name).then((result) => {
      if (!result.error) {
        this.setState({
          editItem: {},
        });
      }
    });
  }
  handleDeleteBu = (row) => {
    this.props.deleteUnionBu(row.id);
  }
  render() {
    const { visible, form: { getFieldDecorator }, unionBus } = this.props;
    const { editItem } = this.state;
    return (
      <Modal
        visible={visible}
        title={this.msg('bu')}
        onCancel={this.handleCancel}
        destroyOnClose
        footer={null}
      >
        {unionBus.map(bu => (
          <Row style={{ marginBottom: 16 }}>
            {this.msg('buName')}
            <Input
              onChange={this.handleBuChange}
              disabled={editItem.id !== bu.id}
              value={editItem.id === bu.id ? editItem.bu_name : bu.bu_name}
              style={{ width: 300, marginLeft: 16, marginRight: 8 }}
            />
            {editItem.id === bu.id ?
              <RowAction onClick={this.handleSaveBu} icon="save" row={editItem} /> :
              <RowAction onClick={this.handleEdit} icon="edit" row={bu} />}
            <RowAction danger confirm={this.msg('deleteConfirm')} onConfirm={this.handleDeleteBu} icon="delete" row={bu} />
          </Row>))}
        <Row>
          {this.msg('buName')}
          {getFieldDecorator('bu_name', {
            rules: [{ required: true }],
          })(<Input style={{ width: 300, marginLeft: 16, marginRight: 8 }} />)}
          <RowAction onClick={this.handleCreateBu} icon="plus-circle" />
        </Row>
      </Modal>
    );
  }
}
