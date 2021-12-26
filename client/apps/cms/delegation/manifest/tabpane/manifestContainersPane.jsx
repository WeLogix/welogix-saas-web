import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Button, message, Tag } from 'antd';
import { loadContainers, loadBillOrDeclStat, loadCopGoodsNoList, saveContainer, delContainer, toggleContainersModal } from 'common/reducers/cmsManifest';
import { CMS_CNTNR_SPEC_CUS, CMS_CONFIRM } from 'common/constants';
import DataPane from 'client/components/DataPane';
import RowAction from 'client/components/RowAction';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import { formatMsg } from '../../message.i18n';
import ContainersModal from '../../../common/modal/containersModal';

const renderCombineData = (fieldVal, options) => {
  const foundOpts = options.filter(opt => opt.value === fieldVal);
  const label = foundOpts.length === 1 ? `${foundOpts[0].value}|${foundOpts[0].text}` : fieldVal;
  return label && label.length > 0 ? <Tag>{label}</Tag> : <span />;
};

@injectIntl
@connect(state => ({
  billHead: state.cmsManifest.billHead,
  whetherReloadBillList: state.cmsManifest.whetherReloadBillList,
  whetherReloadDeclContainer: state.cmsManifest.whetherReloadDeclContainer,
  containers: state.cmsManifest.containers,
  copGoodsNoList: state.cmsManifest.copGoodsNoList.map(gn => ({
    value: gn.g_no,
    text: gn.cop_g_no,
  })),
  containersModal: state.cmsManifest.containersModal,
}), {
  loadContainers,
  loadBillOrDeclStat,
  loadCopGoodsNoList,
  saveContainer,
  delContainer,
  toggleContainersModal,
})
export default class ManifestContainersPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    readonly: PropTypes.bool,
    toggleContainersModal: PropTypes.func.isRequired,
  }
  componentDidMount() {
    const delgNo = this.props.billHead.delg_no;
    this.props.loadContainers(delgNo);
    this.props.loadCopGoodsNoList(delgNo);
  }
  componentWillReceiveProps(nextProps) {
    const delgNo = nextProps.billHead.delg_no;
    if (this.props.billHead.delg_no !== nextProps.billHead.delg_no ||
      (nextProps.whetherReloadBillList &&
        this.props.whetherReloadBillList !== nextProps.whetherReloadBillList)) {
      this.props.loadContainers(delgNo);
      this.props.loadCopGoodsNoList(delgNo);
    }
    if (nextProps.whetherReloadDeclContainer &&
      this.props.whetherReloadDeclContainer !== nextProps.whetherReloadDeclContainer) {
      this.props.loadContainers(delgNo);
      this.props.loadBillOrDeclStat(delgNo);
    }
  }
  msg = formatMsg(this.props.intl)
  handleEdit = (record) => {
    // const { containers } = this.props;
    // const recordGNos = record.decl_g_no_list ? record.decl_g_no_list.split(',') : [];
    // const existContainerGNos = new Set(containers.reduce((accGnos, container) => {
    //   if (container.decl_g_no_list) {
    //     return accGnos.concat(container.decl_g_no_list.split(','));
    //   }
    //   return accGnos;
    // }, []));
    // recordGNos.forEach((f) => {
    //   if (existContainerGNos.has(f)) {
    //     existContainerGNos.delete(f);
    //   }
    // }); // 去除自身的已选中值
    const gNoList = this.props.copGoodsNoList;
    // .filter(f => !existContainerGNos.has(f.value.toString()));
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
    // const { containers } = this.props;
    // const existContainerGNos = new Set(containers.reduce((accGnos, container) => {
    //   if (container.decl_g_no_list) {
    //     return accGnos.concat(container.decl_g_no_list.split(','));
    //   }
    //   return accGnos;
    // }, []));
    const gNoList = this.props.copGoodsNoList;
    // .filter(f => !existContainerGNos.has(f.value.toString()));
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
    width: 120,
  }, {
    title: this.msg('containerMd'),
    dataIndex: 'container_spec',
    width: 170,
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
    title: this.msg('copDelgGNo'),
    dataIndex: 'decl_g_no_list',
    width: 340,
    render: (o) => {
      if (!o) return '';
      const { copGoodsNoList } = this.props;
      const arr = o.split(',');
      const newArr = arr.map((item) => {
        const foundOpt = copGoodsNoList.find(opt => opt.value === parseInt(item, 10));
        return foundOpt ? foundOpt.text : null;
      }).filter(f => f);
      return newArr.join(',');
    },
  }, {
    title: this.msg('opCol'),
    dataIndex: 'OPS_COL',
    className: 'table-col-ops',
    width: 100,
    render: (o, record, index) => (<span>
      <PrivilegeCover module="clearance" feature="delegation" action="edit">
        <RowAction onClick={this.handleEdit} icon="edit" tooltip="修改" row={record} />
      </PrivilegeCover>
      <PrivilegeCover module="clearance" feature="delegation" action="delete">
        <RowAction danger confirm="确定删除?" onConfirm={() => this.handleDelete(record, index)} icon="delete" row={record} />
      </PrivilegeCover>
    </span>),
  }];

  render() {
    const delgNo = this.props.billHead.delg_no;
    return (
      <DataPane
        columns={this.columns}
        bordered
        dataSource={this.props.containers}
        rowKey="id"
      >
        <DataPane.Toolbar>
          <PrivilegeCover module="clearance" feature="delegation" action="create">
            <Button type="primary" onClick={this.handleAdd} icon="plus" disabled={this.props.readonly}>{this.msg('add')}</Button>
          </PrivilegeCover>
        </DataPane.Toolbar>
        <ContainersModal delgNo={delgNo} preEntrySeqNo="" />
      </DataPane>
    );
  }
}
