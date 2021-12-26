import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import { locationShape } from 'react-router';
import { intlShape, injectIntl } from 'react-intl';
import CorpHeaderBar from 'client/components/corpHeaderBar';
import { formatMsg } from './message.i18n';

const { Header } = Layout;

@injectIntl
export default class CorpPack extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    location: locationShape.isRequired,

    children: PropTypes.node.isRequired,
  }
  static childContextTypes = {
    location: locationShape.isRequired,
  }
  getChildContext() {
    return { location: this.props.location };
  }
  msg = formatMsg(this.props.intl)

  render() {
    return (
      <Layout>
        <Header>
          <CorpHeaderBar title={this.msg('corpAdmin')} />
        </Header>
        <Layout>
          {this.props.children}
        </Layout>
      </Layout>);
  }
}
