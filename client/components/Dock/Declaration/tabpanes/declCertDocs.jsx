import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Button, Collapse, Card } from 'antd';
import { loadCertMarks, loadDocuMarks } from 'common/reducers/cmsManifest';
import DataTable from 'client/components/DataTable';
import { CMS_DECL_DOCU } from 'common/constants';
import { formatMsg } from '../message.i18n';

const { Panel } = Collapse;

@injectIntl
@connect(
  state => ({
    head: state.cmsManifest.entryHead,
    declCerts: state.cmsManifest.certMarks,
    certMark: state.saasParams.latest.certMark,
    docuMarks: state.cmsManifest.docuMarks,
  }),
  {
    loadCertMarks, loadDocuMarks,
  }
)
export default class declCertDocssPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    declCerts: PropTypes.arrayOf(PropTypes.shape({
      cert_code: PropTypes.string,
      cert_num: PropTypes.string,
    })),
    docuMarks: PropTypes.arrayOf(PropTypes.shape({
      pre_entry_seq_no: PropTypes.string,
      id: PropTypes.number,
      docu_spec: PropTypes.string,
      docu_file: PropTypes.string,
      docu_code: PropTypes.string,
      delg_no: PropTypes.string,
    })),
  }
  componentDidMount() {
    const preEntrySeqNo = this.props.head.pre_entry_seq_no;
    this.props.loadCertMarks(preEntrySeqNo);
    this.props.loadDocuMarks(preEntrySeqNo);
  }
  componentWillReceiveProps(nextProps) {
    const preEntrySeqNo = nextProps.head.pre_entry_seq_no;
    if (preEntrySeqNo && preEntrySeqNo !== this.props.head.pre_entry_seq_no) {
      this.props.loadCertMarks(preEntrySeqNo);
      this.props.loadDocuMarks(preEntrySeqNo);
    }
  }
  msg = formatMsg(this.props.intl)
  certColumns = [{
    title: this.msg('seqNo'),
    dataIndex: 'cert_seq',
    width: 45,
    align: 'center',
    className: 'table-col-seq',
    render: (o, record, index) => o || index + 1,
  }, {
    title: this.msg('certSpec'),
    dataIndex: 'cert_code',
    width: 300,
    render: (o) => {
      const existOpt = this.props.certMark.find(f => f.cert_spec === o);
      return <span>{existOpt ? `${existOpt.cert_code}|${o}` : o}</span>;
    },
  }, {
    title: this.msg('certNum'),
    dataIndex: 'cert_num',
    width: 300,
  }, {
    dataIndex: 'coo_rel',
    render: (o, record) => {
      if (record.cert_code === 'Y' || record.cert_code === 'E' || record.cert_code === 'R' || record.cert_code === 'F' || record.cert_code === 'J') {
        return <Button>{this.msg('cooRel')}</Button>;
      }
      return null;
    },
  }];
  docColumns = [{
    title: this.msg('seqNo'),
    dataIndex: 'seq_no',
    width: 45,
    align: 'center',
    className: 'table-col-seq',
    render: (col, row, index) => index + 1,
  }, {
    title: this.msg('docuSpec'),
    dataIndex: 'docu_spec',
    width: 300,
    render: (o) => {
      const doc = CMS_DECL_DOCU.find(f => f.value === o);
      return doc && doc.text;
    },
  }, {
    title: this.msg('docuCode'),
    dataIndex: 'docu_code',
    width: 300,
  }, {
    title: this.msg('fileName'),
    dataIndex: 'docu_file',
    width: 200,
    render: o => o && decodeURI(o),
  }]
  render() {
    return (
      <Card bodyStyle={{ padding: 0 }}>
        <Collapse bordered={false}>
          <Panel header="随附单证" key="declCert">
            <DataTable
              columns={this.certColumns}
              bordered
              showToolbar={false}
              dataSource={this.props.declCerts}
              rowKey="id"
            />
          </Panel>
          <Panel header="随附单据" key="declDoc">
            <DataTable
              columns={this.docColumns}
              bordered
              showToolbar={false}
              dataSource={this.props.docuMarks}
              rowKey="id"
            />
          </Panel>
        </Collapse>
      </Card>
    );
  }
}
