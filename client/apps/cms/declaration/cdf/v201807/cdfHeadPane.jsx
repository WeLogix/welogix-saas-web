import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, Collapse, Divider, Form, Row, Col, Icon } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { CMS_DECL_STATUS } from 'common/constants';
import { updateDeclHead, loadManifestEntity } from 'common/reducers/cmsManifest';
import FormPane from 'client/components/FormPane';
import EditableCell from 'client/components/EditableCell';
import { openEfModal } from 'common/reducers/cmsDelegation';
import {
  DeclFormContext, DeclCustoms, EntryType, BillType,
  DomesticEntitySelect, OverseaEntitySelect, IEPort, IEDate, DeclDate,
  Transport, Weight, TermConfirm, ContractNo, MarkNo, Remark, ManualNo,
  TradeRemission, Ports, TradeMode, LicenseAndStorage, Fee, CountryRegion, PackCount, PackType,
  CusRemark, RaDeclManulNo, StoreYard,
  CiqOrgs, QualifSpecCorrel, ApplCertUser,
} from 'client/apps/cms/common/form/declFormItems';
import { hasPermission } from 'client/common/decorators/withPrivilege';
import { createDelgHeadChangeLog } from '../../../common/manifestChangeLog';
import FillCustomsNoModal from '../../modals/fillCustomsNoModal';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;
const { Panel } = Collapse;

@injectIntl
@connect(
  state => ({
    formParams: state.saasParams.latest,
    manifestEntity: state.cmsManifest.manifestEntity,
    bookList: state.cwmBlBook.blBooksByType,
    privileges: state.account.privileges,
  }),
  {
    updateDeclHead, loadManifestEntity, openEfModal,
  }
)
export default class CDFHeadPaneV201807 extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    ietype: PropTypes.oneOf(['import', 'export']).isRequired,
    headSave: PropTypes.bool.isRequired,
    form: PropTypes.shape({ getFieldDecorator: PropTypes.func.isRequired }).isRequired,
    formData: PropTypes.shape({
      status: PropTypes.number.isRequired,
      id: PropTypes.number.isRequired,
    }).isRequired,
    updateDeclHead: PropTypes.func.isRequired,
  }
  componentDidMount() {
    if (this.props.headSave) {
      this.props.loadManifestEntity(this.props.formData.owner_cuspartner_id);
    }
  }
  msg = formatMsg(this.props.intl)
  editPermission = hasPermission(this.props.privileges, {
    module: 'clearance', feature: 'customs', action: 'edit',
  });
  handleHeadDirectSave = (val, field) => {
    const { formData, formParams, ietype } = this.props;
    const head = {};
    head[field] = val;
    if (field === 'i_e_date' && val) {
      head[field] = new Date(val);
    }
    const {
      updateValue, opContent,
    } = createDelgHeadChangeLog(formData, head, formParams, this.msg, ietype);
    this.props.updateDeclHead(updateValue, formData.id, opContent);
  }
  handleDeclNoFill = () => {
    const head = this.props.formData;
    this.props.openEfModal({
      entryHeadId: head.id,
      decUnifiedNo: head.dec_unified_no,
    });
  }
  render() {
    const {
      form, formData, intl, ietype, headSave, formParams, manifestEntity, bookList,
    } = this.props;
    const formProps = {
      disabled: !headSave,
      formData,
      required: true,
    };
    const editable = formData.status < CMS_DECL_STATUS.sent.value && this.editPermission;
    const entryIdEditable = (!formData.entry_id || (!formData.ep_receipt_filename &&
      (new Date().getTime() - new Date(formData.backfill_date).getTime()) < 24 * 3600 * 1000)) &&
      this.editPermission;
    return (
      <FormPane hideRequiredMark>
        <DeclFormContext.Provider value={{
          ietype,
          intl,
          getFieldDecorator: form.getFieldDecorator,
          getFieldValue: form.getFieldValue,
          setFieldsValue: form.setFieldsValue,
          cdfversion: 'v201807',
          nonftz: formData.sheet_type !== 'FTZ',
          formParams,
          manifestEntity,
          bookList,
        }}
        >
          <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: 16, paddingBottom: 0 }}>
            <Row>
              {/*
              <Col span={6}>
                  <FormItem label={this.msg('preEntryId')} labelCol={{ span: 8 }}
                   wrapperCol={{ span: 16 }} colon={false}>
                  <EditableCell field="pre_entry_id" value={formData.pre_entry_id}
                  onSave={this.handleHeadDirectSave} editable={false} />
                </FormItem>
              </Col>
              */}
              <DeclCustoms {...formProps} />
              <Col span={6}>
                <FormItem label={this.msg('formEntryId')} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} colon={false}>
                  <div className="editable-cell-text-wrapper">
                    <span>{formData.entry_id || formData.dec_unified_no}</span>
                    {entryIdEditable && <Icon type="edit" className="editable-cell-icon" onClick={this.handleDeclNoFill} />}
                  </div>
                </FormItem>
              </Col>
              <EntryType
                {...formProps}
                editable={editable}
                onSave={this.handleHeadDirectSave}
              />
              <BillType
                {...formProps}
                editable={editable}
                onSave={this.handleHeadDirectSave}
              />
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
                <IEDate
                  {...formProps}
                  editable={editable}
                  onSave={this.handleHeadDirectSave}
                />
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
                  editable={editable}
                  onSave={this.handleHeadDirectSave}
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
            <Transport {...formProps} editable={editable} onSave={this.handleHeadDirectSave} />
            <Row>
              <TradeMode {...formProps} editable={editable} onSave={this.handleHeadDirectSave} />
              <ManualNo {...formProps} />
              <ContractNo
                onSave={this.handleHeadDirectSave}
                editable={editable}
                disabled={!editable}
                {...formProps}
              />
            </Row>
            <Row>
              <CountryRegion {...formProps} editable onSave={this.handleHeadDirectSave} />
              <Ports {...formProps} />
            </Row>
            <Row>
              <PackType
                {...formProps}
                editable={editable}
                onSave={this.handleHeadDirectSave}
              />
              <Col span={6}>
                <Weight editable={editable} onSave={this.handleHeadDirectSave} field="gross_wt" {...formProps} />
              </Col>
              <Col span={6}>
                <Weight editable={editable} onSave={this.handleHeadDirectSave} field="net_wt" {...formProps} />
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <PackCount
                  {...formProps}
                  editable={editable}
                  onSave={this.handleHeadDirectSave}
                />
              </Col>
              <Fee {...formProps} editable={editable} onSave={this.handleHeadDirectSave} />
            </Row>
            <Row>
              <FormItem label={this.msg('certMark')} labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} colon={false} style={{ marginBottom: 16 }}>
                <EditableCell field="cert_mark" value={formData.cert_mark} onSave={this.handleHeadDirectSave} editable={editable} />
              </FormItem>
            </Row>
            <Row>
              <MarkNo onSave={this.handleHeadDirectSave} editable={editable} {...formProps} />
              <Remark onSave={this.handleHeadDirectSave} editable={editable} {...formProps} />
              {/* <DeclPersonnel
                  compact
                  onSave={this.handleHeadDirectSave}
                  editable={editable}
                  {...formProps}
                /> */}
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
        <FillCustomsNoModal />
      </FormPane>
    );
  }
}
