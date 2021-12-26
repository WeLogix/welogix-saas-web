import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { Modal, message } from 'antd';
import DataTable from 'client/components/DataTable';
import SearchBox from 'client/components/SearchBox';
import { intlShape, injectIntl } from 'react-intl';
import { hideAsnSelectModal, setSoDetails } from 'common/reducers/cwmShippingOrder';
import { getCrossAsns, getCrossAsnDetails } from 'common/reducers/cwmReceive';
import { formatMsg } from '../../message.i18n';

@injectIntl
@connect(
  state => ({
    visible: state.cwmShippingOrder.asnSelectModal.visible,
    whseCode: state.cwmContext.defaultWhse.code,
    soDetails: state.cwmShippingOrder.soDetails,
  }),
  {
    getCrossAsns, hideAsnSelectModal, getCrossAsnDetails, setSoDetails,
  }
)
export default class AsnSelectModal extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    bonded: PropTypes.number,
    soType: PropTypes.string,
  }
  state = {
    selectedRowKeys: [],
    dataSource: [],
    addingDetails: false,
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && nextProps.visible !== this.props.visible) {
      this.props.getCrossAsns(
        this.props.whseCode, nextProps.bonded, nextProps.regType,
        nextProps.soType, nextProps.ownerPartnerId
      ).then((result) => {
        if (!result.error) {
          this.setState({
            dataSource: result.data,
          });
        }
      });
    }
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.props.hideAsnSelectModal();
  }
  handleSearch = (searchVal) => {
    const {
      whseCode, bonded, regType, soType, ownerPartnerId,
    } = this.props;
    this.props.getCrossAsns(
      whseCode, bonded, regType,
      soType, ownerPartnerId, searchVal
    ).then((result) => {
      if (!result.error) {
        this.setState({
          searchVal,
          dataSource: result.data,
        });
      }
    });
  }
  handleCrossAsnDetails = () => {
    this.setState({ addingDetails: true });
    this.props.getCrossAsnDetails(this.state.selectedRowKeys).then((result) => {
      if (!result.error) {
        const soDetails = [...this.props.soDetails];
        // unsaved特殊标识,用于在外部组件保存时创建新的soDetail
        const newData = result.data.map(f => ({ ...f, unsaved: true }));
        this.props.setSoDetails(soDetails.concat(newData));
        this.setState({ addingDetails: false });
        this.handleCancel();
      } else {
        message.error(result.error.message);
      }
    });
  }
  rowSelection = {
    onChange: (selectedRowKeys) => {
      this.setState({ selectedRowKeys });
    },
  }
  render() {
    const { visible } = this.props;
    const { dataSource, searchVal, addingDetails } = this.state;
    const columns = [{
      title: '订单追踪号',
      dataIndex: 'cust_order_no',
    }, {
      title: 'ASN',
      dataIndex: 'asn_no',
      width: 200,
    }, {
      title: '入库日期',
      dataIndex: 'received_date',
      width: 100,
      render: o => o && moment(o).format('YYYY-MM-DD'),
    }];
    const toolbarActions = (
      <SearchBox value={searchVal} placeholder="订单追踪号" onSearch={this.handleSearch} />
    );
    return (
      <Modal
        width={700}
        maskClosable={false}
        onCancel={this.handleCancel}
        visible={visible}
        title="可选ASN列表"
        onOk={this.handleCrossAsnDetails}
        okButtonProps={{ loading: addingDetails }}
      >
        <DataTable
          toolbarActions={toolbarActions}
          rowSelection={this.rowSelection}
          columns={columns}
          dataSource={dataSource}
          indentSize={0}
          rowKey="asn_no"
        />
      </Modal>
    );
  }
}
