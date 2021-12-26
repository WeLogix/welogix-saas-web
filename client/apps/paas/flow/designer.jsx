/* eslint no-console: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import connectFetch from 'client/common/decorators/connect-fetch';
import { intlShape, injectIntl } from 'react-intl';
import { Button, Card, Drawer, Spin, Radio, Tooltip, message, Modal, Input, Form } from 'antd';
import { toggleFlowList, loadFlow, loadVendorTenants, openSubFlowAuthModal, deleteFlow, loadFlowGraph, loadFlowGraphItem, saveFlowGraph, setNodeActions, loadTmsBizParams, cloneFlow, toggleReload } from 'common/reducers/scofFlow';
import { loadFormRequires } from 'common/reducers/sofOrders';
import { loadPartners } from 'common/reducers/partner';
import { uuidWithoutDash } from 'client/common/uuid';
import { LogixIcon } from 'client/components/FontIcon';
import { PARTNER_ROLES } from 'common/constants';
import FlowSettingModal from './modal/flowSettingModal';
import AddTriggerModal from './panel/compose/addTriggerModal';
import FlowEdgePanel from './panel/flowEdgePanel';
import BizObjCMSPanel from './panel/bizObjCMSPanel';
import BizObjTMSPanel from './panel/bizObjTMSPanel';
import BizObjCWMRecPanel from './panel/bizObjCWMRecPanel';
import BizObjCWMShipPanel from './panel/bizObjCWMShipPanel';
import BizObjPTSPanel from './panel/bizObjPTSPanel';
import { formatMsg } from './message.i18n';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const FormItem = Form.Item;

const NodeKindPanelMap = {
  import: BizObjCMSPanel,
  export: BizObjCMSPanel,
  tms: BizObjTMSPanel,
  cwmrec: BizObjCWMRecPanel,
  cwmship: BizObjCWMShipPanel,
  ptsimp: BizObjPTSPanel,
  ptsexp: BizObjPTSPanel,
  terminal: null,
};

function fetchData({ state, dispatch }) {
  const promises = [
    dispatch(loadFormRequires({ tenantId: state.account.tenantId })),
    dispatch(loadTmsBizParams(state.account.tenantId)),
  ];
  return Promise.all(promises);
}

@connectFetch()(fetchData)
@injectIntl
@connect(
  state => ({
    // trackingFields: state.scofFlow.trackingFields,
    flowGraph: state.scofFlow.flowGraph,
    submitting: state.scofFlow.submitting,
    graphLoading: state.scofFlow.graphLoading,
    listCollapsed: state.scofFlow.listCollapsed,
    tenantId: state.account.tenantId,
    designerVisible: state.scofFlow.flowDesigner.visible,
    currentFlow: state.scofFlow.currentFlow,
  }),
  {
    toggleFlowList,
    loadFlow,
    loadVendorTenants,
    loadPartners,
    openSubFlowAuthModal,
    deleteFlow,
    loadFlowGraph,
    loadFlowGraphItem,
    saveFlowGraph,
    setNodeActions,
    cloneFlow,
    toggleReload,
  }
)
@Form.create()
export default class FlowDesigner extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    submitting: PropTypes.bool,
    graphLoading: PropTypes.bool.isRequired,
    /*
    trackingFields: PropTypes.arrayOf(PropTypes.shape({
      field: PropTypes.string,
      title: PropTypes.string,
      module: PropTypes.oneOf(['cms', 'tms', 'cwmrec', 'cwmship']),
    })),
    */
    currentFlow: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      main_flow_id: PropTypes.number,
      customer_partner_id: PropTypes.number,
      customer_tenant_id: PropTypes.number,
      // tracking_id: PropTypes.number,
    }).isRequired,
  }
  constructor(...args) {
    super(...args);
    this.state = {
      activeItem: null,
      // trackDataSource: this.props.trackingFields.map(tf => ({
      //  title: tf.title, field: tf.field, module: tf.module, node: null,
      // })),
      // trackings: [],
      // trackingId: null,
      // nodes: [],
      visibleCloneModal: false,
      composePanelVisible: false,
      nodeRadioKey: '',
    };
    this.trackingFieldTypeMapNodeKinds = {
      cms: ['import', 'export'],
      tms: ['tms'],
      cwmrec: ['cwmrec'],
      cwmship: ['cwmship'],
    };

    this.beginAdd = false;
    this.dragging = false;
    this.formhoc = null;
  }

  componentDidMount() {
    if (typeof document !== 'undefined' && typeof window !== 'undefined') {
      this.setState({
        contentHeight: window.innerHeight - 216,
      });
    }
    this.props.loadFlow(this.props.currentFlow.id);
    this.props.loadFlowGraph(
      this.props.currentFlow.id,
      this.props.currentFlow.main_flow_id
    );
    if (!this.props.main_flow_id) {
      this.props.loadVendorTenants();
      this.props.loadPartners({ role: [PARTNER_ROLES.CUS, PARTNER_ROLES.SUP] });
    }
    this.graph = new window.G6.Graph({
      id: 'flowchart', // 容器ID
      width: window.innerWidth - 40, // 画布宽
      height: window.innerHeight - 200, // 画布高
      grid: {
        forceAlign: true, // 是否支持网格对齐
        cell: 10, // 网格大小
      },
    });
    const nodeColorMap = {
      import: 'red',
      export: 'green',
      tms: 'blue',
      cwmrec: 'purple',
      cwmship: 'yellow',
      ptsimp: 'orange',
      ptsexp: 'olivedrab',
      terminal: 'black',
    };
    this.graph.node().label('name', name => name);
    this.graph.node().size('kind', kind => (kind === 'terminal' ? 20 : [100, 50]));
    this.graph.node().color('kind', kind => nodeColorMap[kind]);
    this.graph.node().shape('kind', kind => (kind === 'terminal' ? 'circle' : 'rect'));
    this.graph.edge().shape('', () => 'smoothArrow');
    const data = {
      nodes: this.props.flowGraph.nodes.map(node => ({ ...node, actions: [] })),
      edges: this.props.flowGraph.edges.map(edge => ({
        ...edge, addedConds: [], delConds: [], updConds: [],
      })),
    };
    this.graph.source(data.nodes, data.edges);
    this.graph.render();
    this.graph.on('mouseup', (ev) => {
      console.log('mouseup', ev, this.beginAdd);
      if (this.beginAdd) {
        this.beginAdd = false;
        return;
      }
      const { item } = ev;
      const { tenantId } = this.props;
      if (item && item.get('type') === 'node' && item.get('model').tenant_id !== tenantId
        && item.get('model').provider_tenant_id !== tenantId) {
        this.setState({ activeItem: null, composePanelVisible: false });
        return;
      }
      if (this.state.activeItem) {
        if (item && this.state.activeItem.get('id') === item.get('id')) {
          return;
        }
        this.handleActiveValidated(item);
      } else {
        this.handleNewItemLoad(item);
      }
    });
    this.graph.on('afterAdd', (ev) => {
      console.log('afteradd', ev);
      const { item } = ev;
      this.graph.update(item, { loaded: true });
      if (item.get('type') === 'edge') {
        /*
        const source = item.get('source');
        const target = item.get('target');
        this.graph.update(source, { out_degree: source.get('model').out_degree + 1 });
        this.graph.update(target, { in_degree: target.get('model').in_degree + 1 }); */
      } else if (item.get('type') === 'node') {
        this.props.setNodeActions([]);
        // 类型节点只有一个时候,该类型追踪点对应该节点
        /*
        const ftkeys = Object.keys(this.trackingFieldTypeMapNodeKinds);
        // let fieldType;
        let nodeKinds = [];
        for (let i = 0; i < ftkeys.length; i++) {
          const ftkey = ftkeys[i];
          if (this.trackingFieldTypeMapNodeKinds[ftkey].indexOf(item.get('model').kind) !== -1) {
            fieldType = ftkey;
            nodeKinds = this.trackingFieldTypeMapNodeKinds[ftkey];
            break;
          }
        }
        const nodes = this.graph.get('items').filter(gitem =>
           gitem.get('type') === 'node' && nodeKinds.indexOf(gitem.get('model').kind) !== -1);
        if (nodes.length === 1) {
          // const nodeId = nodes[0].get('model').id;
          const dataSource = this.state.trackDataSource.map((ds) => {
            if (ds.module === fieldType) {
              return { ...ds, node: nodeId };
            }
            return ds;
          });
          // this.setState({ trackDataSource: dataSource });
        }
        */
      }
      this.setState({ activeItem: item });
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.designerVisible) {
      if (nextProps.currentFlow.id !== this.props.currentFlow.id) {
        this.setState({
          activeItem: null,
          composePanelVisible: false,
          /* trackingId: nextProps.currentFlow.tracking_id,
          trackDataSource: this.props.trackingFields.map(tf => ({
            title: tf.title, field: tf.field, module: tf.module, node: null,
          })),
          */
        });
        this.props.loadFlow(nextProps.currentFlow.id);
        this.props.loadFlowGraph(nextProps.currentFlow.id, nextProps.currentFlow.main_flow_id);
      }
      /*
      if (nextProps.currentFlow.customer_tenant_id === -1) {
        this.setState({ trackings: [] });
      } else if (nextProps.currentFlow.customer_tenant_id
        !== this.props.currentFlow.customer_tenant_id) {
        this.props.loadScvTrackings(nextProps.currentFlow.customer_tenant_id).then((result) => {
          if (!result.error) {
            this.setState({ trackings: result.data });
          } else {
            this.setState({ trackings: [] });
          }
        });
      }
      */
      if (nextProps.flowGraph !== this.props.flowGraph) {
        const data = {
          nodes: nextProps.flowGraph.nodes.map(node => ({ ...node, actions: [] })),
          edges: nextProps.flowGraph.edges.map(edge => ({
            ...edge, addedConds: [], delConds: [], updConds: [],
          })),
        };
        this.graph.changeData(data.nodes, data.edges);
        /* const dataSource = [...this.state.trackDataSource];
        for (let i = 0; i < dataSource.length; i++) {
          const ds = dataSource[i];
          if (nextProps.flowGraph.tracking[ds.field]) {
            ds.node = nextProps.flowGraph.tracking[ds.field];
          }
        }
        */
        // this.setState({ trackDataSource: dataSource });
      }
    }
  }
  msg = formatMsg(this.props.intl)
  addNode = (key) => {
    this.graph.changeMode('add');
    const id = uuidWithoutDash();
    let kind;
    switch (key) {
      case 'nodeimport':
        kind = 'import';
        break;
      case 'nodeexport':
        kind = 'export';
        break;
      case 'nodetms':
        kind = 'tms';
        break;
      case 'nodecwmrec':
        kind = 'cwmrec';
        break;
      case 'nodecwmship':
        kind = 'cwmship';
        break;
      case 'nodeptsimp':
        kind = 'ptsimp';
        break;
      case 'nodeptsexp':
        kind = 'ptsexp';
        break;
      case 'nodeterminal':
        kind = 'terminal';
        break;
      default:
        break;
    }
    if (kind) {
      const { tenantId } = this.props;
      this.graph.beginAdd('node', {
        id,
        kind,
        actions: [],
        in_degree: 0,
        out_degree: 0,
        name: kind !== 'terminal' ? `节点${this.graph.get('items').filter(item => item.get('type') === 'node').length + 1}` : undefined,
        // demander_tenant_id: currentFlow.customer_tenant_id || tenantId,
        // demander_partner_id: currentFlow.customer_partner_id,
        provider_tenant_id: tenantId,
        tenant_id: tenantId,
      });
      this.graph.refresh();
    }
  }
  addEdge = () => {
    this.graph.changeMode('add');
    const id = uuidWithoutDash();
    this.graph.beginAdd('edge', {
      id, conditions: [], addedConds: [], delConds: [], updConds: [],
    });
    this.graph.refresh();
  }
  /*
  handleTrackNodeChange = (nodeId, field) => {
    const dataSource = [...this.state.trackDataSource];
    for (let i = 0; i < dataSource.length; i++) {
      if (dataSource[i].field === field) {
        dataSource[i].node = nodeId;
        break;
      }
    }
    this.setState({ trackDataSource: dataSource });
  }
  */
  handleAddToolbarNode = (ev) => {
    this.beginAdd = true;
    const { activeItem } = this.state;
    if (activeItem && this.formhoc) {
      this.formhoc.validateFields((err, values) => {
        if (!err) {
          this.graph.update(activeItem, values);
          this.addNode(ev.target.value);
        } else {
          this.beginAdd = false;
        }
      });
    } else {
      this.addNode(ev.target.value);
    }
    this.setState({ nodeRadioKey: ev.target.value });
  }
  handleAddEdge = () => {
    this.beginAdd = true;
    const { activeItem } = this.state;
    if (activeItem && this.formhoc) {
      this.formhoc.validateFields((err, values) => {
        if (!err) {
          this.graph.update(activeItem, values);
          this.addEdge();
        } else {
          this.beginAdd = false;
        }
      });
    } else {
      this.addEdge();
    }
    this.setState({ nodeRadioKey: '' });
  }
  handleRemoveItem = () => {
    /* const item = this.state.activeItem;
    if (item && item.get('type') === 'edge') {
      const source = item.get('source');
      const target = item.get('target');
      this.graph.update(source, { out_degree: source.get('model').out_degree - 1 });
      this.graph.update(target, { in_degree: target.get('model').in_degree - 1 });
    } */
    this.graph.del();
    this.graph.refresh();
    this.setState({ activeItem: null, nodeRadioKey: '', composePanelVisible: false });
  }
  msg = formatMsg(this.props.intl)
  handleActiveValidated = (item) => {
    const { activeItem } = this.state;
    if (activeItem && this.formhoc) {
      const values = this.formhoc.getFieldsValue();
      this.graph.update(activeItem, values);
    }
    this.handleNewItemLoad(item);
  }
  handleNewItemLoad = (item) => {
    if (item) {
      const model = item.get('model');
      if (!model.loaded) {
        if (model.kind === 'terminal') {
          this.graph.update(item, { loaded: true });
          this.setState({ activeItem: item, composePanelVisible: false });
        } else {
          this.props.loadFlowGraphItem({ id: model.id, kind: model.kind, type: item.get('type') }).then((result) => {
            if (!result.error) {
              if (item.get('type') === 'node') {
                const node = result.data;
                this.graph.update(item, { ...node, loaded: true });
                this.props.setNodeActions(node.actions);
              } else if (item.get('type') === 'edge') {
                this.graph.update(item, { conditions: result.data, loaded: true });
              }
              this.setState({ activeItem: item, composePanelVisible: true });
            }
          });
        }
      } else {
        if (item.get('type') === 'node') {
          this.props.setNodeActions(model.actions);
        }
        this.setState({ activeItem: item, composePanelVisible: model.kind !== 'terminal' });
      }
    } else {
      this.setState({ activeItem: item, composePanelVisible: false });
    }
    this.graph.refresh();
  }
  handleCondAdd = (cond, afterConds) => {
    const added = this.state.activeItem.get('model').addedConds;
    // 多次更改产生add
    let i = 0;
    for (; i < added.length; i++) {
      if (added[i].key === cond.key) {
        added[i] = cond;
        break;
      }
    }
    if (i === added.length) {
      added.push(cond);
    }
    this.graph.update(this.state.activeItem, { addedConds: added, conditions: afterConds });
  }
  handleCondUpdate = (cond, afterConds) => {
    const { updConds } = this.state.activeItem.get('model');
    let i = 0;
    for (; i < updConds.length; i++) {
      if (updConds[i].key === cond.key) {
        updConds[i] = cond;
        break;
      }
    }
    if (i === updConds.length) {
      updConds.push(cond);
    }
    this.graph.update(this.state.activeItem, { updConds, conditions: afterConds });
  }
  handleCondDel = (cond, afterConds) => {
    const added = this.state.activeItem.get('model').addedConds;
    let found = false;
    for (let i = 0; i < added.length; i++) {
      if (added[i].key === cond.key) {
        found = true;
        added.splice(i, 1);
        this.graph.update(this.state.activeItem, { addedConds: added, conditions: afterConds });
        break;
      }
    }
    if (!found) {
      const { delConds } = this.state.activeItem.get('model');
      delConds.push(cond.key);
      this.graph.update(this.state.activeItem, { delConds, conditions: afterConds });
    }
  }
  handleTriggerModalChange = (nodeBizObject, triggerName, newActions) => {
    const nodeActions = this.state.activeItem.get('model').actions;
    const actions = nodeActions.filter(na => !(nodeBizObject ?
      (na.node_biz_object === nodeBizObject && na.trigger_name === triggerName) :
      (na.trigger_name === triggerName))).concat(newActions.map(na => ({
      ...na, node_biz_object: nodeBizObject, trigger_name: triggerName,
    })));
    this.graph.update(this.state.activeItem, { actions });
    this.props.setNodeActions(actions);
    // connect nodeActions rerender FlowTriggerTable, model passed no effect
  }
  // handleTrackingChange = (trackingId) => {
  //  this.setState({ trackingId });
  // }
  handleDeleteFlow = () => {
    this.props.deleteFlow(this.props.currentFlow.id).then((result) => {
      if (!result.error) {
        this.props.toggleReload();
      }
    });
  }
  handlePanelForm = (form) => { this.formhoc = form; }
  handleSubFlowAuth = () => {
    this.props.openSubFlowAuthModal(this.props.currentFlow);
  }
  toggleCloneModal = () => {
    this.setState(prevState => ({ visibleCloneModal: !prevState.visibleCloneModal }));
  }
  handleClosePanel = () => {
    this.setState({ activeItem: null, composePanelVisible: false });
  }
  handleSave = () => {
    const { activeItem } = this.state;
    if (activeItem && this.formhoc) {
      const values = this.formhoc.getFieldsValue();
      this.graph.update(activeItem, values);
    }
    // const trackingId = this.state.trackingId !== this.props.currentFlow.tracking_id ?
    //  this.state.trackingId : null;
    const graphItems = this.graph.get('items');
    const nodeMap = {};
    let validatePass = true;
    for (let i = 0; i < graphItems.length; i++) {
      const item = graphItems[i];
      if (item.get('type') === 'node') {
        const model = item.get('model');
        if (model.kind !== 'terminal' && !model.person_id) {
          message.warn(`节点${model.name}负责人为空`);
          validatePass = false;
          break;
        }
        model.in_degree = 0;
        model.out_degree = 0;
        nodeMap[model.id] = model;
      }
    }
    if (!validatePass) {
      return;
    }
    const edges = graphItems.filter(item => item.get('type') === 'edge'
      && item.get('model').target !== item.get('model').source).map(item => item.get('model'));
    edges.forEach((edge) => { // edge move cannot edit in/out degree on the fly
      if (nodeMap[edge.target]) {
        nodeMap[edge.target].in_degree += 1;
      }
      if (nodeMap[edge.source]) {
        nodeMap[edge.source].out_degree += 1;
      }
    });
    const nodes = Object.keys(nodeMap).map(nodeid => nodeMap[nodeid]);
    // todo graph node edge disconnected
    this.props.saveFlowGraph(this.props.currentFlow.id, nodes, edges).then((result) => {
      if (!result.error) {
        const { currentFlow } = this.props;
        this.props.loadFlowGraph(currentFlow.id, currentFlow.main_flow_id);
        this.setState({ activeItem: null, composePanelVisible: false });
        message.success('保存成功');
      } else {
        message.error('保存失败', 5);
      }
    });
  }
  renderGraphToolbar() {
    return (<RadioGroup onChange={this.handleAddToolbarNode} value={this.state.nodeRadioKey}>
      <RadioButton value="nodeimport"><Tooltip title={`添加${this.msg('importFlowNode')}`}><span><LogixIcon type="icon-import" /></span></Tooltip></RadioButton>
      <RadioButton value="nodeexport"><Tooltip title={`添加${this.msg('exportFlowNode')}`}><span><LogixIcon type="icon-export" /></span></Tooltip></RadioButton>
      <RadioButton value="nodetms"><Tooltip title={`添加${this.msg('tmsFlowNode')}`}><span><LogixIcon type="icon-truck" /></span></Tooltip></RadioButton>
      <RadioButton value="nodecwmrec"><Tooltip title={`添加${this.msg('cwmrecFlowNode')}`}><span><LogixIcon type="icon-receiving" /></span></Tooltip></RadioButton>
      <RadioButton value="nodecwmship"><Tooltip title={`添加${this.msg('cwmshipFlowNode')}`}><span><LogixIcon type="icon-shipping" /></span></Tooltip></RadioButton>
      <RadioButton value="nodeptsimp"><Tooltip title={`添加${this.msg('ptsimpFlowNode')}`}><span><LogixIcon type="icon-pts-imp" /></span></Tooltip></RadioButton>
      <RadioButton value="nodeptsexp"><Tooltip title={`添加${this.msg('ptsexpFlowNode')}`}><span><LogixIcon type="icon-pts-exp" /></span></Tooltip></RadioButton>
      <RadioButton value="nodeterminal"><Tooltip title={`添加${this.msg('terminalFlowNode')}`}><span><LogixIcon type="icon-end" /></span></Tooltip></RadioButton>
    </RadioGroup>
    );
  }
  render() {
    const { getFieldDecorator, validateFields } = this.props.form;
    const { submitting, currentFlow } = this.props;
    const { activeItem } = this.state;
    const NodePanel = activeItem && NodeKindPanelMap[activeItem.get('model').kind];
    const newFlowNameRules = {
      validate: [{
        rules: [
          { required: true, whitespace: true, message: this.msg('mustHaveFlowNameHint') },
        ],
        trigger: ['onBlur', 'onChange'],
      }],
      initialValue: `${this.props.currentFlow.name}-复制`,
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    return (
      <div>
        <Spin spinning={this.props.graphLoading}>
          <Card
            bodyStyle={{ padding: 0, height: this.state.contentHeight }}
            extra={<div className="toolbar-right">
              {this.renderGraphToolbar()}
              <Tooltip title={this.msg('addFlowEdge')}><Button onClick={this.handleAddEdge}><LogixIcon type="icon-connect" /></Button></Tooltip>
              <Tooltip title={this.msg('eraseFlowItem')}><Button onClick={this.handleRemoveItem}><LogixIcon type="icon-erase" /></Button></Tooltip>
            </div>}
          >
            <div id="flowchart" />
          </Card>
          <Drawer
            title={activeItem && this.msg(`${activeItem.get('model').kind || ''}${activeItem.get('type') === 'node' ? 'FlowNode' : 'flowEdge'}`)}
            width={960}
            placement="right"
            onClose={this.handleClosePanel}
            visible={this.state.composePanelVisible}
            mask={false}
          >
            {NodePanel && activeItem.get('type') === 'node' &&
            <NodePanel
              onFormInit={this.handlePanelForm}
              node={activeItem}
              graph={this.graph}
              key={activeItem.get('model').kind}
            />
                }
            {activeItem && activeItem.get('type') === 'edge' &&
            <FlowEdgePanel
              model={activeItem.get('model')}
              source={activeItem.get('source').get('model')}
              target={activeItem.get('target').get('model')}
              onAdd={this.handleCondAdd}
              onUpdate={this.handleCondUpdate}
              onDel={this.handleCondDel}
              key="edge"
            />
                }
          </Drawer>
          <AddTriggerModal
            onModalOK={this.handleTriggerModalChange}
            kind={activeItem && activeItem.get('model').kind}
            model={activeItem && activeItem.get('model')}
          />
          <FlowSettingModal graph={this.graph} />
        </Spin>
        <div
          style={{
              position: 'fixed',
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e8e8e8',
              padding: '12px 24px',
              left: 0,
              background: '#fff',
              borderRadius: '0 0 4px 4px',
            }}
        >
          <Button size="large" type="primary" icon="save" loading={submitting} onClick={this.handleSave}>
            {this.msg('save')}
          </Button>
          <Button size="large" icon="copy" onClick={this.toggleCloneModal} style={{ width: 40, marginLeft: 8 }} />
          <Button size="large" icon="setting" onClick={this.handleSubFlowAuth} style={{ width: 40, marginLeft: 8 }} />
        </div>
        <Modal
          title={this.msg('copyFlowTitle')}
          visible={this.state.visibleCloneModal}
          onOk={() => {
            validateFields((error, values) => {
              if (!error) {
                this.props.cloneFlow(currentFlow.id, values.newFlowName).then((result) => {
                  if (!result.error) {
                    message.info(this.msg('copyFlowSucceed'));
                    this.toggleCloneModal();
                  } else {
                    message.info(result.error.message);
                  }
                  this.props.toggleReload();
                });
              }
            });
          }}
          onCancel={this.toggleCloneModal}
        >
          <Form layout="horizontal">
            <FormItem {...formItemLayout} label={this.msg('newFlowName')}>
              {getFieldDecorator('newFlowName', newFlowNameRules)(<Input />)}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}
