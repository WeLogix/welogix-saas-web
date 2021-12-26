import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { Table, Tag, Select } from 'antd';
import { CMS_DECL_CHANNEL, CMS_DECL_TYPE } from 'common/constants';
import { formatMsg } from '../message.i18n';

const { Option } = Select;

function ColumnSelect(props) {
  const {
    record, field, options, onChange, index,
  } = props;
  function handleChange(value) {
    if (onChange) {
      onChange(record, index, field, value);
    }
  }
  return (
    <Select showArrow optionFilterProp="search" value={record[field] || ''} onChange={handleChange} style={{ width: '100%' }}>
      {
        options.map(opt => <Option value={opt.value} key={`${opt.value}`}>{`${opt.text}`}</Option>)
      }
    </Select>
  );
}
ColumnSelect.propTypes = {
  record: PropTypes.shape({ id: PropTypes.number }).isRequired,
  index: PropTypes.number,
  field: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    value: PropTypes.string,
    key: PropTypes.string,
  })).isRequired,
};

@injectIntl
export default class Expander extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    custkey: PropTypes.string.isRequired,
    subData: PropTypes.arrayOf().isRequired,
    onDeclChange: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      dataSource: props.subData,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.subData !== this.props.subData) {
      this.setState({ dataSource: nextProps.subData });
    }
  }
  handleEditChange = (record, index, field, value) => {
    const { dataSource } = this.state;
    dataSource[index][field] = value;
    this.props.onDeclChange({ custname: this.props.custkey, changeData: dataSource });
    this.setState({ dataSource });
  }
  msg = formatMsg(this.props.intl)
  render() {
    const { declChannel, easipassOpts, swclientOpts } = this.props;
    const { dataSource } = this.state;
    let columns = [{
      title: '统一编号',
      dataIndex: 'pre_entry_seq_no',
    }, {
      title: '类型',
      dataIndex: 'sheet_type',
      width: 100,
      render: (o, record) => {
        if (record.i_e_type === 0) {
          if (o === 'CDF') {
            return <Tag color="blue">进口报关单</Tag>;
          } else if (o === 'FTZ') {
            return <Tag color="blue">进境备案清单</Tag>;
          }
        } else if (record.i_e_type === 1) {
          if (o === 'CDF') {
            return <Tag color="cyan">出口报关单</Tag>;
          } else if (o === 'FTZ') {
            return <Tag color="cyan">出境备案清单</Tag>;
          }
        }
        return null;
      },
      /*   }, {
      title: this.msg('trafMode'),
      dataIndex: 'traf_mode',
      width: 100, */
    }];
    if (declChannel === CMS_DECL_CHANNEL.EP.value) {
      columns = columns.concat({
        title: this.msg('declType'),
        width: 200,
        render: (o, record, index) => {
          let declList = [];
          if (record.i_e_type === 0) {
            declList = CMS_DECL_TYPE.filter(dl => dl.ietype === 'i');
          } else if (record.i_e_type === 1) {
            declList = CMS_DECL_TYPE.filter(dl => dl.ietype === 'e');
          }
          return (<ColumnSelect
            field="declType"
            onChange={this.handleEditChange}
            options={declList}
            record={record}
            index={index}
          />);
        },
      }, {
        title: this.msg('epClientList'),
        width: 190,
        render: (o, record, index) => (
          <ColumnSelect
            field="chanclient"
            onChange={this.handleEditChange}
            options={easipassOpts}
            record={record}
            index={index}
          />),
      });
    } else {
      columns = columns.concat({
        title: this.msg('swClientList'),
        width: 200,
        render: (o, record, index) => (<ColumnSelect
          field="chanclient"
          onChange={this.handleEditChange}
          options={swclientOpts}
          record={record}
          index={index}
        />),
      });
    }
    return (
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        style={{ marginRight: 0 }}
      />
    );
  }
}
