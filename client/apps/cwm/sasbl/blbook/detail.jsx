import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';
import { Tabs, Button, Form, message, Layout, Popconfirm } from 'antd';
import { connect } from 'react-redux';
import connectNav from 'client/common/decorators/connect-nav';
import { loadBlBookHead, getBlBookNosByType, updateBlBookHead, notifyFormChanged } from 'common/reducers/cwmBlBook';
import PageHeader from 'client/components/PageHeader';
import MagicCard from 'client/components/MagicCard';
import LogsPane from 'client/components/Dock/common/logsPane';
import { SCOF_BIZ_OBJECT_KEY, DECLARER_COMPANY_TYPE, SASBL_BWL_TYPE } from 'common/constants';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import BookBodyPane from './tabpane/bookBodyPane';
import BookHeadPane from './tabpane/bookHeadPane';
import { formatMsg } from './message.i18n';

const { Content } = Layout;
const { TabPane } = Tabs;
const fieldLabelMap = {};

function createFieldLabelMap(msg) {
  fieldLabelMap.master_customs = msg('masterCustoms');
  fieldLabelMap.kik_blbook_no = msg('kikBlbookNo');
  fieldLabelMap.declarer_name = msg('declarer');
  fieldLabelMap.declarer_company_type = msg('declarerCompanyType');
  fieldLabelMap.bwl_type = msg('bwlType');
  fieldLabelMap.business_type = msg('businessType');
  fieldLabelMap.blbook_accounting = msg('blbookAccounting');
  fieldLabelMap.blbook_tax_rebate = msg('blbookTaxRebate');
  fieldLabelMap.blbook_decl_date = msg('blbookDeclDate');
  fieldLabelMap.blbook_expiray_date = msg('blbookExpirayDate');
  fieldLabelMap.blbook_usage = msg('blbookUsage');
  fieldLabelMap.blbook_note = msg('remark');
}

@injectIntl
@connect(state => ({
  blBookData: state.cwmBlBook.blBookData, // 账册数据
  whseCode: state.cwmContext.defaultWhse.code,
  brokers: state.cwmContext.whseAttrs.brokers,
  formChanged: state.cwmBlBook.formChanged,
  customs: state.saasParams.latest.customs,
}), {
  loadBlBookHead, getBlBookNosByType, updateBlBookHead, notifyFormChanged,
})
@connectNav({
  depth: 3,
  moduleName: 'cwm',
  title: 'featCwmBlBook',
})
@Form.create({ onValuesChange: props => props.notifyFormChanged(true) })
export default class BLBookDetail extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func,
    }).isRequired,
    blBookData: PropTypes.shape({ cop_manual_no: PropTypes.string }).isRequired,
    whseCode: PropTypes.string,
    formChanged: PropTypes.bool.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    activeTabKey: 'bookHead',
  }
  componentDidMount() {
    const { params, whseCode, blBookData } = this.props;
    if (params.id !== blBookData.id) {
      this.props.loadBlBookHead(params.id);
    }
    if (blBookData.blbook_type === 'K') {
      this.props.getBlBookNosByType(whseCode, 'IK');
    }
    createFieldLabelMap(this.msg);
  }
  componentWillReceiveProps(nextProps) {
    const { params, whseCode, blBookData } = nextProps;
    if (this.props.params.id !== params.id) {
      this.props.loadBlBookHead(params.id);
      if (blBookData.blbook_type === 'K') {
        this.props.getBlBookNosByType(whseCode, 'IK');
      }
    }
  }
  msg = formatMsg(this.props.intl)
  handleTabChange = (key) => {
    this.setState({ activeTabKey: key });
  }
  handlecancel = () => {
    this.props.notifyFormChanged(false);
    this.context.router.push('/cwm/blbook');
  }
  handleSubmit = () => {
    this.props.form.validateFields((errors) => {
      if (errors) {
        message.error('数据校验失败');
      } else {
        const {
          blBookData, customs,
        } = this.props;
        const editForm = this.props.form.getFieldsValue();
        ['blbook_decl_date', 'blbook_expiray_date'].forEach((field) => {
          if (blBookData[field]) {
            blBookData[field] = moment(blBookData[field]).format('YYYY-MM-DD');
          }
          if (editForm[field]) {
            editForm[field] = moment(editForm[field]).format('YYYY-MM-DD');
          }
        });
        const contentLog = [];
        ['master_customs', 'kik_blbook_no', 'declarer_name', 'declarer_company_type',
          'bwl_type', 'business_type', 'blbook_accounting', 'blbook_tax_rebate', 'blbook_decl_date',
          'blbook_expiray_date', 'blbook_usage', 'blbook_note', 'whse_vol', 'whse_area', 'whse_name',
          'whse_address', 'blbook_tel', 'blbook_contact'].forEach((field) => {
          if (blBookData[field] !== editForm[field] &&
            !(!blBookData[field] && !editForm[field])) {
            if (field === 'master_customs') {
              const value = customs.find(custom => custom.customs_code === editForm[field]) &&
                customs.find(custom => custom.customs_code === editForm[field]).customs_name;
              const oldValue = customs.find(custom => custom.customs_code === blBookData[field]) &&
                customs.find(custom => custom.customs_code === blBookData[field]).customs_name;
              contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
            } else if (field === 'declarer_company_type') {
              const value =
                DECLARER_COMPANY_TYPE.find(type => type.value === editForm[field]) &&
                DECLARER_COMPANY_TYPE.find(type => type.value === editForm[field]).text;
              const oldValue =
                DECLARER_COMPANY_TYPE.find(type => type.value === blBookData[field]) &&
                DECLARER_COMPANY_TYPE.find(type => type.value === blBookData[field]).text;
              contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
            } else if (field === 'bwl_type') {
              const value = SASBL_BWL_TYPE.find(type => type.value === editForm[field]) &&
                SASBL_BWL_TYPE.find(type => type.value === editForm[field]).text;
              const oldValue = SASBL_BWL_TYPE.find(type => type.value === blBookData[field]) &&
                SASBL_BWL_TYPE.find(type => type.value === blBookData[field]).text;
              contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
            } else if (field === 'blbook_accounting') {
              let value = '';
              let oldValue = '';
              if (editForm[field] === '1') {
                value = '可累计';
              } else if (editForm[field] === '2') {
                value = '不累计';
              }
              if (blBookData[field] === '1') {
                oldValue = '可累计';
              } else if (blBookData[field] === '2') {
                oldValue = '不累计';
              }
              contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
            } else if (field === 'blbook_tax_rebate') {
              let value = '';
              let oldValue = '';
              if (editForm[field] === '1') {
                value = '是';
              } else if (editForm[field] === '2') {
                value = '否';
              }
              if (blBookData[field] === '1') {
                oldValue = '是';
              } else if (blBookData[field] === '2') {
                oldValue = '否';
              }
              contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
            } else {
              contentLog.push(`"${fieldLabelMap[field]}"由 [${blBookData[field] || ''}] 改为 [${editForm[field] || ''}]`);
            }
          }
        });
        const data = {
          id: blBookData.id,
          blbook_no: editForm.blbook_no,
          pre_blbook_no: editForm.pre_blbook_no,
          cop_manual_no: editForm.cop_manual_no,
          kik_blbook_no: editForm.kik_blbook_no,
          master_customs: editForm.master_customs,
          declarer_scc_code: editForm.declarer_scc_code,
          declarer_cus_code: editForm.declarer_cus_code,
          declarer_name: editForm.declarer_name,
          declarer_company_type: editForm.declarer_company_type,
          declarer_type: editForm.declarer_type,
          bwl_type: editForm.bwl_type,
          business_type: editForm.business_type,
          blbook_accounting: editForm.blbook_accounting,
          blbook_tax_rebate: editForm.blbook_tax_rebate,
          blbook_decl_date: editForm.blbook_decl_date,
          blbook_approved_date: editForm.blbook_approved_date,
          blbook_alter_date: editForm.blbook_alter_date,
          blbook_expiray_date: editForm.blbook_expiray_date,
          blbook_usage: editForm.blbook_usage,
          blbook_note: editForm.blbook_note,
          ftz_whse_code: editForm.ftz_whse_code,
          whse_vol: editForm.whse_vol,
          whse_area: editForm.whse_area,
          whse_name: editForm.whse_name,
          whse_address: editForm.warehouse_address,
          blbook_tel: editForm.blbook_tel,
          blbook_contact: editForm.blbook_contact,
        };
        this.props.updateBlBookHead(data, contentLog.length > 0 ? `修改账册表头 ${contentLog.join(';')}` : '').then((result) => {
          if (result.error) {
            message.error(result.error.message, 10);
          } else {
            this.props.notifyFormChanged(false);
            message.success(this.msg('savedSucceed'));
            this.props.loadBlBookHead(data.id);
          }
        });
      }
    });
  }
  render() {
    const {
      saving, blBookData, formChanged,
    } = this.props;
    const readonly = (blBookData.blbook_type === 'TW' || blBookData.blbook_type === 'L') && (blBookData.blbook_status === 3 && blBookData.sent_status !== 0);
    const { activeTabKey } = this.state;
    return (
      <Layout>
        <PageHeader
          breadcrumb={[
            blBookData.blbook_no || blBookData.cop_manual_no,
          ]}
        >
          {!readonly &&
            <PageHeader.Actions>
              {
                formChanged ? <Popconfirm disable={readonly} title={this.msg('discardConfirm')} onConfirm={this.handlecancel}>
                  <Button>{this.msg('cancel')}</Button>
                </Popconfirm> : <Button onClick={this.handlecancel} >{this.msg('cancel')}</Button>
              }
              <PrivilegeCover module="cwm" feature="blbook" action="edit">
                <Button type="primary" onClick={this.handleSubmit} loading={saving} disabled={!formChanged} >{this.msg('save')}</Button>
              </PrivilegeCover>
            </PageHeader.Actions>
                    }
        </PageHeader>
        <Content className="page-content">
          <MagicCard bodyStyle={{ padding: 0 }}>
            <Tabs activeKey={activeTabKey} onChange={this.handleTabChange}>
              <TabPane tab={this.msg('blbookHead')} key="bookHead"><BookHeadPane form={this.props.form} readonly={readonly} /></TabPane>
              {blBookData.blbook_status > 1 && <TabPane tab={this.msg('blbookGoods')} key="bookGoodsList"><BookBodyPane form={this.props.form} readonly={readonly} /></TabPane>}
              <TabPane tab={this.msg('logs')} key="logs" >
                <LogsPane
                  billNo={blBookData.blbook_no}
                  bizObject={SCOF_BIZ_OBJECT_KEY.CWM_BLBOOK.key}
                />
              </TabPane>
            </Tabs>
          </MagicCard>
        </Content>
      </Layout>
    );
  }
}
