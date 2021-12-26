import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Switch, message } from 'antd';
import EditableCell from 'client/components/EditableCell';
import DataTable from 'client/components/DataTable';
import { loadObjectFields, updateOrCreateObjectFields } from 'common/reducers/paasBizModelMeta';
import { formatMsg } from './message.i18n';

@injectIntl
@connect(
  state => ({
    loading: state.paasBizModelMeta.fieldsLoading,
  }),
  { updateOrCreateObjectFields, loadObjectFields }
)
export default class FieldsTable extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    selectedRowKeys: [],
    editItem: {},
    searchText: '',
    dataSource: [],
    sortedInfo: {},
  }
  componentDidMount() {
    this.handleReload();
  }
  msg = formatMsg(this.props.intl)
  handleLabelNameChange = (e) => {
    this.setState({ editItem: { ...this.state.editItem, bmf_label_name: e.target.value } });
  }
  handleReload = () => {
    this.props.loadObjectFields(this.props.objName)
      .then((result) => {
        if (!result.error) {
          const dataSource = result.data.sort((mfa, mfb) => {
            if (mfa.tenant_id && !mfb.tenant_id) {
              return -1;
            } else if (!mfa.tenant_id && mfb.tenant_id) {
              return 1;
            }
            if (mfa.last_updated_date && mfb.last_updated_date) {
              return new Date(mfb.last_updated_date).getTime()
                - new Date(mfa.last_updated_date).getTime();
            } else if (mfa.last_updated_date && !mfb.last_updated_date) {
              return -1;
            } else if (!mfa.last_updated_date && mfb.last_updated_date) {
              return 1;
            }
            return 0;
          });
          this.setState({ dataSource });
        }
      });
  }
  tenantSorter = (atenantid, btenantid) => (
    this.state.sortedInfo.order === 'descend' ?
      atenantid - btenantid : btenantid - atenantid
  )
  charSorter = field => (a, b) => {
    if (a.tenant_id !== b.tenant_id) {
      return this.tenantSorter(a.tenant_id || 0, b.tenant_id || 0);
    }
    if (a[field] === null || a[field] === '') {
      return -1;
    } else if (b[field] === null || b[field] === '') {
      return 1;
    }
    return a[field].charCodeAt(0) - b[field].charCodeAt(0);
  }
  boolSorter = field => (a, b) => {
    if (a.tenant_id !== b.tenant_id) {
      return this.tenantSorter(a.tenant_id || 0, b.tenant_id || 0);
    }
    return Number(a[field] === 1) - Number(b[field] === 1);
  }
  columns = [{
    title: this.msg('字段名'),
    dataIndex: 'bmf_default_name',
    width: 200,
    sorter: this.charSorter('bmf_default_name'),
    sortOrder: false,
  }, {
    title: this.msg('API字段名'),
    dataIndex: 'bm_field',
    width: 200,
    sorter: this.charSorter('bm_field'),
    sortOrder: false,
  }, {
    title: this.msg('字段类型'),
    dataIndex: 'bmf_data_type',
    width: 200,
    sorter: this.charSorter('bmf_data_type'),
    sortOrder: false,
    render: (o, record) => {
      let options = [];
      let editable = false;
      let plainMsg = 'bmdtNumber';
      switch (o) {
        case 'DATE':
        case 'DATETIME':
          options = [
            { value: 'DATE', text: this.msg('bmdtDate') },
            { value: 'DATETIME', text: this.msg('bmdtDatetime') },
          ];
          editable = true;
          plainMsg = 'bmdtDate';
          break;
        case 'TEXT':
        case 'HYPERLINK':
          options = [
            { value: 'TEXT', text: this.msg('bmdtText') },
            { value: 'HYPERLINK', text: this.msg('bmdtHyperlink') },
          ];
          editable = true;
          plainMsg = 'bmdtText';
          break;
        default:
          break;
      }
      const chosenValue = record.bmf_data_hypotype ? record.bmf_data_hypotype : o;
      return editable ? (<EditableCell
        type="select"
        options={options}
        style={{ width: '100%' }}
        editable
        btnPosition="right"
        value={chosenValue}
        onSave={(value) => {
          if (value === record.bmf_data_type) {
          this.handleMetaSave({ bmf_data_hypotype: '' }, record);
          } else {
          this.handleMetaSave({ bmf_data_hypotype: value }, record);
          }
        }}
      />) : <span style={{ paddingLeft: 10 }}>{this.msg(plainMsg)}</span>;
    },
  }, {
    title: this.msg('显示名称'),
    dataIndex: 'bmf_label_name',
    width: 250,
    sorter: this.charSorter('bmf_label_name'),
    sortOrder: false,
    render: (o, record) =>
      (<EditableCell
        style={{ width: '100%' }}
        editable
        btnPosition="right"
        value={o}
        onSave={value => this.handleMetaSave({ bmf_label_name: value }, record)}
      />)
    ,
  }, {
    title: this.msg('是否必填'),
    dataIndex: 'bmf_required',
    width: 150,
    sorter: this.boolSorter('bmf_required'),
    sortOrder: false,
    align: 'center',
    render: (o, record) => (<Switch
      size="small"
      checked={!!o}
      onChange={checked => this.handleMetaSave({ bmf_required: checked ? 1 : 0 }, record)}
    />),
  }, {
    title: this.msg('是否可分组'),
    dataIndex: 'bmf_groupable',
    width: 150,
    sorter: this.boolSorter('bmf_groupable'),
    sortOrder: false,
    align: 'center',
    render: (o, record) => (<Switch
      size="small"
      checked={!!o}
      onChange={checked => this.handleMetaSave({ bmf_groupable: checked ? 1 : 0 }, record)}
    />),
  }, {
    title: this.msg('是否禁用'),
    dataIndex: 'bmf_disabled',
    width: 150,
    sorter: this.boolSorter('bmf_disabled'),
    sortOrder: false,
    align: 'center',
    render: (o, record) => (<Switch
      size="small"
      checked={!!o}
      onChange={checked => this.handleMetaSave({ bmf_disabled: checked ? 1 : 0 }, record)}
    />),
  }, {
    title: this.msg('更新时间'),
    dataIndex: 'last_updated_date',
    width: 150,
    render: o => o && moment(o).format('YYYY.MM.DD HH:mm'),
  }, /* {
    title: this.msg('API查询条件'),
    dataIndex: 'bmf_query',
    width: 150,
    render: (o, record) => {
      if (this.state.editItem.id === record.id) {
        return (<Checkbox
          size="small"
          checked={!!this.state.editItem.bmf_query}
          onChange={checked => this.handleMetaSave('bmf_query', checked)}
        />);
      }
      return <Switch size="small" checked={!!o} disabled />;
    },
  }, {
    title: this.msg('API返回结果'),
    dataIndex: 'bmf_result',
    width: 150,
    render: (o, record) => {
      if (this.state.editItem.id === record.id) {
        return (<Checkbox
          size="small"
          checked={!!this.state.editItem.bmf_result}
          onChange={checked => this.handleMetaSave('bmf_result', checked)}
        />);
      }
      return <Switch size="small" checked={!!o} disabled />;
    },
  }, */{
    dataIndex: 'SPACER_COL',
  }];
  handleRowDeselect = () => {
    this.setState({ selectedRowKeys: [] });
  }
  handleSearch = (searchText) => {
    this.setState({ searchText });
  }
  handleMetaSave = (changedInfo, row) => {
    const param = changedInfo;
    if (row.meta_id) {
      param.meta_id = row.meta_id;
    }
    this.props.updateOrCreateObjectFields(param, row.id)
      .then((result) => {
        if (!result.error) {
          this.handleReload();
          message.info('操作成功');
        } else {
          message.info('操作失败');
        }
      });
  }
  handleMetaEdit = (row) => {
    const editItem = { ...row };
    this.setState({ editItem });
  }
  handleMetaEditCancel = () => {
    this.setState({ editItem: {} });
  }
  handleTableChange = (pagination, filters, sorter) => {
    this.setState({ sortedInfo: sorter });
  }
  render() {
    const {
      selectedRowKeys, searchText, dataSource, sortedInfo,
    } = this.state;
    const { loading } = this.props;
    let { columns } = this;
    if (sortedInfo.columnKey) {
      columns = [...this.columns];
      const sortedColIndex = columns.findIndex(col => col.dataIndex === sortedInfo.columnKey);
      columns[sortedColIndex] = { ...this.columns[sortedColIndex], sortOrder: sortedInfo.order };
    }
    let filterDataSource = dataSource;
    if (searchText) {
      filterDataSource = dataSource.filter((item) => {
        const reg = new RegExp(searchText);
        return reg.test(item.bm_field)
          || reg.test(item.bmf_default_name) || reg.test(item.bmf_label_name);
      });
    }

    return (
      <DataTable
        selectedRowKeys={selectedRowKeys}
        onDeselectRows={this.handleRowDeselect}
        loading={loading}
        columns={columns}
        dataSource={filterDataSource}
        pagination={{
          defaultPageSize: 50,
          pageSizeOptions: ['10', '20', '30', '40', '50', '100'],
          showSizeChanger: true,
          showTotal: total => `共 ${total} 条`,
        }}
        rowKey="id"
        cardView={false}
        onSearch={this.handleSearch}
        scrollOffset={340}
        onChange={this.handleTableChange}
      />
    );
  }
}

