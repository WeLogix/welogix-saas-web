import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Collapse } from 'antd';
import { loadDelgDeclRelates } from 'common/reducers/cmsDelegationDock';
import LogsPane from '../../common/logsPane';

const { Panel } = Collapse;

@connect(
  state => ({
    rels: state.cmsDelegationDock.delgDeclRelates,
  }),
  { loadDelgDeclRelates }
)
export default class DelgLogsPane extends React.Component {
  static propTypes = {
    delgNo: PropTypes.string.isRequired,
  }
  componentDidMount() {
    this.props.loadDelgDeclRelates(this.props.delgNo);
  }
  render() {
    const { rels, delgNo } = this.props;
    return (
      <div>
        <LogsPane
          billNo={delgNo}
          bizObject="cmsManifest"
        />
        <Collapse bordered={false} style={{ backgroundColor: 'transparent' }}>
          {rels.map(delgs =>
            (<Panel key={delgs[0].gen_seq_no} header={`${delgs[0].gen_seq_no}次生成报关建议书`}>
              {delgs.map(f => <LogsPane key={f.pre_entry_seq_no} billNo={f.pre_entry_seq_no} bizObject="cmsCustomsDecl" />)}
            </Panel>))}
        </Collapse>
      </div>
    );
  }
}
