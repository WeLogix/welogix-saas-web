import React from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Card, Popconfirm, Col, Drawer, Form, List, Icon, InputNumber, Row, Select, Input } from 'antd';
import { closeAddTriggerModal } from 'common/reducers/scofFlow';
import { uuidWithoutDash } from 'client/common/uuid';
import { MemberSelect } from 'client/components/ComboSelect';
import { NODE_BIZ_OBJECTS_EXECUTABLES, NODE_CREATABLE_BIZ_OBJECTS, SCOF_BIZ_OBJECT_KEY, NODE_BIZ_OBJECTS, NOTIFICATION_PRIORITIES, NODE_TRIGGERS } from 'common/constants';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
  colon: false,
};
const formItemSpan2Layout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
  colon: false,
};

function genContent(value, originContent, fieldsList, fieldMsgMap) {
  let newValue = value;
  let content = newValue;
  if (originContent && content) {
    const originValues = originContent.split('$');
    fieldsList.forEach((field) => {
      const fieldMsg = fieldMsgMap[field];
      const reg = new RegExp(`\\$${fieldMsg}\\$`, 'g');
      newValue = newValue.replace(reg, `$${field}$`);
    });
    newValue = newValue.split('$');
    newValue = newValue.filter((val, idx) => !(val === '-' &&
  fieldsList.indexOf(newValue[idx - 1]) !== -1 &&
  fieldsList.indexOf(newValue[idx + 1]) !== -1));
    content = newValue.join('');
    for (let i = 0; i < fieldsList.length; i++) {
      const field = fieldsList[i];
      let isDeleteField = false;
      const originFieldsCount = originValues.filter(val => val === field).length;
      const newFieldsCount = newValue.filter(val => val === field).length;
      if (originFieldsCount !== newFieldsCount) {
        for (let j = 0; j < originValues.length; j++) {
          const originValue = originValues[j];
          if (originValue === field) {
            if (newValue[j] !== field) {
              originValues.splice(j, 1);
              content = originValues.join('');
              isDeleteField = true;
              break;
            }
          }
        }
      }
      if (isDeleteField) {
        break;
      }
    }
  }
  if (content) {
    fieldsList.forEach((field) => {
      const reg = new RegExp(field, 'g');
      content = content.replace(reg, `$${field}$`);
    });
  }
  return content;
}

function CreateActionForm(props) {
  const {
    action, index, bizObjectOptions, msg, onChange, deleteAction,
  } = props;
  function handleChange(actionKey, value) {
    onChange(actionKey, value, index);
  }
  return (
    <Card bodyStyle={{ padding: 16, paddingBottom: 0 }} style={{ width: '100%' }} actions={deleteAction}>
      <Row>
        <Col span={12}>
          <FormItem label={msg('triggerAction')} {...formItemLayout}>
            <Select value={action.type} onChange={value => handleChange('type', value)}>
              <Option value="CREATE" key="CREATE">{msg('actionCreate')}</Option>
              <Option value="EXECUTE" key="EXECUTE">{msg('actionExecute')}</Option>
              <Option value="NOTIFY" key="NOTIFY">{msg('actionNotify')}</Option>
              <Option value="PENDTASK" key="PENDTASK">{msg('pendtask')}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label={msg('triggerMode')} {...formItemLayout}>
            <Select value={action.instant ? 'instant' : 'scheduled'} onChange={value => handleChange('instant', value === 'instant')}>
              <Option value="instant"><i className="icon icon-fontello-flash-1" />{msg('instantTrigger')}</Option>
              <Option value="scheduled"><i className="icon icon-fontello-back-in-time" />{msg('scheduledTrigger')}</Option>
            </Select>
          </FormItem>
        </Col>
        {!action.instant &&
        <Col span={24}>
          <FormItem label={msg('triggerTimer')} {...formItemSpan2Layout}>
            <span>{msg('timerWait')}
              <InputNumber
                value={action.delay}
                min={1}
                max={3600}
                style={{ width: '20%', marginRight: 8, marginLeft: 8 }}
                onChange={value => handleChange('delay', value)}
              />
              {msg('timerMinutes')}
            </span>
          </FormItem>
        </Col>}
        <Col span={12}>
          <FormItem label={msg('bizObject')} {...formItemLayout}>
            <Select value={action.biz_object} onChange={value => handleChange('biz_object', value)}>
              {bizObjectOptions.map(bo =>
                <Option value={bo.key} key={bo.key}>{msg(bo.text)}</Option>)}
            </Select>
          </FormItem>
        </Col>
      </Row>
    </Card>);
}

CreateActionForm.propTypes = {
  action: PropTypes.shape({ type: PropTypes.string }),
  index: PropTypes.number.isRequired,
  bizObjectOptions: PropTypes.arrayOf(PropTypes.shape({ key: PropTypes.string })),
};

function ExecuteActionForm(props) {
  const {
    action, index, bizObjectOptions, msg, onChange, deleteAction,
  } = props;
  function handleChange(actionKey, value) {
    onChange(actionKey, value, index);
  }
  const bizobj = bizObjectOptions.filter(boo => boo.key === action.biz_object)[0];
  return (
    <Card bodyStyle={{ padding: 16, paddingBottom: 0 }} style={{ width: '100%' }} actions={deleteAction}>
      <Row>
        <Col span={12}>
          <FormItem label={msg('triggerAction')} {...formItemLayout}>
            <Select value={action.type} onChange={value => handleChange('type', value)}>
              <Option value="CREATE" key="CREATE">{msg('actionCreate')}</Option>
              <Option value="EXECUTE" key="EXECUTE">{msg('actionExecute')}</Option>
              <Option value="NOTIFY" key="NOTIFY">{msg('actionNotify')}</Option>
              <Option value="PENDTASK" key="PENDTASK">{msg('pendtask')}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label={msg('triggerMode')} {...formItemLayout}>
            <Select value={action.instant ? 'instant' : 'scheduled'} onChange={value => handleChange('instant', value === 'instant')}>
              <Option value="instant"><i className="icon icon-fontello-flash-1" />{msg('instantTrigger')}</Option>
              <Option value="scheduled"><i className="icon icon-fontello-back-in-time" />{msg('scheduledTrigger')}</Option>
            </Select>
          </FormItem>
        </Col>
        {!action.instant &&
        <Col span={24}>
          <FormItem label={msg('triggerTimer')} {...formItemSpan2Layout}>
            <span>{msg('timerWait')}
              <InputNumber
                value={action.delay}
                min={1}
                max={3600}
                style={{ width: '20%', marginRight: 8, marginLeft: 8 }}
                onChange={value => handleChange('delay', value)}
              />
              {msg('timerMinutes')}
            </span>
          </FormItem>
        </Col>}
        <Col span={12}>
          <FormItem label={msg('bizObject')} {...formItemLayout}>
            <Select value={action.biz_object} onChange={(value) => { handleChange('biz_trigger', ''); handleChange('biz_object', value); }}>
              {bizObjectOptions.map(bo =>
                <Option value={bo.key} key={bo.key}>{msg(bo.text)}</Option>)}
            </Select>
          </FormItem>
        </Col>
        {bizobj &&
        <Col span={12}>
          <FormItem label={msg('bizObjOperation')} {...formItemLayout}>
            <Select value={action.biz_trigger} onChange={value => handleChange('biz_trigger', value)}>
              {bizobj.triggers.map(bot =>
                <Option value={bot.action} key={bot.action}>{msg(bot.actionText)}</Option>)}
            </Select>
          </FormItem>
        </Col>}
      </Row>
    </Card>);
}

ExecuteActionForm.propTypes = {
  action: PropTypes.shape({ type: PropTypes.string }),
  index: PropTypes.number.isRequired,
  bizObjectOptions: PropTypes.arrayOf(PropTypes.shape({ key: PropTypes.string })),
};

function NotifyActionForm(props) {
  const {
    action, index, msg, onChange, deleteAction,
    nodeBizObject,
  } = props;
  function handleChange(actionKey, value) {
    onChange(actionKey, value, index);
  }
  function handleNotifyMemberSel(value) {
    onChange('recv_login_ids', value, index);
    onChange('fna_recv_dept_id_list', null, index);
  }
  function handleNotifyDepartSel(value) {
    onChange('fna_recv_dept_id_list', value, index);
    onChange('recv_login_ids', null, index);
  }
  const fieldMsgMap = {
    cust_order_no: msg('custOrderNo'),
  };
  if (nodeBizObject === SCOF_BIZ_OBJECT_KEY.CMS_CUSTOMS.key) {
    fieldMsgMap.entry_id = msg('entryId');
  }
  const fieldsList = Object.keys(fieldMsgMap);
  function handleContentChange(ev) {
    const content = genContent(ev.target.value, action.content, fieldsList, fieldMsgMap);
    onChange('content', content, index);
  }
  let content = action.content || '';
  content = content.replace(/\$\$/g, '$-$');
  fieldsList.forEach((field) => {
    const reg = new RegExp(field, 'g');
    content = content.replace(reg, fieldMsgMap[field]);
  });
  return (
    <Card bodyStyle={{ padding: 16, paddingBottom: 0 }} style={{ width: '100%' }} actions={deleteAction}>
      <Row>
        <Col span={12}>
          <FormItem label={msg('triggerAction')} {...formItemLayout}>
            <Select value={action.type} onChange={value => handleChange('type', value)}>
              <Option value="CREATE" key="CREATE">{msg('actionCreate')}</Option>
              <Option value="EXECUTE" key="EXECUTE">{msg('actionExecute')}</Option>
              <Option value="NOTIFY" key="NOTIFY">{msg('actionNotify')}</Option>
              <Option value="PENDTASK" key="PENDTASK">{msg('pendtask')}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label={msg('triggerMode')} {...formItemLayout}>
            <Select value={action.instant ? 'instant' : 'scheduled'} onChange={value => handleChange('instant', value === 'instant')}>
              <Option value="instant"><i className="icon icon-fontello-flash-1" />{msg('instantTrigger')}</Option>
              <Option value="scheduled"><i className="icon icon-fontello-back-in-time" />{msg('scheduledTrigger')}</Option>
            </Select>
          </FormItem>
        </Col>
        {!action.instant &&
        <Col span={24}>
          <FormItem label={msg('triggerTimer')} {...formItemSpan2Layout}>
            <span>{msg('timerWait')}
              <InputNumber
                value={action.delay}
                min={1}
                max={3600}
                style={{ width: '20%', marginRight: 8, marginLeft: 8 }}
                onChange={value => handleChange('delay', value)}
              />
              {msg('timerMinutes')}
            </span>
          </FormItem>
        </Col>}
        <Col span={24}>
          <FormItem
            label={msg('notifyRemind')}
            {...formItemSpan2Layout}
          >
            <MemberSelect
              maxTagCount={4}
              selectMembers={action.recv_login_ids}
              selectDepts={action.fna_recv_dept_id_list}
              onDeptChange={value => handleNotifyDepartSel(value)}
              onMemberChange={value => handleNotifyMemberSel(value)}
              style={{ width: '100%' }}
            />
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem label={msg('notifyTitle')} {...formItemSpan2Layout}>
            <Input value={action.fna_msg_title} onChange={e => handleChange('fna_msg_title', e.target.value)} />
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem label={msg('notifyContent')} {...formItemSpan2Layout}>
            <TextArea
              value={content}
              onChange={handleContentChange}
            />
            <Row>
              {fieldsList.map(field => (
                <Button key={field} onClick={() => handleChange('content', `${action.content || ''}$${field}$`)} style={{ marginRight: 16 }} size="small" type="dashed">{fieldMsgMap[field]}</Button>
              ))}
            </Row>
          </FormItem>
        </Col>
      </Row>
    </Card>);
}

NotifyActionForm.propTypes = {
  action: PropTypes.shape({ type: PropTypes.string }),
  index: PropTypes.number.isRequired,
};

function PendtaskActionForm(props) {
  const {
    action, index, msg, onChange, deleteAction,
    nodeBizObject, kind, trigger,
  } = props;
  let events = [];
  if (nodeBizObject && !NODE_TRIGGERS.find(nt => nt.key === trigger)) {
    const { triggers } = NODE_BIZ_OBJECTS[kind].filter(nbo =>
      nbo.key === nodeBizObject)[0];
    const trig = triggers.find(tr => tr.key === trigger);
    events = triggers.filter(tr => tr.seqNo > trig.seqNo).map(tr => ({
      key: tr.key,
      name: msg(tr.text),
    }));
  } else {
    const bizObjects = NODE_BIZ_OBJECTS[kind];
    for (let i = 0; i < bizObjects.length; i++) {
      const bizObject = bizObjects[i];
      const { triggers } = bizObject;
      for (let j = 0; j < triggers.length; j++) {
        const trig = triggers[j];
        events.push({
          key: trig.key,
          name: `${msg(bizObject.text)}-${msg(trig.text)}`,
        });
      }
    }
  }
  function handleTaskChange(actionKey, value) {
    onChange(actionKey, value, index);
  }
  function handleDeadLineChange(e) {
    const days = Number(e.target.value) || '';
    if (!Number.isNaN(days)) {
      onChange('fnt_deadline_afterdays', days, index);
    }
  }
  const fieldMsgMap = {
    cust_order_no: msg('custOrderNo'),
  };
  if (nodeBizObject === SCOF_BIZ_OBJECT_KEY.CMS_CUSTOMS.key) {
    fieldMsgMap.entry_id = msg('entryId');
  }
  const fieldsList = Object.keys(fieldMsgMap);
  function handleContentChange(ev) {
    const content = genContent(ev.target.value, action.fnt_content, fieldsList, fieldMsgMap);
    onChange('fnt_content', content, index);
  }
  let content = action.fnt_content || '';
  content = content.replace(/\$\$/g, '$-$');
  fieldsList.forEach((field) => {
    const reg = new RegExp(field, 'g');
    content = content.replace(reg, fieldMsgMap[field]);
  });
  return (
    <Card bodyStyle={{ padding: 16, paddingBottom: 0 }} style={{ width: '100%' }} actions={deleteAction}>
      <Row>
        <Col span={12}>
          <FormItem label={msg('triggerAction')} {...formItemLayout}>
            <Select value={action.type} onChange={value => handleTaskChange('type', value)}>
              <Option value="CREATE" key="CREATE">{msg('actionCreate')}</Option>
              <Option value="EXECUTE" key="EXECUTE">{msg('actionExecute')}</Option>
              <Option value="NOTIFY" key="NOTIFY">{msg('actionNotify')}</Option>
              <Option value="PENDTASK" key="PENDTASK">{msg('pendtask')}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label={msg('triggerMode')} {...formItemLayout}>
            <Select value={action.instant ? 'instant' : 'scheduled'} onChange={value => handleTaskChange('instant', value === 'instant')}>
              <Option value="instant"><i className="icon icon-fontello-flash-1" />{msg('instantTrigger')}</Option>
              <Option value="scheduled"><i className="icon icon-fontello-back-in-time" />{msg('scheduledTrigger')}</Option>
            </Select>
          </FormItem>
        </Col>
        {!action.instant &&
        <Col span={24}>
          <FormItem label={msg('triggerTimer')} {...formItemSpan2Layout}>
            <span>{msg('timerWait')}
              <InputNumber
                value={action.delay}
                min={1}
                max={3600}
                style={{ width: '20%', marginRight: 8, marginLeft: 8 }}
                onChange={value => handleTaskChange('delay', value)}
              />
              {msg('timerMinutes')}
            </span>
          </FormItem>
        </Col>}
        <Col span={12}>
          <FormItem
            label={msg('deadline')}
            {...formItemLayout}
          >
            <Input
              value={action.fnt_deadline_afterdays}
              onChange={handleDeadLineChange}
              addonBefore="创建任务之后"
              addonAfter={<Select
                onSelect={value => handleTaskChange('fnt_time_level', value)}
                value={action.fnt_time_level}
                style={{ width: 70 }}
              >
                <Option key="d" value="d">天</Option>
                <Option key="h" value="h">小时</Option>
                <Option key="m" value="m">分钟</Option>
              </Select>}
            />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            label={msg('priority')}
            {...formItemLayout}
          >
            <Select value={action.fnt_priority} onSelect={value => handleTaskChange('fnt_priority', value)}>
              {NOTIFICATION_PRIORITIES.filter(priority => priority.value).map(priority =>
                (<Option key={priority.value} value={priority.value}>{priority.text}</Option>))}
            </Select>
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            label={msg('createdBy')}
            {...formItemLayout}
          >
            <Select value={action.fnt_created_by} onSelect={value => handleTaskChange('fnt_created_by', value)}>
              <Option value={1} key="nodeExecutor">{msg('nodeExecutor')}</Option>
              <Option value={0} key="system">{msg('system')}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            label={msg('executor')}
            {...formItemLayout}
          >
            <MemberSelect
              memberOnly
              selectMode="single"
              selectMembers={action.fnt_recv_by && String(action.fnt_recv_by)}
              onMemberChange={value => handleTaskChange('fnt_recv_by', value)}
              style={{ width: '100%' }}
            />
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem label={msg('notifyTitle')} {...formItemSpan2Layout}>
            <Input value={action.fnt_title} onChange={e => handleTaskChange('fnt_title', e.target.value)} />
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem label={msg('notifyContent')} {...formItemSpan2Layout}>
            <TextArea
              value={content}
              onChange={handleContentChange}
            />
            <Row>
              {fieldsList.map(field => (
                <Button key={field} onClick={() => handleTaskChange('fnt_content', `${action.fnt_content || ''}$${field}$`)} style={{ marginRight: 16 }} size="small" type="dashed">{fieldMsgMap[field]}</Button>
              ))}
            </Row>
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem
            label={msg('closeEvent')}
            {...formItemSpan2Layout}
          >
            <Select value={action.fnt_done_triggerev} allowClear showSearch onChange={value => handleTaskChange('fnt_done_triggerev', value)}>
              {events.map(event =>
                (<Option value={event.key} key={event.key}>{event.name}</Option>))}
            </Select>
          </FormItem>
        </Col>
      </Row>
    </Card>);
}

PendtaskActionForm.propTypes = {
  action: PropTypes.shape({ type: PropTypes.string }),
  index: PropTypes.number.isRequired,
};

@injectIntl
@connect(
  state => ({
    visible: state.scofFlow.visibleTriggerModal,
    nodeBizObject: state.scofFlow.triggerModal.node_biz_object,
    trigger: state.scofFlow.triggerModal.key,
    actions: state.scofFlow.triggerModal.actions,
    partnerId: state.scofFlow.currentFlow.customer_partner_id,
  }),
  { closeAddTriggerModal }
)
export default class AddTriggerModal extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    visible: PropTypes.bool.isRequired,
    closeAddTriggerModal: PropTypes.func.isRequired,
    onModalOK: PropTypes.func.isRequired,
  }
  state = {
    actions: [],
    bizobjExecutes: [],
    creatableBizObjects: [],
  }
  componentWillMount() {
    if (this.props.kind) {
      const bizobjExecutes = NODE_BIZ_OBJECTS_EXECUTABLES[this.props.kind];
      if (bizobjExecutes) {
        // todo creatableBiz func this.props.model for example SO bonded
        // reg_type: normal -> NormalReg bizobject
        const creatableBizObjects = NODE_CREATABLE_BIZ_OBJECTS[this.props.kind].map(nbo =>
          ({ key: nbo.key, text: nbo.text }));
        this.setState({ bizobjExecutes, creatableBizObjects });
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.actions !== this.props.actions) {
      this.setState({
        actions: nextProps.actions.map(item => ({
          ...item,
          recv_login_ids_enabled: !!item.recv_login_ids,
          recv_emails_enabled: !!item.recv_emails,
          recv_tels_enabled: !!item.recv_tels,
        })),
      });
    }
    if (nextProps.kind && nextProps.kind !== this.props.kind) {
      const bizobjExecutes = NODE_BIZ_OBJECTS_EXECUTABLES[nextProps.kind];
      if (bizobjExecutes) {
        const creatableBizObjects = NODE_CREATABLE_BIZ_OBJECTS[nextProps.kind].map(nbo =>
          ({ key: nbo.key, text: nbo.text }));
        this.setState({ bizobjExecutes, creatableBizObjects });
      }
    }
  }
  handleActionAdd = () => {
    this.setState({ actions: [...this.state.actions, { id: uuidWithoutDash(), type: 'CREATE', instant: true }] });
  }
  handleFormChange = (key, value, index) => {
    const actions = [...this.state.actions];
    actions[index][key] = value;
    this.setState({ actions });
  }
  handleActionDel = (index) => {
    const actions = [...this.state.actions];
    actions.splice(index, 1);
    this.setState({ actions });
  }
  handleOk = () => {
    this.props.onModalOK(this.props.nodeBizObject, this.props.trigger, this.state.actions);
    this.props.closeAddTriggerModal();
  }
  handleClose = () => {
    this.props.closeAddTriggerModal();
  }
  msg = formatMsg(this.props.intl)
  renderAction(action, index, deleteAction) {
    const { nodeBizObject, kind } = this.props;
    const { bizobjExecutes, creatableBizObjects } = this.state;
    let actionForm = null;
    switch (action.type) {
      case 'CREATE': actionForm = (
        <CreateActionForm
          key={action.id}
          action={action}
          onDel={this.handleActionDel}
          index={index}
          bizObjectOptions={creatableBizObjects}
          onChange={this.handleFormChange}
          msg={this.msg}
          deleteAction={deleteAction}
        />);
        break;
      case 'EXECUTE': actionForm = (
        <ExecuteActionForm
          key={action.id}
          action={action}
          onDel={this.handleActionDel}
          index={index}
          bizObjectOptions={bizobjExecutes}
          onChange={this.handleFormChange}
          msg={this.msg}
          deleteAction={deleteAction}
        />);
        break;
      case 'NOTIFY': actionForm = (
        <NotifyActionForm
          key={action.id}
          action={action}
          onDel={this.handleActionDel}
          index={index}
          onChange={this.handleFormChange}
          msg={this.msg}
          deleteAction={deleteAction}
          nodeBizObject={nodeBizObject}
        />);
        break;
      case 'PENDTASK': actionForm = (
        <PendtaskActionForm
          key={action.id}
          action={action}
          onDel={this.handleActionDel}
          index={index}
          onChange={this.handleFormChange}
          msg={this.msg}
          deleteAction={deleteAction}
          nodeBizObject={nodeBizObject}
          kind={kind}
          trigger={this.props.trigger}
        />);
        break;
      default:
        break;
    }
    return actionForm;
  }
  render() {
    const { visible } = this.props;
    const { actions } = this.state;
    return (
      <Drawer
        maskClosable={false}
        title={this.msg('triggerActions')}
        width={800}
        visible={visible}
        onOk={this.handleOk}
        onClose={this.handleClose}
        destroyOnClose
      >
        <Form layout="horizontal" className="form-layout-multi-col">
          <List
            dataSource={actions}
            locale={{ emptyText: '尚未设置触发器' }}
            renderItem={(action, index) => (
              <List.Item>
                {this.renderAction(action, index, [<Popconfirm title={this.msg('deleteConfirm')} onConfirm={() => this.handleActionDel(index)}>
                  <a role="presentation"><Icon type="delete" /></a></Popconfirm>])}
              </List.Item>
            )}
          />
        </Form>
        <Button type="dashed" style={{ width: '100%', marginBottom: 64 }} icon="plus" onClick={this.handleActionAdd} >
          {this.msg('addTrigger')}
        </Button>
        <div
          style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e8e8e8',
              padding: '10px 16px',
              textAlign: 'right',
              left: 0,
              background: '#fff',
              borderRadius: '0 0 4px 4px',
            }}
        >
          <Button onClick={this.handleOk} type="primary">{this.msg('ok')}</Button>
        </div>
      </Drawer>
    );
  }
}
