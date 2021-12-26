import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Form, message, Modal, Select, Radio, Input } from 'antd';
import { showCreateBookModal, createBlBook } from 'common/reducers/cwmBlBook';
import { loadPartners } from 'common/reducers/partner';
import { BLBOOK_TYPE, PARTNER_ROLES } from 'common/constants';
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
    visible: state.cwmBlBook.createBookModal.visible,
    defaultWhse: state.cwmContext.defaultWhse,
    owners: state.cwmContext.whseAttrs.owners,
    account: state.account,
    partners: state.partner.partners,
  }),
  {
    showCreateBookModal,
    createBlBook,
    loadPartners,
  }
)
@Form.create()
export default class CreateBLBookModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
    owners: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.number })),
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    this.props.loadPartners({
      role: PARTNER_ROLES.VEN,
    });
  }
  msg = formatMsg(this.props.intl);
  handleOk = () => {
    const { form } = this.props;
    form.validateFields((error, values) => {
      if (!error) {
        const blbook = {
          partner_id: values.partnerId,
          blbook_type: values.blbook_type,
          blbook_no: values.create_kind === 'unRegistBook' ? '' : values.blbook_no,
          whse_code: this.props.defaultWhse.code,
        };
        this.props.createBlBook(blbook).then((result) => {
          if (result.error) {
            message.error(result.error.message, 10);
          } else {
            this.handleCancel();
            this.context.router.push(`/cwm/blbook/${result.data.id}`);
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
      form, owners,
      defaultWhse,
      partners,
    } = this.props;
    const whseOperat = partners.find(pt => pt.id === defaultWhse.whse_oper_partnerid);
    const ownerList = whseOperat ? [{
      id: 'OWN',
      name: whseOperat.name,
    }].concat(owners || []) : (owners || []);
    const createKind = form.getFieldValue('create_kind') || 'unRegistBook';
    return (
      <Modal
        maskClosable={false}
        title={this.msg('createBlbook')}
        onCancel={this.handleCancel}
        onOk={this.handleOk}
        visible={this.props.visible}
        destroyOnClose
      >
        <Form>
          <FormItem wrapperCol={{ span: 18, offset: 6 }} >
            {getFieldDecorator('create_kind', {
              rules: [{ required: true }],
              initialValue: 'unRegistBook',
            })(<RadioGroup buttonStyle="solid">
              <RadioButton value="unRegistBook" key="unRegistBook" >{this.msg('createUnRegistBook')}</RadioButton>
              <RadioButton value="registBook" key="registBook" >{this.msg('createRegistBook')}</RadioButton>
            </RadioGroup>)}
          </FormItem>
          <FormItem label={this.msg('owner')} {...formItemLayout}>
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
          <FormItem label={this.msg('blbookNo')} {...formItemLayout}>
            {getFieldDecorator('blbook_no', {
              rules: [{ required: createKind === 'registBook', type: 'string', len: 12 }],
            })(<Input disabled={createKind !== 'registBook'} />)}
          </FormItem>
          <FormItem label={this.msg('blbookType')} {...formItemLayout}>
            {getFieldDecorator('blbook_type', {
              rules: [{ required: true, message: '账册类型必选', type: 'string' }],
            })(<Select allowClear>
              {
                BLBOOK_TYPE.map(bk =>
                  <Option value={bk.value} key={bk.value}>{bk.text}</Option>)
              }
            </Select>)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
