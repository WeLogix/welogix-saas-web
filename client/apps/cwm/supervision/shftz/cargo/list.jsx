import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Button, Form, Icon, Layout, Radio, message } from 'antd';
import {
  loadProductCargo, updateCargoRule, syncProdSKUS,
  fileCargos, confirmCargos, editGname,
} from 'common/reducers/cwmShFtz';
import DataTable from 'client/components/DataTable';
import SearchBox from 'client/components/SearchBox';
import PageHeader from 'client/components/PageHeader';
import ButtonToggle from 'client/components/ButtonToggle';
import ImportDataPanel from 'client/components/ImportDataPanel';
import connectNav from 'client/common/decorators/connect-nav';
import EditableCell from 'client/components/EditableCell';
import { PrivilegeCover, hasPermission } from 'client/common/decorators/withPrivilege';
import { format } from 'client/common/i18n/helpers';
import messages from '../message.i18n';

const formatMsg = format(messages);
const { Content, Sider } = Layout;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const FormItem = Form.Item;

@injectIntl
@connect(
  state => ({
    loginId: state.account.loginId,
    loading: state.cwmShFtz.loading,
    cargolist: state.cwmShFtz.cargolist,
    cargoRule: state.cwmShFtz.cargoRule,
    cargoOwner: state.cwmShFtz.cargoOwner,
    listFilter: state.cwmShFtz.listFilter,
    whses: state.cwmContext.whses,
    whse: state.cwmContext.defaultWhse,
    owners: state.cwmContext.whseAttrs.owners,
    unit: state.saasParams.latest.unit.map(un => ({
      value: un.unit_code,
      text: un.unit_name,
    })),
    country: state.saasParams.latest.country.map(tc => ({
      value: tc.cntry_co,
      text: tc.cntry_name_cn,
    })),
    currency: state.saasParams.latest.currency.map(cr => ({
      value: cr.curr_code,
      text: cr.curr_name,
    })),
    submitting: state.cwmShFtz.submitting,
    privileges: state.account.privileges,
  }),
  {
    loadProductCargo,
    updateCargoRule,
    syncProdSKUS,
    fileCargos,
    confirmCargos,
    editGname,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'cwm',
  title: 'featCwmShftz',
})
export default class SHFTZCargoList extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    rightSiderCollapsed: true,
    selectedRowKeys: [],
    owner: this.props.cargoOwner,
    rule: null,
    importPanelVisible: false,
  }
  componentDidMount() {
    if (this.props.cargoOwner) {
      this.handleCargoLoad(1, { ...this.props.listFilter, status: 'completed' }, this.props.cargoOwner);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.cargoOwner !== this.props.cargoOwner) {
      const owner = nextProps.cargoOwner;
      this.setState({ owner });
      this.handleCargoLoad(1, this.props.listFilter, owner);
    }
    if (nextProps.cargoRule && (this.state.rule === null ||
      nextProps.cargoRule !== this.props.cargoRule)) {
      this.setState({ rule: nextProps.cargoRule.type });
    }
  }
  msg = key => formatMsg(this.props.intl, key);
  editPermission = hasPermission(this.props.privileges, {
    module: 'cwm', feature: 'supervision', action: 'edit',
  })
  columns = [{
    title: this.msg('productNo'),
    width: 150,
    dataIndex: 'product_no',
  }, {
    title: this.msg('ftzCargoNo'),
    dataIndex: 'ftz_cargo_no',
    width: 160,
    render: (o, record) => {
      switch (record.status) {
        case 0:
          return <span className="text-warning">{o}<Icon type="exclamation-circle-o" /></span>;
        case 1:
          return <span className="text-info">{o}<Icon type="question-circle-o" /></span>;
        case 2:
          return <span className="text-success">{o}<Icon type="check-circle-o" /></span>;
        default:
          return null;
      }
    },
  }, {
    title: this.msg('hscode'),
    width: 120,
    dataIndex: 'hscode',
  }, {
    title: this.msg('gname'),
    width: 180,
    dataIndex: 'name',
    render: (o, record) => (<EditableCell
      value={o}
      onSave={value => this.handleGnameChange(value, record.id)}
      editable={this.editPermission}
    />),
  }, {
    title: this.msg('currency'),
    width: 140,
    dataIndex: 'currency',
    render: (o) => {
      const currency = this.props.currency.filter(cur => cur.value === o)[0];
      const text = currency ? `${currency.value}| ${currency.text}` : o;
      return text;
    },
  }, {
    title: this.msg('country'),
    width: 140,
    dataIndex: 'country',
    render: (o) => {
      const country = this.props.country.filter(cur => cur.value === o)[0];
      const text = country ? `${country.value}| ${country.text}` : o;
      return text;
    },
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    width: 160,
  }]
  dataSource = new DataTable.DataSource({
    fetcher: params => this.props.loadProductCargo(params),
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
        whseCode: this.props.whse.code,
        owner: JSON.stringify(this.state.owner),
        pageSize: pagination.pageSize,
        currentPage: pagination.current,
        filter: JSON.stringify(this.props.listFilter),
      };
      return params;
    },
    remotes: this.props.cargolist,
  })
  toggleRightSider = () => {
    this.setState({
      rightSiderCollapsed: !this.state.rightSiderCollapsed,
    });
  }
  handleGnameChange = (val, id) => {
    const change = { name: val };
    this.props.editGname({ change, id });
  }
  handleCargoLoad = (currentPage, filter, owner) => {
    const { whse, listFilter, cargolist: { pageSize, current } } = this.props;
    this.props.loadProductCargo({
      whseCode: whse.code,
      owner: JSON.stringify(owner || this.state.owner),
      filter: JSON.stringify(filter || listFilter),
      pageSize,
      currentPage: currentPage || current,
    }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      }
    });
  }
  handleSearch = (value) => {
    const filter = { ...this.props.listFilter, filterNo: value };
    this.handleCargoLoad(1, filter);
  }
  handleStatusChange = (ev) => {
    if (ev.target.value === this.props.listFilter.status) {
      return;
    }
    const filter = { ...this.props.listFilter, status: ev.target.value };
    this.handleCargoLoad(1, filter);
  }
  handleSyncProductSKUs = () => {
    const { whse } = this.props;
    this.props.syncProdSKUS({ owner: this.state.owner, whseCode: whse.code }).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        this.handleCargoLoad();
      }
    });
  }
  handleRuleChange = (e) => {
    this.setState({ rule: e.target.value });
  }
  handleRuleSave = () => {
    this.props.updateCargoRule({ type: this.state.rule, id: this.props.cargoRule.id }).then(() => {
      this.handleCargoLoad(1, this.props.listFilter);
    });
  }
  handleCargoSend = () => {
    const { whse } = this.props;
    this.props.fileCargos(
      this.state.owner.customs_code,
      whse.code,
      whse.ftz_whse_code
    ).then((result) => {
      if (!result.error) {
        const filter = { ...this.props.listFilter, status: 'sent' };
        this.handleCargoLoad(1, filter);
      }
    });
  }
  handleCargoConfirm = () => {
    this.props.confirmCargos(this.state.owner.customs_code, this.props.whse.code).then((result) => {
      if (!result.error) {
        const filter = { ...this.props.listFilter, status: 'completed' };
        this.handleCargoLoad(1, filter);
      }
    });
  }
  handleFiledCargoImport = () => {
    const filter = { ...this.props.listFilter, status: 'completed' };
    this.handleCargoLoad(1, filter);
  }
  render() {
    const {
      cargolist, listFilter, loading, whse, loginId, submitting,
    } = this.props;
    // const bondedWhses = whses.filter(wh => wh.bonded === 1);
    const { owner, rule, importPanelVisible } = this.state;
    // const filterOwners = owners.filter(item => item.portion_enabled);
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    this.dataSource.remotes = cargolist;
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    const columns = [...this.columns];
    if (rule === 1) {
      columns.shift();
    }
    const toolbarActions = (<span>
      <SearchBox value={listFilter.filterNo} placeholder={this.msg('productSearchPlaceholder')} onSearch={this.handleSearch} />
      <RadioGroup value={listFilter.status} onChange={this.handleStatusChange} >
        <RadioButton value="pending">待备案</RadioButton>
        <RadioButton value="sent">已发送</RadioButton>
        <RadioButton value="completed">已备案</RadioButton>
      </RadioGroup>
    </span>);
    return (
      <Layout>
        <Layout>
          <PageHeader
            breadcrumb={[
              owner.name,
            ]}
          >
            <PageHeader.Actions>
              <PrivilegeCover module="cwm" feature="supervision" action="edit">
                {listFilter.status === 'pending' &&
                <Button icon="sync" loading={submitting} onClick={this.handleSyncProductSKUs} >
                同步SKU
                </Button>
                }
                {listFilter.status === 'pending' &&
                <Button type="primary" icon="cloud-upload-o" loading={submitting} onClick={this.handleCargoSend}>
                  发送备案
                </Button>
                }
                {listFilter.status === 'sent' &&
                <Button type="primary" ghost icon="check" loading={submitting} onClick={this.handleCargoConfirm}>
                  确认备案
                </Button>
                }
                <Button onClick={() => { this.setState({ importPanelVisible: true }); }}><Icon type="upload" /> 导入备案料号</Button>
                <ButtonToggle iconOn="tool" iconOff="tool" onClick={this.toggleRightSider} />
              </PrivilegeCover>
            </PageHeader.Actions>
          </PageHeader>
          <Content className="page-content" key="main">
            <DataTable
              columns={columns}
              dataSource={this.dataSource}
              rowSelection={rowSelection}
              rowKey="id"
              toolbarActions={toolbarActions}
              loading={loading}
            />
          </Content>
        </Layout>
        <Sider
          trigger={null}
          defaultCollapsed
          collapsible
          collapsed={this.state.rightSiderCollapsed}
          width={320}
          collapsedWidth={0}
          className="right-sider"
        >
          <div className="right-sider-panel">
            <div className="panel-header">
              <h3>映射规则</h3>
            </div>
            <Form layout="vertical" style={{ padding: 16 }}>
              <FormItem>
                <RadioGroup value={rule} onChange={this.handleRuleChange}>
                  <Radio style={radioStyle} value={0}>按商品货号一一对应</Radio>
                  <Radio style={radioStyle} value={1}>按商品编号+中文品名匹配</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem>
                <Button type="primary" icon="save" loading={submitting} onClick={this.handleRuleSave}>保存</Button>
              </FormItem>
            </Form>
          </div>
        </Sider>
        <ImportDataPanel
          title="分拨货物备案料号导入"
          visible={importPanelVisible}
          adaptors={null}
          endpoint={`${API_ROOTS.default}v1/cwm/shftz/cargo/filed/import`}
          formData={{
            loginId,
            whseCode: whse.code,
            ownerCusCode: owner.customs_code,
            ruleType: rule,
          }}
          onClose={() => { this.setState({ importPanelVisible: false }); }}
          onUploaded={this.handleFiledCargoImport}
          template={`${XLSX_CDN}/分拨货物备案料号模板.xlsx`}
        />
      </Layout>
    );
  }
}
