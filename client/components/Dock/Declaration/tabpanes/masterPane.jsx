import React from 'react';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { Card, Collapse, Tag } from 'antd';
import { loadDeclHead } from 'common/reducers/cmsCustomsDeclare';
import { CMS_ENTRY_TYPE } from 'common/constants';
import DescriptionList from 'client/components/DescriptionList';
import { formatMsg } from '../message.i18n';

const { Panel } = Collapse;
const { Description } = DescriptionList;
const renderCombineData = (fieldVal, options) => {
  const foundOpt = options.find(opt => opt.value === fieldVal);
  const label = foundOpt ? `${foundOpt.value}|${foundOpt.text}` : fieldVal;
  return label && label.length > 0 ? <Tag>{label}</Tag> : null;
};

@injectIntl
@connect(
  state => ({
    previewer: state.cmsDelegationDock.previewer,
    tabKey: state.cmsDelegationDock.tabKey,
    head: state.cmsManifest.entryHead,
    ciqOrganization: state.saasParams.latest.ciqOrganization.map(f => ({
      value: f.org_code,
      text: f.org_name,
    })),
    customs: state.saasParams.latest.customs.map(f => ({
      value: f.customs_code,
      text: f.customs_name,
    })),
    country: state.saasParams.latest.country.map(item =>
      ({ value: item.cntry_co, text: item.cntry_name_cn })),
    tradeMode: state.saasParams.latest.tradeMode.map(f => ({
      value: f.trade_mode,
      text: f.trade_abbr,
    })),
    remissionMode: state.saasParams.latest.remissionMode.map(f => ({
      value: f.rm_mode,
      text: f.rm_abbr,
    })),
    transMode: state.saasParams.latest.transMode.map(f => ({
      value: f.trans_code,
      text: f.trans_spec,
    })),
    trxnMode: state.saasParams.latest.trxnMode.map(f => ({
      value: f.trx_mode,
      text: f.trx_spec,
    })),
    wrapType: state.saasParams.latest.wrapType,
  }),
  {
    loadDeclHead,
  },
)
export default class DelegationMasterPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  };
  msg = formatMsg(this.props.intl);
  render() {
    const {
      head,
      customs,
      country,
      tradeMode,
      remissionMode,
      transMode,
      trxnMode,
      wrapType,
      ciqOrganization,
    } = this.props;
    const domesticEntity = head.i_e_type === 0 ? 'domesticReceiver' : 'domesticSender';
    const overseaEntity = head.i_e_type === 0 ? 'overseaSender' : 'overseaReceiver';
    const owner = head.i_e_type === 0 ? 'ownerConsumeName' : 'ownerProduceName';
    const ieDate = head.i_e_type === 0 ? 'idate' : 'edate';
    const iePort = head.i_e_type === 0 ? 'entryCustoms' : 'exitCustoms';
    const deptDestcountry = head.i_e_type === 0 ? 'departCountry' : 'destinateCountry';
    return (
      <div className="pane-content tab-pane">
        <Card bodyStyle={{ padding: 0 }}>
          <Collapse bordered={false} defaultActiveKey={['relShipment', 'basicInfo']}>
            <Panel header={this.msg('basicInfo')} key="basicInfo">
              <DescriptionList col={2}>
                <Description term={this.msg('declPort')}>
                  {renderCombineData(head.decl_port, customs)}
                </Description>
                <Description term={this.msg(iePort)}>
                  {renderCombineData(head.i_e_port, customs)}
                </Description>
                <Description term={this.msg('entryType')}>
                  {renderCombineData(head.cdf_flag, CMS_ENTRY_TYPE)}
                </Description>
                <Description term={this.msg(ieDate)}>
                  {head.i_e_date && moment(head.i_e_date).format('YYYY-MM-DD')}
                </Description>
                <Description term={this.msg(domesticEntity)}>{head.trade_name}</Description>
                <Description term={this.msg(overseaEntity)}>{head.oversea_entity_name}</Description>
                <Description term={this.msg(owner)}>{head.owner_name}</Description>
                <Description term={this.msg('agentName')}>{head.agent_name}</Description>
                <Description term={this.msg('tradeMode')}>
                  {renderCombineData(head.trade_mode, tradeMode)}
                </Description>
                <Description term={this.msg('emsNo')}>{head.manual_no}</Description>
                <Description term={this.msg('trxMode')}>
                  {renderCombineData(head.trxn_mode, trxnMode)}
                </Description>
                <Description term={this.msg('rmModeName')}>
                  {renderCombineData(head.cut_mode, remissionMode)}
                </Description>
                <Description term={this.msg('tradeCountry')}>
                  {renderCombineData(head.trade_country, country)}
                </Description>
                <Description term={this.msg(deptDestcountry)}>
                  {renderCombineData(head.dept_dest_country, country)}
                </Description>
                <Description term={this.msg('transMode')}>
                  {renderCombineData(head.traf_mode, transMode)}
                </Description>
                <Description term={this.msg('ladingWayBill')}>{head.bl_wb_no}</Description>
                <Description term={this.msg('packCount')}>{head.pack_count}</Description>
                <Description term={this.msg('packType')}>
                  {renderCombineData(head.wrap_type, wrapType)}
                </Description>
                <Description term={this.msg('grossWeight')}>{head.gross_wt}</Description>
                <Description term={this.msg('netWeight')}>{head.net_wt}</Description>
              </DescriptionList>
            </Panel>
            <Panel header={this.msg('ciqInfo')} key="ciqInfo">
              <DescriptionList col={2}>
                <Description term={this.msg('orgCode')}>
                  {renderCombineData(head.ciq_orgcode, ciqOrganization)}
                </Description>
                <Description term={this.msg('vsaOrgCode')}>
                  {renderCombineData(head.vsa_orgcode, ciqOrganization)}
                </Description>
                <Description term={this.msg('inspOrgCode')}>
                  {renderCombineData(head.insp_orgcode, ciqOrganization)}
                </Description>
                <Description term={this.msg('purpOrgCode')}>
                  {renderCombineData(head.purp_orgcode, ciqOrganization)}
                </Description>
              </DescriptionList>
            </Panel>
          </Collapse>
        </Card>
      </div>
    );
  }
}
