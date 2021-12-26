import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Button, Card, Collapse, Checkbox, Form, Row, Col, Select } from 'antd';
import DataPane from 'client/components/DataPane';
import FormPane from 'client/components/FormPane';
import RowAction from 'client/components/RowAction';
import { togglePermitModelModal, loadPermitModels, automaticMatch, toggleItemPermitModal } from 'common/reducers/cmsPermit';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import PermitModelModal from '../modal/permitModelModal';
import TradeItemsModal from '../modal/tradeItemsModal';
import ItemPermitModal from '../modal/itemPermitModal';
import { formatMsg } from '../message.i18n';

const { Panel } = Collapse;
const { Option } = Select;
const FormItem = Form.Item;

@injectIntl
@connect(state => ({
  tenantId: state.account.tenantId,
  loginId: state.account.loginId,
  permitItems: state.cmsPermit.permitItems,
  currentPermit: state.cmsPermit.currentPermit,
  formParams: state.saasParams.latest,
}), {
  togglePermitModelModal, loadPermitModels, automaticMatch, toggleItemPermitModal,
})
export default class PermitItemsPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    this.props.loadPermitModels(this.context.router.params.id);
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    dataIndex: 'model_seq',
    width: 45,
    align: 'center',
    className: 'table-col-seq',
    render: (o, record, index) => index + 1,
  }, {
    title: this.msg('model'),
    dataIndex: 'permit_model',
    width: 200,
  }, {
    title: this.msg('productNo'),
    dataIndex: 'product_no',
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OP_COL',
    width: 160,
    fixed: 'right',
    render: (o, record) => {
      if (record.permit_model === '*') {
        return (<PrivilegeCover module="clearance" feature="compliance" action="edit">
          <RowAction onClick={this.handMatch} icon="tags-o" label={this.msg('manage')} row={record} />
        </PrivilegeCover>);
      }
      return (<PrivilegeCover module="clearance" feature="compliance" action="edit">
        <RowAction onClick={this.automaticMatch} icon="rocket" label={this.msg('automaticMatch')} row={record} />
        <RowAction onClick={this.handMatch} icon="tags-o" tooltip={this.msg('manage')} row={record} />
      </PrivilegeCover>);
    },
  }];
  automaticMatch = (row) => {
    const { currentPermit } = this.props;
    this.props.automaticMatch(
      currentPermit.id, row.permit_model, row.model_seq,
      currentPermit.owner_partner_id
    ).then((result) => {
      if (!result.error) {
        this.props.loadPermitModels(this.context.router.params.id);
      }
    });
  }
  handMatch = (row) => {
    this.props.toggleItemPermitModal(
      true, this.context.router.params.id,
      row.permit_model, row.model_seq,
    );
  }
  handelAdd = () => {
    this.props.togglePermitModelModal(true);
  }
  render() {
    const {
      form: { getFieldDecorator, getFieldValue }, currentPermit,
      formParams: { tradeMode, trxnMode, remissionMode }, permitItems, readonly,
    } = this.props;
    const permitId = this.context.router.params.id;
    const lastModel = permitItems[permitItems.length - 1];
    const nextModelSeq = lastModel ? lastModel.model_seq + 1 : 1;
    return (
      <FormPane descendant hideRequiredMark>
        <Card bodyStyle={{ padding: 0 }}>
          <Collapse bordered={false}>
            <Panel header="匹配规则设置" key="matchRule">
              <Row>
                <Col span={6}>
                  <FormItem>
                    <Col span={8}>
                      {getFieldDecorator('check_match_trade_mode', {
                      valuePropName: 'checked',
                      initialValue: !!currentPermit.match_trade_mode,
                    })(<Checkbox disabled={readonly} value="tradeMode">{this.msg('tradeMode')}</Checkbox>)}
                    </Col>
                    <Col span={14}>
                      {getFieldDecorator('match_trade_mode', {
                      initialValue: currentPermit.match_trade_mode ? currentPermit.match_trade_mode.split(',') : [],
                    })(<Select
                      showSearch
                      allowClear
                      mode="multiple"
                      optionFilterProp="children"
                      dropdownMatchSelectWidth={false}
                      dropdownStyle={{ width: 240 }}
                      disabled={!getFieldValue('check_match_trade_mode') || readonly}
                      style={{ width: '100%' }}
                    >
                      {tradeMode.map(f => (<Option key={f.trade_mode} value={f.trade_mode}>
                        {`${f.trade_mode}|${f.trade_abbr}`}
                      </Option>))}
                    </Select>)}
                    </Col>
                  </FormItem>

                </Col>
                <Col span={6}>
                  <FormItem>
                    <Col span={8}>
                      {getFieldDecorator('check_match_remission_mode', {
                  valuePropName: 'checked',
                  initialValue: !!currentPermit.match_remission_mode,
                })(<Checkbox disabled={readonly}>{this.msg('remissionMode')}</Checkbox>)}

                    </Col>
                    <Col span={14}>
                      {getFieldDecorator('match_remission_mode', {
                  initialValue: currentPermit.match_remission_mode,
                })(<Select
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  disabled={!getFieldValue('check_match_remission_mode') || readonly}
                  style={{ width: '100%' }}
                >
                  {remissionMode.map(f => (<Option key={f.rm_mode} value={f.rm_mode}>
                    {`${f.rm_mode}|${f.rm_abbr}`}
                  </Option>))}
                </Select>)}

                    </Col>
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem>
                    <Col span={8}>
                      {getFieldDecorator('check_match_trxn_mode', {
                  valuePropName: 'checked',
                  initialValue: !!currentPermit.match_trxn_mode,
                })(<Checkbox disabled={readonly}>{this.msg('trxnMode')}</Checkbox>)}
                    </Col>
                    <Col span={14}>
                      {getFieldDecorator('match_trxn_mode', {
                  initialValue: currentPermit.match_trxn_mode,
                })(<Select
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  disabled={!getFieldValue('check_match_trxn_mode') || readonly}
                  style={{ width: '100%' }}
                >
                  {trxnMode.map(f => (<Option key={f.trx_mode} value={f.trx_mode}>
                    {`${f.trx_mode}|${f.trx_spec}`}
                  </Option>))}
                </Select>)}
                    </Col>
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem>
                    <Col span={8}>
                      {getFieldDecorator('check_match_decl_way_code', {
                  valuePropName: 'checked',
                  initialValue: !!currentPermit.match_decl_way_code,
                })(<Checkbox disabled={readonly}>{this.msg('ieType')}</Checkbox>)}
                    </Col>
                    <Col span={14}>
                      {getFieldDecorator('match_decl_way_code', {
                  initialValue: currentPermit.match_decl_way_code ?
                    currentPermit.match_decl_way_code.split(',') : [],
                })(<Select
                  showSearch
                  allowClear
                  mode="multiple"
                  optionFilterProp="children"
                  disabled={!getFieldValue('check_match_decl_way_code') || readonly}
                  style={{ width: '100%' }}
                >
                  <Option key="IMPT" value="IMPT">{this.msg('declWayIMPT')}</Option>
                  <Option key="EXPT" value="EXPT">{this.msg('declWayEXPT')}</Option>
                  <Option key="IBND" value="IBND">{this.msg('declWayIBND')}</Option>
                  <Option key="EBND" value="EBND">{this.msg('declWayEBND')}</Option>
                </Select>)}
                    </Col>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <FormItem label="报关单表体" labelCol={{ span: 4 }} wrapperCol={{ span: 19 }}>
                    {getFieldDecorator('permit_match_rule', {
                initialValue: currentPermit.permit_match_rule || 1,
                })(<Select disabled={readonly} allowClear style={{ width: '100%' }} >
                  <Option key="product_no" value={1}>{this.msg('productNo')}</Option>
                  <Option key="hscode-gname" value={2}>{this.msg('hscode')}+{this.msg('gName')}</Option>
                </Select>)}
                  </FormItem>
                </Col>
              </Row>
            </Panel>
          </Collapse>
        </Card>
        <Card bodyStyle={{ padding: 0 }}>
          <DataPane
            columns={this.columns}
            bordered
            dataSource={permitItems}
            rowKey="id"
            scrollOffset={440}
          >
            <DataPane.Toolbar>
              <PrivilegeCover module="clearance" feature="compliance" action="create">
                <Button type="primary" icon="plus" onClick={this.handelAdd}>{this.msg('addModel')}</Button>
              </PrivilegeCover>
            </DataPane.Toolbar>
            <PermitModelModal permitId={permitId} modelSeq={nextModelSeq} />
            <TradeItemsModal permitId={permitId} />
            <ItemPermitModal permitId={permitId} />
          </DataPane>
        </Card>
      </FormPane>
    );
  }
}
