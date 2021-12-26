import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { loadShftzRelease } from 'common/reducers/cwmShippingOrder';
import DataTable from 'client/components/DataTable';
import { formatMsg } from '../message.i18n';


@injectIntl
@connect(
  state => ({
    order: state.sofOrders.dock.order,
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
  }),
  { loadShftzRelease }
)
export default class FTZPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    soNo: PropTypes.string.isRequired,
  }
  state = {
    data: [],
  }
  componentWillMount() {
    this.props.loadShftzRelease(this.props.soNo).then((result) => {
      if (!result.error) {
        this.setState({
          data: result.data,
        });
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.soNo !== this.props.soNo) {
      this.props.loadShftzRelease(nextProps.soNo).then((result) => {
        if (!result.error) {
          this.setState({
            data: result.data,
          });
        }
      });
    }
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: '备案料号',
    dataIndex: 'ftz_cargo_no',
    width: 150,
  }, {
    title: '商品货号',
    dataIndex: 'product_no',
    width: 120,
  }, {
    title: '商品编号',
    dataIndex: 'hscode',
    width: 150,
  }, {
    title: '中文品名',
    dataIndex: 'g_name',
    width: 150,
  }, {
    title: '规格型号',
    dataIndex: 'model',
    width: 200,
  }, {
    title: '单位',
    dataIndex: 'out_unit',
    width: 80,
    render: (o) => {
      const unit = this.props.unit.filter(cur => cur.value === o)[0];
      const text = unit ? `${unit.value}| ${unit.text}` : o;
      return text;
    },
  }, {
    title: '数量',
    dataIndex: 'qty',
    render: o => (<b>{o}</b>),
    width: 80,
  }, {
    title: '毛重',
    dataIndex: 'gross_wt',
    width: 80,
  }, {
    title: '净重',
    dataIndex: 'net_wt',
    width: 80,
  }, {
    title: '金额',
    dataIndex: 'amount',
    width: 80,
  }, {
    title: '币制',
    dataIndex: 'currency',
    width: 150,
    render: (o) => {
      const currency = this.props.currency.filter(cur => cur.value === o)[0];
      const text = currency ? `${currency.value}| ${currency.text}` : o;
      return text;
    },
  }, {
    title: '原产国',
    dataIndex: 'country',
    width: 150,
    render: (o) => {
      const country = this.props.country.filter(cur => cur.value === o)[0];
      const text = country ? `${country.value}| ${country.text}` : o;
      return text;
    },
  }]
  render() {
    const rowKey = 'id';
    return (
      <div className="pane-content tab-pane">
        <DataTable
          columns={this.columns}
          dataSource={this.state.data}
          showToolbar={false}
          scrollOffset={360}
          pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
          showTotal: total => `共 ${total} 条`,
        }}
          rowKey={rowKey}
        />
      </div>
    );
  }
}
