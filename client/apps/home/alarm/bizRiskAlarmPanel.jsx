import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';
import { Button, Badge, Card, Drawer, Dropdown, Icon, List, Menu } from 'antd';
import RowAction from 'client/components/RowAction';
import { turnBizRiskAlarmPanel, loadBizAlarmList, dismissRiskAlarm, detectRiskAlarm } from 'common/reducers/saasInfra';
import { RISK_LEVELS } from 'common/constants';
import { formatMsg } from '../message.i18n';

@injectIntl
@connect(
  state => ({
    visible: state.saasInfra.riskAlarmPanel.bizPanelVisible,
    loading: state.saasInfra.panelListLoading,
    bizAlarmParam: state.saasInfra.riskAlarmPanel.bizAlarmParam,
    riskList: state.saasInfra.riskAlarmPanel.bizAlarmList,
  }),
  {
    turnBizRiskAlarmPanel, loadBizAlarmList, dismissRiskAlarm, detectRiskAlarm,
  }
)
export default class BizRiskAlarmPanel extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    riskList: PropTypes.arrayOf(PropTypes.shape({ status: PropTypes.number })),
    turnBizRiskAlarmPanel: PropTypes.func.isRequired,
  }
  state = {
    selectedStatus: 'newRisks',
    selLevel: 'allLevel',
    submitting: false,
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && !this.props.visible) {
      this.handleListLoad();
    }
  }
  msg = formatMsg(this.props.intl)
  handleRiskAlarmPanelHide = () => {
    this.props.turnBizRiskAlarmPanel(false);
  }
  handleMenuClick =({ key, keyPath }) => {
    if (key === 'allRisks' || key === 'newRisks') {
      this.setState({ selectedStatus: key });
      this.handleListLoad(key);
    } else if (keyPath[1] === 'level') {
      this.setState({ selLevel: key });
      this.handleListLoad(null, key);
    } else if (key === 'dismissAll') {
      this.handleDismiss();
    }
  }
  handleListLoad = (status, riskLevel) => {
    let statusQry = status || this.state.selectedStatus;
    if (statusQry === 'allRisks') {
      statusQry = undefined;
    } else if (statusQry === 'newRisks') {
      statusQry = 1;
    }
    let riskLevelQry = riskLevel || this.state.selLevel;
    riskLevelQry = RISK_LEVELS.find(rsl => rsl.key === riskLevelQry);
    if (riskLevelQry) {
      riskLevelQry = riskLevelQry.value;
    }
    this.props.loadBizAlarmList(this.props.bizAlarmParam, statusQry, riskLevelQry);
  }
  handleDismiss = (riskItem) => {
    if (riskItem) {
      this.props.dismissRiskAlarm(riskItem.id);
    } else {
      this.props.dismissRiskAlarm(null, this.props.bizAlarmParam);
    }
  }
  handleReDetect= () => {
    this.setState({ submitting: true });
    this.props.detectRiskAlarm(this.props.bizAlarmParam).then(() => {
      setTimeout(() => {
        this.setState({ submitting: false });
        this.handleListLoad();
      }, 3000);
    });
  }
  render() {
    const { visible, loading, riskList } = this.props;
    const { selectedStatus, selLevel, submitting } = this.state;
    const menu = (
      <Menu
        multiple
        onClick={this.handleMenuClick}
        selectedKeys={[selectedStatus, selLevel]}
      >
        <Menu.Item key="allRisks">
          {this.msg('allRisks')}
        </Menu.Item>
        <Menu.Item key="newRisks">
          {this.msg('newRisks')}
        </Menu.Item>
        <Menu.Divider />
        <Menu.SubMenu key="level" title={this.msg('riskLevel')}>
          {
            RISK_LEVELS.map(risk =>
              (<Menu.Item key={risk.key}>{risk.badge && <Badge status={risk.badge} />}
                {risk.text}</Menu.Item>))
          }
        </Menu.SubMenu>
        <Menu.Divider />
        <Menu.Item key="dismissAll">
          {this.msg('dismissAll')}
        </Menu.Item>
      </Menu>
    );
    return (
      <Drawer
        width={680}
        visible={visible}
        onClose={this.handleRiskAlarmPanelHide}
        title={<span><Icon type="bell" /> {this.msg('detectedRisks')}
          <Button type="primary" loading={submitting} onClick={this.handleReDetect} style={{ marginLeft: 30 }}>{this.msg('triggerDetect')}</Button>
        </span>}
      >
        <List
          header={<Dropdown overlay={menu}>
            <a>
              {this.msg(selectedStatus)}
              {selLevel !== 'allLevel' && ` - ${RISK_LEVELS.find(rkl => rkl.key === selLevel).text}`}
              <Icon type="down" />
            </a>
          </Dropdown>}
          dataSource={riskList}
          loading={loading}
          layout="vertical"
          className="notification-list"
          // pagination={pagination}
          renderItem={(item) => {
            let statusClass = 'unread';
            if (item.status === 2) {
              statusClass = 'read';
            } else if (item.status === 3) {
              statusClass = 'success';
            }
            const priority = RISK_LEVELS.find(pri => pri.value === item.level);
            let riskTitle = item.title;
            if (item.listseq) {
              riskTitle = `表体序号${item.listseq}: ${riskTitle}`;
            }
            // policy
            return (
              <List.Item key={item.id}>
                <Card
                  hoverable
                  size="small"
                  className={`list-item-card ${statusClass} ${priority && priority.badge}`}
                >
                  {item.status === 1 && <RowAction icon="close" onClick={this.handleDismiss} tooltip="忽略" row={item} />}
                  <Card.Meta
                    title={riskTitle}
                    description={(item.recom_ceil && item.recom_floor) ? `建议取值区间: [${Number(item.recom_floor.toFixed(4))}, ${Number(item.recom_ceil.toFixed(4))}]`
                      : ''}
                  />
                  <span className="timestamp">{item.created_date && moment(item.created_date).fromNow()}</span>
                </Card>
              </List.Item>
            );
          }}
        />
      </Drawer>
    );
  }
}
