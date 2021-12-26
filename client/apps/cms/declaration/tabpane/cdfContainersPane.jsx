import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Button, Tag, message, Tooltip } from 'antd';
import { loadContainers, saveContainer, delContainer, toggleContainersModal, loadBillOrDeclStat } from 'common/reducers/cmsManifest';
import { CMS_CNTNR_SPEC_CUS, CMS_CONFIRM, CMS_DECL_STATUS } from 'common/constants';
import DataPane from 'client/components/DataPane';
import RowAction from 'client/components/RowAction';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import { formatMsg } from '../message.i18n';
import ContainersModal from '../../common/modal/containersModal';

const renderCombineData = (fieldVal, options) => {
  const foundOpts = options.filter(opt => opt.value === fieldVal);
  const label = foundOpts.length === 1 ? `${foundOpts[0].value}|${foundOpts[0].text}` : fieldVal;
  return label && label.length > 0 ? <Tag>{label}</Tag> : <span />;
};

@injectIntl
@connect(state => ({
  entryHead: state.cmsManifest.entryHead,
  entryBodies: state.cmsManifest.entryBodies,
  whetherReloadDeclContainer: state.cmsManifest.whetherReloadDeclContainer,
  containers: state.cmsManifest.containers,
  containersModal: state.cmsManifest.containersModal,
}), {
  loadContainers, saveContainer, delContainer, toggleContainersModal, loadBillOrDeclStat,
})
export default class CDFContainersPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    toggleContainersModal: PropTypes.func.isRequired,
  }
  componentDidMount() {
    const {
      entryHead: { bill_seq_no: delgNo, pre_entry_seq_no: preEntrySeqNo },
    } = this.props;
    this.props.loadContainers(delgNo, preEntrySeqNo);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.entryHead.pre_entry_seq_no !== nextProps.entryHead.pre_entry_seq_no ||
      (nextProps.whetherReloadDeclContainer &&
        this.props.whetherReloadDeclContainer !== nextProps.whetherReloadDeclContainer)) {
      const {
        entryHead: { bill_seq_no: delgNo, pre_entry_seq_no: preEntrySeqNo },
      } = nextProps;
      this.props.loadContainers(delgNo, preEntrySeqNo);
      this.props.loadBillOrDeclStat(delgNo, preEntrySeqNo);
    }
  }
  msg = formatMsg(this.props.intl)
  handleEdit = (record) => {
    const { entryBodies } = this.props;
    /* const recordGNos = record.decl_g_no_list ? record.decl_g_no_list.split(',') : [];
    const existContainerGNos = new Set(containers.reduce((accGnos, container) => {
      if (container.decl_g_no_list) {
        return accGnos.concat(container.decl_g_no_list.split(','));
      }
      return accGnos;
    }, []));
    recordGNos.forEach((f) => {
      if (existContainerGNos.has(f)) {
        existContainerGNos.delete(f);
      }
    }); // 去除自身的已选中值 */
    const gNoList = entryBodies.map(f => ({
      g_no: f.g_no,
      hscode: f.hscode,
      g_name: f.g_name,
    })); /* .filter(f => !existContainerGNos.has(f.g_no.toString())); */
    this.props.toggleContainersModal(true, {
      id: record.id,
      container_id: record.container_id,
      container_spec: record.container_spec,
      lcl_flag: record.lcl_flag,
      container_wt: record.container_wt,
      decl_g_no_list: record.decl_g_no_list,
    }, gNoList);
  }
  handleAdd = () => {
    const { entryBodies } = this.props;
    /* const existContainerGNos = new Set(containers.reduce((accGnos, container) => {
      if (container.decl_g_no_list) {
        return accGnos.concat(container.decl_g_no_list.split(','));
      }
      return accGnos;
    }, [])); */
    const gNoList = entryBodies.map(f => ({
      g_no: f.g_no,
      hscode: f.hscode,
      g_name: f.g_name,
    })); /* .filter(f => !existContainerGNos.has(f.g_no.toString())); */
    this.props.toggleContainersModal(true, {}, gNoList);
  }
  handleDelete = (record) => {
    this.props.delContainer(record.id).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      }
    });
  }
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
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    width: 100,
    render: (o, record, index) => {
      if (this.props.entryHead.status < CMS_DECL_STATUS.sent.value) {
        return (<span>
          <PrivilegeCover module="clearance" feature="customs" action="edit">
            <RowAction onClick={this.handleEdit} icon="edit" tooltip={this.msg('modify')} row={record} />
          </PrivilegeCover>
          <PrivilegeCover module="clearance" feature="customs" action="delete">
            <RowAction danger confirm={this.msg('deleteConfirm')} onConfirm={() => this.handleDelete(record, index)} icon="delete" row={record} />
          </PrivilegeCover>
        </span>);
      }
      return null;
    },
  }];
  handleExport = () => {
    const preEntrySeqNo = this.props.entryHead.pre_entry_seq_no;
    window.open(`${API_ROOTS.default}v1/cms/decl/container/exportswtpl/containers_${preEntrySeqNo}.xlsx?preEntrySeqNo=${preEntrySeqNo}`);
  }
  render() {
    const {
      entryHead: { bill_seq_no: delgNo, pre_entry_seq_no: preEntrySeqNo, status }, containers,
    } = this.props;
    return (
      <DataPane
        columns={this.columns}
        bordered
        dataSource={containers}
        rowKey="id"
      >
        <DataPane.Toolbar>
          <PrivilegeCover module="clearance" feature="customs" action="create">
            <Button type="primary" icon="plus-circle-o" onClick={this.handleAdd} disabled={status >= CMS_DECL_STATUS.sent.value} >{this.msg('add')}</Button>
          </PrivilegeCover>
          {containers.length > 0 &&
            <Tooltip placement="top" title="以单一窗口模板导出">
              <Button icon="export" onClick={this.handleExport}>导出</Button>
            </Tooltip>}
        </DataPane.Toolbar>
        <ContainersModal delgNo={delgNo} preEntrySeqNo={preEntrySeqNo} />
      </DataPane>
    );
  }
}
