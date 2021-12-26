import React, { Component } from 'react';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Drawer, Col, message, Icon, Button, Card, Input, Form, Layout, Select, Table, Tag, Tooltip, Popover } from 'antd';
import EditableCell from 'client/components/EditableCell';
import FullscreenModal from 'client/components/FullscreenModal';
import { hideAdaptorDetailModal, updateColumnField, updateColumnDefault, updateAdaptor, delAdaptor, previewColumnConverter } from 'common/reducers/hubDataAdapter';
import { loadPartnerFlowList } from 'common/reducers/scofFlow';
import { LINE_FILE_ADAPTOR_MODELS } from 'common/constants';
import { formatMsg } from '../message.i18n';

const { Content } = Layout;
const FormItem = Form.Item;
const { Option } = Select;

@injectIntl
@connect(state => ({
  adaptor: state.hubDataAdapter.adaptor,
  visible: state.hubDataAdapter.adaptorDetailModal.visible,
  customers: state.partner.partners,
  flows: state.scofFlow.partnerFlows,
}), {
  hideAdaptorDetailModal,
  updateColumnField,
  updateColumnDefault,
  updateAdaptor,
  delAdaptor,
  loadPartnerFlowList,
  previewColumnConverter,
})
@Form.create()
export default class AdaptorDetailModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  state = {
    lineData: [],
    columnDefaults: [],
    settingVisible: false,
    helpVisible: false,
    mappingModal: {
      visible: false,
      mappings: [],
    },
    contentHeight: 0,
    preview: '',
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && this.props.adaptor.columns !== nextProps.adaptor.columns) {
      const lineData = [{
        id: 'example1',
        keyall: '行1',
      }, {
        id: 'example2',
        keyall: '行2',
      }, {
        id: 'field',
        keyall: '对应字段',
      }, {
        id: 'converter',
        keyall: '转换规则',
      }, {
        id: 'mapping',
        keyall: '映射关系',
      }, {
        id: 'indexing',
        keyall: '索引键',
      }];
      let scrollX = 100;
      nextProps.adaptor.columns.forEach((col, index) => {
        const dataIndex = `key${index}`;
        lineData[0][dataIndex] = col.desc1;
        lineData[1][dataIndex] = col.desc2;
        lineData[2][dataIndex] = col.field;
        lineData[3][dataIndex] = col.converter;
        lineData[4][dataIndex] = col.mapping;
        lineData[5][dataIndex] = col.indexing;
        scrollX += 200;
      });
      this.setState({
        lineData, scrollX, columnDefaults: nextProps.adaptor.columnDefaults,
      });
      this.props.loadPartnerFlowList({ partnerId: nextProps.adaptor.owner_partner_id });
    }
    if (nextProps.visible && !this.props.visible) {
      this.setState({
        contentHeight: window.innerHeight - 150,
      });
    }
    if (nextProps.visible && !this.props.visible) {
      this.setState({
        contentHeight: window.innerHeight - 150,
      });
    }
  }
  msg = formatMsg(this.props.intl)
  toggleSetting = () => {
    this.setState({
      settingVisible: !this.state.settingVisible,
    });
  }
  toggleHelp = () => {
    this.setState({
      helpVisible: !this.state.helpVisible,
    });
  }
  handleCancel = () => {
    this.props.hideAdaptorDetailModal();
  }
  handleCustomerChange = (customerPartnerId) => {
    this.props.loadPartnerFlowList({ partnerId: customerPartnerId });
  }
  handleFieldMap = (columnId, field, dataIndex) => {
    this.props.updateColumnField(columnId, { field: field || null })
      .then((result) => {
        if (!result.error) {
          this.setState({
            lineData: this.state.lineData.map((line, i) => (
              i === 2 ? { ...line, [dataIndex]: field } : line
            )),
          });
        }
      });
  }
  handleConvertMap = (columnId, converter, index) => {
    this.props.updateColumnField(columnId, { converter })
      .then((result) => {
        if (!result.error) {
          this.setState({
            lineData: this.state.lineData.map((line, i) => (
              i === 3 ? { ...line, [`key${index}`]: converter } : line
            )),
          });
        }
      });
  }
  handleMappingEditBegin = (columnId, mappingJson, dataIndex) => {
    this.setState({
      mappingModal: {
        visible: true,
        columnId,
        dataIndex,
        mappings: mappingJson ? JSON.parse(mappingJson) : [{ key: null, value: null }],
      },
    });
  }
  handleMappingEditCancel = () => {
    this.setState({
      mappingModal: {
        visible: false,
        mappings: [],
      },
    });
  }
  handleMappingInputKey = (value, index) => {
    const mappingModal = { ...this.state.mappingModal };
    mappingModal.mappings[index].key = value;
    if (mappingModal.mappings[index].value === null) {
      mappingModal.mappings[index].value = '';
    }
    this.setState({ mappingModal });
  }
  handleMappingInputVal = (value, index) => {
    const mappingModal = { ...this.state.mappingModal };
    mappingModal.mappings[index].value = value;
    if (mappingModal.mappings[index].key === null) {
      mappingModal.mappings[index].key = '';
    }
    this.setState({ mappingModal });
  }
  handleMappingInputRem = (index) => {
    const mappingModal = { ...this.state.mappingModal };
    if (mappingModal.mappings.length === 1) {
      mappingModal.mappings[0].key = null;
      mappingModal.mappings[0].value = null;
    } else {
      mappingModal.mappings.splice(index, 1);
    }
    this.setState({ mappingModal });
  }
  handleMappingInputAdd = () => {
    const mappingModal = { ...this.state.mappingModal };
    mappingModal.mappings.push({
      key: '',
      value: null,
    });
    this.setState({ mappingModal });
  }
  handleMappingEditOk = () => {
    const mappings = this.state.mappingModal.mappings.filter(mapp =>
      mapp.key !== null && mapp.value !== null);
    let mappingJson = null;
    if (mappings.length > 0) {
      mappingJson = JSON.stringify(mappings);
    }
    const { columnId, dataIndex } = this.state.mappingModal;
    this.props.updateColumnField(columnId, { mapping: mappingJson })
      .then((result) => {
        if (!result.error) {
          this.setState({
            lineData: this.state.lineData.map((line, i) => (
              i === 4 ? { ...line, [dataIndex]: mappingJson } : line
            )),
          });
        }
      });
    this.handleMappingEditCancel();
  }
  handleAdaptorUpdate = () => {
    const adaptorValues = this.props.form.getFieldsValue();
    const customer = this.props.customers.filter(cust =>
      cust.id === adaptorValues.owner_partner_id)[0];
    if (customer) {
      adaptorValues.owner_tenant_id = customer.partner_tenant_id;
    } else {
      adaptorValues.owner_tenant_id = null;
      adaptorValues.owner_partner_id = null;
    }
    adaptorValues.flow_ids = adaptorValues.flow_ids ? adaptorValues.flow_ids.filter(flw => flw).join(',') : null;
    if (adaptorValues.delimiter && this.props.adaptor.csv_option) {
      const option = JSON.parse(this.props.adaptor.csv_option);
      option.delimiter = adaptorValues.delimiter;
      adaptorValues.csv_option = JSON.stringify(option);
    }
    this.props.updateAdaptor(this.props.adaptor.code, adaptorValues).then((result) => {
      if (result.error) {
        message.error(result.error.message);
      } else {
        message.success('保存成功');
      }
    });
  }
  handleColDefaultChange = (colDefault, field, value) => {
    this.props.updateColumnDefault(colDefault && colDefault.id, {
      field, default: value,
    }, this.props.adaptor.code).then((result) => {
      if (!result.error) {
        const colDefaults = [...this.state.columnDefaults];
        if (colDefault) {
          const existColDef = colDefaults.filter(cldef => cldef.id === colDefault.id)[0];
          existColDef.default = value;
        } else {
          colDefaults.push({
            id: result.data.id,
            field,
            default: value,
          });
        }
        this.setState({ columnDefaults: colDefaults });
      }
    });
  }
  handleIndexingChange = (columnId, indexing, dataIndex) => {
    this.props.updateColumnField(columnId, { indexing: indexing || null })
      .then((result) => {
        if (!result.error) {
          this.setState({
            lineData: this.state.lineData.map((line, i) => (
              i === 5 ? { ...line, [dataIndex]: indexing } : line
            )),
          });
        }
      });
  }
  handlePreviewConverted = (index) => {
    const column = this.props.adaptor.columns[index];
    if (column) {
      this.setState({ preview: this.msg('loading') });
      const converter = this.state.lineData[3][`key${index}`];
      const values = this.props.adaptor.columns.map(col => col.desc2);
      this.props.previewColumnConverter(converter, values, index)
        .then((result) => {
          if (!result.error) {
            this.setState({ preview: result.data });
          } else {
            this.setState({ preview: `${this.msg('previewFailed')}:${result.error}` });
          }
        });
    }
  }
  handlePreviewDisappear = () => {
    this.setState({ preview: '' });
  }
  render() {
    const {
      form: { getFieldDecorator }, visible, adaptor, customers, flows,
    } = this.props;
    const {
      lineData, scrollX, columnDefaults, mappingModal, preview,
    } = this.state;
    let adaptorModel;
    const modelKeys = Object.keys(LINE_FILE_ADAPTOR_MODELS);
    for (let i = 0; i < modelKeys.length; i++) {
      const model = modelKeys[i];
      if (LINE_FILE_ADAPTOR_MODELS[model].key === adaptor.biz_model) {
        adaptorModel = LINE_FILE_ADAPTOR_MODELS[model];
        break;
      }
    }
    if (!adaptorModel) {
      return null;
    }
    const mappedFieldsMap = new Map();
    if (lineData[2]) {
      Object.values(lineData[2]).forEach((ld) => {
        if (ld) {
          mappedFieldsMap.set(ld, true);
        }
      });
    }
    const fieldColumns = [{
      dataIndex: 'keyall',
      width: 100,
      fixed: 'left',
    }];
    const fieldData = [{
      key: 'field',
      keyall: '字段名称',
    }, {
      key: 'default',
      keyall: '默认值',
    }];
    let fieldsScrollX = 100;
    const availColumnFields = adaptorModel.columns.filter(col => !mappedFieldsMap.has(col.field));
    availColumnFields.forEach((defc, index) => {
      const colDefault = columnDefaults.filter(cold => cold.field === defc.field)[0];
      const dataIndex = `key${index}`;
      fieldColumns.push({
        dataIndex,
        width: 200,
        render: (value, row, rowIndex) => {
          if (rowIndex === 1) {
            return (<EditableCell
              value={value}
              cellTrigger
              onSave={defaultValue =>
                  this.handleColDefaultChange(colDefault, defc.field, defaultValue)}
            />);
          }
          return value;
        },
      });
      fieldData[0][dataIndex] = defc.label;
      fieldData[1][dataIndex] = colDefault && colDefault.default;
      fieldsScrollX += 200;
    });
    const lineColumns = [{
      dataIndex: 'keyall',
      width: 100,
      fixed: 'left',
    }];
    adaptor.columns.forEach((col, index) => {
      const dataIndex = `key${index}`;
      lineColumns.push({
        title: `列${index}`,
        dataIndex,
        width: 200,
        render: (value, row, rowIndex) => {
          const columnField = lineData[2][dataIndex];
          const converter = lineData[3][dataIndex];
          let thisFieldColumn;
          if (columnField) {
            [thisFieldColumn] = adaptorModel.columns.filter(adcol => adcol.field === columnField);
          }
          if (rowIndex === 1) {
            return converter ? (<Popover
              placement="top"
              title={this.msg('preview')}
              content={preview === null ? this.msg('ignored') : preview}
            >
              <span
                onMouseOver={() => this.handlePreviewConverted(index)}
                onMouseOut={this.handlePreviewDisappear}
                onFocus={() => this.handlePreviewConverted(index)}
                onBlur={this.handlePreviewDisappear}
              >
                {value}
              </span>
            </Popover>) : value;
          } else if (rowIndex === 2) {
            const fieldSelOptions = [...availColumnFields];
            if (value && thisFieldColumn) {
              fieldSelOptions.unshift(thisFieldColumn);
            }
            return (
              <Select
                size="small"
                showSearch
                allowClear
                style={{ width: '100%' }}
                placeholder="选择字段"
                optionFilterProp="children"
                onChange={field => this.handleFieldMap(col.id, field, dataIndex)}
                dropdownMatchSelectWidth={false}
                dropdownStyle={{ width: 360 }}
                value={value}
              >
                {fieldSelOptions.map(acol =>
                  <Option value={acol.field} key={acol.field}>{acol.field}|{acol.label}</Option>)}
              </Select>
            );
          } else if (rowIndex === 3) {
            let placeholder = `C${index}`;
            if (thisFieldColumn && thisFieldColumn.datatype === 'DATE') {
              placeholder = '#YYYYMMDD';
            }
            return (
              <EditableCell
                size="small"
                value={value}
                cellTrigger
                placeholder={placeholder}
                onSave={field => this.handleConvertMap(col.id, field, index)}
              />
            );
          } else if (rowIndex === 4) {
            return <Tooltip title="编辑映射"><Button size="small" block icon="edit" onClick={() => this.handleMappingEditBegin(col.id, value, dataIndex)} /></Tooltip>;
          } else if (rowIndex === 5) {
            return (<Select
              size="small"
              showSearch
              allowClear
              style={{ width: '100%' }}
              optionFilterProp="children"
              value={value}
              onChange={indexing => this.handleIndexingChange(col.id, indexing, dataIndex)}
            >
              {thisFieldColumn && thisFieldColumn.primary && <Option key="primary" value="primary">主键</Option>}
              {thisFieldColumn && thisFieldColumn.globalKey && <Option key="global" value="global">global主键</Option>}
            </Select>);
          }
          return value;
        },
      });
    });
    let isCsv = false;
    let csvOption;
    if (adaptor.file_format &&
      String(adaptor.file_format).toLowerCase() === 'csv' && adaptor.csv_option) {
      isCsv = true;
      csvOption = JSON.parse(adaptor.csv_option);
    }
    return (
      <FullscreenModal
        title={`${this.msg('configAdapter')}: ${adaptor.name}`}
        onClose={this.handleCancel}
        onSave={this.handleAdaptorUpdate}
        visible={visible}
      >
        <Layout>
          <Content style={{ height: this.state.contentHeight }} >
            <Card
              title="适配数据源"
              bodyStyle={{ padding: 0, paddingTop: 1 }}
              extra={[
                <Button icon="question-circle" onClick={this.toggleHelp}>{this.msg('help')}</Button>,
                <Button icon="setting" onClick={this.toggleSetting} style={{ marginLeft: 8 }}>{this.msg('settings')}</Button>,
              ]}
            >
              <Table
                bordered
                size="middle"
                dataSource={lineData}
                columns={lineColumns}
                scroll={{ x: scrollX }}
                pagination={false}
                rowKey="id"
              />
            </Card>
            <Card
              title={<span>适配数据对象: {adaptorModel.name}</span>}
              bodyStyle={{ padding: 0, paddingTop: 1 }}
            >
              <Table
                size="middle"
                showHeader={false}
                dataSource={fieldData}
                columns={fieldColumns}
                scroll={{ x: fieldsScrollX }}
                pagination={false}
              />
            </Card>
          </Content>
          <Drawer
            title="映射关系编辑"
            width={380}
            placement="right"
            onClose={this.handleMappingEditCancel}
            visible={mappingModal.visible}
          >
            <Form>
              { mappingModal.mappings.map((mapp, index) => (
                <FormItem key={String(index)}>
                  <Col span={10}><Input
                    placeholder="转换名称"
                    value={mapp.key}
                    onChange={ev => this.handleMappingInputKey(ev.target.value, index)}
                  /></Col>
                  <Col span={1}><Icon type="right" /></Col>
                  <Col span={10}><Input
                    placeholder="目标名称"
                    value={mapp.value}
                    onChange={ev => this.handleMappingInputVal(ev.target.value, index)}
                  /></Col>
                  <Col span={2} offset={1}>
                    {((mapp.key && mapp.value) || mappingModal.mappings.length > 1) &&
                    <Icon
                      type="minus-circle-o"
                      onClick={() => this.handleMappingInputRem(index)}
                    />}</Col>
                </FormItem>
                ))
                }
              <FormItem>
                <Button icon="plus" type="dashed" onClick={this.handleMappingInputAdd} block>
                  {this.msg('add')}
                </Button>
              </FormItem>
              <FormItem><Button type="primary" onClick={this.handleMappingEditOk}>{this.msg('save')}</Button></FormItem>
            </Form>
          </Drawer>
          <Drawer
            title={this.msg('setting')}
            width={380}
            placement="right"
            onClose={this.toggleSetting}
            visible={this.state.settingVisible}
          >
            <Form layout="vertical">
              <FormItem label={this.msg('adapterName')}>
                {getFieldDecorator('name', {
                          initialValue: adaptor.name,
                          rules: [{ required: true, message: this.msg('nameRequired') }],
                        })(<Input />)}
              </FormItem>
              <FormItem label={this.msg('adapterFileFormat')}>
                <Input value={adaptor.file_format} readOnly />
              </FormItem>
              {isCsv && csvOption &&
              <FormItem label={this.msg('csvDelimiter')}>
                {getFieldDecorator('delimiter', {
                          initialValue: csvOption.delimiter,
                        })(<Input />)}
              </FormItem>}
              <FormItem label={this.msg('relatedPartner')} >
                {getFieldDecorator('owner_partner_id', {
                          initialValue: adaptor.owner_partner_id,
                        })(<Select showSearch allowClear optionFilterProp="children" onChange={this.handleCustomerChange}>
                          {customers.map(cus =>
                            (<Option value={cus.id} key={cus.id}>
                              <Tag>{this.msg(cus.role)}</Tag>{[cus.partner_code, cus.name].filter(cu => cu).join(' | ')}
                            </Option>))}
                        </Select>)}
              </FormItem>
              <FormItem label={this.msg('relatedFlows')} >
                {getFieldDecorator('flow_ids', {
                          initialValue: adaptor.flow_ids ? adaptor.flow_ids.split(',') : undefined,
                        })(<Select allowClear mode="multiple" showSearch>
                          {flows.map(flow => (<Option value={String(flow.id)} key={String(flow.id)}>
                            {flow.name}</Option>))}
                        </Select>)}
              </FormItem>
              <FormItem label={this.msg('startLine')}>
                {getFieldDecorator('start_line', {
                          initialValue: adaptor.start_line,
                        })(<Input />)}
              </FormItem>
            </Form>
          </Drawer>
          <Drawer
            title={this.msg('help')}
            width={380}
            placement="right"
            onClose={this.toggleHelp}
            visible={this.state.helpVisible}
            mask={false}
          >
            <h4>过滤器</h4>
            <p>[参数1, (!)参数2] <Tag>Ci</Tag> 等于其中一个参数时不忽略, 前缀为!则等于参数时忽略行, null表示为空, !null表示非空</p>
            <h4>时间</h4>
            <p>#YYYYMMDDHHmmSS &apos;20181102&apos;转换公式 #YYYYMMDD &apos;
              2018-11-02 05:07&apos;对应#YYYY-MM-DD HH:mm</p>
            <h4>字符串连接</h4>
            <p>&$C5$_$C6$ 例如 C5: A C6: B 即 A_B</p>
            <h4>运算表达式</h4>
            <p>支持基本四则运算符 例 (<Tag>Ci</Tag> + 5)*2</p>
            <h4>截取内容</h4>
            <p>
              <li>slice(<Tag>Ci</Tag>, 5, 7) 从第6位开始截取长度为7的字符串 没有第三个参数从第6位取到末尾</li>
              <li>slice(<Tag>Ci</Tag>, |, &) 取从符号|到符号&之间的内容 没有第三个参数取从|到最后</li>
            </p>
            <h4>替换内容</h4>
            <p>
              <li>replace(<Tag>Ci</Tag>, &apos; -&apos;, &apos;V&apos;) 替换Cn内
                      &apos; -&apos;为V</li>
              <li>replace(<Tag>Ci</Tag>, &apos; |-&apos;, &apos;&apos;) 替换Cn内
                      &apos; &apos;或-为空值</li>
            </p>
          </Drawer>
        </Layout>
      </FullscreenModal>
    );
  }
}
