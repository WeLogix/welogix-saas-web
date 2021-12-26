import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { Card, Row, Col, Form, Input, Select, DatePicker } from 'antd';
import { BLBOOK_TYPE, SASBL_BWL_TYPE, DECLARER_COMPANY_TYPE } from 'common/constants';
import { loadBlBookHead } from 'common/reducers/cwmBlBook';
import { formatMsg } from '../../../../apps/cwm/sasbl/blbook/message.i18n';

const { Option } = Select;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

@injectIntl
@connect(
  state => ({
    cwmBlBook: state.saasDockPool.cwmBlBook,
    blBook: state.cwmBlBook.blBookData,
    customs: state.saasParams.latest.customs,
    defaultWhse: state.cwmContext.defaultWhse,
    whseCode: state.cwmContext.defaultWhse.code,
  }),
  { loadBlBookHead }
)
export default class BlBookHeadDockPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    blBook: PropTypes.shape({ cop_manual_no: PropTypes.string }).isRequired,
  }
  componentDidMount() {
    const { blBook, visible } = this.props.cwmBlBook;
    if (visible && (blBook.id || blBook.blbook_no)) {
      this.props.loadBlBookHead(blBook.id, blBook.blbook_no);
    }
  }
  componentWillReceiveProps(nextProps) {
    const { blBook, visible } = nextProps.cwmBlBook;
    if (visible && blBook.id && blBook.id !== this.props.cwmBlBook.blBook.id) {
      this.props.loadBlBookHead(blBook.id, blBook.blbook_no);
    }
  }
  msg = formatMsg(this.props.intl)
  render() {
    const { blBook, customs } = this.props;
    return (
      <div className="pane-content tab-pane grid-form">
        <Card size="small">
          <Form>
            <Row>
              <Col span={8}>
                <FormItem label={this.msg('preBlbookNo')} {...formItemLayout}>
                  <Input value={blBook.pre_blbook_no} disabled />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={this.msg('blbookNo')} {...formItemLayout}>
                  <Input value={blBook.blbook_no} disabled />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={this.msg('copManualNo')} {...formItemLayout}>
                  <Input value={blBook.cop_manual_no} disabled />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label={this.msg('blbookType')} {...formItemLayout}>
                  <Select value={blBook.blbook_type} disabled>
                    {BLBOOK_TYPE.map(bk => (
                      <Option value={bk.value} key={bk.value}>
                        {bk.text}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={this.msg('declarerCompanyType')} {...formItemLayout}>
                  <Select value={blBook.declarer_company_type} disabled>
                    {DECLARER_COMPANY_TYPE.map(st => (
                      <Option value={st.value} key={st.value}>
                        {st.value} | {st.text}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={this.msg('masterCustoms')} {...formItemLayout}>
                  <Select value={blBook.master_customs} disabled>
                    {customs.map(cus => (
                      <Option value={cus.customs_code} key={cus.customs_code}>{`${
                        cus.customs_code
                      }|${cus.customs_name}`}</Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label={this.msg('owner')} {...formItemLayout}>
                  <Input value={blBook.owner_name} disabled />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={this.msg('sccCode')} {...formItemLayout}>
                  <Input value={blBook.owner_scc_code} disabled />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={this.msg('cusCode')} {...formItemLayout}>
                  <Input value={blBook.owner_cus_code} disabled />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label={this.msg('declarer')} {...formItemLayout}>
                  <Input value={blBook.declarer_name} disabled />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={this.msg('sccCode')} {...formItemLayout}>
                  <Input value={blBook.declarer_scc_code} disabled />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={this.msg('cusCode')} {...formItemLayout}>
                  <Input value={blBook.declarer_cus_code} disabled />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label={this.msg('bwlType')} {...formItemLayout}>
                  <Select value={blBook.bwl_type || ''} disabled>
                    {SASBL_BWL_TYPE.map(st => (
                      <Option value={st.value} key={st.value}>
                        {st.value} | {st.text}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={this.msg('businessType')} {...formItemLayout}>
                  <Select value={blBook.business_type || ''} disabled>
                    {SASBL_BWL_TYPE.map(st => (
                      <Option value={st.value} key={st.value}>
                        {st.value} | {st.text}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={this.msg('blbookAccounting')} {...formItemLayout}>
                  <Select value={blBook.blbook_accounting} disabled>
                    <Option value="1" key="1">
                      1-可累计
                    </Option>
                    <Option value="2" key="2">
                      2-不累计
                    </Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label={this.msg('blbookDeclDate')} {...formItemLayout}>
                  <DatePicker
                    value={
                      blBook.blbook_decl_date && moment(blBook.blbook_decl_date, 'YYYY/MM/DD')
                    }
                    disabled
                    style={{ width: '100%' }}
                  />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={this.msg('blbookAlterDate')} {...formItemLayout}>
                  <DatePicker
                    value={
                      blBook.blbook_alter_date && moment(blBook.blbook_alter_date, 'YYYY/MM/DD')
                    }
                    disabled
                    style={{ width: '100%' }}
                  />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={this.msg('blbookExpirayDate')} {...formItemLayout}>
                  <DatePicker
                    value={
                      blBook.blbook_expiray_date &&
                      moment(blBook.blbook_expiray_date, 'YYYY/MM/DD')
                    }
                    disabled
                    style={{ width: '100%' }}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label={this.msg('blbookTaxRebate')} {...formItemLayout}>
                  <Select value={blBook.blbook_tax_rebate} disabled>
                    <Option value="1" key="1">
                      是
                    </Option>
                    <Option value="2" key="2">
                      否
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={this.msg('blbookUsage')} {...formItemLayout}>
                  <Select value={blBook.blbook_usage} disabled>
                    <Option value="1" key="1">
                      1 |一般纳税人
                    </Option>
                    <Option value="2" key="2">
                      2 |特殊行业
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={this.msg('remark')} {...formItemLayout}>
                  <Input value={blBook.blbook_note} disabled />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    );
  }
}
