import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { Popover, Tree, Icon } from 'antd';
import { formatMsg } from '../../message.i18n';

const { TreeNode } = Tree;

@injectIntl
export default class DeclTreePopover extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    entries: PropTypes.arrayOf(PropTypes.shape({ entry_id: PropTypes.string })).isRequired,
    billSeqNo: PropTypes.string,
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
    const { billSeqNo } = this.props;
    if (selectedKeys[0].indexOf('cus-decl-') !== -1) {
      const pathname = `/clearance/declaration/${selectedKeys[0].slice(9)}`;
      this.context.router.push({ pathname });
    } else if (selectedKeys[0] === 'manifest') {
      const pathname = `/clearance/delegation/manifest/${billSeqNo}`;
      this.context.router.push({ pathname });
    }
  }
  render() {
    const { entries, currentKey } = this.props;
    const expandedKeys = ['cus-decl'];
    const popoverContent = (
      <div style={{ width: 280 }}>
        {this.msg('jumpTo')}:
        <Tree
          showLine
          defaultExpandedKeys={expandedKeys}
          onSelect={this.handleSelect}
          selectedKeys={[currentKey]}
        >
          <TreeNode title={<a role="presentation"><Icon type="file-text" /> {this.msg('declManifest')}</a>} key="manifest">
            {entries.length > 0 && (
            <TreeNode title={this.msg('cusDecl')} key="cus-decl" selectable={false}>
              {entries.map(bme => <TreeNode title={<a role="presentation">{bme.entry_id || bme.pre_entry_seq_no}</a>} key={`cus-decl-${bme.pre_entry_seq_no}`} />)}
            </TreeNode>
        )}
          </TreeNode>
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
