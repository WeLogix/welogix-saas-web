import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Modal, DatePicker, Table } from 'antd';
import { toggleCusExchangeHistoryModal, loadCusCurrExchangeHistory } from 'common/reducers/bssExRateSettings';
import CountryFlag from 'client/components/CountryFlag';
import { formatMsg } from '../../message.i18n';

const { MonthPicker } = DatePicker;

@injectIntl
@connect(
  state => ({
    visible: state.bssExRateSettings.customsExchangeHistoryModal.visible,
    currCode: state.bssExRateSettings.customsExchangeHistoryModal.currCode,
    currName: state.bssExRateSettings.customsExchangeHistoryModal.currName,
    data: state.bssExRateSettings.customsExchangeHistoryModal.data,
  }),
  { toggleCusExchangeHistoryModal, loadCusCurrExchangeHistory }
)
export default class customsExchangeHistory extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && nextProps.visible !== this.props.visible) {
      this.props.loadCusCurrExchangeHistory(nextProps.currCode);
    }
  }
  msg = formatMsg(this.props.intl)
  handleCancel = () => {
    this.props.toggleCusExchangeHistoryModal(false);
  }
  handleMonthChange = (date, dateString) => {
    this.props.loadCusCurrExchangeHistory(this.props.currCode, dateString);
  }
  columns = [{
    title: this.msg('publishDate'),
    dataIndex: 'publish_date',
    width: 150,
  }, {
    title: this.msg('effectDate'),
    dataIndex: 'effect_date',
    width: 150,
    render: o => o && moment(o).format('YYYY-MM-DD'),
  }, {
    title: this.msg('customsExRates'),
    dataIndex: 'rate_cny',
  }]
  render() {
    const {
      visible, data, currCode, currName,
    } = this.props;
    return (
      <Modal
        maskClosable={false}
        title={<span><CountryFlag code={currCode} currency /> {currName}</span>}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        destroyOnClose
      >
        <MonthPicker
          onChange={this.handleMonthChange}
          style={{ marginBottom: 8 }}
        />
        <Table
          size="small"
          columns={this.columns}
          dataSource={data}
          rowKey="id"
          pagination={false}
        />
      </Modal>
    );
  }
}
