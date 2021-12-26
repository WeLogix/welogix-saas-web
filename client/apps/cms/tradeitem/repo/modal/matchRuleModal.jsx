import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Form, Modal, Select, Checkbox, Switch } from 'antd';
import { toggleMatchRuleModal, updateRepoInfo } from 'common/reducers/cmsTradeitem';
import { formatMsg } from '../../message.i18n';

const { Option } = Select;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

const repoRuleMatchDefault = {
  exact_keys: ['cop_product_no'],
  suggest: false,
  suggest_key: null,
};

@injectIntl
@connect(
  state => ({
    matchRuleModal: state.cmsTradeitem.matchRuleModal,
  }),
  {
    toggleMatchRuleModal, updateRepoInfo,
  }
)
@Form.create()
export default class MatchRuleModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    matchRuleModal: PropTypes.shape({ visible: PropTypes.bool.isRequired }),
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.matchRuleModal !== this.props.matchRuleModal) {
      this.props.form.resetFields();
    }
  }
  msg = formatMsg(this.props.intl)
  handleCheckChange = (checked) => {
    if (!checked) {
      this.props.form.setFieldsValue({ suggest_key: null });
    }
  }
  handleCancel = () => {
    this.props.toggleMatchRuleModal(false);
  }
  handleOk = () => {
    const { matchRuleModal: { repo }, form } = this.props;
    form.validateFields((errors, values) => {
      if (!errors) {
        this.props.updateRepoInfo(repo.id, { match_rule: JSON.stringify(values) });
        this.props.toggleMatchRuleModal(false);
      }
    });
  }
  render() {
    const {
      form: { getFieldDecorator, getFieldValue }, matchRuleModal: { visible, repo },
    } = this.props;
    const repoRuleMatch = (repo.match_rule && JSON.parse(repo.match_rule)) || repoRuleMatchDefault;
    return (
      <Modal
        title={this.msg('comparisonRule')}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form layout="vertical">
          <FormItem label={this.msg('repoRuleExactMatch')} >
            {getFieldDecorator('exact_keys', {
              initialValue: repoRuleMatch.exact_keys,
              rules: [{ required: true, message: '精确匹配应至少选择一项' }],
            })(<CheckboxGroup options={[{ value: 'cop_product_no', label: this.msg('copProductNo') },
              { value: 'cop_code', label: this.msg('copCode') },
              { value: 'cop_item_group', label: this.msg('copItemGroup') }]}
            />)}
          </FormItem>
          <FormItem label={this.msg('repoRuleFuzzyMatch')}>
            {getFieldDecorator('suggest', {
              initialValue: repoRuleMatch.suggest, valuePropName: 'checked',
            })(<Switch onChange={this.handleCheckChange} />)}
          </FormItem>
          <FormItem label={this.msg('repoMatchSuggestKey')}>
            {getFieldDecorator('suggest_key', {
              initialValue: repoRuleMatch.suggest_key,
              rules: [{ required: getFieldValue('suggest'), message: '请选择模糊匹配项' }],
             })(<Select disabled={!getFieldValue('suggest')}>
               <Option value="cop_product_no" key="cop_product_no">{this.msg('copProductNo')}</Option>
               <Option value="cop_product_name" key="cop_product_name">{this.msg('copProductName')}</Option>
             </Select>)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

