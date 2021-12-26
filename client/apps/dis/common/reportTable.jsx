import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { getReportViewData, getReportConfig } from 'common/reducers/disReport';
import { toggleBizDock } from 'common/reducers/saasDockPool';
import DataTable from 'client/components/DataTable';

@connect(
  state => ({
    attributes: state.disReport.reportData.attributes,
    dataList: state.disReport.reportData.dataList,
    rptDataListLoading: state.disReport.reportData.rptDataListLoading,
  }),
  {
    getReportViewData, getReportConfig, toggleBizDock,
  },
)
export default class ReportTable extends React.Component {
  static propTypes = {
    rptDataListLoading: PropTypes.bool.isRequired,
    passRptDataParams: PropTypes.func,
    reportId: PropTypes.number.isRequired,
  }
  componentDidMount() {
    this.handleReportDataLoad(1);
    this.props.getReportConfig(this.props.reportId);
    if (this.props.setLoadHandler) {
      this.props.setLoadHandler(this.handleReportDataLoad);
    }
  }
  handleReportDataLoad = (currentPage, pageSize) => {
    const { dataList, reportId } = this.props;
    let rptDataParam = {};
    if (this.props.passRptDataParams) {
      rptDataParam = this.props.passRptDataParams();
    }
    rptDataParam.reportId = reportId;
    rptDataParam.pageSize = pageSize || dataList.pageSize;
    rptDataParam.current = currentPage || dataList.current;
    this.props.getReportViewData(rptDataParam);
  }
  dataSource = new DataTable.DataSource({
    fetcher: params => this.handleReportDataLoad(
      params.current,
      params.pageSize,
    ),
    resolve: result => result.data,
    getPagination: (result, resolve) => ({
      total: result.totalCount,
      current: resolve(result.totalCount, result.current, result.pageSize),
      showSizeChanger: true,
      showQuickJumper: false,
      pageSize: result.pageSize,
      showTotal: total => `共 ${total} 条`,
    }),
    getParams: (pagination) => {
      const params = {
        pageSize: pagination.pageSize,
        current: pagination.current,
      };
      return params;
    },
    remotes: this.props.dataList,
  })
  render() {
    const {
      attributes, dataList, rptDataListLoading,
    } = this.props;
    const columns = attributes.map(attr => ({
      title: attr.column_name || attr.bmf_label_name || attr.bmf_default_name,
      dataIndex: attr.dataIndex,
      width: 150,
      render: (attrVal) => {
        if (attrVal === null || attrVal === undefined || attrVal === '') {
          return '';
        }
        if (attr.bm_field === 'entry_id') {
          return (<a onClick={() => this.props.toggleBizDock('cmsDeclaration', {
                preEntrySeqNo: attrVal,
              })}
          >{attrVal}</a>);
        }
        if (attr.bmf_data_type === 'DATE') {
          let dateFormat = 'YYYY-MM-DD';
          if (attr.bmf_data_hypotype === 'DATETIME') {
            dateFormat = 'YYYY-MM-DD HH:mm';
          }
          return moment(attrVal).format(dateFormat);
        }
        if (attr.bmf_data_type === 'TEXT' && attr.bmf_data_hypotype === 'HYPERLINK') {
          // eslint-disable-next-line react/jsx-no-target-blank
          return <a href={attrVal} target="_blank">{attrVal}</a>;
        }
        if (attr.bmf_param_type && this.props.rptParams[attr.bmf_param_type]) {
          const filterItem = this.props.rptParams[attr.bmf_param_type]
            .filter(par => String(par.value) === String(attrVal))[0];
          if (filterItem) {
            return filterItem.text;
          }
        }
        return attrVal;
      },
    }));
    this.dataSource.remotes.data = dataList.data.map((pldata, idx) => {
      const item = { id: idx };
      for (let i = 0; i < pldata.length; i++) {
        item[attributes[i].dataIndex] = pldata[i];
      }
      return item;
    });
    this.dataSource.remotes.current = dataList.current;
    this.dataSource.remotes.pageSize = dataList.pageSize;
    this.dataSource.remotes.totalCount = dataList.totalCount;
    return (
      <DataTable
        bordered
        showToolbar={false}
        noSetting
        columns={columns}
        dataSource={this.dataSource}
        loading={rptDataListLoading}
        scrollOffset={287}
      />
    );
  }
}
