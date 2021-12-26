import React from 'react';
import { Alert, Icon, Layout } from 'antd';
import { detect } from 'detect-browser';
import { injectIntl } from 'react-intl';
import TransparentHeaderBar from 'client/components/transparentHeaderBar';
import './sso.less';

const { Header, Content, Footer } = Layout;

function renderBrowserTip() {
  const browser = detect();
  switch (browser && browser.name) {
    case 'chrome':
    case 'firefox':
    case 'edge':
      return (<span />);
    default:
      return (<Alert
        message="支持现代浏览器和IE10及以上"
        description={<span>推荐使用
          <a
            rel="noopener noreferrer"
            href="http://rj.baidu.com/soft/detail/14744.html"
            target="_blank"
          ><Icon type="chrome" />Chrome谷歌浏览器</a>
        </span>}
        type="info"
        showIcon
      />
      );
  }
}

@injectIntl
export default class SSOPack extends React.Component {
  render() {
    return (
      <Layout className="splash-screen">
        <Header style={{ background: 'transparent' }}>
          <TransparentHeaderBar title="" />
        </Header>
        <Content className="page-content layout-fixed-width layout-fixed-width-small">
          <div className="center-card-wrapper">
            {this.props.children}
          </div>
          {renderBrowserTip()}
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          <div>
            <a rel="noopener noreferrer" href="https://www.welogix.tech" target="_blank">© 2016-2019 Weloyun.com</a>
          </div>
          <div className="ack">
            <a rel="noopener noreferrer" href="#" target="_blank">Photo by Jaromír Chalabala</a>
          </div>
          <div className="reg">
            <a rel="noopener noreferrer" href="http://www.miitbeian.gov.cn/" target="_blank">沪ICP备16046609号-3</a>
          </div>
        </Footer>
      </Layout>);
  }
}
