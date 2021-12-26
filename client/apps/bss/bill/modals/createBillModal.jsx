import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { Col, Form, Modal, message, Select, Radio, DatePicker, Input } from 'antd';
import { toggleNewBillModal, createBill } from 'common/reducers/bssBill';
import { loadPartnerFlowList } from 'common/reducers/scofFlow';
import { loadAllBillTemplates } from 'common/reducers/bssBillTemplate';
import { BSS_BILL_CATEGORY, PARTNER_ROLES } from 'common/constants';
import { formatMsg } from '../message.i18n';


const { Option } = Select;
const FormItem = Form.Item;
const { MonthPicker } = DatePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

@injectIntl
@connect(
  state => ({
    visible: state.bssBill.createBillModal.visible,
    statements: state.bssBill.createBillModal.statements,
    byStatements: state.bssBill.createBillModal.byStatements,
    partners: state.partner.partners,
    allBillTemplates: state.bssBillTemplate.billTemplates,
    flows: state.scofFlow.partnerFlows,
  }),
  {
    toggleNewBillModal, createBill, loadAllBillTemplates, loadPartnerFlowList,
  }
)
@Form.create()
export default class CreateBillModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    partners: [],
    partnerLabel: '客户',
    billTemplates: [],
    templateTitle: '',
    beginDate: new Date(),
    endDate: new Date(),
  }
  componentDidMount() {
    this.props.loadAllBillTemplates();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible !== this.props.visible && nextProps.visible) {
      /*
      const firstDay = new Date();
      const month = firstDay.getMonth();
      firstDay.setMonth(month, 1);
      firstDay.setHours(0, 0, 1, 1);
      const endDay = new Date();
      endDay.setMonth(month + 1);
      endDay.setDate(0);
      endDay.setHours(23, 59, 59, 999);
      this.setState({ beginDate: firstDay, endDate: endDay });
      */
    }
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.props.toggleNewBillModal(false, {});
  }
  handleMonthChange = (date, dateString) => {
    const { setFieldsValue } = this.props.form;
    const firstDay = date.toDate();
    const month = firstDay.getMonth();
    firstDay.setMonth(month, 1);
    firstDay.setHours(0, 0, 1);
    const endDay = date.toDate();
    endDay.setMonth(month + 1);
    endDay.setDate(0);
    endDay.setHours(23, 59, 59);
    this.setState({ beginDate: firstDay, endDate: endDay });
    setFieldsValue({ bill_title: `${this.state.templateTitle}-${dateString}` });
  }
  handleOk = () => {
    this.props.form.validateFields((errors) => {
      if (!errors) {
        const { beginDate, endDate } = this.state;
        const begin = moment(beginDate).format('YYYY-MM-DD HH:mm:ss');
        const end = moment(endDate).format('YYYY-MM-DD HH:mm:ss');
        const formVal = this.props.form.getFieldsValue();
        const templateId = Number.isNaN(formVal.template_id) ? null : Number(formVal.template_id);
        this.props.createBill({
          bill_title: formVal.bill_title,
          bill_type: formVal.bill_type,
          template_id: templateId,
          partner_id: Number(formVal.partner_id),
          flow_ids: formVal.flow_id,
          statements: this.props.statements,
          byStatements: this.props.byStatements,
          start_date: begin,
          end_date: end,
          bill_date: formVal.bill_date,
        }).then((result) => {
          if (result.error) {
            message.error(result.error.message, 5);
          } else {
            const billNo = result.data.bill_no;
            this.props.toggleNewBillModal(false, {});
            this.context.router.push(`/bss/bill/${billNo}`);
          }
        });
      }
    });
  }
  handleTypeSelect = (ev) => {
    this.props.form.setFieldsValue({
      partner_id: null,
      template_id: null,
    });
    this.setState({ billTemplates: [] });
    const billType = ev.target.value;
    if (billType === 'buyerBill') {
      const client = this.props.partners.filter(pt => pt.role === PARTNER_ROLES.CUS);
      this.setState({ partners: client, partnerLabel: this.msg('customer') });
    } else if (billType === 'sellerBill') {
      const service = this.props.partners.filter(pt => pt.role === PARTNER_ROLES.VEN);
      this.setState({ partners: service, partnerLabel: this.msg('vendor') });
    }
  }
  handleTemplSelect = (value, option) => {
    this.setState({ templateTitle: option.props.title });
  }
  handlePartnerChange = (value) => {
    const { setFieldsValue, getFieldValue } = this.props.form;
    setFieldsValue({ template_id: null, bill_duration: null, bill_title: null });
    const templates = this.props.allBillTemplates.filter(tp =>
      (tp.settle_partner_id === Number(value) || tp.settle_partner_id === null));
    const billType = getFieldValue('bill_type');
    if (billType === 'buyerBill') {
      this.props.loadPartnerFlowList({ partnerId: value });
    }
    this.setState({ billTemplates: templates });
  }
  render() {
    const {
      visible, form: { getFieldDecorator }, flows, byStatements,
    } = this.props;
    const {
      partners, billTemplates,
    } = this.state;
    const billType = this.props.form.getFieldValue('bill_type');
    return (
      <Modal
        maskClosable={false}
        title={this.msg('createBill')}
        visible={visible}
        onOk={this.handleOk}
        okButtonProps={{ disabled: billType === undefined }}
        onCancel={this.handleCancel}
        destroyOnClose
      >
        <Form>
          <FormItem wrapperCol={{ span: 14, offset: 6 }}>
            {getFieldDecorator('bill_type', {
              rules: [{ required: true, message: this.msg('pleaseSelectBillType') }],
            })(<RadioGroup onChange={this.handleTypeSelect}>
              {
                BSS_BILL_CATEGORY.map(qt =>
                  <RadioButton value={qt.key} key={qt.key}>{qt.text}</RadioButton>)
              }
            </RadioGroup>)}
          </FormItem>
          {billType && <FormItem label={this.state.partnerLabel} {...formItemLayout}>
            {getFieldDecorator('partner_id', {
              rules: [{ required: true, message: this.msg('pleaseSelectPartner') }],
            })(<Select
              showSearch
              showArrow
              optionFilterProp="children"
              style={{ width: '100%' }}
              onChange={this.handlePartnerChange}
            >
              { partners.map(pt => (
                <Option
                  value={String(pt.id)}
                  key={String(pt.id)}
                >{pt.partner_code ? `${pt.partner_code} | ${pt.name}` : pt.name}
                </Option>))
              }
            </Select>)}
          </FormItem>}
          {billType === 'buyerBill' && !byStatements && <FormItem label={this.msg('flow')} {...formItemLayout}>
            {getFieldDecorator('flow_id', {})(<Select
              showSearch
              optionFilterProp="children"
              mode="multiple"
              style={{ width: '100%' }}
            >
              {flows.map(data =>
                <Option key={data.id} value={data.id}>{data.name}</Option>)}
            </Select>)}
          </FormItem>}
          <FormItem label={this.msg('billTemplates')} {...formItemLayout} >
            {getFieldDecorator('template_id', {
              rules: [{ required: true, message: this.msg('pleaseSelectBillTemplate') }],
            })(<Select
              showSearch
              optionFilterProp="children"
              disabled={billType === undefined}
              onSelect={this.handleTemplSelect}
            >
              {billTemplates.map(data => (
                <Option key={String(data.id)} value={String(data.id)} title={data.name}>
                  {data.name}
                </Option>))}
            </Select>)}
          </FormItem>
          {!byStatements &&
            <FormItem key="bill_date" label={this.msg('billDuration')} {...formItemLayout}>
              <Col span={14}>
                {getFieldDecorator('bill_duration', {
                rules: [{ required: true }],
              })(<MonthPicker
                onChange={this.handleMonthChange}
              />)}
              </Col>
              <Col span={10}>
                {getFieldDecorator('bill_date', {
                rules: [{ required: true, message: this.msg('pleaseSelectBillDate') }],
                initialValue: 'settledDate',
              })(<Select>
                <Option value="createdDate" key="createdDate">{this.msg('byOrderDate')}</Option>
                <Option value="settledDate" key="settledDate">{this.msg('byClosedDate')}</Option>
              </Select>)}
              </Col>
            </FormItem>}
          <FormItem label={this.msg('billName')} {...formItemLayout} >
            {getFieldDecorator('bill_title', {
              rules: [{ required: true, message: this.msg('pleaseInputBillName') }],
            })(<Input />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
