import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, List } from 'antd';
import { intlShape, injectIntl } from 'react-intl';
import { CMS_EVENTS } from 'common/constants';
import { toggleEventsModal } from 'common/reducers/cmsPrefEvents';
import RowAction from 'client/components/RowAction';
import { formatMsg } from '../message.i18n';

@injectIntl
@connect(
  state => ({
    loginId: state.account.loginId,
  }),
  { toggleEventsModal }
)
export default class Events extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    toggleEventsModal: PropTypes.func.isRequired,
  }
  handleClick = (key) => {
    this.props.toggleEventsModal(true, key);
  }
  msg = formatMsg(this.props.intl)
  render() {
    return (
      <Card bodyStyle={{ padding: 0 }} >
        <List
          dataSource={CMS_EVENTS}
          renderItem={event => (
            <List.Item
              key={event.key}
              actions={[<RowAction label="关联费用" onClick={() => this.handleClick(event.key)} icon="pay-circle-o" />]}
            >
              <List.Item.Meta
                title={event.text}
                description={event.desc}
              />
            </List.Item>
                    )}
        />
      </Card>
    );
  }
}
