import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { Card, Collapse } from 'antd';
import { GOODSTYPES, WRAP_TYPE, TRANS_MODES } from 'common/constants';
import DescriptionList from 'client/components/DescriptionList';
import { loadPartnerById } from 'common/reducers/partner';
import { toggleBizDock } from 'common/reducers/saasDockPool';
import { formatMsg } from '../message.i18n';

const { Panel } = Collapse;
const { Description } = DescriptionList;

@injectIntl
@connect(state => ({
  dockVisible: state.sofOrders.dock.visible,
  order: state.sofOrders.dock.order,
  uesrMembers: state.account.userMembers,
  countries: state.saasParams.latest.country,
  declPorts: state.saasParams.latest.port,
  currencies: state.saasParams.latest.currency,
  customsBrokers: state.saasParams.latest.customs,
}), {
  loadPartnerById, toggleBizDock,
})
export default class ShipmentGeneralPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    order: PropTypes.shape({
      shipmt_order_no: PropTypes.string,
    }).isRequired,
  }
  msg = formatMsg(this.props.intl)
  handleShowCusPanel = () => {
    this.props.loadPartnerById(this.props.order.customer_partner_id).then((result) => {
      // TODO move to PartnerDock
      if (!result.error) {
        this.props.toggleBizDock('ssoPartner', { customer: result.data });
      }
    });
  }
  handleShowProviderPanel = () => {
    this.props.loadPartnerById(this.props.order.provider_partner_id).then((result) => {
      if (!result.error) {
        this.props.toggleBizDock('ssoPartner', { customer: result.data });
      }
    });
  }
  render() {
    const { order } = this.props;
    const goods = GOODSTYPES.filter(gt => gt.value === order.cust_shipmt_goods_type)[0];
    // const transMode = TRANS_MODE.filter(tm => tm.value === order.cust_shipmt_trans_mode)[0];
    // const wrapType = WRAP_TYPE.filter(wt => wt.value === order.cust_shipmt_wrap_type)[0];
    const descItems = [];
    if (order.cust_shipmt_transfer !== 'DOM') {
      const shipmtTransMode = TRANS_MODES.find(mode => mode.value === order.cust_shipmt_trans_mode);
      if (order.cust_shipmt_trans_mode === '2') {
        descItems.push(<Description term="??????????????????">
          {shipmtTransMode && shipmtTransMode.text}
        </Description>);
        descItems.push(<Description term="?????????*????????????">
          {order.cust_shipmt_bill_lading}
        </Description>);
        descItems.push(<Description term="????????????">
          {order.cust_shipmt_bill_lading_no}
        </Description>);
        descItems.push(<Description term="??????">
          {order.cust_shipmt_vessel}
        </Description>);
        descItems.push(<Description term="??????">
          {order.cust_shipmt_voy}
        </Description>);
      } else if (order.cust_shipmt_trans_mode === '5') {
        descItems.push(<Description term="??????????????????">
          {shipmtTransMode && shipmtTransMode.text}
        </Description>);
        descItems.push(<Description term="????????????">
          {order.cust_shipmt_mawb}
        </Description>);
        descItems.push(<Description term="????????????">
          {order.cust_shipmt_hawb}
        </Description>);
        descItems.push(<Description term="?????????">
          {order.cust_shipmt_vessel}
        </Description>);
      }
      let labelCountry = '';
      let labelIEPort = '';
      if (order.cust_shipmt_transfer === 'EXP') {
        labelCountry = '?????????(??????)';
        labelIEPort = '????????????';
      } else if (order.cust_shipmt_transfer === 'IMP') {
        labelCountry = '?????????(??????)';
        labelIEPort = '????????????';
      }
      const origDestCountry = this.props.countries.find(cntry =>
        cntry.cntry_co === order.cust_shipmt_orig_dest_country);
      const shipmtIEport = this.props.declPorts.find(custport =>
        custport.code === order.cust_shipmt_i_e_port);
      descItems.push(<Description term={labelCountry}>
        {origDestCountry && `${order.cust_shipmt_orig_dest_country} | ${origDestCountry.cntry_name_cn}`}
      </Description>);
      descItems.push(<Description term={labelIEPort}>
        {shipmtIEport && `${order.cust_shipmt_i_e_port} | ${shipmtIEport.name}`}
      </Description>);
      descItems.push(<Description term="?????????">
        {order.cust_shipmt_dept_port}
      </Description>);
      descItems.push(<Description term="?????????">
        {order.cust_shipmt_dest_port}
      </Description>);
      const shipmtFreight = this.props.currencies.find(curr =>
        curr.curr_code === order.cust_shipmt_freight_currency);
      const shipmtInsurFee = this.props.currencies.find(curr =>
        curr.curr_code === order.cust_shipmt_insur_currency);
      const shipmtMiscFee = this.props.currencies.find(curr =>
        curr.curr_code === order.cust_shipmt_misc_currency);
      descItems.push(<Description term="??????????????????">
        {order.cust_shipmt_forwarder}
      </Description>);
      descItems.push(<Description term="??????">
        {shipmtFreight && `${order.cust_shipmt_freight} | ${shipmtFreight.curr_name}`}
      </Description>);
      descItems.push(<Description term="??????">
        {shipmtInsurFee && `${order.cust_shipmt_insur_fee} | ${shipmtInsurFee.curr_name}`}
      </Description>);
      descItems.push(<Description term="??????">
        {shipmtMiscFee && `${order.cust_shipmt_misc_fee} | ${shipmtMiscFee.curr_name}`}
      </Description>);
    }
    return (
      <div className="pane-content tab-pane">
        <Card bodyStyle={{ padding: 0 }}>
          <Collapse bordered={false} defaultActiveKey={['basic']}>
            <Panel header={this.msg('basicInfo')} key="basic">
              <DescriptionList col={2}>
                <Description term="????????????">{order.cust_shipmt_transfer}</Description>
                <Description term="???????????????">{order.cust_order_no}</Description>
                <Description term="????????????">{order.cust_shipmt_expedited}</Description>
                <Description term="????????????">{goods ? goods.text : ''}</Description>
                <Description term="?????????">{order.cust_shipmt_pieces}</Description>
                <Description term="??????">
                  {WRAP_TYPE.find(type => type.value === order.cust_shipmt_wrap_type) &&
                    WRAP_TYPE.find(type => type.value === order.cust_shipmt_wrap_type).text
                  }
                </Description>
                <Description term="?????????" addonAfter="KG">{order.cust_shipmt_weight}</Description>
                <Description term="CBM" addonAfter="?????????">{order.cust_shipmt_volume}</Description>
                {descItems}
              </DescriptionList>
            </Panel>
            <Panel header={this.msg('extendedInfo')} key="extended">
              <DescriptionList col={2}>
                <Description term="????????????1">{order.ext_attr_1}</Description>
                <Description term="????????????2">{order.ext_attr_2}</Description>
                <Description term="????????????3">{order.ext_attr_3}</Description>
                <Description term="????????????4">{order.ext_attr_4}</Description>
              </DescriptionList>
            </Panel>
            <Panel header={this.msg('sysInfo')} key="sysInfo">
              <DescriptionList col={2}>
                <Description term={this.msg('createdBy')}>
                  {this.props.uesrMembers.find(user =>
                  user.login_id === order.creater_login_id) &&
                  this.props.uesrMembers.find(user =>
                  user.login_id === order.creater_login_id).name}
                </Description>
                <Description term={this.msg('lastUpdatedBy')}>
                  {this.props.uesrMembers.find(user => user.login_id === order.last_updated_by) &&
                this.props.uesrMembers.find(user => user.login_id === order.last_updated_by).name}
                </Description>
                <Description term={this.msg('createdDate')}>{order.created_date && moment(order.created_date).format('YYYY.MM.DD HH:mm')}</Description>
                <Description term={this.msg('lastUpdatedDate')}>{order.last_updated_date && moment(order.last_updated_date).format('YYYY.MM.DD HH:mm')}</Description>
              </DescriptionList>
            </Panel>
          </Collapse>
        </Card>
      </div>
    );
  }
}
