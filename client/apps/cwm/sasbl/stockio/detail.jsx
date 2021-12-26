import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { Tabs, Button, Form, Layout, message, Popconfirm, Tooltip, Badge } from 'antd';
import { connect } from 'react-redux';
import connectNav from 'client/common/decorators/connect-nav';
import PageHeader from 'client/components/PageHeader';
import PageContent from 'client/components/PageContent';
import MagicCard from 'client/components/MagicCard';
import { CWM_OUTBOUND_STATUS_INDICATOR, SW_JG2_SENDTYPE } from 'common/constants';
import { loadStockHead, notifyFormChanged, updateStockHead, showSendSwJG2File } from 'common/reducers/cwmSasblReg';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import InboundTreePopover from '../../common/popover/inboundTreePopover';
import OutboundTreePopover from '../../common/popover/outboundTreePopover';
import SasblBodyDetailPane from '../common/sasblBodyDetailPane';
import StockIoHeadPane from './tabpane/stockIoHeadPane';
import SendSwJG2FileModal from '../common/modals/sendSwJG2FileModal';
import { formatMsg } from '../message.i18n';

const { TabPane } = Tabs;

@injectIntl
@connect(state => ({
  whseCode: state.cwmContext.defaultWhse.code,
  brokers: state.cwmContext.whseAttrs.brokers,
  formChanged: state.cwmBlBook.formChanged,
  stockData: state.cwmSasblReg.stockData,
  ioboundHead: state.cwmSasblReg.ioboundHead,
}), {
  loadStockHead, notifyFormChanged, updateStockHead, showSendSwJG2File,
})
@connectNav({
  depth: 3,
  moduleName: 'cwm',
  title: 'featCwmSasbl',
  jumpOut: true,
})
@Form.create({ onValuesChange: props => props.notifyFormChanged(true) })
export default class BondedStockIoDetail extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func,
    }).isRequired,
    formChanged: PropTypes.bool.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    selectedKey: 'stockHead',
  }
  componentDidMount() {
    this.handleLoadHead();
  }
  componentWillReceiveProps(nextProps) {
    const { params, whseCode } = nextProps;
    if (whseCode !== this.props.whseCode) {
      this.props.loadStockHead(params.stockioNo, whseCode);
    }
  }
  msg = formatMsg(this.props.intl);
  handleCancel = () => {
    const { supType, ieType } = this.props.params;
    this.props.notifyFormChanged(false);
    this.context.router.push(`/cwm/sasbl/stockio/${supType}/${ieType}`);
  }
  handleLoadHead = () => {
    const { params, whseCode } = this.props;
    if (params.stockioNo && whseCode) {
      const copStockNo = params.stockioNo;
      this.props.loadStockHead(copStockNo, whseCode);
    }
  }
  handleSendMsg = (decType) => {
    const { stockData } = this.props;
    this.props.showSendSwJG2File({
      visible: true,
      copNo: stockData.cop_stock_no,
      agentCode: stockData.declarer_scc_code,
      regType: 'stock',
      sendFlag: SW_JG2_SENDTYPE.SAS,
      decType: decType || stockData.stock_dectype,
    });
  }
  handleMenuItemClick = (key) => {
    this.setState({ selectedKey: key });
  }
  handleSubmit = () => {
    this.props.form.validateFields((errors) => {
      if (errors) {
        message.error('数据校验失败');
      } else {
        const editForm = this.props.form.getFieldsValue();
        const { stockData, whseCode } = this.props;
        const data = {
          id: stockData.id,
          sasbl_apply_no: editForm.sasbl_apply_no,
          owner_cus_code: editForm.owner_cus_code,
          owner_scc_code: editForm.owner_scc_code,
          owner_name: editForm.owner_name,
          blbook_no: editForm.blbook_no,
          declarer_scc_code: editForm.declarer_scc_code,
          declarer_cus_code: editForm.declarer_cus_code,
          declarer_name: editForm.declarer_name,
          stock_ioflag: editForm.stock_ioflag,
          stock_biztype: editForm.stock_biztype,
          rlt_invtreg_no: editForm.rlt_invtreg_no,
          rlt_stockio_no: editForm.rlt_stockio_no,
          sio_pieces: editForm.sio_pieces,
          sio_wrap_type: editForm.sio_wrap_type,
          sio_netwt: editForm.sio_netwt,
          sio_grosswt: editForm.sio_grosswt,
          sio_remark: editForm.sio_remark,
          declarer_person: editForm.declarer_person,
          master_customs: editForm.master_customs,
          sio_replace_mark: editForm.sio_replace_mark,
          typing_cus_code: editForm.typing_cus_code,
          typing_scc_code: editForm.typing_scc_code,
          typing_name: editForm.typing_name,
        };
        this.props.updateStockHead(data).then((result) => {
          if (result.error) {
            message.error(result.error.message, 10);
          } else {
            this.props.notifyFormChanged(false);
            message.success(this.msg('savedSucceed'));
          }
          this.props.loadStockHead(editForm.cop_stock_no, whseCode);
        });
      }
    });
  }
  handleOutboundPage = () => {
    this.context.router.push(`/cwm/shipping/outbound/${this.props.ioboundHead.outbound_no}`);
  }
  render() {
    const { formChanged, stockData, ioboundHead } = this.props;
    const { supType, ieType, stockioNo } = this.props.params;
    const { selectedKey } = this.state;
    const readonly = Boolean(!(
      // stockData.stock_status === 1 ||
      // (stockData.stock_status === 3 && stockData.sent_status === 0) ||
      stockData.sent_status === 0));
    const validOutbound = ioboundHead && ioboundHead.outbound_no;
    const outbStatus = validOutbound && CWM_OUTBOUND_STATUS_INDICATOR.filter(status =>
      status.value === ioboundHead.status)[0];
    return (
      <Layout>
        <PageHeader
          breadcrumb={[
            this.msg('cosmtnStockOut'),
            stockioNo,
            ieType === 'i' && ioboundHead && (
              <InboundTreePopover
                inboundNo={ioboundHead.inbound_no}
                regType={supType}
                bondRegs={[stockData]}
                currentKey={`bond-reg-${stockioNo}`}
              />
            ),
            ieType === 'e' && ioboundHead && (
              <OutboundTreePopover
                outboundNo={ioboundHead.outbound_no}
                regType={supType}
                bondRegs={[stockData]}
                currentKey={`bond-reg-${stockioNo}`}
              />
            ),
          ]}
        >
          <PageHeader.Nav>
            {validOutbound && (
              <Tooltip title="关联出库单" placement="bottom">
                <Button icon="link" onClick={this.handleOutboundPage}>
                  <Badge status={outbStatus.badge} text={outbStatus.text} />
                </Button>
              </Tooltip>
            )}
          </PageHeader.Nav>
          <PageHeader.Actions>
            {stockData.stock_status === 4 && (
              <PrivilegeCover module="cwm" feature="supervision" action="edit">
                <Button
                  type="primary"
                  icon="mail"
                  onClick={() => this.handleSendMsg('3')}
                  loading={stockData.sent_status === 1}
                >
                  {this.msg('delDecl')}
                </Button>
              </PrivilegeCover>
            )}
            {!readonly && (
              <PrivilegeCover module="cwm" feature="supervision" action="edit">
                <Button
                  type="primary"
                  icon="mail"
                  onClick={() => this.handleSendMsg('1')}
                  loading={stockData.sent_status === 1}
                  disabled={formChanged}
                >
                  {this.msg('regDecl')}
                </Button>
              </PrivilegeCover>
            )}
            <PrivilegeCover module="cwm" feature="supervision" action="edit">
              <Button type="primary" onClick={this.handleSubmit} disabled={!formChanged}>
                {this.msg('save')}
              </Button>
            </PrivilegeCover>
            {formChanged ? (
              <Popconfirm title={this.msg('confirmCancel')} onConfirm={this.handleCancel}>
                <Button>{this.msg('cancel')}</Button>
              </Popconfirm>
            ) : (
              <Button onClick={this.handleCancel}>{this.msg('cancel')}</Button>
            )}
          </PageHeader.Actions>
        </PageHeader>
        <PageContent readonly={readonly}>
          <MagicCard bodyStyle={{ padding: 0 }}>
            <Tabs activeKey={selectedKey} onChange={this.handleMenuItemClick}>
              <TabPane tab={this.msg('stockHead')} key="stockHead">
                <StockIoHeadPane
                  form={this.props.form}
                  readonly={readonly}
                  reload={this.handleLoadHead}
                />
              </TabPane>
              <TabPane tab={this.msg('stockBody')} key="stockBody">
                <SasblBodyDetailPane
                  readonly={readonly}
                  form={this.props.form}
                  copSasblNo={this.props.params.stockioNo}
                  blType="stock"
                  preSasblNo={stockData && stockData.pre_sasbl_seqno}
                />
              </TabPane>
            </Tabs>
          </MagicCard>
        </PageContent>
        <SendSwJG2FileModal reload={this.handleLoadHead} />
      </Layout>
    );
  }
}
