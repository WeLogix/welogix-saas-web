import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, Button, Divider, Form, Input, Row, Select, Tag, Col, Layout, Tooltip, message } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import connectFetch from 'client/common/decorators/connect-fetch';
import withPrivilege, { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import PageHeader from 'client/components/PageHeader';
import { TENANT_LEVEL } from 'common/constants';
import { isFormDataLoaded, loadForm, edit } from 'common/reducers/corps';
import AvatarUploader from 'client/components/AvatarUploader';
import { checkCorpDomain } from 'common/reducers/corp-domain';
import CorpSiderMenu from './menu';
import { formatMsg } from './message.i18n';

const { Content } = Layout;
const FormItem = Form.Item;
const { Option } = Select;

function fetchData({ state, dispatch, cookie }) {
  const corpId = state.account.tenantId;
  if (!isFormDataLoaded(state.corps, corpId)) {
    return dispatch(loadForm(cookie, corpId));
  }
  return null;
}

@connectFetch()(fetchData)
@injectIntl
@connect(
  state => ({
    formData: state.corps.formData,
  }),
  { edit, checkCorpDomain }
)
@withPrivilege({ module: 'corp', feature: 'info' })
@Form.create()
export default class CorpInfo extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func,
    }).isRequired,
    formData: PropTypes.shape({
      name: PropTypes.string,
      shortName: PropTypes.string,
      code: PropTypes.string,
      remark: PropTypes.string,
    }).isRequired,
    edit: PropTypes.func.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  constructor(props) {
    super(props);
    const {
      country, province, city, district, logo,
    } = this.props.formData;
    this.state = {
      country, province, city, district, logo,
    };
  }
  componentWillReceiveProps(nextProps) {
    const newState = this.state;
    ['country', 'province', 'city', 'district', 'logo'].forEach((fld) => {
      if (nextProps.formData[fld] !== this.props.formData[fld]) {
        newState[fld] = nextProps.formData[fld];
      }
    });
    this.setState(newState);
  }
  msg = formatMsg(this.props.intl);
  handleImgUpload = (url) => {
    this.setState({
      logo: url,
    });
  }
  handleSubmit = () => {
    this.props.form.validateFields((errors) => {
      if (!errors) {
        const { formData } = this.props;
        const form = {
          ...formData,
          ...this.props.form.getFieldsValue(),
          ...this.state,
        };
        this.props.edit(form).then((result) => {
          if (result.error) {
            message.error(result.error.message, 10);
          } else {
            message.info(this.msg('savedSucceed'));
          }
        });
      } else {
        this.forceUpdate();
      }
    });
  }
  handleCancel() {
    this.context.router.goBack();
  }
  renderTextInput(labelName, placeholder, field, required, rules, fieldProps) {
    const { form: { getFieldDecorator } } = this.props;
    return (
      <FormItem
        label={labelName}
        required={required}
      >
        {getFieldDecorator(field, { rules, ...fieldProps })(<Input placeholder={placeholder} />)}
      </FormItem>
    );
  }

  render() {
    const {
      formData: {
        name, shortName, code, remark, uuid, aspect, level,
      },
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Layout>
        <CorpSiderMenu currentKey="info" />
        <Layout>
          <PageHeader title={this.msg('corpInfo')} />
          <Content className="page-content layout-fixed-width" key="main">
            <Card>
              <Form layout="vertical">
                <Row gutter={16}>
                  <Col span={24}>
                    <FormItem>
                      <AvatarUploader url={this.state.logo} afterUpload={this.handleImgUpload} />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label={this.msg('enterpriseCode')} >
                      <Tooltip title={this.msg('modifyNotAllowed')}><Input value={code} /></Tooltip>
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    {this.renderTextInput(
                  this.msg('companyName'), this.msg('companyNameTip'), 'name', true,
                  [{ required: true, message: this.msg('companyNameRequired') }],
                  { initialValue: name }
                )}
                  </Col>
                  <Col span={8}>
                    {this.renderTextInput(
                  this.msg('companyShortName'), '', 'shortName', false,
                  [{
                    type: 'string',
                    min: 2,
                    pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
                    message: this.msg('shortNameMessage'),
                  }],
                  { initialValue: shortName }
                )}
                  </Col>

                  <Col span={24}>
                    <FormItem label={this.msg('companyAbout')} >
                      {getFieldDecorator('remark', { initialValue: remark })(<Input.TextArea rows="2" />)}
                    </FormItem>
                  </Col>
                </Row>
                <PrivilegeCover module="corp" feature="info" action="edit">
                  <Button
                    type="primary"
                    icon="save"
                    htmlType="submit"
                    onClick={this.handleSubmit}
                  >
                    {this.msg('save')}
                  </Button>
                </PrivilegeCover>
                <Divider dashed />
                <Row gutter={16}>
                  <Col span={8}>
                    <FormItem label={this.msg('corpUUID')} >
                      <Tooltip title={this.msg('clickToCopy')}><Input value={uuid} /></Tooltip>
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label={this.msg('tenantLevel')} >
                      <Select value={level} showArrow={false} open={false}>
                        {
                          TENANT_LEVEL.map(tlevel =>
                            (<Option key={tlevel.key} value={tlevel.value}>
                              <Tag color={tlevel.color}>{tlevel.text}</Tag></Option>))
                        }
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label={this.msg('corpType')} >
                      <Select value={aspect} showArrow={false} open={false}>
                        <Option key={0} value={0}>{this.msg('owner')}</Option>
                        <Option key={1} value={1}>{this.msg('vendor')}</Option>
                      </Select>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
