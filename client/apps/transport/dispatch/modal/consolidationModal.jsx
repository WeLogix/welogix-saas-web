import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tabs, Card, Row, Col, Form, Layout, Input, Cascader, Select, Button, message } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import FullscreenModal from 'client/components/FullscreenModal';
import { toggleConsolidationModal, createConsolidation } from 'common/reducers/transportDispatch';
import { GOODSTYPES, EXPEDITED_TYPES } from 'common/constants';
import SubShipmtPane from '../tabPane/subShipmtPane';
import InputItem from '../../shipment/forms/input-item';
import ModeInfo from '../../shipment/forms/mode-info';
import { formatMsg } from '../message.i18n';

const { TabPane } = Tabs;
const { Content } = Layout;
const { Option } = Select;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const regionFieldArray = ['province', 'city', 'district', 'street'];

@injectIntl
@connect(
  state => ({
    visible: state.transportDispatch.consolidationModal.visible,
    subShipmts: state.transportDispatch.consolidationModal.subShipmts,
    transitModes: state.shipment.formRequire.transitModes,
    loginName: state.account.username,
  }),
  {
    toggleConsolidationModal, createConsolidation,
  }
)
@Form.create()
export default class ConsolidationModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    reload: PropTypes.func.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    originPlacesOptions: [],
    originPlace: {},
    destiPlacesOptions: [],
    destiPlace: {},
    routePlacesOptions: [],
    routePlaces: [],
    rawConsignerPlaces: [],
    rawConsigneePlaces: [],
    venues: [],
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && nextProps.visible !== this.props.visible) {
      const originPlacesOptions = this.createPlaceRenderOpts(nextProps.subShipmts, 'consigner');
      const destiPlacesOptions = this.createPlaceRenderOpts(nextProps.subShipmts, 'consignee');
      const rawConsignerPlaces = [];
      const rawConsigneePlaces = [];
      nextProps.subShipmts.forEach((shipmt) => {
        if (!rawConsignerPlaces.find(p => p.route_region_code === shipmt.consigner_region_code)) {
          rawConsignerPlaces.push({
            route_region_code: shipmt.consigner_region_code,
            route_province: shipmt.consigner_province,
            route_city: shipmt.consigner_city,
            route_district: shipmt.consigner_district,
            route_street: shipmt.consigner_street,
            route_addr: shipmt.consigner_addr,
          });
        }
        if (!rawConsigneePlaces.find(p => p.route_region_code === shipmt.consignee_region_code)) {
          rawConsigneePlaces.push({
            route_region_code: shipmt.consignee_region_code,
            route_province: shipmt.consignee_province,
            route_city: shipmt.consignee_city,
            route_district: shipmt.consignee_district,
            route_street: shipmt.consignee_street,
            route_addr: shipmt.consignee_addr,
          });
        }
      });
      this.setState({
        originPlacesOptions,
        destiPlacesOptions,
        rawConsignerPlaces,
        rawConsigneePlaces,
      });
    }
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.setState({
      routePlaces: [],
      venues: [],
    });
    this.props.toggleConsolidationModal(false);
  }
  handleOriginChange = (value) => {
    this.updatePlacesAndVenues(value, 'consigner');
  }
  handleDestiChange = (value) => {
    this.updatePlacesAndVenues(value, 'consignee');
  }
  handlePlusRoutePlace = () => {
    const routePlace = this.props.form.getFieldValue('route_place');
    const routePlaceAddress = this.props.form.getFieldValue('route_place_address');
    if (!routePlace) {
      return;
    }
    let venues = [...this.state.venues];
    const routePlaces = [...this.state.routePlaces];
    let rawConsignerPlaces = [...this.state.rawConsignerPlaces];
    let rawConsigneePlaces = [...this.state.rawConsigneePlaces];
    let routePlacesOptions = [...this.state.routePlacesOptions];
    const code = routePlace[routePlace.length - 1];
    const newRoute = {
      route_region_code: code,
      route_addr: routePlaceAddress,
    };
    const newVenues = rawConsignerPlaces.filter(p =>
      String(p.route_region_code).indexOf(newRoute.route_region_code) === 0).map(p => ({
      ...p,
      placeType: 'consigner',
    })).concat(rawConsigneePlaces.filter(p =>
      String(p.route_region_code).indexOf(newRoute.route_region_code) === 0).map(p => ({
      ...p,
      placeType: 'consignee',
    })));
    rawConsignerPlaces = rawConsignerPlaces.filter(p =>
      String(p.route_region_code).indexOf(newRoute.route_region_code) !== 0);
    rawConsigneePlaces = rawConsigneePlaces.filter(p =>
      String(p.route_region_code).indexOf(newRoute.route_region_code) !== 0);
    venues = venues.concat(newVenues.map(ve => ({
      ...ve,
      venueType: 'unload',
    })));
    for (let i = 0; i < routePlace.length; i++) {
      const regionCode = routePlace[i];
      const regionField = `route_${regionFieldArray[i]}`;
      const area = routePlacesOptions.find(op => op.value === regionCode);
      newRoute[regionField] = area.label;
      routePlacesOptions = area.children;
    }
    routePlaces.push(newRoute);
    routePlacesOptions = this.createPlaceRenderOpts(rawConsignerPlaces.concat(rawConsigneePlaces), 'route');
    this.props.form.setFieldsValue({
      route_place: '',
      route_place_address: '',
    });
    this.setState({
      routePlaces,
      venues,
      routePlacesOptions,
      rawConsignerPlaces,
      rawConsigneePlaces,
    });
  }
  handleMinusRoutePlace = (index) => {
    const routePlaces = [...this.state.routePlaces];
    const rawConsigneePlaces = [...this.state.rawConsigneePlaces];
    const rawConsignerPlaces = [...this.state.rawConsignerPlaces];
    const route = routePlaces[index];
    let venues = [...this.state.venues];
    const oldVenues = venues.filter(ve =>
      String(ve.route_region_code).indexOf(route.route_region_code) === 0 && ve.venueType === 'unload');
    venues = venues.filter(ve =>
      String(ve.route_region_code).indexOf(route.route_region_code) !== 0 || ve.venueType !== 'unload');
    routePlaces.splice(index, 1);
    for (let i = 0; i < oldVenues.length; i++) {
      const oldVenue = oldVenues[i];
      if (oldVenue.placeType === 'consigner') {
        rawConsigneePlaces.push({
          route_region_code: oldVenue.route_region_code,
          route_province: oldVenue.route_province,
          route_city: oldVenue.route_city,
          route_district: oldVenue.route_district,
          route_street: oldVenue.route_street,
          route_addr: oldVenue.route_addr,
        });
      } else {
        rawConsignerPlaces.push({
          route_region_code: oldVenue.route_region_code,
          route_province: oldVenue.route_province,
          route_city: oldVenue.route_city,
          route_district: oldVenue.route_district,
          route_street: oldVenue.route_street,
          route_addr: oldVenue.route_addr,
        });
      }
    }
    const routePlacesOptions = this.createPlaceRenderOpts(rawConsigneePlaces.concat(rawConsignerPlaces), 'route');
    this.setState({
      venues,
      routePlaces,
      rawConsigneePlaces,
      rawConsignerPlaces,
      routePlacesOptions,
    });
  }
  handleOk = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        const { originPlace, destiPlace } = this.state;
        const routePlaces = [...this.state.routePlaces];
        let routePlaceVarOpts = this.state.routePlacesOptions;
        let venues = [...this.state.venues];
        const routePlace = this.props.form.getFieldValue('route_place');
        if (!routePlace && routePlaceVarOpts.length > 0) {
          message.info('还有未选择的途经地');
          return;
        } else if (routePlaceVarOpts.length > 0) {
          const code = routePlace[routePlace.length - 1];
          const routePlaceAddress = this.props.form.getFieldValue('route_place_address');
          const remainPlaces =
          this.state.rawConsigneePlaces.concat(this.state.rawConsignerPlaces);
          const newVenues =
          remainPlaces.filter(rp => String(rp.route_region_code).indexOf(code) === 0);
          if (remainPlaces.length === newVenues.length) {
            const newRoute = {
              route_addr: routePlaceAddress,
              route_region_code: code,
            };
            for (let i = 0; i < routePlace.length; i++) {
              const regionCode = routePlace[i];
              const regionField = `route_${regionFieldArray[i]}`;
              const area = routePlaceVarOpts.find(op => op.value === regionCode);
              newRoute[regionField] = area.label;
              routePlaceVarOpts = area.children;
            }
            venues = venues.concat(newVenues.map(ve => ({
              ...ve,
              venueType: 'unload',
            })));
            routePlaces.push(newRoute);
          } else {
            message.info('途经地未选完全');
            return;
          }
        }
        const { transitModes, subShipmts } = this.props;
        const transit = transitModes.find(mode => mode.id === values.transport_mode_id);
        this.props.createConsolidation({
          consigner_region_code: originPlace.route_region_code,
          consigner_province: originPlace.route_province,
          consigner_city: originPlace.route_city,
          consigner_district: originPlace.route_district,
          consigner_street: originPlace.route_street,
          consigner_addr: originPlace.route_addr,
          consignee_region_code: destiPlace.route_region_code,
          consignee_province: destiPlace.route_province,
          consignee_city: destiPlace.route_city,
          consignee_district: destiPlace.route_district,
          consignee_street: destiPlace.route_street,
          consignee_addr: destiPlace.route_addr,
          deliver_est_date: values.deliver_est_date,
          pickup_est_date: values.pickup_est_date,
          transport_mode_id: transit.id,
          transport_mode_code: transit.mode_code,
          transport_mode: transit.mode_name,
          transit_time: values.transit_time,
          goods_type: GOODSTYPES[0].value,
          expeditedType: values.expeditedType,
          total_count: values.total_count,
          total_weight: values.total_weight,
          total_volume: values.total_volume,
          vehicle_length_id: values.vehicle_length_id,
          vehicle_type_id: values.vehicle_type_id,
          courier_code: values.courier_code,
          courier_no: values.courier_no,
          container: values.container,
          container_no: values.container_no,
          loginName: this.props.loginName,
          venues,
          routePlaces,
          subShipmtNos: subShipmts.map(shipmt => shipmt.shipmt_no),
        }).then((result) => {
          if (!result.error) {
            this.props.reload();
            this.handleCancel();
          }
        });
      }
    });
  }
  updatePlacesAndVenues = (placeRegionArray, field) => {
    let consignPlaces;
    let changePlace = {};
    let venues = [...this.state.venues].filter(ve => ve.venueType !== 'unload');
    let venueType;
    let placeOptions;
    const code = placeRegionArray[placeRegionArray.length - 1];
    if (field === 'consigner') {
      consignPlaces = [...this.state.rawConsignerPlaces];
      changePlace = { ...this.state.originPlace };
      venueType = 'pickup';
      placeOptions = this.state.originPlacesOptions;
    } else if (field === 'consignee') {
      consignPlaces = [...this.state.rawConsigneePlaces];
      changePlace = { ...this.state.destiPlace };
      venueType = 'deliver';
      placeOptions = this.state.destiPlacesOptions;
    }
    if (changePlace.route_region_code) {
      const oldVenues = venues.filter(venu =>
        String(venu.route_region_code).indexOf(changePlace.route_region_code) === 0);
      venues = venues.filter(venu =>
        String(venu.route_region_code).indexOf(changePlace.route_region_code) !== 0);
      consignPlaces = consignPlaces.concat(oldVenues);
    }
    venues = venues.concat(consignPlaces.filter(p =>
      String(p.route_region_code).indexOf(code) === 0).map(p => ({
      ...p,
      venueType,
    })));
    const consigns = consignPlaces.filter(p => String(p.route_region_code).indexOf(code) !== 0);
    changePlace = {
      route_region_code: code,
    };
    for (let i = 0; i < placeRegionArray.length; i++) {
      const regionCode = placeRegionArray[i];
      const regionField = `route_${regionFieldArray[i]}`;
      const area = placeOptions.find(op => op.value === regionCode);
      changePlace[regionField] = area.label;
      placeOptions = area.children;
    }
    const updateState = { venues, routePlaces: [] };
    if (field === 'consigner') {
      updateState.rawConsignerPlaces = consigns;
      updateState.originPlace = changePlace;
      updateState.routePlacesOptions = this.createPlaceRenderOpts(consigns.concat(this.state.rawConsigneePlaces), 'route');
    } else if (field === 'consignee') {
      updateState.rawConsigneePlaces = consigns;
      updateState.destiPlace = changePlace;
      updateState.routePlacesOptions = this.createPlaceRenderOpts(consigns.concat(this.state.rawConsignerPlaces), 'route');
    }
    this.setState(updateState);
  }
  handleOriginAddrChange = (value) => {
    const originPlace = { ...this.state.originPlace };
    originPlace.route_addr = value;
    this.setState({
      originPlace,
    });
  }
  handleDestiAddrChange = (value) => {
    const destiPlace = { ...this.state.destiPlace };
    destiPlace.route_addr = value;
    this.setState({
      destiPlace,
    });
  }
  handleMoveRoutePlace = (index, type) => {
    const routePlaces = [...this.state.routePlaces];
    const routePlace = routePlaces[index];
    routePlaces.splice(index, 1);
    if (type === 'down') {
      routePlaces.splice(index + 1, 0, routePlace);
    } else {
      routePlaces.splice(index - 1, 0, routePlace);
    }
    this.setState({
      routePlaces,
    });
  }
  createPlaceRenderOpts = (shipmts, field) => {
    const options = [];
    const findfn = regionCode => op => op.value === regionCode;
    for (let i = 0; i < shipmts.length; i++) {
      const shipmt = shipmts[i];
      const fullCode = String(shipmt[`${field}_region_code`]);
      let regionOpts = options;
      let regionCode;
      let oldRegionCode;
      for (let j = 0; j < 3; j++) {
        const column = `${field}_${regionFieldArray[j]}`;
        regionCode = fullCode.slice(0, (j + 1) * 2);
        if (oldRegionCode !== regionCode) {
          oldRegionCode = regionCode;
          const area = regionOpts.find(findfn(regionCode));
          if (!area) {
            const newData = {
              value: regionCode,
              label: shipmt[column],
              children: [],
            };
            regionOpts.push(newData);
            regionOpts = newData.children;
          } else {
            regionOpts = area.children;
          }
        }
      }
      if (regionCode !== fullCode) {
        const column = `${field}_${regionFieldArray[3]}`;
        const area = regionOpts.find(op => op.value === fullCode);
        if (!area) {
          regionOpts.push({
            value: fullCode,
            label: shipmt[column],
          });
        }
      }
    }
    return options;
  }
  renderPlaceName = item => [item.route_province, item.route_city, item.route_district, item.route_street].filter(area => area).join('/')
  render() {
    const {
      visible, form, form: { getFieldDecorator }, subShipmts, intl,
    } = this.props;
    const {
      originPlacesOptions, destiPlacesOptions, routePlacesOptions, routePlaces,
      rawConsignerPlaces, rawConsigneePlaces,
    } = this.state;
    let consignerAddres = [];
    let consigneeAddres = [];
    let routePlaceAddres = [];
    let routePlaceDisabled = true;
    const consignerPlace = this.props.form.getFieldValue('consigner_place');
    const consignerPlaceCode = consignerPlace && consignerPlace[consignerPlace.length - 1];
    const consigneePlace = this.props.form.getFieldValue('consignee_place');
    const consigneePlaceCode = consigneePlace && consigneePlace[consigneePlace.length - 1];
    const routePlace = this.props.form.getFieldValue('route_place');
    const routePlaceCode = routePlace && routePlace[routePlace.length - 1];
    if (consignerPlace && consigneePlace) {
      routePlaceDisabled = false;
    }
    if (consignerPlaceCode) {
      const filterShipmts =
      subShipmts.filter(shipmt => String(shipmt.consigner_region_code) === consignerPlaceCode);
      consignerAddres =
      filterShipmts.map(shipmt => ({ addr: shipmt.consigner_addr, shipmtNo: shipmt.shipmt_no }));
    }
    if (consigneePlaceCode) {
      const filterShipmts =
      subShipmts.filter(shipmt => String(shipmt.consignee_region_code) === consigneePlaceCode);
      consigneeAddres =
      filterShipmts.map(shipmt => ({ addr: shipmt.consignee_addr, shipmtNo: shipmt.shipmt_no }));
    }
    if (routePlaceCode) {
      routePlaceAddres = rawConsignerPlaces.concat(rawConsigneePlaces).filter(p =>
        String(p.route_region_code) === routePlaceCode).map(p => ({
        addr: p.route_addr, route_region_code: p.route_region_code,
      }));
    }
    const sumData = subShipmts.reduce((pre, cur) => {
      const data = { ...pre };
      data.totalCount += cur.total_count || 0;
      data.totalWeight += cur.total_weight || 0;
      data.totalVolume += cur.total_volume || 0;
      return data;
    }, {
      totalCount: 0,
      totalWeight: 0,
      totalVolume: 0,
    });
    return (
      <FullscreenModal
        maskClosable={false}
        title={this.msg('dispConsolidation')}
        visible={visible}
        onCancel={this.handleCancel}
        onSave={this.handleOk}
        destroyOnClose
      >
        <Tabs defaultActiveKey="transInfo">
          <TabPane tab={this.msg('transInfo')} key="transInfo">
            <Content>
              <Card>
                <Row>
                  <Col span={8}>
                    <FormItem label={this.msg('mainShipmtNo')} {...formItemLayout} />
                  </Col>
                  <Col span={8}>
                    <InputItem
                      formhoc={form}
                      labelName={this.msg('goodsType')}
                      field="goods_type"
                      formItemLayout={formItemLayout}
                      disabled
                      fieldProps={{ initialValue: GOODSTYPES[0].text }}
                    />
                  </Col>
                  <Col span={8}>
                    <InputItem
                      formhoc={form}
                      labelName={this.msg('expeditedType')}
                      field="expeditedType"
                      formItemLayout={formItemLayout}
                      disabled
                      fieldProps={{ initialValue: EXPEDITED_TYPES[0].text }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <InputItem
                      formhoc={form}
                      labelName={this.msg('totalCount')}
                      field="total_count"
                      formItemLayout={formItemLayout}
                      disabled
                      fieldProps={{ initialValue: sumData.totalCount }}
                    />
                  </Col>
                  <Col span={8}>
                    <InputItem
                      formhoc={form}
                      labelName={this.msg('totalWeight')}
                      field="total_weight"
                      formItemLayout={formItemLayout}
                      disabled
                      fieldProps={{ initialValue: sumData.totalWeight }}
                    />
                  </Col>
                  <Col span={8}>
                    <InputItem
                      formhoc={form}
                      labelName={this.msg('totalVolume')}
                      field="total_volume"
                      formItemLayout={formItemLayout}
                      disabled
                      fieldProps={{ initialValue: sumData.totalVolume }}
                    />
                  </Col>
                </Row>
              </Card>
              <Card>
                <ModeInfo
                  intl={intl}
                  formhoc={form}
                  formItemLayout={formItemLayout}
                />
              </Card>
              <Card>
                <Row>
                  <Col span={7} offset={1}>
                    <FormItem label={this.msg('consignerPlace')}>
                      {getFieldDecorator('consigner_place', {
                          rules: [{ required: true }],
                        })(<Cascader
                          options={originPlacesOptions}
                          placeholder="请选择始发地"
                          style={{ width: '100%' }}
                          onChange={this.handleOriginChange}
                          changeOnSelect
                        />)}
                    </FormItem>
                  </Col>
                  <Col span={7} offset={2}>
                    <FormItem label={this.msg('consignerAddr')}>
                      {getFieldDecorator('consigner_addr')(<Select
                        showSearch
                        optionFilterProp="children"
                        style={{ width: '100%' }}
                        onChange={this.handleOriginAddrChange}
                      >
                        {consignerAddres.map(addr =>
                          (<Option
                            key={addr.route_region_code}
                            value={addr.addr}
                          >
                            {addr.addr}
                          </Option>))}
                      </Select>)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={7} offset={1}>
                    <FormItem label={this.msg('consigneePlace')}>
                      {getFieldDecorator('consignee_place', {
                          rules: [{ required: true }],
                        })(<Cascader
                          options={destiPlacesOptions}
                          placeholder="请选择目的地"
                          style={{ width: '100%' }}
                          onChange={this.handleDestiChange}
                          changeOnSelect
                        />)}
                    </FormItem>
                  </Col>
                  <Col span={7} offset={2}>
                    <FormItem label={this.msg('consigneeAddr')}>
                      {getFieldDecorator('consignee_addr')(<Select
                        showSearch
                        optionFilterProp="children"
                        style={{ width: '100%' }}
                        onChange={this.handleDestiAddrChange}
                      >
                        {consigneeAddres.map(addr =>
                          <Option key={addr.shipmtNo} value={addr.addr} >{addr.addr}</Option>)}
                      </Select>)}
                    </FormItem>
                  </Col>
                </Row>
                {routePlaces.length > 0 && routePlaces.map((item, index) => (
                  <Row key={item.route_region_code}>
                    <Col span={7} offset={1}>
                      <FormItem label={this.msg('途经地')}>
                        <Input
                          value={this.renderPlaceName(item)}
                          style={{ width: '100%' }}
                          disabled
                        />
                      </FormItem>
                    </Col>
                    <Col span={7} offset={2}>
                      <FormItem label={this.msg('routeAddr')}>
                        <Input value={item.route_addr} disabled />
                      </FormItem>
                    </Col>
                    <Col span={4} offset={1}>
                      <FormItem label={this.msg('opCol')}>
                        <Button
                          type="primary"
                          icon="minus"
                          onClick={() => this.handleMinusRoutePlace(index)}
                          style={{ marginRight: 8 }}
                        />
                        {index !== 0 && <Button
                          type="primary"
                          icon="arrow-up"
                          onClick={() => this.handleMoveRoutePlace(index, 'up')}
                          style={{ marginRight: 8 }}
                        />}
                        {index !== routePlaces.length - 1 && <Button
                          type="primary"
                          icon="arrow-down"
                          onClick={() => this.handleMoveRoutePlace(index, 'down')}
                        />}
                      </FormItem>
                    </Col>
                  </Row>))}
                <Row>
                  <Col span={7} offset={1}>
                    <FormItem label={this.msg('routePlace')}>
                      {getFieldDecorator('route_place', {
                      })(<Cascader
                        options={routePlacesOptions}
                        disabled={routePlaceDisabled}
                        placeholder="请选择途经地"
                        style={{ width: '100%' }}
                        changeOnSelect
                      />)}
                    </FormItem>
                  </Col>
                  <Col span={7} offset={2}>
                    <FormItem label={this.msg('routeAddr')}>
                      {getFieldDecorator('route_place_address')(<Select
                        showSearch
                        optionFilterProp="children"
                        style={{ width: '100%' }}
                        disabled={routePlaceDisabled}
                      >
                        {routePlaceAddres.map(addr =>
                          <Option key={addr.shipmtNo} value={addr.addr} >{addr.addr}</Option>)}
                      </Select>)}
                    </FormItem>
                  </Col>
                  <Col span={4} offset={1}>
                    <FormItem label={this.msg('opCol')}>
                      <Button
                        disabled={routePlaceDisabled}
                        type="primary"
                        icon="plus"
                        onClick={this.handlePlusRoutePlace}
                      />
                    </FormItem>
                  </Col>
                </Row>
              </Card>
            </Content>
          </TabPane>
          <TabPane tab={this.msg('subShipmtsInfo')} key="subShipmtsInfo">
            <SubShipmtPane />
          </TabPane>
        </Tabs>
      </FullscreenModal>
    );
  }
}
