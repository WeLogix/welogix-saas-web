import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, Form, Row, Col, message } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { CMS_DECL_STATUS } from 'common/constants';
import { updateDeclHead, fillEntryId, loadManifestEntity } from 'common/reducers/cmsManifest';
import { loadV1SaasParam } from 'common/reducers/saasParams';
import FormPane from 'client/components/FormPane';
import EditableCell from 'client/components/EditableCell';
import {
  DeclFormContext,
  DomesticEntitySelect, IEPort, IEDate, DeclDate, CountryAttr,
  Transport, TermConfirm, TradeRemissionV201603, TradeMode, Fee,
  LicenseNo, ContainerNo, RaDeclManulNo, StoreYard, PackCountV201603, Weight,
} from 'client/apps/cms/common/form/declFormItems';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;

@injectIntl
@connect(
  state => ({
    formParams: state.saasParams.v1,
    manifestEntity: state.cmsManifest.manifestEntity,
    bookList: state.cwmBlBook.blBooksByType,
  }),
  {
    fillEntryId, updateDeclHead, loadManifestEntity, loadV1SaasParam,
  }
)
export default class CDFHeadPaneV201603 extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    ietype: PropTypes.oneOf(['import', 'export']).isRequired,
    headSave: PropTypes.bool.isRequired,
    form: PropTypes.shape({ getFieldDecorator: PropTypes.func.isRequired }).isRequired,
    formData: PropTypes.shape({
      status: PropTypes.number.isRequired,
      id: PropTypes.number.isRequired,
    }).isRequired,
    fillEntryId: PropTypes.func.isRequired,
    updateDeclHead: PropTypes.func.isRequired,
  }
  componentDidMount() {
    this.props.loadV1SaasParam([
      'customs', 'tradeMode', 'transMode', 'trxnMode', 'country',
      'remissionMode', 'currency', 'port', 'district', 'unit',
    ]);
    if (this.props.headSave) {
      this.props.loadManifestEntity(this.props.formData.owner_cuspartner_id);
    }
  }
  msg = formatMsg(this.props.intl)
  handleEntryFill = (entryNo) => {
    const { formData } = this.props;
    this.props.fillEntryId({
      entryNo,
      entryHeadId: formData.id,
      decUnifiedNo: formData.dec_unified_no,
    }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      }
    });
  }
  handleHeadDirectSave = (val, field) => {
    const head = {};
    head[field] = val;
    this.props.updateDeclHead(head, this.props.formData.id);
  }
  render() {
    const {
      form, formData, ietype, intl, headSave, formParams, manifestEntity, bookList,
    } = this.props;
    const formProps = {
      disabled: !headSave,
      formData,
      required: true,
    };
    const editable = formData.status < CMS_DECL_STATUS.sent.value;
    return (
      <FormPane hideRequiredMark>
        <DeclFormContext.Provider value={{
          ietype,
          intl,
          getFieldDecorator: form.getFieldDecorator,
          getFieldValue: form.getFieldValue,
          cdfversion: 'v201603',
          nonftz: formData.sheet_type !== 'FTZ',
          formParams,
          manifestEntity,
          bookList,
        }}
        >
          <Card >
            <Row>
              <Col span={6}>
                <FormItem label={this.msg('preEntryId')} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} colon={false}>
                  <EditableCell field="pre_entry_id" value={formData.pre_entry_id} onSave={this.handleHeadDirectSave} editable={false} />
                </FormItem>
              </Col>
              <Col span={6} offset={2}>
                <FormItem label={this.msg('formEntryId')} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} colon={false}>
                  <EditableCell field="entry_id" value={formData.entry_id} onSave={this.handleEntryFill} editable={!formData.entry_id} disabled={!editable} />
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card >
            <Row>
              <Col span={8}>
                <DomesticEntitySelect
                  codeField="trade_co"
                  nameField="trade_name"
                  custCodeField="trade_custco"
                  codeRules={[{ required: true }]}
                  nameRules={[{ required: true }]}
                  {...formProps}
                />
              </Col>
              <Col span={16}>
                <IEPort {...formProps} />
                <Col span={8}>
                  <IEDate {...formProps} />
                </Col>
                <Col span={8}>
                  <DeclDate {...formProps} />
                </Col>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <DomesticEntitySelect
                  codeField="owner_code"
                  custCodeField="owner_custco"
                  nameField="owner_name"
                  codeRules={[{ required: true }]}
                  nameRules={[{ required: true }]}
                  {...formProps}
                />
              </Col>
              <Col span={16}>
                <Col span={8}>
                  <LicenseNo {...formProps} />
                </Col>
                <Col span={16}>
                  <FormItem label={this.msg('contractNo')} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} colon={false} style={{ marginBottom: 0 }}>
                    <EditableCell field="contr_no" value={formData.contr_no} onSave={this.handleHeadDirectSave} editable={editable} />
                  </FormItem>
                </Col>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <DomesticEntitySelect
                  codeField="agent_code"
                  custCodeField="agent_custco"
                  nameField="agent_name"
                  codeRules={[{ required: true }]}
                  nameRules={[{ required: true }]}
                  {...formProps}
                />
              </Col>
              <TradeRemissionV201603 {...formProps} />
            </Row>
            <CountryAttr {...formProps} />
            <Transport {...formProps} />
            <Row>
              <TradeMode {...formProps} />
              <Fee {...formProps} />
            </Row>
            <Row>
              <Col span={8}>
                <ContainerNo {...formProps} />
              </Col>
              <Col span={16}>
                <PackCountV201603
                  {...formProps}
                  packCountEditCell={<FormItem label={this.msg('packCount')} labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} colon={false} style={{ marginBottom: 0 }}>
                    <EditableCell field="pack_count" value={formData.pack_count} onSave={this.handleHeadDirectSave} editable={editable} />
                  </FormItem>}
                  packTypeEditCell={
                    <FormItem label={this.msg('packType')} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} colon={false} style={{ marginBottom: 0 }}>
                      <EditableCell
                        field="wrap_type"
                        value={formData.wrap_type}
                        onSave={this.handleHeadDirectSave}
                        editable={editable}
                        type="select"
                        options={formParams.wrapType.map(pack => ({
                    key: pack.value,
                    text: pack.text,
                  }))}
                      />
                    </FormItem>
            }
                />
                <Col span={8}>
                  <Weight field="gross_wt" {...formProps} />
                </Col>
                <Col span={8}>
                  <Weight field="net_wt" {...formProps} />
                </Col>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label={this.msg('certMark')} labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} colon={false}>
                  <EditableCell field="cert_mark" value={formData.cert_mark} onSave={this.handleHeadDirectSave} editable={editable} />
                </FormItem>
              </Col>
              <Col span={16}>
                <FormItem label={this.msg('markNotes')} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} colon={false}>
                  <EditableCell field="note" value={formData.note} onSave={this.handleHeadDirectSave} editable={editable} />
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card >
            <Row>
              <TermConfirm {...formProps} />
            </Row>
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
