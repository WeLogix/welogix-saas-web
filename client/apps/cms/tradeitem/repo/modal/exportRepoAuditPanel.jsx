import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FileSaver from 'file-saver';
import { Button, DatePicker, Drawer, Form, Select, Steps, Col, notification } from 'antd';
import { injectIntl } from 'react-intl';
import { toggleRepoAuditPanel, exportRepoAudit } from 'common/reducers/cmsTradeitem';
import { formatMsg } from '../../message.i18n';

const { Option } = Select;
const { Step } = Steps;

@injectIntl
@connect(
  state => ({
    repos: state.cmsTradeitem.repos,
    exportAuditPanelVisible: state.cmsTradeitem.exportAuditPanelVisible,
    exporting: state.cmsTradeitem.submitting,
  }),
  {
    toggleRepoAuditPanel,
    exportRepoAudit,
  }
)

@Form.create()
export default class ExportRepoAuditPanel extends React.Component {
  static propTypes = {
    exportAuditPanelVisible: PropTypes.bool.isRequired,
  }
  msg = formatMsg(this.props.intl)
  handleStartDateChange = (value) => {
    if (value) {
      const endDate = value.clone();
      endDate.date(value.date() + 6);
      this.props.form.setFieldsValue({ end_date: endDate });
    }
  }
  handleEndDateChange = (value) => {
    if (value) {
      const startDate = value.clone();
      startDate.date(value.date() - 6);
      this.props.form.setFieldsValue({ start_date: startDate });
    }
  }
  handleReposChange = (repoIds) => {
    const prevValue = this.props.form.getFieldValue('repo_ids') || [];
    const prevExist = prevValue.indexOf('all') !== -1;
    const currExist = repoIds.indexOf('all') !== -1;
    if (prevExist && currExist) {
      return repoIds.filter(f => f !== 'all');
    } else if (!prevExist && currExist) {
      return ['all'];
    }
    return repoIds;
  }
  // handleReposNormalize = (value, prevValue = []) => {
  //   if (value.sort().toString() !== prevValue.sort().toString()) {
  //     const prevExist = prevValue.indexOf(0) !== -1;
  //     const currExist = value.indexOf(0) !== -1;
  //     if (prevExist && currExist) {
  //       return value.filter(f => f !== 0);
  //     } else if (!prevExist && currExist) {
  //       return [0];
  //     }
  //     return value;
  //   }
  //   return value;
  // }
  handleExport = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        const startDate = values.start_date.format('YYYY/MM/DD');
        const endDate = values.end_date.format('YYYY/MM/DD');
        const repoIds = values.repo_ids[0] === 'all' ?
          this.props.repos.map(f => f.id).join(',') : values.repo_ids.join(',');
        this.props.exportRepoAudit(startDate, endDate, repoIds).then((result) => {
          if (!result.error) {
            const timeQuantum = `${values.start_date.format('YYYYMMDD')}${values.end_date.format('YYYYMMDD')}`;
            FileSaver.saveAs(
              new window.Blob([Buffer.from(result.data)], { type: 'application/octet-stream' }),
              `归类库已审核数据_${timeQuantum}.xlsx`,
            );
            this.handleClose();
          } else {
            notification.error({
              message: '导出失败',
              description: result.error.message,
            });
          }
        });
      }
    });
  }
  handleClose = () => {
    this.props.toggleRepoAuditPanel(false);
  }
  render() {
    const {
      form: { getFieldDecorator }, exporting, repos, exportAuditPanelVisible,
    } = this.props;
    return (
      <Drawer
        title={this.msg('exportRepoAudit')}
        width={460}
        visible={exportAuditPanelVisible}
        onClose={this.handleClose}
      >
        <Steps direction="vertical" size="small">
          <Step
            title={this.msg('exportOptions')}
            status="wait"
            description={
              <Form layout="vertical">
                <Form.Item label={this.msg('selectRepos')}>
                  {getFieldDecorator('repo_ids', {
                        // initialValue: ['all'],
                    rules: [{ required: true, message: '请选择归类库' }],
                        // normalize: this.handleReposNormalize,
                    getValueFromEvent: this.handleReposChange,
                  })(<Select
                    showSearch
                    mode="multiple"
                    allowClear
                    dropdownMatchSelectWidth={false}
                    dropdownStyle={{ width: 360 }}
                    style={{ width: '100%' }}
                  >
                    {/*
                        <Option value="all" key="all">全部</Option>
                      */}
                    {repos.map(rep => (<Option value={String(rep.id)} key={rep.owner_name}>
                      {[rep.owner_code, rep.owner_name].filter(f => f).join('|')}
                    </Option>))}
                  </Select>)}
                </Form.Item>
                <Form.Item label={this.msg('timeQuantum')}>
                  <Col span={12}>
                    <Form.Item>
                      {getFieldDecorator('start_date', {
                        rules: [{ required: true, message: '请选择起始时间' }],
                      })(<DatePicker placeholder="起始时间" format="YYYY/MM/DD" onChange={this.handleStartDateChange} />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item>
                      {getFieldDecorator('end_date', {
                        rules: [{ required: true, message: '请选择截至时间' }],
                      })(<DatePicker placeholder="截至时间" format="YYYY/MM/DD" onChange={this.handleEndDateChange} />)}
                    </Form.Item>
                  </Col>
                </Form.Item>

              </Form>
            }
          />
          <Step
            title=""
            status="wait"
            description={
              <Button type="primary" onClick={this.handleExport} loading={exporting}>
                {this.msg('export')}
              </Button>}
          />
        </Steps>
      </Drawer>
    );
  }
}
