import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Form, Row, Col, Select } from 'antd';
import { setClientForm, loadFlowNodeData } from 'common/reducers/sofOrders';
import { uuidWithoutDash } from 'client/common/uuid';
import { getBlBookNosByType } from 'common/reducers/cwmBlBook';
import FormPane from 'client/components/FormPane';
import { format } from 'client/common/i18n/helpers';
import messages from '../message.i18n';

const formatMsg = format(messages);
const FormItem = Form.Item;
const { Option } = Select;

@injectIntl
@connect(
  state => ({
    bookList: state.cwmBlBook.blBooksByType,
    partners: state.partner.partners,
  }),
  { setClientForm, loadFlowNodeData, getBlBookNosByType }
)
export default class PtsImpExpForm extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    index: PropTypes.number.isRequired,
    operation: PropTypes.oneOf(['view', 'edit', 'create']),
    formData: PropTypes.shape({
      node: PropTypes.shape({ node_uuid: PropTypes.string }),
    }).isRequired,
    partners: PropTypes.arrayOf().isRequired,
    bookList: PropTypes.arrayOf().isRequired,
    disabled: PropTypes.bool.isRequired,
  }
  componentDidMount() {
    const { formData } = this.props;
    const { node } = formData;
    this.props.getBlBookNosByType(null, ['EML', 'EMS']);
    if (!node.uuid && node.node_uuid) {
      this.props.loadFlowNodeData(node.node_uuid, node.kind).then((result) => {
        if (!result.error) {
          this.handleSetClientForm({
            ...result.data,
            uuid: uuidWithoutDash(),
            bizObjNeedLoad: false,
          });
        }
      });
    }
  }
  msg = key => formatMsg(this.props.intl, key)
  handleSetClientForm = (data) => {
    const { index, formData } = this.props;
    const newData = { ...formData, node: { ...formData.node, ...data } };
    this.props.setClientForm(index, newData);
  }
  handleOwnerSelect = (value) => {
    this.handleSetClientForm({ owner_partner_id: value || null, book_no: null });
  }
  handleBookSelect = (value) => {
    this.handleSetClientForm({ book_no: value || null });
  }

  render() {
    const {
      formData, disabled, partners,
    } = this.props;
    const { node } = formData;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      colon: false,
    };
    const bookList = node.owner_partner_id ? this.props.bookList.filter(bk =>
      bk.owner_partner_id === node.owner_partner_id) : this.props.bookList;
    return (
      <FormPane descendant>
        <Row>
          <Col span={6}>
            <FormItem label={this.msg('owner')} {...formItemLayout}>
              <Select
                showSearch
                allowClear
                optionFilterProp="children"
                onChange={this.handleOwnerSelect}
                value={node.owner_partner_id}
                disabled={disabled}
              >
                {partners.map(pt =>
                  <Option key={pt.id} value={pt.id}>{pt.id}|{pt.name}</Option>)}
              </Select>
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label={this.msg('bookNo')} {...formItemLayout}>
              <Select
                showSearch
                allowClear
                optionFilterProp="children"
                value={node.book_no}
                onChange={this.handleBookSelect}
                disabled={disabled}
              >
                {bookList.map(bk => (
                  <Option key={bk.blbook_no} value={bk.blbook_no}>
                    {bk.blbook_type}|{bk.blbook_no}</Option>)) }
              </Select>
            </FormItem>
          </Col>
        </Row>
      </FormPane>
    );
  }
}

