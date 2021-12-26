import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Col, Card, Row, Steps, Icon } from 'antd';
import InfoItem from 'client/components/InfoItem';
import { getShipmtRoutePlaces } from 'common/reducers/shipment';
import * as Location from 'client/util/location';
import { formatMsg } from '../../message.i18n';

const { Step } = Steps;

@injectIntl
@connect(
  state => ({
    routePlaces: state.shipment.routePlaces,
  }),
  {
    getShipmtRoutePlaces,
  }
)
export default class ConsolidationPanel extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    shipmt: PropTypes.shape({ shipmt_no: PropTypes.string }).isRequired,
    editable: PropTypes.bool.isRequired,
    handleSaveShipment: PropTypes.func.isRequired,
  }
  componentDidMount() {
    this.props.getShipmtRoutePlaces(this.props.shipmt.shipmt_no);
  }
  msg = formatMsg(this.props.intl)
  render() {
    const { shipmt, editable, routePlaces } = this.props;
    return (
      <Row>
        <Col span={16}>
          <Card>
            <Row>
              <Col span={12}>
                <InfoItem
                  label="发货地"
                  field={shipmt.consigner_byname || Location.renderLoc(shipmt, 'consigner_province', 'consigner_city', 'consigner_district', 'consigner_street')}
                />
                <InfoItem
                  label={this.msg('pickupEstDate')}
                  type="date"
                  editable
                  field={shipmt.pickup_est_date ? moment(shipmt.pickup_est_date).format('YYYY-MM-DD') : null}
                  onEdit={value => this.props.handleSaveShipment('pickup_est_date', value && new Date(value), 'timeInfoChanged')}
                />
                <InfoItem
                  label="详细地址"
                  editable={editable}
                  field={shipmt.consigner_addr}
                  onEdit={value => this.props.handleSaveShipment('consigner_addr', value, 'consignerInfoChanged')}
                />
              </Col>
              <Col span={12}>
                <InfoItem
                  label="收货地"
                  field={shipmt.consignee_byname || Location.renderLoc(shipmt, 'consignee_province', 'consignee_city', 'consignee_district', 'consignee_street')}
                />
                <InfoItem
                  label={this.msg('deliveryEstDate')}
                  type="date"
                  editable
                  field={shipmt.deliver_est_date ? moment(shipmt.deliver_est_date).format('YYYY-MM-DD') : null}
                  onEdit={value => this.props.handleSaveShipment('deliver_est_date', value && new Date(value), 'timeInfoChanged')}
                />
                <InfoItem
                  label="详细地址"
                  editable={editable}
                  field={shipmt.consignee_addr}
                  onEdit={value => this.props.handleSaveShipment('consignee_addr', value, 'consigneeInfoChanged')}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="运输路径" bodyStyle={{ overflow: 'auto', height: 189 }}>
            <Steps direction="vertical" size="small">
              <Step status="finish" title={Location.renderLoc(shipmt, 'consigner_province', 'consigner_city', 'consigner_district', 'consigner_street')} icon={<Icon type="arrow-down" />} />
              {routePlaces.map(rp => (<Step status="finish" title={Location.renderLoc(rp, 'route_province', 'route_city', 'route_district', 'route_street')} icon={<Icon type="arrow-down" />} />))}
              <Step status="finish" title={Location.renderLoc(shipmt, 'consignee_province', 'consignee_city', 'consignee_district', 'consignee_street')} icon={<Icon type="arrow-down" />} />
            </Steps>
          </Card>
        </Col>
      </Row>
    );
  }
}
