import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Dropdown, Menu, Modal, Tooltip, Icon, Tag, message, notification, Popconfirm } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import {
  loadManifestHead, delBillBody,
  loadBillBodyTotalValue, loadBillBodyList, openAmountModal, showNetwtDividModal,
  refreshRelatedBodies, deleteSelectedBodies, resetBillBody, openRuleModal,
  showEditBodyModal, showDeclElementsModal, updateBillBody,
  dividHeadGrosswt, aggreateHeadNetwt, loadBillOrDeclStat, refreshManualBodies,
} from 'common/reducers/cmsManifest';
import { toggleDeclImportModal } from 'common/reducers/cmsManifestImport';
import { loadModelAdaptors } from 'common/reducers/hubDataAdapter';
import { getElementByHscode } from 'common/reducers/cmsHsCode';
import { loadLatestSaasParam } from 'common/reducers/saasParams';
import { LINE_FILE_ADAPTOR_MODELS, CMS_HS_EFFICIENCY } from 'common/constants';
import { createFilename } from 'client/util/dataTransform';
import Summary from 'client/components/Summary';
import SearchBox from 'client/components/SearchBox';
import DataPane from 'client/components/DataPane';
import ImportDataPanel from 'client/components/ImportDataPanel';
import RowAction from 'client/components/RowAction';
import CustomsInpsectionTip from 'client/components/customsInpsectionTip';
import DeclDetailModal from '../modals/declDetailModal';
import DeclElementsModal from '../../../common/modal/declElementsModal';
import ImportDeclaredBodyModal from '../modals/importDeclaredBodyModal';
import AmountModal from '../modals/amountDivid';
import DividNetwtModal from '../modals/dividNetwtModal';
import RelateImportRuleModal from '../modals/relateImportRules';
import { formatMsg } from '../../message.i18n';

const renderCombineData = (fieldVal, options) => {
  const foundOpts = options.filter(opt => opt.value === fieldVal);
  const label = foundOpts.length === 1 ? `${foundOpts[0].value}|${foundOpts[0].text}` : fieldVal;
  return label && label.length > 0 ? <Tag>{label}</Tag> : <span />;
};
// const { Search } = Input;

@injectIntl
@connect(
  state => ({
    units: state.saasParams.latest.unit.map(un => ({
      value: un.unit_code,
      text: un.unit_name,
    })),
    countries: state.saasParams.latest.country.map(tc => ({
      value: tc.cntry_co,
      text: tc.cntry_name_cn,
    })),
    currencies: state.saasParams.latest.currency.map(cr => ({
      value: cr.curr_code,
      text: cr.curr_name,
    })),
    districts: state.saasParams.latest.district.map(dt => ({
      value: dt.district_code,
      text: dt.district_name,
    })),
    regions: state.saasParams.latest.cnregion.map(re => ({
      value: re.region_code,
      text: re.region_name,
    })),
    exemptions: state.saasParams.latest.exemptionWay,
    loginId: state.account.loginId,
    billHead: state.cmsManifest.billHead,
    billMeta: state.cmsManifest.billMeta,
    adaptors: state.hubDataAdapter.modelAdaptors,
    billBodyList: state.cmsManifest.billBodyList,
    billBodyListMask: state.cmsManifest.billBodyListMask,
    billBodyTotalValue: state.cmsManifest.billBodyTotalValue,
    whetherReloadBillList: state.cmsManifest.whetherReloadBillList,
    billbodyListFilter: state.cmsManifest.billbodyListFilter,
  }),
  {
    loadManifestHead,
    loadBillOrDeclStat,
    loadLatestSaasParam,
    delBillBody,
    loadBillBodyList,
    loadBillBodyTotalValue,
    openAmountModal,
    showNetwtDividModal,
    showEditBodyModal,
    deleteSelectedBodies,
    resetBillBody,
    refreshRelatedBodies,
    openRuleModal,
    showDeclElementsModal,
    updateBillBody,
    getElementByHscode,
    toggleDeclImportModal,
    loadModelAdaptors,
    dividHeadGrosswt,
    aggreateHeadNetwt,
    refreshManualBodies,
  }
)
export default class ManifestBodyPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    ietype: PropTypes.oneOf(['import', 'export']).isRequired,
    readonly: PropTypes.bool,
    billSeqNo: PropTypes.string,
    units: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string })),
    countries: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string })),
    currencies: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string })),
    districts: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string })),
    regions: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string })),
    exemptions: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string })),
    billHead: PropTypes.shape({ bill_seq_no: PropTypes.string }),
    headForm: PropTypes.shape({ setFieldsValue: PropTypes.func }),
    billMeta: PropTypes.shape({
      bill_seq_no: PropTypes.string.isRequired,
      entries: PropTypes.arrayOf(PropTypes.shape({ pre_entry_seq_no: PropTypes.string })),
      repoId: PropTypes.number,
    }),
  }
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      importPanelVisible: false,
      importPanel: { endpoint: '', template: '', title: '' },
      // filterDropdownVisible: false,
    };
  }
  componentDidMount() {
    this.props.loadLatestSaasParam(['origPlace']);
    this.props.loadModelAdaptors(
      this.props.billHead.owner_cuspartner_id,
      [LINE_FILE_ADAPTOR_MODELS.CMS_MANIFEST_BODY.key],
    );
    this.handleLoadList(1, null, {});
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.whetherReloadBillList !== this.props.whetherReloadBillList
      && nextProps.whetherReloadBillList) {
      this.handleLoadList(
        nextProps.billBodyList.current,
        nextProps.billBodyList.pageSize,
        nextProps.billbodyListFilter,
      );
      this.props.loadBillOrDeclStat(nextProps.billHead.delg_no);
    }
  }
  getColumns() {
    const {
      units, countries, currencies, exemptions, districts, regions,
    } = this.props;
    const columns = [{
      title: this.msg('seqNo'),
      dataIndex: 'g_no',
      width: 45,
      align: 'center',
      className: 'table-col-seq',
    }, {
      title: this.msg('copGNo'),
      width: 150,
      dataIndex: 'cop_g_no',
      /*
      filterDropdown: (
        <Search
          placeholder="请输入商品货号"
          onSearch={this.handleSearch}
          enterButton
        />
      ),
      filterIcon: <Icon type="search" style={{
        color: this.props.billbodyListFilter.product_no ? '#108ee9' : '#aaa' }} />,
      filterDropdownVisible: this.state.filterDropdownVisible,
      onFilterDropdownVisibleChange: (visible) => {
        this.setState({
          filterDropdownVisible: visible,
        });
      },
      */
      render: (prdno, record) => {
        if (!prdno) {
          return null;
        }
        let tooltipTitle = '';
        if (record.feedback === 'noMatch') {
          tooltipTitle = '归类库中未对该货号归类';
        } else if (record.feedback === 'noBookItem') {
          tooltipTitle = '账册中货号未备案';
        } else if (record.feedback === 'bookDisabled') {
          tooltipTitle = '账册中已禁用';
        } else if (record.feedback === 'incomplete') {
          tooltipTitle = '申报数量/单位/净重/金额/单价/币制/原产国/目的国/征免方式为空';
        }
        if (tooltipTitle) {
          return (
            <RowAction
              onClick={this.handleEditBody}
              label={<Tooltip title={tooltipTitle}><Tag color="red">{prdno}</Tag></Tooltip>}
              row={record}
              href
            />);
        }
        const filterProductNo = this.props.billbodyListFilter.product_no;
        const copGno = record.cop_g_no;
        let copGNORender = copGno;
        if (filterProductNo) {
          const fromIndex = copGno.toLowerCase().indexOf(filterProductNo.toLowerCase());
          if (fromIndex >= 0) {
            copGNORender = [copGno.slice(0, fromIndex),
              <span key="highlight" style={{ color: '#f50' }}>{copGno.slice(fromIndex, fromIndex + filterProductNo.length)}</span>,
              copGno.slice(fromIndex + filterProductNo.length)].filter(cgo => cgo);
          }
        }
        return <RowAction onClick={this.handleEditBody} label={copGNORender} row={record} href />;
      },
    }, {
      title: this.msg('emGNo'),
      width: 100,
      dataIndex: 'em_g_no',
    }, {
      title: this.msg('codeT'),
      width: 110,
      dataIndex: 'hscode',
      render: (o, record) => {
        if (record.feedback === 'wrongHs') {
          return (<Tooltip title="错误的商品编号">
            <Tag color="red">{record.hscode || ''}</Tag>
          </Tooltip>);
        }
        return o;
      },
    }, {
      title: this.msg('ciqCode'),
      width: 110,
      dataIndex: 'ciqcode',
      render: (cc, record) => {
        if (!cc) {
          return (<Tooltip title="检验检疫未填">
            <Tag color="red" />
          </Tooltip>);
        }
        return `${cc} | ${record.ciqname}`;
      },
    }, {
      title: this.msg('gName'),
      width: 200,
      dataIndex: 'g_name',
    }, {
      title: this.msg('enName'),
      width: 200,
      dataIndex: 'en_name',
    }, {
      title: this.msg('gModel'),
      width: 400,
      dataIndex: 'g_model',
      onCellClick: record => record.cop_g_no && this.handleShowDeclElementModal(record),
    }, {
      title: this.msg('quantity'),
      width: 80,
      align: 'right',
      dataIndex: 'g_qty',
    }, {
      title: this.msg('unit'),
      width: 110,
      align: 'center',
      render: (o, record) => renderCombineData(record.g_unit, units),
    }, {
      title: this.msg('unitPrice'),
      width: 100,
      align: 'right',
      dataIndex: 'dec_price',
    }, {
      title: this.msg('totalPrice'),
      width: 100,
      align: 'right',
      dataIndex: 'trade_total',
    }, {
      title: this.msg('currency'),
      width: 100,
      align: 'center',
      render: (o, record) => renderCombineData(record.trade_curr, currencies),
    }, {
      title: this.msg('grossWeight'),
      width: 80,
      align: 'right',
      dataIndex: 'gross_wt',
    }, {
      title: this.msg('netWeight'),
      width: 80,
      align: 'right',
      dataIndex: 'wet_wt',
    }, {
      title: this.msg('qty1'),
      width: 80,
      align: 'right',
      dataIndex: 'qty_1',
    }, {
      title: this.msg('unit1'),
      width: 80,
      align: 'center',
      render: (o, record) => renderCombineData(record.unit_1, units),
    }, {
      title: this.msg('qty2'),
      width: 80,
      align: 'right',
      dataIndex: 'qty_2',
    }, {
      title: this.msg('unit2'),
      width: 80,
      align: 'center',
      render: (o, record) => renderCombineData(record.unit_2, units),
    }, {
      title: this.msg('origCountry'),
      width: 150,
      render: (o, record) => renderCombineData(record.orig_country, countries),
    }, {
      title: this.msg('destCountry'),
      width: 150,
      render: (o, record) => renderCombineData(record.dest_country, countries),
    }, {
      title: this.props.ietype === 'import' ? this.msg('domesticDest') : this.msg('domesticOrig'),
      width: 150,
      render: (o, record) => renderCombineData(record.district_code, districts),
    }, {
      title: this.props.ietype === 'import' ? this.msg('regionDest') : this.msg('regionOrig'),
      width: 150,
      dataIndex: 'district_region',
      render: (o, record) => renderCombineData(record.district_region, regions),
    }, {
      title: this.msg('exemptionWay'),
      width: 100,
      render: (o, record) => renderCombineData(record.duty_mode, exemptions),
    }, {
      title: this.msg('qtyPcs'),
      width: 80,
      align: 'right',
      dataIndex: 'qty_pcs',
    }, {
      title: this.msg('unitPcs'),
      width: 100,
      render: (o, record) => renderCombineData(record.unit_pcs, units),
    }, {
      title: this.msg('versionNo'),
      width: 80,
      dataIndex: 'version_no',
    }, {
      title: this.msg('processingFees'),
      width: 80,
      dataIndex: 'processing_fees',
    }, {
      title: this.msg('containerId'),
      width: 150,
      dataIndex: 'container_no',
    }, {
      title: this.msg('customs'),
      width: 150,
      dataIndex: 'customs',
      render: col => (<CustomsInpsectionTip str={col} type="customs" />),
    }, {
      title: this.msg('inspection'),
      width: 150,
      dataIndex: 'inspection',
      render: col => (<CustomsInpsectionTip str={col} type="inspection" />),
    }, {
      title: this.msg('efficiency'),
      width: 150,
      dataIndex: 'efficiency',
      render: (o) => {
        const efficiency = CMS_HS_EFFICIENCY.find(effi => effi.value === o);
        return efficiency && efficiency.text;
      },
    }, {
      title: this.msg('opCol'),
      dataIndex: 'OPS_COL',
      className: 'table-col-ops',
      width: 90,
      fixed: 'right',
      render: (o, record, index) => (
        <span>
          <RowAction onClick={this.handleEditBody} icon="edit" row={record} index={index} disabled={this.props.readonly} />
          <RowAction danger confirm="确认删除?" onConfirm={() => this.handleDel(record, index)} icon="delete" disabled={this.props.readonly} />
        </span>
      ),
    }];
    return columns;
  }
  handleLoadList = (page, size, filter, whetherloadTotalValue = true) => {
    const { billSeqNo, billbodyListFilter, billBodyList: { current, pageSize } } = this.props;
    const currentPage = page || current;
    const currentSize = size || pageSize;
    const currentFilter = JSON.stringify(filter || billbodyListFilter);
    this.props.loadBillBodyList(billSeqNo, currentPage, currentSize, currentFilter);
    if (whetherloadTotalValue) {
      this.props.loadBillBodyTotalValue(billSeqNo);
    }
  }
  handleSearch = (value) => {
    const filter = { product_no: value };
    this.handleLoadList(1, null, filter);
    // this.setState({
    //  filterDropdownVisible: false,
    // });
  }
  handleShowDeclElementModal = (record) => {
    this.props.getElementByHscode(record.hscode).then((result) => {
      if (!result.error) {
        this.props.showDeclElementsModal(
          result.data.declared_elements,
          record.id, record.g_model,
          this.props.readonly,
          record.g_name
        );
      }
    });
  }
  msg = formatMsg(this.props.intl)
  handlePageChange = (page, pageSize) => {
    this.handleLoadList(page, pageSize, null, false);
  }
  handleEditBody = (row) => {
    this.props.showEditBodyModal(true, {
      delg_no: this.props.billHead.delg_no,
      declBody: row,
      isCDF: false,
    });
  }
  handleAddBody = () => {
    this.props.showEditBodyModal(true, {
      delg_no: this.props.billHead.delg_no,
      declBody: {},
      isCDF: false,
    });
  }
  handleDel = (row) => {
    this.props.delBillBody(row.id).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      }
    });
  }
  handleButtonClick = (ev) => {
    ev.stopPropagation();
  }
  handleExportData = (ev) => {
    ev.stopPropagation();
  }
  handleNetWetSummary = () => {
    this.props.aggreateHeadNetwt(this.props.billSeqNo).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        const wtSum = result.data;
        if (wtSum > 0) {
          const { headForm } = this.props;
          if (headForm) {
            headForm.setFieldsValue({ net_wt: wtSum });
          }
          notification.success({
            message: '操作成功',
            description: `已汇总净重: ${wtSum.toFixed(3)}千克`,
          });
        }
      }
    });
  }
  handleGrossWtDivid = () => {
    const totGrossWt = Number(this.props.billHead.gross_wt);
    if (!totGrossWt) {
      message.error('总毛重为空', 3);
      return;
    }
    this.props.dividHeadGrosswt(this.props.billSeqNo, totGrossWt).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        notification.success({
          message: '操作成功',
          description: `总毛重: ${totGrossWt.toFixed(2)}千克已分摊`,
        });
      }
    });
  }
  handleTotalPriceDivid = () => {
    this.props.openAmountModal();
  }
  handleDataMenuClick = (e) => {
    if (e.key === 'priceDivid') {
      this.handleTotalPriceDivid();
    } else if (e.key === 'wtDivid') {
      this.handleGrossWtDivid();
    } else if (e.key === 'wtSum') {
      this.handleNetWetSummary();
    } else if (e.key === 'netwtDivid') {
      this.props.showNetwtDividModal(true);
    } else if (e.key === 'reset') {
      Modal.confirm({
        title: '确定清空数据?',
        onOk: () => {
          this.handleBodyReset();
        },
        onCancel() {
        },
      });
    }
  }
  handleRelatedImportMenuClick = (e) => {
    if (e.key === 'related') {
      this.handleRelatedImport();
    } else if (e.key === 'rule') {
      this.props.openRuleModal();
    } else if (e.key === 'refreshRelated') {
      this.handleRelatedRefresh();
    } else if (e.key === 'unrelated') {
      this.handleUnrelatedImport();
    } else if (e.key === 'ebook') {
      this.handleManualBodyImport();
    } else if (e.key === 'refreshEbook') {
      this.handleManualRefresh();
    } else if (e.key === 'history') {
      this.handleDeclBodyImport();
    }
  }
  handleManifestBodyExport = () => {
    window.open(`${API_ROOTS.default}v1/cms/manifest/billbody/export/${createFilename('billbodyExport')}.xlsx?billSeqNo=${this.props.billSeqNo}`);
  }
  handleBodyExportToItem = () => {
    const vurl = 'v1/cms/manifest/billbody/unclassified/to/item/export/';
    const { billSeqNo } = this.props;
    const { repoId } = this.props.billMeta;
    window.open(`${API_ROOTS.default}${vurl}${createFilename('bodyExportToItem')}.xlsx?billSeqNo=${billSeqNo}&repoId=${repoId}`);
  }
  handleReload = (reloadHead) => {
    this.handleLoadList();
    if (reloadHead) {
      this.props.loadManifestHead(this.props.billSeqNo);
    }
    this.setState({ importPanelVisible: false });
  }
  handleDeleteSelected = () => {
    const selectedIds = this.state.selectedRowKeys;
    this.props.deleteSelectedBodies(selectedIds).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        this.handleLoadList();
      }
    });
    this.setState({ selectedRowKeys: [] });
  }
  handleBodyReset = () => {
    this.props.resetBillBody(this.props.billSeqNo).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        message.success('表体已清空');
        this.handleLoadList(1);
      }
    });
  }
  handleExportMenuClick = (e) => {
    if (e.key === 'all') {
      this.handleManifestBodyExport();
    } else if (e.key === 'expToItem') {
      this.handleBodyExportToItem();
    }
  }
  handleModelChange = (value, id) => {
    this.props.updateBillBody(id, value).then((result) => {
      if (!result.error) {
        this.handleLoadList();
      }
    });
  }
  handleRelatedRefresh = () => {
    this.props.refreshRelatedBodies(this.props.billSeqNo).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        this.handleLoadList();
        message.success('表体已刷新');
      }
    });
  }
  handleManualRefresh = () => {
    this.props.refreshManualBodies(this.props.billSeqNo).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        this.handleLoadList();
        message.success('关联账册表体已刷新');
      }
    });
  }
  handleDeselectRows = () => {
    this.setState({ selectedRowKeys: [] });
  }
  handleDeclBodyImport = () => {
    this.props.toggleDeclImportModal(true);
  }
  handleUnrelatedImport = () => {
    this.setState({
      importPanelVisible: true,
      importPanel: {
        title: '直接导入',
        endpoint: `${API_ROOTS.default}v1/cms/manifest/billbody/import`,
        template: `${API_ROOTS.default}v1/cms/manifest/billbody/model/download/${createFilename('billbodyModel')}.xlsx`,
      },
    });
  }
  handleRelatedImport = () => {
    this.setState({
      importPanelVisible: true,
      importPanel: {
        title: '关联归类库导入',
        endpoint: `${API_ROOTS.default}v1/cms/manifest/billbody/related/import`,
        template: `${API_ROOTS.default}v1/cms/manifest/billbody/related/model/download/${createFilename('relatedModel')}.xlsx`,
      },
    });
  }
  handleManualBodyImport = () => {
    this.setState({
      importPanelVisible: true,
      importPanel: {
        title: '关联账册导入',
        endpoint: `${API_ROOTS.default}v1/cms/manifest/billbody/related/manual/import`,
        template: `${API_ROOTS.default}v1/cms/manifest/billbody/manual/model/download/${createFilename('manualModel')}.xlsx`,
      },
    });
  }
  renderToolbar() {
    const { readonly, billMeta } = this.props;
    const exportMenu = (
      <Menu onClick={this.handleExportMenuClick}>
        {billMeta.repoId !== null &&
        <Menu.Item key="expToItem">未归类商品明细</Menu.Item>}
        <Menu.Item key="all">全部报关清单明细</Menu.Item>
      </Menu>);
    if (readonly) {
      return (<Dropdown overlay={exportMenu}>
        <Button >
          <Icon type="export" /> {this.msg('export')} <Icon type="caret-down" />
        </Button>
      </Dropdown>);
    }
    const dataToolsMenu = (
      <Menu onClick={this.handleDataMenuClick}>
        <Menu.Item key="priceDivid">金额平摊</Menu.Item>
        <Menu.Item key="wtDivid">毛重分摊</Menu.Item>
        <Menu.Item key="wtSum">净重汇总</Menu.Item>
        <Menu.Item key="netwtDivid">净重平摊</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="reset">清空表体数据</Menu.Item>
      </Menu>);
    const relatedImportMenu = (
      <Menu onClick={this.handleRelatedImportMenuClick}>
        <Menu.Item key="related">{this.msg('relatedImport')}</Menu.Item>
        {this.props.billBodyList.data.length > 0 && billMeta.repoId !== null &&
        <Menu.Item key="refreshRelated">刷新关联商品归类</Menu.Item>}
        <Menu.Item key="rule">设置关联导入规则</Menu.Item>
        <Menu.Divider />
        { this.props.billHead.manual_no &&
        <Menu.Item key="ebook">关联账册归并关系导入</Menu.Item>}
        { this.props.billHead.manual_no &&
        <Menu.Item key="refreshEbook">刷新账册归并关系</Menu.Item>}
        <Menu.Item key="history">从历史数据导入</Menu.Item>
        <Menu.Item key="unrelated">{this.msg('unrelatedImport')}</Menu.Item>
      </Menu>);
    return (<span>
      <Button icon="plus-circle-o" onClick={this.handleAddBody}>{this.msg('add')}</Button>
      <Dropdown overlay={relatedImportMenu}>
        <Button>
          <Icon type="upload" /> {this.msg('import')} <Icon type="caret-down" />
        </Button>
      </Dropdown>
      <Dropdown overlay={exportMenu}>
        <Button>
          <Icon type="download" /> 导出 <Icon type="caret-down" />
        </Button>
      </Dropdown>
      <Dropdown overlay={dataToolsMenu}>
        <Button>
          <Icon type="tool" /> <Icon type="caret-down" />
        </Button>
      </Dropdown>
    </span>);
  }

  render() {
    const {
      importPanelVisible,
      importPanel,
    } = this.state;
    const { readonly: disabled } = this.props;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
      getCheckboxProps: () => ({ disabled }),
    };
    const columns = this.getColumns();
    const {
      current, totalCount, pageSize, data,
    } = this.props.billBodyList;
    const pagination = {
      current,
      total: totalCount,
      pageSize,
      showQuickJumper: false,
      showSizeChanger: true,
      onChange: this.handlePageChange,
      showTotal: total => `共 ${total} 条`,
    };
    const {
      totGrossWt, totWetWt, totTrade, totPcs, tradeCurrGroup,
    } = this.props.billBodyTotalValue;
    return (
      <DataPane
        columns={columns}
        rowSelection={rowSelection}
        bordered
        dataSource={data}
        rowKey="id"
        loading={this.props.billBodyListMask}
        pagination={pagination}
        onRow={record => ({
          onDoubleClick: () => { this.handleEditBody(record); },
        })}
      >
        <DataPane.Toolbar>
          <SearchBox placeholder="商品货号/名称" onSearch={this.handleSearch} />
          <DataPane.BulkActions
            selectedRowKeys={this.state.selectedRowKeys}
            onDeselectRows={this.handleDeselectRows}
          >
            <Popconfirm title="是否删除所有选择项？" onConfirm={this.handleDeleteSelected}>
              <Button type="danger" icon="delete" style={{ marginLeft: 8 }}>
              批量删除
              </Button>
            </Popconfirm>
          </DataPane.BulkActions>
          <DataPane.Extra>
            {this.renderToolbar()}
          </DataPane.Extra>
        </DataPane.Toolbar>
        <AmountModal billSeqNo={this.props.billSeqNo} />
        <DividNetwtModal delgNo={this.props.billSeqNo} billGrossWt={this.props.billHead.gross_wt} />
        <RelateImportRuleModal ietype={this.props.ietype} />
        <DeclDetailModal
          ietype={this.props.ietype}
          manualNo={this.props.headForm.getFieldValue('manual_no')}
          tradeMode={this.props.headForm.getFieldValue('trade_mode')}
          disabled={disabled}
        />
        <DeclElementsModal onOk={this.handleModelChange} />
        <ImportDeclaredBodyModal reload={() => this.handleReload(true)} />
        <ImportDataPanel
          adaptors={this.props.adaptors}
          title={importPanel.title}
          visible={importPanelVisible}
          endpoint={importPanel.endpoint}
          formData={{ bill_seq_no: this.props.billHead.bill_seq_no }}
          onClose={() => { this.setState({ importPanelVisible: false }); }}
          onUploaded={this.handleReload}
          template={importPanel.template}
        />
        <Summary>
          <Summary.Item label="总个数">{totPcs}</Summary.Item>
          <Summary.Item label="总毛重" addonAfter="KG">{totGrossWt.toFixed(2)}</Summary.Item>
          <Summary.Item label="总净重" addonAfter="KG">{totWetWt.toFixed(3)}</Summary.Item>
          <Summary.Item label="总金额(元)" addonAfter="元">{totTrade.toFixed(2)}</Summary.Item>
          {Object.keys(tradeCurrGroup).map(curr =>
                (<Summary.Item label={`${curr}金额`} key={curr}>
                  {tradeCurrGroup[curr].trade.toFixed(2)}
                </Summary.Item>))}
        </Summary>
      </DataPane>
    );
  }
}
