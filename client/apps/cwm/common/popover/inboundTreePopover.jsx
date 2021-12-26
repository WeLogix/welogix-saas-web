import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { Badge, Popover, Tree, Icon } from 'antd';
import {
  CWM_INBOUND_STATUS_INDICATOR, CWM_SHFTZ_IN_REGTYPES, CWM_SHFTZ_REG_STATUS_INDICATOR,
  SASBL_REG_TYPES, SASBL_REG_STATUS,
} from 'common/constants';
import { formatMsg } from '../../message.i18n';

const { TreeNode } = Tree;

@injectIntl
export default class InboundTreePopover extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    regType: PropTypes.string,
    inbound: PropTypes.shape({ inbound_no: PropTypes.string }).isRequired,
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
    const { regType, inbound } = this.props;
    let link = '';
    if (selectedKeys[0].indexOf('inbound') !== -1) {
      link = `/cwm/receiving/inbound/${inbound.inbound_no}`;
    } else if (selectedKeys[0].indexOf('bond-reg-') !== -1) {
      if (CWM_SHFTZ_IN_REGTYPES.find(tp => tp.value === regType)) { // 自贸区
        if (regType === 'transfer') {
          link = `/cwm/supervision/shftz/transfer/in/${selectedKeys[0].slice(9)}`;
        } else {
          link = `/cwm/supervision/shftz/entry/${selectedKeys[0].slice(9)}`;
        }
      } else if (SASBL_REG_TYPES.find(tp => tp.value === regType)) {
        link = `/cwm/sasbl/invtreg/${regType}/i/${selectedKeys[0].slice(9)}`;
      }
    }
    this.context.router.push(link);
  }
  render() {
    const {
      regType, inbound, bondRegs, currentKey,
    } = this.props;
    const entRegType = CWM_SHFTZ_IN_REGTYPES.concat(SASBL_REG_TYPES).filter(regtype =>
      regtype.value === regType)[0];
    const inboundStatus = CWM_INBOUND_STATUS_INDICATOR.filter(status =>
      status.value === inbound.inbound_status || status.value === inbound.status)[0];
    const expandedKeys = ['inbound', 'bond-reg'];
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
            icon={<Icon type="import" />}
            title={this.msg('receivingInbound')}
            key="inbound"
            selectable={false}
          >
            <TreeNode
              icon={inboundStatus && <Badge status={inboundStatus.badge} />}
              title={<a role="presentation">{inbound.inbound_no}</a>}
              key={`inbound-${inbound.inbound_no}`}
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
                  status.value === reg.reg_status || status.value === reg.status)[0];
                const sasblRegStatus = SASBL_REG_STATUS.filter(status =>
                  status.value === reg.invt_status || status.value === reg.stock_status)[0];
                const regStatus = shftzRegStatus || sasblRegStatus;
                return (<TreeNode
                  icon={<Badge status={regStatus && regStatus.badge} />}
                  title={<a role="presentation">{reg.ftz_ent_no || reg.cus_decl_no || reg.pre_ftz_ent_no || reg.cop_invt_no}</a>}
                  key={`bond-reg-${reg.pre_entry_seq_no || reg.pre_ftz_ent_no || reg.cop_invt_no}`}
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
