import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import DataTable from 'client/components/DataTable';
import RowAction from 'client/components/RowAction';
import SearchBox from 'client/components/SearchBox';
import { Tag, message, Button } from 'antd';
import { updateBlbookGoodsInvalid } from 'common/reducers/cwmBlBook';
import { formatMsg } from '../../../message.i18n';


@injectIntl
@connect(
  state => ({
    tradeItemRelGoods: state.cwmBlBook.tradeItemRelGoods,
  }),
  {
    updateBlbookGoodsInvalid,
  }
)
export default class BlbookRelatedPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    tradeItemRelGoods: PropTypes.arrayOf(PropTypes.shape({
      product_no: PropTypes.string,
      blbook_no: PropTypes.string,
      prdt_item_no: PropTypes.string,
    })),
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    selectedRowKeys: [],
  }
  handleChangeValid = (record, status) => {
    this.props.updateBlbookGoodsInvalid([record.id], status).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        message.success('修改成功');
      }
    });
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: '商品货号',
    dataIndex: 'product_no',
    width: 150,
  }, {
    title: '账册编号',
    dataIndex: 'blbook_no',
    width: 150,
  }, {
    title: '备案项号',
    dataIndex: 'prdt_item_no',
    width: 100,
  }, {
    title: '状态',
    width: 100,
    dataIndex: 'blbg_invalid',
    render(o) {
      if (o === 1) {
        return (<Tag color="#CD0000">禁用</Tag>);
      }
      return (<Tag color="#00FF00">可用</Tag>);
    },
  }, {
    dataIndex: 'SPACER_COL',
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OPS_COL',
    width: 90,
    render: (o, record) => (record.blbg_invalid === 0 ? <span>
      <RowAction onClick={() => this.handleChangeValid(record, false)} icon="pause-circle-o" tooltip={this.msg('disable')} />
    </span> : <span>
      <RowAction onClick={() => this.handleChangeValid(record, true)} icon="play-circle" tooltip={this.msg('enable')} />
    </span>
    ),
  }]
  handleRowDeselect = () => {
    this.setState({ selectedRowKeys: [] });
  }
  handleBatchChangeValid = (status) => {
    const ids = this.state.selectedRowKeys;
    this.props.updateBlbookGoodsInvalid(ids, status).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      } else {
        message.success('修改成功');
      }
    });
  }
  render() {
    const { tradeItemRelGoods } = this.props;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    };
    const bulkActions = (<span>
      <Button icon="disable" onClick={() => this.handleBatchChangeValid(false)}>批量禁用</Button>
      <Button icon="enable" onClick={() => this.handleBatchChangeValid(true)}>批量启用</Button>
    </span>);
    const toolbarActions = (<span>
      <SearchBox value={null} placeholder={this.msg('商品货号')} onSearch={this.handleSearch} />
    </span>);
    return (
      <div>
        <DataTable
          selectedRowKeys={this.state.selectedRowKeys}
          onDeselectRows={this.handleRowDeselect}
          columns={this.columns}
          dataSource={tradeItemRelGoods}
          rowSelection={rowSelection}
          rowKey="id"
          toolbarActions={toolbarActions}
          bulkActions={bulkActions}
        />
      </div>
    );
  }
}
