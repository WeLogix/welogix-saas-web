import React from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { Card, Collapse } from 'antd';
import DescriptionList from 'client/components/DescriptionList';
import CountryFlag from 'client/components/CountryFlag';
import { PARTNER_ROLES } from 'common/constants';
import { formatMsg } from 'client/apps/scof/partner/message.i18n';

const { Panel } = Collapse;
const { Description } = DescriptionList;

@injectIntl
export default class PartnerMasterPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }

  msg = formatMsg(this.props.intl)
  render() {
    const { partner } = this.props;
    let codeTerm = '';
    let nameTerm = '';
    if (partner.role === PARTNER_ROLES.CUS || partner.role === PARTNER_ROLES.OWN) {
      codeTerm = this.msg('customerCode');
      nameTerm = this.msg('customerName');
    } else if (partner.role === PARTNER_ROLES.SUP) {
      codeTerm = this.msg('supplierCode');
      nameTerm = this.msg('supplierName');
    } else if (partner.role === PARTNER_ROLES.VEN) {
      codeTerm = this.msg('vendorCode');
      nameTerm = this.msg('vendorName');
    }
    return (
      <div className="pane-content tab-pane">
        <Card bodyStyle={{ padding: 0 }}>
          <Collapse bordered={false} defaultActiveKey={['basicInfo']}>
            <Panel header={this.msg('basicInfo')} key="basicInfo">
              <DescriptionList col={2}>
                <Description term={codeTerm}>{partner.partner_code}</Description>
                <Description term={nameTerm}>{partner.name}</Description>
                <Description term={this.msg('displayName')}>{partner.display_name}</Description>
                <Description term={this.msg('englishName')}>{partner.en_name}</Description>
                <Description term={this.msg('country')}><CountryFlag code={partner.country} /></Description>
                <Description term={this.msg('uscCode')}>{partner.partner_unique_code && partner.partner_unique_code.slice(0, 18)}</Description>
                <Description term={this.msg('customsCode')}>{partner.customs_code}</Description>
                <Description term={this.msg('addonCode')}>{partner.partner_unique_code && partner.partner_unique_code.slice(18)}</Description>
                <Description term={this.msg('contact')}>{partner.contact}</Description>
                <Description term={this.msg('phone')}>{partner.phone}</Description>
                <Description term={this.msg('email')}>{partner.email}</Description>
              </DescriptionList>
            </Panel>
            <Panel header={this.msg('sysInfo')} key="sysInfo">
              <DescriptionList col={2}>
                <Description term={this.msg('createdBy')}>{partner.created_by}</Description>
                <Description term={this.msg('lastUpdatedBy')}>{partner.last_updated_by}</Description>
                <Description term={this.msg('createdDate')}>{partner.created_date && moment(partner.created_date).format('YYYY.MM.DD HH:mm')}</Description>
                <Description term={this.msg('lastUpdatedDate')}>{partner.last_updated_date && moment(partner.last_updated_date).format('YYYY.MM.DD HH:mm')}</Description>
              </DescriptionList>
            </Panel>
          </Collapse>
        </Card>
      </div>
    );
  }
}
