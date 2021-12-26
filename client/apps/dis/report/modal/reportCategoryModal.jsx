import React from 'react';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Modal, Form, Icon, Input, Select, Tag, message } from 'antd';
import { createReportCategory, toggleReportCatCreateModal, loadReportCategories, changeReportCategory, renameCategory, renameReport } from 'common/reducers/disReport';
import { formatMsg } from '../message.i18n';

const { Option } = Select;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

@injectIntl
@connect(
  state => ({
    visible: state.disReport.createReportCatModal.visible,
    mode: state.disReport.createReportCatModal.mode,
    rptInfo: state.disReport.createReportCatModal.rptInfo,
    categoryList: state.disReport.categoryList,
  }),
  {
    createReportCategory,
    toggleReportCatCreateModal,
    loadReportCategories,
    changeReportCategory,
    renameCategory,
    renameReport,
  }
)
@Form.create()
export default class ReportCategoryModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  componentWillReceiveProps(nextProps) {
    const { mode, visible } = nextProps;
    if (visible && !this.props.visible && mode === 'change') {
      this.props.loadReportCategories();
    }
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.props.toggleReportCatCreateModal(false);
  }
  handleCreateOk = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        this.props.createReportCategory(values.rpt_category_name)
          .then((result) => {
            if (!result.error) {
              this.handleCancel();
            }
          });
      }
    });
  }
  handleChangeOk = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        const { rptInfo } = this.props;
        const rptIds = rptInfo.rptObjs
          .filter(rptObj => rptObj.rpt_category_id !== values.rpt_category_id)
          .map(rptObj => rptObj.id);
        if (rptIds.length === 0) {
          message.error('报表已归在目标分类');
          return;
        }
        this.props.changeReportCategory(rptIds, values.rpt_category_id)
          .then((result) => {
            if (!result.error) {
              this.handleCancel();
            }
          });
      }
    });
  }
  handleRenameCategory = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        const { categoryId } = this.props.rptInfo;
        this.props.renameCategory(Math.abs(categoryId), values.rpt_category_name)
          .then((result) => {
            if (!result.error) {
              message.info(this.msg('opSucceed'));
              this.handleCancel();
            }
          });
      }
    });
  }
  handleRenameRpt = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        const { rptId } = this.props.rptInfo;
        this.props.renameReport(rptId, values.rpt_name)
          .then((result) => {
            if (!result.error) {
              this.handleCancel();
            }
          });
      }
    });
  }
  render() {
    const {
      visible, form: { getFieldDecorator }, mode, rptInfo, categoryList,
    } = this.props;
    let title = '';
    let onOk;
    switch (mode) {
      case 'change':
        title = this.msg('moveToCategory');
        onOk = this.handleChangeOk;
        break;
      case 'rename':
        title = this.msg('renameCategory');
        onOk = this.handleRenameCategory;
        break;
      case 'renameRpt':
        title = this.msg('renameReport');
        onOk = this.handleRenameRpt;
        break;
      default: // create
        title = this.msg('createCategory');
        onOk = this.handleCreateOk;
        break;
    }
    return (
      <Modal
        title={title}
        onOk={onOk}
        onCancel={this.handleCancel}
        visible={visible}
        destroyOnClose
      >
        <Form>
          {mode === 'change' &&
            <FormItem label={this.msg('reportCategory')} {...formItemLayout}>
              {getFieldDecorator('rpt_category_id', { initialValue: rptInfo && rptInfo.catId })(<Select >
                {categoryList.map(category => (
                  <Option key={String(category.id)} value={category.id}>
                    <Icon type="folder" theme="twoTone" twoToneColor="#52c41a" /> {category.rpt_category_name}
                  </Option>))}
                <Option value={null}><Tag color="#ccc">{this.msg('noCategory')}</Tag></Option>
              </Select>)}
            </FormItem>}
          {(mode === 'rename' || mode === 'create') && <FormItem label={this.msg('reportCategoryName')} {...formItemLayout}>
            {getFieldDecorator('rpt_category_name', {
              rules: [{ required: true, message: this.msg('pleaseInputReportCategoryName') }],
              initialValue: (rptInfo && rptInfo.oldCatName) ? rptInfo.oldCatName : '',
            })(<Input />)}
          </FormItem>}
          {mode === 'renameRpt' && <FormItem label={this.msg('reportName')} {...formItemLayout}>
            {getFieldDecorator('rpt_name', {
              rules: [{ required: true, message: this.msg('reportNameShouldNotBeEmpty') }],
              initialValue: rptInfo.oldRptName,
            })(<Input />)}
          </FormItem>}
        </Form>
      </Modal>
    );
  }
}
