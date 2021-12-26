import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';
import { message } from 'antd';
import DataPane from 'client/components/DataPane';
import RowAction from 'client/components/RowAction';
import { loadWorkItemSuggestions, adoptTradeItemSuggest } from 'common/reducers/cmsTradeitem';
import { getElementByHscode } from 'common/reducers/cmsHsCode';
import { showDeclElementsModal } from 'common/reducers/cmsManifest';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import DeclElementsModal from '../../../../common/modal/declElementsModal';
import { formatMsg } from '../../../message.i18n';

@injectIntl
@connect(
  state => ({
    suggestions: state.cmsTradeitem.workItemSuggestions,
  }),
  {
    loadWorkItemSuggestions,
    adoptTradeItemSuggest,
    getElementByHscode,
    showDeclElementsModal,
  }
)
export default class ItemSuggestPane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    workItem: PropTypes.shape({ id: PropTypes.number.isRequired }),
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    this.props.loadWorkItemSuggestions(this.props.workItem.id);
  }
  msg = formatMsg(this.props.intl)
  columns = [{
    title: '建议理由',
    dataIndex: 'advice',
    width: 200,
    align: 'center',
  }, {
    title: this.msg('copProductNo'),
    dataIndex: 'cop_product_no',
    width: 200,
  }, {
    title: this.msg('gName'),
    dataIndex: 'g_name',
    width: 200,
  }, {
    title: this.msg('enName'),
    dataIndex: 'en_name',
    width: 200,
  }, {
    title: this.msg('copCode'),
    dataIndex: 'cop_code',
    width: 100,
  }, {
    title: this.msg('hscode'),
    dataIndex: 'hscode',
    width: 100,
  }, {
    title: this.msg('gModel'),
    dataIndex: 'g_model',
    width: 260,
  }, {
    title: this.msg('opCol'),
    dataIndex: '_OPS_',
    render: (_, row) =>
      (<PrivilegeCover module="clearance" feature="compliance" action="edit">
        <RowAction onClick={this.handleAdoptAdvice} icon="rocket" label={this.msg('adoptAdvice')} row={row} />
      </PrivilegeCover>),
  }]
  handleAdoptAdvice = (row) => {
    this.props.adoptTradeItemSuggest(row.id).then((result) => {
      if (result.error) {
        message.error(result.error.message);
      } else {
        message.success('归类建议信息已填入');
      }
    });
  }
  /*
  handleShowDeclElementModal = () => {
    this.props.getElementByHscode(form.getFieldValue('hscode')).then((result) => {
      if (!result.error) {
        this.props.showDeclElementsModal(
          result.data.declared_elements,
          null,
          form.getFieldValue('g_model'),
          true,
          form.getFieldValue('g_name')
        );
      }
    });
  }
  */
  render() {
    const {
      suggestions,
    } = this.props;

    return (
      <DataPane
        columns={this.columns}
        indentSize={0}
        dataSource={suggestions}
        rowKey="id"
      >
        <DeclElementsModal disabled />
      </DataPane>
    );
  }
}

