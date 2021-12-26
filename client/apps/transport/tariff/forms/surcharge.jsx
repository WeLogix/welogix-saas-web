import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Button, Input, Select, Switch, message, Tag, Cascader, Mention, Transfer, Modal } from 'antd';
import { BSS_FEE_TYPE, TMS_BILLING_CASCADER, TMS_EVENTS } from 'common/constants';
import RowAction from 'client/components/RowAction';
import { updateFee, addFee, deleteFee, loadQuoteFees } from 'common/reducers/tmsQuote';
import { loadAllFeeGroups, loadParentFeeElements } from 'common/reducers/bssSetting';
import DataPane from 'client/components/DataPane';
import ToolbarAction from 'client/components/ToolbarAction';
import { formatMsg } from '../message.i18n';

const { Nav } = Mention;
const { Option } = Select;

const BILLING_METHODS = TMS_BILLING_CASCADER.reduce((acc, blc) =>
  acc.concat(blc.children.map(child => ({
    ...child, parent: blc.value,
  }))), []);
const FORMULA_PARAMS = TMS_BILLING_CASCADER.find(item =>
  item.value === 'auto').children.filter(item =>
  item.formula === true).map(blc => ({ value: blc.value, text: blc.formula_label }));
@injectIntl
@connect(
  state => ({
    quoteNo: state.transportTariff.agreement.quoteNo,
    quoteFeesLoading: state.tmsQuote.quoteFeesLoading,
    parentFeeElements: state.bssSetting.parentFeeElements,
    allFeeGroups: state.bssSetting.allFeeGroups,
  }),
  {
    updateFee,
    addFee,
    deleteFee,
    loadQuoteFees,
    loadParentFeeElements,
    loadAllFeeGroups,
  }
)

export default class SurchargeForm extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    suggestions: [],
    selectedRowKeys: [],
    targetKeys: [],
    selectedKeys: [],
    visible: false,
    fees: [],
    editItem: {},
    transferData: [],
  };
  componentDidMount() {
    this.props.loadAllFeeGroups();
    this.props.loadParentFeeElements().then((result) => {
      this.handleElementLoad(result.data);
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.quoteFeesReload) {
      this.handleElementLoad(nextProps.parentFeeElements);
    }
  }
  msg = formatMsg(this.props.intl)
  handleElementLoad = (parentFeeElements) => {
    this.props.loadQuoteFees(this.props.quoteNo).then((result) => {
      const quoteFees = result.data;
      const existFeeCodes = quoteFees.map(fe => fe.fee_code);
      const allFeeCodes = parentFeeElements.map(fe => fe.fee_code);
      const diffCodes = allFeeCodes.filter(code => !existFeeCodes.includes(code));
      const transferData = parentFeeElements.filter(fee => diffCodes.includes(fee.fee_code));
      this.setState({ fees: result.data, transferData });
    });
  }
  handleFeesBatchDelete = () => {
    const feeCodes = this.state.selectedRowKeys;
    this.props.deleteFee(feeCodes, this.props.quoteNo).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        message.info(this.msg('deletedSucceed'), 5);
        this.handleDeselectRows();
        const addData = this.props.parentFeeElements.filter(fe =>
          feeCodes.includes(fe.fee_code));
        const data = this.state.transferData.concat(addData);
        const fees = this.state.fees.filter(fe => !feeCodes.includes(fe.fee_code));
        this.setState({ transferData: data, fees });
      }
    });
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  handleFormulaSearch = (value) => {
    const searchValue = value.toLowerCase();
    const filtered = FORMULA_PARAMS.filter(item =>
      item.value.toLowerCase().indexOf(searchValue) !== -1);
    const suggestions = filtered.map(suggestion =>
      (<Nav value={suggestion.value} data={suggestion}>
        <span>{suggestion.text} - {suggestion.value} </span>
      </Nav>));
    this.setState({ suggestions });
  }
  handleEditChange = (field, value) => {
    if (field === 'billing_way' && value === '$manual') {
      this.setState({
        editItem: {
          ...this.state.editItem, [field]: value, formula_factor: '', max_amount: 0, min_amount: 0,
        },
      });
    } else if (field === 'billing_way' && (value === '$formula' || value === 'freight_rates')) {
      this.setState({
        editItem: {
          ...this.state.editItem, [field]: value, formula_factor: '',
        },
      });
    } else {
      this.setState({
        editItem: { ...this.state.editItem, [field]: value },
      });
    }
  }
  handleFormulaChange = (editorState) => {
    const formula = Mention.toString(editorState);
    this.handleEditChange('formula_factor', formula);
  }
  handleTransferChange = (nextTargetKeys) => {
    this.setState({ targetKeys: nextTargetKeys });
  }
  handleTransferSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
  }
  handleTransferCancel = () => {
    this.setState({
      visible: false,
      targetKeys: [],
    });
  }
  handleTransferOk = () => {
    const { targetKeys } = this.state;
    this.props.addFee(targetKeys, this.props.quoteNo).then((result) => {
      if (!result.error) {
        this.handleElementLoad(this.props.parentFeeElements);
      }
    });
    this.handleTransferCancel();
  }
  toggleAddFeeModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleFeeEdit = (row) => {
    const editItem = { ...row };
    if (!editItem.billing_way && editItem.fee_type === 'AP') {
      editItem.billing_way = '$manual';
    }
    this.setState({ editItem });
  }
  handleFeeEditCancel = () => {
    this.setState({ editItem: {} });
  }
  handleFeeSave = () => {
    const item = this.state.editItem;
    this.props.updateFee({
      id: item.id,
      billing_way: item.billing_way,
      formula_factor: item.formula_factor,
      need_settle: item.need_settle,
      max_amount: item.max_amount,
      min_amount: item.min_amount,
      split_allowed: item.split_allowed,
      invoice_party: item.invoice_party,
      invoice_cat: item.invoice_cat,
    }).then((result) => {
      if (!result.error) {
        const fees = [...this.state.fees];
        const feeIndex = fees.findIndex(fe => fe.id === item.id);
        fees[feeIndex] = item;
        this.setState({
          editItem: {}, fees,
        });
      } else if (result.error.message.key === 'invalid_formula') {
        message.error(<span>公式错误:<br />{result.error.message.msg}</span>, 10);
      } else {
        message.error(result.error.message);
      }
    });
  }
  render() {
    const {
      quoteFeesLoading, allFeeGroups, readOnly,
    } = this.props;
    const {
      targetKeys, selectedKeys, visible, fees, transferData, editItem,
    } = this.state;
    const columns = [
      {
        title: this.msg('seqNo'),
        width: 50,
        align: 'center',
        className: 'table-col-seq',
        render: (o, record, index) => <span>{index + 1}</span>,
      }, {
        title: this.msg('feeCode'),
        dataIndex: 'fee_code',
        width: 100,
      }, {
        title: this.msg('feeName'),
        dataIndex: 'fee_name',
        width: 150,
      }, {
        title: this.msg('feeGroup'),
        dataIndex: 'fee_group',
        width: 100,
        render: o =>
          allFeeGroups.find(fg => fg.fee_group_code === o) &&
          allFeeGroups.find(fg => fg.fee_group_code === o).fee_group_name,
      }, {
        title: this.msg('feeType'),
        dataIndex: 'fee_type',
        width: 100,
        render: (o) => {
          const type = BSS_FEE_TYPE.filter(fe => fe.key === o)[0];
          return type ? <Tag color={type.tag}>{type.text}</Tag> : <span />;
        },
      }, {
        title: this.msg('billingCondition'),
        dataIndex: 'billing_event',
        width: 100,
        render: (o, record) => {
          const event = TMS_EVENTS.find(eve => eve.key === record.billing_way);
          if (event) {
            return event.text;
          }
          return '--';
        },
      }, {
        title: this.msg('billingWay'),
        dataIndex: 'billing_way',
        width: 160,
        render: (bway, record) => {
          let optionArray = TMS_BILLING_CASCADER;
          if (editItem.id === record.id) {
            if (record.fee_type === 'AP') {
              optionArray = TMS_BILLING_CASCADER.filter(man => (man.key === 'man'));
            }
            const method = BILLING_METHODS.filter(bl => bl.key === editItem.billing_way)[0];
            return (<Cascader
              size="small"
              style={{ width: '100%' }}
              expandTrigger="hover"
              options={optionArray}
              placeholder=""
              value={[method ? method.parent : 'auto', editItem.billing_way]}
              onChange={cascader => this.handleEditChange('billing_way', cascader[cascader.length - 1])}
            />);
          }
          const method = BILLING_METHODS.filter(bl => bl.key === bway)[0];
          return method ? method.label : '';
        },
      }, {
        title: this.msg('formulaFactor'),
        dataIndex: 'formula_factor',
        width: 200,
        render: (o, record) => {
          if (editItem.id === record.id) {
            if (editItem.billing_way === '$formula') {
              return (<Mention
                size="small"
                suggestions={this.state.suggestions}
                prefix="$"
                onSearchChange={this.handleFormulaSearch}
                defaultValue={o ? Mention.toContentState(o) : null}
                placeholder="$公式"
                onChange={editorState => this.handleFormulaChange(editorState)}
                multiLines
                style={{ width: '100%' }}
              />);
            }
            if (editItem.billing_way === '$input') {
              return (
                <Mention
                  size="small"
                  prefix="$"
                  style={{ width: '100%' }}
                  defaultValue={o ? Mention.toContentState(o) : null}
                  suggestions={['input']}
                  onChange={editorState => this.handleFormulaChange(editorState)}
                />
              );
            }
            if (editItem.billing_way === '$manual' || editItem.billing_way === 'freight_rates') {
              return (
                <Input
                  size="small"
                  value={editItem.formula_factor}
                  disabled
                  placeholder="单价"
                  onChange={e => this.handleEditChange('formula_factor', e.target.value)}
                  style={{ width: '100%' }}
                />
              );
            }
            return (
              <Input
                size="small"
                defaultValue={o}
                placeholder="单价"
                onChange={e => this.handleEditChange('formula_factor', e.target.value)}
                style={{ width: '100%' }}
              />
            );
          }
          return o;
        },
      }, {
        title: this.msg('minAmount'),
        dataIndex: 'min_amount',
        width: 100,
        render: (o, record) => {
          if (editItem.id === record.id) {
            return (
              <Input
                size="small"
                value={editItem.min_amount}
                disabled={editItem.billing_way === '$manual'}
                onChange={e => this.handleEditChange('min_amount', e.target.value)}
                style={{ width: '100%' }}
              />
            );
          }
          return o || null;
        },
      }, {
        title: this.msg('maxAmount'),
        dataIndex: 'max_amount',
        width: 100,
        render: (o, record) => {
          if (editItem.id === record.id) {
            return (
              <Input
                size="small"
                value={editItem.max_amount}
                disabled={editItem.billing_way === '$manual'}
                onChange={e => this.handleEditChange('max_amount', e.target.value)}
                style={{ width: '100%' }}
              />
            );
          }
          return o || null;
        },
      }, {
        title: this.msg('defaultInvoiceParty'),
        dataIndex: 'invoice_party',
        width: 150,
        render: (invp, record) => {
          if (record.fee_type === 'AP') {
            if (editItem.id === record.id) {
              return (
                <Select
                  allowClear
                  size="small"
                  style={{ width: '100%' }}
                  value={(editItem.invoice_party || '').toString()}
                  onChange={value => this.handleEditChange('invoice_party', value)}
                >
                  <Option value="1" key="1">货主</Option>
                  <Option value="2" key="2">上游客户</Option>
                  <Option value="3" key="3">我方</Option>
                  <Option value="4" key="4">下游服务商</Option>
                </Select>);
            }
            switch (invp) {
              case 1:
                return '货主';
              case 2:
                return '上游客户';
              case 3:
                return '我方';
              case 4:
                return '下游服务商';
              default:
                return invp;
            }
          }
          return '--';
        },
      }, {
        title: this.msg('defaultInvoiceCat'),
        dataIndex: 'invoice_cat',
        width: 150,
        render: (o, record) => {
          if (record.fee_type === 'AP') {
            if (this.state.editItem.id === record.id) {
              return (
                <Select
                  allowClear
                  size="small"
                  style={{ width: '100%' }}
                  value={this.state.editItem.invoice_cat}
                  onChange={value => this.handleEditChange('invoice_cat', value)}
                >
                  <Option value="VAT_S" key="VAT_S">增值税专用发票</Option>
                  <Option value="VAT_N" key="VAT_N">增值税普通发票</Option>
                </Select>);
            }
            switch (o) {
              case 'VAT_S':
                return '增值税专用发票';
              case 'VAT_N':
                return '增值税普通发票';
              default:
                return o;
            }
          }
          return '--';
        },
      }, {
        title: this.msg('settle'),
        dataIndex: 'need_settle',
        width: 100,
        render: (o, record) => {
          if (editItem.id === record.id) {
            return (<Switch
              size="small"
              checked={!!editItem.need_settle}
              onChange={checked =>
              this.handleEditChange('need_settle', checked)}
            />);
          }
          return <Switch size="small" checked={!!o} disabled />;
        },
      }, {
        title: this.msg('splitBillingAllowed'),
        dataIndex: 'split_allowed',
        width: 100,
        align: 'center',
        render: (o, record) => {
          if (editItem.id === record.id) {
            return <Switch size="small" checked={!!editItem.split_allowed} onChange={checked => this.handleEditChange('split_allowed', checked)} />;
          }
          return <Switch size="small" checked={!!o} disabled />;
        },
      }, {
        dataIndex: 'SPACER_COL',
      },
    ];
    if (!readOnly) {
      columns.push({
        title: this.msg('operation'),
        dataIndex: 'OPS_COL',
        className: 'table-col-ops',
        fixed: 'right',
        width: 90,
        render: (o, record) => {
          if (editItem.id === record.id) {
            return (<span>
              <RowAction onClick={this.handleFeeSave} icon="save" row={record} />
              <RowAction onClick={this.handleFeeEditCancel} icon="close" tooltip={this.msg('cancel')} />
            </span>
            );
          }
          return (<RowAction onClick={this.handleFeeEdit} icon="edit" row={record} />);
        },
      });
    }
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    return (
      <DataPane
        columns={columns}
        rowSelection={rowSelection}
        dataSource={fees}
        rowKey="fee_code"
        loading={quoteFeesLoading}
      >
        <DataPane.Toolbar>
          {!readOnly && <Button type="primary" icon="plus-circle-o" onClick={this.toggleAddFeeModal}>{this.msg('add')}</Button>}
          <DataPane.BulkActions
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
          >
            {!readOnly &&
              <ToolbarAction danger icon="delete" label={this.msg('delete')} confirm={this.msg('deleteConfirm')} onConfirm={this.handleFeesBatchDelete} />
            }
          </DataPane.BulkActions>
        </DataPane.Toolbar>
        <Modal
          title="选择费用元素"
          width={695}
          visible={visible}
          onCancel={this.handleTransferCancel}
          onOk={this.handleTransferOk}
        >
          <Transfer
            dataSource={transferData}
            showSearch
            titles={['可选', '已选']}
            targetKeys={targetKeys}
            selectedKeys={selectedKeys}
            onChange={this.handleTransferChange}
            onSelectChange={this.handleTransferSelectChange}
            render={item => `${item.fee_code}-${item.fee_name}`}
            rowKey={item => item.fee_code}
            listStyle={{
              width: 300,
              height: 400,
            }}
          />
        </Modal>
      </DataPane>
    );
  }
}

