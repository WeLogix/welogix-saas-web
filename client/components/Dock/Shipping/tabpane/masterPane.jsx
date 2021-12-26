import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Collapse, Card, Tag } from 'antd';
import DescriptionList from 'client/components/DescriptionList';
import { loadCarriers } from 'common/reducers/cwmWarehouse';
import { clearSO } from 'common/reducers/cwmShippingOrder';
import { CWM_SO_TYPES, CWM_SHFTZ_OUT_REGTYPES, SASBL_REG_TYPES } from 'common/constants';
import { formatMsg } from '../message.i18n';

const { Panel } = Collapse;
const { Description } = DescriptionList;

@injectIntl
@connect(state => ({
  loginId: state.account.loginId,
  order: state.sofOrders.dock.order,
  defaultWhse: state.cwmContext.defaultWhse,
  carriers: state.cwmWarehouse.carriers,
}), { loadCarriers, clearSO })
export default class SOMasterPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    soHead: PropTypes.shape({ so_no: PropTypes.string }).isRequired,
  }
  componentWillMount() {
    this.props.loadCarriers(this.props.defaultWhse.code);
  }
  componentWillUnmount() {
    this.props.clearSO();
  }
  msg = formatMsg(this.props.intl)

  render() {
    const { soHead } = this.props;
    const contactNumber = `${soHead.receiver_phone || ''} ${soHead.receiver_number || ''}`;
    let soBondType = soHead.bonded_outtype ? CWM_SHFTZ_OUT_REGTYPES.concat(SASBL_REG_TYPES)
      .find(item => item.value === soHead.bonded_outtype) : null;
    if (soBondType) {
      soBondType = soBondType.text;
    }
    return (
      <div className="pane-content tab-pane">
        <Card bodyStyle={{ padding: 0 }} >
          <Collapse bordered={false} defaultActiveKey={['orderInfo', 'receiver', 'basic']}>
            <Panel header={this.msg('basicInfo')} key="basic">
              <DescriptionList col={2}>
                <Description term="货主" >{soHead.owner_name}</Description>
                <Description term="SO编号" >{soHead.so_no}</Description>
                <Description term="SO类型" >{soHead.so_type && CWM_SO_TYPES.find(item => item.value === soHead.so_type).text}</Description>
                <Description term="订单追踪号" >{soHead.cust_order_no}</Description>
                <Description term="保税类型" >{soHead.bonded ? <Tag color="green">保税</Tag> : <Tag>非保税</Tag>}</Description>
                <Description term="保税备案类型" >{(soHead.bonded_intype || soHead.bonded_intype === 0) && CWM_SHFTZ_OUT_REGTYPES.concat(SASBL_REG_TYPES).find(item => item.value === soHead.bonded_intype).text}</Description>
                <Description term="预期发货日期" >{moment(soHead.expect_shipping_date).format('YYYY.MM.DD')}</Description>
              </DescriptionList>
            </Panel>
            <Panel header="收货信息" key="receiver">
              <DescriptionList col={2}>
                <Description term="收货人" >{soHead.receiver_name}</Description>
                <Description term="联系人" >{soHead.receiver_contact}</Description>
                <Description term="联系方式" >{contactNumber}</Description>
                <Description term="地址" >{soHead.receiver_address}</Description>
              </DescriptionList>
            </Panel>
            <Panel header={this.msg('sysInfo')} key="sysInfo">
              <DescriptionList col={2}>
                <Description term={this.msg('createdBy')}>{soHead.created_by}</Description>
                <Description term={this.msg('lastUpdatedBy')}>{soHead.last_updated_by}</Description>
                <Description term={this.msg('createdDate')}>{soHead.created_date && moment(soHead.created_date).format('YYYY.MM.DD HH:mm')}</Description>
                <Description term={this.msg('lastUpdatedDate')}>{soHead.last_updated_date && moment(soHead.last_updated_date).format('YYYY.MM.DD HH:mm')}</Description>
              </DescriptionList>
            </Panel>
          </Collapse>
        </Card>
      </div>
    );
  }
}
