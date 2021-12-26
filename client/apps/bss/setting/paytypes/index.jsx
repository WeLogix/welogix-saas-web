import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import connectNav from 'client/common/decorators/connect-nav';
import PageHeader from 'client/components/PageHeader';
import { loadInvoicingKinds, toggleCreateModal, updateInvoicingKind, deleteInvoicingKind } from 'common/reducers/saasInvoicingKind';
import AccountSetSelect from '../../common/accountSetSelect';
import BSSSettingMenu from '../menu';
import { formatMsg } from '../message.i18n';

const { Content } = Layout;

@injectIntl
@connect(
  state => ({
    invoicingKindList: state.saasInvoicingKind.saasInvoicingKindList,
  }),
  {
    loadInvoicingKinds, toggleCreateModal, updateInvoicingKind, deleteInvoicingKind,
  }
)
@connectNav({
  depth: 2,
  moduleName: 'bss',
  title: 'featBssSetting',
})
export default class PayTypes extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  msg = formatMsg(this.props.intl)
  render() {
    return (
      <Layout>
        <BSSSettingMenu currentKey="payTypes" openKey="paramPrefs" />
        <Layout>
          <PageHeader breadcrumb={[<AccountSetSelect onChange={this.handleWhseChange} />]} />
          <Content className="page-content" />
        </Layout>
      </Layout>
    );
  }
}
