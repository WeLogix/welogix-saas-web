import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import DataTable from 'client/components/DataTable';
import { loadDelgManifestList } from 'common/reducers/cmsDelegationDock';
import { formatMsg } from '../message.i18n';

@injectIntl
@connect(state => ({
  manifestBodyList: state.cmsDelegationDock.manifestBodyList,
  delgNo: state.cmsDelegationDock.previewKey,
  dockVisible: state.sofOrders.dock.visible,
  currencies: state.saasParams.latest.currency,
  countries: state.saasParams.latest.country,
}), { loadDelgManifestList })
export default class CustomsManifestPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    delgNo: PropTypes.string.isRequired,
  }
  componentDidMount() {
    this.props.loadDelgManifestList({
      delgNo: this.props.delgNo,
      pageSize: this.props.manifestBodyList.pageSize,
      current: this.props.manifestBodyList.current,
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.dockVisible && !this.props.dockVisible) {
      nextProps.loadDelgManifestList({
        delgNo: nextProps.delgNo,
        pageSize: nextProps.manifestBodyList.pageSize,
        current: nextProps.manifestBodyList.current,
      });
    }
  }
  msg = formatMsg(this.props.intl)
  productColumns = [{
    title: '商品货号',
    width: 150,
    dataIndex: 'cop_g_no',
  }, {
    title: '商品编号',
    dataIndex: 'hscode',
    width: 160,
  }, {
    title: '名称',
    dataIndex: 'g_name',
    width: 160,
  }, {
    title: '规格型号',
    width: 120,
    dataIndex: 'g_model',
  }, {
    title: '数量',
    width: 140,
    dataIndex: 'g_qty',
  }, {
    title: '单价',
    width: 140,
    dataIndex: 'dec_price',
  }, {
    title: '金额',
    width: 140,
    dataIndex: 'trade_total',
  }, {
    title: '净重',
    width: 140,
    dataIndex: 'wet_wt',
  }, {
    title: '原产国',
    width: 180,
    dataIndex: 'orig_country',
    render: (o) => {
      const ori = this.props.countries.find(oc => oc.cntry_co === o);
      if (ori) {
        return `${ori.cntry_co}|${ori.cntry_name_cn}`;
      }
      return '';
    },
  }, {
    title: '币制',
    width: 140,
    dataIndex: 'trade_curr',
    render: (o) => {
      const trade = this.props.currencies.find(tr => tr.curr_code === o);
      if (trade) {
        return `${trade.curr_code}|${trade.curr_name}`;
      }
      return '';
    },
  }]
  dataSource = new DataTable.DataSource({
    fetcher: params => this.props.loadDelgManifestList(params),
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
        delgNo: this.props.delgNo,
        pageSize: pagination.pageSize,
        current: pagination.current,
      };
      return params;
    },
    remotes: this.props.manifestBodyList,
  })

  render() {
    const { manifestBodyList } = this.props;
    this.dataSource.remotes = manifestBodyList;
    return (
      <div className="pane-content tab-pane">
        <DataTable
          columns={this.productColumns}
          dataSource={this.dataSource}
          rowKey="id"
          showToolbar={false}
          scrollOffset={360}
        />
      </div>
    );
  }
}
