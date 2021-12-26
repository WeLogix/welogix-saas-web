import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { toggleOrderTypeModal, loadOrderTypes, removeOrderType } from 'common/reducers/sofOrderPref';
import connectNav from 'client/common/decorators/connect-nav';
import PageHeader from 'client/components/PageHeader';
import DataTable from 'client/components/DataTable';
import SearchBox from 'client/components/SearchBox';
import PaaSMenu from '../../menu';
import { formatMsg } from '../message.i18n';

const { Content } = Layout;
const formParamKey = {
  customs: {
    value: 'customs_code',
    text: 'customs_name',
    textTitle: 'customName',
  },
  tradeMode: {
    value: 'trade_mode',
    text: 'trade_abbr',
  },
  exemptionWay: {
    value: 'value',
    text: 'text',
  },
  certMark: {
    value: 'cert_code',
    text: 'cert_spec',
  },
  country: {
    value: 'cntry_co',
    text: 'cntry_name_cn',
  },
  currency: {
    value: 'curr_code',
    text: 'curr_name',
  },
  port: {
    value: 'port_code',
    text: 'port_c_cod',
  },
  district: {
    value: 'district_code',
    text: 'district_name',
  },
  wrapType: {
    value: 'value',
    text: 'text',
  },
};
@injectIntl
@connect(
  state => ({
    saasParams: state.saasParams.latest,
    orderTypeList: state.sofOrderPref.orderTypeList,
    visible: state.sofOrderPref.orderTypeModal.visible,
    modalOrderType: state.sofOrderPref.orderTypeModal.orderType,
    reload: state.sofOrderPref.typeListReload,
  }),
  { toggleOrderTypeModal, loadOrderTypes, removeOrderType }
)
@connectNav({
  depth: 2,
  moduleName: 'scof',
})
export default class CustomsParams extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    tabkey: 'customs',
    searchValue: '',
  }
  componentDidMount() {
    const { orderTypeList } = this.props;
    this.props.loadOrderTypes({
      pageSize: orderTypeList.pageSize,
      current: orderTypeList.current,
    });
  }

  msg = formatMsg(this.props.intl)
  handlePageLoad = (current, pageSize) => {
    this.props.loadOrderTypes({
      pageSize,
      current,
    });
  }
  handleTabChange = (key) => {
    this.setState({
      tabkey: key,
      searchValue: '',
    });
  }
  handleSearch = (value) => {
    this.setState({
      searchValue: value,
    });
  }

  render() {
    const { tabkey, searchValue } = this.state;
    const { saasParams } = this.props;
    let dataTable = null;
    if (formParamKey[tabkey]) {
      const customsValue = formParamKey[tabkey].value;
      const customsText = formParamKey[tabkey].text;
      let customsParam = saasParams[tabkey];
      if (searchValue) {
        customsParam = saasParams[tabkey].filter((item) => {
          const reg = new RegExp(searchValue);
          return reg.test(item[customsText]) || reg.test(item[customsValue]);
        });
      }
      const customsName = formParamKey[tabkey].textTitle || 'customCName';
      const toolbarActions = (<SearchBox
        placeholder="代码/名称"
        onSearch={this.handleSearch}
        width={400}
        value={searchValue}
      />);
      const itemsColumns = [{
        title: this.msg('customCode'),
        dataIndex: customsValue,
        width: 200,
      }, {
        title: this.msg(customsName),
        dataIndex: customsText,
        width: 200,
      }];
      dataTable = (<DataTable
        columns={itemsColumns}
        dataSource={customsParam}
        noSetting
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
          showTotal: total => `共 ${total} 条`,
        }}
        rowKey={customsValue}
        toolbarActions={toolbarActions}
      />);
    }

    const menus = [
      {
        key: 'customs',
        menu: this.msg('customsCode'),
      },
      {
        key: 'tradeMode',
        menu: this.msg('tradeMode'),
      },
      {
        key: 'exemptionWay',
        menu: this.msg('dutyMode'),
      },
      {
        key: 'certMark',
        menu: this.msg('docuCode'),
      },
      {
        key: 'country',
        menu: this.msg('countryCode'),
      },
      {
        key: 'currency',
        menu: this.msg('currencyCode'),
      },
      {
        key: 'port',
        menu: this.msg('portsCode'),
      },
      {
        key: 'district',
        menu: this.msg('districtCode'),
      },
      {
        key: 'wrapType',
        menu: this.msg('wrapType'),
      },
    ];
    return (
      <Layout>
        <PaaSMenu currentKey="customsParams" openKey="paramPrefs" />
        <Layout>
          <PageHeader title={this.msg('customsParams')} menus={menus} onTabChange={this.handleTabChange} />
          <Content className="page-content">
            {dataTable}
          </Content>
        </Layout>
      </Layout>
    );
  }
}
