import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { Collapse, Col, Table, Card, Menu, Row, message, Icon, Dropdown, notification } from 'antd';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import { PRESET_TRANSMODES, SHIPMENT_TRACK_STATUS, COURIERS } from 'common/constants';

import { showChangeShipmentModal, loadForm, computeSaleCharge, updateFee, loadShipmtCharges } from 'common/reducers/shipment';
import { updateLineFreight } from 'common/reducers/tmsExpense';
import { saveEdit } from 'common/reducers/transport-acceptance';
import { showChangeActDateModal } from 'common/reducers/trackingLandStatus';
import InfoItem from 'client/components/InfoItem';
import ChangeShipment from 'client/apps/transport/common/modal/changeShipmentModal';
import ConsolidationRoutePanel from './panel/consolidationRoutePanel';
import SimpleRoutePanel from './panel/simpleRoutePanel';
import { formatMsg } from '../message.i18n';
import './pane.less';

const { Panel } = Collapse;

@injectIntl
@connect(
  state => ({
    loginId: state.account.loginId,
    tenantId: state.account.tenantId,
    loginName: state.account.username,
    shipmt: state.shipment.previewer.shipmt,
    goodsTypes: state.shipment.formRequire.goodsTypes,
    packagings: state.shipment.formRequire.packagings,
    transitModes: state.shipment.formRequire.transitModes,
    vehicleTypes: state.shipment.formRequire.vehicleTypes,
    vehicleLengths: state.shipment.formRequire.vehicleLengths,
    containerPackagings: state.shipment.formRequire.containerPackagings,
    dispatch: state.shipment.previewer.dispatch,
    upstream: state.shipment.previewer.upstream,
    downstream: state.shipment.previewer.downstream,
    formData: state.shipment.formData,
    allCostFees: state.shipment.allCostFees,
    revenueFees: state.shipment.revenueFees,
    routePlaces: state.shipment.routePlaces,
  }),
  {
    showChangeShipmentModal,
    loadForm,
    saveEdit,
    computeSaleCharge,
    updateFee,
    showChangeActDateModal,
    loadShipmtCharges,
    updateLineFreight,
  }
)
export default class MasterPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    loginId: PropTypes.number.isRequired,
    tenantId: PropTypes.number.isRequired,
    shipmt: PropTypes.shape({ shipmt_no: PropTypes.string }).isRequired,
    showChangeShipmentModal: PropTypes.func.isRequired,
    loadForm: PropTypes.func.isRequired,
    saveEdit: PropTypes.func.isRequired,
    computeSaleCharge: PropTypes.func.isRequired,
    showChangeActDateModal: PropTypes.func.isRequired,
    loadShipmtCharges: PropTypes.func.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    this.props.loadForm(null, {
      tenantId: this.props.tenantId,
      shipmtNo: this.props.shipmt.shipmt_no,
    });
    this.props.loadShipmtCharges({ shipmtNo: this.props.shipmt.shipmt_no });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.shipmt.shipmt_no !== this.props.shipmt.shipmt_no) {
      this.props.loadForm(null, {
        tenantId: this.props.tenantId,
        shipmtNo: nextProps.shipmt.shipmt_no,
      });
      this.props.loadShipmtCharges({ shipmtNo: this.props.shipmt.shipmt_no });
    }
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('goodsCode'),
    dataIndex: 'goods_no',
  }, {
    title: this.msg('goodsName'),
    dataIndex: 'name',
  }, {
    title: this.msg('goodsPackage'),
    dataIndex: 'package',
  }, {
    title: this.msg('goodsCount'),
    dataIndex: 'count',
  }, {
    title: this.msg('goodsWeight'),
    dataIndex: 'weight',
  }, {
    title: this.msg('goodsVolume'),
    dataIndex: 'volume',
  }, {
    title: this.msg('goodsLength'),
    dataIndex: 'length',
  }, {
    title: this.msg('goodsWidth'),
    dataIndex: 'width',
  }, {
    title: this.msg('goodsHeight'),
    dataIndex: 'height',
  }, {
    title: this.msg('goodsRemark'),
    dataIndex: 'remark',
  }]
  computeSaleCharge = (changedData, form, type, msg) => {
    const {
      upstream, downstream, allCostFees,
      revenueFees, formData,
    } = this.props;
    let recvSumAmuont = 0;
    let paySumAmuont = 0;
    revenueFees.forEach((rev) => {
      recvSumAmuont += rev.sum_amount;
    });
    allCostFees.forEach((rev) => {
      paySumAmuont += rev.sum_amount;
    });
    const promises = [];
    const created = this.props.formData.created_date || Date.now();
    const srData = {
      partner_id: formData.customer_partner_id,
      goods_type: formData.goods_type,
      transport_mode_code: formData.transport_mode_code,
      ctn: formData.ctn,
      tenant_id: this.props.tenantId,
      created_date: created,
      vehicle_type_id: formData.vehicle_type_id,
      vehicle_length_id: formData.vehicle_length_id,
      total_weight: formData.total_weight,
      total_volume: formData.total_volume,
      pickup_est_date: formData.pickup_est_date,
      deliver_est_date: formData.deliver_est_date,
      tariffType: 'normal',
      ...changedData,
      consigner_region_code: formData.consigner_region_code,
      consigner_byname: formData.consigner_byname,
      consigner_province: formData.consigner_province,
      consigner_city: formData.consigner_city,
      consigner_district: formData.consigner_district,
      consigner_street: formData.consigner_street,
      consignee_region_code: formData.consignee_region_code,
      consignee_byname: formData.consignee_byname,
      consignee_province: formData.consignee_province,
      consignee_city: formData.consignee_city,
      consignee_district: formData.consignee_district,
      consignee_street: formData.consignee_street,
    };
    if (!changedData.goods_type && !changedData.transport_mode_code) {
      srData.quote_no = upstream.quote_no;
    }
    promises.push(this.props.computeSaleCharge(srData));
    const spData = {
      partner_id: downstream.sp_partner_id,
      goods_type: formData.goods_type,
      transport_mode_code: formData.transport_mode_code,
      ctn: formData.ctn,
      tenant_id: downstream.sp_tenant_id,
      created_date: created,
      vehicle_type_id: formData.vehicle_type_id,
      vehicle_length_id: formData.vehicle_length_id,
      total_weight: formData.total_weight,
      total_volume: formData.total_volume,
      pickup_est_date: formData.pickup_est_date,
      deliver_est_date: formData.deliver_est_date,
      tariffType: 'normal',
      ...changedData,
      consigner_region_code: formData.consigner_region_code,
      consigner_byname: formData.consigner_byname,
      consigner_province: formData.consigner_province,
      consigner_city: formData.consigner_city,
      consigner_district: formData.consigner_district,
      consigner_street: formData.consigner_street,
      consignee_region_code: formData.consignee_region_code,
      consignee_byname: formData.consignee_byname,
      consignee_province: formData.consignee_province,
      consignee_city: formData.consignee_city,
      consignee_district: formData.consignee_district,
      consignee_street: formData.consignee_street,
    };
    if (!changedData.goods_type && !changedData.transport_mode_code) {
      spData.quote_no = downstream.quote_no;
    }
    promises.push(this.props.computeSaleCharge(spData));
    Promise.all(promises).then((result) => {
      if (result[0]) {
        const charge = result[0].data;
        if (charge.freight >= 0) {
          // if (charge.freight !== recvSumAmuont) {
          notification.warn({
            message: msg,
            description: `原收入：${recvSumAmuont}, 现收入：${charge.freight}`,
          });
          this.props.updateLineFreight(upstream.id, {
            freight_charge: charge.freight,
            quote_no: charge.quoteNo,
            meter: charge.meter,
            unit_ratio: charge.unitRatio,
            charge_gradient: charge.gradient,
            chargeExpression: charge.chargeExpression,
          });
          // }
        } else {
          notification.warn({
            message: msg,
            description: '根据当前已有报价协议未计算出收入', // 您可以手动重新计算',
          });
          // this.props.updateFee(upstream.id, { need_recalculate: 1 });
        }
      }
      if (result[1]) {
        const charge = result[1].data;
        if (charge.freight >= 0) {
          // if (charge.freight !== paySumAmuont) {
          notification.warn({
            message: msg,
            description: `原成本：${paySumAmuont}, 现成本：${charge.freight}`,
          });
          this.props.updateLineFreight(downstream.id, {
            freight_charge: charge.freight,
            quote_no: charge.quoteNo,
            meter: charge.meter,
            unit_ratio: charge.unitRatio,
            charge_gradient: charge.gradient,
            chargeExpression: charge.chargeExpression,
          });
          // }
        } else {
          notification.warn({
            message: msg,
            description: '根据当前已有报价协议未计算出成本', // 您可以手动重新计算',
          });
          // this.props.updateFee(downstream.id, { need_recalculate: 1 });
        }
      }

      this.handleSave(form, type, msg);
    });
  }
  handleChangeDistance = (e) => {
    e.stopPropagation();
    const { shipmt } = this.props;
    this.props.showChangeShipmentModal({ visible: true, shipmtNo: shipmt.shipmt_no, type: 'distanceInfoChanged' });
  }
  handleChangeTransitConsigner = (e) => {
    e.stopPropagation();
    const { shipmt } = this.props;
    this.props.showChangeShipmentModal({ visible: true, shipmtNo: shipmt.shipmt_no, type: 'consignerInfoChanged' });
  }
  handleChangeTransitConsignee = (e) => {
    e.stopPropagation();
    const { shipmt } = this.props;
    this.props.showChangeShipmentModal({ visible: true, shipmtNo: shipmt.shipmt_no, type: 'consigneeInfoChanged' });
  }

  handleSave = (shipment, type, msg = '') => {
    const { tenantId, loginId } = this.props;
    this.props.saveEdit(shipment, tenantId, loginId, type, msg)
      .then((result) => {
        if (result.error) {
          message.error(result.error.message, 10);
        } else {
          message.success(this.msg('changeShipmentSuccess'));
        }
      });
  }
  handleSaveShipment = (field, value, type = '') => {
    const { formData, goodsTypes } = this.props;
    const form = { ...formData, [field]: value };
    if (field === 'container') {
      const msg = `集装箱：${formData.container} 变更为 ${value}`;
      this.computeSaleCharge({ [field]: value }, form, type, msg);
    } else if (field === 'goods_type') {
      const oldGoodsType = goodsTypes.find(item => item.value === formData.goods_type);
      const newGoodsType = goodsTypes.find(item => item.value === Number(value));
      const msg = `货物类型：${oldGoodsType.text} 变更为 ${newGoodsType.text}`;
      this.computeSaleCharge({ [field]: value }, form, type, msg);
    } else if (field === 'total_weight') {
      const msg = `总重量：${formData.total_weight} 变更为 ${value}`;
      this.computeSaleCharge({ [field]: value }, form, type, msg);
    } else if (field === 'total_volume') {
      const msg = `总体积：${formData.total_volume} 变更为 ${value}`;
      this.computeSaleCharge({ [field]: value }, form, type, msg);
    } else if (field === 'pickup_est_date') {
      if (!value) {
        form[field] = null;
      } else if (formData.deliver_est_date) {
        form.transit_time = moment(formData.deliver_est_date).diff(value, 'days');
      } else {
        formData.deliver_est_date = moment(value).add(formData.transit_time, 'days');
      }
      this.handleSave(form, type);
    } else if (field === 'deliver_est_date') {
      if (!value) {
        form[field] = null;
      } else if (formData.pickup_est_date) {
        form.transit_time = moment(value).diff(formData.pickup_est_date, 'days');
      } else if (formData.transit_time) {
        form.pickup_est_date = moment(value).subtract(formData.transit_time, 'days');
      }
      this.handleSave(form, type);
    } else {
      this.handleSave(form, type);
    }
  }
  handleSaveTransMode = (value, type = '') => {
    const { formData, transitModes } = this.props;
    const mode = transitModes.find(item => item.id === Number(value));
    const form = {
      ...formData,
      transport_mode_id: mode.id,
      transport_mode_code: mode.mode_code,
      transport_mode: mode.mode_name,
    };
    const msg = `运输模式：${formData.transport_mode} 变更为 ${mode.mode_name}`;
    this.computeSaleCharge({ transport_mode_code: mode.mode_code }, form, type, msg);
  }
  handleSaveVehicleType = (value, type = '') => {
    const { formData, vehicleTypes } = this.props;
    const vehicle = vehicleTypes.find(item => item.value === Number(value));
    const form = {
      ...formData,
      vehicle_type_id: vehicle.value,
      vehicle_type: vehicle.text,
    };
    const msg = `车辆类型：${formData.vehicle_type} 变更为 ${vehicle.text}`;
    this.computeSaleCharge({ vehicle_type_id: vehicle.value }, form, type, msg);
  }
  handleSaveVehicleLength = (value, type = '') => {
    const { formData, vehicleLengths } = this.props;
    const vehicle = vehicleLengths.find(item => item.value === Number(value));
    const form = {
      ...formData,
      vehicle_length_id: vehicle.value,
      vehicle_length: vehicle.text,
    };
    const msg = `车长：${formData.vehicle_length} 变更为 ${vehicle.text}`;
    this.computeSaleCharge({ vehicle_length_id: vehicle.value }, form, type, msg);
  }
  handleSaveCourier = (value, type = '') => {
    const { formData } = this.props;
    const courier = COURIERS.find(item => item.code === value);
    const form = {
      ...formData,
      courier_code: courier.code,
      courier: courier.name,
    };
    this.handleSave(form, type);
  }

  handleShowChangeActDateModal = (type) => {
    this.props.showChangeActDateModal(true, type);
  }
  render() {
    const {
      upstream, shipmt, goodsTypes, packagings, vehicleTypes, vehicleLengths,
      transitModes, containerPackagings,
    } = this.props;
    const pckg = packagings.find(item => item.package_code === shipmt.package);
    const goodsType = goodsTypes.find(item => item.value === shipmt.goods_type);
    const vehicleType = vehicleTypes.find(item => item.value === shipmt.vehicle_type_id);
    const vehicleLength = vehicleLengths.find(item => item.value === shipmt.vehicle_length_id);
    const editable = !upstream.parent_id && upstream.status > SHIPMENT_TRACK_STATUS.unaccepted
      && upstream.status < SHIPMENT_TRACK_STATUS.intransit;
    const changeDropdown = !upstream.parent_id
      && upstream.status > SHIPMENT_TRACK_STATUS.unaccepted ?
      (
        <Dropdown overlay={(
          <Menu>
            <Menu.Item>
              <a onClick={this.handleChangeTransitConsigner}>变更发货信息</a>
            </Menu.Item>
            <Menu.Item>
              <a onClick={this.handleChangeTransitConsignee}>变更收货信息</a>
            </Menu.Item>
            <Menu.Item disabled>
              <a onClick={this.handleChangeDistance}>变更里程数</a>
            </Menu.Item>
          </Menu>)}
        >
          <a className="ant-dropdown-link" onClick={ev => ev.stopPropagation()}>
            <Icon type="edit" /> 变更 <Icon type="down" />
          </a>
        </Dropdown>
      ) : <span />;
    const shipmtModeExtra =
    (<span>时效: {shipmt.transit_time}{this.msg('day')}/里程: {''}公里</span>);
    return (
      <div className="pane-content tab-pane">
        <Card bodyStyle={{ padding: 0 }} >
          <Collapse bordered={false} defaultActiveKey={['orderInfo', 'main', 'mode', 'cargo']}>
            {!shipmt.children ? <Panel header={<span>{this.msg('shipmtSchedule')}{shipmtModeExtra}<span className="pull-right">{changeDropdown}</span></span>} key="main">
              <SimpleRoutePanel
                shipmt={shipmt}
                editable={editable}
                upstream={upstream}
                handleSaveShipment={this.handleSaveShipment}
              />
            </Panel> :
            <Panel header={<span>{this.msg('shipmtSchedule')}</span>} key="main">
              <ConsolidationRoutePanel
                shipmt={shipmt}
                editable={editable}
                handleSaveShipment={this.handleSaveShipment}
              />
            </Panel>
            }
            <Panel header={this.msg('transitModeInfo')} key="mode">
              <Row gutter={16} className="info-group-underline">
                <Col span={8}>
                  <InfoItem
                    label={this.msg('transitModeInfo')}
                    field={shipmt.transport_mode}
                    editable={editable}
                    type="dropdown"
                    overlay={<Menu onClick={e => this.handleSaveTransMode(e.key, 'transitModeChanged')}>
                      {transitModes.map(tm => (<Menu.Item key={tm.id}>{tm.mode_name}</Menu.Item>))}
                    </Menu>}
                  />
                </Col>
                {shipmt.transport_mode_code === PRESET_TRANSMODES.ftl &&
                <Col span={8}>
                  <InfoItem
                    label={this.msg('vehicleType')}
                    field={vehicleType ? vehicleType.text : ''}
                    editable={editable}
                    type="dropdown"
                    overlay={<Menu onClick={e => this.handleSaveVehicleType(e.key, 'transitModeChanged')}>
                      {vehicleTypes.map(tm => (<Menu.Item key={tm.value}>{tm.text}</Menu.Item>))}
                    </Menu>}
                  />
                </Col>
                }
                {shipmt.transport_mode_code === PRESET_TRANSMODES.ftl &&
                <Col span={8}>
                  <InfoItem
                    label={this.msg('vehicleLength')}
                    field={vehicleLength ? vehicleLength.text : ''}
                    addonAfter="米"
                    editable={editable}
                    type="dropdown"
                    overlay={<Menu onClick={e => this.handleSaveVehicleLength(e.key, 'transitModeChanged')}>
                      {vehicleLengths.map(tm => (<Menu.Item key={tm.value}>{tm.text}</Menu.Item>))}
                    </Menu>}
                  />
                </Col>
                }
                {shipmt.transport_mode_code === PRESET_TRANSMODES.ctn &&
                <Col span={8}>
                  <InfoItem
                    label={this.msg('container')}
                    field={shipmt.container}
                    editable={editable}
                    type="dropdown"
                    overlay={<Menu onClick={e => this.handleSaveShipment('container', e.key, 'transitModeChanged')}>
                      {containerPackagings.map(tm =>
                        (<Menu.Item key={tm.key}>{tm.value}</Menu.Item>))}
                    </Menu>}
                  />
                </Col>
                }
                {shipmt.transport_mode_code === PRESET_TRANSMODES.ctn &&
                <Col span={8}>
                  <InfoItem
                    label={this.msg('containerNo')}
                    field={shipmt.container_no}
                    editable={editable}
                    onEdit={value => this.handleSaveShipment('container_no', value, 'transitModeChanged')}
                  />
                </Col>
                }
                {shipmt.transport_mode_code === PRESET_TRANSMODES.exp &&
                <Col span={8}>
                  <InfoItem
                    label={this.msg('courierCompany')}
                    field={shipmt.courier}
                    editable={editable}
                    type="dropdown"
                    overlay={<Menu onClick={e => this.handleSaveCourier(e.key, 'transitModeChanged')}>
                      {COURIERS.map(c => (<Menu.Item key={c.code}>{c.name}</Menu.Item>))}
                    </Menu>}
                  />
                </Col>
                }
                {shipmt.transport_mode_code === PRESET_TRANSMODES.exp &&
                <Col span={8}>
                  <InfoItem
                    label={this.msg('courierNo')}
                    field={shipmt.courier_no}
                    editable={editable}
                    onEdit={value => this.handleSaveShipment('courier_no', value, 'transitModeChanged')}
                  />
                </Col>
                }
              </Row>
            </Panel>
            <Panel header="货物信息" key="cargo">
              <Row gutter={16} className="info-group-underline">
                <Col span={8}>
                  <InfoItem
                    label={this.msg('goodsType')}
                    field={goodsType ? goodsType.text : shipmt.goods_type}
                    editable={editable}
                    type="dropdown"
                    overlay={<Menu onClick={e => this.handleSaveShipment('goods_type', e.key, 'goodsInfoChanged')}>
                      {goodsTypes.map(c =>
                        (<Menu.Item key={c.value}>{c.text}</Menu.Item>))}
                    </Menu>}
                  />
                </Col>
                <Col span={8}>
                  <InfoItem
                    label={this.msg('goodsPackage')}
                    field={pckg ? pckg.package_name : shipmt.package}
                    editable={editable}
                    type="dropdown"
                    overlay={<Menu onClick={e => this.handleSaveShipment('package', e.key, 'goodsInfoChanged')}>
                      {packagings.map(c =>
                        (<Menu.Item key={c.package_code}>{c.package_name}</Menu.Item>))}
                    </Menu>}
                  />
                </Col>
                <Col span={8}>
                  <InfoItem
                    label={this.msg('insuranceValue')}
                    field={shipmt.insure_value}
                    addonAfter="元"
                    editable={editable}
                    onEdit={value => this.handleSaveShipment('insure_value', value, 'goodsInfoChanged')}
                  />
                </Col>
                <Col span={8}>
                  <InfoItem
                    label={this.msg('totalCount')}
                    field={shipmt.total_count}
                    addonAfter="件"
                    editable={editable}
                    onEdit={value => this.handleSaveShipment('total_count', value, 'goodsInfoChanged')}
                  />
                </Col>
                <Col span={8}>
                  <InfoItem
                    label={this.msg('totalWeight')}
                    field={shipmt.total_weight}
                    addonAfter={this.msg('kilogram')}
                    editable={editable}
                    onEdit={value => this.handleSaveShipment('total_weight', value, 'goodsInfoChanged')}
                  />
                </Col>
                <Col span={8}>
                  <InfoItem
                    label={this.msg('totalVolume')}
                    field={shipmt.total_volume}
                    addonAfter={this.msg('cubicMeter')}
                    editable={editable}
                    onEdit={value => this.handleSaveShipment('total_volume', value, 'goodsInfoChanged')}
                  />
                </Col>
              </Row>
              <Table
                size="middle"
                columns={this.columns}
                pagination={false}
                dataSource={shipmt.goodslist}
              />
            </Panel>
          </Collapse>
        </Card>
        <PrivilegeCover module="transport" feature="shipment" action="edit">
          <ChangeShipment />
        </PrivilegeCover>
      </div>
    );
  }
}
