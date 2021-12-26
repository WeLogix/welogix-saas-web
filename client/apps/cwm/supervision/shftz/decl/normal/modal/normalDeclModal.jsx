import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import moment from 'moment';
import { Button, Card, Row, Col, Table, Form, Radio, Select, Tag, Input, message } from 'antd';
import { getSuppliers } from 'common/reducers/cwmReceive';
import SearchBox from 'client/components/SearchBox';
import FullscreenModal from 'client/components/FullscreenModal';
import { format } from 'client/common/i18n/helpers';
import { loadBrokers } from 'common/reducers/cwmWarehouse';
import { loadManifestTemplates, closeNormalDeclModal, loadBatchOutRegs, loadBatchRegDetails, beginNormalDecl } from 'common/reducers/cwmShFtz';
import messages from '../../../message.i18n';

const formatMsg = format(messages);
const { Option } = Select;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

@injectIntl
@connect(
  state => ({
    tenantName: state.account.tenantName,
    customsCode: state.account.customsCode,
    visible: state.cwmShFtz.normalDeclModal.visible,
    defaultWhse: state.cwmContext.defaultWhse,
    owners: state.cwmContext.whseAttrs.owners,
    normalRegs: state.cwmShFtz.batchout_regs,
    billTemplates: state.cwmShFtz.billTemplates,
    loginId: state.account.loginId,
    loginName: state.account.username,
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
    trxnMode: state.saasParams.latest.trxnMode.map(tx => ({
      value: tx.trx_mode,
      text: tx.trx_spec,
    })),
    exemption: state.saasParams.latest.exemptionWay.map(ep => ({
      value: ep.value,
      text: ep.text,
    })),
    submitting: state.cwmShFtz.submitting,
    suppliers: state.cwmReceive.suppliers,
    brokers: state.cwmWarehouse.brokers,
  }),
  {
    loadBrokers,
    loadManifestTemplates,
    closeNormalDeclModal,
    loadBatchOutRegs,
    loadBatchRegDetails,
    beginNormalDecl,
    getSuppliers,
  }
)
@Form.create()
export default class NormalDeclModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    reload: PropTypes.func.isRequired,
  }
  state = {
    selectedRowKeys: [],
    ownerCusCode: '',
    relDateRange: [],
    relNo: '',
    normalRegs: [],
    regDetails: [],
    supplier: '',
    currency: '',
    template: undefined,
    ftzRelNo: '',
    dutyMode: '',
    destCountry: '',
    normalRowSelKeys: [],
    normalSelRows: [],
  }
  componentWillMount() {
    this.props.loadBrokers(this.props.defaultWhse.code);
    if (typeof document !== 'undefined' && typeof window !== 'undefined') {
      this.setState({
        scrollY: (window.innerHeight - 460),
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.normalRegs !== this.props.normalRegs) {
      this.setState({ normalRegs: nextProps.normalRegs });
    }
  }

  msg = key => formatMsg(this.props.intl, key);
  regDetailColumns = [{
    title: '出库单号',
    dataIndex: 'ftz_rel_no',
  }, {
    title: '商品货号',
    dataIndex: 'product_no',
    width: 150,
    render: (o) => {
      if (o) {
        return <Button>{o}</Button>;
      }
      return o;
    },
  }, {
    title: '商品编号',
    dataIndex: 'hscode',
    width: 120,
  }, {
    title: '中文品名',
    dataIndex: 'g_name',
    width: 150,
  }, {
    title: '规格型号',
    dataIndex: 'model',
    width: 240,
  }, {
    title: '原产国',
    dataIndex: 'country',
    width: 150,
    render: (o) => {
      const country = this.props.country.filter(cur => cur.value === o)[0];
      const text = country ? `${country.value}| ${country.text}` : o;
      return text && text.length > 0 && <Tag>{text}</Tag>;
    },
  }, {
    title: '单位',
    dataIndex: 'out_unit',
    width: 100,
    render: (o) => {
      const unit = this.props.unit.filter(cur => cur.value === o)[0];
      const text = unit ? `${unit.value}| ${unit.text}` : o;
      return text && text.length > 0 && <Tag>{text}</Tag>;
    },
  }, {
    title: '数量',
    width: 100,
    dataIndex: 'qty',
  }, {
    title: '毛重',
    width: 100,
    dataIndex: 'gross_wt',
  }, {
    title: '净重',
    width: 100,
    dataIndex: 'net_wt',
  }, {
    title: '金额',
    width: 100,
    dataIndex: 'amount',
  }, {
    title: '币制',
    width: 100,
    dataIndex: 'currency',
    render: (o) => {
      const currency = this.props.currency.filter(cur => cur.value === o)[0];
      const text = currency ? `${currency.value}| ${currency.text}` : o;
      return text && text.length > 0 && <Tag>{text}</Tag>;
    },
  }, {
    title: '目的国',
    dataIndex: 'dest_country',
    width: 150,
    render: (o) => {
      const country = this.props.country.filter(cur => cur.value === o)[0];
      return country ? <Tag>{`${country.value}| ${country.text}`}</Tag> : o;
    },
  }, {
    title: '删除',
    width: 80,
    fixed: 'right',
    render: (o, record) => (<span><Button type="danger" size="small" ghost icon="minus" onClick={() => this.handleDelDetail(record)} /></span>),
  }]
  handleAddReg = (row) => {
    this.props.loadBatchRegDetails(row.pre_entry_seq_no).then((result) => {
      if (!result.error) {
        const relNo = row.ftz_rel_no;
        const regDetails = this.state.regDetails.filter(reg => reg.ftz_rel_no !== relNo)
          .concat(result.data.map(dt => ({ ...dt, ftz_rel_no: relNo })));
        const normalRegs = this.state.normalRegs.map(pr =>
          (pr.ftz_rel_no === relNo ? { ...pr, added: true } : pr));
        this.setState({ regDetails, normalRegs });
      }
    });
  }
  batchAdd = () => {
    const { normalSelRows } = this.state;
    const preEntrySeqNos = normalSelRows.map(item => item.pre_entry_seq_no);
    const relNos = normalSelRows.map(item => item.ftz_rel_no);
    this.props.loadBatchRegDetails(preEntrySeqNos).then((result) => {
      if (!result.error) {
        const regDetails = this.state.regDetails.filter(reg =>
          !relNos.find(no => no === reg.ftz_rel_no)).concat(result.data);
        const normalRegs = this.state.normalRegs.map(pr =>
          (relNos.find(no => no === pr.ftz_rel_no) ? { ...pr, added: true } : pr));
        this.setState({
          regDetails, normalRegs, normalRowSelKeys: [], normalSelRows: [],
        });
      }
    });
  }
  handleDelDetail = (detail) => {
    const regDetails = this.state.regDetails.filter(reg => reg.id !== detail.id);
    const normalRegs = this.state.normalRegs.map(pr =>
      (pr.ftz_rel_no === detail.ftz_rel_no ? { ...pr, added: false } : pr));
    this.setState({ regDetails, normalRegs });
  }
  batchDelete = () => {
    const { selectedRowKeys, regDetails } = this.state;
    const normalRegs = [...this.state.normalRegs];
    const newRegDetails = [];
    for (let i = 0; i < regDetails.length; i++) {
      const detail = regDetails[i];
      if (!selectedRowKeys.find(key => key === detail.id)) {
        newRegDetails.push(detail);
      } else {
        normalRegs.find(pr => pr.ftz_rel_no === detail.ftz_rel_no).added = false;
      }
    }
    this.setState({
      normalRegs,
      regDetails: newRegDetails,
      selectedRowKeys: [],
    });
  }
  handleCancel = () => {
    this.setState({
      ownerCusCode: '',
      normalRegs: [],
      regDetails: [],
      relNo: '',
      relDateRange: [],
      ftzRelNo: '',
      supplier: '',
      currency: '',
      template: undefined,
      destCountry: '',
      dutyMode: '',
      normalRowSelKeys: [],
      normalSelRows: [],
    });
    this.props.form.resetFields();
    this.props.closeNormalDeclModal();
  }
  handleTemplateChange = (template) => {
    this.setState({ template });
  }
  handleSupplierChange = (supplier) => {
    this.setState({ supplier });
    const {
      ownerCusCode, relNo, relDateRange, currency,
    } = this.state;
    const trxMode = this.props.form.getFieldValue('trxn_mode');
    this.props.loadBatchOutRegs({
      owner_cus_code: ownerCusCode,
      whse_code: this.props.defaultWhse.code,
      rel_type: 'normal',
      rel_no: relNo,
      start_date: relDateRange.length === 2 ? relDateRange[0].valueOf() : undefined,
      end_date: relDateRange.length === 2 ? relDateRange[1].valueOf() : undefined,
      currency,
      supplier,
      trxMode,
    });
  }
  handleCurrencyChange = (currency) => {
    this.setState({ currency });
    const {
      ownerCusCode, relNo, relDateRange, supplier,
    } = this.state;
    const trxMode = this.props.form.getFieldValue('trxn_mode');
    this.props.loadBatchOutRegs({
      owner_cus_code: ownerCusCode,
      whse_code: this.props.defaultWhse.code,
      rel_type: 'normal',
      rel_no: relNo,
      start_date: relDateRange.length === 2 ? relDateRange[0].valueOf() : undefined,
      end_date: relDateRange.length === 2 ? relDateRange[1].valueOf() : undefined,
      currency,
      supplier,
      trxMode,
    });
  }
  handleRelNoChange = (ev) => {
    this.setState({ relNo: ev.target.value });
  }
  handleRelRangeChange = (relDateRange) => {
    this.setState({ relDateRange });
  }
  handleFtzRelNoChange = (value) => {
    this.setState({ ftzRelNo: value });
  }
  handleNormalOutsQuery = () => {
    const {
      ownerCusCode, relNo, relDateRange, currency, supplier,
    } = this.state;
    const trxMode = this.props.form.getFieldValue('trxn_mode');
    this.props.loadBatchOutRegs({
      owner_cus_code: ownerCusCode,
      whse_code: this.props.defaultWhse.code,
      rel_type: 'normal',
      rel_no: relNo,
      start_date: relDateRange.length === 2 ? relDateRange[0].valueOf() : undefined,
      end_date: relDateRange.length === 2 ? relDateRange[1].valueOf() : undefined,
      currency,
      supplier,
      trxMode,
    });
  }
  handleBatchClear = () => {
    if (!this.state.ownerCusCode) {
      message.error('货主未选定');
      return;
    }
    const detailIds = [];
    const relCountObj = {};
    this.state.regDetails.forEach((regd) => {
      detailIds.push(regd.id);
      if (relCountObj[regd.ftz_rel_no]) {
        relCountObj[regd.ftz_rel_no] += 1;
      } else {
        relCountObj[regd.ftz_rel_no] = 1;
      }
    });
    const relCounts = Object.keys(relCountObj).map(relNo => ({
      rel_no: relNo,
      count: relCountObj[relNo],
    }));
    const owner = this.props.owners.filter(own =>
      own.customs_code === this.state.ownerCusCode).map(own => ({
      partner_id: own.id,
      tenant_id: own.partner_tenant_id,
      customs_code: own.customs_code,
      name: own.name,
    }))[0];
    const {
      loginId, loginName, tenantName, defaultWhse,
    } = this.props;
    const { destCountry, dutyMode } = this.state;
    this.props.form.validateFields((errors, values) => {
      const fbroker = this.props.brokers.find(bk => bk.customs_code === values.broker);
      const broker = fbroker ?
        {
          name: fbroker.name,
          partner_id: fbroker.partner_id,
          tenant_id: fbroker.partner_tenant_id,
          partner_unique_code: fbroker.uscc_code,
        }
        : { name: tenantName };
      this.props.beginNormalDecl({
        ietype: values.ietype,
        template: this.state.template,
        detailIds,
        relCounts,
        owner,
        loginId,
        loginName,
        broker,
        trxnMode: values.trxn_mode,
        destCountry,
        dutyMode,
        customsCode: defaultWhse.customs_code,
      }).then((result) => {
        if (!result.error) {
          this.handleCancel();
          this.props.reload();
        } else {
          message.error(result.error.message);
        }
      });
    });
  }
  handleOwnerChange = (ownerCusCode) => {
    this.props.loadBatchOutRegs({
      owner_cus_code: ownerCusCode,
      whse_code: this.props.defaultWhse.code,
      rel_type: 'normal',
    });
    const owner = this.props.owners.find(ow => ow.customs_code === ownerCusCode);
    this.setState({
      ownerCusCode,
      regDetails: [],
      relNo: '',
      relDateRange: [],
      ftzRelNo: '',
      template: undefined,
    });
    if (owner) {
      const ietype = this.props.form.getFieldValue('ietype');
      this.handleBillTemplateLoad(ietype, owner);
      this.props.getSuppliers(this.props.defaultWhse.code, owner.id);
    }
  }
  handleIeTypeChange = (ev) => {
    if (this.state.ownerCusCode) {
      const owner = this.props.owners.find(ow => ow.customs_code === this.state.ownerCusCode);
      this.handleBillTemplateLoad(ev.target.value, owner);
    }
  }
  handleBillTemplateLoad = (ietype, owner) => {
    let ieval = -1;
    if (ietype === 'import') {
      ieval = 0;
    } else if (ietype === 'export') {
      ieval = 1;
    }
    if (ieval >= 0) {
      this.props.loadManifestTemplates({
        owner_partner_id: owner.id,
        ietype: ieval,
      });
    }
  }
  handleDutyModeChange = (dutyMode) => {
    this.setState({ dutyMode });
  }
  handleDestCountryChange = (destCountry) => {
    this.setState({ destCountry });
  }
  render() {
    const {
      form: { getFieldDecorator }, owners, ownerCusCode, brokers, customsCode,
      tenantName, submitting, billTemplates, exemption, country, visible,
    } = this.props;
    const {
      relNo, template, regDetails, dutyMode, destCountry,
    } = this.state;
    const dataSource = regDetails.filter((item) => {
      if (this.state.ftzRelNo) {
        const reg = new RegExp(this.state.ftzRelNo);
        return reg.test(item.ftz_rel_no);
      }
      return true;
    });
    const normalRegColumns = [{
      title: '出库单号',
      dataIndex: 'ftz_rel_no',
      width: 180,
    }, {
      title: '供货商',
      dataIndex: 'supplier',
      width: 150,
      filterDropdown: (
        <div className="filter-dropdown">
          <Select
            allowClear
            onChange={this.handleSupplierChange}
            style={{ width: 150 }}
            value={this.state.supplier}
          >
            {this.props.suppliers.map(data => (
              <Option key={data.code} value={data.code}>
                {data.name}
              </Option>))}
          </Select>
        </div>
      ),
    }, {
      title: '币制',
      dataIndex: 'currency',
      width: 80,
      render: (o) => {
        const currency = this.props.currency.find(curr => curr.value === o);
        return currency && currency.text;
      },
      filterDropdown: (
        <div className="filter-dropdown">
          <Select allowClear placeholder="币制" onChange={this.handleCurrencyChange} style={{ width: 80 }} value={this.state.currency}>
            {this.props.currency.map(data => (
              <Option key={data.value} value={data.value}>
                {data.text}
              </Option>))}
          </Select>
        </div>
      ),
    }, {
      title: '货主',
      dataIndex: 'owner_name',
      width: 150,
    }, {
      title: '成交方式',
      dataIndex: 'trxn_mode',
      width: 100,
      render: o => o && this.props.trxnMode.find(trx => trx.value === o).text,
    }, {
      title: '出库日期',
      width: 150,
      dataIndex: 'ftz_rel_date',
      render: o => o && moment(o).format('YYYY.MM.DD'),
    }, {
      title: '添加',
      width: 80,
      fixed: 'right',
      render: (o, record) => !record.added && <Button type="primary" size="small" icon="plus" onClick={() => this.handleAddReg(record)} />,
    }];
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    const normalRowSelection = {
      selectedRowKeys: this.state.normalRowSelKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ normalRowSelKeys: selectedRowKeys, normalSelRows: selectedRows });
      },
      selections: [{
        key: 'all-data',
        text: 'Select All Data',
        onSelect: () => {
          const selectedRowKeys = this.state.normalRegs.map(item => item.id);
          this.setState({
            normalRowSelKeys: selectedRowKeys,
            normalSelRows: this.state.normalRegs,
          });
        },
      }],
    };
    return (
      <FullscreenModal
        title={this.msg('新建普通出库清关')}
        onCancel={this.handleCancel}
        onSave={this.handleBatchClear}
        saveDisabled={this.state.regDetails.length === 0}
        saveLoading={submitting}
        visible={visible}
      >
        <Card bodyStyle={{ paddingBottom: 16 }}>
          <Form className="form-layout-compact">
            <Row gutter={16}>
              <Col span={4}>
                <FormItem label="货主">
                  {getFieldDecorator('owner', {
                    initialValue: ownerCusCode,
                    rules: [{ required: true, message: '提货单位必选' }],
                  })(<Select placeholder="请选择提货单位" showSearch onChange={this.handleOwnerChange}>
                    {owners.map(owner => (
                      <Option value={owner.customs_code} key={owner.customs_code}>
                        {owner.name}</Option>))}
                  </Select>)}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem label="报关企业">
                  {getFieldDecorator('broker', {
                    rules: [{ required: true, message: '报关企业必选' }],
                  })(<Select placeholder="请选择报关企业">
                    {brokers.map(broker => (
                      <Option value={broker.customs_code} key={broker.customs_code}>
                        {broker.name}
                      </Option>)).concat(<Option value={customsCode} key={customsCode}>
                        {tenantName}
                      </Option>)}
                  </Select>)}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem label="进出口标识">
                  {getFieldDecorator('ietype', { initialValue: 'import', onChange: this.handleIeTypeChange })(<RadioGroup>
                    <RadioButton value="import">进口</RadioButton>
                    <RadioButton value="export">出口</RadioButton>
                  </RadioGroup>)}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem label="成交方式">
                  {getFieldDecorator('trxn_mode')(<Select placeholder="请选择成交方式" allowClear>
                    {this.props.trxnMode.map(data => (
                      <Option key={data.value} value={data.value}>
                        {data.text}
                      </Option>))}
                  </Select>)}
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem label="征免方式">
                  <Select allowClear optionFilterProp="children" value={dutyMode} onChange={this.handleDutyModeChange} >
                    {exemption.map(data => (
                      <Option key={data.value} value={data.value} >{`${data.value}|${data.text}`}</Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem label="最终目的国">
                  <Select showSearch showArrow allowClear optionFilterProp="children" value={destCountry} onChange={this.handleDestCountryChange}>
                    {country.map(data => (
                      <Option key={data.value} value={data.value}>{`${data.value}|${data.text}`}</Option>
                ))}
                  </Select>
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem label="制单规则">
                  <Select allowClear onChange={this.handleTemplateChange} value={template}>
                    {billTemplates && billTemplates.map(data =>
                      (<Option key={data.name} value={data.id}>{data.name}</Option>))}
                  </Select>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
        <Form layout="inline">
          <Row gutter={8}>
            <Col sm={24} md={8} lg={10}>
              <Card title="出区提货单" bodyStyle={{ padding: 0 }} >
                <div className="table-panel table-fixed-layout">
                  <div className="toolbar">
                    <Input value={relNo} placeholder="出库单号" onChange={this.handleRelNoChange} style={{ width: 200, marginRight: 8 }} />
                    <Button icon="search" onClick={this.handleNormalOutsQuery} />
                    <div className={`bulk-actions ${this.state.normalRowSelKeys.length === 0 ? 'hide' : ''}`}>
                      <h3>已选中{this.state.normalRowSelKeys.length}项</h3>
                      {this.state.normalRowSelKeys.length !== 0 &&
                      <Button onClick={this.batchAdd}>批量添加</Button>}
                    </div>
                  </div>
                  <Table
                    columns={normalRegColumns}
                    dataSource={this.state.normalRegs}
                    rowKey="id"
                    rowSelection={normalRowSelection}
                    scroll={{
                      x: normalRegColumns.reduce((acc, cur) =>
                      acc + (cur.width ? cur.width : 240), 0),
                      y: this.state.scrollY,
}}
                  />
                </div>
              </Card>
            </Col>
            <Col sm={24} md={16} lg={14}>
              <Card title="出库报关明细" bodyStyle={{ padding: 0 }} >
                <div className="table-panel table-fixed-layout">
                  <div className="toolbar">
                    <SearchBox value={this.state.ftzRelNo} placeholder="出库单号" onSearch={this.handleFtzRelNoChange} />
                    <div className={`bulk-actions ${this.state.selectedRowKeys.length === 0 ? 'hide' : ''}`}>
                      <h3>已选中{this.state.selectedRowKeys.length}项</h3>
                      {this.state.selectedRowKeys.length !== 0 &&
                      <Button onClick={this.batchDelete}>批量删除</Button>}
                    </div>
                  </div>
                  <Table
                    columns={this.regDetailColumns}
                    dataSource={dataSource}
                    rowKey="id"
                    rowSelection={rowSelection}
                    scroll={{
                      x: this.regDetailColumns.reduce((acc, cur) =>
                      acc + (cur.width ? cur.width : 500), 0),
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
