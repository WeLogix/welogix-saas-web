import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, message, Layout } from 'antd';
import DataTable from 'client/components/DataTable';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import connectFetch from 'client/common/decorators/connect-fetch';
import connectNav from 'client/common/decorators/connect-nav';
import withPrivilege, { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import {
  loadTable, delTariffById, updateTariffValid, loadFormParams,
  showCreateTariffModal, delTariffByQuoteNo,
} from 'common/reducers/transportTariff';
import { TARIFF_KINDS, TARIFF_METER_METHODS, GOODS_TYPES, TARIFF_PARTNER_PERMISSION } from 'common/constants';
import SearchBox from 'client/components/SearchBox';
import PageHeader from 'client/components/PageHeader';
import UserAvatar from 'client/components/UserAvatar';
import { format } from 'client/common/i18n/helpers';
import RowAction from 'client/components/RowAction';
import CreateTariffModal from './modals/createTariffModal';
import messages from './message.i18n';


const formatMsg = format(messages);
const { Content } = Layout;

function fetchData({ state, dispatch, location }) {
  const { kind, status } = location.query;
  let { filters } = state.transportTariff;
  if (kind || status) {
    filters = { ...state.transportTariff.filters, kind: [kind], status: [status] };
  } else {
    filters = { ...state.transportTariff.filters, kind: ['all'], status: ['current'] };
  }
  dispatch(loadFormParams(state.account.tenantId));
  return dispatch(loadTable({
    tenantId: state.account.tenantId,
    filters: JSON.stringify(filters),
    pageSize: state.transportTariff.tarifflist.pageSize,
    currentPage: state.transportTariff.tarifflist.current,
    sortField: state.transportTariff.sortField,
    sortOrder: state.transportTariff.sortOrder,
  }));
}

@connectFetch()(fetchData)
@injectIntl
@connect(
  state => ({
    tenantId: state.account.tenantId,
    tarifflist: state.transportTariff.tarifflist,
    filters: state.transportTariff.filters,
    loading: state.transportTariff.loading,
    formParams: state.transportTariff.formParams,
  }),
  {
    loadTable, delTariffById, updateTariffValid, showCreateTariffModal, delTariffByQuoteNo,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'transport',
  title: 'featTmsTariff',
})
@withPrivilege({ module: 'transport', feature: 'tariff' })
export default class TariffList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    tenantId: PropTypes.number.isRequired,
    // filters: PropTypes.object.isRequired,
    filters: PropTypes.shape(
      { name: PropTypes.arrayOf(PropTypes.string.isRequired) },
      { kind: PropTypes.arrayOf(PropTypes.string.isRequired) },
      { status: PropTypes.arrayOf(PropTypes.string.isRequired) },
    ),
    loading: PropTypes.bool.isRequired,
    // tarifflist: PropTypes.object.isRequired,
    tarifflist: PropTypes.shape({
      current: PropTypes.number.isRequired,
      pageSize: PropTypes.number.isRequired,
    }),
    loadTable: PropTypes.func.isRequired,
    // delTariffById: PropTypes.func.isRequired,
    updateTariffValid: PropTypes.func.isRequired,
    showCreateTariffModal: PropTypes.func.isRequired,
    delTariffByQuoteNo: PropTypes.func.isRequired,
    // formParams: PropTypes.object.isRequired,
    formParams: PropTypes.shape(
      { transModes: PropTypes.arrayOf(PropTypes.object.isRequired) },
      { vehicleLengthParams: PropTypes.arrayOf(PropTypes.string.isRequired) },
      { vehicleTypeParams: PropTypes.arrayOf(PropTypes.string.isRequired) },
    ),
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    selectedRowKeys: [],
    kind: 'all',
  }
  componentWillMount() {
    this.loadTableByQuery(this.props);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.location.query !== nextProps.location.query) {
      this.loadTableByQuery(nextProps);
    }
  }
  loadTableByQuery = (props) => {
    const { kind } = props.location.query;
    if (kind) {
      this.setState({ kind });
      const filters = { ...this.props.filters, kind: [kind] };
      this.handleTableLoad(filters, 1);
    }
  }
  dataSource = new DataTable.DataSource({
    fetcher: params => this.props.loadTable(params),
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
        tenantId: this.props.tenantId,
        pageSize: pagination.pageSize,
        currentPage: pagination.current,
        filters: this.props.filters,
      };
      params.filters = JSON.stringify(params.filters);
      return params;
    },
    remotes: this.props.tarifflist,
  })

  msg = descriptor => formatMsg(this.props.intl, descriptor)

  handleTableLoad = (filters, current, sortField, sortOrder) => {
    this.props.loadTable({
      tenantId: this.props.tenantId,
      filters: JSON.stringify(filters || this.props.filters),
      pageSize: this.props.tarifflist.pageSize,
      currentPage: current || this.props.tarifflist.current,
      sortField: sortField || this.props.sortField,
      sortOrder: sortOrder || this.props.sortOrder,
    }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      }
    });
  }
  handleShowCreateTariffModal = () => {
    this.props.showCreateTariffModal(true);
  }
  handleDelByQuoteNo = (row) => {
    const { quoteNo } = row;
    this.props.delTariffByQuoteNo(quoteNo, this.props.tenantId).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        this.handleTableLoad();
      }
    });
  }
  handleChangeValid = (tariffId, valid) => {
    this.props.updateTariffValid(tariffId, valid).then(() => {
      this.handleTableLoad();
    });
  }
  handleEdit = (row) => {
    const { quoteNo } = row;
    this.context.router.push({
      pathname: `/transport/billing/tariff/edit/${quoteNo}`,
    });
  }
  handleView = (row) => {
    const { quoteNo } = row;
    this.context.router.push({
      pathname: `/transport/billing/tariff/view/${quoteNo}`,
    });
  }
  handleSearch = (searchVal) => {
    let filters;
    if (searchVal) {
      filters = { ...this.props.filters, name: [searchVal] };
    } else {
      filters = { ...this.props.filters, name: [] };
    }
    this.handleTableLoad(filters, 1);
  }
  handleKindChange = (key) => {
    const { value } = key;
    const { location } = this.props;
    this.context.router.push({
      pathname: location.pathname,
      query: { ...location.query, status: 'current', kind: value },
    });
  }

  render() {
    const { tarifflist, loading, formParams } = this.props;
    this.dataSource.remotes = tarifflist;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    const columns = [{
      title: this.msg('quoteNo'),
      dataIndex: 'quoteNo',
      width: 150,
      render: col => <a>{col}</a>,
    }, {
      title: this.msg('partnerName'),
      width: 200,
      render: (o, record) => {
        let partnerName = '';
        if (record.sendTenantId === this.props.tenantId) {
          partnerName = record.recvName || '';
        } else if (record.recvTenantId === this.props.tenantId) {
          partnerName = record.sendName || '';
        }
        return partnerName;
      },
    }, {
      title: this.msg('tariffType'),
      width: 120,
      render: (o, record) => {
        let kindIdx = null;
        if (record.sendTenantId === this.props.tenantId) {
          if (record.recvName) {
            kindIdx = 1;
          } else {
            kindIdx = 3;
          }
        } else if (record.recvTenantId === this.props.tenantId) {
          if (record.sendName) {
            kindIdx = 0;
          } else {
            kindIdx = 2;
          }
        }
        if (kindIdx !== null) {
          return TARIFF_KINDS[kindIdx].text;
        }
        return '';
      },
    }, {
      title: this.msg('transModeMeterGoodsType'),
      dataIndex: 'transModeCode',
      width: 200,
      render: (col, row) => {
        let text = '';
        const tms = formParams.transModes.find(tm => tm.mode_code === row.transModeCode);
        const meter = TARIFF_METER_METHODS.find(m => m.value === row.meter);
        const goodType = GOODS_TYPES.find(m => m.value === row.goodsType);
        if (tms) text = tms.mode_name;
        if (meter) text = `${text}/${meter.text}`;
        if (goodType) text = `${text}/${goodType.text}`;
        return text;
      },
    }, {
      title: this.msg('tariffStatus'),
      dataIndex: 'valid',
      width: 120,
      render: (col) => {
        if (col) {
          return (
            <span className="mdc-text-green">有效</span>
          );
        }
        return (
          <span className="mdc-text-red">无效</span>
        );
      },
    }, {
      title: this.msg('lastUpdatedBy'),
      dataIndex: 'last_updated_by',
      key: 'last_updated_by',
      width: 120,
      render: lid => lid && <UserAvatar size="small" loginId={lid} showName />,
    }, {
      title: this.msg('lastUpdatedDate'),
      dataIndex: 'last_updated_date',
      key: 'last_updated_date',
      width: 140,
      render: o => o && moment(o).format('YYYY.MM.DD HH:mm'),
    }, {
      title: this.msg('createdBy'),
      dataIndex: 'createdLoginId',
      width: 120,
      render: lid => lid && <UserAvatar size="small" loginId={lid} showName />,
    }, {
      title: this.msg('createdDate'),
      dataIndex: 'createdDate',
      width: 120,
      render: o => (o ? moment(o).format('YYYY.MM.DD HH:mm') : ''),
    }, {
      dataIndex: 'SPACER_COL',
    }, {
      title: this.msg('operation'),
      width: 90,
      fixed: 'right',
      dataIndex: 'OPS_COL',
      render: (o, record) => {
        if (record.createdTenantId === this.props.tenantId ||
          (record.createdTenantId !== this.props.tenantId &&
            record.partnerPermission === TARIFF_PARTNER_PERMISSION.editable
          )) {
          if (record.valid) {
            return (
              <span>
                <RowAction onClick={this.handleEdit} row={record} icon="edit" tooltip={this.msg('edit')} />
                <RowAction onClick={() => this.handleChangeValid(record._id, false)} icon="pause-circle-o" tooltip={this.msg('disable')} />
              </span>
            );
          }
          return (
            <span>
              <RowAction onClick={() => this.handleChangeValid(record._id, true)} icon="play-circle" tooltip={this.msg('enable')} />
              <RowAction confirm={this.msg('确认删除？')} onConfirm={this.handleDelByQuoteNo} row={record} icon="delete" tooltip={this.msg('delete')} />
            </span>
          );
        }
        return (
          <RowAction onClick={this.handleView} row={record} icon="eye" tooltip={this.msg('view')} />
        );
      },
    }];
    const toolbarActions = (<span>
      <SearchBox placeholder={this.msg('searchPlaceholder')} onSearch={this.handleSearch} />
    </span>);
    const dropdownMenuItems = [
      { elementKey: 'all', name: this.msg('全部') },
      { elementKey: 'sale', name: this.msg('客户报价') },
      { elementKey: 'cost', name: this.msg('承运商报价') },
    ];
    const dropdownMenu = {
      selectedMenuKey: this.state.kind,
      onMenuClick: this.handleKindChange,
      dropdownMenuItems,
    };
    return (
      <Layout id="page-layout">
        <PageHeader dropdownMenu={dropdownMenu}>
          <PageHeader.Actions>
            <PrivilegeCover module="transport" feature="tariff" action="create">
              <Button type="primary" icon="plus" onClick={this.handleShowCreateTariffModal}>
                {this.msg('tariffCreate')}
              </Button>
            </PrivilegeCover>
          </PageHeader.Actions>
        </PageHeader>
        <Content className="page-content" key="main">
          <DataTable
            toolbarActions={toolbarActions}
            rowSelection={rowSelection}
            columns={columns}
            loading={loading}
            dataSource={this.dataSource}
          />
          <CreateTariffModal />
        </Content>
      </Layout>
    );
  }
}
