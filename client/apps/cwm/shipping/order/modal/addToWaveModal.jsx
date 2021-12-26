import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Modal } from 'antd';
import DataTable from 'client/components/DataTable';
import SearchBox from 'client/components/SearchBox';
import UserAvatar from 'client/components/UserAvatar';
import { loadWaves, addToWave, hideAddToWave } from 'common/reducers/cwmShippingOrder';
import { formatMsg } from '../../message.i18n';

@injectIntl
@connect(
  state => ({
    defaultWhse: state.cwmContext.defaultWhse,
    loginId: state.account.loginId,
    filters: state.cwmShippingOrder.waveFilters,
    wave: state.cwmShippingOrder.wave,
    loading: state.cwmShippingOrder.wave.loading,
    visible: state.cwmShippingOrder.addToMoveModal.visible,
    ownerCode: state.cwmShippingOrder.addToMoveModal.ownerCode,
    ids: state.cwmShippingOrder.addToMoveModal.ids,
  }),
  { loadWaves, addToWave, hideAddToWave }
)
export default class AddToWaveModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    ids: PropTypes.arrayOf(PropTypes.number.isRequired),
    reload: PropTypes.func.isRequired,
  }
  state = {
    selectedRowKeys: [],
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && nextProps.visible !== this.props.visible) {
      const { defaultWhse, ownerCode, wave } = nextProps;
      this.props.loadWaves({
        whseCode: defaultWhse.code,
        pageSize: wave.pageSize,
        current: wave.current,
        filters: { ownerCode },
      });
    }
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: '波次号',
    dataIndex: 'wave_no',
  }, {
    title: '波次描述',
    dataIndex: 'cust_order_no',
  }, {
    title: '创建时间',
    width: 120,
    dataIndex: 'created_date',
    render: o => moment(o).format('MM.DD HH:mm'),
  }, {
    title: '创建人员',
    dataIndex: 'created_by',
    width: 120,
    render: lid => <UserAvatar size="small" loginId={lid} showName />,
  }]
  dataSource = new DataTable.DataSource({
    fetcher: params => this.props.loadWaves(params),
    resolve: result => result.data,
    getPagination: (result, resolve) => ({
      total: result.totalCount,
      current: resolve(result.totalCount, result.current, result.pageSize),
      showSizeChanger: true,
      showQuickJumper: false,
      pageSize: result.pageSize,
      showTotal: total => `共 ${total} 条`,
    }),
    getParams: (pagination, tblfilters) => {
      const newfilters = { ...this.props.filters, ...tblfilters[0] };
      const params = {
        whseCode: this.props.defaultWhse.code,
        tenantId: this.props.tenantId,
        pageSize: pagination.pageSize,
        current: pagination.current,
        filters: newfilters,
      };
      return params;
    },
    remotes: this.props.wave,
  });
  handleSubmit = () => {
    this.props.addToWave(this.props.ids, this.state.selectedRowKeys[0])
      .then((result) => {
        if (!result.error) {
          this.props.hideAddToWave();
          this.props.reload();
        }
      });
  }
  handleSearch = (value) => {
    const filters = { ...this.props.filters, searchValue: value };
    const { defaultWhse, wave } = this.props;
    this.props.loadWaves({
      whseCode: defaultWhse.code,
      pageSize: wave.pageSize,
      current: wave.current,
      filters,
    });
  }
  handleCancel = () => {
    this.props.hideAddToWave();
  }
  render() {
    const rowSelection = {
      type: 'radio',
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    const toolbarActions = (<span>
      <SearchBox value={this.props.filters.searchValue} placeholder={this.msg('波次编号/波次描述')} onSearch={this.handleSearch} />
    </span>);
    const { wave, loading } = this.props;
    this.dataSource.remotes = wave;
    return (
      <Modal width={800} maskClosable={false} title="添加到波次计划" visible={this.props.visible} onOk={this.handleSubmit} onCancel={this.handleCancel}>
        <DataTable
          size="middle"
          columns={this.columns}
          dataSource={this.dataSource}
          rowSelection={rowSelection}
          toolbarActions={toolbarActions}
          loading={loading}
          rowKey="wave_no"
          scrollOffset={500}
          noSetting
        />
      </Modal>
    );
  }
}
