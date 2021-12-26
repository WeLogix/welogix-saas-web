import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown, Icon, Menu, Modal, Popconfirm, Popover, Tooltip } from 'antd';
import './style.less';

export default class RowAction extends Component {
  static propTypes = {
    label: PropTypes.node,
    icon: PropTypes.string,
    shape: PropTypes.string,
    size: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    onHover: PropTypes.func,
    onConfirm: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    delConfirm: PropTypes.string,
    row: PropTypes.shape({ id: PropTypes.number }),
    index: PropTypes.number,
    tooltip: PropTypes.string,
    confirm: PropTypes.string,
    primary: PropTypes.bool,
    danger: PropTypes.bool,
    success: PropTypes.bool,
    silent: PropTypes.bool,
    overlay: PropTypes.node,
    popover: PropTypes.node,
    href: PropTypes.bool,
  }
  static defaultProps = {
    size: 'small',
  }
  handleClick = (ev) => {
    if (this.props.onClick) {
      ev.preventDefault();
      ev.stopPropagation();
      this.props.onClick(this.props.row, this.props.index, this.props);
    }
  }
  handleHover = () => {
    if (this.props.onHover) {
      this.props.onHover(this.props.row, this.props.index);
    }
  }
  handleConfirm = () => {
    if (this.props.onConfirm) {
      this.props.onConfirm(this.props.row, this.props.index);
    }
  }
  handleDropdownMenuClick = (ev) => {
    if (ev.key === 'edit' && this.props.onEdit) {
      this.props.onEdit(this.props.row);
    } else if (ev.key === 'delete' && this.props.onDelete) {
      const self = this;
      Modal.confirm({
        title: '确定要删除?',
        content: this.props.delConfirm || '',
        onOk() {
          self.props.onDelete(self.props.row, self.props.index);
        },
        okText: '删除',
        okType: 'danger',
        onCancel() {
        },
      });
    }
  }
  renderButton = () => {
    const {
      label, primary, danger, success, silent, overlay,
      icon, shape, size, disabled, onEdit, onDelete, href,
    } = this.props;
    let type = 'default';
    if (primary) {
      type = 'primary';
    } else if (danger) {
      type = 'danger';
    }
    if (href) {
      return <a role="presentation" onClick={this.handleClick}>{icon && <Icon type={icon} />}{label}</a>;
    }
    if (onEdit || onDelete) {
      const dropdownMenu = (<Menu onClick={this.handleDropdownMenuClick}>
        {onEdit && <Menu.Item key="edit"><Icon type="edit" /> 编辑</Menu.Item>}
        {onDelete && <Menu.Item key="delete"><Icon type="delete" /> 删除</Menu.Item>}
      </Menu>);
      return (<Dropdown overlay={dropdownMenu} placement="bottomRight" trigger={['click']}>
        <Button
          shape={shape}
          disabled={disabled}
          size={size}
          className="welo-row-action"
        >
          <Icon type={icon || 'down'} />
        </Button>
      </Dropdown>);
    }
    return overlay ?
      (<Dropdown overlay={overlay} placement="bottomRight" trigger={['click']}>
        <Button
          shape={shape}
          disabled={disabled}
          size={size}
          className="welo-row-action"
        >
          <Icon type={icon || 'down'} />
        </Button>
      </Dropdown>)
      :
      (<Button
        type={type}
        shape={shape}
        size={size}
        ghost={primary}
        disabled={disabled}
        icon={icon}
        onClick={this.handleClick}
        onMouseEnter={this.handleHover}
        className={`welo-row-action ${success && 'success'} ${silent && 'silent'}`}
      >
        {label}
      </Button>);
  }
  renderButtonWrapper = () => {
    const { confirm, popover } = this.props;
    if (confirm) {
      return (<Popconfirm title={confirm} placement="left" onConfirm={this.handleConfirm} okText="是" cancelText="否">
        {this.renderButton()}
      </Popconfirm>);
    } else if (popover) {
      return (<Popover trigger="click" content={popover} placement="left">
        {this.renderButton()}
      </Popover>);
    }
    return this.renderButton();
  }

  render() {
    const { tooltip } = this.props;
    if (tooltip) {
      return (<Tooltip title={tooltip}>
        {this.renderButtonWrapper()}
      </Tooltip>);
    }
    return this.renderButtonWrapper();
  }
}
