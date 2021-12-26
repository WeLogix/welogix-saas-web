import React from 'react';
import PropTypes from 'prop-types';
import { Select, Tooltip } from 'antd';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { TENANT_LEVEL } from 'common/constants';
import { LogixIcon } from 'client/components/FontIcon';
import { formatMsg } from '../message.i18n';

const { Option } = Select;

@injectIntl
@connect(state => ({
  tenantId: state.account.tenantId,
  unionTenants: state.saasTenant.unionTenants,
}), { })
export default class TenantSelect extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    onTenantSelected: PropTypes.func,
    selectedTenant: PropTypes.string,
  }
  msg = formatMsg(this.props.intl)
  render() {
    const {
      unionTenants, tenantId, selectedTenant, onTenantSelected,
    } = this.props;
    if (unionTenants.length > 0) {
      return (<Select
        showArrow={false}
        value={selectedTenant || tenantId}
        onSelect={onTenantSelected}
      >
        {unionTenants.map(ut => (
          <Option value={ut.tenant_id} key={ut.tenant_id}>
            {ut.level === TENANT_LEVEL[2].value ?
              <Tooltip title={this.msg('affiliateHQ')} placement="left"><LogixIcon style={{ marginRight: 8 }} type="icon-hq" /></Tooltip> :
              <Tooltip title={this.msg('affiliateENT')} placement="left"><LogixIcon style={{ marginRight: 8 }} type="icon-ent" /></Tooltip>}{ut.name}
          </Option>
        ))}
      </Select>);
    }
    return null;
  }
}
