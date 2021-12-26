import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Form, Col, message } from 'antd';
import { formatMsg } from '../message.i18n';

const FormItem = Form.Item;
const areaStyle = {
  width: '100%',
  height: 100,
  border: '1px solid #dee1e6',
  borderRadius: 3,
  boxSizing: 'border-box',
  padding: 5,
  outline: 0,
  resize: 'none',
  cursor: 'text',
  lineHeight: '20px',
};

const fakeCursorStyle = {
  display: 'inline-block',
  width: 0,
  borderLeft: '1px solid #333',
  position: 'absolute',
  animation: 'cursorBlink 500ms linear 50ms infinite alternate',
  zIndex: 1,
  height: 22,
};

const lineMargin = 10;
const fieldTagStyle = {
  margin: '0 4px',
  display: 'inline-block',
  padding: '2px 10px',
  backgroundColor: '#fff',
  fontSize: '12px',
  borderRadius: '4px',
  boxShadow: '0 2px 2px 0 rgba(60,72,85,.24), 0 0 2px 0 rgba(60,72,85,.12)',
  marginBottom: lineMargin,
};

const twoLineLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const formItemStyle = { marginBottom: 5 };

const bubbleJudgeMaker = (limit) => {
  let layerCount = 0;
  const bubbleJudge = (element, judge) => {
    layerCount += 1;
    if (layerCount < limit && element) {
      return judge(element) || bubbleJudge(element.parentElement, judge);
    }
    return false;
  };
  return bubbleJudge;
};

const aggreates = ['SUM', 'AVG', 'MAX', 'MIN'];
const aggrLefts = aggreates.map(str => `${str}【`);
/** for key pressing */
const getKeyType = (key) => {
  if (['+', '-', '*', '/'].includes(key)) {
    return 'operator';
  } else if (key === '(') {
    return 'leftparen';
  } else if (key === ')') {
    return 'rightparen';
  } else if (/^[0-9]|\.$/.test(key)) {
    return 'digits';
  }
  return '';
};

/** @param {number} number @param {number} itemIndex */
const numberToCharObjs = (number, itemIndex) => number.split('')
  .map(bit => ({ content: bit, itemIndex }));

/**
 * @param {{ content:string, type:string }[]} itemQueue
 * @returns {{ content:string, itemIndex:number }[]} */
export const expNodesToCharNodes = (itemQueue) => {
  let currIndex = 0;
  const charQueue = [];
  const aggrLeft = '【';
  const aggrRight = '】';
  while (currIndex < itemQueue.length) {
    const item = itemQueue[currIndex];
    const { content, type } = item;
    /** 聚合 - 算符 - 字段 - 数字 */
    if (type === 'function') { // 1. 聚合(object)
      charQueue.push({ content: `${content}${aggrLeft}`, itemIndex: currIndex });
      for (let i = currIndex + 1; i <= currIndex + item.offset; i++) {
        const innerItem = itemQueue[i];
        if (innerItem.type === 'digits') {
          charQueue.push(...numberToCharObjs(innerItem.content, i));
        } else {
          charQueue.push({ content: innerItem.content, itemIndex: i });
        }
      }
      charQueue.push({ content: aggrRight, itemIndex: currIndex });
      currIndex += item.offset; // offset: aggr内部item数量, 当前 currIndex 指向 aggr 内最后一项
    } else if (['operator', 'variable', 'metricvar', 'leftparen', 'rightparen'].includes(type)) { // 2. 算符 3. 字段
      charQueue.push({ content, itemIndex: currIndex });
    } else if (type === 'digits') { // 4. 数字
      charQueue.push(...numberToCharObjs(item.content, currIndex));
    }
    currIndex += 1;
  }
  return charQueue;
};

export const getParentAggr = ({ cursorPosition, charObjQueue, itemQueue }) => {
  let currCharIndex = cursorPosition - 1;
  while (currCharIndex >= 0) {
    if (aggrLefts.includes(charObjQueue[currCharIndex] && charObjQueue[currCharIndex].content)) {
      const { itemIndex } = charObjQueue[currCharIndex];
      return itemQueue[itemIndex];
    } else if ((charObjQueue[currCharIndex] && charObjQueue[currCharIndex].content) === '】') {
      return null;
    }
    currCharIndex -= 1;
  }
  return null;
};

export const insertOperatorField = ({
  itemQueueParam,
  cursorPosition,
  charObjQueueParam,
  content,
  type,
}) => {
  const itemQueue = itemQueueParam;
  let charObjQueue;
  if (charObjQueueParam) {
    charObjQueue = charObjQueueParam;
  } else {
    charObjQueue = expNodesToCharNodes(itemQueue);
  }
  let offsetAdd = 1;
  const newExpNode = { content, type };
  if (type === 'metricvar') {
    const aggrItem = getParentAggr({ cursorPosition, charObjQueue, itemQueue });
    if (aggrItem) {
      return '不可在聚合方式中加入计数字段';
    }
  }
  if (type === 'function') newExpNode.offset = 0;
  if (cursorPosition === charObjQueue.length) { // 光标在末尾
    itemQueue.push(newExpNode);
  } else {
    const leftCharObj = charObjQueue[cursorPosition - 1];
    const rightCharObj = charObjQueue[cursorPosition];
    const leftExpNode = leftCharObj && itemQueue[leftCharObj.itemIndex];
    const rightExpNode = rightCharObj && itemQueue[rightCharObj.itemIndex];
    if ((leftExpNode && leftExpNode.type === 'digits') && (rightExpNode && rightExpNode.type === 'digits')) { // 光标在数字内
      const { content: number } = itemQueue[leftCharObj.itemIndex];
      const bitIndex = cursorPosition - charObjQueue
        .findIndex(obj => obj.itemIndex === leftCharObj.itemIndex);
      const newSegment = [
        { content: number.slice(0, bitIndex), type: 'digits' },
        newExpNode,
        { content: number.slice(bitIndex), type: 'digits' },
      ];
      itemQueue.splice(leftCharObj.itemIndex, 1, ...newSegment);
      offsetAdd = 2;
    } else if ((rightCharObj && rightCharObj.content) === '】') { // itemIndex -> 】
      itemQueue.splice(leftCharObj.itemIndex + 1, 0, newExpNode);
    } else {
      itemQueue.splice(rightCharObj.itemIndex, 0, newExpNode);
    }
    // 修正 aggr.offset; 计数字段不会出现在聚合内, 故不必修正
    const aggrItem = (type !== 'metricvar') && getParentAggr({ cursorPosition, charObjQueue, itemQueue });
    if (aggrItem) { // 若在aggr内 则offset+1
      aggrItem.offset += offsetAdd;
    }
  }
  return '';
};

/** @return {string} warnMessage */
export const useAggreate = ({ itemQueueParam, cursorPosition, content }) => {
  const itemQueue = itemQueueParam;
  const charObjQueue = expNodesToCharNodes(itemQueue);
  const aggrItem = getParentAggr({ cursorPosition, charObjQueue, itemQueue });
  if (aggrItem) {
    return 'nestedAggreateNotSurpported';
  }
  const leftCharObj = charObjQueue[cursorPosition - 1];
  const rightCharObj = charObjQueue[cursorPosition];
  const leftExpNode = leftCharObj && itemQueue[leftCharObj.itemIndex];
  const rightExpNode = rightCharObj && itemQueue[rightCharObj.itemIndex];
  if ((leftExpNode && leftExpNode.type === 'variable') || (rightExpNode && rightExpNode.type === 'variable')) {
    const fieldObj = (leftExpNode && leftExpNode.type === 'variable') ? leftCharObj : rightCharObj;
    itemQueue.splice(fieldObj.itemIndex, 1, {
      content: `${content}`, offset: 1, type: 'function',
    }, itemQueue[fieldObj.itemIndex]);
  } else {
    insertOperatorField({
      itemQueueParam: itemQueue,
      charObjQueueParam: charObjQueue,
      cursorPosition,
      content,
      type: 'function',
    });
  }
  return '';
};

/**
 *  @param {{content:string,type:string}[]} expression
 *  @param {{passed:boolean,checkMessage:string}} checkInfoParam
 *  @return {boolean} */
const checkExpression = (expression, checkInfoParam) => {
  const checkInfo = checkInfoParam;
  let isPranClose = true;
  // 不以算符开头/结尾
  let passed = !['+', '-', '*', '/', ')'].includes(expression[0].content)
    && !['+', '-', '*', '/', '('].includes(expression[expression.length - 1].content);
  if (!passed) {
    checkInfo.checkMessage = 'headAndTailCannotBeOperator';
  }
  for (let i = 0; i < expression.length; i++) {
    const node = expression[i];
    if (node.type === 'digits') { // number
      const numberPass = parseFloat(node.content).toString() === node.content;
      if (!numberPass) {
        passed = passed && numberPass;
        checkInfo.checkMessage = 'numberFomatWrong';
      }
    } else if (node.type === 'operator') { // operator
      passed = passed && !(expression[i + 1].type === 'operator');
      if (!passed) {
        checkInfo.checkMessage = 'continuousOperator';
      }
    } else if (node.type === 'leftparen') {
      if (!isPranClose) {
        passed = false;
        checkInfo.checkMessage = 'bracketNotClosed';
      }
      isPranClose = false;
      passed = passed && expression[i + 1] !== ')';
    } else if (node.content === ')') {
      if (!['+', '-', '*', '/', ')'].includes(expression[i + 1].content) && (i !== expression.length - 1)) { // 反括号后只能跟算符和反括号
        passed = false;
        checkInfo.checkMessage = 'afterAggreateShouldBeOperator';
      }
      isPranClose = true;
    } else if (node.offset === 0) { // aggr
      passed = false;
      checkInfo.checkMessage = 'emptyInsideAggreate';
    }
    if (passed && expression[i + 1] && ['variable', 'digits', 'metricvar', 'function'].includes(node.type)) {
      // (数字|field|count|聚合) 后不可跟 (聚合|field|count|(|数字)
      const nextNode = expression[i + 1];
      if (nextNode !== undefined) {
        passed = passed && (nextNode.offset === undefined) && !(nextNode.type === 'variable') &&
          !(nextNode.type === 'leftparen');
        if (node.type === 'variable') {
          passed = passed && (nextNode.type !== 'digits');
        }
        if (!passed) {
          checkInfo.checkMessage = 'fieldNumberAggreateCannotBeTogether';
        }
      }
    }
    if (!passed) break;
  }
  if (!isPranClose) {
    passed = false;
    checkInfo.checkMessage = 'bracketNotClosed';
  }
  return passed;
};

/** @returns {{ passed: boolean, checkMessage: string }} */
export const checkFormula = (formulaExprNodes) => {
  if (formulaExprNodes.length !== 0) {
    const checkInfo = {
      passed: formulaExprNodes.length > 0,
      checkMessage: '',
    };
    let hasField = false;
    // 至少有一个field
    formulaExprNodes.forEach((item) => {
      if (item.offset === undefined && (item.type === 'variable' || item.type === 'metricvar')) {
        hasField = true;
      }
    });
    checkInfo.passed = checkInfo.passed && hasField;
    if (!checkInfo.passed) {
      checkInfo.checkMessage = '应至少有一个字段';
      return checkInfo;
    }
    const topExp = [];
    const aggrExps = [];
    let currIndex = 0;
    while (currIndex < formulaExprNodes.length) {
      if (formulaExprNodes[currIndex].offset) {
        topExp.push(formulaExprNodes[currIndex]);
        const exp = formulaExprNodes
          .slice(currIndex + 1, currIndex + formulaExprNodes[currIndex].offset + 1);
        aggrExps.push(exp);
        currIndex += formulaExprNodes[currIndex].offset + 1;
      } else {
        topExp.push(formulaExprNodes[currIndex]);
        currIndex += 1;
      }
    }
    if (checkInfo.passed) {
      checkInfo.passed = checkInfo.passed && checkExpression(topExp, checkInfo);
      for (let i = 0; i < aggrExps.length && checkInfo.passed; i++) {
        checkInfo.passed = checkInfo.passed && checkExpression(aggrExps[i], checkInfo);
      }
    }
    if (!checkInfo.passed && !checkInfo.checkMessage) {
      checkInfo.checkMessage = '未通过校验';
    }
    return checkInfo;
  }
  return { passed: false }; // formulaExprNodes 长度为0
};

@injectIntl
@connect(state => ({
  countFields: state.disAnalytics.countFields,
}))
export class YMetricEditor extends React.Component { // div 模拟 textArea
  state = {
    focus: false,
  }
  componentDidMount() {
    this.toggleEventCallback(true);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible !== this.props.visible) {
      if (nextProps.visible) {
        this.props.writeCursorPosition(0);
        this.toggleEventCallback(true);
      } else {
        this.toggleEventCallback(false);
      }
    }
  }
  componentWillUnmount() {
    this.toggleEventCallback(false);
  }
  handleClick = (ev) => {
    const bubbleJudge = bubbleJudgeMaker(5);
    const {
      selectEles: {
        fieldSelect, aggrSelect, aggrOptions, fieldOptions,
      },
      formulaExprNodes,
    } = this.props;
    const isFocused = bubbleJudge(ev.target, ele => (
      ele === this.mainArea || ele === fieldSelect || ele === aggrSelect ||
      aggrOptions.includes(ele) || fieldOptions.includes(ele)
    ));
    if (!isFocused && this.state.focus) {
      const { checkMessage } = checkFormula(formulaExprNodes);
      if (checkMessage) {
        message.warn(this.msg(checkMessage), 1);
      }
    }
    this.setState({ focus: isFocused });
    if (ev.target === this.mainArea) {
      this.props.writeCursorPosition(expNodesToCharNodes(formulaExprNodes).length);
    }
  }
  handleInput = ({ key }) => {
    const { focus } = this.state;
    const { formulaExprNodes, cursorPosition } = this.props;
    const type = getKeyType(key);
    if (focus && type) {
      const originalLength = formulaExprNodes.length;
      const charObjQueue = expNodesToCharNodes(formulaExprNodes);
      /** 算符 - 数字 - 字段(在别处) - 聚合 */
      if (charObjQueue.length === 0) {
        formulaExprNodes.push({ content: key, type });
      } else if (['operator', 'leftparen', 'rightparen'].includes(type)) { // 1. 算符 或 括号
        insertOperatorField({
          itemQueueParam: formulaExprNodes,
          cursorPosition,
          charObjQueueParam: charObjQueue,
          content: key,
          type,
        });
      } else if (type === 'digits') { // 2. 数字、小数点
        const leftCharObj = charObjQueue[cursorPosition - 1];
        const rightCharObj = charObjQueue[cursorPosition];
        const leftExpNode = leftCharObj && formulaExprNodes[leftCharObj.itemIndex];
        const rightExpNode = rightCharObj && formulaExprNodes[rightCharObj.itemIndex];
        if ((leftExpNode && leftExpNode.type === 'digits') || (rightExpNode && rightExpNode.type === 'digits')) { // 左右有数字, 合并
          const bitObj = leftExpNode && leftExpNode.type === 'digits' ? leftCharObj : rightCharObj;
          charObjQueue.splice(cursorPosition, 0, {
            content: key,
            itemIndex: bitObj.itemIndex,
          });
          const newNumber = charObjQueue.filter(obj => obj.itemIndex === bitObj.itemIndex)
            .map(obj => obj.content).join('');
          formulaExprNodes.splice(bitObj.itemIndex, 1, { content: newNumber, type });
        } else if (rightCharObj && rightCharObj.content === '】') { // 】的itemIndex不适用于input
          const itemIndex = leftCharObj.itemIndex + 1;
          formulaExprNodes.splice(itemIndex, 0, { content: key, type });
        } else if (rightCharObj) {
          const { itemIndex } = rightCharObj;
          formulaExprNodes.splice(itemIndex, 0, { content: key, type });
        } else { // 光标在末尾
          formulaExprNodes.push({ content: key, type });
        }
        /** aggr.offset 修正 */
        if (originalLength !== formulaExprNodes.length) { // length 有变
          const aggrItem = getParentAggr({ cursorPosition, charObjQueue, formulaExprNodes });
          if (aggrItem) { // 若在aggr内 则offset+1
            aggrItem.offset += 1;
          }
        }
      }
      this.props.writeCursorPosition(cursorPosition + 1);
      this.props.writeYMetricFormula(formulaExprNodes);
    }
  }
  handleOperating = ({ key }) => {
    const { focus } = this.state;
    const { formulaExprNodes, cursorPosition } = this.props;
    if (focus) {
      if (key === 'Backspace') {
        const originalLength = formulaExprNodes.length;
        const charObjQueue = expNodesToCharNodes(formulaExprNodes);
        const deletedCharObj = charObjQueue[cursorPosition - 1]; // 被删除项
        if (!deletedCharObj) {
          return;
        }
        const { type: delType } = formulaExprNodes[deletedCharObj.itemIndex];
        let newCursorPosition = cursorPosition - 1;
        if (delType === 'digits') { // 1. 删数字
          const number = formulaExprNodes[deletedCharObj.itemIndex].content;
          const bitIndex = cursorPosition - 1 - charObjQueue
            .findIndex(obj => obj.itemIndex === deletedCharObj.itemIndex);
          if (number.length === 1) {
            formulaExprNodes.splice(deletedCharObj.itemIndex, 1);
          } else {
            formulaExprNodes.splice(deletedCharObj.itemIndex, 1, {
              content: `${number.slice(0, bitIndex)}${number.slice(bitIndex + 1)}`, type: 'digits',
            });
          }
          /** aggr.offset 修正 */
          if (originalLength !== formulaExprNodes.length) { // length 有变
            const aggrItem = getParentAggr({ cursorPosition, charObjQueue, formulaExprNodes });
            if (aggrItem) { // 若在aggr内 则offset+1
              aggrItem.offset -= 1;
            }
          }
        } else if (delType === 'function') { // 2. 删aggr
          newCursorPosition = deletedCharObj.content === '】' ?
            cursorPosition - 2 : cursorPosition - 1;
          const { itemIndex } = deletedCharObj;
          const { offset } = formulaExprNodes[itemIndex];
          const endIndex = itemIndex + offset + 1;
          /** char|undefined, ..., char|undefined */
          const involSeg = [ // 头尾可能出现 undefined
            formulaExprNodes[itemIndex - 1],
            ...formulaExprNodes.slice(itemIndex + 1, endIndex + 1),
          ].filter(item => item);
          const spliceStart = formulaExprNodes[itemIndex - 1] ? itemIndex - 1 : itemIndex;
          const spliceCount = involSeg.length + 1;
          /** 【 】 处可能出现需要合并的数字 */
          if ((involSeg[0] && (involSeg[0].type === 'digits')) &&
            (involSeg[1] && (involSeg[1].type === 'digits'))) {
            involSeg.splice(0, 2, {
              content: `${involSeg[0].content}${involSeg[1].content}`,
              type: 'digits',
            });
          }
          if ((involSeg[involSeg.length - 1] && (involSeg[involSeg.length - 1].type === 'digits')) &&
            (involSeg[involSeg.length - 2] && (involSeg[involSeg.length - 2].type === 'digits'))) {
            involSeg.splice(involSeg.length - 2, 2, {
              content: `${involSeg[involSeg.length - 2].content}${involSeg[involSeg.length - 1].content}`,
              type: 'digits',
            });
          }
          formulaExprNodes.splice(spliceStart, spliceCount, ...involSeg);
        } else { // 3. 删 其他 - 算符 - 字段
          const leftSecCharObj = charObjQueue[cursorPosition - 2];
          const rightCharObj = charObjQueue[cursorPosition];
          const leftSecExpNode = leftSecCharObj && formulaExprNodes[leftSecCharObj.itemIndex];
          const rightExpNode = rightCharObj && formulaExprNodes[rightCharObj.itemIndex];
          if ((leftSecExpNode && leftSecExpNode.type === 'digits') && (rightExpNode && rightExpNode.type === 'digits')) { // 需要合并两个数字
            formulaExprNodes.splice(leftSecCharObj.itemIndex, 3, {
              content: `${leftSecExpNode.content}${rightCharObj.content}`, type: 'digits',
            });
          } else {
            formulaExprNodes.splice(deletedCharObj.itemIndex, 1);
          }
          /** aggr.offset 修正 */
          if (originalLength !== formulaExprNodes.length) { // length 有变
            const aggrItem = getParentAggr({ cursorPosition, charObjQueue, formulaExprNodes });
            if (aggrItem) { // 若在aggr内 则offset+1
              aggrItem.offset -= 1;
            }
          }
        }
        this.props.writeYMetricFormula(formulaExprNodes);
        this.props.writeCursorPosition(newCursorPosition);
      } else if (key === 'ArrowLeft' && (cursorPosition > 0)) {
        this.props.writeCursorPosition(cursorPosition - 1);
      } else if (key === 'ArrowRight' && (cursorPosition < expNodesToCharNodes(formulaExprNodes).length)) {
        this.props.writeCursorPosition(cursorPosition + 1);
      }
    }
  }
  handleClearFormula = () => {
    this.props.writeYMetricFormula([]);
    this.props.writeCursorPosition(0);
  }
  toggleEventCallback = (modalOpened) => {
    const toggleEventListener = modalOpened ? window.addEventListener : window.removeEventListener;
    toggleEventListener('click', this.handleClick);
    toggleEventListener('keypress', this.handleInput);
    toggleEventListener('keydown', this.handleOperating);
  }
  msg = formatMsg(this.props.intl)
  writeInFieldOps = (op, index) => { this.fieldOptions[index] = op; }
  /** @param {string} content @param {number} cursorIndex @param {number} itemIndex */
  renderChar = (content, cursorIndex, itemIndex) => {
    const { formulaExprNodes } = this.props;
    const { type } = formulaExprNodes[itemIndex];
    if (content) {
      if (type === 'variable' || type === 'metricvar') { // field
        const fieldObj = this.props.measureFields
          .find(field => field.bm_field === content) ||
          this.props.countFields.find(field => field.dana_metric_uid === content);
        if (fieldObj) {
          return (<span
            key={cursorIndex}
            onClick={() => this.props.writeCursorPosition(cursorIndex + 1)}
            style={fieldTagStyle}
          >
            {fieldObj.bmf_label_name || fieldObj.dana_metric_name}
          </span>);
        }
        return null;
      }
      // operator bit aggr
      const style = ['+', '-', '*', '/', '(', ')'].includes(content) ? { padding: '0px 4px', marginBottom: lineMargin } : null;
      return (<span
        key={cursorIndex}
        onClick={() => this.props.writeCursorPosition(cursorIndex + 1)}
        style={style}
      >
        {content}
      </span>);
    }
    return content;
  }
  render() {
    const { focus } = this.state;
    const { formulaExprNodes, cursorPosition } = this.props;
    const charObjQueue = expNodesToCharNodes(formulaExprNodes);
    // const charList = [];
    const charList = charObjQueue
      .map((obj, index) => (this.renderChar(obj.content, index, obj.itemIndex)));
    if (focus) {
      charList.splice(cursorPosition, 0, <div style={fakeCursorStyle} key="cursor" />);
    }
    const customFormulaLabel = [
      <Col key="name" span={12}>{this.msg('defFormula')}</Col>,
      <Col key="clear" span={12} style={{ textAlign: 'right', color: '#1890ff' }}>
        <span style={{ cursor: 'pointer' }} onClick={this.handleClearFormula}>{this.msg('empty')}</span>
      </Col>,
    ];
    return (<FormItem label={customFormulaLabel} {...twoLineLayout} style={formItemStyle}>
      <div style={areaStyle} ref={(div) => { this.mainArea = div; }}>
        <span onClick={() => this.props.writeCursorPosition(0)} style={{ display: 'inline-block', width: 4, height: 20 }} />
        {charList}
      </div>
    </FormItem>);
  }
}
