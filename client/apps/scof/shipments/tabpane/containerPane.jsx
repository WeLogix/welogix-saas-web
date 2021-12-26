import React, { Component } from 'react';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Button, Checkbox, Input, Select, message } from 'antd';
import { addOrderContainer, loadOrderContainers, removeOrderContainer } from 'common/reducers/sofOrders';
import DataPane from 'client/components/DataPane';
import RowAction from 'client/components/RowAction';
import { format } from 'client/common/i18n/helpers';
import { CMS_CNTNR_SPEC_CUS } from 'common/constants';
import messages from '../message.i18n';

const formatMsg = format(messages);
const { Option } = Select;

@injectIntl
@connect(
  state => ({
    formData: state.sofOrders.formData,
    containers: state.sofOrders.containers,
  }),
  { addOrderContainer, loadOrderContainers, removeOrderContainer }
)
export default class ContainerForm extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  state = {
    cntnrNo: '',
    cntnrSpec: '',
    isLcl: false,
  }
  componentWillMount() {
    this.props.loadOrderContainers(this.props.formData.shipmt_order_no);
  }
  msg = key => formatMsg(this.props.intl, key)
  containerColumns = [{
    title: '集装箱号',
    dataIndex: 'container_no',
  }, {
    title: '集装箱规格',
    dataIndex: 'container_type',
  }, {
    title: '是否拼箱',
    dataIndex: 'is_lcl',
    render: o => (o ? '是' : '否'),
  }, {
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    width: 45,
    render: (o, record) => <RowAction danger confirm="确定删除?" onConfirm={this.handleDelete} icon="delete" tooltip="删除" row={record} />,
  }];
  handleChange = (e) => {
    this.setState({
      cntnrNo: e.target.value,
    });
  }
  handleSelect = (value) => {
    this.setState({
      cntnrSpec: value,
    });
  }
  handleChecked = (e) => {
    this.setState({
      isLcl: e.target.checked,
    });
  }
  handleAdd = () => {
    const {
      cntnrNo, cntnrSpec, isLcl,
    } = this.state;
    if (!cntnrSpec) {
      message.warn('请填写集装箱规格');
    } else {
      this.props.addOrderContainer(
        this.props.formData.shipmt_order_no,
        cntnrNo, cntnrSpec, isLcl
      ).then((result) => {
        if (!result.error) {
          this.setState({
            cntnrNo: '',
            cntnrSpec: '',
            isLcl: false,
          });
          this.props.loadOrderContainers(this.props.formData.shipmt_order_no);
        }
      });
    }
  }
  handleDelete = (row) => {
    this.props.orderContainerRemove(row.id).then((result) => {
      if (!result.error) {
        this.props.loadOrderContainers(this.props.formData.shipmt_order_no);
      }
    });
  }
  render() {
    const {
      cntnrNo, cntnrSpec, isLcl,
    } = this.state;
    const { containers } = this.props;
    // todo required
    return (
      <DataPane
        columns={this.containerColumns}
        dataSource={containers.map((con, index) => ({
        index, ...con,
      }))}
        key="index"
      >
        <DataPane.Toolbar>
          <Input placeholder="集装箱号"value={cntnrNo} onChange={this.handleChange} style={{ width: 200 }} />
          <Select placeholder="集装箱规格" value={cntnrSpec} onSelect={this.handleSelect}>
            {CMS_CNTNR_SPEC_CUS.map(item =>
              <Option key={item.value} value={item.value}>{item.text}</Option>)}
          </Select>
          <Checkbox checked={isLcl} onChange={this.handleChecked}>是否拼箱</Checkbox>
          <Button type="primary" ghost icon="plus-circle-o" onClick={this.handleAdd}>添加</Button>
        </DataPane.Toolbar>
      </DataPane>
    );
  }
}
