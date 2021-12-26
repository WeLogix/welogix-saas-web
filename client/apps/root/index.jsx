import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import enUS from 'antd/lib/locale-provider/en_US';
import { loadCorpByDomain } from 'common/reducers/corp-domain';
import { loadTranslation } from 'common/reducers/saasUser';
import { isLoaded } from 'client/common/redux-actions';
import connectFetch from 'client/common/decorators/connect-fetch';
import './root.less';

const MomentLocaleMap = {
  zh: 'zh-cn',
  en: 'en',
};

const AntdLocaleMap = {
  zh: zhCN,
  en: enUS,
};

function fetchData({ state, dispatch }) {
  const promises = [];
  if (!isLoaded(state, 'corpDomain')) {
    let { subdomain } = state.corpDomain;
    if (__DEV__ && !subdomain) {
      ({ subdomain } = state.account); // development subdomain fallback on login
    }
    const prom = dispatch(loadCorpByDomain(subdomain));
    promises.push(prom);
  }
  if (!isLoaded(state, 'saasUser')) {
    // set initial locale on server render FIXME
    const prom = dispatch(loadTranslation(state.saasUser.locale));
    promises.push(prom);
  }
  return Promise.all(promises);
}

@connectFetch()(fetchData)
@connect(state => ({
  locale: state.saasUser.locale,
  messages: state.saasUser.messages,
  isAuthed: state.auth.isAuthed,
  opencode: state.auth.opencode,
}))
export default class Root extends React.Component {
  static defaultProps = {
    locale: 'zh',
  }
  static propTypes = {
    children: PropTypes.node.isRequired,
    location: PropTypes.shape({
      query: PropTypes.shape({ subdomain: PropTypes.string }),
    }).isRequired,
    locale: PropTypes.oneOf(['zh', 'en']),
    messages: PropTypes.shape({}).isRequired,
    isAuthed: PropTypes.bool.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    const { locale } = this.props;
    moment.locale(MomentLocaleMap[locale]);
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.isAuthed && nextProps.isAuthed) {
      const { next, oauth_redirecturl: oaRedirectUrl, ...queryParams } = nextProps.location.query;
      if (oaRedirectUrl) {
        const { opencode } = nextProps;
        const redirectUrl = decodeURIComponent(oaRedirectUrl);
        if (redirectUrl.indexOf('?') !== -1) {
          window.location.href = `${redirectUrl}&opencode=${opencode}`;
        } else {
          window.location.href = `${redirectUrl}?opencode=${opencode}`;
        }
        return;
      }
      const redirectUrl = next ? decodeURIComponent(next) : '/';
      this.context.router.replace({ pathname: redirectUrl, query: queryParams });
    }
    if (nextProps.locale !== this.props.locale) {
      moment.locale(MomentLocaleMap[nextProps.locale]);
    }
  }
  render() {
    const { locale, messages } = this.props;
    return (<LocaleProvider locale={AntdLocaleMap[locale]}>
      <IntlProvider locale={locale} messages={messages} defaultLocale={Root.defaultProps.locale}>
        {this.props.children}
      </IntlProvider>
    </LocaleProvider>);
  }
}
