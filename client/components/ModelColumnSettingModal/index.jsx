import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Transfer } from 'antd';
import { connect } from 'react-redux';
import WithDragDropContext from 'client/common/decorators/WithDragDropContext';
import { loadTenantBMFields, upsertTenantBMObj, toggleColumnSettingModal, loadSourceDwFields } from 'common/reducers/paasBizModelMeta';
import DragItem from './DragItem';

@WithDragDropContext
@connect(state => ({
  visible: state.paasBizModelMeta.transferModal.visible,
  bmObjFields: state.paasBizModelMeta.bmObjs,
}), {
  toggleColumnSettingModal,
  loadSourceDwFields,
  loadTenantBMFields,
  upsertTenantBMObj,
})
export default class ModelColumnSettingModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    targetObj: PropTypes.string.isRequired,
    fromSubject: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    fromFlatTable: PropTypes.string,
  }
  state = {
    targetKeys: [],
    dataSource: [],
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && nextProps.visible !== this.props.visible) {
      this.props.loadSourceDwFields(nextProps.targetObj, nextProps.fromFlatTable || 'sof_global_detail').then((result) => {
        if (!result.error) {
          this.setState({
            dataSource: result.data,
            targetKeys: nextProps.bmObjFields.map(f => f.bm_field),
          });
        }
      });
    }
  }
  handleChange = (keys) => {
    this.setState({ targetKeys: keys });
  }
  filterOption = (inputValue, option) => {
    const reg = new RegExp(inputValue);
    return reg.test(option.bmf_label_name) || reg.test(option.bmf_default_name);
  }
  handleCancel = () => {
    this.props.toggleColumnSettingModal(false);
  }
  handleOk = () => {
    const { targetObj, fromSubject } = this.props;
    this.props.upsertTenantBMObj(this.state.targetKeys, targetObj, fromSubject).then((result) => {
      if (!result.error) {
        this.props.loadTenantBMFields(targetObj);
        this.handleCancel();
      }
    });
  }
  handleSwapItem = (dragIndex, hoverIndex) => {
    const { targetKeys } = this.state;
    const newTargetKeys = [...targetKeys];
    newTargetKeys[dragIndex] = targetKeys[hoverIndex];
    newTargetKeys[hoverIndex] = targetKeys[dragIndex];
    this.setState({ targetKeys: newTargetKeys });
  }
  renderTransferItem = (item) => {
    const title = item.bmf_label_name || item.bmf_default_name;
    const targetIndex = this.state.targetKeys.findIndex(key => key === item.bm_field);
    return targetIndex >= 0 ? (<DragItem
      id={item.bm_field}
      key={item.bm_field}
      index={targetIndex}
      checked={item.checked}
      title={title}
      swapItem={this.handleSwapItem}
      onChange={this.handleCheckBoxChange}
      onFixed={this.fixedColumns}
      fixed={item.fixed}
    />) : title;
  }
  render() {
    const { visible } = this.props;
    const {
      targetKeys, dataSource,
    } = this.state;
    return (
      <Modal
        maskClosable={false}
        title={this.props.title}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        width={695}
      >
        <Transfer
          dataSource={dataSource}
          titles={['可选', '已选']}
          targetKeys={targetKeys}
          onChange={this.handleChange}
          filterOption={this.filterOption}
          render={this.renderTransferItem}
          rowKey={item => item.bm_field}
          showSearch
          listStyle={{
            width: 300,
            height: 400,
          }}
        />
      </Modal>
    );
  }
}
