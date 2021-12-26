import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
// import { Card, DatePicker, Form, Input, Select, Switch, Row, Col, message } from 'antd';
import UserAvatar from 'client/components/UserAvatar';
import { intlShape, injectIntl } from 'react-intl';
import { loadTradeItemHistory, toggleHistoryItemsDecl } from 'common/reducers/cmsTradeitem';
import DataPane from 'client/components/DataPane';
import RowAction from 'client/components/RowAction';

import { formatMsg } from '../../../message.i18n';


@injectIntl
@connect(
  state => ({
    history: state.cmsTradeitem.itemHistory,
  }),
  { loadTradeItemHistory, toggleHistoryItemsDecl }
)
export default class ItemHistoryPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    repoId: PropTypes.number.isRequired,
    itemId: PropTypes.number.isRequired,
    copProdNo: PropTypes.string.isRequired,
    history: PropTypes.arrayOf(PropTypes.shape({ decl_hscode: PropTypes.string })),
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    const { repoId, copProdNo } = this.props;
    this.props.loadTradeItemHistory(repoId, copProdNo);
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    key: 'sno',
    width: 45,
    align: 'center',
    className: 'table-col-seq',
    render: (o, record, index) => index + 1,
  }, {
    title: this.msg('HS编码'),
    width: 120,
    dataIndex: 'decl_hscode',
  }, {
    title: this.msg('品名'),
    width: 300,
    dataIndex: 'decl_gname',
  }, {
    title: this.msg('规范申报要素'),
    dataIndex: 'g_model',
  }, {
    title: this.msg('变更原因'),
    width: 200,
    dataIndex: 'reason',
  }, {
    title: this.msg('变更时间'),
    width: 120,
    dataIndex: 'modify_date',
    render: modyDate => modyDate && moment(modyDate).format('YYYY-MM-DD'),
  }, {
    title: this.msg('归类人员'),
    width: 120,
    dataIndex: 'created_by',
    render: lid => <UserAvatar size="small" loginId={lid} showName />,
  }, {
    title: this.msg('审核人员'),
    width: 120,
    dataIndex: 'modify_id',
    render: lid => <UserAvatar size="small" loginId={lid} showName />,
  }, {
    width: 100,
    fixed: 'right',
    render: (o, record) =>
      (<RowAction onClick={this.handleHistoryToggle} icon="check" tooltip="重新启用该归类" row={record} />),
  }]
  handleHistoryToggle = (row) => {
    const {
      repoId, copProdNo, itemId, form,
    } = this.props;
    this.props.toggleHistoryItemsDecl(repoId, itemId, 'enable', row.id).then((result) => {
      if (!result.error) {
        this.props.loadTradeItemHistory(repoId, copProdNo);
        form.setFieldsValue(result.data);
      }
    });
  }
  render() {
    const { history, fullscreen } = this.props;
    return (
      <DataPane
        fullscreen={fullscreen}
        columns={this.columns}
        rowKey="id"
        dataSource={history}
      />
    );
  }
}
