import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { message, Form, Select, Modal, Input } from 'antd';
import { showCreateBizApplModal, createBizAppl } from 'common/reducers/cwmSasblReg';
import { loadRegisteredBlBooks } from 'common/reducers/cwmBlBook';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;

@injectIntl
@connect(
  state => ({
    visible: state.cwmSasblReg.createBizApplModal.visible,
    defaultWhse: state.cwmContext.defaultWhse,
    blBooks: state.cwmBlBook.registeredBlBookList,
  }),
  {
    showCreateBizApplModal,
    createBizAppl,
    loadRegisteredBlBooks,
  }
)
@Form.create()
export default class CreateBizApplModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && nextProps.visible !== this.props.visible) {
      this.props.loadRegisteredBlBooks(this.props.defaultWhse.code);
    }
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.props.showCreateBizApplModal({ visible: false });
  }
  handleCreateBizAppl = () => {
    const { form } = this.props;
    const { defaultWhse: { code } } = this.props;
    form.validateFields((error, values) => {
      if (!error) {
        const bizAppl = {
          ioFlag: this.context.router.params.ieType,
          supType: this.context.router.params.supType,
          whseCode: code,
          blBookNo: values.blBookNo,
        };
        this.props.createBizAppl(bizAppl).then((result) => {
          if (result.error) {
            message.error(result.error.message, 5);
          } else {
            message.info(this.msg('savedSucceed'));
            const link = `/cwm/sasbl/bizappl/${this.context.router.params.supType}/${this.context.router.params.ieType}/${result.data}`;
            this.context.router.push(link);
            this.props.showCreateBizApplModal({ visible: false });
          }
        });
      }
    });
  }
  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { blBooks } = this.props;
    const selBookNo = getFieldValue('blBookNo');
    let ownerName;
    if (selBookNo) {
      const selBlBook = blBooks.find(blb => blb.blbook_no === selBookNo);
      if (selBlBook) {
        ownerName = selBlBook.owner_name;
      }
    }
    return (
      <Modal
        maskClosable={false}
        title={this.msg('newBizAppl')}
        onCancel={this.handleCancel}
        onOk={this.handleCreateBizAppl}
        visible={this.props.visible}
        destroyOnClose
      >
        <Form>
          <FormItem label={this.msg('blBook')} {...formItemLayout}>
            {getFieldDecorator('blBookNo', {
              rules: [{ required: true, message: this.msg('请选择物流账册') }],
            })(<Select
              showSearch
              allowClear
              optionFilterProp="children"
            >
              {
                blBooks.map(book => (
                  <Option
                    value={String(book.blbook_no)}
                    key={String(book.blbook_no)}
                  >
                    {book.blbook_no}
                  </Option>))
              }
            </Select>)}
          </FormItem>
          <FormItem label={this.msg('owner')} {...formItemLayout}>
            <Input disabled value={ownerName} />
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
