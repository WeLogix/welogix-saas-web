import React from 'react';
import { connect } from 'react-redux';
import { Modal, Form, Select, Input } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { toggleFolderModal, createFolder, editFolder } from 'common/reducers/saasInfra';
import { ARCHIVE_TYPE } from 'common/constants';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;

@injectIntl
@connect(
  state => ({
    partners: state.partner.partners,
    docFolderModal: state.saasInfra.docFolderModal,
  }),
  {
    toggleFolderModal, createFolder, editFolder,
  }
)
@Form.create()
export default class editFolderModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  msg = formatMsg(this.props.intl)
  handleOk = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        const folderId = this.props.docFolderModal.data.id;
        const { parentFolder } = this.props;
        const docType = values.doc_type || parentFolder.doc_type;
        const ownerPartnerId = values.owner_partner_id || parentFolder.owner_partner_id;
        let ownerTenantId;
        if (ownerPartnerId) {
          const partner = this.props.partners.find(f => f.id === ownerPartnerId);
          ownerTenantId = partner && partner.partner_tenant_id;
        }
        let prom;
        if (folderId) {
          prom = this.props.editFolder({ ...values, owner_tenant_id: ownerTenantId }, folderId);
        } else {
          prom = this.props.createFolder({
            ...values,
            parent_doc_id: parentFolder.id,
            owner_partner_id: ownerPartnerId,
            owner_tenant_id: ownerTenantId,
            doc_type: docType,
          });
        }
        prom.then((result) => {
          if (!result.error) this.handleCancel();
        });
      }
    });
  }
  handleCancel = () => {
    this.props.toggleFolderModal(false);
  }
  render() {
    const {
      form: { getFieldDecorator }, partners, docFolderModal: { visible, data }, parentFolder,
    } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Modal
        maskClosable={false}
        title={data.id ? '修改文件夹' : '创建文件夹'}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form>
          {!parentFolder && [
            <FormItem label="关联客户" {...formItemLayout}>
              {getFieldDecorator('owner_partner_id', {
                initialValue: data.owner_partner_id,
              })(<Select
                showSearch
                showArrow
                optionFilterProp="children"
                style={{ width: '100%' }}
                placeholder="请选择关联客户"
              >
                {partners.map(f => (<Option value={f.id} key={f.id}>
                  {[f.partner_code, f.name].filter(h => h).join('|')}
                </Option>))
                }
              </Select>)}
            </FormItem>,
            <FormItem label="资料类型" {...formItemLayout}>
              {getFieldDecorator('doc_type', {
                rules: [{ required: true, message: '资料类型必填' }],
                initialValue: data.doc_type,
              })(<Select
                showSearch
                showArrow
                optionFilterProp="children"
                style={{ width: '100%' }}
                placeholder="请选择资料类型"
              >
                {ARCHIVE_TYPE.map(f => (<Option value={f.value} key={f.value}>
                  {f.text}
                </Option>))
                }
              </Select>)}
            </FormItem>,
          ]}
          <FormItem label="文件夹名称" {...formItemLayout}>
            {getFieldDecorator('doc_name', {
              rules: [{ required: true, message: '文件夹名称必填' }],
              initialValue: data.doc_name,
            })(<Input placeholder="文件夹名称必填" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
