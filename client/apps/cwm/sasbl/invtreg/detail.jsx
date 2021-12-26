import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { Tabs, Button, Form, Layout, message, Popconfirm } from 'antd';
import { connect } from 'react-redux';
import connectNav from 'client/common/decorators/connect-nav';
import PageHeader from 'client/components/PageHeader';
import PageContent from 'client/components/PageContent';
import MagicCard from 'client/components/MagicCard';
import { SW_JG2_SENDTYPE } from 'common/constants';
import { loadInvtHead, notifyFormChanged, updateInvtHead, showSendSwJG2File } from 'common/reducers/cwmSasblReg';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import InboundTreePopover from '../../common/popover/inboundTreePopover';
import OutboundTreePopover from '../../common/popover/outboundTreePopover';
import SasblBodyDetailPane from '../common/sasblBodyDetailPane';
import InventoryRegHeadPane from './tabpane/inventoryRegHeadPane';
import SendSwJG2FileModal from '../common/modals/sendSwJG2FileModal';
import { formatMsg } from '../message.i18n';

const { TabPane } = Tabs;

@injectIntl
@connect(state => ({
  whseCode: state.cwmContext.defaultWhse.code,
  brokers: state.cwmContext.whseAttrs.brokers,
  formChanged: state.cwmBlBook.formChanged,
  invtData: state.cwmSasblReg.invtData,
  ioboundHead: state.cwmSasblReg.ioboundHead,
  sending: state.cwmSasblReg.sendSwJG2FileModal.sending,
  sent: state.cwmSasblReg.sendSwJG2FileModal.sent,
}), {
  loadInvtHead, notifyFormChanged, updateInvtHead, showSendSwJG2File,
})
@connectNav({
  depth: 3,
  moduleName: 'cwm',
  title: 'featCwmSasbl',
  jumpOut: true,
})
@Form.create({ onValuesChange: props => props.notifyFormChanged(true) })
export default class BondedInventoryRegDetail extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func,
    }).isRequired,
    formChanged: PropTypes.bool.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    selectedKey: 'invtHead',
  }
  componentDidMount() {
    this.handleLoadHead();
  }
  componentWillReceiveProps(nextProps) {
    const { params, whseCode } = nextProps;
    if (whseCode !== this.props.whseCode) {
      this.props.loadInvtHead(params.invtregNo, whseCode);
    }
  }
  msg = formatMsg(this.props.intl);
  handleLoadHead = () => {
    const { params, whseCode } = this.props;
    if (params.invtregNo && whseCode) {
      const copInvtregNo = params.invtregNo;
      this.props.loadInvtHead(copInvtregNo, whseCode);
    }
  }
  handleCancel = () => {
    const { supType, ieType } = this.props.params;
    this.props.notifyFormChanged(false);
    this.context.router.push(`/cwm/sasbl/invtreg/${supType}/${ieType}`);
  }
  handleMenuItemClick = (key) => {
    this.setState({ selectedKey: key });
  }
  handleSubmit = () => {
    this.props.form.validateFields((errors) => {
      if (errors) {
        message.error('数据校验失败');
      } else {
        const editForm = this.props.form.getFieldsValue();
        const { invtData, whseCode } = this.props;
        const data = {
          cop_invt_no: invtData.cop_invt_no,
          blbook_no: editForm.blbook_no,
          owner_scc_code: editForm.owner_scc_code,
          owner_cus_code: editForm.owner_cus_code,
          owner_name: editForm.owner_name,
          manufcr_scc_code: editForm.manufcr_scc_code,
          manufcr_cus_code: editForm.manufcr_cus_code,
          manufcr_name: editForm.manufcr_name,
          declarer_scc_code: editForm.declarer_scc_code,
          declarer_cus_code: editForm.declarer_cus_code,
          declarer_name: editForm.declarer_name,
          invt_biztype: editForm.invt_biztype,
          prdgoods_mark: editForm.prdgoods_mark,
          trade_mode: editForm.trade_mode,
          traf_mode: editForm.traf_mode,
          i_e_port: editForm.i_e_port,
          dept_dest_country: editForm.dept_dest_country,
          master_customs: editForm.master_customs,
          list_type: editForm.list_type,
          cusdecl_flag: editForm.cusdecl_flag,
          cusdecl_type: editForm.cusdecl_type,
          entry_type: editForm.entry_type,
          sasbl_apply_no: editForm.sasbl_apply_no,
          entry_no: editForm.entry_no,
          rel_entry_no: editForm.rel_entry_no,
          invt_remark: editForm.invt_remark,
        };
        this.props.updateInvtHead(data).then((result) => {
          if (result.error) {
            message.error(result.error.message, 10);
          } else {
            this.props.notifyFormChanged(false);
            message.success(this.msg('savedSucceed'));
          }
          this.props.loadInvtHead(invtData.cop_invt_no, whseCode);
        });
      }
    });
  }
  handleSendMsg = () => {
    const { invtData } = this.props;
    this.props.showSendSwJG2File({
      visible: true,
      copNo: invtData.cop_invt_no,
      agentCode: invtData.declarer_scc_code,
      regType: 'invt',
      sendFlag: SW_JG2_SENDTYPE.SAS,
      decType: invtData.invt_dectype,
    });
  }
  render() {
    const {
      formChanged, invtData, ioboundHead,
    } = this.props;
    const { supType, ieType, invtregNo } = this.props.params;
    const readonly = Boolean(invtData.sent_status !== 0 || invtData.invt_status === -1);
    const { selectedKey } = this.state;
    return (
      <Layout>
        <PageHeader
          breadcrumb={[
            this.msg('invtReg'),
            invtregNo,
            ieType === 'i' && ioboundHead && (
              <InboundTreePopover
                inbound={ioboundHead}
                regType={supType}
                bondRegs={[invtData]}
                currentKey={`bond-reg-${invtregNo}`}
              />
            ),
            ieType === 'e' && ioboundHead && (
              <OutboundTreePopover
                outboundNo={ioboundHead.outbound_no}
                regType={supType}
                bondRegs={[invtData]}
                currentKey={`bond-reg-${invtregNo}`}
              />
            ),
          ]}
        >
          <PageHeader.Actions>
            {(invtData.invt_dectype === '1' && !readonly) && (
              <PrivilegeCover module="cwm" feature="supervision" action="edit">
                <Button
                  type="primary"
                  icon="mail"
                  onClick={this.handleSendMsg}
                  loading={invtData.sent_status === 1}
                  disabled={formChanged}
                >
                  {this.msg('regDecl')}
                </Button>
              </PrivilegeCover>
            )}
            <PrivilegeCover module="cwm" feature="supervision" action="edit">
              <Button
                type="primary"
                icon="save"
                onClick={this.handleSubmit}
                disabled={!formChanged}
              >
                {this.msg('save')}
              </Button>
            </PrivilegeCover>
            {formChanged ? (
              <Popconfirm title={this.msg('confirmCancel')} onConfirm={this.handleCancel}>
                <Button>{this.msg('cancel')}</Button>
              </Popconfirm>
            ) : (
              <Button onClick={this.handleCancel}>{this.msg('cancel')}</Button>
            )}
          </PageHeader.Actions>
        </PageHeader>
        <PageContent readonly={readonly}>
          <MagicCard bodyStyle={{ padding: 0 }}>
            <Tabs activeKey={selectedKey} onChange={this.handleMenuItemClick}>
              <TabPane tab={this.msg('invtHead')} key="invtHead">
                <InventoryRegHeadPane form={this.props.form} readonly={readonly} />
              </TabPane>
              <TabPane tab={this.msg('invtBody')} key="invtBody">
                <SasblBodyDetailPane
                  readonly={readonly}
                  form={this.props.form}
                  copSasblNo={this.props.params.invtregNo}
                  blType="invt"
                  preSasblNo={invtData && invtData.pre_sasbl_seqno}
                />
              </TabPane>
            </Tabs>
          </MagicCard>
        </PageContent>
        <SendSwJG2FileModal reload={this.handleLoadHead} />
      </Layout>
    );
  }
}
