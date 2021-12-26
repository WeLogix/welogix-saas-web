import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Button, Layout, Select, Icon, Tooltip } from 'antd';
import { CWM_MOVEMENT_TYPE } from 'common/constants';
import DataTable from 'client/components/DataTable';
import PageHeader from 'client/components/PageHeader';
import SearchBox from 'client/components/SearchBox';
import RowAction from 'client/components/RowAction';
import connectNav from 'client/common/decorators/connect-nav';
import { LogixIcon } from 'client/components/FontIcon';
import { openMovementModal, loadMovements, cancelMovement } from 'common/reducers/cwmMovement';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import WhseSelect from '../../common/whseSelect';
import MovementModal from './modal/movementModal';
import { formatMsg } from '../message.i18n';

const { Content } = Layout;
const { Option } = Select;

@injectIntl
@connect(
  state => ({
    whses: state.cwmContext.whses,
    defaultWhse: state.cwmContext.defaultWhse,
    owners: state.cwmContext.whseAttrs.owners,
    loginId: state.account.loginId,
    loginName: state.account.username,
    movements: state.cwmMovement.movements,
    loading: state.cwmMovement.movements.loading,
    filter: state.cwmMovement.movementFilter,
  }),
  {
    openMovementModal, loadMovements, cancelMovement,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'cwm',
  title: 'featCwmStockMovement',
})
export default class MovementList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    selectedRowKeys: [],
  }
  componentDidMount() {
    this.handleListLoad();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultWhse.code !== this.props.defaultWhse.code) {
      const whseCode = nextProps.defaultWhse.code;
      this.handleListLoad(whseCode);
    }
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('movementNo'),
    dataIndex: 'movement_no',
    width: 180,
  }, {
    title: this.msg('transactionNo'),
    dataIndex: 'transaction_no',
    width: 180,
  }, {
    title: this.msg('reason'),
    dataIndex: 'reason',
    width: 180,
  }, {
    title: this.msg('ownerName'),
    width: 300,
    dataIndex: 'owner_name',
  }, {
    title: this.msg('moveType'),
    dataIndex: 'move_type',
    width: 100,
    render: o => o && CWM_MOVEMENT_TYPE[o - 1].text,
  }, {
    title: this.msg('status'),
    align: 'center',
    width: 200,
    render: (o, record) => {
      if (record.isdone === 1) {
        return <LogixIcon type="icon-circle" style={{ color: 'green' }} />;
      }
      return <LogixIcon type="icon-circle" style={{ color: 'gray' }} />;
    },
  }, {
    title: this.msg('movingMode'),
    dataIndex: 'moving_mode',
    width: 80,
    align: 'center',
    render: (o) => {
      if (o === 'scan') {
        return (<Tooltip title={this.msg('scan')}><Icon type="scan" /></Tooltip>);
      } else if (o === 'manual') {
        return (<Tooltip title={this.msg('manual')}><Icon type="solution" /></Tooltip>);
      }
      return <span />;
    },
  }, {
    title: this.msg('createdDate'),
    dataIndex: 'created_date',
    width: 120,
    render: createdate => createdate && moment(createdate).format('MM.DD HH:mm'),
  }, {
    title: this.msg('completedDate'),
    dataIndex: 'completed_date',
    width: 120,
    render: completeddate => completeddate && moment(completeddate).format('MM.DD HH:mm'),
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    width: 150,
    fixed: 'right',
    render: (o, record) => {
      if (record.isdone) {
        return (<RowAction icon="eye-o" onClick={this.handleMovementDetail} label={this.msg('movementDetails')} row={record} />);
      }
      return [
        <RowAction icon="form" onClick={this.handleMovementDetail} label={this.msg('movementDetails')} row={record} />,
        (<PrivilegeCover module="cwm" feature="stock" action="edit">
          <RowAction icon="rollback" onClick={this.cancelMovement} tooltip={this.msg('cancelMovement')} row={record} />
        </PrivilegeCover>),
      ];
    },
  }]
  handleCreateMovement = () => {
    this.props.openMovementModal();
  }
  handleMovementDetail = (row) => {
    const link = `/cwm/stock/movement/${row.movement_no}`;
    this.context.router.push(link);
  }

  handleSearch = (value) => {
    const filter = { ...this.props.filter, search: value };
    this.handleListLoad(null, null, 1, filter);
  }
  handleOwnerChange = (value) => {
    const filter = { ...this.props.filter, owner: value };
    this.handleListLoad(null, null, 1, filter);
  }
  handleListLoad = (whseCode, pageSize, current, filter) => {
    this.props.loadMovements({
      whseCode: whseCode || this.props.defaultWhse.code,
      pageSize: pageSize || this.props.movements.pageSize,
      current: current || this.props.movements.current,
      filter: filter || this.props.filter,
    });
  }
  cancelMovement = (row) => {
    const { loginName } = this.props;
    this.props.cancelMovement(row.movement_no, loginName).then((result) => {
      if (!result.err) {
        this.handleListLoad();
      }
    });
  }
  render() {
    const {
      owners, loading,
    } = this.props;
    const dataSource = new DataTable.DataSource({
      fetcher: params => this.handleListLoad(null, params.pageSize, params.current),
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
          pageSize: pagination.pageSize,
          current: pagination.current,
        };
        return params;
      },
      remotes: this.props.movements,
    });
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    const toolbarActions = (<span>
      <SearchBox value={this.props.filter.search} placeholder={this.msg('moveSearchPlaceholder')} onSearch={this.handleSearch} />
      <Select
        showSearch
        optionFilterProp="children"
        onChange={this.handleOwnerChange}
        defaultValue="all"
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: 360 }}
      >
        <Option value="all" key="all">全部货主</Option>
        {
            owners.map(owner => (<Option value={owner.id} key={owner.name}>{owner.name}</Option>))
          }
      </Select>
    </span>);
    const bulkActions = (<PrivilegeCover module="cwm" feature="stock" action="edit">
      <Button>批量移库</Button>
    </PrivilegeCover>);

    return (
      <Layout id="page-layout">
        <PageHeader
          breadcrumb={[
            <WhseSelect onChange={this.handleWhseChange} />,
          ]}
        >
          <PageHeader.Actions>
            <PrivilegeCover module="cwm" feature="stock" action="create">
              <Button type="primary" icon="plus" onClick={this.handleCreateMovement}>
                {this.msg('createMovement')}
              </Button>
            </PrivilegeCover>
          </PageHeader.Actions>
        </PageHeader>
        <Content className="page-content" key="main">
          <DataTable
            toolbarActions={toolbarActions}
            bulkActions={bulkActions}
            selectedRowKeys={this.state.selectedRowKeys}
            columns={this.columns}
            dataSource={dataSource}
            rowSelection={rowSelection}
            rowKey="id"
            loading={loading}
          />
        </Content>
        <MovementModal reload={this.handleListLoad} />
      </Layout>
    );
  }
}
