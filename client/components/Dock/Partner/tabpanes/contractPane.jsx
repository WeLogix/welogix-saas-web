import React from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Button } from 'antd';
import DataTable from 'client/components/DataTable';
import { formatMsg } from 'client/apps/scof/partner/message.i18n';

@injectIntl
export default class ContractPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  msg = formatMsg(this.props.intl)
  render() {
    const column = [{
      title: '合同编号',
      dataIndex: 'contract_no',
    }, {
      title: '合同标题',
      dataIndex: 'department',
      key: 'department',
    }, {
      title: '生效日期',
      dataIndex: 'start_date',
    }, {
      title: '终止日期',
      dataIndex: 'end_date',
    }, {
      title: '合同金额',
      dataIndex: 'contract_amount',
    }];
    const contracts = [
      {
        contract_no: 'SIM03452257765',
        start_date: '2018-10-19',
      },
    ];
    const toolbarActions = <Button onClick={() => {}}>添加合同</Button>;
    return (
      <div className="pane-content tab-pane">
        <DataTable size="middle" toolbarActions={toolbarActions} columns={column} dataSource={contracts} noSetting rowKey="id" scrollOffset={334} />
      </div>
    );
  }
}
