import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Badge, Icon, Menu } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import NavLink from 'client/components/NavLink';
import { loadRepos, loadWorkspaceStat } from 'common/reducers/cmsTradeitem';
import { formatMsg } from './message.i18n';

@injectIntl
@connect(
  state => ({
    workspaceStat: state.cmsTradeitem.workspaceStat,
    wsStatReload: state.cmsTradeitem.wsStatReload,
  }),
  { loadRepos, loadWorkspaceStat }
)
export default class ModuleMenu extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    currentKey: PropTypes.string,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    this.props.loadRepos();
    this.props.loadWorkspaceStat();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.wsStatReload !== this.props.wsStatReload && nextProps.wsStatReload) {
      this.props.loadWorkspaceStat();
    }
  }
  msg = formatMsg(this.props.intl);
  render() {
    const { workspaceStat } = this.props;
    return (
      <div>
        <Menu defaultOpenKeys={['g_workspace', 'g_hscode']} mode="inline" selectedKeys={[this.props.currentKey]}>
          <Menu.Item key="repoList">
            <NavLink to="/clearance/tradeitem/repo"><Icon type="database" /> {this.msg('repoList')}</NavLink>
          </Menu.Item>
          <Menu.Item key="taskList">
            <NavLink to="/clearance/tradeitem/task">
              <Icon type="bars" /> {this.msg('taskList')}
              <span className="menu-badge"><Badge count={workspaceStat.task.count} style={{ backgroundColor: '#1890ff' }} /></span>
            </NavLink>
          </Menu.Item>
          <Menu.SubMenu key="g_workspace" title={<span><Icon type="block" /> {this.msg('workspace')}</span>}>
            <Menu.Item key="emerge">
              <NavLink to="/clearance/tradeitem/workspace/emerges">
                {this.msg('taskNew')}
                <span className="menu-badge"><Badge count={workspaceStat.emerge.count} style={{ backgroundColor: '#52c41a' }} overflowCount={99999} /></span>
              </NavLink>
            </Menu.Item>
            <Menu.Item key="conflict">
              <NavLink to="/clearance/tradeitem/workspace/conflicts">
                {this.msg('taskConflict')}
                <span className="menu-badge"><Badge count={workspaceStat.conflict.count} overflowCount={99999} /></span>
              </NavLink>
            </Menu.Item>
            <Menu.Item key="invalid">
              <NavLink to="/clearance/tradeitem/workspace/invalids">
                {this.msg('taskInvalid')}
                <span className="menu-badge"><Badge count={workspaceStat.invalid.count} overflowCount={99999} /></span>
              </NavLink>
            </Menu.Item>
            <Menu.Item key="pending">
              <NavLink to="/clearance/tradeitem/workspace/pendings">
                {this.msg('taskReview')}
                <span className="menu-badge"><Badge count={workspaceStat.pending.count} overflowCount={99999} style={{ backgroundColor: '#1890ff' }} /></span>
              </NavLink>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu key="g_hscode" title={<span><Icon type="read" /> {this.msg('hscodeCustoms')}</span>}>
            <Menu.Item key="hscodeQuery">
              <NavLink to="/clearance/tradeitem/hscode">{this.msg('hscodeQuery')}</NavLink>
            </Menu.Item>
            <Menu.Item key="hscodeSpecial">
              <NavLink to="/clearance/tradeitem/hscode/special">{this.msg('hscodeSpecial')}</NavLink>
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </div>);
  }
}
