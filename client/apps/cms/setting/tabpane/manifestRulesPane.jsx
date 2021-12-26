import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { Button, Tag, message } from 'antd';
import DataTable from 'client/components/DataTable';
import NavLink from 'client/components/NavLink';
import RowAction from 'client/components/RowAction';
import { deleteTemplate, toggleBillTempModal, showManifestRulesCloneModal } from 'common/reducers/cmsManifest';
import { CMS_BILL_TEMPLATE_PERMISSION } from 'common/constants';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import AddManifestRuleModal from '../modal/addManifestRuleModal';
import ManifestRuleCloneModal from '../modal/manifestRuleCloneModal';
import { formatMsg } from '../../message.i18n';

@injectIntl
@connect(
  state => ({
    billtemplates: state.cmsManifest.billtemplates,
    customer: state.cmsResources.customer,
  }),
  {
    deleteTemplate,
    toggleBillTempModal,
    showManifestRulesCloneModal,
  }
)

export default class ManifestRulesPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    billtemplates: PropTypes.arrayOf(PropTypes.shape({ template_name: PropTypes.string })),
    customer: PropTypes.shape({ id: PropTypes.number }),
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  msg = formatMsg(this.props.intl)
  handleEdit = (record) => {
    this.context.router.push(`/clearance/setting/rule/${record.id}`);
  }
  handleDelete = (record) => {
    this.props.deleteTemplate(record.id).then((result) => {
      if (result.error) {
        message.error(result.error.message, 10);
      }
    });
  }
  handleAddBtnClicked = () => {
    this.props.toggleBillTempModal(true, 'add');
  }
  handleClone = (record) => {
    this.props.showManifestRulesCloneModal(record.id, record.i_e_type);
  }
  render() {
    const columns = [
      {
        title: '规则名称',
        dataIndex: 'template_name',
        key: 'template_name',

      }, {
        title: '类型',
        dataIndex: 'i_e_type',
        key: 'i_e_type',
        width: 100,
        render: o => <Tag>{o === 0 ? '进口' : '出口'}</Tag>,
      }, {
        title: '最后更新时间',
        dataIndex: 'modify_date',
        key: 'modify_date',
        width: 120,
        render: date => (date ? moment(date).format('MM.DD HH:mm') : '-'),
      }, {
        title: '修改人',
        dataIndex: 'modify_name',
        key: 'modify_name',
        width: 100,
        /*
      }, {
        title: '创建日期',
        dataIndex: 'created_date',
        key: 'created_date',
        width: 120,
        render(o) {
          return moment(o).format('YYYY/MM/DD');
        },
      }, {
        title: '创建人',
        dataIndex: 'creater_name',
        key: 'creater_name',
        width: 100,
        */
      }, {
        title: '操作',
        key: 'OP_COL',
        width: 130,
        render: (_, record) => {
          if (record.permission === CMS_BILL_TEMPLATE_PERMISSION.edit) {
            return (
              <span>
                <PrivilegeCover module="clearance" feature="delegation" action="edit">
                  <RowAction onClick={this.handleEdit} icon="edit" tooltip={this.msg('modify')} row={record} />
                  <RowAction onClick={this.handleClone} icon="copy" tooltip={this.msg('clone')} row={record} />
                </PrivilegeCover>
                <PrivilegeCover module="clearance" feature="delegation" action="delete">
                  <RowAction confirm="确定删除？" onConfirm={this.handleDelete} icon="delete" tooltip={this.msg('delete')} row={record} />
                </PrivilegeCover>
              </span>);
          } else if (record.permission === CMS_BILL_TEMPLATE_PERMISSION.view) {
            return <NavLink to={`/clearance/setting/rule/${record.id}`}>{this.msg('view')}</NavLink>;
          }
          return '';
        },
      },
    ];
    return (
      <div>
        <DataTable
          cardView={false}
          toolbarActions={
            <PrivilegeCover module="clearance" feature="delegation" action="create">
              <Button type="primary" onClick={this.handleAddBtnClicked} icon="plus-circle-o">新增</Button>
            </PrivilegeCover>
          }
          columns={columns}
          dataSource={this.props.billtemplates}
          rowKey="id"
          scrollOffset={340}
        />
        <AddManifestRuleModal customer={this.props.customer} />
        <ManifestRuleCloneModal />
      </div>
    );
  }
}
