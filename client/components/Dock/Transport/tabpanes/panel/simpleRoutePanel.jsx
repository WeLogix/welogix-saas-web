import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';
import { Col, Row, Steps } from 'antd';
import InfoItem from 'client/components/InfoItem';
import * as Location from 'client/util/location';
import { formatMsg } from '../../message.i18n';

const { Step } = Steps;

@injectIntl
export default class SimpleRoutePanel extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    shipmt: PropTypes.shape({ shipmt_no: PropTypes.string }).isRequired,
    editable: PropTypes.bool.isRequired,
    handleSaveShipment: PropTypes.func.isRequired,
    upstream: PropTypes.shape({
      pickup_act_date: PropTypes.string,
    }),
  }
  msg = formatMsg(this.props.intl)
  render() {
    const { shipmt, editable, upstream } = this.props;
    return (
      <div className="trans_schedule">
        <div className="schedule">
          <Steps direction="vertical">
            <Step
              key={0}
              title={shipmt.consigner_name || (<div style={{ height: 26 }} />)}
              status="process"
              icon={<div className="icon">始</div>}
              description={
                <Row gutter={16} className="info-group-underline">
                  <Col span={12}>
                    <InfoItem
                      label={this.msg('pickupEstDate')}
                      type="date"
                      editable
                      field={shipmt.pickup_est_date ? moment(shipmt.pickup_est_date).format('YYYY-MM-DD') : null}
                      onEdit={value => this.props.handleSaveShipment('pickup_est_date', value && new Date(value), 'timeInfoChanged')}
                    />
                  </Col>
                  <Col span={12}>
                    <InfoItem
                      label={this.msg('pickupActDate')}
                      field={upstream.pickup_act_date && moment(upstream.pickup_act_date).format('YYYY.MM.DD')}
                    />
                  </Col>
                  <Col span={24}>
                    <InfoItem
                      label="发货地"
                      field={shipmt.consigner_byname || Location.renderLoc(shipmt, 'consigner_province', 'consigner_city', 'consigner_district', 'consigner_street')}
                    />
                  </Col>
                  <Col span={24}>
                    <InfoItem
                      label="详细地址"
                      editable={editable}
                      field={shipmt.consigner_addr}
                      onEdit={value => this.props.handleSaveShipment('consigner_addr', value, 'consignerInfoChanged')}
                    />
                  </Col>
                  <Col span={12}>
                    <InfoItem
                      label="联系人"
                      field={shipmt.consigner_contact}
                      editable={editable}
                      onEdit={value => this.props.handleSaveShipment('consigner_contact', value, 'consignerInfoChanged')}
                    />
                  </Col>
                  <Col span={12}>
                    <InfoItem
                      label="电话"
                      field={shipmt.consigner_mobile}
                      editable={editable}
                      onEdit={value => this.props.handleSaveShipment('consigner_mobile', value, 'consignerInfoChanged')}
                    />
                  </Col>
                </Row>}
            />
          </Steps>
        </div>
        <div className="schedule">
          <Steps direction="vertical">
            <Step
              key={0}
              title={shipmt.consignee_name || (<div style={{ height: 26 }} />)}
              status="process"
              icon={<div className="icon">终</div>}
              description={
                <Row gutter={16} className="info-group-underline">
                  <Col span={12}>
                    <InfoItem
                      label={this.msg('deliveryEstDate')}
                      type="date"
                      editable
                      field={shipmt.deliver_est_date ? moment(shipmt.deliver_est_date).format('YYYY-MM-DD') : null}
                      onEdit={value => this.props.handleSaveShipment('deliver_est_date', value && new Date(value), 'timeInfoChanged')}
                    />
                  </Col>
                  <Col span={12}>
                    <InfoItem
                      label={this.msg('deliverActDate')}
                      field={upstream.deliver_act_date && moment(upstream.deliver_act_date).format('YYYY.MM.DD')}
                    />
                  </Col>
                  <Col span={24}>
                    <InfoItem
                      label="收货地"
                      field={shipmt.consignee_byname || Location.renderLoc(shipmt, 'consignee_province', 'consignee_city', 'consignee_district', 'consignee_street')}
                    />
                  </Col>
                  <Col span={24}>
                    <InfoItem
                      label="详细地址"
                      editable={editable}
                      field={shipmt.consignee_addr}
                      onEdit={value => this.props.handleSaveShipment('consignee_addr', value, 'consigneeInfoChanged')}
                    />
                  </Col>
                  <Col span={12}>
                    <InfoItem
                      label="联系人"
                      field={shipmt.consignee_contact}
                      editable={editable}
                      onEdit={value => this.props.handleSaveShipment('consignee_contact', value, 'consigneeInfoChanged')}
                    />
                  </Col>
                  <Col span={12}>
                    <InfoItem
                      label="电话"
                      field={shipmt.consignee_mobile}
                      editable={editable}
                      onEdit={value => this.props.handleSaveShipment('consignee_mobile', value, 'consigneeInfoChanged')}
                    />
                  </Col>
                </Row>}
            />
          </Steps>
        </div>
      </div>
    );
  }
}
