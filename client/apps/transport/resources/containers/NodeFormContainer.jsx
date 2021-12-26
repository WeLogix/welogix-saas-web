import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Card, message } from 'antd';
import { connect } from 'react-redux';
import connectFetch from 'client/common/decorators/connect-fetch';
import { addNode, editNode, changeRegion, loadNodeList, loadNodeUserList, addNodeUser, editNodeUser, removeNodeUser, updateUserStatus } from 'common/reducers/transportResources';
import connectNav from 'client/common/decorators/connect-nav';
import ContentWrapper from '../components/ContentWrapper';
import NodeForm from '../components/NodeForm';
import NodeUserList from '../components/NodeUserList';

function fetchData({ dispatch, params }) {
  return dispatch(loadNodeUserList(params.node_id || -1));
}

@connectFetch()(fetchData)
@connect(state => ({
  nodes: state.transportResources.nodes,
  nodeType: state.transportResources.nodeType,
  region: state.transportResources.region,
  tenantId: state.account.tenantId,
  nodeUsers: state.transportResources.nodeUsers,
  partners: state.shipment.partners.concat([{
    partner_code: '',
    name: '公用',
    id: -1,
  }]),
}), {
  addNode,
  editNode,
  loadNodeList,
  changeRegion,
  addNodeUser,
  editNodeUser,
  removeNodeUser,
  updateUserStatus,
})
@connectNav({
  depth: 3,
  text: '地点管理',
  moduleName: 'transport',
})
@Form.create()
export default class NodeFormConainer extends Component {
  static propTypes = {
    nodes: PropTypes.arrayOf(PropTypes.shape({})).isRequired, // 节点数组
    nodeType: PropTypes.number.isRequired, // 当前正在操作的节点类型,根据这个值向后台插入具体的node type
    addNode: PropTypes.func.isRequired, // 增加node的action creator
    editNode: PropTypes.func.isRequired, // 更新node的action creator
    changeRegion: PropTypes.func.isRequired, // region级联选项改变时发生的action creator
    region: PropTypes.shape({}).isRequired, // 代表级联选项的值
    tenantId: PropTypes.number.isRequired,
    nodeUsers: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    addNodeUser: PropTypes.func.isRequired,
    editNodeUser: PropTypes.func.isRequired,
    removeNodeUser: PropTypes.func.isRequired,
    updateUserStatus: PropTypes.func.isRequired,
    partners: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    if (this.props.nodes.length === 0) {
      this.props.loadNodeList(this.props.tenantId);
    }
  }
  handleAddNode = (e) => {
    e.preventDefault();
    const {
      form, nodeType, tenantId, region,
    } = this.props;
    const nodeInfoInForm = form.getFieldsValue();
    const nodeInfo = Object.assign(
      {}, nodeInfoInForm,
      region, { type: nodeType, tenant_id: tenantId }
    );
    this.props.addNode(nodeInfo).then(() => {
      this.context.router.goBack();
    });
  }
  handleEditNode = (e) => {
    e.preventDefault();
    const { form, params, region } = this.props;
    const nodeInfoInForm = form.getFieldsValue();
    if (nodeInfoInForm.ref_partner_id === undefined) {
      message.warn('关联方必填');
    } else {
      const refPartnerName = this.props.partners.find(item =>
        item.id === nodeInfoInForm.ref_partner_id).name;
      const nodeInfo = { ...nodeInfoInForm, ...region, ref_partner_name: refPartnerName };
      const nodeId = params.node_id;
      this.props.editNode({ nodeId, nodeInfo }).then(() => {
        this.context.router.goBack();
      });
    }
  }
  handleRegionChange = (value) => {
    const [code, province, city, district, street] = value;
    const region = Object.assign({}, {
      region_code: code, province, city, district, street,
    });
    this.props.changeRegion(region);
  }
  render() {
    const { form, params, nodes } = this.props;
    if (params.node_id) {
      const editNodeId = parseInt(params.node_id, 10);
      const editNodeInfo = nodes.find(node => node.node_id === editNodeId);
      if (!editNodeInfo) {
        return null;
      }
      const {
        province, city, district, street,
      } = editNodeInfo;
      const region = [province, city, district, street];
      return (
        <ContentWrapper>
          <Row>
            <Col span={12}>
              <Card title="地点信息" style={{ margin: '0 12px 24px 24px' }}>
                <NodeForm
                  mode="edit"
                  form={form}
                  node={editNodeInfo}
                  region={region}
                  changeRegion={this.props.changeRegion}
                  onRegionChange={this.handleRegionChange}
                  onSubmitBtnClick={this.handleEditNode}
                  style={{ width: '100%' }}
                />
              </Card>
            </Col>
            <Col span={12}>
              <NodeUserList
                node={editNodeInfo}
                tenantId={this.props.tenantId}
                nodeUsers={this.props.nodeUsers}
                addNodeUser={this.props.addNodeUser}
                eitNodeUser={this.props.editNodeUser}
                removeNodeUser={this.props.removeNodeUser}
                updateUserStatus={this.props.updateUserStatus}
              />
            </Col>
          </Row>
        </ContentWrapper>
      );
    }
    return (
      <ContentWrapper>
        <NodeForm
          mode="add"
          form={form}
          onRegionChange={this.handleRegionChange}
          onSubmitBtnClick={this.handleAddNode}
        />
      </ContentWrapper>
    );
  }
}
