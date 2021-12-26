import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { Button, Col, Row } from 'antd';
import { toggleRefReportModal } from 'common/reducers/disAnalytics';
import FilterBox from '../../common/filterBox';
import DataRangeDropItem from '../dragComponents/dataRangeDropItem';
import { formatMsg } from '../message.i18n';


@injectIntl
@connect(
  state => ({
    currentChart: state.disAnalytics.currentChart,
    oldWhereClauses: state.disAnalytics.whereClauses,
  }),
  {
    toggleRefReportModal,
  },
)
export default class DataRangePane extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    whereClauses: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
    }))),
    handleFilterAdd: PropTypes.func.isRequired,
    handleFilterChange: PropTypes.func.isRequired,
    handleFilterDelete: PropTypes.func.isRequired,
  }
  componentDidMount() {}
  msg = formatMsg(this.props.intl);
  toggleRefReportModal = () => {
    this.props.toggleRefReportModal(true);
  }
  handleAddFilter = () => {
    this.props.handleFilterAdd();
  }
  render() {
    const {
      currentChart, whereClauses, dwObjectMeta, oldWhereClauses, chartParams,
    } = this.props;
    let filterNode = (
      <Button
        onClick={this.toggleRefReportModal}
        style={{ marginRight: 8 }}
      >引用报表筛选器
      </Button>);
    let addFilter;
    if (whereClauses.length !== 0) {
      filterNode = (<div>
        {whereClauses.map((whereClauseFieldsList, index) =>
        (<div className="filter-box">
          <FilterBox
            whereClauseFieldsList={whereClauseFieldsList}
            index={index}
            editable={!currentChart.dana_chart_report_ref}
            deletable
            rptParams={chartParams}
            handleFilterChange={this.props.handleFilterChange}
            handleFilterDelete={this.props.handleFilterDelete}
            DropTarget={DataRangeDropItem}
            reportObjectMeta={dwObjectMeta}
            oldWhereClauses={oldWhereClauses}
          />
          {(index !== whereClauses.length - 1) &&
                              (<div className="divide-line">
                                <span className="divide-text">或(OR)</span>
                              </div>)}
        </div>
        ))}
      </div>);
      if (!currentChart.dana_chart_report_ref) {
        addFilter = <Button onClick={this.handleAddFilter} icon="plus-circle" type="dashed">添加筛选器</Button>;
      }
    } else {
      addFilter = <Button onClick={this.handleAddFilter} icon="plus-circle" type="dashed">添加筛选器</Button>;
    }
    return (
      <Row className="pane-content-padding">
        <Col span={16}>
          {filterNode}
          {addFilter}
        </Col>
      </Row>
    );
  }
}
