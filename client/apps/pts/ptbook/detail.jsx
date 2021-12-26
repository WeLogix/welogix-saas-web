import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';
import { Tabs, Button, Form, message, Layout, Popconfirm } from 'antd';
import { connect } from 'react-redux';
import connectNav from 'client/common/decorators/connect-nav';
import { getBlBookNosByType, notifyFormChanged } from 'common/reducers/cwmBlBook';
import { loadBookHead, updateBookHead } from 'common/reducers/ptsBook';
import PageHeader from 'client/components/PageHeader';
import MagicCard from 'client/components/MagicCard';
import LogsPane from 'client/components/Dock/common/logsPane';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import { DECLARER_COMPANY_TYPE, PTS_E_BOOK_TYPE, PTS_MANUAL_BOOK_TYPE, STAND_BANK, SCOF_BIZ_OBJECT_KEY, PTS_BOOK_TYPE } from 'common/constants';
import BookHeadPane from './tabpane/bookHeadPane';
import BookGoodsPane from './tabpane/bookGoodsPane';
import UConsumptionPane from './tabpane/uConsumptionPane';
import { formatMsg } from './message.i18n';

const { Content } = Layout;
const { TabPane } = Tabs;
const fieldLabelMap = {};
function createFieldLabelMap(msg) {
  fieldLabelMap.pts_book_type = msg('bookType');
  fieldLabelMap.manufcr_scc_code = msg('manufcr');
  fieldLabelMap.declarer_scc_code = msg('declarer');
  fieldLabelMap.typing_scc_code = msg('typing');
  fieldLabelMap.declarer_company_type = msg('declarerCompanyType');
  fieldLabelMap.book_input_date = msg('InputDate');
  fieldLabelMap.book_approvalno = msg('approvalno');
  fieldLabelMap.master_customs = msg('masterCustoms');
  fieldLabelMap.blbook_decl_date = msg('declDate');
  fieldLabelMap.blbook_expiray_date = msg('expirayDate');
  fieldLabelMap.uconsumption_decl_code = msg('uconsumptionDeclCode');
  fieldLabelMap.manufcr_area_code = msg('manufcrAreaCode');
  fieldLabelMap.imp_contract_no = msg('impContractNo');
  fieldLabelMap.exp_contract_no = msg('expContractNo');
  fieldLabelMap.book_trade_mode = msg('bookTradeMode');
  fieldLabelMap.imp_currency = msg('impCurrency');
  fieldLabelMap.exp_currency = msg('expCurrency');
  fieldLabelMap.process_type = msg('processType');
  fieldLabelMap.remission_mode = msg('remissionMode');
  fieldLabelMap.i_e_port = msg('iEPort');
  fieldLabelMap.stand_bank = msg('standBank');
  fieldLabelMap.process_ratio = msg('processRatio');
  fieldLabelMap.pause_i_e_mark = msg('pauseIEMark');
  fieldLabelMap.blbook_contact = msg('blbookContact');
  fieldLabelMap.blbook_tel = msg('blbookTel');
  fieldLabelMap.netwk_archives_no = msg('netwkArchivesNo');
  fieldLabelMap.imp_total_amount = msg('impTotalAmount');
  fieldLabelMap.exp_total_amount = msg('expTotalAmount');
  fieldLabelMap.max_turnover_amount = msg('maxTurnoverAmount');
  fieldLabelMap.materials_count = msg('materialsCount');
  fieldLabelMap.endproduct_count = msg('endproductCount');
  fieldLabelMap.last_writtenoff_date = msg('lastWrittenoffDate');
  fieldLabelMap.ucns_version_mark = msg('ucnsVersionMark');
  fieldLabelMap.max_imp_amount = msg('maxImpAmount');
  fieldLabelMap.writtenoff_cycle = msg('writtenoffCycle');
  fieldLabelMap.writtenoff_type = msg('writtenoffType');
  fieldLabelMap.modify_times = msg('modifyTimes');
  fieldLabelMap.blbook_approved_date = msg('approvedDate');
  fieldLabelMap.blbook_alter_date = msg('alterDate');
  fieldLabelMap.book_exec_flag = msg('bookExecFlag');
  fieldLabelMap.blbook_usage = msg('bookUsage');
  fieldLabelMap.blbook_note = msg('remark');
}

@injectIntl
@connect(state => ({
  bookData: state.ptsBook.bookData, // 账册数据
  formChanged: state.cwmBlBook.formChanged,
  customs: state.saasParams.latest.customs,
  tradeMode: state.saasParams.latest.tradeMode.map(trd => ({
    value: trd.trade_mode,
    text: trd.trade_abbr,
  })),
  currencies: state.saasParams.latest.currency.map(curr => ({
    value: curr.curr_code,
    text: curr.curr_name,
  })),
  partners: state.partner.partners,
  exemptions: state.saasParams.latest.exemptionWay,
}), {
  loadBookHead, getBlBookNosByType, updateBookHead, notifyFormChanged,
})
@connectNav({
  depth: 3,
  moduleName: 'pts',
  title: 'featPtsPTBook',
})
@Form.create({ onValuesChange: props => props.notifyFormChanged(true) })
export default class PTBookDetail extends Component {
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
    activeTabKey: 'head',
  }
  componentDidMount() {
    const { params } = this.props;
    if (params.id) {
      this.props.loadBookHead(params.id);
    }
    createFieldLabelMap(this.msg);
  }
  msg = formatMsg(this.props.intl)
  handleTabChange = (key) => {
    this.setState({ activeTabKey: key });
  }
  handlecancel = () => {
    this.props.notifyFormChanged(false);
    this.context.router.push('/pts/ptbook');
  }
  handleSubmit = () => {
    this.props.form.validateFields((errors) => {
      if (errors) {
        message.error('数据校验失败');
      } else {
        const editForm = this.props.form.getFieldsValue();
        const {
          bookData, customs, partners, tradeMode, currencies, exemptions,
        } = this.props;
        ['book_input_date', 'blbook_decl_date', 'blbook_expiray_date', 'last_writtenoff_date', 'blbook_approved_date', 'blbook_alter_date'].forEach((field) => {
          if (bookData[field]) {
            bookData[field] = moment(bookData[field]).format('YYYY/MM/DD');
          }
          if (editForm[field]) {
            editForm[field] = moment(editForm[field]).format('YYYY/MM/DD');
          }
        });
        const contentLog = [];
        const fields = Object.keys(editForm);
        fields.forEach((field) => {
          if (bookData[field] !== editForm[field] &&
            !(!bookData[field] && !editForm[field])) {
            if (field === 'pts_book_type') {
              const value = PTS_MANUAL_BOOK_TYPE.concat(PTS_E_BOOK_TYPE).find(tp =>
                tp.value === editForm[field]);
              const oldValue = PTS_MANUAL_BOOK_TYPE.concat(PTS_E_BOOK_TYPE).find(tp =>
                tp.value === bookData[field]);
              contentLog.push(`"${fieldLabelMap[field]}"由 [${(oldValue && oldValue.text) || ''}] 改为 [${(value && value.text) || ''}]`);
            } else if (field === 'manufcr_scc_code' || field === 'declarer_scc_code' || field === 'typing_scc_code') {
              const partner = partners.find(pt => pt.partner_unique_code === editForm[field]);
              const oldPartner = partners.find(pt => pt.partner_unique_code === bookData[field]);
              contentLog.push(`"${fieldLabelMap[field]}"由 [${(oldPartner && oldPartner.name) || ''}] 改为 [${(partner && partner.name) || ''}]`);
            } else if (field === 'master_customs') {
              const value = customs.find(custom => custom.customs_code === editForm[field]) &&
                customs.find(custom => custom.customs_code === editForm[field]).customs_name;
              const oldValue = customs.find(custom => custom.customs_code === bookData[field]) &&
                customs.find(custom => custom.customs_code === bookData[field]).customs_name;
              contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
            } else if (field === 'declarer_company_type') {
              const value =
                DECLARER_COMPANY_TYPE.find(type => type.value === editForm[field]) &&
                DECLARER_COMPANY_TYPE.find(type => type.value === editForm[field]).text;
              const oldValue =
                DECLARER_COMPANY_TYPE.find(type => type.value === bookData[field]) &&
                DECLARER_COMPANY_TYPE.find(type => type.value === bookData[field]).text;
              contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
            } else if (field === 'book_trade_mode') {
              const value = tradeMode.find(pt => pt.value === editForm[field]);
              const oldValue = tradeMode.find(pt => pt.value === bookData[field]);
              contentLog.push(`"${fieldLabelMap[field]}"由 [${(oldValue && oldValue.text) || ''}] 改为 [${(value && value.text) || ''}]`);
            } else if (field === 'imp_currency' || field === 'exp_currency') {
              const value = currencies.find(pt => pt.value === editForm[field]);
              const oldValue = currencies.find(pt => pt.value === bookData[field]);
              contentLog.push(`"${fieldLabelMap[field]}"由 [${(oldValue && oldValue.text) || ''}] 改为 [${(value && value.text) || ''}]`);
            } else if (field === 'remission_mode') {
              const value = exemptions.find(pt => pt.value === editForm[field]);
              const oldValue = exemptions.find(pt => pt.value === bookData[field]);
              contentLog.push(`"${fieldLabelMap[field]}"由 [${(oldValue && oldValue.text) || ''}] 改为 [${(value && value.text) || ''}]`);
            } else if (field === 'stand_bank') {
              const value = STAND_BANK.find(pt => pt.value === editForm[field]);
              const oldValue = STAND_BANK.find(pt => pt.value === bookData[field]);
              contentLog.push(`"${fieldLabelMap[field]}"由 [${(oldValue && oldValue.text) || ''}] 改为 [${(value && value.text) || ''}]`);
            } else {
              contentLog.push(`"${fieldLabelMap[field]}"由 [${bookData[field] || ''}] 改为 [${editForm[field] || ''}]`);
            }
          }
        });
        const data = {
          id: bookData.id,
          blbook_no: editForm.blbook_no,
          cop_manual_no: editForm.cop_manual_no,
          pts_book_type: editForm.pts_book_type,
          owner_cus_code: editForm.owner_cus_code,
          owner_scc_code: editForm.owner_scc_code,
          owner_name: editForm.owner_name,
          manufcr_cus_code: editForm.manufcr_cus_code,
          manufcr_scc_code: editForm.manufcr_scc_code,
          manufcr_name: editForm.manufcr_name,
          declarer_cus_code: editForm.declarer_cus_code,
          declarer_scc_code: editForm.declarer_scc_code,
          declarer_name: editForm.declarer_name,
          typing_cus_code: editForm.typing_cus_code,
          typing_scc_code: editForm.typing_scc_code,
          typing_name: editForm.typing_name,
          declarer_company_type: editForm.declarer_company_type,
          declarer_type: editForm.declarer_type,
          book_input_date: editForm.book_input_date,
          book_approvalno: editForm.book_approvalno,
          master_customs: editForm.master_customs,
          blbook_decl_date: editForm.blbook_decl_date,
          blbook_expiray_date: editForm.blbook_expiray_date,
          uconsumption_decl_code: editForm.uconsumption_decl_code,
          manufcr_area_code: editForm.manufcr_area_code,
          imp_contract_no: editForm.imp_contract_no,
          exp_contract_no: editForm.exp_contract_no,
          book_trade_mode: editForm.book_trade_mode,
          imp_currency: editForm.imp_currency,
          exp_currency: editForm.exp_currency,
          remission_mode: editForm.remission_mode,
          process_type: editForm.process_type,
          i_e_port: editForm.i_e_port,
          stand_bank: editForm.stand_bank,
          decl_source: editForm.decl_source,
          process_ratio: editForm.process_ratio,
          pause_i_e_mark: editForm.pause_i_e_mark,
          blbook_contact: editForm.blbook_contact,
          blbook_tel: editForm.blbook_tel,
          netwk_archives_no: editForm.netwk_archives_no,
          imp_total_amount: editForm.imp_total_amount,
          exp_total_amount: editForm.exp_total_amount,
          max_turnover_amount: editForm.max_turnover_amount,
          materials_count: editForm.materials_count,
          endproduct_count: editForm.endproduct_count,
          last_writtenoff_date: editForm.last_writtenoff_date,
          ucns_version_mark: editForm.ucns_version_mark,
          max_imp_amount: editForm.max_imp_amount,
          writtenoff_cycle: editForm.writtenoff_cycle,
          writtenoff_type: editForm.writtenoff_type,
          modify_times: editForm.modify_times,
          blbook_approved_date: editForm.blbook_approved_date,
          blbook_alter_date: editForm.blbook_alter_date,
          book_exec_flag: editForm.book_exec_flag,
          blbook_usage: editForm.blbook_usage,
          blbook_note: editForm.blbook_note,
        };
        this.props.updateBookHead(data, contentLog).then((result) => {
          if (result.error) {
            message.error(result.error.message, 10);
          } else {
            this.props.notifyFormChanged(false);
            message.success(this.msg('savedSucceed'));
            this.props.loadBookHead(data.id);
          }
        });
      }
    });
  }
  render() {
    const {
      saving, formChanged, bookData,
    } = this.props;
    const titleText = bookData.blbook_type === PTS_BOOK_TYPE.MBOOK ? `手册编号${bookData.blbook_no || bookData.cop_manual_no}` : `账册编号${bookData.blbook_no || bookData.cop_manual_no}`;
    return (
      <Layout>
        <PageHeader
          breadcrumb={[
            // this.props.params.bookNo,
            'zhangce',
          ]}
          title={titleText}
        >
          <PageHeader.Actions>
            {
              formChanged ? <Popconfirm title={this.msg('未保存修改确认取消？')} onConfirm={this.handlecancel}>
                <Button>{this.msg('cancel')}</Button>
              </Popconfirm> : <Button onClick={this.handlecancel} >{this.msg('cancel')}</Button>
            }
            <PrivilegeCover module="cwm" feature="blbook" action="edit">
              <Button type="primary" onClick={this.handleSubmit} loading={saving} disabled={!formChanged} >{this.msg('save')}</Button>
            </PrivilegeCover>
          </PageHeader.Actions>
        </PageHeader>
        <Content className="page-content">
          <MagicCard bodyStyle={{ padding: 0 }}>
            <Tabs activeKey={this.state.activeTabKey} onChange={this.handleTabChange}>
              <TabPane tab={this.msg('bookHead')} key="head"><BookHeadPane form={this.props.form} /></TabPane>
              {bookData.blbook_no && <TabPane tab={this.msg('materails')} key="materails"><BookGoodsPane form={this.props.form} activeKey={this.state.activeTabKey} /></TabPane>}
              {bookData.blbook_no && <TabPane tab={this.msg('endproduct')} key="endProduct"><BookGoodsPane form={this.props.form} activeKey={this.state.activeTabKey} /></TabPane>}
              {bookData.blbook_no && <TabPane tab={this.msg('uconsumption')} key="uConsumption"><UConsumptionPane form={this.props.form} /></TabPane>}
              <TabPane tab={this.msg('logs')} key="logs" >
                <LogsPane
                  billNo={bookData.blbook_no}
                  bizObject={SCOF_BIZ_OBJECT_KEY.PTS_BOOK.key}
                />
              </TabPane>
            </Tabs>
          </MagicCard>
        </Content>
      </Layout>
    );
  }
}
