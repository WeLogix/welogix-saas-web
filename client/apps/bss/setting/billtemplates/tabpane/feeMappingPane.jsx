import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Input, InputNumber, message, Modal, Switch, Transfer, Form, Select } from 'antd';
import connectNav from 'client/common/decorators/connect-nav';
import { loadTemplate, addTemplateFee, deleteTemplateFees, updateTemplateFee, updateTemplateProps } from 'common/reducers/bssBillTemplate';
import { loadAllFeeElements } from 'common/reducers/bssSetting';
import DataPane from 'client/components/DataPane';
import SearchBox from 'client/components/SearchBox';
import RowAction from 'client/components/RowAction';
import { BSS_BILL_TEMPLATE_PROPS } from 'common/constants';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;

@injectIntl
@connect(
  state => ({
    templateFeelist: state.bssBillTemplate.currentTemplate.templateFeelist,
    loading: state.bssBillTemplate.templateFeeListLoading,
    listFilter: state.bssBillTemplate.templateFeeListFilter,
    billTemplatelist: state.bssBillTemplate.billTemplatelist,
    allFeeElements: state.bssSetting.allFeeElements,
    billProps: state.bssBillTemplate.currentTemplate.templateProps,
    templateName: state.bssBillTemplate.currentTemplate.templateName,
  }),
  {
    loadTemplate,
    addTemplateFee,
    deleteTemplateFees,
    updateTemplateFee,
    loadAllFeeElements,
    updateTemplateProps,
  }
)
@connectNav({
  depth: 3,
  moduleName: 'bss',
})
@Form.create()
export default class FeeMappingPane extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    templateId: PropTypes.number,
  }
  state = {
    selectedRowKeys: [],
    targetKeys: [],
    visible: false,
    fees: [],
    editItem: {},
    onEdit: false,
    billProps: {},
  };
  componentDidMount() {
    this.props.loadAllFeeElements();
    this.props.loadTemplate({
      templateId: this.props.templateId,
      filter: JSON.stringify(this.props.listFilter),
    }).then((result) => {
      if (!result.error) {
        this.initBillProps();
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.templateFeelist !== this.props.templateFeelist) {
      this.setState({ fees: nextProps.templateFeelist });
    }
  }
  msg = formatMsg(this.props.intl)
  handleFeesLoad = (filter) => {
    const { listFilter, templateId } = this.props;
    this.props.loadTemplate({
      templateId,
      filter: JSON.stringify(filter || listFilter),
    }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        this.handleDeselectRows();
      }
    });
  }
  handleSearch = (value) => {
    const filter = { ...this.props.listFilter, searchText: value };
    this.handleFeesLoad(filter);
  }
  handleBatchDelete = () => {
    const feeUids = this.state.selectedRowKeys;
    this.props.deleteTemplateFees(feeUids).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        message.info(this.msg('deletedSucceed'), 5);
        this.handleFeesLoad();
      }
    });
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  handleEditChange = (value) => {
    const feeCodes = value.join('|');
    this.setState({
      editItem: { ...this.state.editItem, fee_codes: feeCodes },
    });
  }
  handleTransferChange = (nextTargetKeys) => {
    this.setState({ targetKeys: nextTargetKeys });
  }
  handleAddModalCancel = () => {
    this.setState({
      visible: false,
      targetKeys: [],
    });
  }
  handleAddModalOk = () => {
    const formVal = this.props.form.getFieldsValue();
    const feeName = formVal.fee_name;
    const exist = this.props.templateFeelist.filter(tp => tp.fee_name === feeName)[0];
    if (exist) {
      message.error(this.msg('errorMessage'), 6);
    } else {
      const feeCodes = formVal.fee_codes.join('|');
      this.props.addTemplateFee({
        fee_name: feeName,
        fee_codes: feeCodes,
        templateId: this.props.templateId,
      }).then((result) => {
        if (!result.error) {
          this.handleFeesLoad();
        }
      });
      this.handleAddModalCancel();
    }
  }
  toggleAddFeeModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleFeeEdit = (row) => {
    if (this.state.editItem.type === 'PARAM') {
      this.initBillProps();
    }
    this.setState({ onEdit: true, editItem: { ...row } });
  }
  handleFeeEditCancel = (record) => {
    if (record.type === 'PARAM') {
      this.initBillProps();
    }
    this.setState({ onEdit: false, editItem: {} });
  }
  handleFeeUpdate = (record) => {
    if (record.type === 'PARAM') {
      const newProps = Object.keys(this.state.billProps).map(pkey => ({
        ...this.state.billProps[pkey],
        key: pkey,
      }));
      this.props.updateTemplateProps({
        billProps: JSON.stringify(newProps),
        templateId: this.props.templateId,
      }).then((result) => {
        if (!result.error) {
          this.setState({
            onEdit: false, editItem: {},
          });
        }
      });
    } else {
      const item = this.state.editItem;
      this.props.updateTemplateFee({
        fee_uid: item.fee_uid,
        fee_codes: item.fee_codes,
        bill_col_num: item.bill_col_num,
        fee_name: item.fee_name,
      });
      const fees = [...this.state.fees];
      const feeIndex = fees.findIndex(fe => fe.fee_uid === item.fee_uid);
      fees[feeIndex] = item;
      this.setState({
        onEdit: false, editItem: {}, fees,
      });
    }
  }
  handleBillPropsEdit = (key, value) => {
    const billProps = { ...this.state.billProps };
    if (key === 'bill_obj') {
      const { options } = BSS_BILL_TEMPLATE_PROPS.filter(tp => tp.key === key)[0];
      const billObj = options.filter(op => op.bizObj === value)[0];
      billProps[key] = billObj;
    } else {
      billProps[key].label = value;
    }
    this.setState({ billProps });
  }
  handleFeeNameChange = (value) => {
    const editItem = { ...this.state.editItem };
    editItem.fee_name = value;
    this.setState({ editItem });
  }
  hanldeSwitch = (checked, key) => {
    const billProps = { ...this.state.billProps };
    if (checked) {
      billProps[key] = {
        label: BSS_BILL_TEMPLATE_PROPS.filter(tp => tp.key === key)[0].label,
      };
    } else {
      delete billProps[key];
    }
    this.setState({ billProps });
  }
  handleColNumChange = (value, key) => {
    const billProps = { ...this.state.billProps };
    if (key === 'customs_entry_nos' || key === 'decl_sheet_qty' || key === 'trade_amount' || key === 'bill_obj') {
      billProps[key].bill_col_num = value;
      this.setState({ billProps });
    } else {
      const editItem = { ...this.state.editItem };
      editItem.bill_col_num = value;
      this.setState({ editItem });
    }
  }
  initBillProps = () => {
    const billProps = this.props.billProps ? JSON.parse(this.props.billProps) : [];
    if (billProps) {
      const newProps = {};
      billProps.forEach((tp) => {
        newProps[tp.key] = tp;
      });
      this.setState({ billProps: newProps });
    }
  }
  render() {
    const {
      loading,
      form: { getFieldDecorator },
      allFeeElements,
    } = this.props;
    const {
      targetKeys, visible, fees, onEdit, editItem, billProps,
    } = this.state;
    const columns = [
      {
        title: this.msg('账单列名'),
        dataIndex: 'fee_name',
        width: 250,
        render: (o, record) => {
          if (onEdit && editItem.fee_uid === record.fee_uid) {
            if (record.fee_uid === 'bill_obj') {
              return (<Select
                size="small"
                style={{ width: '100%' }}
                optionFilterProp="children"
                value={billProps[record.fee_uid] && billProps[record.fee_uid].bizObj}
                onChange={value => this.handleBillPropsEdit(record.fee_uid, value)}
              >
                {record.options.map(data =>
                  <Option key={data.bizObj}>{data.label}</Option>)}
              </Select>);
            } else if (record.fee_uid === 'customs_entry_nos' || record.fee_uid === 'decl_sheet_qty' || record.fee_uid === 'trade_amount') {
              return (<Input
                size="small"
                defaultValue={billProps[record.fee_uid] ? billProps[record.fee_uid].label : o}
                disabled={!billProps[record.fee_uid]}
                onChange={e => this.handleBillPropsEdit(record.fee_uid, e.target.value)}
              />);
            }
            return <Input size="small" defaultValue={o} onChange={e => this.handleFeeNameChange(e.target.value)} />;
          }
          return billProps[record.fee_uid] ? billProps[record.fee_uid].label : o;
        },
      }, {
        title: this.msg('导入账单列序号'),
        dataIndex: 'bill_col_num',
        width: 150,
        render: (o, record) => {
          let value;
          if (record.fee_uid === 'customs_entry_nos' || record.fee_uid === 'decl_sheet_qty' || record.fee_uid === 'trade_amount' || record.fee_uid === 'bill_obj') {
            value = billProps[record.fee_uid] ? billProps[record.fee_uid].bill_col_num : '';
          } else if (onEdit && editItem.fee_uid === record.fee_uid) {
            value = editItem.bill_col_num;
          } else {
            value = record.bill_col_num;
          }
          if (onEdit && editItem.fee_uid === record.fee_uid) {
            return (<InputNumber
              size="small"
              value={value}
              onChange={val => this.handleColNumChange(val, record.fee_uid)}
              disabled={((record.fee_uid === 'customs_entry_nos' || record.fee_uid === 'decl_sheet_qty' || record.fee_uid === 'trade_amount' || record.fee_uid === 'bill_obj') && !billProps[record.fee_uid])}
            />);
          }
          return value;
        },
      }, {
        title: this.msg('规则'),
        dataIndex: 'fee_codes',
        render: (o, record) => {
          if (onEdit && editItem.fee_uid === record.fee_uid) {
            if (record.type === 'PARAM' && record.key !== 'bill_obj') {
              return (<Switch checked={!!billProps[record.key]} size="small" onChange={checked => this.hanldeSwitch(checked, record.key)} />);
            } else if (record.type === 'PARAM' && record.key === 'bill_obj') {
              return null;
            }
            return (
              <Select
                size="small"
                mode="multiple"
                style={{ width: '100%' }}
                optionFilterProp="children"
                defaultValue={o ? o.split('|') : []}
                onChange={value => this.handleEditChange(value)}
              >
                {allFeeElements.map(data =>
                  <Option key={data.fee_code} value={data.fee_code}>{`${data.fee_code}|${data.fee_name}`}</Option>)}
              </Select>);
          }
          return o;
        },
      }, {
        title: this.msg('opCol'),
        dataIndex: 'OPS_COL',
        className: 'table-col-ops',
        width: 100,
        render: (o, record) => {
          if (onEdit && editItem.fee_uid === record.fee_uid) {
            return (<span>
              <RowAction onClick={this.handleFeeUpdate} icon="save" row={record} />
              <RowAction onClick={this.handleFeeEditCancel} row={record} icon="close" tooltip={this.msg('cancel')} />
            </span>
            );
          }
          return (<RowAction onClick={this.handleFeeEdit} icon="edit" row={record} />);
        },
      },
    ];
    const toolbarActions = (<span>
      <SearchBox value={this.props.listFilter.searchText} placeholder={this.msg('feeName')} onSearch={this.handleSearch} />
    </span>);
    return [
      <DataPane
        key="pane"
        toolbarActions={toolbarActions}
        toolbarExtra={<Button type="primary" icon="plus-circle-o" onClick={this.toggleAddFeeModal}>{this.msg('add')}</Button>}
        columns={columns}
        dataSource={BSS_BILL_TEMPLATE_PROPS.concat(fees)}
        rowKey="fee_uid"
        loading={loading}
        rowClassName={record => record.type === 'PARAM' && 'mute'}
      />,
      <Modal
        key="modal"
        title={this.msg('addFee')}
        width={695}
        visible={visible}
        onCancel={this.handleAddModalCancel}
        onOk={this.handleAddModalOk}
        destroyOnClose
      >
        <Form>
          <FormItem label={this.msg('feeName')}>
            {getFieldDecorator('fee_name', {
              rules: [{ required: true }],
            })(<Input />)}
          </FormItem>
          <FormItem label={this.msg('feeCodes')}>
            {getFieldDecorator('fee_codes', {})(<Transfer
              dataSource={allFeeElements}
              showSearch
              titles={['可选', '已选']}
              targetKeys={targetKeys}
              onChange={this.handleTransferChange}
              render={item => `${item.fee_code}-${item.fee_name}`}
              rowKey={item => item.fee_code}
              listStyle={{
                width: 300,
                height: 400,
              }}
            />)}
          </FormItem>
        </Form>
      </Modal>,
    ];
  }
}
