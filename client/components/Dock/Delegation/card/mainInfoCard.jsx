import React from 'react';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { Row, Menu, Col, Card } from 'antd';
import { saveBaseInfo } from 'common/reducers/cmsDelegationDock';
import { GOODSTYPES, TRANS_MODE, CLAIM_DO_AWB } from 'common/constants';
import InfoItem from 'client/components/InfoItem';
import { LogixIcon } from 'client/components/FontIcon';
import { formatMsg } from '../message.i18n';

@injectIntl
@connect(
  state => ({
    delegation: state.cmsDelegationDock.previewer.delegation,

  }),
  { saveBaseInfo }
)
export default class MainInfoCard extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  msg = formatMsg(this.props.intl)
  handleFill = (val, field) => {
    const change = {};
    change[field] = val;
    this.props.saveBaseInfo(change, this.props.delegation.delg_no);
  }
  handleMenuClick = (e) => {
    this.handleFill(e.key, 'goods_type');
  }
  render() {
    const { delegation } = this.props;
    const goods = GOODSTYPES.filter(gt => gt.value === Number(delegation.goods_type))[0];
    const transMode = TRANS_MODE.filter(tm => tm.value === delegation.trans_mode)[0];
    let doAwbText = '';
    if (delegation.trans_mode === '2') {
      if (CLAIM_DO_AWB.notClaimDO.key === delegation.exchanged_doc) {
        doAwbText = CLAIM_DO_AWB.notClaimDO.value;
      } else if (CLAIM_DO_AWB.claimDO.key === delegation.exchanged_doc) {
        doAwbText = CLAIM_DO_AWB.claimDO.value;
      }
    }
    if (delegation.trans_mode === '5') {
      if (CLAIM_DO_AWB.notClaimAWB.key === delegation.exchanged_doc) {
        doAwbText = CLAIM_DO_AWB.notClaimAWB.value;
      } else if (CLAIM_DO_AWB.claimAWB.key === delegation.exchanged_doc) {
        doAwbText = CLAIM_DO_AWB.claimAWB.value;
      }
    }
    return (
      <Card bodyStyle={{ padding: 16 }} >
        <Row gutter={16} className="info-group-underline">
          <Col span={8}>
            <InfoItem
              label="运输方式"
              addonBefore={transMode && <LogixIcon type={transMode.icon} />}
              field={transMode ? transMode.text : ''}
            />
          </Col>
          <Col span={8}>
            <InfoItem
              label="提运单号"
              field={delegation.bl_wb_no}
              dataIndex="bl_wb_no"
              placeholder="添加提运单号"
              editable
              onEdit={this.handleFill}
            />
          </Col>
          <Col span={8}>
            <InfoItem
              label="运输工具名称"
              field={delegation.traf_name}
              editable
              placeholder="添加运输工具名称"
              dataIndex="traf_name"
              onEdit={this.handleFill}
            />
          </Col>
        </Row>
        {
            delegation.trans_mode === '2' &&
            <Row gutter={16} className="info-group-underline">
              <Col span={8}>
                <InfoItem label="是否换单" field={doAwbText} />
              </Col>
              <Col span={8}>
                <InfoItem label="海运单号" field={delegation.swb_no} />
              </Col>
            </Row>
            }
        <Row gutter={16} className="info-group-underline">
          <Col span={8}>
            <InfoItem
              type="dropdown"
              label="货物类型"
              field={goods ? goods.text : ''}
              placeholder="选择货物类型"
              editable
              overlay={<Menu onClick={this.handleMenuClick}>
                {GOODSTYPES.map(gt => (<Menu.Item key={gt.value}>{gt.text}</Menu.Item>))}
              </Menu>}
            />
          </Col>
          <Col span={8}>
            <InfoItem
              label="总件数"
              field={delegation.pieces}
              addonAfter="件"
              editable
              onEdit={this.handleFill}
              dataIndex="pieces"
            />
          </Col>
          <Col span={8}>
            <InfoItem
              type="number"
              label="总重量"
              field={delegation.weight}
              dataIndex="weight"
              addonAfter="千克"
              placeholder="设置总重量"
              editable
              onEdit={this.handleFill}
            />
          </Col>
        </Row>
      </Card>
    );
  }
}
