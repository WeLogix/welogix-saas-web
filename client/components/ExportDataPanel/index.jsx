import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FileSaver from 'file-saver';
import XLSX from 'xlsx';
import { string2Bytes } from 'client/util/dataTransform';
import { Button, Drawer, DatePicker, Form, Radio, Select, Steps, Tooltip, message } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { LINE_FILE_ADAPTOR_MODELS } from 'common/constants';
import { loadBizExportTemplatesByBizObject, exportSaasBizFile, toggleExportPanel } from 'common/reducers/hubDataAdapter';
import { formatMsg } from './message.i18n';
import './style.less';

const impModels = Object.values(LINE_FILE_ADAPTOR_MODELS);
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Step } = Steps;

@injectIntl
@connect(
  state => ({
    visible: state.hubDataAdapter.visible,
    exporting: state.hubDataAdapter.exporting,
    saasExportAdapter: state.hubDataAdapter.saasExportAdapter,
  }),
  {
    exportSaasBizFile,
    toggleExportPanel,
    loadBizExportTemplatesByBizObject,
  }
)
export default class ExportDataPanel extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
    title: PropTypes.string,
    type: PropTypes.string.isRequired,
    formData: PropTypes.PropTypes.shape({
    }),
  }
  state = {
    format: 'xlsx',
    exportType: 'listFilter',
    startDate: null,
    endDate: null,
    selectedThead: [],
    selectedTbody: [],
  }
  componentDidMount() {
    this.props.loadBizExportTemplatesByBizObject(this.props.type);
  }
  handlePeriodChange = (data, dataString) => {
    this.setState({
      startDate: dataString[0],
      endDate: dataString[1],
    });
  }
  handleFormatChange = (ev) => {
    this.setState({
      format: ev.target.value,
    });
  }
  handleExportTypeChange = (e) => {
    const updateData = { exportType: e.target.value };
    if (e.target.value !== 'period') {
      updateData.startDate = null;
      updateData.endDate = null;
    }
    this.setState(updateData);
  }
  handleClose = () => {
    this.setState({
      exportType: 'listFilter',
      startDate: null,
      endDate: null,
    });
    this.props.toggleExportPanel(false);
  }
  msg = formatMsg(this.props.intl)
  handleHeaderSelect = (value) => {
    this.setState({
      selectedThead: value,
    });
  }
  handleTbodySelect = (value) => {
    this.setState({
      selectedTbody: value,
    });
  }
  handleExport = () => {
    const { type, formData } = this.props;
    const {
      selectedThead, selectedTbody, startDate, endDate, exportType, format,
    } = this.state;
    if (selectedThead.length === 0 && selectedTbody.length === 0) {
      message.warning(this.msg('pleaseSelectFields'));
      return;
    }
    if (type === 'CMS_TRADEITEM' && selectedTbody.indexOf('id') === -1) {
      selectedTbody.push('id');
    }
    const exportFormData = { ...formData };
    if (exportType !== 'listFilter') {
      delete exportFormData.filters;
    }
    if (exportType === 'period') {
      exportFormData.dateFilter = { startDate, endDate };
    }
    this.props.exportSaasBizFile({
      type,
      thead: selectedThead,
      tbody: selectedTbody,
      formData: exportFormData,
    }).then((result) => {
      if (!result.error) {
        const fields = selectedThead.concat(selectedTbody);
        let columns = [...impModels.find(model => model.key === type).columns];
        const filename = impModels.find(model => model.key === type).exportName;
        if (type === 'CMS_TRADEITEM' && selectedTbody.indexOf('id') === -1) {
          columns = columns.concat([{ field: 'id', label: 'itemId', tbody: true }]);
        }
        const labelMap = {};
        columns.forEach((column) => {
          if (column.exportField) {
            labelMap[column.exportField] = column.exportLabel;
          } else {
            labelMap[column.field] = column.label;
          }
        });
        if (format === 'xlsx') {
          const wb = { SheetNames: [], Sheets: {}, Props: {} };
          for (let i = 0; i < result.data.length; i++) {
            const { sheetName } = result.data[i];
            const items = result.data[i].data;
            const excelData = [];
            items.forEach((dv) => {
              const item = {};
              for (let j = 0; j < fields.length; j++) {
                const field = fields[j];
                item[labelMap[field]] = dv[j];
              }
              excelData.push(item);
            });
            wb.SheetNames.push(`${sheetName}`);
            wb.Sheets[`${sheetName}`] = XLSX.utils.json_to_sheet(excelData);
          }
          const wopts = { bookType: 'xlsx', bookSST: false, type: 'binary' };
          FileSaver.saveAs(
            new window.Blob([string2Bytes(XLSX.write(wb, wopts))], { type: 'application/octet-stream' }),
            `${filename}${moment().format('YYMMDDHHmm')}.xlsx`
          );
        } else {
          const data = [];
          for (let i = 0; i < result.data.length; i++) {
            const { sheetName } = result.data[i];
            const items = result.data[i].data;
            let csvData = '';
            csvData += `${sheetName}\n`;
            fields.forEach((field, index) => {
              if (index === fields.length - 1) {
                csvData += `${labelMap[field]}\r\n`;
              } else {
                csvData += `${labelMap[field]},`;
              }
            });
            items.forEach((item) => {
              csvData += `${Object.values(item).join(',')}\n`;
            });
            data.push(csvData);
          }
          FileSaver.saveAs(
            new window.Blob(data, { type: 'text/plain;charset=utf-8' }),
            `${filename}${moment().format('YYMMDDHHmm')}.csv`
          );
        }
      }
    });
  }
  handleTemplateSelect = (key) => {
    const template = this.props.saasExportAdapter.find(tem => tem.id === key);
    const selectedThead = template.head_fields ? template.head_fields.split(',') : [];
    const selectedTbody = template.body_fields ? template.body_fields.split(',') : [];
    this.setState({
      selectedThead,
      selectedTbody,
    });
  }
  render() {
    const {
      visible, title, type, exporting, saasExportAdapter, exportTypeOpt,
    } = this.props;
    const {
      startDate, endDate, exportType,
    } = this.state;
    const { columns } = impModels.find(model => model.key === type);
    const thead = columns.filter(column => column.thead);
    const tbody = columns.filter(column => column.tbody);
    let rangerValue = [];
    if (startDate && endDate) {
      rangerValue = [moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')];
    }
    let periodDateMsg = this.msg('specificPeriod');
    let listFilterRadioMsg = this.msg('pageListFilter');
    let disableListFilter = false;
    if (exportTypeOpt) {
      if (exportTypeOpt.use_modify_date) {
        periodDateMsg = this.msg('specificModifyRange');
      }
      if (exportTypeOpt.filter_disabled_reason) {
        disableListFilter = true;
        listFilterRadioMsg = (<Tooltip title={exportTypeOpt.filter_disabled_reason}>
          {listFilterRadioMsg}</Tooltip>);
      }
    }
    return (
      <Drawer
        title={title || this.msg('export')}
        width={460}
        visible={visible}
        onClose={this.handleClose}
        className="welo-export-data-panel"
      ><Form layout="vertical">
        <Steps direction="vertical" size="small">
          <Step
            title={this.msg('exportOptions')}
            status="wait"
            description={
              <div>
                <Form.Item>
                  <Radio.Group onChange={this.handleExportTypeChange} value={exportType}>
                    {/* <Radio value="all">{this.msg('allData')}</Radio> */}
                    <Radio value="period">{periodDateMsg}</Radio>
                    <Radio value="listFilter" disabled={disableListFilter}>{listFilterRadioMsg}</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item>
                  <RangePicker format="YYYY/MM/DD" value={rangerValue} onChange={this.handlePeriodChange} disabled={exportType !== 'period'} />
                </Form.Item>
                {this.props.children &&
                <Form.Item>
                  {this.props.children}
                </Form.Item>}
                <Form.Item label={this.msg('pleaseSelectexportTemplate')}>
                  <Select
                    allowClear
                    onChange={this.handleTemplateSelect}
                  >
                    {saasExportAdapter.map(template =>
                        (<Option
                          value={template.id}
                          key={template.id}
                        >
                          {template.name}
                        </Option>))}
                  </Select>
                </Form.Item>
                <Form.Item label={this.msg('headerFields')}>
                  <Select
                    allowClear
                    mode="multiple"
                    onChange={this.handleHeaderSelect}
                    value={this.state.selectedThead}
                    maxTagCount={5}
                  >
                    {thead.map(opt =>
                      (<Option
                        value={opt.exportField || opt.field}
                        key={opt.exportField || opt.field}
                      >
                        {opt.exportLabel || opt.label}
                      </Option>))}
                  </Select>
                </Form.Item>
                <Form.Item label={this.msg('bodyFields')}>
                  <Select
                    allowClear
                    mode="multiple"
                    onChange={this.handleTbodySelect}
                    value={this.state.selectedTbody}
                    maxTagCount={5}
                  >
                    {tbody.map(opt =>
                      (<Option
                        value={opt.exportField || opt.field}
                        key={opt.exportField || opt.field}
                      >
                        {opt.exportLabel || opt.label}
                      </Option>))}
                  </Select>
                </Form.Item>
                <Form.Item label={this.msg('exportFormat')}>
                  <Radio.Group onChange={this.handleFormatChange} value={this.state.format}>
                    <Radio value="csv">CSV (Comma Separated Value)</Radio>
                    <Radio value="xlsx">XLSX (Microsoft Excel)</Radio>
                  </Radio.Group>
                </Form.Item>
              </div>
            }
          />
          <Step
            title=""
            status="wait"
            description={<Button type="primary" onClick={this.handleExport} loading={exporting}>{this.msg('export')}</Button>}
          />
        </Steps>
      </Form>
      </Drawer>
    );
  }
}
