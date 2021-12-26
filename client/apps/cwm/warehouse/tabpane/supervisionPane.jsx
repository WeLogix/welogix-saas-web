import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Card, Col, Row, Form, Select, message, Input } from 'antd';
import { updateWhse } from 'common/reducers/cwmWarehouse';
import { loadShFtzWhseSupervisionApps } from 'common/reducers/hubIntegration';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import { loadWhseContext } from 'common/reducers/cwmContext';
import { SASBL_BWL_TYPE } from 'common/constants';
import FormPane from 'client/components/FormPane';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
  colon: false,
};
const tailFormItemLayout = {
  wrapperCol: { span: 16, offset: 3 },
};
const fieldLabelMap = {};

function createFieldLabelMap(msg) {
  fieldLabelMap.customs_code = msg('customsCode');
  fieldLabelMap.ftz_whse_code = msg('ftzWhseCode');
  fieldLabelMap.bwl_type = msg('bwlType');
  fieldLabelMap.ftz_type = msg('supervisionSystem');
}

@injectIntl
@connect(
  state => ({
    customs: state.saasParams.latest.customs,
    whseSuppSHFtzApps: state.hubIntegration.whseSuppSHFtzApps,
  }),
  { loadShFtzWhseSupervisionApps, updateWhse, loadWhseContext }
)
@Form.create()
export default class SupervisionPane extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    warehouse: PropTypes.shape({
      ftz_type: PropTypes.string,
      ftz_integration_app_id: PropTypes.string,
      customs_code: PropTypes.string,
      ftz_whse_code: PropTypes.string,
      bwl_type: PropTypes.string,
      code: PropTypes.string.isRequired,
    }),
  }
  state = {
    limitedCustoms: [],
  }
  componentDidMount() {
    this.handleCustomsSel(this.props.warehouse.customs_code, this.props.customs);
    createFieldLabelMap(this.msg);
    this.props.loadShFtzWhseSupervisionApps();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.warehouse && nextProps.warehouse !== this.props.warehouse) {
      this.handleCustomsSel(nextProps.warehouse.customs_code, nextProps.customs);
      this.props.form.resetFields();
    }
  }
  msg = formatMsg(this.props.intl)
  handleCustomsSel = (whMasterCustoms, customsProps) => {
    let limitedCustoms = customsProps.slice(0, 20);
    if (whMasterCustoms) {
      if (!limitedCustoms.find(lcus => lcus.customs_code === whMasterCustoms)) {
        const selCustoms = this.props.customs.find(lcus => lcus.customs_code === whMasterCustoms);
        if (selCustoms) {
          limitedCustoms = [selCustoms].concat(limitedCustoms);
        }
      }
    }
    this.setState({
      limitedCustoms,
    });
  }
  handleSearch = (value) => {
    if (value) {
      const customs = this.props.customs.filter((item) => {
        const reg = new RegExp(value);
        return reg.test(item.customs_code) || reg.test(item.customs_name);
      });
      this.setState({
        limitedCustoms: customs.slice(0, 20),
      });
    }
  }

  handleSaveFtzApp = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        const { warehouse, customs } = this.props;
        const contentLog = [];
        ['bwl_type', 'customs_code', 'ftz_whse_code', 'ftz_type'].forEach((field) => {
          if (warehouse[field] !== values[field] &&
            !(!warehouse[field] && !values[field])) {
            if (field === 'customs_code') {
              const value = customs.find(cus => cus.customs_code === values[field]) &&
                customs.find(cus => cus.customs_code === values[field]).customs_name;
              const oldValue = customs.find(cus => cus.customs_code === warehouse[field]) &&
                customs.find(cus => cus.customs_code === warehouse[field]).customs_name;
              contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
            } else if (field === 'bwl_type') {
              const value = SASBL_BWL_TYPE.find(item => item.value === values[field]) &&
                SASBL_BWL_TYPE.find(item => item.value === values[field]).text;
              const oldValue = SASBL_BWL_TYPE.find(item => item.value === warehouse[field]) &&
                SASBL_BWL_TYPE.find(item => item.value === warehouse[field]).text;
              contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
            } else if (field === 'ftz_type') {
              const value = values[field] === 'SHFTZ' ? '上海自由贸易试验区仓储监管系统' : '金关二期特殊监管区域/保税物流管理系统';
              const oldValue = warehouse[field] === 'SHFTZ' ? '上海自由贸易试验区仓储监管系统' : '金关二期特殊监管区域/保税物流管理系统';
              contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue || ''}] 改为 [${value || ''}]`);
            } else {
              contentLog.push(`"${fieldLabelMap[field]}"由 [${warehouse[field] || ''}] 改为 [${values[field] || ''}]`);
            }
          }
        });
        this.props.updateWhse(values, warehouse.code, contentLog.length > 0 ? `编辑海关监管信息, ${contentLog.join(';')}` : '').then((result) => {
          if (result.error) {
            message.error(result.error.message);
          } else {
            this.props.loadWhseContext(this.props.warehouse.id);
            message.info('监管系统已设置');
          }
        });
      }
    });
  }
  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      whseSuppSHFtzApps,
      warehouse,
    } = this.props;
    const { limitedCustoms } = this.state;
    return (
      <FormPane>
        <Card>
          <Row>
            <Col span={8}>
              <FormItem label={this.msg('customsCode')} {...formItemLayout}>
                {(getFieldDecorator('customs_code', {
              rules: [{ required: true, message: this.msg('pleaseSelectCustomsCode') }],
              initialValue: warehouse && warehouse.customs_code,
            }))(<Select
              showSearch
              optionLabelProp="children"
              showArrow
              allowClear
              onSearch={this.handleSearch}
              filterOption={false}
            >
              {limitedCustoms.map(cus => (<Option value={cus.customs_code} key={cus.customs_code}>
                {cus.customs_code}|{cus.customs_name}</Option>))}
            </Select>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={this.msg('ftzWhseCode')} >
                {
              getFieldDecorator('ftz_whse_code', {
                rules: [{ required: true, message: this.msg('pleaseInputftzWhseCode') }],
                initialValue: warehouse && warehouse.ftz_whse_code,
              })(<Input />)
            }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={this.msg('bwlType')}>
                {getFieldDecorator('bwl_type', {
                rules: [{ required: true, message: this.msg('pleaseSelectBwlType') }],
                initialValue: warehouse && warehouse.bwl_type,
              })(<Select
                showSearch
                showArrow
                allowClear
                optionFilterProp="children"
              >
                {SASBL_BWL_TYPE.map(bwl => <Option value={bwl.value} key={bwl.text}>{`${bwl.value}|${bwl.text}`}</Option>)}
              </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem label={this.msg('supervisionSystem')} {...formItemLayout}>
                {getFieldDecorator('ftz_type', {
                rules: [{ required: true, message: this.msg('pleaseSelectFtzType') }],
                initialValue: warehouse && warehouse.ftz_type,
              })(<Select
                placeholder={this.msg('supSystemTypeSelect')}
                allowClear
              >
                <Option key="SHFTZ" value="SHFTZ">上海自由贸易试验区仓储监管系统</Option>
                <Option key="SASBL" value="SASBL">金关二期特殊监管区域/保税物流管理系统</Option>
              </Select>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={this.msg('integrationAppId')} {...formItemLayout}>
                {getFieldDecorator('ftz_integration_app_id', {
              initialValue: warehouse && warehouse.ftz_integration_app_id,
             })(<Select
               placeholder={this.msg('IntegrationAppIdSelect')}
               showSearch
               optionLabelProp="children"
               showArrow
               allowClear
               disabled={whseSuppSHFtzApps.length === 0 || getFieldValue('ftz_type') !== 'SHFTZ'}
             >
               {whseSuppSHFtzApps.map(wsa =>
                 <Option key={wsa.uuid} value={wsa.uuid}>{wsa.name}</Option>)}
             </Select>)}
              </FormItem>
            </Col>
          </Row>
          <FormItem {...tailFormItemLayout}>
            <PrivilegeCover module="cwm" feature="settings" action="edit">
              <Button type="primary" onClick={this.handleSaveFtzApp}>保存</Button>
            </PrivilegeCover>
          </FormItem>
        </Card>
      </FormPane>
    );
  }
}
