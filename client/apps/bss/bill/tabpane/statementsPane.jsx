import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Input } from 'antd';
import RowAction from 'client/components/RowAction';
import DataPane from 'client/components/DataPane';
import SearchBox from 'client/components/SearchBox';
import { intlShape, injectIntl } from 'react-intl';
import { adjustBillStatement, getBillFeesAndTemplate } from 'common/reducers/bssBill';
import { formatMsg } from '../message.i18n';

@injectIntl
@connect(
  state => ({
    userMembers: state.account.userMembers,
    tenantId: state.account.tenantId,
    billHead: state.bssBill.billHead,
    billTemplateFees: state.bssBill.billTemplateFees,
    billTemplateProps: state.bssBill.billTemplateProps,
    statementFees: state.bssBill.statementFees,
  }),
  { adjustBillStatement, getBillFeesAndTemplate }
)
export default class StatementsPane extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    billNo: PropTypes.string.isRequired,
    billTemplateFees: PropTypes.arrayOf(PropTypes.shape({ uid: PropTypes.string })),
  }
  state = {
    selectedRowKeys: [],
    editItem: {},
    searchValue: '',
    currentPage: 1,
  };
  componentDidMount() {
    this.props.getBillFeesAndTemplate(this.props.billNo);
  }
  msg = formatMsg(this.props.intl)
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  }
  handleEdit = (row) => {
    this.setState({
      editItem: row,
    });
  }
  handleColumnChange = (field, value) => {
    const editItem = { ...this.state.editItem };
    const amount = parseInt(value, 10);
    if (!Number.isNaN(amount)) {
      editItem[field] = amount;
    } else {
      editItem[field] = null;
    }
    this.setState({
      editItem,
    });
  }
  handleOk = () => {
    const item = { ...this.state.editItem };
    const statementFees = [...this.props.statementFees];
    const index = statementFees.findIndex(data => data.id === item.id);
    let delta;
    if (item.settle_type === 1) {
      delta = item.seller_settled_amount - statementFees[index].seller_settled_amount;
    } else {
      delta = item.buyer_settled_amount - statementFees[index].buyer_settled_amount;
    }
    statementFees[index] = item;
    item.delta = delta;
    this.props.adjustBillStatement(item, this.props.billNo)
      .then((result) => {
        if (!result.error) { this.setState({ editItem: {} }); }
      });
  }
  handleSearch = (value) => {
    this.setState({ currentPage: 1, searchValue: value });
  }
  handleCancel = () => {
    this.setState({
      editItem: {},
    });
  }
  render() {
    const { billTemplateFees, billTemplateProps, statementFees } = this.props;
    const { searchValue } = this.state;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    let columns = [{
      title: '货运编号',
      dataIndex: 'sof_order_no',
      width: 180,
    }, {
      title: '订单追踪号',
      dataIndex: 'cust_order_no',
      width: 150,
    }];
    if (billTemplateProps.length > 0) {
      const propsColumns = billTemplateProps.map(data => ({
        title: data.label,
        dataIndex: data.key,
        width: 180,
      }));
      columns = columns.concat(propsColumns);
    }
    if (billTemplateFees.length > 0) {
      const billColumns = billTemplateFees.map(data => ({
        title: data.name,
        dataIndex: data.uid,
        align: 'right',
        width: 150,
      }));
      columns = columns.concat(billColumns);
    }
    columns.push({
      title: this.props.tenantId === this.props.billHead.seller_tenant_id ? '应收账款' : '应付账款 ',
      dataIndex: 'amount',
      width: 150,
      align: 'right',
      render: (o, record) => {
        if (this.state.editItem.id === record.id) {
          if (this.state.editItem.settle_type === 1) {
            return (<Input
              value={this.state.editItem.seller_settled_amount}
              onChange={e => this.handleColumnChange('seller_settled_amount', e.target.value)}
            />);
          }
          return (<Input
            value={this.state.editItem.buyer_settled_amount}
            onChange={e => this.handleColumnChange('buyer_settled_amount', e.target.value)}
          />);
        }
        return record.settle_type === 1 ?
          record.seller_settled_amount : record.buyer_settled_amount;
      },
    }, {
      title: this.props.tenantId === this.props.billHead.seller_tenant_id ? '其他应收款' : '其他应付款 ',
      dataIndex: 'other_amount',
      width: 150,
      align: 'right',
    }, {
      title: '备注',
      dataIndex: 'remark',
      width: 150,
    }, {
      title: '订单日期',
      width: 150,
      dataIndex: 'order_date',
      render: o => o && moment(o).format('YYYY/MM/DD'),
    }, {
      title: '审批时间',
      dataIndex: 'confirmed_date',
      width: 150,
      render: o => o && moment(o).format('YYYY/MM/DD'),
    }, {
      title: '审批人员',
      dataIndex: 'confirmed_by',
      width: 150,
      render: o => this.props.userMembers.find(user => user.login_id === o) &&
      this.props.userMembers.find(user => user.login_id === o).name,
    }, {
      title: '操作',
      width: 90,
      fixed: 'right',
      render: (o, record) => {
        if (this.props.billHead.bill_status === 1) {
          if (this.state.editItem.id === record.id) {
            return (<span>
              <RowAction icon="save" onClick={this.handleOk} tooltip={this.msg('confirm')} row={record} />
              <RowAction icon="close" onClick={this.handleCancel} tooltip={this.msg('cancel')} row={record} />
            </span>);
          }
          return (<span>
            <RowAction icon="edit" onClick={this.handleEdit} tooltip={this.msg('edit')} row={record} />
          </span>);
        }
        return null;
      },
    });
    let dataSource = statementFees;
    if (searchValue) {
      const reg = new RegExp(searchValue);
      dataSource = dataSource
        .filter(fee => reg.test(fee.cust_order_no) || reg.test(fee.sof_order_no));
    }

    return (
      <DataPane
        columns={columns}
        rowSelection={rowSelection}
        indentSize={0}
        dataSource={dataSource}
        rowKey="sof_order_no"
        loading={this.state.loading}
        pagination={{
          current: this.state.currentPage,
          defaultPageSize: 10,
          onChange: this.handlePageChange,
        }}
      >
        <DataPane.Toolbar>
          <SearchBox value={this.state.searchValue} placeholder={this.msg('searchPlaceholder')} onSearch={this.handleSearch} />
          <DataPane.BulkActions
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
          >
            <Button onClick={this.handleBatchDelete} icon="delete" />
          </DataPane.BulkActions>
        </DataPane.Toolbar>
      </DataPane>
    );
  }
}
