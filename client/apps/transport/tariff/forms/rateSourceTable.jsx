import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Modal, Input, message } from 'antd';
import DataTable from 'client/components/DataTable';
import RegionCascader from 'client/components/RegionCascader';
import RowAction from 'client/components/RowAction';
import { submitRateSource, loadRatesSources, updateRateSource, delRateSource, loadRateEnds } from 'common/reducers/transportTariff';
import { renderRegion } from './commodity';

const FormItem = Form.Item;

@connect(
  state => ({
    tariffId: state.transportTariff.tariffId,
    rateId: state.transportTariff.rateId,
    loading: state.transportTariff.ratesSourceLoading,
    ratesSourceList: state.transportTariff.ratesSourceList,
  }),
  {
    submitRateSource,
    loadRatesSources,
    updateRateSource,
    delRateSource,
    loadRateEnds,
  }
)
@Form.create()
export default class RateSourceTable extends React.Component {
  static propTypes = {
    visibleModal: PropTypes.bool.isRequired,
    tariffId: PropTypes.string.isRequired,
    ratesSourceList: PropTypes.shape({ totalCount: PropTypes.number }).isRequired,
    loading: PropTypes.bool.isRequired,
    onChangeVisible: PropTypes.func.isRequired,
    submitRateSource: PropTypes.func.isRequired,
    loadRatesSources: PropTypes.func.isRequired,
    updateRateSource: PropTypes.func.isRequired,
    delRateSource: PropTypes.func.isRequired,
    loadRateEnds: PropTypes.func.isRequired,
    type: PropTypes.oneOf(['create', 'edit', 'view']),
    toolbarActions: PropTypes.node,
  }
  state = {
    selectedRowKeys: [],
    regionCode: null,
    rateId: null,
    modalRegion: [],
    name: '',
  }
  componentWillMount() {
    if (this.props.rateId) {
      this.setState({ selectedRowKeys: [this.props.rateId] });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.rateId !== this.props.rateId) {
      this.setState({ selectedRowKeys: [nextProps.rateId] });
    }
  }
  dataSource = new DataTable.DataSource({
    fetcher: params => this.props.loadRatesSources(params),
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
        tariffId: this.props.tariffId,
        pageSize: pagination.pageSize,
        currentPage: pagination.current,
        filters: this.props.filters,
      };
      params.filters = JSON.stringify(params.filters);
      return params;
    },
    remotes: this.props.ratesSourceList,
  })
  columns = [{
    title: '起始地',
    dataIndex: 'source',
    width: 150,
    render: (o, record) => renderRegion(record.source),
  }, {
    title: '别名',
    dataIndex: 'source.name',
    width: 100,
  }]
  loadSources = (pageSize, current) => this.props.loadRatesSources({
    tariffId: this.props.tariffId,
    pageSize,
    currentPage: current,
    filters: JSON.stringify(this.props.filters),
  })
  handleEdit = (row) => {
    const {
      code, province, city, district, street, name,
    } = row.source;
    this.setState({
      rateId: row._id,
      regionCode: code,
      modalRegion: [province, city, district, street],
      name,
    });
    this.props.onChangeVisible('source', true);
  }
  handleDel = (row) => {
    this.props.delRateSource(row._id).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        let { current } = this.props.ratesSourceList;
        if (current > 1 &&
            this.props.ratesSourceList.pageSize * (current - 1)
            === this.props.ratesSourceList.totalCount - 1) {
          current -= 1;
        }
        this.loadSources(this.props.ratesSourceList.pageSize, current);
      }
    });
  }
  handleSourceSave = () => {
    if (this.state.regionCode) {
      let prom;
      const { rateId } = this.state;
      if (rateId) {
        prom = this.props.updateRateSource(
          this.state.rateId,
          this.state.regionCode,
          this.state.modalRegion,
          this.state.name
        );
      } else {
        prom = this.props.submitRateSource(
          this.props.tariffId,
          this.state.regionCode,
          this.state.modalRegion,
          this.state.name
        );
      }
      prom.then((result) => {
        if (result.error) {
          message.error(result.error.message, 10);
        } else {
          message.success('保存成功');
          let { current } = this.props.ratesSourceList;
          if (this.props.ratesSourceList.pageSize * current
              < this.props.ratesSourceList.totalCount + 1) {
            current += 1;
          }
          this.loadSources(this.props.ratesSourceList.pageSize, current)
            .then(() => {
              this.setState({
                regionCode: null,
                modalRegion: [],
                rateId: null,
                name: '',
              });
              this.props.onChangeVisible('source', false);
            });
          if (!rateId) {
            this.props.loadRateEnds({
              rateId: result.data.id,
              pageSize: 20,
              current: 1,
            });
          }
        }
      });
    } else {
      message.error('未选择起始地址');
    }
  }
  handleCancel = () => {
    this.props.onChangeVisible('source', false);
    this.setState({
      regionCode: null,
      modalRegion: [],
      name: '',
      rateId: null,
    });
  }
  handleRegionChange = (region) => {
    const [code, province, city, district, street] = region;
    this.setState({
      regionCode: code,
      modalRegion: [province, city, district, street],
    });
  }
  handleNameChange = (e) => {
    this.setState({ name: e.target.value });
  }
  handleRowClick = (row) => {
    this.props.loadRateEnds({
      rateId: row._id,
      pageSize: 20,
      current: 1,
    }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      }
    });
  }
  render() {
    const {
      ratesSourceList, loading, visibleModal, type, toolbarActions,
    } = this.props;
    const { modalRegion, name } = this.state;
    this.dataSource.remotes = ratesSourceList;
    const rowSelection = {
      type: 'radio',
      selectedRowKeys: this.state.selectedRowKeys,
      /*
      onChange: selectedRowKeys => {
        this.setState({ selectedRowKeys });
      },
      */
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const columns = [...this.columns];
    if (type === 'create' || type === 'edit') {
      columns.push({
        title: '操作',
        width: 80,
        dataIndex: 'OPS_COL',
        fixed: 'right',
        className: 'table-col-ops',
        render: (o, record) => (
          <span>
            <RowAction onClick={this.handleEdit} icon="edit" tooltip="编辑" row={record} />
            <RowAction danger confirm="确认删除?" onConfirm={this.handleDel} icon="delete" tooltip="删除" row={record} />
          </span>
        ),
      });
    }
    return (
      <div>
        <DataTable
          toolbarActions={toolbarActions}
          rowSelection={rowSelection}
          columns={columns}
          loading={loading}
          dataSource={this.dataSource}
          rowKey="_id"
          onRow={record => ({
            onClick: () => { this.handleRowClick(record); },
          })}
          scrollOffset={374}
        />
        <Modal
          title="起始地"
          maskClosable={false}
          visible={visibleModal}
          onOk={this.handleSourceSave}
          onCancel={this.handleCancel}
          closable={false}
        >
          <Form layout="horizontal">
            <FormItem label="起始地" {...formItemLayout} required>
              <RegionCascader defaultRegion={modalRegion} onChange={this.handleRegionChange} />
            </FormItem>
            <FormItem label="起始地别名" {...formItemLayout}>
              <Input value={name} onChange={this.handleNameChange} />
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}
