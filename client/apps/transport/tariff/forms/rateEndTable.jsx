import React from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { connect } from 'react-redux';
import { Form, Modal, Input, message } from 'antd';
import DataTable from 'client/components/DataTable';
import RegionCascader from 'client/components/RegionCascader';
import {
  submitRateEnd, updateRateEnd, delRateEnd,
  loadRateEnds,
} from 'common/reducers/transportTariff';
import RowAction from 'client/components/RowAction';
import { getEndTableVarColumns, renderRegion } from './commodity';

const FormItem = Form.Item;
@connect(
  state => ({
    rateId: state.transportTariff.rateId,
    loading: state.transportTariff.ratesEndLoading,
    ratesEndList: state.transportTariff.ratesEndList,
    agreementRef: state.transportTariff.ratesRefAgreement,
    transModes: state.transportTariff.formParams.transModes,
    vehicleTypeParams: state.transportTariff.formParams.vehicleTypeParams,
    vehicleLengthParams: state.transportTariff.formParams.vehicleLengthParams,
  }),
  {
    submitRateEnd, updateRateEnd, delRateEnd, loadRateEnds,
  }
)
@Form.create()
export default class RateEndTable extends React.Component {
  static propTypes = {
    visibleModal: PropTypes.bool.isRequired,
    rateId: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    transModes: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      mode_code: PropTypes.string.isRequired,
      mode_name: PropTypes.string.isRequired,
    })),
    vehicleTypeParams: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
    })),
    vehicleLengthParams: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
    })),
    onChangeVisible: PropTypes.func.isRequired,
    submitRateEnd: PropTypes.func.isRequired,
    updateRateEnd: PropTypes.func.isRequired,
    delRateEnd: PropTypes.func.isRequired,
    loadRateEnds: PropTypes.func.isRequired,
    type: PropTypes.oneOf(['create', 'edit', 'view']),
    toolbarActions: PropTypes.node,
  }
  state = {
    selectedRowKeys: [],
    editEnd: { id: null, gradients: [] },
    editRegionCode: '',
    editRegion: [],
  }
  dataSource = new DataTable.DataSource({
    fetcher: params => this.props.loadRateEnds(params),
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
        rateId: this.props.rateId,
        pageSize: pagination.pageSize,
        current: pagination.current,
        searchValue: this.props.ratesEndList.searchValue,
      };
      return params;
    },
    remotes: this.props.tarifflist,
  })
  columns = [{
    title: '目的地',
    dataIndex: 'end',
    width: 150,
    render: (o, record) => renderRegion(record.end),
  }, {
    title: '目的地别名',
    width: 80,
    dataIndex: 'end.name',
  }, {
    title: '运输时间',
    width: 60,
    dataIndex: 'time',
  }]
  loadEnds = current => this.props.loadRateEnds({
    rateId: this.props.rateId,
    pageSize: this.props.ratesEndList.pageSize,
    current: current || this.props.ratesEndList.current,
    searchValue: this.props.ratesEndList.searchValue,
  })
  handleRegionChange = (region) => {
    const [code, province, city, district, street] = region;
    this.setState({
      editRegionCode: code,
      editRegion: [province, city, district, street],
    });
  }
  handleGradientChange = (idx, value) => {
    const state = update(this.state, {
      editEnd: { gradients: { [idx]: { $set: Number(value) } } },
    });
    this.setState(state);
  }
  handleSave = () => {
    if (this.state.editRegionCode) {
      this.props.form.validateFields((errors) => {
        if (errors) {
          message.error('表单错误');
        } else {
          let prom;
          const formValues = this.props.form.getFieldsValue();
          if (this.state.editEnd.id) {
            prom = this.props.updateRateEnd({
              rateId: this.props.rateId,
              id: this.state.editEnd.id,
              regionCode: this.state.editRegionCode,
              region: this.state.editRegion,
              km: formValues.km,
              time: formValues.time,
              flare: formValues.flare,
              gradients: this.state.editEnd.gradients,
              name: formValues.name,
            });
          } else {
            prom = this.props.submitRateEnd({
              rateId: this.props.rateId,
              regionCode: this.state.editRegionCode,
              region: this.state.editRegion,
              km: formValues.km,
              time: formValues.time,
              flare: formValues.flare,
              gradients: this.state.editEnd.gradients,
              name: formValues.name,
            });
          }
          prom.then((result) => {
            if (result.error) {
              message.error(result.error.message, 10);
            } else {
              message.success('保存成功');
              this.props.onChangeVisible('end', false);
              this.setState({
                editEnd: {
                  id: null,
                  gradients: [],
                  time: '',
                  km: '',
                  flare: '',
                },
                editRegionCode: '',
                editRegion: [],
              });
              this.props.form.resetFields();
              this.loadEnds().then((leres) => {
                if (leres.error) {
                  message.error(leres.error.message);
                }
              });
            }
          });
        }
      });
    } else {
      message.error('目的地未选择');
    }
  }
  handleCancel = () => {
    this.props.onChangeVisible('end', false);
    this.setState({
      editEnd: {
        id: null,
        gradients: [],
        time: '',
        km: '',
        flare: '',
      },
      editRegionCode: '',
      editRegion: [],
    });
    this.props.form.resetFields();
  }
  handleEdit = (row) => {
    const {
      code, province, city, district, street,
    } = row.end;
    this.setState({
      editEnd: {
        id: row._id,
        gradients: row.gradients,
        time: row.time,
        km: row.km,
        flare: row.flare,
        name: row.end.name,
      },
      editRegionCode: code,
      editRegion: [province, city, district, street],
    });
    this.props.onChangeVisible('end', true);
  }
  handleDel = (row) => {
    this.props.delRateEnd(this.props.rateId, row._id).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        let { current } = this.props.ratesEndList;
        if (current > 1 &&
            this.props.ratesEndList.pageSize * (current - 1)
            === this.props.ratesEndList.totalCount - 1) {
          current -= 1;
        }
        this.loadEnds(current);
      }
    });
  }
  render() {
    const {
      ratesEndList, loading, visibleModal, form: { getFieldDecorator },
      agreementRef, transModes, vehicleTypeParams, vehicleLengthParams, type, toolbarActions,
    } = this.props;
    const { editEnd, editRegion } = this.state;
    this.dataSource.remotes = ratesEndList;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    const columns = [...this.columns];
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    if (agreementRef.meter) {
      if (agreementRef.meter === 't*km') {
        columns.push({
          title: '公里数',
          dataIndex: 'km',
          width: 80,
        });
      }
      columns.push({
        title: '起步价',
        dataIndex: 'flare',
        width: 80,
      });
    }
    const varColumns = getEndTableVarColumns(
      agreementRef,
      transModes,
      vehicleTypeParams,
      vehicleLengthParams
    );
    varColumns.forEach((vc) => {
      columns.push({
        title: vc.title,
        width: 80,
        render: (o, record) => record.gradients[vc.index],
      });
    });
    columns.push({
      dataIndex: 'SPACER_COL',
    });
    if (type === 'create' || type === 'edit') {
      columns.push({
        title: '操作',
        width: 80,
        fixed: 'right',
        dataIndex: 'OPS_COL',
        className: 'table-col-ops',
        render: (o, record) => (
          <span>
            <RowAction onClick={this.handleEdit} icon="edit" tooltip="编辑" row={record} />
            <RowAction danger confirm="确认删除?" onConfirm={this.handleDel} icon="delete" tooltip="删除" row={record} />
          </span>),
      });
    }
    return (
      <div>
        <DataTable
          toolbarActions={toolbarActions}
          rowSelection={rowSelection}
          columns={columns}
          loading={loading}
          dataSource={this.dataSource}
          scrollOffset={374}
          rowKey="_id"
        />
        <Modal
          title="目的地"
          maskClosable={false}
          visible={visibleModal}
          onOk={this.handleSave}
          onCancel={this.handleCancel}
        >
          <Form layout="horizontal">
            <FormItem label="目的地" {...formItemLayout}>
              <RegionCascader defaultRegion={editRegion} onChange={this.handleRegionChange} />
            </FormItem>
            <FormItem label="目的地别名" {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: editEnd.name,
                rules: [{ type: 'string' }],
              })(<Input />)}
            </FormItem>
            <FormItem label="运输时间" {...formItemLayout}>
              {getFieldDecorator('time', {
                initialValue: editEnd.time,
              })(<Input />)}
            </FormItem>
            {
              agreementRef.meter === 't*km' &&
              <FormItem label="公里数" {...formItemLayout}>
                {getFieldDecorator('km', {
                  initialValue: editEnd.km,
                  rules: [{
                    required: true,
                    type: 'number',
                    message: '公里数必填',
                    transform: v => Number(v),
                  }],
                })(<Input />)}
              </FormItem>
            }
            {
              agreementRef.meter &&
              <FormItem label="起步价" {...formItemLayout}>
                {getFieldDecorator('flare', {
                  initialValue: editEnd.flare,
                  rules: [{
                    required: true,
                    type: 'number',
                    message: '起步价必填',
                    transform: v => Number(v),
                  }],
                })(<Input />)}
              </FormItem>
            }
            {
              varColumns.map((vc, idx) => (
                <FormItem
                  key={vc.title}
                  label={vc.title}
                  {...formItemLayout}
                >
                  {getFieldDecorator(`gradient${idx}`, {
                    initialValue: editEnd.gradients[vc.index] || '',
                    onChange: ev => this.handleGradientChange(idx, ev.target.value),
                    rules: [{
                      required: true,
                      message: '梯度费率必填',
                      type: 'number',
                      transform: v => Number(v),
                    }],
                  })(<Input />)}
                </FormItem>
              ))
            }
          </Form>
        </Modal>
      </div>
    );
  }
}
