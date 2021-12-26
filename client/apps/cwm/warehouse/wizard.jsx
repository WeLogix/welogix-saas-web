import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Card, Layout, Steps, Form, Radio, Input, Button, message, Select } from 'antd';
import QueueAnim from 'rc-queue-anim';
import PageHeader from 'client/components/PageHeader';
import connectNav from 'client/common/decorators/connect-nav';
import { addWarehouse, updateWhse } from 'common/reducers/cwmWarehouse';
import { loadWhseContext, switchDefaultWhse } from 'common/reducers/cwmContext';
import { createBlBook } from 'common/reducers/cwmBlBook';
import { loadPartners } from 'common/reducers/partner';
import { SASBL_BWL_TYPE, BLBOOK_TYPE, PARTNER_ROLES } from 'common/constants';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import { formatMsg } from './message.i18n';

const { Option } = Select;
const { Content } = Layout;
const { Step } = Steps;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const tailFormItemLayout = {
  wrapperCol: {
    span: 14,
    offset: 6,
  },
};
@injectIntl
@connect(
  state => ({
    customs: state.saasParams.latest.customs,
    whses: state.cwmContext.whses,
    defaultWhse: state.cwmContext.defaultWhse,
    whseSuppSHFtzApps: state.hubIntegration.whseSuppSHFtzApps,
    tenantName: state.account.tenantName,
    partners: state.partner.partners,
  }),
  {
    addWarehouse, loadWhseContext, switchDefaultWhse, updateWhse, createBlBook, loadPartners,
  }
)
@connectNav({
  depth: 3,
  moduleName: 'cwm',
  title: 'featCwmSettings',
})
@Form.create()
export default class WarehouseWizard extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    step: 0,
    limitedCustoms: [],
  }
  componentDidMount() {
    this.setState({
      limitedCustoms: this.props.customs.slice(0, 20),
    });
    this.props.loadPartners({
      role: PARTNER_ROLES.VEN,
    });
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.customs.length === 0 && nextProps.customs.length > 0) {
      this.setState({
        limitedCustoms: nextProps.customs.slice(0, 20),
      });
    }
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
  handleSubmitBasicInfo = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {
          whseMode, whseName, isBonded, whseCode,
        } = values;
        this.props.addWarehouse({
          whseMode, whseName, isBonded, whseCode,
        })
          .then((result) => {
            if (!result.error) {
              message.info('添加仓库成功');
              if (isBonded) {
                this.setState({ step: this.state.step + 1 });
              } else {
                this.handleComplete(whseCode, '/cwm/warehouse');
              }
            } else {
              message.info(result.error.message);
            }
          });
      }
    });
  }
  handleSubmitSupervisionInfo = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {
          ftzType, ftzIntegrationAppId, customsCode, ftzWhseCode, bwlType, whseCode,
        } = values;
        this.props.updateWhse({
          ftz_type: ftzType,
          ftz_integration_app_id: ftzIntegrationAppId,
          customs_code: customsCode,
          ftz_whse_code: ftzWhseCode,
          bwl_type: bwlType,
        }, whseCode)
          .then((result) => {
            if (!result.error) {
              message.info(this.msg('whseEditSuccess'));
              if (ftzType !== 'SHFTZ') {
                this.setState({ step: this.state.step + 1 }, this.forceUpdate);
              } else {
                this.handleComplete(whseCode, '/cwm/warehouse');
              }
            } else {
              message.info(result.error.message);
            }
          });
      }
    });
  }
  handleSubmitblBookInfo = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {
          blbookType, bwlNo, whseCode, blbookStatus,
        } = values;
        const blbook = {
          partner_id: 'OWN',
          whse_code: whseCode,
          blbook_type: blbookType,
          blbook_no: blbookStatus === 0 ? null : bwlNo,
        };
        this.props.createBlBook(blbook)
          .then((result) => {
            if (!result.error) {
              message.info('账册创建成功');
              this.handleComplete(whseCode, `/cwm/blbook/${result.data.id}`);
            } else {
              message.info(result.error.message);
            }
          });
      }
    });
  }
  handleComplete = (whseCode, path) => {
    this.props.loadWhseContext().then((result) => {
      if (!result.error) {
        this.props.switchDefaultWhse(whseCode);
        this.context.router.push(path);
      } else {
        message.info(result.error.message);
      }
    });
  }
  handleblbookStatusChange = (e) => {
    if (e.target.value === 0) {
      this.props.form.setFieldsValue({ bwlNo: '' });
    }
  }
  msg = formatMsg(this.props.intl);
  render() {
    const {
      step, limitedCustoms, warehouse,
    } = this.state;
    const {
      form: { getFieldDecorator, getFieldValue }, whseSuppSHFtzApps, tenantName,
    } = this.props;
    const isBonded = getFieldValue('isBonded');
    const ftzType = getFieldValue('ftzType');
    const blbookStatus = getFieldValue('blbookStatus');
    let whseSupApps = [];
    if (ftzType === 'SHFTZ') {
      whseSupApps = whseSuppSHFtzApps;
    }
    return (
      <Layout>
        <QueueAnim type={['bottom', 'up']}>
          <PageHeader title={this.msg('addWhse')} />
          <Content className="page-content" key="main">
            <Card>
              <div className="layout-fixed-width" style={{ marginBottom: 50 }}>
                <Steps current={step}>
                  <Step title={this.msg('basicInfo')} />
                  <Step title={this.msg('supevsionFalse')} />
                  <Step title={this.msg('relateBlbook')} />
                </Steps>
              </div>
              <Form className="layout-fixed-width layout-fixed-width-md">
                <div style={{ display: step === 0 ? 'block' : 'none' }}>
                  <FormItem {...formItemLayout} label={this.msg('warehouseName')} >
                    {
                      getFieldDecorator('whseName', {
                        rules: [{ required: true, message: this.msg('whseNameRequired') }],
                        initialValue: '',
                      })(<Input />)
                    }
                  </FormItem>
                  <FormItem {...formItemLayout} label={this.msg('warehouseCode')} >
                    {
                      getFieldDecorator('whseCode', {
                        rules: [{ required: true, message: this.msg('pleaseInputWhseCode') }],
                        initialValue: '',
                      })(<Input placeholder={this.msg('')} />)
                    }
                  </FormItem>
                  <FormItem {...formItemLayout} label={this.msg('warehouseMode')} >
                    {
                      getFieldDecorator('whseMode', {
                        initialValue: 'PRI',
                      })(<Radio.Group>
                        <Radio.Button value="PRI">{this.msg('pivateMode')}</Radio.Button>
                        <Radio.Button value="PUB">{this.msg('publicMode')}</Radio.Button>
                      </Radio.Group>)
                    }
                  </FormItem>
                  <FormItem {...formItemLayout} label={this.msg('supevsionAttr')} >
                    {
                      getFieldDecorator('isBonded', {
                        initialValue: 0,
                      })(<Radio.Group>
                        <Radio.Button value={0}>{this.msg('supevsionTrue')}</Radio.Button>
                        <Radio.Button value={1}>{this.msg('supevsionFalse')}</Radio.Button>
                      </Radio.Group>)
                    }
                  </FormItem>
                  <FormItem {...tailFormItemLayout} >
                    <PrivilegeCover module="cwm" feature="settings" action="create">
                      <Button onClick={this.handleSubmitBasicInfo} htmlType="submit" size="large" type="primary">{isBonded ? this.msg('nextStep') : this.msg('completed')}</Button>
                    </PrivilegeCover>
                  </FormItem>
                </div>
                {step === 1 ? (
                  <div>
                    <FormItem {...formItemLayout} label={this.msg('ftzWhseCode')} >
                      {
                        getFieldDecorator('ftzWhseCode', {
                          rules: [{ required: true, message: this.msg('pleaseInputftzWhseCode') }],
                          initialValue: '',
                        })(<Input />)
                      }
                    </FormItem>
                    <FormItem {...formItemLayout} label={this.msg('bwlType')} >
                      {
                        getFieldDecorator('bwlType', {
                          rules: [{ required: true, message: this.msg('pleaseSelectBwlType') }],
                          initialValue: '',
                        })(<Select
                          showSearch
                          showArrow
                          allowClear
                          optionFilterProp="children"
                        >
                          {SASBL_BWL_TYPE.map(bwl => <Option value={bwl.value} key={bwl.text}>{`${bwl.value}|${bwl.text}`}</Option>)}
                        </Select>)
                      }
                    </FormItem>
                    <FormItem {...formItemLayout} label={this.msg('customsCode')} >
                      {
                        getFieldDecorator('customsCode', {
                          rules: [{ required: true, message: this.msg('pleaseSelectCustomsCode') }],
                          initialValue: '',
                        })(<Select
                          showSearch
                          optionLabelProp="children"
                          showArrow
                          allowClear
                          onSearch={this.handleSearch}
                          filterOption={false}
                        >
                          {limitedCustoms.map(cus => <Option value={cus.customs_code} key={cus.customs_code}>{`${cus.customs_code}|${cus.customs_name}`}</Option>)}
                        </Select>)
                      }
                    </FormItem>
                    <FormItem {...formItemLayout} label={this.msg('supervisionSystem')} >
                      {getFieldDecorator('ftzType', {
                          rules: [{ required: true, message: this.msg(this.msg('pleaseSelectFtzType')) }],
                          initialValue: 'SASBL',
                        })(<Select
                          placeholder={this.msg('supSystemTypeSelect')}
                          allowClear
                          onSelect={this.handleFtzTypeSelect}
                        >
                          <Option key="SASBL" value="SASBL">金二特殊监管区域/保税物流管理系统</Option>
                          <Option key="SHFTZ" value="SHFTZ">上海自由贸易试验区仓储监管系统</Option>
                        </Select>)}
                    </FormItem>
                    <FormItem {...formItemLayout} label={this.msg('integrationAppId')} >
                      {getFieldDecorator('ftzIntegrationAppId', {
                          initialValue: warehouse && warehouse.ftz_integration_app_id,
                        })(<Select
                          showSearch
                          optionLabelProp="children"
                          showArrow
                          allowClear
                          disabled={whseSupApps.length === 0}
                        >
                          {whseSupApps.map(wsa =>
                            <Option key={wsa.uuid} value={wsa.uuid}>{wsa.name}</Option>)}
                        </Select>)}
                    </FormItem>
                    <FormItem {...tailFormItemLayout} >
                      <PrivilegeCover module="cwm" feature="settings" action="edit">
                        <Button onClick={this.handleSubmitSupervisionInfo} htmlType="submit" size="large" type="primary">{ftzType !== 'SHFTZ' ? this.msg('nextStep') : this.msg('completed')}</Button>
                      </PrivilegeCover>
                    </FormItem>
                  </div>
                ) : null}
                {step === 2 ? (
                  <div>
                    <FormItem {...tailFormItemLayout} >
                      {
                        getFieldDecorator('blbookStatus', {
                          initialValue: 0,
                        })(<Radio.Group onChange={this.handleblbookStatusChange}>
                          <Radio.Button value={0}>{this.msg('newUnRecBlbook')}</Radio.Button>
                          <Radio.Button value={2}>{this.msg('newRecBlbook')}</Radio.Button>
                        </Radio.Group>)
                      }
                    </FormItem>
                    <FormItem {...formItemLayout} label={this.msg('bwlNo')} >
                      {
                        getFieldDecorator('bwlNo', {
                          rules: blbookStatus === 0 ? null : [{ required: true, message: this.msg('pleaseInputBwlNo') }],
                          initialValue: '',
                        })(<Input disabled={blbookStatus === 0} />)
                      }
                    </FormItem>
                    <FormItem {...formItemLayout} label={this.msg('blbookType')} >
                      {
                        getFieldDecorator('blbookType', {
                          rules: [{ required: true, message: this.msg('pleaseSelectBlbookType') }],
                          initialValue: '',
                        })(<Select
                          placeholder={this.msg('blbookTypeSelect')}
                          allowClear
                          onSelect={this.handleFtzTypeSelect}
                        >
                          {
                          BLBOOK_TYPE.map(bk =>
                            <Option value={bk.value} key={bk.value}>{bk.text}</Option>)
                          }
                        </Select>)
                      }
                    </FormItem>
                    <FormItem {...formItemLayout} label={this.msg('ownerCusCode')} >
                      <Select
                        placeholder={this.msg('ownerCusCodeSelect')}
                        disabled
                        value="OWN"
                      >
                        <Option value="OWN">{tenantName}</Option>
                      </Select>
                    </FormItem>
                    <FormItem {...tailFormItemLayout} >
                      <PrivilegeCover module="cwm" feature="settings" action="create">
                        <Button onClick={this.handleSubmitblBookInfo} htmlType="submit" size="large" type="primary">{this.msg('completed')}</Button>
                      </PrivilegeCover>
                    </FormItem>
                  </div>
                ) : null}
              </Form>
            </Card>
          </Content>
        </QueueAnim>
      </Layout>
    );
  }
}
