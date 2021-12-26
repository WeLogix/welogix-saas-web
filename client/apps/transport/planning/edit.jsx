import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, Row, Col, Form, Layout, Button, message } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import connectFetch from 'client/common/decorators/connect-fetch';
import connectNav from 'client/common/decorators/connect-nav';
import withPrivilege from 'client/common/decorators/withPrivilege';
import { loadForm, loadFormRequire, onFormFieldsChange, setConsignFields } from 'common/reducers/shipment';
import { loadTable, saveEdit } from 'common/reducers/transport-acceptance';
import PageHeader from 'client/components/PageHeader';
import AddLocationModal from 'client/apps/paas/flow/modal/addLocationModal';
import FormPane from 'client/components/FormPane';
import ClientInfo from '../shipment/forms/clientInfo';
import ConsignInfo from '../shipment/forms/consign-info';
import GoodsInfo from '../shipment/forms/goods-info';
import ModeInfo from '../shipment/forms/mode-info';
import CorrelInfo from '../shipment/forms/correlInfo';
import FreightCharge from '../shipment/forms/freightCharge';
import { formatMsg } from './message.i18n';

const { Content } = Layout;

function fetchData({
  state, dispatch, params, cookie,
}) {
  const promises = [];
  const shipmtNo = params.shipmt;
  promises.push(dispatch(loadForm(cookie, {
    tenantId: state.account.tenantId,
    shipmtNo,
  })));
  promises.push(dispatch(loadFormRequire(cookie, state.account.tenantId)));
  return Promise.all(promises);
}

@connectFetch()(fetchData)
@injectIntl
@connect(
  state => ({
    tenantId: state.account.tenantId,
    loginId: state.account.loginId,
    loginName: state.account.username,
    formData: state.shipment.formData,
    submitting: state.transportAcceptance.submitting,
    filters: state.transportAcceptance.table.filters,
    sortField: state.transportAcceptance.table.sortField,
    sortOrder: state.transportAcceptance.table.sortOrder,
    pageSize: state.transportAcceptance.table.shipmentlist.pageSize,
    current: state.transportAcceptance.table.shipmentlist.current,
    formRequireJudgeParams: state.shipment.formRequireJudgeParams, // @Form.create... 这一层使用
    formRequire: state.shipment.formRequire,
  }),
  {
    loadTable, saveEdit, onFormFieldsChange, setConsignFields,
  }
)
@connectNav({
  depth: 3,
  text: props => props.formData.shipmt_no,
  moduleName: 'transport',
  until: props => props.formData.shipmt_no,
  lifecycle: 'componentWillReceiveProps',
})
@withPrivilege({ module: 'transport', feature: 'shipment', action: 'edit' })
@Form.create({ onFieldsChange: (props, fields) => props.onFormFieldsChange(props, fields) })
export default class ShipmentEdit extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    tenantId: PropTypes.number.isRequired,
    sortField: PropTypes.string.isRequired,
    sortOrder: PropTypes.string.isRequired,
    pageSize: PropTypes.number.isRequired,
    current: PropTypes.number.isRequired,
    submitting: PropTypes.bool.isRequired,
    saveEdit: PropTypes.func.isRequired,
    loadTable: PropTypes.func.isRequired,
    setConsignFields: PropTypes.func.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  msg = formatMsg(this.props.intl)
  handleEdit = (ev) => {
    ev.preventDefault();
    this.props.form.validateFields((errors) => {
      if (errors) {
        message.error(this.msg('formError'));
      } else {
        const { formData, tenantId, loginId } = this.props;
        const form = { ...formData, ...this.props.form.getFieldsValue() };
        this.props.saveEdit(form, tenantId, loginId)
          .then((result) => {
            if (result.error) {
              message.error(result.error.message, 10);
            } else {
              message.success(this.msg('shipmtOpSuccess'));
              this.context.router.goBack();
              this.props.loadTable(null, {
                tenantId: this.props.tenantId,
                pageSize: this.props.pageSize,
                currentPage: this.props.current,
                filters: JSON.stringify(this.props.filters),
                sortField: this.props.sortField,
                sortOrder: this.props.sortOrder,
              });
            }
          });
      }
    });
  }
  handleCancel = () => {
    this.context.router.goBack();
  }
  handleAddedLocation = (location) => {
    if (location.type === 0) {
      const consigner =
        this.props.formRequire.consignerLocations.find(item => item.node_id === location.id);
      this.props.setConsignFields({
        consigner_name: consigner.name,
        consigner_byname: consigner.byname,
        consigner_province: consigner.province,
        consigner_city: consigner.city,
        consigner_district: consigner.district,
        consigner_street: consigner.street,
        consigner_region_code: consigner.region_code,
      });
      this.props.form.setFieldsValue({
        consigner_addr: consigner.addr,
        consigner_email: consigner.contact,
        consigner_contact: consigner.mobile,
        consigner_mobile: consigner.email,
      });
    } else if (location.type === 1) {
      const consignee =
        this.props.formRequire.consigneeLocations.find(item => item.node_id === location.id);
      this.props.setConsignFields({
        consignee_name: consignee.name,
        consignee_byname: consignee.byname,
        consignee_province: consignee.province,
        consignee_city: consignee.city,
        consignee_district: consignee.district,
        consignee_street: consignee.street,
        consignee_region_code: consignee.region_code,
      });
      this.props.form.setFieldsValue({
        consignee_addr: consignee.addr,
        consignee_email: consignee.contact,
        consignee_contact: consignee.mobile,
        consignee_mobile: consignee.email,
      });
    }
  }
  render() {
    const { intl, submitting, form } = this.props;
    return (
      <Layout>
        <PageHeader breadcrumb={[this.msg('planning'), this.msg('shipmtEdit')]}>
          <PageHeader.Actions>
            <Button type="ghost" onClick={this.handleCancel}>
              {this.msg('cancel')}
            </Button>
            <Button type="primary" loading={submitting} onClick={this.handleEdit}>
              {this.msg('save')}
            </Button>
          </PageHeader.Actions>
        </PageHeader>
        <Content className="page-content">
          <FormPane layout="vertical">
            <Row gutter={16}>
              <Col sm={24} md={18}>
                <Card bodyStyle={{ padding: 16, paddingBottom: 0 }}>
                  <ClientInfo outerColSpan={16} intl={intl} formhoc={form} />
                </Card>
                <Row gutter={16}>
                  <Col span={12}>
                    <Card bodyStyle={{ padding: 16, paddingBottom: 0 }}>
                      <ConsignInfo
                        type="consigner"
                        intl={intl}
                        outerColSpan={16}
                        labelColSpan={8}
                        formhoc={form}
                      />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card bodyStyle={{ padding: 16, paddingBottom: 0 }}>
                      <ConsignInfo
                        type="consignee"
                        intl={intl}
                        outerColSpan={16}
                        labelColSpan={8}
                        formhoc={form}
                      />
                    </Card>
                  </Col>
                </Row>
                <Card bodyStyle={{ padding: 16, paddingBottom: 0 }}>
                  <ModeInfo intl={intl} formhoc={form} />
                </Card>
                <Card bodyStyle={{ padding: 16 }}>
                  <GoodsInfo intl={intl} labelColSpan={8} formhoc={form} />
                </Card>
              </Col>
              <Col sm={24} md={6}>
                <FreightCharge formhoc={form} intl={this.props.intl} />
                <Card bodyStyle={{ padding: 16 }}>
                  <CorrelInfo formhoc={form} intl={intl} />
                </Card>
              </Col>
            </Row>
          </FormPane>
          <AddLocationModal onOk={this.handleAddedLocation} />
        </Content>
      </Layout>
    );
  }
}
