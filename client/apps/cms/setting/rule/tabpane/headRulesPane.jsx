import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Collapse, Divider, Row, Col, Card } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { loadManifestEntity, saveTemplateHeadLocal } from 'common/reducers/cmsManifest';
import FormPane from 'client/components/FormPane';
import {
  DeclFormContext, DomesticEntitySelect, OverseaEntitySelect, IEPort, IEDate, DeclDate,
  Transport, Weight, TermConfirm, ContractNo, MarkNo, Remark, ManualNo,
  TradeRemission, Ports, TradeMode, LicenseAndStorage, Fee, CountryRegion, PackCount, PackType,
  CusRemark, CiqOrgs, QualifSpecCorrel, ApplCertUser,
} from '../../../common/form/declFormItems';
import { formatMsg } from '../../../message.i18n';

const { Panel } = Collapse;

@injectIntl
@connect(
  state => ({
    ietype: state.cmsManifest.template.ietype,
    ownerPartnerId: state.cmsManifest.template.customer_partner_id,
    formParams: state.saasParams.latest,
    manifestEntity: state.cmsManifest.manifestEntity,
    bookList: state.cwmBlBook.blBooksByType,
  }),
  { loadManifestEntity, saveTemplateHeadLocal }
)
export default class HeadRulesPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    ietype: PropTypes.string,
    form: PropTypes.shape({ getFieldDecorator: PropTypes.func.isRequired }).isRequired,
    formData: PropTypes.shape({ owner_code: PropTypes.string }).isRequired,
  }
  componentDidMount() {
    if (this.props.ownerPartnerId) {
      this.props.loadManifestEntity(this.props.ownerPartnerId);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.ownerPartnerId && nextProps.ownerPartnerId !== this.props.ownerPartnerId) {
      this.props.loadManifestEntity(nextProps.ownerPartnerId);
    }
  }
  msg = formatMsg(this.props.intl)
  render() {
    const {
      form, formData, ietype, intl, formParams, manifestEntity, bookList,
    } = this.props;
    const formProps = {
      formData,
      required: false,
    };
    return (
      <FormPane>
        <DeclFormContext.Provider value={{
          ietype,
          intl,
          getFieldDecorator: form.getFieldDecorator,
          getFieldValue: form.getFieldValue,
          setFieldsValue: form.setFieldsValue,
          saveHeadLocal: this.props.saveTemplateHeadLocal,
          cdfversion: 'v201807',
          nonftz: true,
          formParams,
          manifestEntity,
          bookList,
        }}
        >
          <Card bodyStyle={{ padding: 16 }}>
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
                  nameRules={[{ required: false }]}
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
              <PackType {...formProps} disabled fromTemplate />
              <Col span={6}>
                <Weight field="gross_wt" {...formProps} disabled />
              </Col>
              <Col span={6}>
                <Weight field="net_wt" {...formProps} disabled />
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <PackCount {...formProps} disabled />
              </Col>
              <Fee {...formProps} />
            </Row>
            <Row>
              <MarkNo {...formProps} />
              <Remark {...formProps} />
            </Row>
            <Divider dashed />
            <Row>
              <TermConfirm {...formProps} />
              <CusRemark {...formProps} />
            </Row>
          </Card>
          <Card bodyStyle={{ padding: 0 }}>
            <Collapse bordered={false}>
              <Panel header="检验检疫" key="ciq">
                <CiqOrgs {...formProps} />
                <QualifSpecCorrel {...formProps} fromTemplate />
                <ApplCertUser {...formProps} disabled fromTemplate />
              </Panel>
            </Collapse>
          </Card>
        </DeclFormContext.Provider>
      </FormPane>
    );
  }
}
