import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Icon } from 'antd';
import DataPane from 'client/components/DataPane';
import { LogixIcon } from 'client/components/FontIcon';
import { loadPermitsByTradeItem } from 'common/reducers/cmsPermit';
import { CIQ_GOODS_LIMITS_TYPE_I, CIQ_GOODS_LIMITS_TYPE_E } from 'common/constants';
import { formatMsg } from '../../../message.i18n';


@injectIntl
@connect(
  state => ({
    tenantId: state.account.tenantId,
    certParams: state.saasParams.latest.certMark,
  }),
  {
    loadPermitsByTradeItem,
  }
)
export default class ItemPermitPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    itemId: PropTypes.number.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    permits: [],
    loading: true,
  }
  componentDidMount() {
    this.props.loadPermitsByTradeItem(this.props.itemId).then((result) => {
      if (!result.error) {
        this.setState({
          permits: result.data,
          loading: false,
        });
      }
    });
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    key: 'sno',
    width: 45,
    align: 'center',
    className: 'table-col-seq',
    render: (o, record, index) => index + 1,
  }, {
    title: '进出口标识',
    dataIndex: 'ie_type',
    width: 100,
    align: 'center',
  }, {
    title: this.msg('涉证标准'),
    width: 100,
    dataIndex: 'permit_category',
    align: 'center',
    render: o => <LogixIcon type={`icon-${o}`} />,
  }, {
    title: this.msg('证书类型'),
    width: 250,
    dataIndex: 'permit_code',
    render: (o, record) => {
      if (record.permit_category === 'customs') {
        const certmark = this.props.certParams.find(cert => cert.cert_code === o);
        if (certmark) {
          return certmark.cert_spec;
        }
      } else {
        const licType = CIQ_GOODS_LIMITS_TYPE_I.concat(CIQ_GOODS_LIMITS_TYPE_E)
          .find(type => type.value === o);
        if (licType) {
          return licType.text;
        }
      }
      return o;
    },
  }, {
    title: this.msg('证书编号'),
    dataIndex: 'permit_no',
    width: 200,
  }, {
    title: this.msg('发证日期'),
    dataIndex: 'start_date',
    width: 120,
    render: (o, record) => (record.start_date ? moment(record.start_date).format('YYYY.MM.DD') : '-'),
  }, {
    title: this.msg('到期日期'),
    dataIndex: 'stop_date',
    width: 120,
    render: (o, record) => (record.stop_date ? moment(record.stop_date).format('YYYY.MM.DD') : '-'),
  }, {
    title: this.msg('总使用次数'),
    width: 120,
    align: 'right',
    dataIndex: 'max_usage',
  }, {
    title: this.msg('剩余使用次数'),
    width: 120,
    align: 'right',
    dataIndex: 'ava_usage',
  }, {
    title: this.msg('permitFile'),
    dataIndex: 'permit_file',
    align: 'center',
    render: (o) => {
      if (o && o !== '') {
        return <a href={o} target="_blank"><Icon type="file-pdf" /></a>;
      }
      return <span />;
    },
  }]
  render() {
    const { permits, loading } = this.state;
    return (
      <DataPane

        columns={this.columns}
        rowKey="id"
        dataSource={permits}
        loading={loading}
      />
    );
  }
}
