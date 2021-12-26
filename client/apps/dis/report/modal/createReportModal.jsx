import React from 'react';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Modal, Tree, Form, Input, message, Select } from 'antd';
import { toggleReportCreateModal, createReport, loadReportCategories } from 'common/reducers/disReport';
import { formatMsg } from '../message.i18n';

const { Option } = Select;
const { TreeNode } = Tree;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

@injectIntl
@connect(
  state => ({
    visible: state.disReport.createReportModal.visible,
    categoryList: state.disReport.categoryList,
  }),
  {
    toggleReportCreateModal, createReport, loadReportCategories,
  }
)
@Form.create()
export default class createReportModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  state = {
    dwSubject: 'DWD_GLOBAL',
    checkedKeys: [],
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && !this.props.visible) {
      this.props.loadReportCategories();
    }
  }
  msg = formatMsg(this.props.intl)
  DWDGlobalTree = [{
    title: this.msg('bizObjectCommInv'),
    key: 'GD_COMMINV',
    children: [{
      title: this.msg('bizObjectGlobalDetail'),
      key: 'GD_TRADING',
      parentKey: 'GD_COMMINV',
    }, {
      title: this.msg('bizObjectShipment'),
      key: 'GD_SHIPMENT',
      parentKey: 'GD_COMMINV',
      children: [{
        title: this.msg('bizObjectGdCus'),
        key: 'GD_CUSDECL',
        parentKey: 'GD_SHIPMENT',
      }, {
        title: this.msg('bizObjectGdCusItem'),
        key: 'GD_CUSDECLITEM',
        parentKey: 'GD_SHIPMENT',
        children: [{
          title: this.msg('bizObjectGdAlcTax'),
          key: 'GD_ALCTAX',
          parentKey: 'GD_CUSDECLITEM',
        }, {
          title: this.msg('bizObjectGdAlcFee'),
          key: 'GD_ALCFEE',
          parentKey: 'GD_CUSDECLITEM',
        }],
      }, {
        title: this.msg('bizObjectGdIo'),
        key: 'GD_IOBOUND',
        parentKey: 'GD_SHIPMENT',
      }],
    }],
  }]
  DWDCdsTree = [{
    title: this.msg('bizObjectCustomsDecl'),
    key: 'CDS',
    children: [{
      title: this.msg('bizObjectCustomsDeclDetail'),
      key: 'CDSDETAIL',
      parentKey: 'CDS',
    }, {
      title: this.msg('bizObjectCdsTax'),
      key: 'CDSTAX',
      parentKey: 'CDS',
    }],
  }]
  handleDwSubjectChange = (dwSubject) => {
    this.setState({ dwSubject });
  }
  handleCheck = (checkedInfo) => {
    /*
    if (checkedInfo.checked.length > 3) {
      message.info('最多只能选择3个业务对象');
      return;
    }
    if (!e.checked && e.node.props.children) {
      if (e.node.props.children.find(item => checkedInfo.checked.indexOf(item.key) !== -1)) {
        return;
      }
    }
    */
    this.setState({ checkedKeys: checkedInfo.checked });
  }
  handleCancel = () => {
    this.props.toggleReportCreateModal(false);
    this.setState({
      checkedKeys: [],
    });
  }
  handleCreateOk = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        const { checkedKeys, dwSubject } = this.state;
        if (checkedKeys.length === 0) {
          message.info(this.msg('reportObjectShouldNotBeEmpty'));
          return;
        }
        this.props.createReport({
          rptObject: checkedKeys,
          rptCategoryId: values.rpt_category_id,
          rptName: values.rpt_name,
          rptDesc: values.rpt_desc,
          rptSubject: dwSubject,
        }).then((result) => {
          if (!result.error) {
            this.handleCancel();
          }
        });
      }
    });
  }
  renderTreeNodes = treeNodes => treeNodes.map((item) => {
    /*
    const { checkedKeys } = this.state;
    const subTreeNodeKeys = ['GLOBALDETAIL', 'DELEGATION', 'ASN', 'SO'];
    let disabled = true;
    if (checkedKeys.indexOf(item.key) !== -1) {
      disabled = false;
    } else if (!item.parentKey) {
      disabled = false;
    } else if (checkedKeys.indexOf(item.parentKey) !== -1) {
      disabled = false;
    } else if (subTreeNodeKeys.indexOf(item.key) !== -1 && checkedKeys.length === 0) {
      disabled = false;
    }
    */
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode {...item} />;
  });
  render() {
    const {
      visible, form: { getFieldDecorator }, categoryList,
    } = this.props;
    const { dwSubject } = this.state;
    let reportTreeData;
    if (dwSubject === 'DWD_GLOBAL') {
      reportTreeData = this.DWDGlobalTree;
    } else if (dwSubject === 'DWD_CDS') {
      reportTreeData = this.DWDCdsTree;
    }
    return (
      <Modal
        title={this.msg('createReport')}
        onOk={this.handleCreateOk}
        onCancel={this.handleCancel}
        visible={visible}
        destroyOnClose
      >
        <Form>
          <FormItem label={this.msg('reportCategory')} {...formItemLayout} key="cat">
            {getFieldDecorator('rpt_category_id', {
              })(<Select allowClear showSearch>
                {categoryList.map(category => (
                  <Option key={String(category.id)} value={category.id}>{category.rpt_category_name}
                  </Option>))}
              </Select>)}
          </FormItem>
          <FormItem label={this.msg('reportName')} {...formItemLayout}>
            {getFieldDecorator('rpt_name', {
              rules: [{ required: true, message: this.msg('reportNameShouldNotBeEmpty') }],
              initialValue: '',
            })(<Input />)}
          </FormItem>
          <FormItem label={this.msg('rptDwSubject')} {...formItemLayout} key="subject">
            <Select showSearch onChange={this.handleDwSubjectChange} value={dwSubject}>
              <Option key="dwdglobal" value="DWD_GLOBAL">进出口料号级明细</Option>
              <Option key="dwdcds" value="DWD_CDS">报关单项号级明细</Option>
            </Select>
          </FormItem>
          <FormItem label={this.msg('selectBizObject')} {...formItemLayout} required key="obj">
            <Tree
              checkable
              checkStrictly
              checkedKeys={this.state.checkedKeys}
              defaultExpandAll
              onCheck={this.handleCheck}
            >
              {this.renderTreeNodes(reportTreeData)}
            </Tree>
          </FormItem>
        </Form>
      </Modal>);
  }
}
