import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, Collapse, Divider, Row, Col } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { loadManifestEntity, saveBillHeadLocal } from 'common/reducers/cmsManifest';
import FormPane from 'client/components/FormPane';
import { DECL_TYPE } from 'common/constants';
// import FormInput from '../../../common/form/formInput';
// import FormDatePicker from '../../../common/form/formDatePicker';
import {
  DeclFormContext, EntryType, BillType,
  DeclCustoms, DomesticEntitySelect, OverseaEntitySelect, IEPort, IEDate, DeclDate,
  Transport, Weight, TermConfirm, ContractNo, MarkNo, Remark, ManualNo,
  TradeRemission, Ports, TradeMode, LicenseAndStorage, Fee, CountryRegion, PackCount, PackType,
  CusRemark, RaDeclManulNo, StoreYard,
  CiqOrgs, QualifSpecCorrel, ApplCertUser,
} from '../../../common/form/declFormItems';
import { formatMsg } from '../../message.i18n';

const { Panel } = Collapse;

@injectIntl
@connect(
  state => ({
    formParams: state.saasParams.latest,
    manifestEntity: state.cmsManifest.manifestEntity,
    billHeadFieldsChangeTimes: state.cmsManifest.billHeadFieldsChangeTimes,
    bookList: state.cwmBlBook.blBooksByType,
  }),
  { loadManifestEntity, saveBillHeadLocal }
)
export default class ManifestHeadPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    ietype: PropTypes.oneOf(['import', 'export']).isRequired,
    readonly: PropTypes.bool,
    form: PropTypes.shape({ getFieldDecorator: PropTypes.func.isRequired }).isRequired,
    formData: PropTypes.shape({ bill_seq_no: PropTypes.string }).isRequired,
    billHeadFieldsChangeTimes: PropTypes.number.isRequired,
  }
  componentDidMount() {
    if (!this.props.readonly && this.props.formData.owner_cuspartner_id) {
      this.props.loadManifestEntity(this.props.formData.owner_cuspartner_id);
    }
    // document.addEventListener('keydown', this.handleKeyDown);
  }
  msg = formatMsg(this.props.intl)
  handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      event.stopPropagation();
      event.preventDefault();
      const inputs = document.forms[0].elements;
      for (let i = 0; i < inputs.length; i++) {
        if (i === (inputs.length - 1)) {
          inputs[0].focus();
          inputs[0].select();
          break;
        } else if (event.target === inputs[i]) {
          inputs[i + 1].focus();
          inputs[i + 1].select();
          break;
        }
      }
    } else if (event.keyCode === 8) {
      event.target.select();
    }
  }

  render() {
    const {
      form, readonly, formData, ietype, intl, formParams, manifestEntity, bookList,
    } = this.props;
    if (!formData.bill_seq_no) {
      return null;
    }
    const formProps = {
      disabled: readonly,
      formData,
      required: true,
    };

    const declWayType = DECL_TYPE.filter(dect => dect.key === formData.decl_way_code)[0];
    return (
      <FormPane hideRequiredMark>
        <DeclFormContext.Provider value={{
          ietype,
          intl,
          getFieldDecorator: form.getFieldDecorator,
          getFieldValue: form.getFieldValue,
          setFieldsValue: form.setFieldsValue,
          saveHeadLocal: this.props.saveBillHeadLocal,
          cdfversion: 'v201807',
          nonftz: declWayType ? !declWayType.ftz : false,
          formParams,
          manifestEntity,
          bookList,
        }}
        >
          <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: 16, paddingBottom: 0 }}>
            <Row>
              <DeclCustoms {...formProps} />
              <EntryType {...formProps} />
              <BillType {...formProps} />
              {
              /*
                ietype === 'import' && (formData.traf_mode === '2' || formData.traf_mode === '5') &&
              <Col span={6}>
                <FormDatePicker
                  field="intl_arrival_date"
                  outercol={24}
                  col={8}
                  label={this.msg('intlArrivalDate')}
                  {...entryFormProps}
                />
              </Col>}
              {ietype === 'import' && formData.traf_mode === '2' &&
              <Col span={6}>
                <FormDatePicker
                  field="exchange_bl_date"
                  outercol={24}
                  col={8}
                  label={this.msg('exchangeDate')}
                  {...entryFormProps}
                />
              </Col>}
              {ietype === 'import' && formData.traf_mode === '2' &&
              <Col span={6}>
                <FormInput
                  field="delivery_order_no"
                  outercol={24}
                  col={8}
                  label={this.msg('deliveryOrderNo')}
                  {...entryFormProps}
                />
              </Col> */
            }
            </Row>
            <Divider dashed />
            <Row>
              <Col span={12}>
                <DomesticEntitySelect
                  codeField="trade_co"
                  nameField="trade_name"
                  custCodeField="trade_custco"
                  ciqCodeField="trader_ciqcode"
                  codeRules={[{ required: true }]}
                  nameRules={[{ required: true }]}
                  {...formProps}
                />
              </Col>
              <Col span={6}>
                <IEDate {...formProps} />
              </Col>
              <Col span={6}>
                <DeclDate {...formProps} />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <OverseaEntitySelect
                  aeoCodeField="oversea_entity_aeocode"
                  nameField="oversea_entity_name"
                  codeRules={[{ required: false }]}
                  nameRules={[{ required: true }]}
                  {...formProps}
                />
              </Col>
              <IEPort {...formProps} />
            </Row>
            <Row>
              <Col span={12}>
                <DomesticEntitySelect
                  codeField="owner_code"
                  custCodeField="owner_custco"
                  ciqCodeField="owner_ciqcode"
                  nameField="owner_name"
                  codeRules={[{ required: true }]}
                  nameRules={[{ required: true }]}
                  {...formProps}
                />
              </Col>
              <TradeRemission {...formProps} />
            </Row>
            <Row>
              <Col span={12}>
                <DomesticEntitySelect
                  codeField="agent_code"
                  custCodeField="agent_custco"
                  ciqCodeField="agent_ciqcode"
                  nameField="agent_name"
                  codeRules={[{ required: true }]}
                  nameRules={[{ required: true }]}
                  {...formProps}
                />
              </Col>
              <LicenseAndStorage {...formProps} />
            </Row>
            <Transport {...formProps} />
            <Row>
              <TradeMode {...formProps} />
              <ManualNo {...formProps} />
              <ContractNo {...formProps} />
            </Row>
            <Row>
              <CountryRegion {...formProps} />
              <Ports {...formProps} />
            </Row>
            <Row>
              <PackType {...formProps} />
              <Col span={6}>
                <Weight field="gross_wt" {...formProps} />
              </Col>
              <Col span={6}>
                <Weight field="net_wt" {...formProps} />
              </Col>

            </Row>
            <Row>
              <Col span={6}>
                <PackCount {...formProps} />
              </Col>
              <Fee {...formProps} />
            </Row>
            <Row>
              <MarkNo {...formProps} />
              <Remark {...formProps} />
              {/* <DeclPersonnel compact {...formProps} /> */}
            </Row>
            <Divider dashed />
            <Row>
              <TermConfirm {...formProps} />
              <CusRemark {...formProps} />
            </Row>
          </Card>
          <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: 0 }}>
            <Collapse bordered={false}>
              <Panel header="检验检疫" key="ciq">
                <CiqOrgs {...formProps} />
                <QualifSpecCorrel {...formProps} />
                <ApplCertUser {...formProps} />
              </Panel>
            </Collapse>
          </Card>
          <Card bodyStyle={{ padding: 16, paddingBottom: 0 }}>
            <Row>
              <RaDeclManulNo {...formProps} />
              <StoreYard {...formProps} />
            </Row>
          </Card>
        </DeclFormContext.Provider>
      </FormPane>
    );
  }
}
