import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { Tabs, Button, Form, Layout, message, Popconfirm } from 'antd';
import { connect } from 'react-redux';
import connectNav from 'client/common/decorators/connect-nav';
import PageHeader from 'client/components/PageHeader';
import MagicCard from 'client/components/MagicCard';
import { loadPtsInvtHead, notifyFormChanged, updatePtsInvtHead } from 'common/reducers/ptsImpExp';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import PtsInvtHeadPane from './tabpane/ptsInvtHeadPane';
import PtsInvtBodyPane from './tabpane/ptsInvtBodyPane';
import { formatMsg } from './message.i18n';

const { Content } = Layout;
const { TabPane } = Tabs;

@injectIntl
@connect(state => ({
  brokers: state.cwmContext.whseAttrs.brokers,
  formChanged: state.ptsImpExp.formChanged,
  invtData: state.ptsImpExp.invtData,
}), {
  loadPtsInvtHead, notifyFormChanged, updatePtsInvtHead,
})
@connectNav({
  depth: 3,
  moduleName: 'pts',
  title: 'featPtsImpExp',
  jumpOut: true,
})
@Form.create({ onValuesChange: props => props.notifyFormChanged(true) })
export default class InventoryRegDetail extends Component {
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
    const { params } = this.props;
    if (params.invtNo) {
      this.props.loadPtsInvtHead(params.invtNo);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.params.invtNo && nextProps.params.invtNo !== this.props.params.invtNo) {
      this.props.loadPtsInvtHead(nextProps.params.invtNo);
    }
  }
  msg = formatMsg(this.props.intl);
  handleCancel = () => {
    const { ieType } = this.props.params;
    this.props.notifyFormChanged(false);
    this.context.router.push(`/pts/${ieType === 'i' ? 'import' : 'export'}/${ieType}`);
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
        const { invtData } = this.props;
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
        this.props.updatePtsInvtHead(data).then((result) => {
          if (result.error) {
            message.error(result.error.message, 10);
          } else {
            this.props.notifyFormChanged(false);
            message.success(this.msg('savedSucceed'));
          }
          this.props.loadPtsInvtHead(invtData.cop_invt_no);
        });
      }
    });
  }
  render() {
    const { formChanged, invtData } = this.props;
    const { ieType, invtNo } = this.props.params;
    const readonly = invtData && invtData.invt_status !== 1;
    const { selectedKey } = this.state;
    return (
      <Layout>
        <PageHeader
          breadcrumb={[
            ieType === 'i' ? this.msg('importInventory') : this.msg('exportInventory'),
            invtNo,
          ]}
        >
          <PageHeader.Actions>
            {
                formChanged ? <Popconfirm title={this.msg('confirmCancel')} onConfirm={this.handleCancel}>
                  <Button>{this.msg('cancel')}</Button>
                </Popconfirm> : <Button onClick={this.handleCancel} >{this.msg('cancel')}</Button>
              }
            <PrivilegeCover module="cwm" feature="supervision" action="edit">
              <Button type="primary" onClick={this.handleSubmit} disabled={!formChanged} >{this.msg('save')}</Button>
            </PrivilegeCover>
          </PageHeader.Actions>
        </PageHeader>
        <Content className="page-content">
          <MagicCard bodyStyle={{ padding: 0 }}>
            <Tabs activeKey={selectedKey} onChange={this.handleMenuItemClick}>
              <TabPane tab={this.msg('invtHead')} key="invtHead"><PtsInvtHeadPane form={this.props.form} readonly={readonly} /></TabPane>
              <TabPane tab={this.msg('invtBody')} key="invtBody"><PtsInvtBodyPane
                readonly={readonly}
                form={this.props.form}
                copInvtNo={this.props.params.invtNo}
              /></TabPane>
            </Tabs>
          </MagicCard>
        </Content>
      </Layout>
    );
  }
}
