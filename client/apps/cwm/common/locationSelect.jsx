import React from 'react';
import PropTypes from 'prop-types';
import { Select, Modal, Form, Radio, Input } from 'antd';
import { connect } from 'react-redux';
import { loadLimitLocations, addLocation, loadZones } from 'common/reducers/cwmWhseLocation';
import { CWM_LOCATION_TYPES, CWM_LOCATION_STATUS } from 'common/constants';

const { Option } = Select;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

@connect(
  state => ({
    defaultWhse: state.cwmContext.defaultWhse,
    loginId: state.account.loginId,
  }),
  { loadLimitLocations, loadZones, addLocation }
)
@Form.create()
export default class LocationSelect extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    size: PropTypes.string,
    style: PropTypes.shape({}),
    onChange: PropTypes.func,
    onSelect: PropTypes.func,
    disabled: PropTypes.bool,
  }
  state = {
    options: [],
    location: '',
    visible: false,
    type: '1',
    status: '1',
    zones: [],
  }
  componentDidMount() {
    this.props.loadLimitLocations(this.props.defaultWhse.code, '').then((result) => {
      if (!result.error) {
        this.setState({
          options: result.data,
        });
      }
    });
    this.props.loadZones(this.props.defaultWhse.code).then((result) => {
      if (!result.error && result.data.length !== 0) {
        this.setState({
          zones: result.data,
        });
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ location: nextProps.value });
  }
  handleSearch = (value) => {
    this.props.loadLimitLocations(this.props.defaultWhse.code, '', value).then((result) => {
      if (!result.error) {
        this.setState({
          options: result.data,
        });
      }
    });
  }
  handleChange = (value) => {
    if (value === 'add') {
      this.setState({
        visible: true,
        status: CWM_LOCATION_STATUS[1].value,
      });
    } else {
      this.setState({ location: value });
      if (this.props.onChange) {
        this.props.onChange(value);
      }
    }
  }
  handleSelect = (value) => {
    if (value === 'add') {
      this.setState({
        visible: true,
        status: CWM_LOCATION_STATUS[1].value,
      });
    } else {
      this.setState({ location: value });
      if (this.props.onSelect) {
        this.props.onSelect(value);
      }
    }
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    });
    this.props.form.resetFields();
  }
  statusChange = (e) => {
    this.setState({
      status: e.target.value,
    });
  }
  typeChange = (e) => {
    this.setState({
      type: e.target.value,
    });
  }
  handleOk = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      const { type, status, options } = this.state;
      if (!err) {
        this.props.addLocation(
          this.props.defaultWhse.code, values.zone, values.location,
          type, status, this.props.loginId
        ).then((result) => {
          if (!result.error) {
            const newoptions = [...options];
            newoptions.unshift({
              location: values.location,
            });
            this.setState({ location: values.location, options: newoptions });
            if (this.props.onChange) {
              this.props.onChange(values.location);
            }
            if (this.props.onSelect) {
              this.props.onSelect(values.location);
            }
          }
          this.handleCancel();
        });
      }
    });
  }
  render() {
    const {
      visible, type, status, zones, options,
    } = this.state;
    const { form: { getFieldDecorator } } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    return (
      <span>
        <Select
          showSearch
          allowClear
          onSearch={this.handleSearch}
          value={this.state.location}
          disabled={this.props.disabled}
          size={this.props.size}
          onChange={this.handleChange}
          onSelect={this.handleSelect}
          optionFilterProp="children"
          style={this.props.style || {}}
          placeholder="库位"
        >
          {options.map(opt => (<Option value={opt.location} key={opt.location}>
            {opt.location}</Option>))}
          <Option value="add" key="add">添加库区库位</Option>
        </Select>
        <Modal visible={visible} title="添加库区库位" onCancel={this.handleCancel} onOk={this.handleOk} width={700}>
          <FormItem {...formItemLayout} label="库区">
            {getFieldDecorator('zone', {
              rules: [{ required: true }],
            })(<Select mode="combobox" style={{ width: '100%' }}>
              {zones.map(zone => (<Option value={zone.zone_code} key={zone.zone_code}>
                {zone.zone_code}</Option>))}
            </Select>)}
          </FormItem>
          <Form>
            <FormItem {...formItemLayout} label="库位编号">
              {getFieldDecorator('location', {
                rules: [{ required: true }],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="库位类型">
              <RadioGroup value={type} onChange={this.typeChange}>
                {CWM_LOCATION_TYPES.map(item => (<RadioButton key={item.value} value={item.value}>
                  {item.text}</RadioButton>))}
              </RadioGroup>
            </FormItem>
            <FormItem {...formItemLayout} label="库位状态">
              <RadioGroup value={status} onChange={this.statusChange}>
                {CWM_LOCATION_STATUS.map(item => (<RadioButton key={item.value} value={item.value}>
                  {item.text}</RadioButton>))}
              </RadioGroup>
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}
