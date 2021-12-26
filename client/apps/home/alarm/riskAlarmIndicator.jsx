import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Badge, Avatar, Icon } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { turnFullRiskAlarmPanel, turnBizRiskAlarmPanel, loadAlarmIndiCount } from 'common/reducers/saasInfra';
import { setNavTitle } from 'common/reducers/navbar';
import { formatMsg } from '../message.i18n';

@injectIntl
@connect(state => ({
  visible: state.saasInfra.riskAlarmPanel.visible,
  bizAlarmParam: state.saasInfra.riskAlarmPanel.bizAlarmParam,
  totalAlarmCount: state.saasInfra.riskAlarmPanel.alarmIndiCount,
}), {
  turnFullRiskAlarmPanel, setNavTitle, turnBizRiskAlarmPanel, loadAlarmIndiCount,
})
export default class RiskAlarmIndicator extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    detailLevel: PropTypes.bool,
  }
  componentDidMount() {
    if (this.props.detailLevel) {
      if (this.props.bizAlarmParam.bizNo) {
        this.props.loadAlarmIndiCount(this.props.bizAlarmParam);
      }
    } else {
      // HeaderNavbar depth 1 会先进入这里  depth为3时生成另一个RAIndicator进上面分支
      this.props.loadAlarmIndiCount();
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.detailLevel) {
      if (nextProps.bizAlarmParam.bizNo &&
        nextProps.bizAlarmParam.bizNo !== this.props.bizAlarmParam.bizNo) {
        this.props.loadAlarmIndiCount(nextProps.bizAlarmParam);
      }
    }
  }
  msg = formatMsg(this.props.intl)
  handlePanelView = () => {
    if (this.props.detailLevel) {
      this.props.turnBizRiskAlarmPanel(!this.props.visible);
    } else {
      this.props.turnFullRiskAlarmPanel(!this.props.visible);
      this.props.setNavTitle({ dropDown: !this.props.visible });
    }
  }
  render() {
    const { visible, detailLevel, bizAlarmParam } = this.props;
    if (detailLevel && !bizAlarmParam.bizNo) {
      return null;
    }
    let badgeIcon;
    if (detailLevel) {
      badgeIcon = <Badge dot={this.props.totalAlarmCount > 0}><Avatar shape="square" icon="warning" style={{ backgroundColor: '#faad14' }} /></Badge>;
    } else {
      badgeIcon = <Badge count={this.props.totalAlarmCount} overflowCount={99}> <Icon type="alert" /> </Badge>;
    }
    return (
      <div onClick={this.handlePanelView} className={visible ? 'active' : ''}>
        {badgeIcon}
      </div>
    );
  }
}
