import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import { locationShape } from 'react-router';
import HeaderNavbar from 'client/apps/home/headerNavbar';
import { getUnionTenants } from 'common/reducers/saasTenant';
import { TENANT_LEVEL } from 'common/constants';

const { Header } = Layout;
@connect(state => ({
  unionId: state.account.unionId,
  tenantLevel: state.account.tenantLevel,
}), { getUnionTenants })
export default class Module extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    location: locationShape.isRequired,
  }
  static childContextTypes = {
    location: locationShape.isRequired,
  }
  getChildContext() {
    return { location: this.props.location };
  }
  componentDidMount() {
    if (this.props.tenantLevel === TENANT_LEVEL[2].value && this.props.unionId) {
      this.props.getUnionTenants(this.props.unionId);
    }
  }
  render() {
    return (
      <Layout>
        <Header>
          <HeaderNavbar />
        </Header>
        <Layout id="module-layout">
          {this.props.children}
        </Layout>
      </Layout>
    );
  }
}
