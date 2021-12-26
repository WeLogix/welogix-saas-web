import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Card, Col, Icon, Input, Radio, Row, Form, message } from 'antd';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
// import RegionCascader from 'client/components/RegionCascader';
import FormPane from 'client/components/FormPane';
import { editWarehouse } from 'common/reducers/cwmWarehouse';
import { loadWhse, loadWhseContext, switchDefaultWhse } from 'common/reducers/cwmContext';
import { PARTNER_ROLES } from 'common/constants';
import BlCusSccAutoComplete from '../../sasbl/common/blCusSccAutoComplete';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
  colon: false,
};
const formItemSpan2Layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
  colon: false,
};
const tailFormItemLayout = {
  wrapperCol: { span: 16, offset: 2 },
};
const fieldLabelMap = {};

function createFieldLabelMap(msg) {
  fieldLabelMap.whse_code = msg('warehouseCode');
  fieldLabelMap.whse_name = msg('warehouseName');
  fieldLabelMap.whse_mode = msg('warehouseMode');
  fieldLabelMap.bonded = msg('supevsionAttr');
  fieldLabelMap.whse_contact = msg('warehouseContact');
  fieldLabelMap.whse_tel = msg('warehousePhone');
  fieldLabelMap.whse_address = msg('warehouseAddress');
}

@injectIntl
@connect(
  state => ({
    loginId: state.account.loginId,
    defaultWhse: state.cwmContext.defaultWhse,
    sccCode: state.account.code,
    partners: state.partner.partners.filter(pt =>
      pt.role === PARTNER_ROLES.VEN || pt.role === PARTNER_ROLES.OWN),
  }),
  {
    editWarehouse, loadWhseContext, loadWhse, switchDefaultWhse,
  }
)
@Form.create()
export default class WhseInfoPane extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    whseCode: PropTypes.string,
    ftzAppId: PropTypes.string,
    editable: PropTypes.bool,
  }
  state = {
    region: [],
    // regionValidateStatus: 'validating', //  'success', 'warning', 'error', 'validating'
  }
  componentDidMount() {
    this.setState({
      region: [
        this.props.warehouse.whse_province,
        this.props.warehouse.whse_city,
        this.props.warehouse.whse_district,
        this.props.warehouse.whse_street,
      ],
    });
    createFieldLabelMap(this.msg);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.warehouse.code !== this.props.warehouse.code) {
      this.setState({
        region: [
          nextProps.warehouse.whse_province,
          nextProps.warehouse.whse_city,
          nextProps.warehouse.whse_district,
          nextProps.warehouse.whse_street,
        ],
      });
      this.props.form.resetFields();
    }
  }
  msg = formatMsg(this.props.intl)
  handleSubmit = (ev) => {
    ev.preventDefault();
    // let regionValidateStatus = 'success';
    if (this.state.region.filter(r => r).length === 0) {
      // regionValidateStatus = 'error';
    }
    // this.setState({ regionValidateStatus: 'validating' });
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err /* && regionValidateStatus === 'success' */) {
        const {
          whseMode, whseName, whseAddress, whseTel, ftzWhseCode, whseContact,
          bonded, whseCode, whseArea, whseVol, whse_owner_scc_code: whseOwnerSccCode,
        } = values;
        const {
          loginId, warehouse, defaultWhse, partners,
        } = this.props;
        const [
          province, city, district, street,
        ] = this.state.region;
        const OperPartnerId = partners.find(pt => pt.partner_unique_code === whseOwnerSccCode) &&
        partners.find(pt => pt.partner_unique_code === whseOwnerSccCode).id;
        const updataInfo = {
          whseId: warehouse.id,
          changedWhse: {
            loginId,
            bonded,
            whse_mode: whseMode,
            whse_code: whseCode,
            whse_name: whseName,
            whse_address: whseAddress,
            whse_province: province,
            whse_city: city || null,
            whse_district: district || null,
            whse_street: street || null,
            whse_tel: whseTel,
            whse_contact: whseContact,
            whse_vol: whseVol,
            whse_area: whseArea,
            ftz_whse_code: ftzWhseCode,
            whse_oper_partnerid: OperPartnerId,
          },
        };
        const contentLog = [];
        ['whse_name', 'whse_mode', 'bonded', 'whse_contact', 'whse_tel', 'whse_vol', 'whse_area'].forEach((field) => {
          if (defaultWhse[field] !== updataInfo.changedWhse[field] &&
            !(!defaultWhse[field] && !updataInfo.changedWhse[field])) {
            if (field === 'whse_mode') {
              const value = updataInfo.changedWhse[field] === 'PRI' ? this.msg('pivateMode') : this.msg('publicMode');
              const oldValue = defaultWhse[field] === 'PRI' ? this.msg('pivateMode') : this.msg('publicMode');
              contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue}] 改为 [${value}]`);
            } else if (field === 'bonded') {
              const value = updataInfo.changedWhse[field] === 0 ? this.msg('supevsionTrue') : this.msg('supevsionFalse');
              const oldValue = defaultWhse[field] === 0 ? this.msg('supevsionTrue') : this.msg('supevsionFalse');
              contentLog.push(`"${fieldLabelMap[field]}"由 [${oldValue}] 改为 [${value}]`);
            } else {
              contentLog.push(`"${fieldLabelMap[field]}"由 [${defaultWhse[field] || ''}] 改为 [${updataInfo.changedWhse[field] || ''}]`);
            }
          }
        });
        if (updataInfo.changedWhse.whse_code !== defaultWhse.code) {
          const value = updataInfo.changedWhse.whse_code;
          const oldValue = defaultWhse.code;
          contentLog.push(`"${fieldLabelMap.whse_code}"由 [${oldValue}] 改为 [${value}]`);
        }
        if (updataInfo.changedWhse.whse_address !== defaultWhse.whse_address ||
          updataInfo.changedWhse.whse_province !== defaultWhse.whse_province ||
          updataInfo.changedWhse.whse_city !== defaultWhse.whse_city ||
          updataInfo.changedWhse.whse_district !== defaultWhse.whse_district ||
          updataInfo.changedWhse.whse_street !== defaultWhse.whse_street) {
          contentLog.push(`"${fieldLabelMap.whse_address}"由
          [${defaultWhse.whse_province || ''}${defaultWhse.whse_city || ''}${defaultWhse.whse_district || ''}${defaultWhse.whse_street || ''}${defaultWhse.whse_address || ''}]
            改为 [${province || ''}${city || ''}${district || ''}${street || ''}${whseAddress || ''}]`);
        }
        this.props.editWarehouse(updataInfo, contentLog.length > 0 ? `编辑基本信息, ${contentLog.join(';')}` : '').then((result) => {
          if (!result.error) {
            if (whseMode === 'PRI' && warehouse.code === defaultWhse.code && warehouse.whse_mode !== whseMode) {
              this.props.loadWhse(whseCode);
            }
            message.info(this.msg('whseEditSuccess'));
            this.props.loadWhseContext(warehouse.id);
          }
        });
      }
      // this.setState({ regionValidateStatus });
    });
  }
  handleRegionChange = (value) => {
    const [province, city, district, street] = value.slice(1);
    this.setState({
      region: [province, city, district, street],
    });
  }
  render() {
    const {
      form: { getFieldDecorator }, warehouse, sccCode, editable,
    } = this.props;
    let whseOperUnit = this.props.partners.find(pt => pt.partner_unique_code === sccCode);
    if (warehouse.whse_oper_partnerid) {
      whseOperUnit = this.props.partners.find(pt => pt.id === warehouse.whse_oper_partnerid);
    }
    // const { region, regionValidateStatus } = this.state;
    return (
      <FormPane>
        <Card>
          <Row>
            <Col lg={6} md={12}>
              <FormItem {...formItemLayout} label={this.msg('warehouseCode')} >
                {
                  getFieldDecorator('whseCode', {
                    rules: [{ required: true, message: this.msg('whseCodeRequired') }],
                    initialValue: warehouse && warehouse.code,
                  })(<Input disabled />)
                }
              </FormItem>
            </Col>
            <Col lg={6} md={12}>
              <FormItem {...formItemLayout} label={this.msg('warehouseName')} >
                {
                  getFieldDecorator('whseName', {
                    rules: [{ required: true, message: this.msg('whseNameRequired') }],
                    initialValue: warehouse && warehouse.name,
                  })(<Input disabled={!editable} />)
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemSpan2Layout}
                label={this.msg('enterPrise')}
                required
              >
                <BlCusSccAutoComplete
                  form={this.props.form}
                  formData={{
                    whse_owner_cus_code: whseOperUnit && whseOperUnit.customs_code,
                    whse_owner_scc_code: whseOperUnit && whseOperUnit.partner_unique_code,
                    whse_owner_name: whseOperUnit && whseOperUnit.name,
                  }}
                  rules={[{ required: true }]}
                  cusCodeField="whse_owner_cus_code"
                  sccCodeField="whse_owner_scc_code"
                  nameField="whse_owner_name"
                  dataList={this.props.partners.map(pt => ({
                    customs_code: pt.customs_code,
                    name: pt.name,
                    uscc_code: pt.partner_unique_code.slice(0, 18),
                  }))}
                />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col lg={6} md={12}>
              <FormItem {...formItemLayout} label={this.msg('warehouseMode')} >
                {
                  getFieldDecorator('whseMode', {
                    rules: [{ required: true, message: this.msg('whseModeRequired') }],
                    initialValue: warehouse && warehouse.whse_mode,
                  })(<Radio.Group disabled={!editable}>
                    <Radio.Button value="PRI">{this.msg('pivateMode')}</Radio.Button>
                    <Radio.Button value="PUB">{this.msg('publicMode')}</Radio.Button>
                  </Radio.Group>)
                }
              </FormItem>
            </Col>
            <Col lg={6} md={12}>
              <FormItem {...formItemLayout} label={this.msg('supevsionAttr')} >
                {
                  getFieldDecorator('bonded', {
                    rules: [{ required: true, message: this.msg('whseBonedRequired') }],
                    initialValue: warehouse && parseInt(warehouse.bonded, 10),
                  })(<Radio.Group disabled={!editable}>
                    <Radio.Button value={0}>{this.msg('supevsionTrue')}</Radio.Button>
                    <Radio.Button value={1}>{this.msg('supevsionFalse')}</Radio.Button>
                  </Radio.Group>)
                }
              </FormItem>
            </Col>
            <Col lg={6} md={12}>
              <FormItem {...formItemLayout} label={this.msg('warehouseContact')} >
                {
              getFieldDecorator('whseContact', {
                initialValue: warehouse && warehouse.whse_contact,
              })(<Input prefix={<Icon type="user" />} disabled={!editable} />)
            }
              </FormItem>
            </Col>
            <Col lg={6} md={12}>
              <FormItem {...formItemLayout} label={this.msg('warehousePhone')} >
                {
              getFieldDecorator('whseTel', {
                initialValue: warehouse && warehouse.whse_tel,
              })(<Input prefix={<Icon type="phone" />} disabled={!editable} />)
            }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemSpan2Layout}
                label={this.msg('warehouseAddress')}
                required
                // validateStatus={regionValidateStatus}
              >
                {
              getFieldDecorator('whseAddress', {
                initialValue: warehouse && warehouse.whse_address,
              })(<Input placeholder={this.msg('detailedAddress')} disabled={!editable} />)
            }
              </FormItem>
            </Col>
            <Col lg={6} md={12}>
              <FormItem {...formItemLayout} label={this.msg('仓库面积')} >
                {
              getFieldDecorator('whseArea', {
                rules: [{ required: warehouse && warehouse.bwl_type !== 'E' }],
                initialValue: warehouse && warehouse.whse_area,
              })(<Input disabled={!editable} addonAfter="平方米" type="number" />)
            }
              </FormItem>
            </Col>
            <Col lg={6} md={12}>
              <FormItem {...formItemLayout} label={this.msg('仓库容积')} >
                {
              getFieldDecorator('whseVol', {
                rules: [{ required: warehouse && warehouse.bwl_type === 'E' }],
                initialValue: warehouse && warehouse.whse_vol,
              })(<Input disabled={!editable} addonAfter="立方米" type="number" />)
            }
              </FormItem>
            </Col>
          </Row>
          {this.props.editable &&
          <FormItem {...tailFormItemLayout}>
            <PrivilegeCover module="cwm" feature="settings" action="edit">
              <Button type="primary" onClick={this.handleSubmit}>{this.msg('save')}</Button>
            </PrivilegeCover>
          </FormItem>}
        </Card>
      </FormPane>
    );
  }
}
