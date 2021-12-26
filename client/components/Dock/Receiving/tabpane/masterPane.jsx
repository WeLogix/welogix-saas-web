import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Collapse, Card, Tag } from 'antd';
import { clearAsn } from 'common/reducers/cwmReceive';
import DescriptionList from 'client/components/DescriptionList';
import { CWM_ASN_TYPES, CWM_SHFTZ_IN_REGTYPES, SASBL_REG_TYPES } from 'common/constants';
import { formatMsg } from '../message.i18n';

const { Panel } = Collapse;
const { Description } = DescriptionList;

@injectIntl
@connect(() => ({
}), {
  clearAsn,
})
export default class ASNMasterPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    asnHead: PropTypes.shape({ asn_no: PropTypes.string }).isRequired,
  }
  componentWillUnmount() {
    this.props.clearAsn();
  }
  msg = formatMsg(this.props.intl)
  render() {
    const { asnHead } = this.props;
    let asnBondType = asnHead.bonded_intype ? CWM_SHFTZ_IN_REGTYPES.concat(SASBL_REG_TYPES)
      .find(item => item.value === asnHead.bonded_intype) : null;
    if (asnBondType) {
      asnBondType = asnBondType.text;
    }
    return (
      <div className="pane-content tab-pane">
        <Card bodyStyle={{ padding: 0 }} >
          <Collapse bordered={false} defaultActiveKey={['orderInfo', 'basic']}>
            <Panel header={this.msg('basicInfo')} key="basic">
              <DescriptionList col={2}>
                <Description term="货主" >{asnHead.owner_name} </Description>
                <Description term="ASN编号" >{asnHead.asn_no} </Description>
                <Description term="ASN类型" >{asnHead.asn_type && CWM_ASN_TYPES.find(item => item.value === asnHead.asn_type).text} </Description>
                <Description term="订单追踪号" >{asnHead.cust_order_no} </Description>
                <Description term="保税类型" >{asnHead.bonded ? <Tag color="green">保税</Tag> : <Tag>非保税</Tag>} </Description>
                <Description term="保税备案类型" >{(asnHead.bonded_intype || asnHead.bonded_intype === 0) && CWM_SHFTZ_IN_REGTYPES.concat(SASBL_REG_TYPES).find(item => item.value === asnHead.bonded_intype).text} </Description>
                <Description term="预期总数量" />
                <Description term="预期总体积" />
                <Description term="预计到货日期">{asnHead.expect_receive_date && moment(asnHead.expect_receive_date).format('YYYY.MM.DD')} </Description>
                <Description term="收货总数量" />
                <Description term="收货总体积" />
                <Description term="实际收货时间">{asnHead.received_date && moment(asnHead.received_date).format('YYYY.MM.DD HH:mm')} </Description>
              </DescriptionList>
            </Panel>
            <Panel header={this.msg('sysInfo')} key="sysInfo">
              <DescriptionList col={2}>
                <Description term={this.msg('createdBy')}>{asnHead.created_by}</Description>
                <Description term={this.msg('lastUpdatedBy')}>{asnHead.last_updated_by}</Description>
                <Description term={this.msg('createdDate')}>{asnHead.created_date && moment(asnHead.created_date).format('YYYY.MM.DD HH:mm')}</Description>
                <Description term={this.msg('lastUpdatedDate')}>{asnHead.last_updated_date && moment(asnHead.last_updated_date).format('YYYY.MM.DD HH:mm')}</Description>
              </DescriptionList>
            </Panel>
          </Collapse>
        </Card>
      </div>
    );
  }
}
