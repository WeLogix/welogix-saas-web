import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import moment from 'moment';
import { Button, Card, Table, Switch, Form, Row, Col, Radio, Select, Tag, Tooltip, Input, message } from 'antd';
import { toggleDeclImportModal, loadDeclEntries, loadEntryGnoDetails, importDeclBodies } from 'common/reducers/cmsManifestImport';
import FullscreenModal from 'client/components/FullscreenModal';
import SearchBox from 'client/components/SearchBox';
import { formatMsg } from '../../message.i18n';


const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

@injectIntl
@connect(
  state => ({
    head: state.cmsManifest.billHead,
    visible: state.cmsManifestImport.visibleDeclBodyModal,
    submitting: state.cmsManifestImport.submitting,
    declEntries: state.cmsManifestImport.declEntries,
    units: state.saasParams.latest.unit.map(un => ({
      value: un.unit_code,
      text: un.unit_name,
    })),
    currencies: state.saasParams.latest.currency.map(cr => ({
      value: cr.curr_code,
      text: cr.curr_name,
    })),
    tradeCountries: state.saasParams.latest.country.map(tc => ({
      value: tc.cntry_co,
      text: tc.cntry_name_cn,
      search: `${tc.cntry_co}${tc.cntry_name_en}${tc.cntry_name_cn}${tc.cntry_en_short}`,
    })),
    trxModes: state.saasParams.latest.trxnMode.map(tx => ({
      value: tx.trx_mode,
      text: tx.trx_spec,
    })),
    exemptions: state.saasParams.latest.exemptionWay.map(ep => ({
      value: ep.value,
      text: ep.text,
      search: `${ep.value}${ep.text}`,
    })),
  }),
  {
    toggleDeclImportModal, loadDeclEntries, loadEntryGnoDetails, importDeclBodies,
  }
)
export default class ImportDeclaredBodyModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    reload: PropTypes.func.isRequired,
  }
  state = {
    cusDeclNo: '',
    declEntries: [],
    entryDetails: [],
    addedEntryId: '',
    selectedRowKeys: [],
    selectedRows: [],
    filtered: true,
    ietype: 'all',
    destCountry: 'CHN',
    dutyMode: '1',
  }
  componentWillMount() {
    if (typeof document !== 'undefined' && typeof window !== 'undefined') {
      this.setState({
        scrollY: (window.innerHeight - 460),
      });
    }
    this.setState({ ietype: this.props.head.i_e_type === 0 ? 'import' : 'export' });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.declEntries !== this.props.declEntries) {
      this.setState({ declEntries: nextProps.declEntries });
    }
  }

  msg = formatMsg(this.props.intl)
  entryColumns = [{
    title: '报关单号',
    dataIndex: 'entry_id',
  }, {
    title: '放行日期',
    dataIndex: 'clear_date',
    render: o => o && moment(o).format('YYYY.MM.DD'),
    width: 180,
  }, {
    title: '成交方式',
    width: 100,
    dataIndex: 'trxn_mode',
    render: (o) => {
      const mode = this.props.trxModes.filter(cur => cur.value === o)[0];
      const text = mode ? `${mode.value}| ${mode.text}` : o;
      return text && text.length > 0 && <Tag>{text}</Tag>;
    },
  }, {
    title: '添加',
    width: 80,
    fixed: 'right',
    render: (o, record) => !record.added && <Button type="primary" size="small" icon="plus" onClick={() => this.handleAddReg(record)} />,
  }]

  regDetailColumns = [{
    title: '报关单号',
    dataIndex: 'entry_id',
  }, {
    title: '商品货号',
    dataIndex: 'cop_g_no',
    width: 150,
  }, {
    title: '商品编号',
    dataIndex: 'hscode',
    width: 120,
  }, {
    title: '中文品名',
    dataIndex: 'g_name',
    width: 150,
  }, {
    title: '单位',
    dataIndex: 'unit_pcs',
    width: 100,
    render: (o) => {
      const unit = this.props.units.filter(cur => cur.value === o)[0];
      const text = unit ? `${unit.value}| ${unit.text}` : o;
      return text && text.length > 0 && <Tag>{text}</Tag>;
    },
  }, {
    title: '数量',
    width: 100,
    dataIndex: 'qty_pcs',
  }, {
    title: '毛重',
    width: 100,
    dataIndex: 'gross_wt',
  }, {
    title: '净重',
    width: 100,
    dataIndex: 'wet_wt',
  }, {
    title: '金额',
    width: 100,
    dataIndex: 'trade_total',
  }, {
    title: '币制',
    width: 100,
    dataIndex: 'trade_curr',
    render: (o) => {
      const currency = this.props.currencies.filter(cur => cur.value === o)[0];
      const text = currency ? `${currency.value}| ${currency.text}` : o;
      return text && text.length > 0 && <Tag>{text}</Tag>;
    },
  }, {
    title: '原产国',
    dataIndex: 'orig_country',
    width: 150,
    render: (o) => {
      const country = this.props.tradeCountries.filter(cur => cur.value === o)[0];
      const text = country ? `${country.value}| ${country.text}` : o;
      return text && text.length > 0 && <Tag>{text}</Tag>;
    },
  }, {
    title: '删除',
    width: 80,
    fixed: 'right',
    render: (o, record) => (<span><Button type="danger" size="small" ghost icon="minus" onClick={() => this.handleDelDetail(record)} /></span>),
  }]
  handleAddReg = (row) => {
    this.props.loadEntryGnoDetails(row.pre_entry_seq_no, this.state.filtered).then((result) => {
      if (!result.error) {
        const cusDeclNo = row.entry_id;
        const entryDetails = this.state.entryDetails.filter(reg =>
          reg.pre_entry_seq_no !== row.pre_entry_seq_no).concat(result.data.map(dt =>
          ({ ...dt, entry_id: cusDeclNo, pre_entry_seq_no: row.pre_entry_seq_no })));
        const declEntries = this.state.declEntries.map(pr =>
          (pr.entry_id === cusDeclNo ? { ...pr, added: true } : pr));
        this.setState({ entryDetails, declEntries });
      }
    });
  }
  handleDelDetail = (detail) => {
    const entryDetails = this.state.entryDetails.filter(reg => reg.id !== detail.id);
    const declEntries = this.state.declEntries.map(pr =>
      (pr.pre_entry_seq_no === detail.pre_entry_seq_no ? { ...pr, added: false } : pr));
    this.setState({ entryDetails, declEntries });
  }
  handleDetailBatchDel = () => {
    const { selectedRows, entryDetails, declEntries } = this.state;
    const delEntryNos = selectedRows.map(sr => sr.entry_id);
    this.setState({
      declEntries: declEntries.map((dce) => {
        if (delEntryNos.find(den => den === dce.entry_id)) {
          return { ...dce, added: false };
        }
        return dce;
      }),
      entryDetails: entryDetails.filter(entd => !selectedRows.find(sr => sr.id === entd.id)),
      selectedRowKeys: [],
      selectedRows: [],
    });
  }
  handleCancel = () => {
    this.setState({
      declEntries: [],
      entryDetails: [],
      cusDeclNo: '',
      destCountry: '',
      dutyMode: '',
    });
    this.props.toggleDeclImportModal(false);
  }
  handleCusDeclNoChange = (ev) => {
    this.setState({ cusDeclNo: ev.target.value });
  }
  handleIetypeChange = (ev) => {
    this.setState({ ietype: ev.target.value });
  }
  handleCusDeclQuery = () => {
    const { ietype, cusDeclNo, filtered /* , clearDateRange */ } = this.state;
    this.props.loadDeclEntries({
      owner_custco: this.props.head.owner_custco,
      entry_no: cusDeclNo,
      ietype,
      filtered,
      /* start_date: clearDateRange.length === 2 ? clearDateRange[0].valueOf() : undefined,
      end_date: clearDateRange.length === 2 ? clearDateRange[1].valueOf() : undefined, */
    });
  }
  handleDeclImport = (action) => {
    const detailIds = [];
    const relCountObj = {};
    this.state.entryDetails.forEach((regd) => {
      detailIds.push(regd.id);
      if (relCountObj[regd.pre_entry_seq_no]) {
        relCountObj[regd.pre_entry_seq_no] += 1;
      } else {
        relCountObj[regd.pre_entry_seq_no] = 1;
      }
    });
    const relCounts = Object.keys(relCountObj).map(cusDeclNo => ({
      pre_entry_seq_no: cusDeclNo,
      count: relCountObj[cusDeclNo],
    }));
    const { destCountry, dutyMode } = this.state;
    this.props.importDeclBodies(this.props.head.delg_no, action, {
      detailIds,
      relCounts,
      destCountry,
      dutyMode,
    }).then((result) => {
      if (!result.error) {
        this.handleCancel();
        this.props.reload();
      } else {
        message.error(result.error.message);
      }
    });
  }
  handleAddedEntryNoChange = (value) => {
    this.setState({ addedEntryId: value });
  }
  handleFilterSwitch = (filtered) => {
    this.setState({ filtered });
  }
  handleDutyModeChange = (dutyMode) => {
    this.setState({ dutyMode });
  }
  handleDestCountryChange = (destCountry) => {
    this.setState({ destCountry });
  }
  render() {
    const {
      submitting, exemptions, tradeCountries, visible,
    } = this.props;
    const {
      cusDeclNo, entryDetails, dutyMode, destCountry, filtered, ietype,
    } = this.state;
    const dataSource = entryDetails.filter((item) => {
      if (this.state.addedEntryId) {
        const reg = new RegExp(this.state.addedEntryId);
        return reg.test(item.entry_id);
      }
      return true;
    });
    const extra = (
      <span>
        <Tooltip title="标记过的项将不能再次被复制">
          <Button type="primary" ghost loading={submitting} disabled={entryDetails.length === 0 || !filtered} onClick={() => this.handleDeclImport('mark')}>复制并标记</Button>
        </Tooltip>
        <Button type="primary" loading={submitting} disabled={entryDetails.length === 0} onClick={() => this.handleDeclImport('copy')}>复制</Button>
      </span>);
    // const mode = this.props.trxModes.filter(cur => cur.value === head.trxn_mode)[0];
    // const trxnMode = mode && `${mode.value}| ${mode.text}`;
    return (
      <FullscreenModal
        title={this.msg('复制历史数据')}
        onCancel={this.handleCancel}
        extra={extra}
        visible={visible}
      >
        {/*
        <Card bodyStyle={{ paddingBottom: 16 }}>
          <Form className="form-layout-compact" layout="inline">
            <Row gutter={16}>
              <Col span={5}>
                <FormItem label="客户">
                  <span className="ant-form-text">{`${head.owner_custco}|${head.owner_name}`}</span>
                </FormItem>
              </Col>
              <Col span={5} offset={1}>
                <FormItem label="委托号">
                  <span className="ant-form-text">{head.delg_no}</span>
                </FormItem>
              </Col>
              <Col span={5} offset={1}>
                <FormItem label="成交方式">
                  <span className="ant-form-text">{trxnMode}</span>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
        */}
        <Form layout="inline">
          <Row gutter={16}>
            <Col span={12}>
              <Card title="来源报关单" bodyStyle={{ padding: 0 }} >
                <div className="table-panel table-fixed-layout">
                  <div className="toolbar">
                    <FormItem>
                      <Input placeholder="报关单号" value={cusDeclNo} onChange={this.handleCusDeclNoChange} />
                    </FormItem>
                    <FormItem>
                      <RadioGroup onChange={this.handleIetypeChange} value={ietype}>
                        <RadioButton value="all">全部</RadioButton>
                        <RadioButton value="import">进口</RadioButton>
                        <RadioButton value="export">出口</RadioButton>
                      </RadioGroup>
                    </FormItem>
                    <FormItem label="过滤已标记报关单">
                      <Switch checked={filtered} onChange={this.handleFilterSwitch} />
                    </FormItem>
                    <Button type="primary" ghost onClick={this.handleCusDeclQuery}>查找</Button>
                  </div>
                  <Table
                    columns={this.entryColumns}
                    dataSource={this.state.declEntries}
                    rowKey="id"
                    scroll={{
                      x: this.entryColumns.reduce((acc, cur) =>
                        acc + (cur.width ? cur.width : 240), 0),
                      y: this.state.scrollY,
                    }}
                  />
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="选取报关单表体" bodyStyle={{ padding: 0 }} >
                <div className="table-panel table-fixed-layout">
                  <div className="toolbar">
                    <SearchBox
                      placeholder="报关单号"
                      onSearch={this.handleAddedEntryNoChange}
                    />
                    {this.state.selectedRowKeys.length !== 0 &&
                      <Button onClick={this.handleDetailBatchDel}>批量删除</Button>}
                    <div className="toolbar-right">
                      <FormItem label="征免方式">
                        <Select
                          showSearch
                          showArrow
                          optionFilterProp="search"
                          value={dutyMode}
                          onChange={this.handleDutyModeChange}
                          style={{ width: 100 }}
                          allowClear
                        >
                          {
                            exemptions.map(data => (
                              <Option key={data.value} search={`${data.search}`} >
                                {`${data.value}|${data.text}`}
                              </Option>))}
                        </Select>
                      </FormItem>
                      <FormItem label="最终目的国">
                        <Select
                          showSearch
                          showArrow
                          optionFilterProp="search"
                          value={destCountry}
                          onChange={this.handleDestCountryChange}
                          style={{ width: 100 }}
                          allowClear
                        >
                          {
                            tradeCountries.map(data => (
                              <Option key={data.value} search={`${data.search}`} >
                                {`${data.value}|${data.text}`}
                              </Option>))}
                        </Select>
                      </FormItem>
                    </div>
                  </div>
                  <Table
                    columns={this.regDetailColumns}
                    dataSource={dataSource}
                    rowKey="id"
                    rowSelection={{
                    selectedRowKeys: this.state.selectedRowKeys,
                    selectedRows: this.state.selectedRows,
                    onChange: (selectedRowKeys, selectedRows) => {
                      this.setState({ selectedRowKeys, selectedRows });
                    },
                  }}
                    scroll={{
                      x: this.regDetailColumns.reduce((acc, cur) =>
                        acc + (cur.width ? cur.width : 240), 0),
                      y: this.state.scrollY,
                    }}
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </Form>
      </FullscreenModal>
    );
  }
}
