import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Form, message, Modal, Select, Radio, Input } from 'antd';
import { showCreateBookModal, createBook } from 'common/reducers/ptsBook';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

@injectIntl
@connect(
  state => ({
    tenantName: state.account.tenantName,
    visible: state.ptsBook.createBookModal.visible,
    partners: state.partner.partners,
  }),
  {
    showCreateBookModal,
    createBook,
  }
)
@Form.create()
export default class CreatePTBookModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  msg = formatMsg(this.props.intl);
  handleOk = () => {
    const { form } = this.props;
    form.validateFields((error, values) => {
      if (!error) {
        const book = {
          partner_id: values.partnerId,
          book_type: values.book_type === 'manualBook' ? 'EML' : 'EMS',
          book_no: values.create_kind === 'unRegistBook' ? '' : values.book_no,
        };
        this.props.createBook(book).then((result) => {
          if (result.error) {
            message.error(result.error.message, 10);
          } else {
            this.handleCancel();
            this.context.router.push(`/pts/ptbook/${result.data.id}`);
          }
        });
      }
    });
  }
  handleCancel = () => {
    this.props.showCreateBookModal(false);
  }
  render() {
    const {
      form: { getFieldDecorator },
      form, partners,
      tenantName,
    } = this.props;
    const tenant = [{
      id: 'OWN',
      name: tenantName,
    }];
    const ownerList = tenant.concat(partners || []);
    const createKind = form.getFieldValue('create_kind') || 'unRegistBook';
    const bookType = form.getFieldValue('book_type') || null;
    return (
      <Modal
        maskClosable={false}
        title={this.msg('createBook')}
        onCancel={this.handleCancel}
        onOk={this.handleOk}
        visible={this.props.visible}
        destroyOnClose
      >
        <Form>
          <FormItem wrapperCol={{ span: 18, offset: 6 }} >
            {getFieldDecorator('book_type', {
              rules: [{ required: true, message: '创建类型必填' }],
            })(<RadioGroup buttonStyle="solid">
              <RadioButton value="manualBook" key="manualBook" >{this.msg('createManualBook')}</RadioButton>
              <RadioButton value="eBook" key="eBook" >{this.msg('createEBook')}</RadioButton>
            </RadioGroup>)}
          </FormItem>
          {bookType && <div>
            <FormItem label={this.msg('bookStatus')} {...formItemLayout}>
              {getFieldDecorator('create_kind', {
                rules: [{ required: true, message: '是否备案必填' }],
                initialValue: 'unRegistBook',
              })(<RadioGroup>
                <RadioButton value="unRegistBook" key="unRegistBook" >{this.msg('unReg')}</RadioButton>
                <RadioButton value="registBook" key="registBook" >{this.msg('registed')}</RadioButton>
              </RadioGroup>)}
            </FormItem>
            <FormItem label={this.msg('ownerName')} {...formItemLayout}>
              {getFieldDecorator('partnerId', {
                rules: [{ required: true, message: '经营单位必选' }],
              })(<Select
                showSearch
                showArrow
                optionFilterProp="children"
                style={{ width: '100%' }}
              >
                {
                  ownerList.map(or => (
                    <Option
                      value={String(or.id)}
                      key={String(or.id)}
                    >{[or.partner_code, or.name].filter(orp => orp).join('|')}
                    </Option>))
                }
              </Select>)}
            </FormItem>
            <FormItem label={bookType === 'eBook' ? this.msg('eBookNo') : this.msg('manualBookNo')} {...formItemLayout}>
              {getFieldDecorator('book_no', {
                rules: [{ required: createKind === 'registBook', message: '编号必填', len: 12 }],
              })(<Input disabled={createKind !== 'registBook'} />)}
            </FormItem></div>}
        </Form>
      </Modal>
    );
  }
}
