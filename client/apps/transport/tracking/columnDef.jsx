import React from 'react';
import moment from 'moment';
import { Badge, Icon, Tooltip } from 'antd';
import TrimSpan from 'client/components/trimSpan';
import { PrivilegeCover } from 'client/common/decorators/withPrivilege';
import { LogixIcon } from 'client/components/FontIcon';
import { SHIPMENT_TRACK_STATUS, SHIPMENT_POD_STATUS, SHIPMENT_VEHICLE_CONNECT, PROMPT_TYPES, TRANS_MODE_INDICATOR } from 'common/constants';
import RowAction from 'client/components/RowAction';
import AddressColumn from '../common/addressColumn';
import ShipmtnoColumn from '../common/shipmtnoColumn';
import ShipmtLocationColumn from '../common/shipmtLocationColumn';
import PickupDeliverPopover from '../common/popover/pickupDeliverPopover';
import ExceptionsPopover from '../common/popover/exceptionsPopover';

function renderActDate(recordActDate, recordEstDate) {
  if (recordActDate) {
    const actDate = new Date(recordActDate);
    actDate.setHours(0, 0, 0, 0);
    const estDate = new Date(recordEstDate);
    estDate.setHours(0, 0, 0, 0);
    if (actDate.getTime() > estDate.getTime()) {
      return (
        <span className="mdc-text-red">
          {moment(recordActDate).format('YYYY.MM.DD')}
        </span>);
    }
    return (
      <span className="mdc-text-green">
        {moment(recordActDate).format('YYYY.MM.DD')}
      </span>);
  }
  return <span />;
}
export default function makeColumns(type, handlers, msg) {
  const columns = [{
    title: msg('shipNo'),
    dataIndex: 'shipmt_no',
    fixed: 'left',
    width: 180,
    render: (o, record) => (
      <ShipmtnoColumn
        shipmtNo={record.shipmt_no}
        shipment={record}
        onClick={handlers.onShipmtPreview}
      />),
  }, {
    title: '',
    dataIndex: 'location',
    width: 30,
    render: (o, record) => <ShipmtLocationColumn shipment={record} publicKey={record.public_key} />,
  }, {
    title: msg('refCustomerNo'),
    dataIndex: 'ref_external_no',
    width: 140,
  }, {
    title: msg('departurePlace'),
    width: 250,
    render: (o, record) => (<AddressColumn shipment={record} consignType="consigner" />),
  }, {
    title: msg('shipmtEstPickupDate'),
    dataIndex: 'pickup_est_date',
    width: 100,
    render: (o, record) => moment(record.pickup_est_date).format('YYYY.MM.DD'),
  }, {
    title: msg('shipmtActPickupDate'),
    dataIndex: 'pickup_act_date',
    width: 120,
    render: (o, record) => {
      const location = {
        province: record.consigner_province,
        city: record.consigner_city,
        district: record.consigner_district,
        address: record.consigner_addr,
      };
      if (type === 'status' && (record.status === SHIPMENT_TRACK_STATUS.dispatched || record.status === SHIPMENT_TRACK_STATUS.intransit)) {
        let showData = null;
        if (record.status === SHIPMENT_TRACK_STATUS.dispatched) {
          showData = msg('updatePickup');
        } else if (record.status === SHIPMENT_TRACK_STATUS.intransit) {
          showData = renderActDate(record.pickup_act_date, record.pickup_est_date);
        }
        if (record.sp_tenant_id === -1) {
          return (
            <PrivilegeCover module="transport" feature="tracking" action="edit">
              <PickupDeliverPopover
                type="pickup"
                shipmtNo={record.shipmt_no}
                parentNo={record.parent_no}
                dispId={record.disp_id}
                estDate={record.pickup_est_date}
                actDate={record.pickup_act_date}
                onOK={handlers.onTableLoad}
                location={location}
                status={record.status}
              >
                {showData} <Icon type="edit" />
              </PickupDeliverPopover>
            </PrivilegeCover>
          );
        } else if (record.sp_tenant_id === 0) {
          // ??????????????????
          if (record.vehicle_connect_type === SHIPMENT_VEHICLE_CONNECT.disconnected) {
            // ????????????
            return (
              <PrivilegeCover module="transport" feature="tracking" action="edit">
                <PickupDeliverPopover
                  type="pickup"
                  shipmtNo={record.shipmt_no}
                  parentNo={record.parent_no}
                  dispId={record.disp_id}
                  estDate={record.pickup_est_date}
                  actDate={record.pickup_act_date}
                  onOK={handlers.onTableLoad}
                  location={location}
                  status={record.status}
                >
                  {showData} <Icon type="edit" />
                </PickupDeliverPopover>
              </PrivilegeCover>
            );
          }
        } else {
          return renderActDate(record.pickup_act_date, record.pickup_est_date);
        }
      }
      return renderActDate(record.pickup_act_date, record.pickup_est_date);
    },
  }, {
    title: msg('arrivalPlace'),
    width: 250,
    render: (o, record) => (<AddressColumn shipment={record} consignType="consignee" />),
  }, {
    title: msg('shipmtEstDeliveryDate'),
    dataIndex: 'deliver_est_date',
    width: 100,
    render: (o, record) => moment(record.deliver_est_date).format('YYYY.MM.DD'),
  }, {
    title: msg('shipmtPrmDeliveryDate'),
    dataIndex: 'deliver_prm_date',
    width: 100,
    render: o => (o ? moment(o).format('YYYY.MM.DD') : ''),
  }, {
    title: msg('shipmtActDeliveryDate'),
    dataIndex: 'deliver_act_date',
    width: 120,
    render: (o, record) => {
      const location = {
        province: record.consignee_province,
        city: record.consignee_city,
        district: record.consignee_district,
        address: record.consignee_addr,
      };
      if (type === 'status' && (record.status === SHIPMENT_TRACK_STATUS.intransit || record.status === SHIPMENT_TRACK_STATUS.delivered)) {
        let showData = null;
        if (record.status === SHIPMENT_TRACK_STATUS.intransit) {
          showData = msg('updateDelivery');
        } else if (record.status === SHIPMENT_TRACK_STATUS.delivered) {
          showData = renderActDate(record.deliver_act_date, record.deliver_est_date);
        }
        if (record.sp_tenant_id === -1) {
          return (
            <PrivilegeCover module="transport" feature="tracking" action="edit">
              <PickupDeliverPopover
                type="deliver"
                shipmtNo={record.shipmt_no}
                parentNo={record.parent_no}
                dispId={record.disp_id}
                estDate={record.deliver_est_date}
                actDate={record.deliver_act_date}
                onOK={handlers.onTableLoad}
                location={location}
                status={record.status}
              >
                {showData} <Icon type="edit" />
              </PickupDeliverPopover>
            </PrivilegeCover>
          );
        } else if (record.sp_tenant_id === 0) {
          if (record.vehicle_connect_type === SHIPMENT_VEHICLE_CONNECT.disconnected) {
            return (
              <PrivilegeCover module="transport" feature="tracking" action="edit">
                <PickupDeliverPopover
                  type="deliver"
                  shipmtNo={record.shipmt_no}
                  parentNo={record.parent_no}
                  dispId={record.disp_id}
                  estDate={record.deliver_est_date}
                  actDate={record.deliver_act_date}
                  onOK={handlers.onTableLoad}
                  location={location}
                  status={record.status}
                >
                  {showData} <Icon type="edit" />
                </PickupDeliverPopover>
              </PrivilegeCover>
            );
          }
        } else {
          return renderActDate(record.deliver_act_date, record.deliver_est_date);
        }
      }
      return renderActDate(record.deliver_act_date, record.deliver_est_date);
    },
  }, {
    title: msg('shipmtStatus'),
    dataIndex: 'status',
    width: 100,
    render: (o, record) => {
      if (record.status === SHIPMENT_TRACK_STATUS.unaccepted) {
        return <Badge status="default" text={msg('pendingShipmt')} />;
      } else if (record.status === SHIPMENT_TRACK_STATUS.accepted) {
        return <Badge status="default" text={msg('acceptedShipmt')} />;
      } else if (record.status === SHIPMENT_TRACK_STATUS.dispatched) {
        return <Badge status="warning" text={msg('dispatchedShipmt')} />;
      } else if (record.status === SHIPMENT_TRACK_STATUS.intransit) {
        return <Badge status="processing" text={msg('intransitShipmt')} />;
      } else if (record.status === SHIPMENT_TRACK_STATUS.delivered) {
        return <Badge status="success" text={msg('deliveredShipmt')} />;
      } else if (record.status >= SHIPMENT_TRACK_STATUS.podsubmit) {
        return <Badge status="success" text={msg('proofOfDelivery')} />;
      }
      return <span />;
    },
  }, {
    title: msg('overtime'),
    key: 'late',
    width: 100,
    render(o, record) {
      if (record.pickup_act_date) {
        const deliveredActDate = new Date(record.deliver_act_date);
        deliveredActDate.setHours(0, 0, 0, 0);
        const deliverEstDate = new Date(record.deliver_est_date);
        deliverEstDate.setHours(0, 0, 0, 0);
        const daysDiff = moment(deliveredActDate).diff(deliverEstDate, 'days');
        if (daysDiff > 0) {
          return `??????${daysDiff}???`;
        }
      }
      return '';
    },
  }, {
    title: msg('shipmtException'),
    dataIndex: 'excp_count',
    width: 50,
    render(o, record) {
      return (<ExceptionsPopover
        shipmtNo={record.shipmt_no}
        dispId={record.disp_id}
        excpCount={o}
      />);
    },
  }];

  columns.push({
    title: msg('shipmtCarrier'),
    dataIndex: 'sp_name',
    width: 180,
    render: (o, record) => {
      if (record.sp_name) {
        const spSpan = <TrimSpan text={record.sp_name} maxLen={10} />;
        if (record.sp_tenant_id > 0) {
          // todo pure css circle
          return (
            <span>
              {spSpan}
            </span>
          );
        } else if (record.sp_tenant_id === -1) {
          return (
            <span>
              <Icon type="info-circle-o" /> {spSpan}
            </span>
          );
        }
        return spSpan;
      }
      return msg('ownFleet');
    },
    filters: handlers.carriers.map(item => ({ text: item.partner_code ? `${item.partner_code} | ${item.name}` : item.name, value: item.id })),
  }, {
    title: msg('shipmtVehicle'),
    dataIndex: 'task_vehicle',
    width: 120,
    render: (o, record) => {
      if (record.status === SHIPMENT_TRACK_STATUS.accepted) {
        if (record.sp_tenant_id === -1) { // ????????????????????????
          return (
            <PrivilegeCover module="transport" feature="tracking" action="edit">
              <RowAction
                label={msg('updateVehicleDriver')}
                onClick={handlers.onShowVehicleModal}
                row={record}
              />
            </PrivilegeCover>
          );
        }
      }
      return (<TrimSpan text={o} maxLen={14} />);
    },
  }, {
    title: msg('packageNum'),
    dataIndex: 'total_count',
    width: 60,
  }, {
    title: msg('shipWeight'),
    dataIndex: 'total_weight',
    width: 60,
  }, {
    title: msg('shipVolume'),
    dataIndex: 'total_volume',
    width: 60,
  }, {
    title: msg('srName'),
    dataIndex: 'p_sr_name',
    width: 180,
    render: o => <TrimSpan text={o} maxLen={10} />,
  }, {
    title: msg('shipmtMode'),
    dataIndex: 'transport_mode_code',
    width: 100,
    render: (o, record) => {
      const mode = TRANS_MODE_INDICATOR.filter(ts => ts.value === o)[0];
      return mode ? <span><LogixIcon type={`icon-${mode.icon}`} /> {mode.text}</span>
        : <span>{record.transport_mode}</span>;
    },
  });

  if (type === 'pod') { // ????????????
    columns.push({
      title: msg('spDispLoginName'),
      dataIndex: 'sp_disp_login_name',
      width: 80,
    }, {
      title: msg('proofOfDelivery'),
      dataIndex: 'pod_type',
      fixed: 'right',
      width: 60,
      render: (text, record) => {
        if (record.pod_type === 'qrPOD') {
          return (<Tooltip title="??????????????????"><Icon type="qrcode" /></Tooltip>);
        } else if (record.pod_type === 'ePOD') {
          return (<Tooltip title="??????????????????"><Icon type="scan" /></Tooltip>);
        }
        return (<Tooltip title="??????????????????"><Icon type="file-excel" /></Tooltip>);
      },
    }, {
      title: msg('podTime'),
      fixed: 'right',
      width: 120,
      render: (o, record) => {
        if (record.status >= SHIPMENT_TRACK_STATUS.podsubmit) {
          return `${msg('podUploadAction')}
            ${moment(record.pod_recv_date).format('MM.DD HH:mm')}`;
        }
        return null;
      },
    }, {
      title: msg('podStatus'),
      fixed: 'right',
      width: 100,
      render: (o, record) => {
        if (record.pod_status === null || record.pod_status === SHIPMENT_POD_STATUS.unsubmit) {
          return '?????????';
        } else if (record.pod_status === SHIPMENT_POD_STATUS.pending) {
          return '?????????';
        } else if (record.pod_status === SHIPMENT_POD_STATUS.rejectByUs) {
          return '????????????';
        } else if (record.pod_status === SHIPMENT_POD_STATUS.acceptByUs) {
          return '????????????';
        } else if (record.pod_status === SHIPMENT_POD_STATUS.rejectByClient) {
          return '????????????';
        } else if (record.pod_status === SHIPMENT_POD_STATUS.acceptByClient) {
          return '????????????';
        }
        return '';
      },
    }, {
      title: msg('shipmtNextUpdate'),
      width: 120,
      fixed: 'right',
      render: (o, record) => {
        if (record.pod_status === null || record.pod_status === SHIPMENT_POD_STATUS.unsubmit) {
          if (record.sp_tenant_id === -1) {
            return '';
          } else if (record.sp_tenant_id === 0) {
            if (record.vehicle_connect_type === SHIPMENT_VEHICLE_CONNECT.disconnected) {
              return '';
            }
            // ????????????
            return (
              <PrivilegeCover module="transport" feature="tracking" action="create">
                <RowAction
                  label={msg('notifyPOD')}
                  row={record}
                  onClick={() => { handlers.sendMessage({ module: 'transport', promptType: PROMPT_TYPES.promptDriverPod, shipment: record }); }}
                />
              </PrivilegeCover>
            );
          }
          // ???????????????
          return (
            <PrivilegeCover module="transport" feature="tracking" action="create">
              <RowAction
                label={msg('notifyPOD')}
                row={record}
                onClick={() => { handlers.sendMessage({ module: 'transport', promptType: PROMPT_TYPES.promptSpPod, shipment: record }); }}
              />
            </PrivilegeCover>
          );
        } else if (record.pod_status === SHIPMENT_POD_STATUS.rejectByClient) {
          // ????????????
          return '';
        } else if (record.pod_status === SHIPMENT_POD_STATUS.pending) {
          // ????????????
          return (
            <div>
              <PrivilegeCover module="transport" feature="tracking" action="create">
                <RowAction
                  label={msg('auditPod')}
                  onClick={handlers.onShowAuditModal}
                  row={record}
                />
              </PrivilegeCover>
            </div>
          );
        } else if (record.pod_status === SHIPMENT_POD_STATUS.rejectByUs) {
          // ????????????
          return (
            <span><Icon type="clock-circle-o" /> {msg('waitingResubmitPOD')}</span>
          );
        } else if (record.pod_status === SHIPMENT_POD_STATUS.acceptByUs) {
          if (record.tenant_id === handlers.tenantId) {
            if (record.deliver_confirmed === 0) {
              return (
                <PrivilegeCover module="transport" feature="tracking" action="edit">
                  <div>
                    <RowAction
                      label={msg('deliverConfirm')}
                      row={record}
                      onClick={() => { handlers.deliverConfirm(record.shipmt_no, record.disp_id); }}
                    />
                  </div>
                </PrivilegeCover>
              );
            }
            return (
              <span><Icon type="smile" /> {msg('finished')}</span>
            );
          }
          // ?????????????????????
          return (
            <span><Icon type="clock-circle-o" /> {msg('submitToUpper')}</span>
          );
        }
        return null;
      },
    });
  } else if (type === 'status') {
    columns.push({
      title: msg('proofOfDelivery'),
      dataIndex: 'pod_type',
      width: 60,
      render: (text, record) => {
        if (record.pod_type === 'qrPOD') {
          return (<Tooltip title="??????????????????"><Icon type="qrcode" /></Tooltip>);
        } else if (record.pod_type === 'ePOD') {
          return (<Tooltip title="??????????????????"><Icon type="scan" /></Tooltip>);
        }
        return (<Tooltip title="??????????????????"><Icon type="file-excel" /></Tooltip>);
      },
    }, {
      title: msg('shipmtPrevTrack'),
      width: 120,
      render: (o, record) => {
        if (record.status === SHIPMENT_TRACK_STATUS.unaccepted) {
          return `${msg('sendAction')}
            ${moment(record.disp_time || record.created_date).format('MM.DD HH:mm')}`;
        } else if (record.status === SHIPMENT_TRACK_STATUS.accepted) {
          return `${msg('acceptAction')}
            ${moment(record.acpt_time).format('MM.DD HH:mm')}`;
        } else if (record.status === SHIPMENT_TRACK_STATUS.dispatched) {
          return `${msg('dispatchAction')}
            ${moment(record.disp_time).format('MM.DD HH:mm')}`;
        } else if (record.status === SHIPMENT_TRACK_STATUS.intransit) {
          return `${msg('pickupAction')}
            ${moment(record.pickup_act_date).format('MM.DD HH:mm')}`;
        } else if (record.status === SHIPMENT_TRACK_STATUS.delivered) {
          return `${msg('deliverAction')}
            ${moment(record.deliver_act_date).format('MM.DD HH:mm')}`;
        } else if (record.status >= SHIPMENT_TRACK_STATUS.podsubmit) {
          return `${msg('podUploadAction')}
            ${moment(record.pod_recv_date).format('MM.DD HH:mm')}`;
        }
        return null;
      },
    }, {
      title: msg('spDispLoginName'),
      dataIndex: 'sp_disp_login_name',
      width: 80,
    }, {
      title: msg('shipmtNextUpdate'),
      width: 100,
      fixed: 'right',
      dataIndex: 'OPS_COL',
      render: (o, record) => {
        if (record.status === SHIPMENT_TRACK_STATUS.unaccepted) { // ?????????
          return (
            <div>
              <PrivilegeCover module="transport" feature="tracking" action="create">
                <RowAction
                  label={msg('notifyAccept')}
                  row={record}
                  onClick={() => { handlers.sendMessage({ module: 'transport', promptType: PROMPT_TYPES.promptAccept, shipment: record }); }}
                />
              </PrivilegeCover>
            </div>
          );
        } else if (record.status === SHIPMENT_TRACK_STATUS.accepted) { // ?????????
          if (record.sp_tenant_id === -1) {
            // ????????????????????????
            return (
              <div>
                <PrivilegeCover module="transport" feature="tracking" action="edit">
                  <RowAction
                    label={msg('updateVehicleDriver')}
                    row={record}
                    onClick={handlers.onShowVehicleModal}
                  />
                </PrivilegeCover>
              </div>
            );
          }
          return (
            <div>
              <PrivilegeCover module="transport" feature="tracking" action="create">
                <RowAction
                  label={msg('notifyDispatch')}
                  row={record}
                  onClick={() => { handlers.sendMessage({ module: 'transport', promptType: PROMPT_TYPES.promptDispatch, shipment: record }); }}
                />
              </PrivilegeCover>
            </div>
          );
        } else if (record.status === SHIPMENT_TRACK_STATUS.dispatched) { // ?????????
          if (record.sp_tenant_id === -1) {
            return (<div />);
          } else if (record.sp_tenant_id === 0) {
            // ??????????????????
            if (record.vehicle_connect_type === SHIPMENT_VEHICLE_CONNECT.disconnected) {
              // ????????????
              return (<div />);
            }
            // ??????????????????
            return (
              <div>
                <PrivilegeCover module="transport" feature="tracking" action="create">
                  <RowAction
                    label={msg('notifyPickup')}
                    row={record}
                    onClick={() => { handlers.sendMessage({ module: 'transport', promptType: PROMPT_TYPES.promptDriverPickup, shipment: record }); }}
                  />
                </PrivilegeCover>
              </div>
            );
          }
          // ?????????????????????
          return (
            <div>
              <PrivilegeCover module="transport" feature="tracking" action="create">
                <RowAction
                  label={msg('notifyPickup')}
                  row={record}
                  onClick={() => { handlers.sendMessage({ module: 'transport', promptType: PROMPT_TYPES.promptSpPickup, shipment: record }); }}
                />
              </PrivilegeCover>
            </div>
          );
        } else if (record.status === SHIPMENT_TRACK_STATUS.intransit) { // ?????????
          if (record.sp_tenant_id === -1) {
            return handlers.renderIntransitUpdater(record);
          } else if (record.sp_tenant_id === 0) {
            if (record.vehicle_connect_type === SHIPMENT_VEHICLE_CONNECT.disconnected) {
              return handlers.renderIntransitUpdater(record);
            }
          } else {
            return (<div />);
          }
        } else if (record.status >= SHIPMENT_TRACK_STATUS.delivered) { // ?????????
          if (record.deliver_confirmed === 0 && handlers.tenantId === record.tenant_id) {
            return (
              <PrivilegeCover module="transport" feature="tracking" action="edit">
                <div>
                  <RowAction
                    label={msg('deliverConfirm')}
                    row={record}
                    onClick={() => { handlers.deliverConfirm(record.shipmt_no, record.disp_id); }}
                  />
                </div>
              </PrivilegeCover>
            );
          }
        }
        return '';
      },
    });
  }
  return columns;
}
