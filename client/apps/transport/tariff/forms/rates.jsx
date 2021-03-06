import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col, Button, Upload, Modal, Progress, Switch, Tooltip, Icon } from 'antd';
import { loadRateEnds } from 'common/reducers/transportTariff';
import SearchBox from 'client/components/SearchBox';
import { createFilename } from 'client/util/dataTransform';
import { getEndTableVarColumns } from './commodity';
import RateSourceTable from './rateSourceTable';
import RateEndTable from './rateEndTable';

@connect(
  state => ({
    rateId: state.transportTariff.rateId,
    ratesEndList: state.transportTariff.ratesEndList,
    agreementRef: state.transportTariff.ratesRefAgreement,
    transModes: state.transportTariff.formParams.transModes,
    vehicleTypeParams: state.transportTariff.formParams.vehicleTypeParams,
    vehicleLengthParams: state.transportTariff.formParams.vehicleLengthParams,
    formData: state.transportTariff.agreement,
  }),
  { loadRateEnds }
)
export default class TariffRatesForm extends React.Component {
  static propTypes = {
    type: PropTypes.oneOf(['create', 'edit', 'view']),
    rateId: PropTypes.string,
    loadRateEnds: PropTypes.func.isRequired,
  }
  state = {
    sourceModal: false,
    endModal: false,
    uploadChangeCount: 0,
    inUpload: false,
    uploadPercent: 10,
    uploadStatus: 'active',
  }
  handleSourceAdd = () => {
    this.setState({ sourceModal: true });
  }
  handleEndAdd = () => {
    this.setState({ endModal: true });
  }
  handleVisibleChange = (type, visible) => {
    if (type === 'source') {
      this.setState({ sourceModal: visible });
    } else if (type === 'end') {
      this.setState({ endModal: visible });
    }
  }
  handleImport = (info) => {
    if (this.state.uploadChangeCount === 0) {
      this.state.uploadChangeCount++; // eslint-disable-line
      this.setState({ inUpload: true, uploadStatus: 'active', uploadPercent: 10 });
    } else if (info.event) {
      this.state.uploadChangeCount++; // eslint-disable-line
      this.setState({ uploadPercent: info.event.percent });
    } else if (info.file.status === 'done') {
      this.setState({ inUpload: false, uploadStatus: 'success' });
      this.state.uploadChangeCount = 0;
      this.props.loadRateEnds({
        rateId: this.props.rateId,
        pageSize: 20,
        current: 1,
        searchValue: this.props.ratesEndList.searchValue,
      });
    } else if (info.file.status === 'error') {
      this.setState({ inUpload: false, uploadStatus: 'exception' });
      this.state.uploadChangeCount = 0;
    }
  }
  handleEndExport = () => {
    if (this.props.rateId) {
      const {
        agreementRef, transModes, vehicleTypeParams, vehicleLengthParams, rateId,
      } = this.props;
      const varColumns = getEndTableVarColumns(
        agreementRef,
        transModes,
        vehicleTypeParams,
        vehicleLengthParams
      ).map(vc => vc.title);
      window.open(`${API_ROOTS.mongo}v1/transport/tariff/export/ratends/${createFilename('rate-ends')}.xlsx?rateId=${rateId}&columns=${JSON.stringify(varColumns)}`);
    }
  }
  handleSearch = (value) => {
    this.props.loadRateEnds({
      rateId: this.props.rateId,
      pageSize: 20,
      current: 1,
      searchValue: value,
    });
  }
  render() {
    const { type, formData, form: { getFieldDecorator } } = this.props;
    const {
      sourceModal, endModal, inUpload, uploadPercent, uploadStatus,
    } = this.state;
    const sourceToolbar = (<span>
      <Button
        icon="plus-circle-o"
        onClick={this.handleSourceAdd}
      >
        ??????
      </Button>
      <Tooltip title={
        <div>
          <div>??????????????? ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ???????????? ???????????????????????? ?????????</div>
          <div>??????????????? ??????????????????????????????????????????</div>
        </div>}
      >
        <Icon type="question-circle-o" />
      </Tooltip>
      <span>????????????: </span>
      {getFieldDecorator('accurateMatch', {
        valuePropName: 'checked',
        initialValue: formData.accurateMatch,
      })(<Switch
        disabled={!(type === 'create' || type === 'edit')}
        checkedChildren="???"
        unCheckedChildren="???"
      />)}
    </span>);

    const destToolbar = (<span>
      <SearchBox placeholder="?????????" onSearch={this.handleSearch} />
      <Button icon="plus-circle-o" onClick={this.handleEndAdd} disabled={!this.props.rateId}>
        ??????
      </Button>
      <Upload
        accept=".xls,.xlsx"
        action={`${API_ROOTS.mongo}v1/transport/tariff/import/ratends`}
        data={{ rateId: this.props.rateId }}
        onChange={this.handleImport}
        showUploadList={false}
        withCredentials
      >
        <Button icon="upload" style={{ marginRight: 8 }}>???????????????</Button>
      </Upload>
      <Button icon="download" onClick={this.handleEndExport}>
        ???????????????
      </Button>
    </span>);
    return (
      <div style={{ padding: 16 }}>
        <Row gutter={16}>
          <Col sm={6}>
            <RateSourceTable
              toolbarActions={sourceToolbar}
              visibleModal={sourceModal}
              onChangeVisible={this.handleVisibleChange}
              type={type}
            />
          </Col>
          <Col sm={18}>
            {this.props.rateId &&
              <RateEndTable
                toolbarActions={destToolbar}
                visibleModal={endModal}
                onChangeVisible={this.handleVisibleChange}
                type={type}
              />
            }
          </Col>
        </Row>
        <Modal maskClosable={false} closable={false} footer={[]} visible={inUpload}>
          <Progress
            type="circle"
            percent={uploadPercent}
            status={uploadStatus}
            style={{ display: 'block', margin: '0 auto', width: '40%' }}
          />
        </Modal>
      </div>
    );
  }
}
