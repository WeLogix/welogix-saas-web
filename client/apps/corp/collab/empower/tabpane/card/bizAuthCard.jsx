import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Select, Button, Checkbox, Spin, Card, Timeline, Icon, DatePicker } from 'antd';
import { upsertBizAuthConfig } from 'common/reducers/saasCollab';
import { SCOF_BIZ_OBJECT_KEY } from 'common/constants';
import { formatMsg } from '../../../message.i18n';

const { Option } = Select;
const { RangePicker } = DatePicker;

@injectIntl
@connect((state) => {
  const operatorIds = state.saasCollab.operators.map(f => f.lid);
  return {
    currentPartner: state.saasCollab.currentPartner,
    bizAuthLoading: state.saasCollab.bizAuthLoading,
    bizAuths: state.saasCollab.bizAuths,
    authParams: {
      flowList: state.scofFlow.partnerFlows.map(f => ({ value: f.id, text: f.name })),
      userList: state.account.userMembers.filter(f => operatorIds.includes(f.login_id))
        .map(f => ({ value: f.login_id, text: f.name })),
      tradeMode: state.saasParams.latest.tradeMode.map(f =>
        ({ value: f.trade_mode, text: f.trade_abbr })),
      transMode: state.saasParams.latest.transMode.map(f =>
        ({ value: f.trans_code, text: f.trans_spec })),
      declWayCodes: [
        { value: 'IMPT', text: '进口' },
        { value: 'EXPT', text: '出口' },
        { value: 'IBND', text: '进境' },
        { value: 'EBND', text: '出境' },
      ],
    },
  };
}, { upsertBizAuthConfig })

export default class BizAuthCard extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  state = {
    checked: false,
    btnDisabled: true,
    bizWhereConfig: [{ field: '', values: [], paramType: '' }],
  }
  componentDidMount() {
    this.handleInit(this.props.bizAuths);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.bizAuths !== this.props.bizAuths) {
      this.handleInit(nextProps.bizAuths);
    }
  }
  msg = formatMsg(this.props.intl);
  handleInit = (bizAuths) => {
    const bizConfig = bizAuths.find(f => f.auth_bizobject ===
      SCOF_BIZ_OBJECT_KEY[this.props.authBizObject].key);
    const newWhereConfig = [];
    for (let i = 0, len = bizConfig ? bizConfig.whereCls.length : 0; i < len; i++) {
      const biz = bizConfig.whereCls[i];
      const bizOpt = this.props.bizOptions.find(f => f.bawField === biz.baw_field);
      let values = biz.baw_value ? biz.baw_value.split(',') : [];
      if (bizOpt && bizOpt.dataType === 'number') {
        values = values.map(f => Number(f));
      }
      newWhereConfig.push({
        field: biz.baw_field,
        values,
        cmpop: biz.baw_cmpop || 'in',
        paramType: bizOpt ? bizOpt.paramType : '',
        dataType: bizOpt ? bizOpt.dataType : 'string',
      });
    }
    this.setState({
      checked: bizConfig ? !!bizConfig.status : false,
      bizWhereConfig: newWhereConfig.concat({ field: '', values: [], paramType: '' }),
    });
  }
  handleCheckboxChange = (ev) => {
    this.setState({ checked: ev.target.checked, btnDisabled: false });
  }
  handleBawFieldChange = (value, index) => {
    const bizOpt = this.props.bizOptions.find(f => f.bawField === value);
    const bizWhereConfig = [...this.state.bizWhereConfig];
    bizWhereConfig[index].field = value;
    bizWhereConfig[index].paramType = bizOpt ? bizOpt.paramType : '';
    bizWhereConfig[index].dataType = bizOpt ? bizOpt.dataType : 'string';
    this.setState({ bizWhereConfig, btnDisabled: false });
  }
  handleBawValueChange = (values, index) => {
    const bizWhereConfig = [...this.state.bizWhereConfig];
    bizWhereConfig[index].values = values;
    bizWhereConfig[index].cmpop = 'in';
    this.setState({ bizWhereConfig, btnDisabled: false });
  }
  handleRangeDateChange = (dates, dateStrings, index) => {
    const bizWhereConfig = [...this.state.bizWhereConfig];
    bizWhereConfig[index].values = dateStrings;
    bizWhereConfig[index].cmpop = 'between';
    this.setState({ bizWhereConfig, btnDisabled: false });
  }
  handleAddWhereConf = () => {
    const bizWhereConfig = [...this.state.bizWhereConfig];
    bizWhereConfig.push({ field: '', values: [], paramType: '' });
    this.setState({ bizWhereConfig });
  }
  handleDelete = (index) => {
    const bizWhereConfig = [...this.state.bizWhereConfig];
    bizWhereConfig.splice(index, 1);
    this.setState({ bizWhereConfig, btnDisabled: false });
  }
  handleSave = () => {
    const { authBizObject } = this.props;
    const bizConfig = this.props.bizAuths.find(f =>
      f.auth_bizobject === SCOF_BIZ_OBJECT_KEY[authBizObject].key);
    const bizAuthId = bizConfig && bizConfig.id;
    const status = this.state.checked;
    let whereCls = [];
    if (status) {
      whereCls = this.state.bizWhereConfig.filter(f => f.field && f.values.length > 0)
        .map(f => ({
          baw_field: f.field,
          baw_value: f.values.join(','),
          baw_cmpop: f.cmpop,
        }));
    }
    const { id, partner_tenant_id: partnerTenantId } = this.props.currentPartner;
    this.props.upsertBizAuthConfig(
      id, partnerTenantId,
      SCOF_BIZ_OBJECT_KEY[authBizObject].key, status, whereCls, bizAuthId
    )
      .then(() => { this.setState({ btnDisabled: true }); });
  }
  render() {
    const {
      bizAuthLoading, authBizObject, bizOptions, authParams,
    } = this.props;
    const { checked, btnDisabled, bizWhereConfig } = this.state;
    return (
      <Spin spinning={bizAuthLoading}>
        <Card
          hoverable
          title={<Checkbox
            checked={checked}
            onChange={this.handleCheckboxChange}
          >{SCOF_BIZ_OBJECT_KEY[authBizObject].defaultText}</Checkbox>}
        >
          <Timeline>
            <Timeline.Item dot={<Icon type="down-square" theme="outlined" />}>
              <span className="filter-symbol">筛选器</span>
            </Timeline.Item>
            <Timeline.Item color="gray">
              {bizWhereConfig.map((conf, index) =>
                (<div style={{ marginBottom: 5 }} key={conf.bizauth_id || 'none'}>
                  <Select
                    value={conf.field}
                    style={{ width: 100, marginRight: 4 }}
                    onChange={value => this.handleBawFieldChange(value, index)}
                  >
                    {bizOptions.map(opt => (<Option
                      value={opt.bawField}
                      key={opt.bawField}
                    >{opt.msg}</Option>))}
                  </Select>
                  {conf.dataType !== 'date' ? <Select
                    showSearch
                    allowClear
                    mode="multiple"
                    optionFilterProp="children"
                    style={{ width: 500, marginRight: 4 }}
                    value={conf.values}
                    onChange={values => this.handleBawValueChange(values, index)}
                  >
                    {authParams[conf.paramType] && authParams[conf.paramType].map(f =>
                      (<Option key={f.value} value={f.value}>
                        {[f.value, f.text].filter(h => h).join('|')}
                      </Option>))}
                  </Select> : <RangePicker
                    value={conf.values.map(f => moment(f))}
                    format="YYYY/MM/DD"
                    style={{ width: 500, marginRight: 4 }}
                    onChange={(dates, dateStrings) =>
                      this.handleRangeDateChange(dates, dateStrings, index)}
                  />}
                  <Icon type="delete" theme="twoTone" onClick={() => this.handleDelete(index)} />
                </div>))}
            </Timeline.Item>
            <Timeline.Item>
              <Button shape="circle" icon="plus" size="small" onClick={this.handleAddWhereConf} />
            </Timeline.Item>
          </Timeline>
          <Button type="primary" onClick={this.handleSave} disabled={btnDisabled}>
            {this.msg('save')}
          </Button>
        </Card>
      </Spin>
    );
  }
}
