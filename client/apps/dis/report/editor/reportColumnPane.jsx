import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';
import { Table } from 'antd';
import { toggleBizDock } from 'common/reducers/saasDockPool';
import { formatMsg } from '../message.i18n';
import '../index.less';

@injectIntl
@connect(state => ({
  reportObjectMeta: state.disReport.reportObjectMeta,
  previewList: state.disReport.previewList,
  previewAttrbs: state.disReport.previewAttrbs,
  previewListLoading: state.disReport.previewListLoading,
}), {
  toggleBizDock,
})
export default class ReportColumnPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    previewAction: PropTypes.node,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  msg = formatMsg(this.props.intl)
  handleLinkToReportDetail = () => {
    this.context.router.push(`/dis/report/view/${this.context.router.params.id}`);
  }
  render() {
    const {
      reportObjectMeta, previewAction, previewList, previewListLoading, previewAttrbs,
    } = this.props;
    const dataSource = previewList.map((pldata) => {
      const item = {};
      for (let i = 0; i < pldata.length; i++) {
        item[previewAttrbs[i].sql_field] = pldata[i];
      }
      return item;
    });
    const columns = previewAttrbs.filter(attr => attr.sql_field).map((attr) => {
      const objField = reportObjectMeta[attr.rpt_object].find(field =>
        field.bm_field === attr.sql_field);
      return ({
        title: attr.column_name || attr.label ||
          (objField && (objField.bmf_label_name || objField.bmf_default_name)),
        dataIndex: attr.sql_field,
        align: 'center',
        render: (attrVal) => {
          if (attrVal === null || attrVal === undefined || attrVal === '') {
            return '';
          }
          if (objField.bm_field === 'entry_id') {
            return (<a onClick={() => this.props.toggleBizDock('cmsDeclaration', {
                preEntrySeqNo: attrVal,
              })}
            >{attrVal}</a>);
          }
          if (objField.bmf_data_type === 'DATE') {
            let dateFormat = 'YYYY-MM-DD';
            if (objField.bmf_data_hypotype === 'DATETIME') {
              dateFormat = 'YYYY-MM-DD HH:mm';
            }
            return moment(attrVal).format(dateFormat);
          }
          if (objField.bmf_data_type === 'TEXT' && objField.bmf_data_hypotype === 'HYPERLINK') {
            return <a href={attrVal} target="_blank" rel="noopener noreferrer">{attrVal}</a>;
          }
          if (objField.bmf_param_type && this.props.rptParams[objField.bmf_param_type]) {
            const filterItem = this.props.rptParams[objField.bmf_param_type]
              .filter(par => String(par.value) === String(attrVal))[0];
            if (filterItem) {
              return filterItem.text;
            }
          }
          return attrVal;
        },
      });
    });
    return (
      <Table
        bordered
        columns={columns}
        dataSource={dataSource}
        loading={previewListLoading}
        scroll={{
          x: columns.reduce((acc, curr) => acc + (curr.width || 100), 0),
        }}
        locale={{
          emptyText: previewAction,
        }}
        pagination={false}
      />
    );
  }
}
