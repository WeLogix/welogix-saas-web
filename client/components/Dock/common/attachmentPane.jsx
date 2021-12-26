import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { Button, Upload, Select } from 'antd';
import moment from 'moment';
import { ARCHIVE_TYPE } from 'common/constants';
import { uploadBizAttachment, loadUploadList } from 'common/reducers/saasInfra';
import DataTable from 'client/components/DataTable';
import RowAction from 'client/components/RowAction';
import { formatMsg } from 'client/common/root.i18n';

const { Option } = Select;

@injectIntl
@connect(
  state => ({
    userMembers: state.account.userMembers,
    docUploadList: state.saasInfra.docUploadList,
    docUploadFilter: state.saasInfra.docUploadFilter,
  }),
  { uploadBizAttachment, loadUploadList }
)
export default class AttachmentPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    bizObject: PropTypes.string.isRequired,
    billNo: PropTypes.string.isRequired,
  }
  state = {
    docType: null,
  }
  componentDidMount() {
    this.handleLoad(this.props.billNo, 1);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.billNo !== this.props.billNo) {
      this.handleLoad(nextProps.billNo);
    }
  }
  msg = formatMsg(this.props.intl)
  handleDownload = (row) => {
    window.open(row.doc_cdnurl);
  }
  handleLoad = (billNo, current) => {
    const curr = current || this.props.docUploadList.current;
    const size = this.props.docUploadList.pageSize;
    const listFilter = { billNo };
    this.props.loadUploadList(curr, size, listFilter);
  }
  handleTypeChange = (value) => {
    this.setState({ docType: value });
  }
  render() {
    const dataSource = new DataTable.DataSource({
      fetcher: params => this.props.loadUploadList(...params),
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
        const listFilter = { billNo: this.props.billNo };
        const params = [pagination.current, pagination.pageSize, listFilter];
        return params;
      },
      remotes: this.props.docUploadList,
    });
    const columns = [{
      title: '存档类型',
      dataIndex: 'doc_type',
      width: 200,
      render: (o) => {
        const obj = ARCHIVE_TYPE.find(f => f.value === o);
        return obj && obj.text;
      },
    }, {
      title: '资料名称',
      dataIndex: 'doc_name',
      width: 300,
      render: o => decodeURI(o),
    }, {
      title: '上传人',
      dataIndex: 'created_by',
      width: 100,
      render: o => this.props.userMembers.find(user => user.login_id === o) &&
       this.props.userMembers.find(user => user.login_id === o).name,
    }, {
      title: '上传时间',
      dataIndex: 'created_date',
      width: 150,
      render: date => (date ? moment(date).format('YYYY.MM.DD HH:mm') : '-'),
    }, {
      title: '操作',
      dataIndex: 'OPS_COL',
      className: 'table-col-ops',
      width: 90,
      render: (_, row) => (<span>
        <RowAction shape="circle" onClick={this.handleDownload} icon="download" tooltip={this.msg('download')} row={row} />
      </span>),
    }];
    const {
      billNo, bizObject, ownerPartnerId, ownerTenantId,
    } = this.props;
    const { docType } = this.state;
    const formData = {
      docType, bizObject, billNo, ownerPartnerId, ownerTenantId,
    };
    const props = {
      action: `${API_ROOTS.default}v1/saas/biz/attachment/attfileupload`,
      data: { data: JSON.stringify(formData) },
      multiple: false,
      showUploadList: false,
      withCredentials: true,
      // beforeUpload: () => {
      //   notification.info({
      //     message: '文件上传中',
      //     description: <Progress percent={100} size="small" status="active" showInfo={false} />,
      //     duration: null,
      //     placement: 'bottomRight',
      //     key: 'uploadFile',
      //   });
      // },
      // onChange: (info) => {
      //   if (info.file.response && info.file.response.status === 200) {
      //     notification.close('uploadFile');
      //     notification.success({
      //       message: '文件上传成功',
      //       description: <Progress percent={100} size="small" status="success" />,
      //       placement: 'bottomRight',
      //     });
      //     this.handleLoad(billNo);
      //   }
      // },
      onChange: (info) => {
        if (info.file.response && info.file.response.status === 200) {
          this.handleLoad(billNo);
        }
      },
    };
    const toolbarActions = (<span>
      <Select placeholder={this.msg('选择存档类型')} onChange={this.handleTypeChange}>
        {ARCHIVE_TYPE.map(opt => <Option value={opt.value} key={opt.value}>{opt.text}</Option>)}
      </Select>
      <Upload {...props}>
        <Button type="primary" icon="upload">上传</Button>
      </Upload>
    </span>
    );
    return (
      <div className="pane-content tab-pane">
        <DataTable
          rowKey="id"
          toolbarActions={toolbarActions}
          columns={columns}
          dataSource={dataSource}
        />
      </div>
    );
  }
}
