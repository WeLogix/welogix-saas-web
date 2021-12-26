import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { Badge, Popover, Tree, Icon } from 'antd';
import { CWM_SHFTZ_OUT_REGTYPES, CWM_SHFTZ_REG_STATUS_INDICATOR, SASBL_REG_TYPES, SASBL_REG_STATUS } from 'common/constants';
import { formatMsg } from '../../message.i18n';

const { TreeNode } = Tree;

@injectIntl
export default class OutboundTreePopover extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    outboundNo: PropTypes.string,
    regType: PropTypes.string,
    bondRegs: PropTypes.arrayOf(PropTypes.shape({ entry_id: PropTypes.string })).isRequired,
    currentKey: PropTypes.string,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  msg = formatMsg(this.props.intl)
  handleSelect = (selectedKeys) => {
    if (!selectedKeys || selectedKeys.length === 0) {
      return;
    }
    const { regType, outboundNo } = this.props;
    let link = '';
    if (selectedKeys[0].indexOf('outbound') !== -1) {
      link = `/cwm/shipping/outbound/${outboundNo}`;
    } else if (selectedKeys[0].indexOf('bond-reg-') !== -1) {
      if (CWM_SHFTZ_OUT_REGTYPES.find(tp => tp.value === regType)) { // 自贸区
        link = regType === 'transfer' ?
          `/cwm/supervision/shftz/transfer/out/${selectedKeys[0].slice(9)}`
          : `/cwm/supervision/shftz/entry/${selectedKeys[0].slice(9)}`;
      } else if (SASBL_REG_TYPES.find(tp => tp.value === regType)) {
        link = `/cwm/sasbl/invtreg/${regType}/e/${selectedKeys[0].slice(9)}`;
      }
    }
    this.context.router.push(link);
  }
  render() {
    const {
      outboundNo, regType, bondRegs, currentKey,
    } = this.props;
    const entRegType = CWM_SHFTZ_OUT_REGTYPES.concat(SASBL_REG_TYPES).filter(regtype =>
      regtype.value === regType)[0];
    const expandedKeys = ['outbound', 'bond-reg'];
    const popoverContent = (
      <div style={{ width: 280 }}>
        {this.msg('jumpTo')}:
        <Tree
          showIcon
          defaultExpandedKeys={expandedKeys}
          onSelect={this.handleSelect}
          selectedKeys={[currentKey]}
        >
          <TreeNode
            icon={<Icon type="export" />}
            title={this.msg('shippingOutbound')}
            key="outbound"
            selectable={false}
          >
            <TreeNode
              icon={<Badge status="" />}
              title={<a role="presentation">{outboundNo}</a>}
              key={`outbound-${outboundNo}`}
            />
          </TreeNode>
          {bondRegs.length > 0 && (
            <TreeNode
              icon={<Icon type="audit" />}
              title={entRegType && entRegType.ftztext}
              key="bond-reg"
              selectable={false}
            >
              {bondRegs.map((reg) => {
                const shftzRegStatus = CWM_SHFTZ_REG_STATUS_INDICATOR.filter(status =>
                  status.value === reg.status)[0];
                const sasblRegStatus = SASBL_REG_STATUS.filter(status =>
                  status.value === reg.invt_status || status.value === reg.stock_status)[0];
                const regStatus = shftzRegStatus || sasblRegStatus;
                return (<TreeNode
                  icon={<Badge status={regStatus && regStatus.badge} />}
                  title={<a role="presentation">{reg.cop_stock_no || reg.cop_invt_no || reg.pre_ftz_rel_no || reg.pre_entry_seq_no}</a>}
                  key={`bond-reg-${reg.cop_stock_no || reg.cop_invt_no || reg.pre_ftz_rel_no || reg.pre_entry_seq_no}`}
                />);
              })}
            </TreeNode>
        )}
        </Tree>
      </div>
    );
    return (
      <Popover content={popoverContent} placement="bottomLeft">
        <a role="presentation"><Icon type="link" /></a>
      </Popover>
    );
  }
}
