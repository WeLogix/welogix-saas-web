import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import './style.less';

export default function FullscreenModal(props) {
  const {
    children, visible, title, onSave, onCancel, onClose, extra,
    saveDisabled, saveLoading, noBodyPadding, saveText = '保存', cancelText = '取消',
  } = props;
  const header = (<div>
    <span>{title}</span>
    <div className="toolbar-right">
      {extra}
      {onCancel && <Button onClick={onCancel}>{cancelText}</Button>}
      {onSave && <Button type="primary" disabled={saveDisabled} loading={saveLoading} onClick={onSave}>{saveText}</Button>}
      {onClose && <Button shape="circle" icon="close" onClick={onClose} />}
    </div>
  </div>);
  return (
    <Modal
      maskClosable={false}
      title={header}
      width="100%"
      wrapClassName="fullscreen-modal"
      closable={false}
      visible={visible}
      footer={null}
      destroyOnClose
      bodyStyle={noBodyPadding && { padding: 0, paddingTop: 64 }}
    >
      {children}
    </Modal>
  );
}
FullscreenModal.props = {
  baseCls: PropTypes.string,
  children: PropTypes.node,
  title: PropTypes.node,
  extra: PropTypes.node,
  onSave: PropTypes.func,
  saveText: PropTypes.string,
  saveDisabled: PropTypes.bool,
  saveLoading: PropTypes.bool,
  onCancel: PropTypes.func,
  cancelText: PropTypes.string,
  onClose: PropTypes.func,
  visible: PropTypes.bool,
  noBodyPadding: PropTypes.bool,
};
