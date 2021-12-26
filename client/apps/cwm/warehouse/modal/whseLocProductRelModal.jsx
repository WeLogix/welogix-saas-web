import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import RowAction from 'client/components/RowAction';
import { Col, Modal, Form, Input, message, Button, Row, Select } from 'antd';
import { toggleProductConfigModal, createLocProductconfig, getLocProductconfig } from 'common/reducers/cwmWhseLocation';
import { loadProducts, clearProductNos } from 'common/reducers/cwmSku';
import { formatMsg } from '../message.i18n';

const { Option } = Select;

@injectIntl
@connect(state => ({
  productConfigModal: state.cwmWhseLocation.productConfigModal,
  visible: state.cwmWhseLocation.productConfigModal.visible,
  productNos: state.cwmSku.productNos,
  whseOwners: state.cwmWarehouse.whseOwners,
}), {
  toggleProductConfigModal,
  createLocProductconfig,
  getLocProductconfig,
  loadProducts,
  clearProductNos,
})
@Form.create()
export default class WhseLocProductRelModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    whseCode: PropTypes.string.isRequired,
  }
  state = {
    /** @type {{product_no:string,product_capacity:number}[]} */
    productConfigs: [{}],
    /** @type {{update:{},id:nubmer}[]} */
    configsUpdate: [],
    /** @type {number[]} */
    configsDelete: [],
    /** @type {{product_no:string,product_capacity:number}[]} */
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && !this.props.visible) {
      this.props.getLocProductconfig(nextProps.whseCode, nextProps.productConfigModal.location)
        .then((result) => {
          if (!result.error && result.data.length > 0) {
            this.setState({ productConfigs: result.data });
          }
        });
    }
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.props.toggleProductConfigModal(false);
    this.props.clearProductNos();
    this.setState({
      productConfigs: [{}],
      configsUpdate: [],
      configsDelete: [],
    });
  }
  handleAdd = () => {
    const { productConfigs } = this.state;
    if (productConfigs.length === 0 || productConfigs[productConfigs.length - 1].product_no) {
      this.setState({ productConfigs: [...productConfigs, {}] });
    }
  }
  handleDelete = (index) => {
    const { productConfigs, configsDelete, configsUpdate } = this.state;
    const deletedItem = productConfigs[index];
    if (!deletedItem.product_no) {
      return;
    }
    const newStateInfo = {
      productConfigs: productConfigs.filter((obj, i) => i !== index),
    };
    if (deletedItem.id) { // delete from update
      newStateInfo.configsDelete = [...configsDelete, deletedItem.id];
      newStateInfo.configsUpdate = configsUpdate.filter(obj => obj.id !== deletedItem.id);
    }
    this.setState(newStateInfo);
  }
  handleEditStateVal = (field, value, index) => {
    const { configsUpdate, productConfigs } = this.state;
    const newState = {
      productConfigs: productConfigs.map((obj, i) => {
        if (i === index) {
          return {
            ...obj, [field]: value,
          };
        }
        return obj;
      }),
    };
    const config = productConfigs[index];
    if (config.id) { // 更新 或 push 到 update
      const newUpdate = {
        id: config.id,
        update: {
          product_no: config.product_no,
          product_capacity: config.product_capacity,
          loc_secure_stock: config.loc_secure_stock,
        },
      };
      const confIndex = configsUpdate.findIndex(obj => obj.id === config.id);
      if (confIndex >= 0) {
        newState.configsUpdate = configsUpdate.map((obj) => {
          if (obj.id === config.id) {
            return newUpdate;
          }
          return obj;
        });
      } else {
        newState.configsUpdate = newState.configsUpdate.concat(newUpdate);
      }
    }
    this.setState(newState);
  }
  handleValEdit = (index, field) => (value) => {
    if (field === 'product_capacity' || field === 'loc_secure_stock') {
      if (value <= 0) {
        message.warn(this.msg('capacityShouldBePositive'));
      }
    }
    this.handleEditStateVal(field, value, index);
  }
  handleEventEdit = (index, field) => (event) => {
    this.handleEditStateVal(field, event.target.value, index);
  }
  handleSearch = (index, field) => (value) => {
    if (value.length >= 3) {
      this.props.loadProducts(value, this.props.whseOwners.map(obj => obj.owner_partner_id));
    }
    this.handleValEdit(index, field)(value);
  }
  handleSubmit = () => {
    const {
      productConfigs, configsUpdate, configsDelete,
    } = this.state;

    const prdNoAppeared = {};
    for (let i = 0; i < productConfigs.length; i++) {
      const config = productConfigs[i];
      if (!config.product_no) {
        message.warn(this.msg('emptyProducNoOrCapacity'));
        return;
      } else if (!prdNoAppeared[config.product_no]) {
        prdNoAppeared[config.product_no] = true;
      } else {
        message.warn(this.msg('duplicateProductNo'));
        return;
      }
      if (config.product_no && !config.product_capacity) {
        message.warn(this.msg('emptyProducNoOrCapacity'));
        return;
      }
    }
    this.props.createLocProductconfig({
      configsUpdate,
      configsDelete,
      configsCreate: productConfigs.filter(obj => !obj.id),
      whseCode: this.props.whseCode,
      location: this.props.productConfigModal.location,
    }).then((result) => {
      if (!result.error) {
        message.info(this.msg('opSucceed'));
        this.handleCancel();
      }
    });
  }
  render() {
    const { productConfigs } = this.state;
    const { productNos } = this.props;
    const title = '库位设置';
    return (
      <Modal
        maskClosable={false}
        title={title}
        onCancel={this.handleCancel}
        visible={this.props.visible}
        onOk={this.handleSubmit}
      >
        <Form>
          {productConfigs.map((config, index) => (
            <Row gutter={8} style={{ marginBottom: 8 }}>
              <Col span={12}>
                <Select
                  value={config.product_no}
                  mode="combobox"
                  placeholder="货号(请输入3位以上字符)"
                  onChange={this.handleSearch(index, 'product_no')}
                  onSelect={this.handleValEdit(index, 'product_no')}
                >
                  {productNos.map(productNo => (
                    <Option value={productNo} key={productNo}>
                      {productNo}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col span={5}>
                <Input
                  type="number"
                  onChange={this.handleEventEdit(index, 'product_capacity')}
                  value={config.product_capacity}
                  placeholder="库存容量"
                />
              </Col>
              <Col span={5}>
                <Input
                  type="number"
                  onChange={this.handleEventEdit(index, 'loc_secure_stock')}
                  value={config.loc_secure_stock}
                  placeholder="安全库存"
                />
              </Col>
              <Col span={2}>
                <RowAction row={index} danger onClick={this.handleDelete} icon="minus-circle" />
              </Col>
            </Row>
          ))}
        </Form>
        <Button
          block
          type="dashed"
          icon="plus-circle"
          onClick={this.handleAdd}
          style={{ marginTop: 8 }}
        >
          {this.msg('addProductNo')}
        </Button>
      </Modal>
    );
  }
}
