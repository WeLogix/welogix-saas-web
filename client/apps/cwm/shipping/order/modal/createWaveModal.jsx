import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Modal, Form, Input, Select, message } from 'antd';
import { hideCreateWave, createWave, loadPreallocCompleteSos } from 'common/reducers/cwmShippingOrder';
import DataTable from 'client/components/DataTable';
import SearchBox from 'client/components/SearchBox';

const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

@injectIntl
@connect(
  state => ({
    defaultWhse: state.cwmContext.defaultWhse,
    loginId: state.account.loginId,
    tenantName: state.account.tenantName,
    visible: state.cwmShippingOrder.createMaveModal.visible,
    ids: state.cwmShippingOrder.createMaveModal.ids,
    filters: state.cwmShippingOrder.createMaveModal.filters,
    soList: state.cwmShippingOrder.preallocSoList,
    owners: state.cwmContext.whseAttrs.owners,
  }),
  { hideCreateWave, createWave, loadPreallocCompleteSos }
)
@Form.create()
export default class CreateWaveModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    reload: PropTypes.func.isRequired,
  }
  state = {
    selectedRowKeys: [],
    confirmLoading: false,
  }
  componentWillReceiveProps(nextProps) {
    const { filters } = nextProps;
    if (nextProps.visible && nextProps.visible !== this.props.visible && !nextProps.ids) {
      const { defaultWhse, soList } = nextProps;
      this.props.loadPreallocCompleteSos({
        whseCode: defaultWhse.code,
        pageSize: soList.pageSize,
        current: soList.current,
        filters,
      });
    }
  }
  columns = [{
    title: 'SO编号',
    dataIndex: 'so_no',
  }, {
    title: '出库订单追踪号',
    dataIndex: 'cust_order_no',
  }]
  handleSubmit = () => {
    const {
      tenantName, defaultWhse, loginId, ids,
    } = this.props;
    if (!ids && this.state.selectedRowKeys.length === 0) {
      message.warning('出库单未选择');
    } else {
      const custOrderNo = this.props.form.getFieldValue('cust_order_no');
      this.setState({ confirmLoading: true });
      this.props.createWave(
        ids || this.state.selectedRowKeys, custOrderNo,
        tenantName, defaultWhse.code, loginId
      ).then((result) => {
        this.setState({ confirmLoading: false });
        if (!result.error) {
          this.props.hideCreateWave();
          this.props.reload();
        }
      });
    }
  }
  handleOwnerChange = (value) => {
    const { defaultWhse, soList } = this.props;
    const filters = { ...this.props.filters, ownerCode: value };
    this.props.loadPreallocCompleteSos({
      whseCode: defaultWhse.code,
      pageSize: soList.pageSize,
      current: soList.current,
      filters,
    });
  }
  handleSearch = (value) => {
    const filters = { ...this.props.filters, searchValue: value };
    const { defaultWhse, soList } = this.props;
    this.props.loadPreallocCompleteSos({
      whseCode: defaultWhse.code,
      pageSize: soList.pageSize,
      current: soList.current,
      filters,
    });
  }
  handleCancel = () => {
    this.props.hideCreateWave();
  }
  render() {
    const {
      form: { getFieldDecorator },
      soList,
      filters,
      owners,
      ids,
    } = this.props;
    const dataSource = new DataTable.DataSource({
      fetcher: params => this.props.loadPreallocCompleteSos(params),
      resolve: result => result.data,
      getPagination: (result, resolve) => ({
        total: result.totalCount,
        current: resolve(result.totalCount, result.current, result.pageSize),
        showSizeChanger: true,
        showQuickJumper: false,
        pageSize: result.pageSize,
        showTotal: total => `共 ${total} 条`,
      }),
      getParams: (pagination) => {
        const params = {
          whseCode: this.props.defaultWhse.code,
          pageSize: pagination.pageSize,
          current: pagination.current,
          filters,
        };
        return params;
      },
      remotes: soList,
    });
    dataSource.remotes = soList;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    const toolbarActions = (<span>
      <SearchBox value={filters.searchValue} placeholder="SO编号/出库订单追踪号" onSearch={this.handleSearch} />
      <Select
        showSearch
        optionFilterProp="children"
        value={filters.ownerCode}
        onChange={this.handleOwnerChange}
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: 360 }}
      >
        {owners.map(owner => (<Option key={owner.id} value={owner.id}>{owner.name}</Option>))}
      </Select>
    </span>);
    return (
      <Modal
        title="创建波次"
        visible={this.props.visible}
        onOk={this.handleSubmit}
        onCancel={this.handleCancel}
        width={600}
        confirmLoading={this.state.confirmLoading}
      >
        <Form>
          <FormItem label="波次描述" {...formItemLayout}>
            {getFieldDecorator('cust_order_no', {
            })(<Input placeholder="非必填" />)}
          </FormItem>
        </Form>
        {!ids && <DataTable
          size="middle"
          columns={this.columns}
          dataSource={dataSource}
          rowSelection={rowSelection}
          toolbarActions={toolbarActions}
          loading={soList.loading}
          rowKey="id"
          scrollOffset={600}
          noSetting
        />}
      </Modal>
    );
  }
}
