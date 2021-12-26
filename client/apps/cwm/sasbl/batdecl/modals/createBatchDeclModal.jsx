import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { message, Form, Select, Modal, Input } from 'antd';
import { showCreateBatDeclModal, createBatchDecl, loadBizApplyInfos } from 'common/reducers/cwmSasblReg';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;

@injectIntl
@connect(
  state => ({
    visible: state.cwmSasblReg.createBatModal.visible,
    supType: state.cwmSasblReg.createBatModal.supType,
    defaultWhse: state.cwmContext.defaultWhse,
    bizApplyInfoList: state.cwmSasblReg.bizApplyInfoList,
  }),
  {
    showCreateBatDeclModal,
    createBatchDecl,
    loadBizApplyInfos,
  }
)
@Form.create()
export default class CreateBatchDeclModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
    owners: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.number })),
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && nextProps.visible !== this.props.visible) {
      this.props.loadBizApplyInfos(this.props.defaultWhse.code);
    }
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.props.showCreateBatDeclModal({ visible: false });
  }
  handleCreateBatchDecl = () => {
    const { form } = this.props;
    const { defaultWhse: { code } } = this.props;
    form.validateFields((error, values) => {
      if (!error) {
        const batchDecl = {
          ioFlag: this.context.router.params.ieType,
          supType: this.props.supType,
          whseCode: code,
          applyNo: values.applyNo,
        };
        this.props.createBatchDecl(batchDecl).then((result) => {
          if (result.error) {
            message.error(result.error.message, 5);
          } else {
            message.info(this.msg('savedSucceed'));
            const link = `/cwm/sasbl/batdecl/${this.context.router.params.supType}/${this.context.router.params.ieType}/${result.data}`;
            this.context.router.push(link);
            this.props.showCreateBatDeclModal({ visible: false });
          }
        });
      }
    });
  }
  render() {
    const {
      form: { getFieldDecorator, getFieldValue }, bizApplyInfoList,
    } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const selApplyNo = getFieldValue('applyNo');
    let ownerName;
    if (selApplyNo) {
      const selBizAppl = bizApplyInfoList.find(blb => blb.bappl_no === selApplyNo);
      if (selBizAppl) {
        ownerName = selBizAppl.owner_name;
      }
    }
    return (
      <Modal
        maskClosable={false}
        title={this.msg('newBatchDecl')}
        onCancel={this.handleCancel}
        onOk={this.handleCreateBatchDecl}
        visible={this.props.visible}
        destroyOnClose
      >
        <Form>
          <FormItem label={this.msg('sasblApplyNo')} {...formItemLayout}>
            {getFieldDecorator('applyNo', {
              rules: [{ required: true, message: this.msg('typeInApplyNoPlease') }],
            })(<Select
              showSearch
              allowClear
              optionFilterProp="children"
            >
              {
                bizApplyInfoList.map(bizAppl => (
                  <Option
                    value={String(bizAppl.bappl_no)}
                    key={String(bizAppl.bappl_no)}
                  >
                    {bizAppl.bappl_no}
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
