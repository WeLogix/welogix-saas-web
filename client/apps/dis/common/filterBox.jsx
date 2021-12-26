import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';
import { Timeline, Icon, Select, Input, DatePicker, message, InputNumber, Button, Checkbox, Divider } from 'antd';
import { DATE_FORMAT } from 'common/constants';
import RowAction from 'client/components/RowAction';
import { formatMsg } from '../message.i18n';

const { Option } = Select;
const { RangePicker } = DatePicker;
const InputGroup = Input.Group;
const countTime = (val, unit) => {
  switch (unit) {
    case 'd':
      return val * 24 * 3600 * 1000;
    case 'h':
      return val * 3600 * 1000;
    case 'm':
      return val * 60 * 1000;
    default:
      return val;
  }
};
const mapInitVal = (cmpOp, type) => {
  // complexCmpOps
  if (cmpOp === 'betweenNow') {
    return [0, 'd', 0, 'd'];
  } else if (cmpOp === 'between') {
    if (type === 'DATE') {
      return '';
    }
    return ['', ''];
  }
  // 简单比较的情况
  switch (type) {
    case 'NUMBER':
      return 0;
    case 'DATE':
      return moment();
    default: // TEXT
      return '';
  }
};
const RHS_FIELD_DROP_OP = ['ne', 'equal', 'gt', 'gte', 'lt', 'lte'];

@injectIntl
export default class FilterBox extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    whereClauseFieldsList: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
    })).isRequired,
    index: PropTypes.number.isRequired,
    handleFilterChange: PropTypes.func.isRequired,
    handleFilterDelete: PropTypes.func.isRequired,
    editable: PropTypes.bool.isRequired,
    deletable: PropTypes.bool.isRequired,
    rptParams: PropTypes.shape({
      certMark: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      ciqOrganization: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      cnport: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      cnregion: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      country: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      currency: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      customs: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      district: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      origPlace: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      port: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      remissionMode: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      tradeMode: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      transMode: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      trxnMode: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      unit: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      exemptionWay: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      wrapType: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      userMember: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.number,
        text: PropTypes.string,
      })),
      customer: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      vendor: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      supplier: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      intlTransMode: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      invShipRecv: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      inspectResultKind: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
      paasFlow: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string,
      })),
    }),
    DropTarget: PropTypes.node.isRequired,
  }
  state = {
    openIndex: -1,
  }
  msg = formatMsg(this.props.intl)
  handleDrop = ({
    label, field, oldField, bizObject,
  }) => {
    const oldWhereList = this.props.oldWhereClauses[this.props.index];
    const whereClauseFieldsList = [...this.props.whereClauseFieldsList];
    let filterBoxIndex;
    if (whereClauseFieldsList.find(where => where.rpt_obj_field === field
      && where.rpt_object === bizObject)) {
      message.info('该字段已存在');
      return;
    }
    if (oldField) {
      filterBoxIndex = whereClauseFieldsList.findIndex(item => item.rpt_obj_field === oldField);
    } else {
      filterBoxIndex = whereClauseFieldsList.length;
    }
    const { reportObjectMeta } = this.props;
    const objField = reportObjectMeta[bizObject].find(fieldInfo => fieldInfo.bm_field === field);
    if (objField) {
      whereClauseFieldsList[filterBoxIndex] = {
        label,
        rpt_obj_field: field,
        rpt_object: bizObject,
        rpt_field_cmpop: 'equal',
        rpt_field_cmpvalue: mapInitVal('equal', objField.bmf_data_type),
        rpt_wherecls_seq: this.props.index,
        effective: false,
      };
      if (objField.bm_dw_field) {
        whereClauseFieldsList[filterBoxIndex].rpt_obj_dwfield = objField.bm_dw_field;
      }
      // 防止删除后再加入同一个字段(失去id)导致错误
      if (oldWhereList) {
        const oldWhere = oldWhereList.find(where => where.rpt_obj_field === field
        && where.rpt_object === bizObject);
        if (oldWhere && oldWhere.id) {
          whereClauseFieldsList[filterBoxIndex].id = oldWhere.id;
        }
      }
      this.props.handleFilterChange(whereClauseFieldsList, this.props.index);
    }
  }
  handleFieldDrop = ({
    field, oldField, bizObject, oldBizObject, // dataType,
  }) => {
    // 检测 dataType 是否一致，如果拒绝则提示
    const objField = this.props.reportObjectMeta[bizObject]
      .find(fieldInfo => fieldInfo.bm_field === field);
    const oldObjField = this.props.reportObjectMeta[oldBizObject]
      .find(fieldInfo => fieldInfo.bm_field === oldField);
    if (!objField) {
      return;
    }
    if (field === oldField) {
      message.info('同一字段不可比较');
      return;
    }
    if (bizObject && oldBizObject && (oldBizObject !== bizObject)) {
      message.info('字段应属于同一业务对象');
      return;
    }
    if ((objField && objField.bmf_data_type) !== (oldObjField && oldObjField.bmf_data_type)) {
      message.info('字段类型不同,不可比较');
      return;
    }
    const whereClauseFieldsList = [...this.props.whereClauseFieldsList];
    const filterBoxIndex = whereClauseFieldsList.findIndex(item => item.rpt_obj_field === oldField);
    whereClauseFieldsList[filterBoxIndex] = {
      ...whereClauseFieldsList[filterBoxIndex],
      rpt_field_cmpvalue: field,
      rpt_dwfield_cmpvalue: objField.bm_dw_field,
      rpt_cmpvalue_source: 'field', // 切回input模式时 置为input
    };
    this.props.handleFilterChange(whereClauseFieldsList, this.props.index);
  }
  handleDelete = () => {
    const { index } = this.props;
    this.props.handleFilterDelete(index);
  }
  handleDeleteCondition = (filterBoxIndex) => {
    const whereClauseFieldsList = [...this.props.whereClauseFieldsList];
    whereClauseFieldsList.splice(filterBoxIndex, 1);
    this.props.handleFilterChange(whereClauseFieldsList, this.props.index);
  }
  handleSelectCompareCondition = (value, filterBoxIndex) => {
    const whereClauseFieldsList = [...this.props.whereClauseFieldsList];
    const whereClauseField = { ...whereClauseFieldsList[filterBoxIndex] };
    whereClauseFieldsList[filterBoxIndex] = whereClauseField;

    const { rpt_cmpvalue_source: cmpvalueSource } = whereClauseField;
    const objField = this.props.reportObjectMeta[whereClauseField.rpt_object]
      .find(fieldInfo => fieldInfo.bm_field === whereClauseField.rpt_obj_field);
    if (cmpvalueSource !== 'field') { // input -> input
      whereClauseField.rpt_field_cmpvalue = mapInitVal(value, objField && objField.bmf_data_type);
    } else { // field -> *
      // 若现在可以拖入 则value无变化 若现在不能拖入 则置空source 并对应类型初始化
      const isNewCmpOpDroppable = RHS_FIELD_DROP_OP.findIndex(str => str === value) >= 0;
      if (!isNewCmpOpDroppable) {
        whereClauseField.rpt_cmpvalue_source = 'input';
        whereClauseField.rpt_field_cmpvalue = mapInitVal(value, objField && objField.bmf_data_type);
      }
    }
    whereClauseField.rpt_field_cmpop = value;
    if (value === 'empty' || value === 'notempty') {
      whereClauseField.effective = true;
    } else if (!whereClauseField.rpt_field_cmpvalue) {
      whereClauseField.effective = false;
    }
    this.props.handleFilterChange(whereClauseFieldsList, this.props.index);
  }
  handleNumberChange = (number, filterBoxIndex, type) => {
    const whereClauseFieldsList = [...this.props.whereClauseFieldsList];
    const { rpt_field_cmpvalue: rangeValues } = whereClauseFieldsList[filterBoxIndex];
    if (type === 'start') {
      if (rangeValues.length >= 1) {
        rangeValues[0] = number;
      } else {
        rangeValues.push(number);
      }
      whereClauseFieldsList[filterBoxIndex].rpt_field_cmpvalue = rangeValues;
    } else if (type === 'end') {
      if (rangeValues.length === 1) {
        rangeValues.push(number);
      } else if (rangeValues.length === 0) {
        rangeValues.push('', number);
      } else if (rangeValues.length === 2) {
        rangeValues[1] = number;
      }
      whereClauseFieldsList[filterBoxIndex].rpt_field_cmpvalue = rangeValues;
    } else if (type === 'number') {
      whereClauseFieldsList[filterBoxIndex].rpt_field_cmpvalue = number;
    }
    whereClauseFieldsList[filterBoxIndex].effective =
    !!whereClauseFieldsList[filterBoxIndex].rpt_field_cmpvalue;
    this.props.handleFilterChange(whereClauseFieldsList, this.props.index);
  }
  handleDropdownVisibleChange = (open, filterBoxIndex) => {
    if (open) {
      this.setState({
        openIndex: filterBoxIndex,
      });
    }
  }
  handleCheck = (checked, filterBoxIndex) => {
    const whereClauseFieldsList = [...this.props.whereClauseFieldsList];
    whereClauseFieldsList[filterBoxIndex].rpt_field_cmpvalue = checked ? [] : '';
    whereClauseFieldsList[filterBoxIndex].effective = !!checked;
    this.props.handleFilterChange(whereClauseFieldsList, this.props.index);
  }
  handleDateRangeChange = (value, filterBoxIndex) => {
    this.setState({
      openIndex: -1,
    });
    this.handleDateChange(value, filterBoxIndex);
  }
  handleDateChange = (value, filterBoxIndex) => {
    const whereClauseFieldsList = [...this.props.whereClauseFieldsList];
    whereClauseFieldsList[filterBoxIndex].rpt_field_cmpvalue = value;
    whereClauseFieldsList[filterBoxIndex].effective = true;
    this.props.handleFilterChange(whereClauseFieldsList, this.props.index);
  }
  handleTextChange = (text, filterBoxIndex) => {
    const whereClauseFieldsList = [...this.props.whereClauseFieldsList];
    whereClauseFieldsList[filterBoxIndex].rpt_field_cmpvalue = text;
    whereClauseFieldsList[filterBoxIndex].effective = !!text;
    this.props.handleFilterChange(whereClauseFieldsList, this.props.index);
  }
  handleFieldsChange = (value, filterBoxIndex) => {
    const whereClauseFieldsList = [...this.props.whereClauseFieldsList];
    whereClauseFieldsList[filterBoxIndex].rpt_field_cmpvalue = value;
    whereClauseFieldsList[filterBoxIndex].effective = value.length > 0;
    this.props.handleFilterChange(whereClauseFieldsList, this.props.index);
  }
  handleRelativeDateChange = (value, filterBoxIndex, type, valueSeq) => {
    const whereClauseFieldsList = [...this.props.whereClauseFieldsList];
    const relatedDate = [...whereClauseFieldsList[filterBoxIndex].rpt_field_cmpvalue];
    relatedDate[0] = parseInt(relatedDate[0], 10);
    relatedDate[2] = parseInt(relatedDate[2], 10);
    if (type === 'value' || type === 'sign') {
      if (relatedDate.length >= 1) {
        const index = valueSeq === 1 ? 0 : 2;
        if (type === 'value') {
          relatedDate[index] = relatedDate[index] < 0 ? -value : value;
        } else {
          relatedDate[index] = value;
        }
        if (relatedDate[0] === undefined) {
          relatedDate[0] = 0;
          relatedDate[1] = 'd';
        }
        if (relatedDate[2] === undefined) {
          relatedDate[2] = 0;
          relatedDate[3] = 'd';
        }
        const isBetweenAllowed = countTime(relatedDate[0], relatedDate[1])
          <= countTime(relatedDate[2], relatedDate[3]);
        if (!isBetweenAllowed) {
          message.info('区间右界限必须大于区间左界限');
          return;
        }
      } else {
        relatedDate.push(value);
      }
      whereClauseFieldsList[filterBoxIndex].rpt_field_cmpvalue = relatedDate;
    } else if (type === 'unit') {
      if (relatedDate.length === 1) {
        relatedDate.push(value);
      } else if (relatedDate.length === 0) {
        relatedDate.push(0, value);
      } else if (relatedDate.length >= 2) {
        relatedDate[valueSeq === 1 ? 1 : 3] = value;
      }
      whereClauseFieldsList[filterBoxIndex].rpt_field_cmpvalue = relatedDate;
    }
    whereClauseFieldsList[filterBoxIndex].effective = true;
    this.props.handleFilterChange(whereClauseFieldsList, this.props.index);
  }
  handleSwitchValueSource = (value, filterBoxIndex) => () => {
    const whereClauseFieldsList = [...this.props.whereClauseFieldsList];
    const whereClauseField = whereClauseFieldsList[filterBoxIndex];
    const objField = this.props.reportObjectMeta[whereClauseField.rpt_object]
      .find(fieldInfo => fieldInfo.bm_field === whereClauseField.rpt_obj_field);
    whereClauseFieldsList[filterBoxIndex] = {
      ...whereClauseFieldsList[filterBoxIndex],
      rpt_cmpvalue_source: value,
      rpt_field_cmpvalue: mapInitVal(null, objField && objField.bmf_data_type),
    };
    this.props.handleFilterChange(whereClauseFieldsList, this.props.index);
  }
  renderNumberOptions = (filterBoxIndex) => {
    const {
      rpt_field_cmpop: compareCondition, rpt_field_cmpvalue: value,
      rpt_object: rptObject, rpt_obj_field: rptObjField, rpt_cmpvalue_source: rptCmpvalueSource,
    } = [...this.props.whereClauseFieldsList][filterBoxIndex];
    const { editable, DropTarget } = this.props;
    if (compareCondition === 'empty' || compareCondition === 'notempty') {
      return <Input disabled style={{ width: 230 }} />;
    } else if (compareCondition === 'between') {
      return (<InputGroup compact style={{ display: 'inline-block', top: -5, width: 230 }}>
        <Input
          value={value[0]}
          style={{ width: 100 }}
          onChange={e => this.handleNumberChange(e.target.value, filterBoxIndex, 'start')}
          disabled={!editable}
        />
        <Input
          style={{
            width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff',
          }}
          placeholder="~"
          disabled
        />
        <Input
          value={value[1]}
          style={{ width: 100, borderLeft: 0 }}
          onChange={e => this.handleNumberChange(e.target.value, filterBoxIndex, 'end')}
          disabled={!editable}
        />
      </InputGroup>);
    }
    const objField = this.props.reportObjectMeta[rptObject]
      .find(fieldInfo => fieldInfo.bm_field === value);
    return (
      <DropTarget
        bizObject={rptObject}
        field={rptObjField}
        handleDrop={this.handleFieldDrop}
        extra={rptCmpvalueSource === 'field' && <Button
          type="primary"
          ghost
          onClick={this.handleSwitchValueSource('', filterBoxIndex)}
        >
          手动输入
        </Button>}
      >
        {rptCmpvalueSource === 'field' ? objField && objField.bmf_label_name :
        <Input
          value={value}
          onChange={e => this.handleNumberChange(e.target.value, filterBoxIndex, 'number')}
          style={{ width: 230 }}
          type="number"
        />}
      </DropTarget>
    );
  }
  renderDateOptions = (filterBoxIndex) => {
    const {
      rpt_field_cmpop: compareCondition, rpt_field_cmpvalue: value,
      rpt_obj_field: rptObjField, rpt_object: rptObject, rpt_cmpvalue_source: rptCmpvalueSource,
    } = [...this.props.whereClauseFieldsList][filterBoxIndex];
    const { editable, DropTarget } = this.props;
    const { openIndex } = this.state;
    if (compareCondition === 'empty' || compareCondition === 'notempty') {
      return <Input disabled style={{ width: 230 }} />;
    } else if (compareCondition === 'between') {
      let open = false;
      if (filterBoxIndex === openIndex) {
        open = true;
      }
      return (<Select
        style={{ width: 230 }}
        onSelect={val => this.handleDateRangeChange(val, filterBoxIndex)}
        open={open}
        value={Array.isArray(value) ? value.join(' ~ ') : value}
        onDropdownVisibleChange={op => this.handleDropdownVisibleChange(op, filterBoxIndex)}
        dropdownRender={menu => (
          <div>
            {menu}
            <Divider style={{ margin: '4px 0' }} />
            <Checkbox
              onChange={e => this.handleCheck(e.target.checked, filterBoxIndex)}
              style={{ marginLeft: 10, marginBottom: 5 }}
              checked={Array.isArray(value)}
            >自定义</Checkbox>
            {Array.isArray(value) && <RangePicker
              value={value.map(date => date && moment(date))}
              ranges={{ [this.msg('rangeDateToday')]: [moment(), moment()], [this.msg('rangeDateMonth')]: [moment(), moment().endOf('month')] }}
              onChange={(data, dataString) =>
                this.handleDateRangeChange(dataString, filterBoxIndex)}
              style={{ width: 230, marginBottom: 5 }}
              disabled={!editable}
              format={DATE_FORMAT}
            />}
          </div>
         )}
      >
        <Option value="0d" key="0d">今天</Option>
        <Option value="-1d" key="-1d">昨天</Option>
        <Option value="1d" key="1d">明天</Option>
        <Option value="0M" key="0M">本月</Option>
        <Option value="-1M" key="-1M">上月</Option>
        <Option value="1M" key="1M">下月</Option>
        <Option value="0Y" key="0Y">本年度</Option>
        <Option value="-1Y" key="-1Y">上年度</Option>
        <Option value="1Y" key="1Y">下年度</Option>
      </Select>);
    } else if (compareCondition === 'betweenNow') {
      /* int正负表现在第一个select 当日0 早于当日- 晚于当日+ Input中是绝对值 */
      return (<span>
        <Select
          style={{ width: 100, marginRight: 4 }}
          onChange={val => this.handleRelativeDateChange(val, filterBoxIndex, 'sign', 1)}
          value={Math.sign(value[0])}
          disabled={!editable}
        >
          <Option value={-1}>{this.msg('todayEarlier')}</Option>
          <Option value={0}>{this.msg('today')}</Option>
          <Option value={1}>{this.msg('todayLater')}</Option>
        </Select>
        {parseInt(value[0], 10) !== 0 && [<InputNumber
          style={{ width: 55, marginRight: 4 }}
          value={Math.abs(value[0])}
          onChange={v => this.handleRelativeDateChange(v, filterBoxIndex, 'value', 1)}
          disabled={!editable}
        />, <Select
          style={{ width: 72, marginRight: 4 }}
          onChange={val => this.handleRelativeDateChange(val, filterBoxIndex, 'unit', 1)}
          value={value[1]}
          disabled={!editable}
        >
          <Option value="d">{this.msg('day')}</Option>
          <Option value="h">{this.msg('hour')}</Option>
          <Option value="m">{this.msg('minute')}</Option>
        </Select>]}
        ~
        <Select
          style={{ width: 100, margin: '0px 8px' }}
          onChange={val => this.handleRelativeDateChange(val, filterBoxIndex, 'sign', 2)}
          value={Math.sign(value[2])}
          disabled={!editable}
        >
          <Option value={-1}>{this.msg('todayEarlier')}</Option>
          <Option value={0}>{this.msg('today')}</Option>
          <Option value={1}>{this.msg('todayLater')}</Option>
        </Select>
        {parseInt(value[2], 10) !== 0 && [<InputNumber
          style={{ width: 55, marginRight: 4 }}
          value={Math.abs(value[2])}
          onChange={v => this.handleRelativeDateChange(v, filterBoxIndex, 'value', 2)}
          disabled={!editable}
        />, <Select
          style={{ width: 72 }}
          onChange={val => this.handleRelativeDateChange(val, filterBoxIndex, 'unit', 2)}
          value={value[3]}
          disabled={!editable}
        >
          <Option value="d">{this.msg('day')}</Option>
          <Option value="h">{this.msg('hour')}</Option>
          <Option value="m">{this.msg('minute')}</Option>
        </Select>]}
      </span>);
    }
    const objField = this.props.reportObjectMeta[rptObject]
      .find(fieldInfo => fieldInfo.bm_field === value);
    return (
      <DropTarget
        bizObject={rptObject}
        field={rptObjField}
        handleDrop={this.handleFieldDrop}
        extra={rptCmpvalueSource === 'field' && <Button
          type="primary"
          ghost
          onClick={this.handleSwitchValueSource('', filterBoxIndex)}
          disabled={!editable}
        >
          手动输入
        </Button>}
      >
        {rptCmpvalueSource === 'field' ? objField && objField.bmf_label_name :
        <DatePicker
          value={value ? moment(value) : moment()}
          onChange={(date, dataString) => this.handleDateChange(dataString, filterBoxIndex)}
          style={{ width: 230 }}
          disabled={!editable}
        />}
      </DropTarget>
    );
  }
  renderTextOptions = (filterBoxIndex) => {
    const {
      rpt_field_cmpop: compareCondition, rpt_field_cmpvalue: value, rpt_obj_field: field,
      rpt_object: rptObject, rpt_cmpvalue_source: rptCmpvalueSource,
      /* rpt_obj_field: rptObjField, */
    } = [...this.props.whereClauseFieldsList][filterBoxIndex];
    const { editable, DropTarget } = this.props;
    if (compareCondition === 'empty' || compareCondition === 'notempty') {
      return <Input disabled style={{ width: 230 }} />;
    }
    const objField = this.props.reportObjectMeta[rptObject]
      .find(fieldInfo => fieldInfo.bm_field === value);
    return (
      <DropTarget
        bizObject={rptObject}
        field={field}
        handleDrop={this.handleFieldDrop}
        extra={rptCmpvalueSource === 'field' && <Button
          type="primary"
          ghost
          onClick={this.handleSwitchValueSource('', filterBoxIndex)}
          disabled={!editable}
        >
          手动输入
        </Button>}
      >
        {rptCmpvalueSource === 'field' ? objField && objField.bmf_label_name : <Input
          value={value}
          style={{ width: 230 }}
          onChange={e => this.handleTextChange(e.target.value, filterBoxIndex)}
          disabled={!editable}
        />}
      </DropTarget>
    );
  }
  renderOptionsByParamType = (filterBoxIndex, paramType) => {
    const { rptParams, editable } = this.props;
    const { rpt_field_cmpvalue: cmpvalue } = [...this.props.whereClauseFieldsList][filterBoxIndex];
    const options = rptParams[paramType] || [];
    let controlValue;
    if (cmpvalue) {
      if (Array.isArray(cmpvalue)) {
        controlValue = cmpvalue;
      } else {
        controlValue = cmpvalue.split(',').filter(val => val);
      }
    }
    return (<Select
      mode="multiple"
      style={{ width: 334 }}
      optionFilterProp="children"
      onChange={value => this.handleFieldsChange(value, filterBoxIndex)}
      value={controlValue}
      disabled={!editable}
    >
      {options.map(op => <Option value={String(op.value)} key={op.value}>{op.text}</Option>)}
    </Select>);
  }
  render() {
    const {
      whereClauseFieldsList, index, reportObjectMeta, editable, DropTarget, deletable,
    } = this.props;
    const filterConditions = whereClauseFieldsList.map((filterField, filterBoxIndex) => {
      const objField = reportObjectMeta[filterField.rpt_object] &&
      reportObjectMeta[filterField.rpt_object].find(item =>
        item.bm_field === filterField.rpt_obj_field);
      const dropItem = (<DropTarget
        field={filterField.rpt_obj_field}
        handleDrop={this.handleDrop}
        editable={editable}
      >
        {filterField.label || (objField && (objField.bmf_label_name || objField.bmf_default_name))}
      </DropTarget>);
      const del = <span style={{ marginLeft: 4 }}><RowAction icon="delete" onClick={() => this.handleDeleteCondition(filterBoxIndex)} /></span>;
      let dataOption;
      if (objField && objField.bmf_data_type) {
        dataOption = (<span>
          {dropItem}
          {!objField.bmf_param_type &&
          <Select
            showSearch
            allowClear
            optionFilterProp="children"
            onSelect={value => this.handleSelectCompareCondition(value, filterBoxIndex)}
            style={{ width: 100, marginRight: 4 }}
            value={filterField.rpt_field_cmpop}
            disabled={!editable}
          >
            <Option value="equal">等于</Option>
            <Option value="ne">不等于</Option>
            <Option value="empty">为空</Option>
            <Option value="notempty">不为空</Option>
            {objField.bmf_data_type === 'NUMBER' &&
            [<Option value="lt" key="lt">小于</Option>,
              <Option value="gt" key="gt">大于</Option>,
              <Option value="gte" key="gte">大于等于</Option>,
              <Option value="lte" key="lte">小于等于</Option>,
              <Option value="between" key="between">介于</Option>]}
            {objField.bmf_data_type === 'DATE' &&
            [<Option key="lt" value="lt">早于</Option>,
              <Option key="gt" value="gt">晚于</Option>,
              <Option key="between" value="between">时间段</Option>,
              <Option key="betweenNow" value="betweenNow">当日区间</Option>]}
            {objField.bmf_data_type === 'TEXT' &&
            [<Option key="in" value="in">包含</Option>,
              <Option key="notin" value="notin">不包含</Option>]}
          </Select>}
          {objField.bmf_param_type &&
            this.renderOptionsByParamType(filterBoxIndex, objField.bmf_param_type)}
          {objField.bmf_data_type === 'NUMBER' && !objField.bmf_param_type && this.renderNumberOptions(filterBoxIndex)}
          {objField.bmf_data_type === 'DATE' && this.renderDateOptions(filterBoxIndex)}
          {objField.bmf_data_type === 'TEXT' && !objField.bmf_param_type && this.renderTextOptions(filterBoxIndex)}
          {deletable && del}
        </span>);
      } else {
        dataOption = dropItem;
      }
      return (<Timeline.Item color="gray">{dataOption}</Timeline.Item>);
    });
    return (
      <div className="filter-group">
        <Timeline>
          <Timeline.Item dot={<Icon type="down-square" theme="outlined" />}>
            <span className="filter-symbol">
              {deletable && <RowAction danger onClick={this.handleDelete} icon="minus-circle" />}
              {`筛选器${index + 1}`}
            </span>
          </Timeline.Item>
          {filterConditions}
          {editable && <Timeline.Item color="gray">
            <span>
              <DropTarget
                handleDrop={this.handleDrop}
                editable={editable}
              />
            </span>
          </Timeline.Item>}
        </Timeline>
      </div>
    );
  }
}
