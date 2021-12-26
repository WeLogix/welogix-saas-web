import React from 'react';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Tag } from 'antd';
import { loadContainers } from 'common/reducers/cmsManifest';
import { CMS_CNTNR_SPEC_CUS, CMS_CONFIRM } from 'common/constants';
import DataTable from 'client/components/DataTable';
import { formatMsg } from '../message.i18n';

const renderCombineData = (fieldVal, options) => {
  const foundOpts = options.filter(opt => opt.value === fieldVal);
  const label = foundOpts.length === 1 ? `${foundOpts[0].value}|${foundOpts[0].text}` : fieldVal;
  return label && label.length > 0 ? <Tag>{label}</Tag> : <span />;
};

@injectIntl
@connect(state => ({
  head: state.cmsManifest.entryHead,
  containers: state.cmsManifest.containers,
}), {
  loadContainers,
})
export default class declContainerPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  componentDidMount() {
    const { head } = this.props;
    this.props.loadContainers(head.bill_seq_no, head.pre_entry_seq_no);
  }
  componentWillReceiveProps(nextProps) {
    const preEntrySeqNo = nextProps.head.pre_entry_seq_no;
    if (preEntrySeqNo && preEntrySeqNo !== this.props.head.pre_entry_seq_no) {
      this.props.loadContainers(nextProps.head.bill_seq_no, preEntrySeqNo);
    }
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: this.msg('seqNo'),
    dataIndex: 'container_seq',
    width: 45,
    align: 'center',
    className: 'table-col-seq',
    render: (o, record, index) => o || index + 1, // 兼容老数据的显示
  }, {
    title: this.msg('containerId'),
    dataIndex: 'container_id',
    width: 150,
  }, {
    title: this.msg('containerMd'),
    dataIndex: 'container_spec',
    width: 200,
    render: o => renderCombineData(o, CMS_CNTNR_SPEC_CUS),
  }, {
    title: this.msg('lclFlag'),
    dataIndex: 'lcl_flag',
    width: 130,
    render: o => renderCombineData(o, CMS_CONFIRM),
  }, {
    title: this.msg('goodsContaWt'),
    dataIndex: 'container_wt',
    width: 130,
  }, {
    title: this.msg('goodsNo'),
    dataIndex: 'decl_g_no_list',
  }];

  render() {
    return (
      <div className="pane-content tab-pane">
        <DataTable
          columns={this.columns}
          dataSource={this.props.containers}
          rowKey="id"
          showToolbar={false}
          scrollOffset={360}
        />
      </div>
    );
  }
}
