import { combineReducers } from 'redux';
import saasUser from './saasUser';
import auth from './auth';
import account from './account';
import notification from './notification';
import chinaRegions from './chinaRegions';
import navbar from './navbar';
import corpDomain from './corp-domain';
import corps from './corps';
import saasCollab from './saasCollab';
import personnel from './personnel';
import partner from './partner';
import role from './role';
import invitation from './invitation';
import operationLog from './operationLog';
import bssAudit from './bssAudit';
import bssSetting from './bssSetting';
import bssExRateSettings from './bssExRateSettings';
import bssBillTemplate from './bssBillTemplate';
import bssBill from './bssBill';
import bssStatement from './bssStatement';
import bssInvoice from './bssInvoice';
import bssSettlement from './bssSettlement';
import bssPayment from './bssPayment';
import bssVoucher from './bssVoucher';
import cmsDelegation from './cmsDelegation';
import cmsDelegationDock from './cmsDelegationDock';
import cmsCustomsDeclare from './cmsCustomsDeclare';
import cmsCiqInDecl from './cmsCiqInDecl';
import cmsPermit from './cmsPermit';
import cmsManifest from './cmsManifest';
import cmsManifestImport from './cmsManifestImport';
import cmsManifestTemplate from './cmsManifestTemplate';
import cmsInvoice from './cmsInvoice';
import cmsQuote from './cmsQuote';
import cmsResources from './cmsResources';
import cmsBrokers from './cmsBrokers';
import cmsExpense from './cmsExpense';
import cmsTradeitem from './cmsTradeitem';
import cmsHsCode from './cmsHsCode';
import cmsPrefEvents from './cmsPrefEvents';
import cmsDeclTax from './cmsDeclTax';
import sofOrders from './sofOrders';
import cwmReceive from './cwmReceive';
import cwmBlBook from './cwmBlBook';
import cwmSasblReg from './cwmSasblReg';
import cwmOutbound from './cwmOutbound';
import cwmInventoryStock from './cwmInventoryStock';
import cwmMovement from './cwmMovement';
import cwmWarehouse from './cwmWarehouse';
import cwmWhseLocation from './cwmWhseLocation';
import cwmShFtz from './cwmShFtz';
import cwmShFtzDecl from './cwmShFtzDecl';
import cwmShFtzStock from './cwmShFtzStock';
import cwmShippingOrder from './cwmShippingOrder';
import cwmContext from './cwmContext';
import cwmTransaction from './cwmTransaction';
import cwmTransition from './cwmTransition';
import cwmOwnerQuery from './cwmOwnerQuery';
import cwmSku from './cwmSku';
import hubDataAdapter from './hubDataAdapter';
import hubDevApp from './hubDevApp';
import hubIntegration from './hubIntegration';
import scofFlow from './scofFlow';
import sofOrderPref from './sofOrderPref';
import sofGlobalTrack from './sofGlobalTrack';
import sofInvoice from './sofInvoice';
import sofPurchaseOrders from './sofPurchaseOrders';
import transportAcceptance from './transport-acceptance';
import trackingLandStatus from './trackingLandStatus';
import trackingLandPod from './trackingLandPod';
import trackingLandException from './trackingLandException';
import shipment from './shipment';
import transportDispatch from './transportDispatch';
import transportResources from './transportResources';
import transportSettings from './transportSettings';
import transportTariff from './transportTariff';
import tmsQuote from './tmsQuote';
import transportBilling from './transportBilling';
import tmsExpense from './tmsExpense';
import transportKpi from './transportKpi';
import template from './template';
import uploadRecords from './uploadRecords';
import saasInfra from './saasInfra';
import saasBase from './saasBase';
import saasParams from './saasParams';
import saasInvoicingKind from './saasInvoicingKind';
import saasDockPool from './saasDockPool';
import saasTenant from './saasTenant';
import disReport from './disReport';
import disAnalytics from './disAnalytics';
import paasBizModelMeta from './paasBizModelMeta';
import paasRisk from './paasRisk';
import ptsBook from './ptsBook';
import ptsImpExp from './ptsImpExp';

export default combineReducers({
  saasUser,
  auth,
  account,
  notification,
  chinaRegions,
  navbar,
  corpDomain,
  corps,
  saasCollab,
  personnel,
  partner,
  role,
  invitation,
  operationLog,
  hubIntegration,
  shipment,
  transportAcceptance,
  trackingLandStatus,
  trackingLandPod,
  trackingLandException,
  transportDispatch,
  transportResources,
  transportSettings,
  transportTariff,
  tmsQuote,
  transportBilling,
  tmsExpense,
  transportKpi,
  bssAudit,
  bssSetting,
  bssExRateSettings,
  bssBill,
  bssBillTemplate,
  bssStatement,
  bssInvoice,
  bssSettlement,
  bssPayment,
  bssVoucher,
  cmsDelegation,
  cmsDelegationDock,
  cmsCustomsDeclare,
  cmsCiqInDecl,
  cmsManifest,
  cmsManifestImport,
  cmsManifestTemplate,
  cmsInvoice,
  cmsQuote,
  cmsResources,
  cmsExpense,
  cmsTradeitem,
  cmsHsCode,
  cmsBrokers,
  cmsPrefEvents,
  cmsDeclTax,
  scofFlow,
  sofOrderPref,
  sofGlobalTrack,
  sofOrders,
  sofInvoice,
  sofPurchaseOrders,
  cwmReceive,
  cwmBlBook,
  cwmSasblReg,
  cwmOutbound,
  cwmWarehouse,
  cwmWhseLocation,
  cwmContext,
  cwmTransaction,
  cwmSku,
  cwmShFtz,
  cwmShFtzDecl,
  cwmShFtzStock,
  cwmShippingOrder,
  cwmInventoryStock,
  cwmTransition,
  cwmOwnerQuery,
  cwmMovement,
  hubDataAdapter,
  cmsPermit,
  hubDevApp,
  template,
  uploadRecords,
  saasInfra,
  saasBase,
  saasParams,
  saasInvoicingKind,
  saasDockPool,
  saasTenant,
  disReport,
  disAnalytics,
  paasBizModelMeta,
  paasRisk,
  ptsBook,
  ptsImpExp,
});
