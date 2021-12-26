import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import connectNav from 'client/common/decorators/connect-nav';
import { DatePicker, Menu, Form, Layout, Icon, Input, Select, Button, notification, message } from 'antd';
import EditableCell from 'client/components/EditableCell';
import DataTable from 'client/components/DataTable';
import PageHeader from 'client/components/PageHeader';
import ToolbarAction from 'client/components/ToolbarAction';
import ImportDataPanel from 'client/components/ImportDataPanel';
import UploadLogsPanel from 'client/components/UploadLogsPanel';
import { loadPartners } from 'common/reducers/partner';
import { loadTrackFollowList, updateTrackFollowDetail, resetFollowFilter } from 'common/reducers/sofGlobalTrack';
import { setUploadRecordsReload, togglePanelVisible } from 'common/reducers/uploadRecords';
import { loadTenantBMFields, toggleColumnSettingModal } from 'common/reducers/paasBizModelMeta';
import { loadModelAdaptors } from 'common/reducers/hubDataAdapter';
import { LINE_FILE_ADAPTOR_MODELS, TRANS_MODES, WRAP_TYPE } from 'common/constants';
import ModelColumnSettingModal from 'client/components/ModelColumnSettingModal';
import { hasPermission } from 'client/common/decorators/withPrivilege';
import { formatMsg } from './message.i18n';

const { Content } = Layout;
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

function momentDateArg(itemDate) {
  let momentArg = itemDate;
  if (!moment(itemDate, moment.ISO_8601).isValid()) {
    momentArg = parseFloat(itemDate);
    if (!moment(momentArg, 'x').isValid()) {
      momentArg = null;
    }
  }
  return momentArg;
}

@injectIntl
@connect(
  state => ({
    trackingList: state.sofGlobalTrack.followList,
    listFilter: state.sofGlobalTrack.followFilter,
    listSorter: state.sofGlobalTrack.followSorter,
    trackingLoading: state.sofGlobalTrack.followListLoading,
    adaptors: state.hubDataAdapter.modelAdaptors,
    bmObjs: state.paasBizModelMeta.bmObjs,
    port: state.saasParams.latest.port.map(pt => ({
      value: pt.port_code,
      text: pt.port_c_cod,
    })),
    country: state.saasParams.latest.country.map(cntry => ({
      value: cntry.cntry_co,
      text: cntry.cntry_name_cn,
    })),
    currency: state.saasParams.latest.currency.map(curr => ({
      value: curr.curr_code,
      text: curr.curr_name,
    })),
    intlTransMode: TRANS_MODES,
    trxnMode: state.saasParams.latest.trxnMode.map(tnm => ({
      value: tnm.trx_mode,
      text: tnm.trx_spec,
    })),
    wrapType: WRAP_TYPE,
    userMember: state.account.userMembers.map(um => ({
      value: String(um.login_id),
      text: um.name,
    })),
    vendor: state.partner.partners.filter(pt => pt.role === 'VEN').map(pt => ({
      value: String(pt.id),
      text: pt.name,
    })),
    customers: state.partner.partners.filter(pt => pt.role === 'CUS' || pt.role === 'OWN'),
    privileges: state.account.privileges,
  }),
  {
    loadModelAdaptors,
    loadTrackFollowList,
    resetFollowFilter,
    loadPartners,
    updateTrackFollowDetail,
    setUploadRecordsReload,
    togglePanelVisible,
    loadTenantBMFields,
    toggleColumnSettingModal,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'scof',
  title: 'featSofTracking',
})
@Form.create()
export default class TrackingImportList extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    loadTrackFollowList: PropTypes.func.isRequired,
    updateTrackFollowDetail: PropTypes.func.isRequired,
  }
  state = {
    importPanel: {
      visible: false,
    },
  }
  componentDidMount() {
    this.props.loadModelAdaptors('', [LINE_FILE_ADAPTOR_MODELS.SOF_GLOBALTRACK.key]);
    this.handleTableLoad(1);
    this.props.loadPartners({
      role: ['VEN', 'CUS'],
    });
    this.props.loadTenantBMFields('IMPORTFOLLOW');
  }
  GRANULARITY_MAP = {
    po_no: '采购订单',
    inv_no: '商业发票',
    cust_order_no: '货运订单',
    entry_id: '报关单',
  }
  msg = formatMsg(this.props.intl)
  editPermission = hasPermission(this.props.privileges, {
    module: 'scof', feature: 'tracking', action: 'edit',
  });
  handleTableLoad = (current, pageSize, filter, sorter) => {
    const { listFilter, listSorter, trackingList } = this.props;
    const newSorter = sorter || listSorter;
    this.props.loadTrackFollowList({
      pageSize: pageSize || trackingList.pageSize,
      current: current || trackingList.current,
      sorter: JSON.stringify({
        field: newSorter.field,
        order: newSorter.order,
      }),
      filter: JSON.stringify(filter || listFilter),
    });
  }
  handleSave = (row, field, value) => {
    if (row[field] === value) {
      return;
    }
    const { listFilter } = this.props;
    const idKey = { };
    idKey[listFilter.granularity] = row[listFilter.granularity];
    this.props.updateTrackFollowDetail(idKey, field, value);
  }
  makeColumns = (colItems) => {
    const bmMap = new Map();
    LINE_FILE_ADAPTOR_MODELS.SOF_GLOBALTRACK.columns.forEach((f) => {
      bmMap.set(f.field, f);
    });
    return colItems.map((item) => {
      const currBm = bmMap.get(item.bm_field);
      return {
        key: item.bm_field,
        dataIndex: item.bm_field,
        title: item.bmf_label_name || item.bmf_default_name,
        width: (currBm && currBm.width) || 200,
        // sorter: true,
        // sortOrder: this.props.listSorter.field === item.bm_field && this.props.listSorter.order,
        render: (f, row) => {
          if (currBm && currBm.editable) {
            if (item.bmf_data_type === 'DATE') {
              let dateFormat;
              if (item.bmf_data_hypotype === 'DATETIME') {
                dateFormat = 'YYYY.MM.DD HH:mm';
              }
              const momentArg = momentDateArg(f);
              return (
                <EditableCell
                  value={momentArg}
                  type="date"
                  cellTrigger
                  onSave={value => this.handleSave(row, item.bm_field, value)}
                  btnPosition="right"
                  dateFormat={dateFormat}
                  editable={this.editPermission}
                />
              );
            }
            return (
              <EditableCell
                value={f}
                cellTrigger
                onSave={value => this.handleSave(row, item.bm_field, value)}
                btnPosition="right"
                editable={this.editPermission}
              />
            );
          }
          if (item.bmf_data_type === 'DATE') {
            const momentArg = momentDateArg(f);
            if (item.bmf_data_hypotype === 'DATETIME') {
              return momentArg && moment(momentArg).format('YYYY.MM.DD HH:mm');
            }
            return momentArg && moment(momentArg).format('YYYY.MM.DD');
          } else if (item.bmf_data_type === 'TEXT' && item.bmf_data_hypotype === 'HYPERLINK') {
            return <a href={f} target="_blank" rel="noopener noreferrer">{f}</a>;
          }
          if (item.bmf_param_type && this.props[item.bmf_param_type]) {
            const filterItem = this.props[item.bmf_param_type].filter(p =>
              String(p.value) === String(f))[0];
            if (filterItem) {
              return filterItem.text;
            }
          }
          return f;
        },
      };
    });
  }
  dataSource = new DataTable.DataSource({
    fetcher: params => this.handleTableLoad(params.current, params.pageSize, null, params.sorter),
    resolve: result => result.data,
    getPagination: (result, resolve) => ({
      total: result.totalCount,
      current: resolve(result.totalCount, result.current, result.pageSize),
      showSizeChanger: true,
      showQuickJumper: false,
      pageSize: result.pageSize,
      showTotal: total => `共 ${total} 条`,
    }),
    getParams: (pagination, filters, sorter) => {
      const params = {
        pageSize: pagination.pageSize,
        current: pagination.current,
        sorter: {
          field: sorter.field,
          order: sorter.order,
        },
      };
      return params;
    },
    remotes: this.props.trackingList,
  })
  handleExport = () => {
  }
  handleFormReset = () => {
    this.props.form.resetFields();
    this.props.resetFollowFilter();
  }
  handleSearch = () => {
    const filterForm = this.props.form.getFieldsValue();
    const newfilter = { ...this.props.listFilter, ...filterForm };
    this.handleTableLoad(1, null, newfilter);
  }
  handleGranularityChange = (ev) => {
    const newfilter = { ...this.props.listFilter, granularity: ev.key };
    this.handleTableLoad(1, null, newfilter);
  }
  handleFollowUpload = (uploadRes) => {
    this.props.setUploadRecordsReload(true);
    if (uploadRes === 'adaptor-not-exist') {
      notification.error({
        message: '错误',
        description: '适配器未选择',
        placement: 'topLeft',
      });
    } else if (uploadRes) {
      if (uploadRes.upload_no) {
        notification.success({
          message: '导入任务已创建,导入日志查看进度',
          description: `任务ID: ${uploadRes.upload_no}`,
          placement: 'topLeft',
        });
      } else {
        notification.error({
          message: '错误',
          description: '未知错误',
          placement: 'topLeft',
        });
      }
    }
  }
  handleImport = () => {
    if (!this.editPermission) {
      message.warn(this.msg('noEitpermission'), 5);
      return;
    }
    this.setState({
      importPanel: { visible: true },
    });
  }
  handleImportMenuClick = (ev) => {
    if (ev.key === 'logs') {
      this.props.togglePanelVisible(true);
    }
  }
  showColumnModal = () => {
    this.props.toggleColumnSettingModal(true);
  }
  render() {
    const {
      form: { getFieldDecorator }, listFilter, trackingList,
      trackingLoading, bmObjs, customers,
    } = this.props;
    const { importPanel } = this.state;
    this.dataSource.remotes = trackingList;
    const fields = bmObjs.length > 0 ? bmObjs :
      LINE_FILE_ADAPTOR_MODELS.SOF_GLOBALTRACK.columns.map(col => ({
        editable: col.editable,
        width: col.width,
        bm_field: col.field,
        bmf_data_type: col.datatype,
        bmf_label_name: col.label,
      }));
    const dataColumns = this.makeColumns(fields);
    const billNoPlaceHolder = this.GRANULARITY_MAP[listFilter.granularity];
    const queryForm = (
      <Form layout="inline">
        <FormItem>
          {getFieldDecorator('bill_no', { initialValue: listFilter.bill_no })(<Input placeholder={billNoPlaceHolder} />)}
        </FormItem>
        <FormItem>
          {getFieldDecorator('owner', { initialValue: listFilter.owner })(<Select
            placeholder="客户"
            showSearch
            dropdownMatchSelectWidth={false}
          >
            <Option value="all">全部</Option>
            {customers.map(cust => <Option value={cust.id} key={cust.id}>{[cust.partner_code, cust.name].filter(cu => cu).join('|')}</Option>)}
          </Select>)}
        </FormItem>
        <FormItem>
          {getFieldDecorator('ie_type', { initialValue: listFilter.ie_type })(<Select placeholder="进出口标志">
            <Option value="all">不限</Option>
            <Option value="import">进口</Option>
            <Option value="export">出口</Option>
          </Select>)}
        </FormItem>
        <FormItem>
          {getFieldDecorator('created_date', {
                initialValue: listFilter.created_date,
              })(<RangePicker />)}
        </FormItem>
        <FormItem><Button type="primary" icon="search" onClick={this.handleSearch}>{this.msg('query')}</Button>
          <a onClick={this.handleFormReset} style={{ marginLeft: 8 }}>{this.msg('reset')}</a></FormItem>
      </Form>
    );
    const menu = (
      <Menu onClick={this.handleImportMenuClick}>
        <Menu.Item key="logs"><Icon type="profile" /> {this.msg('viewImportLogs')}</Menu.Item>
      </Menu>
    );
    return (
      <Layout id="page-layout">
        <PageHeader
          extra={<Menu
            mode="horizontal"
            selectedKeys={[listFilter.granularity]}
            onClick={this.handleGranularityChange}
          >
            {Object.keys(this.GRANULARITY_MAP).map(gkey =>
              <Menu.Item key={gkey}>{this.GRANULARITY_MAP[gkey]}</Menu.Item>)}
          </Menu>}
        >
          <PageHeader.Actions>
            <ToolbarAction icon="upload" label={this.msg('import')} dropdown={menu} onClick={this.handleImport} />
            <ToolbarAction icon="tool" tooltip={this.msg('customizeListColumns')} onClick={this.showColumnModal} />
          </PageHeader.Actions>
        </PageHeader>
        <Content className="page-content" key="main">
          <DataTable
            loading={trackingLoading}
            toolbarActions={queryForm}
            columns={dataColumns}
            dataSource={this.dataSource}
            rowKey="id"
          />
          <ImportDataPanel
            title={this.msg('importTrackingFollow')}
            visible={importPanel.visible}
            adaptors={this.props.adaptors}
            endpoint={`${API_ROOTS.default}v1/sof/globaltrack/importfollow`}
            formData={{ }}
            onClose={() => { this.setState({ importPanel: { visible: false } }); }}
            onUploaded={this.handleFollowUpload}
            customizeOverwrite
          />
          <UploadLogsPanel type="SOF_GLOBALTRACK" asyncReload />
          <ModelColumnSettingModal
            targetObj="IMPORTFOLLOW"
            fromSubject="DWD_GLOBAL"
            title="自定义状态追踪列表项"
          />
        </Content>
      </Layout>
    );
  }
}

