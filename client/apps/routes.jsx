import React from 'react';
import { Route, IndexRoute, IndexRedirect } from 'react-router';
// import warning from 'warning';
import { loadAccount } from 'common/reducers/account';
import { loadWhseContext } from 'common/reducers/cwmContext';
import { loadLatestSaasParam } from 'common/reducers/saasParams';
import { DEFAULT_MODULES } from 'common/constants/module';
import Root from './root';

import SSO from './sso/pack-sso';
import Login from './sso/login';
import Forgot from './sso/forgot';
import Logout from './sso/logout';

import PackPub from './pub/packPub';
import * as PublicTMS from './pub/tracking';
import * as Template from './pub/template';

import Wrapper from './wrapper';
import * as Home from './home';
import Forbidden from './forbidden';

import PackCorp from './corp/packCorp';
import * as Corp from './corp';
import * as CorpMembers from './corp/members';
import * as CorpRole from './corp/role';
import * as CorpCollab from './corp/collab';
import * as CorpAffiliate from './corp/affiliate';
import * as CorpTrial from './corp/trial';

import PackPaaS from './paas/packPaaS';
import PaaS from './paas';
import * as PaaSDev from './paas/dev';
import * as PaaSAdapter from './paas/adapter';
import * as PaaSIntegration from './paas/integration';
import * as PaaSArCTM from './paas/integration/arctm';
import * as PaaSEasipassEDI from './paas/integration/easipass';
import * as PaaSSingleWindow from './paas/integration/singlewindow';
import * as PaaSSHFTZ from './paas/integration/shftz';
import * as PaaSSFExpress from './paas/integration/sfexpress';
import * as PaaSTemplates from './paas/templates';
import * as PaaSObject from './paas/object';
import * as PaaSFlow from './paas/flow';
import * as PaaSRisk from './paas/risk';
import * as PaaSPrefs from './paas/prefs';
import * as PaaSData from './paas/data';

import Module from './module';
import TMS from './transport/module-transport';
import * as TMSDashboard from './transport/dashboard';
import * as TMSPlanning from './transport/planning';
import * as TMSDispatch from './transport/dispatch';
import * as TMSTracking from './transport/tracking';
import * as TMSResources from './transport/resources';
import * as TMSSettings from './transport/settings';
import * as TMSBilling from './transport/billing';
import * as TMSTariff from './transport/tariff';

import CMS from './cms/module-clearance';
import * as CMSDashboard from './cms/dashboard';
import * as CMSDelegation from './cms/delegation';
import * as CMSSetting from './cms/setting';
import * as CMSManifest from './cms/delegation/manifest';
import * as CMSDeclaration from './cms/declaration';
import * as CMSBilling from './cms/billing';
import * as CMSQuote from './cms/billing/quote';
import * as CMSTradeItemHSCode from './cms/tradeitem/hscode';
import * as CMSTradeItemRepo from './cms/tradeitem/repo';
import * as CMSTradeItemRepoItem from './cms/tradeitem/repo/item';
import * as CMSTradeItemTask from './cms/tradeitem/task';
import * as CMSTradeItemWorkspace from './cms/tradeitem/workspace';
import * as CMSPermit from './cms/permit';
import * as cmsDeclTax from './cms/tax';

import BWM from './cwm/module-cwm';
import * as BWMDashboard from './cwm/dashboard';
import * as BWMReceivingASN from './cwm/receiving/asn';
import * as BWMReceivingInbound from './cwm/receiving/inbound';
import * as BWMShippingOrder from './cwm/shipping/order';
import * as BWMShippingWave from './cwm/shipping/wave';
import * as BWMShippingOutbound from './cwm/shipping/outbound';
import * as BWMStockInventory from './cwm/stock/inventory';
import * as BWMStockTransactions from './cwm/stock/transactions';
import * as BWMStockTransition from './cwm/stock/transition';
import * as BWMStockMovement from './cwm/stock/movement';
import * as BWMQueryStock from './cwm/query/stock';
import * as BWMProductsSku from './cwm/products/sku';
import * as BWMWarehouse from './cwm/warehouse';
import BWMSupSHFTZ from './cwm/supervision/shftz';
import * as BWMSupSHFTZEntry from './cwm/supervision/shftz/entry';
import * as BWMSupSHFTZTransferIn from './cwm/supervision/shftz/transfer/in';
import * as BWMSupSHFTZTransferOut from './cwm/supervision/shftz/transfer/out';
import * as BWMSupSHFTZTransferSelf from './cwm/supervision/shftz/transfer/self';
import * as BWMSupSHFTZRelNormal from './cwm/supervision/shftz/release/normal';
import * as BWMSupSHFTZRelPortion from './cwm/supervision/shftz/release/portion';
import * as BWMSupSHFTZNormalDecl from './cwm/supervision/shftz/decl/normal';
import * as BWMSupSHFTZBatchDecl from './cwm/supervision/shftz/decl/batch';
import * as BWMSupSHFTZStock from './cwm/supervision/shftz/stock';
import * as BWMSupSHFTZNonBondedStock from './cwm/supervision/shftz/stock/nonbonded';
import * as BWMSupSHFTZCargo from './cwm/supervision/shftz/cargo';
import BWMSupSASBL from './cwm/sasbl';
import * as BWMSASBLInvtReg from './cwm/sasbl/invtreg';
import * as BWMSASBLStockIo from './cwm/sasbl/stockio';
import * as BWMSASBLBatDecl from './cwm/sasbl/batdecl';
import * as BWMSASBLBizAppl from './cwm/sasbl/bizappl';
import * as BWMSASBLPassport from './cwm/sasbl/passport';
import * as BWMSASBLBondedInventory from './cwm/sasbl/bndinvt';
import * as BWMBLBook from './cwm/sasbl/blbook';

import SOF from './scof/module-sof';
import * as SOFDashboard from './scof/dashboard';
import * as SOFShipments from './scof/shipments';
import * as SOFInvoices from './scof/invoices';
import * as SOFPurchaseOrders from './scof/purchaseorders';
import * as SOFTracking from './scof/tracking';
import * as SOFCustomers from './scof/partner/customers';
import * as SOFSuppliers from './scof/partner/suppliers';
import * as SOFVendors from './scof/partner/vendors';
import * as SOFContacts from './scof/partner/contacts';

import BSS from './bss/module-bss';
import * as BSSDashboard from './bss/dashboard';
import * as BSSPayable from './bss/payable';
import * as BSSReceivable from './bss/receivable';
import * as BSSCustomerBill from './bss/bill/customer';
import * as BSSVendorBill from './bss/bill/vendor';
import * as BSSInvoice from './bss/invoice';
import * as BSSPayment from './bss/payment';
import * as BSSVoucher from './bss/voucher';
import * as BSSSetting from './bss/setting';

import DIS from './dis/module-dis';
import * as DISDashboard from './dis/dashboard';
import * as DISReport from './dis/report';
import * as DISAnalytics from './dis/analytics';

import PTS from './pts/module-pts';
import * as PTSDashboard from './pts/dashboard';
import * as PTSPTBook from './pts/ptbook';
import * as PTSIMPEXP from './pts/impExp';


export default(store) => {
  const requireAuth = (nextState, replace, cb) => {
    function checkAuth() {
      // const query = nextState.location.query;
      const currState = store.getState();
      const accountSubdomain = currState.account.subdomain;
      const { auth: { isAuthed }, corpDomain: { subdomain } } = currState;
      // console.log('routes isAuthed ', isAuthed, accountSubdomain, subdomain);
      if (!isAuthed || (accountSubdomain && subdomain && accountSubdomain !== subdomain)) {
        /*
        warning(
          !(accountSubdomain && accountSubdomain !== subdomain),
          'subdomain is not equal to account subdomain,
          maybe there are tenants with same unique code'
        );
        */
        const query = {
          ...nextState.location.query,
          next: encodeURIComponent(nextState.location.pathname),
        };
        replace({ pathname: '/login', query });
      } else {
      // 验证授权才能调用
        store.dispatch(loadLatestSaasParam([
          'customs', 'tradeMode', 'transMode', 'trxnMode', 'country', 'remissionMode',
          'currency', 'port', 'cnport', 'unit', 'ciqOrganization',
          'district', 'cnregion', 'certMark',
        ]));
      }
      cb();
    }
    const prevStoreState = store.getState();
    const prevAccountSubdomain = prevStoreState.account.subdomain;
    if (!prevStoreState.account.loaded || (prevAccountSubdomain
      && prevAccountSubdomain !== prevStoreState.corpDomain.subdomain)) {
      store.dispatch(loadAccount()).then(checkAuth);
    } else {
      checkAuth();
    }
  };
  const ensureCwmContext = (nextState, replace, cb) => {
    const storeState = store.getState();
    if (!storeState.cwmContext.loaded) {
      store.dispatch(loadWhseContext()).then(() => cb());
    } else {
      cb();
    }
  };
  // IndexRedirect passed nginx will readd subdomain
  return (
    <Route path="/" component={Root}>
      <Route path="pub" component={PackPub}>
        <Route path="tracking" component={PublicTMS.TrackingSearch} />
        <Route path="tms/tracking/detail/:shipmtNo/:key" component={PublicTMS.TrackingDetail} />
        <Route path="template">
          <Route path="shipment">
            <Route path="detail/:shipmtNo/:key" component={Template.ShipmentDetail} />
            <Route path="pod/:shipmtNo/:podId/:key" component={Template.ShipmentPod} />
          </Route>
        </Route>
      </Route>
      <Route component={SSO}>
        <Route path="login" component={Login} />
        <Route path="forgot" component={Forgot} />
      </Route>
      <Route path="logout" component={Logout} />
      <Route onEnter={requireAuth} component={Wrapper}>
        <IndexRoute component={Home.Main} />
        <Route path="forbidden" component={Forbidden} />
        <Route path="notfound" component={Home.NotFound} />
        <Route path="paas" component={PackPaaS}>
          <IndexRoute component={PaaS} />
          <Route path="dev">
            <IndexRoute component={PaaSDev.List} />
            <Route path=":appId" component={PaaSDev.Config} />
          </Route>
          <Route path="adapter">
            <IndexRoute component={PaaSAdapter.List} />
            <Route path="export" component={PaaSAdapter.ExportList} />
          </Route>
          <Route path="integration">
            <IndexRoute component={PaaSIntegration.List} />
            <Route path="arctm">
              <Route path="config/:uuid" component={PaaSArCTM.Config} />
            </Route>
            <Route path="easipass">
              <Route path="config/:uuid" component={PaaSEasipassEDI.Config} />
            </Route>
            <Route path="singlewindow">
              <Route path="config/:uuid" component={PaaSSingleWindow.Config} />
            </Route>
            <Route path="shftz">
              <Route path="config/:uuid" component={PaaSSHFTZ.Config} />
            </Route>
            <Route path="sfexpress">
              <Route path="config/:uuid" component={PaaSSFExpress.Config} />
            </Route>
          </Route>
          <Route path="object">
            <IndexRoute component={PaaSObject.List} />
            <Route path="meta/:obj" component={PaaSObject.Meta} />
          </Route>
          <Route path="flow" component={PaaSFlow.List} />
          <Route path="risk" component={PaaSRisk.List} />
          <Route path="prefs">
            <Route path="customs" component={PaaSPrefs.Customs} />
            <Route path="fees" component={PaaSPrefs.Fees} />
            <Route path="currencies" component={PaaSPrefs.Currencies} />
            <Route path="taxes" component={PaaSPrefs.Taxes} />
          </Route>
          <Route path="templates">
            <IndexRoute component={PaaSTemplates.Notice} />
          </Route>
          <Route path="data">
            <Route path="subject" component={PaaSData.SubjectList} />
          </Route>
        </Route>
        <Route path="corp" component={PackCorp}>
          <IndexRedirect to="/corp/overview" />
          <Route path="overview" component={Corp.Overview} />
          <Route path="info" component={Corp.Info} />
          <Route path="members">
            <IndexRoute component={CorpMembers.List} />
            <Route path="new" component={CorpMembers.Edit} />
            <Route path="edit/:id" component={CorpMembers.Edit} />
          </Route>
          <Route path="role">
            <IndexRoute component={CorpRole.List} />
            <Route path="new" component={CorpRole.Create} />
            <Route path="edit/:id" component={CorpRole.Edit} />
          </Route>
          <Route path="affiliate" component={CorpAffiliate.List} />
          <Route path="collab">
            <Route path="invitation" component={CorpCollab.Invitation} />
            <Route path="empower" component={CorpCollab.Empower} />
          </Route>
          <Route path="trial" component={CorpTrial.List} />
        </Route>
        <Route component={Module}>
          <Route path={DEFAULT_MODULES.transport.id} component={TMS}>
            <Route path="forbidden" component={Forbidden} />
            <Route path="dashboard">
              <IndexRoute component={TMSDashboard.Index} />
              <Route path="operationLogs" component={TMSDashboard.Log} />
            </Route>
            <Route path="planning">
              <IndexRoute component={TMSPlanning.List} />
              <Route path="edit/:shipmt" component={TMSPlanning.Edit} />
            </Route>
            <Route path="dispatch">
              <IndexRoute component={TMSDispatch.List} />
            </Route>
            <Route path="tracking" component={TMSTracking.Wrapper}>
              <IndexRedirect to="/transport/tracking/status/all" />
              <Route path="status/:state" component={TMSTracking.StatusList} />
              <Route path="pod/:state" component={TMSTracking.PodList} />
              <Route path="exception/:state" component={TMSTracking.ExceptionList} />
            </Route>
            <Route path="resources">
              <IndexRedirect to="/transport/resources/carrier" />
              <Route path="carrier">
                <IndexRoute component={TMSResources.CarrierListContainer} />
              </Route>
              <Route path="vehicle" component={TMSResources.VehicleListContainer} />
              <Route path="driver" component={TMSResources.DriverListContainer} />
              <Route path="node">
                <IndexRoute component={TMSResources.NodeListContainer} />
                <Route path="edit/:node_id" component={TMSResources.NodeFormContainer} />
              </Route>
            </Route>
            <Route path="settings">
              <IndexRedirect to="/transport/settings/transportModes" />
              <Route path="transportModes" component={TMSSettings.TransportModes} />
              <Route path="paramVehicles" component={TMSSettings.ParamVehicles} />
            </Route>
            <Route path="billing">
              <Route path="fee" component={TMSBilling.FeeList} />
              <Route path="receivable">
                <IndexRoute component={TMSBilling.ReceivableList} />
              </Route>
              <Route path="payable">
                <IndexRoute component={TMSBilling.PayableList} />
              </Route>
              <Route path="expense/:shipmtNo/fees" component={TMSBilling.Expense} />
              <Route path="tariff">
                <IndexRoute component={TMSTariff.List} />
                <Route path="new" component={TMSTariff.CreateNew} />
                <Route path="edit/:quoteNo" component={TMSTariff.Edit} />
                <Route path="view/:quoteNo" component={TMSTariff.View} />
              </Route>
            </Route>
          </Route>
          <Route path={DEFAULT_MODULES.clearance.id} component={CMS}>
            <Route path="forbidden" component={Forbidden} />
            <Route path="dashboard" component={CMSDashboard.Index} />
            <Route path="delegation">
              <IndexRoute component={CMSDelegation.List} />
              <Route path="manifest">
                <Route path=":billno" component={CMSManifest.Edit} />
              </Route>
            </Route>
            <Route path="declaration">
              <IndexRoute component={CMSDeclaration.List} />
              <Route path=":preEntrySeqNo" component={CMSDeclaration.Edit} />
            </Route>
            <Route path="setting">
              <IndexRoute component={CMSSetting.List} />
              <Route path="rule">
                <Route path=":id" component={CMSSetting.Rule} />
              </Route>
              <Route path="templates/invoice/:id" component={CMSSetting.InvoiceTemplate} />
              <Route path="templates/contract/:id" component={CMSSetting.ContractTemplate} />
              <Route path="templates/packinglist/:id" component={CMSSetting.PackingListTemplate} />
              <Route path="brokers" component={CMSSetting.Brokers} />
            </Route>
            <Route path="permit">
              <IndexRoute component={CMSPermit.List} />
              <Route path="add" component={CMSPermit.Add} />
              <Route path=":id" component={CMSPermit.Detail} />
            </Route>
            <Route path="billing">
              <Route path="revenue">
                <IndexRoute component={CMSBilling.RevenueList} />
              </Route>
              <Route path="expense">
                <IndexRoute component={CMSBilling.ExpenseList} />
              </Route>
              <Route path="fees/:delgNo" component={CMSBilling.Fees} />
              <Route path="quote">
                <IndexRoute component={CMSQuote.List} />
                <Route path=":quoteNo" component={CMSQuote.Edit} />
              </Route>
            </Route>
            <Route path="tax">
              <IndexRoute component={cmsDeclTax.List} />
            </Route>
            {/* <Route path="analytics">
              <IndexRoute component={CMSAnalytics.List} />
              <Route path="report/:id" component={CMSAnalytics.Report} />
            </Route>
            <Route path="settings">
              <IndexRedirect to="/clearance/settings/preferences" />
              <Route path="preferences" component={CMSSettings.Preferences} />
            </Route> */}
            <Route path="tradeitem">
              <IndexRedirect to="/clearance/tradeitem/repo" />
              <Route path="repo">
                <IndexRoute component={CMSTradeItemRepo.List} />
                <Route path=":repoId">
                  <IndexRoute component={CMSTradeItemRepo.Content} />
                  <Route path="item">
                    <Route path="add" component={CMSTradeItemRepoItem.Add} />
                    <Route path="edit/:id" component={CMSTradeItemRepoItem.Edit} />
                    <Route path="fork/:id" component={CMSTradeItemRepoItem.Fork} />
                  </Route>
                </Route>
              </Route>
              <Route path="task">
                <IndexRoute component={CMSTradeItemTask.List} />
                <Route path=":id" component={CMSTradeItemTask.Detail} />
              </Route>
              <Route path="workspace">
                <Route path="emerges" component={CMSTradeItemWorkspace.Emerge} />
                <Route path="conflicts" component={CMSTradeItemWorkspace.Conflict} />
                <Route path="invalids" component={CMSTradeItemWorkspace.Invalid} />
                <Route path="pendings" component={CMSTradeItemWorkspace.Pending} />
                <Route path="item/:id" component={CMSTradeItemWorkspace.ItemPage} />
              </Route>
              <Route path="hscode">
                <IndexRoute component={CMSTradeItemHSCode.List} />
                <Route path="special" component={CMSTradeItemHSCode.Special} />
                <Route path="changes" component={CMSTradeItemHSCode.Changes} />
              </Route>
            </Route>
          </Route>
          <Route path={DEFAULT_MODULES.cwm.id} component={BWM} onEnter={ensureCwmContext}>
            <Route path="forbidden" component={Forbidden} />
            <Route path="dashboard" component={BWMDashboard.Index} />
            <Route path="receiving">
              <Route path="asn">
                <IndexRoute component={BWMReceivingASN.List} />
                <Route path="create" component={BWMReceivingASN.Create} />
                <Route path=":asnNo" component={BWMReceivingASN.Detail} />
              </Route>
              <Route path="inbound">
                {/* <IndexRoute component={BWMReceivingInbound.List} /> */}
                <Route path=":inboundNo" component={BWMReceivingInbound.Detail} />
              </Route>
            </Route>
            <Route path="shipping">
              <Route path="order">
                <IndexRoute component={BWMShippingOrder.List} />
                <Route path="create" component={BWMShippingOrder.Create} />
                <Route path=":soNo" component={BWMShippingOrder.Detail} />
              </Route>
              <Route path="wave">
                {/* <IndexRoute component={BWMShippingWave.List} /> */}
                <Route path=":waveNo" component={BWMShippingWave.Detail} />
              </Route>
              <Route path="outbound">
                {/* <IndexRoute component={BWMShippingOutbound.List} /> */}
                <Route path=":outboundNo" component={BWMShippingOutbound.Detail} />
              </Route>
            </Route>
            <Route path="stock">
              <Route path="inventory" component={BWMStockInventory.List} />
              <Route path="transactions" component={BWMStockTransactions.List} />
              <Route path="transition" component={BWMStockTransition.List} />
              <Route path="movement">
                <IndexRoute component={BWMStockMovement.List} />
                <Route path=":movementNo" component={BWMStockMovement.Detail} />
              </Route>
            </Route>
            <Route path="blbook">
              <IndexRoute component={BWMBLBook.List} />
              <Route path=":id" component={BWMBLBook.Detail} />
            </Route>
            <Route path="sasbl" component={BWMSupSASBL}>
              <Route path="invtreg" >
                <Route path=":supType/:ieType" component={BWMSASBLInvtReg.List} />
                <Route path=":supType/:ieType/:invtregNo" component={BWMSASBLInvtReg.Detail} />
              </Route>
              <Route path="stockio" >
                <Route path=":supType/:ieType" component={BWMSASBLStockIo.List} />
                <Route path=":supType/:ieType/:stockioNo" component={BWMSASBLStockIo.Detail} />
              </Route>
              <Route path="passport" >
                <Route path=":supType/:ieType" component={BWMSASBLPassport.List} />
                <Route path=":supType/:ieType/:copPassNo" component={BWMSASBLPassport.Detail} />
              </Route>
              <Route path="batdecl" >
                <Route path=":supType/:ieType" component={BWMSASBLBatDecl.List} />
                <Route path=":supType/:ieType/:batchDeclNo" component={BWMSASBLBatDecl.Detail} />
              </Route>
              <Route path="bizappl" >
                <Route path=":supType/:ieType" component={BWMSASBLBizAppl.List} />
                <Route path=":supType/:ieType/:copBizApplNo" component={BWMSASBLBizAppl.Detail} />
              </Route>
              <Route path="bndinvt" >
                <IndexRoute component={BWMSASBLBondedInventory.List} />
              </Route>
            </Route>
            <Route path="supervision">
              <Route path="shftz" component={BWMSupSHFTZ}>
                <IndexRedirect to="/cwm/supervision/shftz/entry" />
                <Route path="entry" >
                  <IndexRoute component={BWMSupSHFTZEntry.List} />
                  <Route path=":preEntrySeqNo" component={BWMSupSHFTZEntry.Detail} />
                </Route>
                <Route path="transfer/in" >
                  <IndexRoute component={BWMSupSHFTZTransferIn.List} />
                  <Route path=":preFtzEntNo" component={BWMSupSHFTZTransferIn.Detail} />
                </Route>
                <Route path="transfer/self" >
                  <IndexRoute component={BWMSupSHFTZTransferSelf.List} />
                  <Route path=":asnNo" component={BWMSupSHFTZTransferSelf.Detail} />
                </Route>
                <Route path="release/normal" >
                  <IndexRoute component={BWMSupSHFTZRelNormal.List} />
                  <Route path=":soNo" component={BWMSupSHFTZRelNormal.Detail} />
                </Route>
                <Route path="release/portion" >
                  <IndexRoute component={BWMSupSHFTZRelPortion.List} />
                  <Route path=":soNo" component={BWMSupSHFTZRelPortion.Detail} />
                </Route>
                <Route path="transfer/out" >
                  <IndexRoute component={BWMSupSHFTZTransferOut.List} />
                  <Route path=":soNo" component={BWMSupSHFTZTransferOut.Detail} />
                </Route>
                <Route path="decl/normal" >
                  <IndexRoute component={BWMSupSHFTZNormalDecl.List} />
                  <Route path=":clearanceNo" component={BWMSupSHFTZNormalDecl.Detail} />
                </Route>
                <Route path="decl/batch" >
                  <IndexRoute component={BWMSupSHFTZBatchDecl.List} />
                  <Route path=":batchNo" component={BWMSupSHFTZBatchDecl.Detail} />
                </Route>
                <Route path="stock" >
                  <IndexRoute component={BWMSupSHFTZStock.List} />
                  <Route path="task/:taskId" component={BWMSupSHFTZStock.Task} />
                  <Route path="matchtask/:taskId" component={BWMSupSHFTZStock.MatchTask} />
                  <Route path="nonbonded" component={BWMSupSHFTZNonBondedStock.List} />
                </Route>
                <Route path="cargo"component={BWMSupSHFTZCargo.List} />
              </Route>
            </Route>
            <Route path="query">
              <Route path="stock" component={BWMQueryStock.StockList} />
              <Route path="outbound" component={BWMQueryStock.SoList} />
            </Route>
            <Route path="products">
              <Route path="sku">
                <IndexRoute component={BWMProductsSku.List} />
                <Route path="create" component={BWMProductsSku.Create} />
                <Route path="edit/:sku" component={BWMProductsSku.Edit} />
              </Route>
            </Route>
            <Route path="warehouse">
              <IndexRoute component={BWMWarehouse.List} />
              <Route path="wizard" component={BWMWarehouse.Wizard} />
            </Route>
          </Route>
          <Route path={DEFAULT_MODULES.scof.id} component={SOF}>
            <Route path="forbidden" component={Forbidden} />
            <Route path="dashboard" component={SOFDashboard.Index} />
            <Route path="shipments" >
              <IndexRoute component={SOFShipments.List} />
              <Route path="create" component={SOFShipments.Create} />
              <Route path="edit/:orderNo" component={SOFShipments.Edit} />
            </Route>
            <Route path="invoices">
              <IndexRoute component={SOFInvoices.List} />
              <Route path="create" component={SOFInvoices.Create} />
              <Route path="edit/:invoiceNo" component={SOFInvoices.Edit} />
            </Route>
            <Route path="purchaseorders">
              <IndexRoute component={SOFPurchaseOrders.List} />
              <Route path="create" component={SOFPurchaseOrders.Create} />
              <Route path="edit/:poNo" component={SOFPurchaseOrders.Edit} />
            </Route>
            {/* <Route path="tracking">
              <Route path="customize">
                <IndexRoute component={SOFTracking.Customize} />
              </Route>
              <Route path=":trackingId" component={SOFTracking.Instance} />
            </Route> */}
            <Route path="tracking" component={SOFTracking.List} />
            <Route path="customers" component={SOFCustomers.List} />
            <Route path="suppliers" component={SOFSuppliers.List} />
            <Route path="vendors" component={SOFVendors.List} />
            <Route path="contacts" component={SOFContacts.List} />
          </Route>
          <Route path={DEFAULT_MODULES.bss.id} component={BSS}>
            <Route path="forbidden" component={Forbidden} />
            <Route path="dashboard" component={BSSDashboard.Index} />
            <Route path="payable">
              <IndexRoute component={BSSPayable.List} />
              <Route path="create" component={BSSPayable.Detail} />
              <Route path=":orderRelNo" component={BSSPayable.Detail} />
            </Route>
            <Route path="receivable">
              <IndexRoute component={BSSReceivable.List} />
              <Route path=":orderRelNo" component={BSSReceivable.Detail} />
            </Route>
            <Route path="bill">
              <Route path="vendor">
                <IndexRoute component={BSSVendorBill.List} />
                <Route path=":billNo" component={BSSVendorBill.Detail} />
                <Route path="reconcile/:billNo" component={BSSVendorBill.Reconcile} />
              </Route>
              <Route path="customer">
                <IndexRoute component={BSSCustomerBill.List} />
                <Route path=":billNo" component={BSSCustomerBill.Detail} />
                <Route path="reconcile/:billNo" component={BSSCustomerBill.Reconcile} />
              </Route>
            </Route>
            <Route path="invoice">
              <Route path="output" component={BSSInvoice.OutputList} />
              <Route path="input" component={BSSInvoice.InputList} />
            </Route>
            <Route path="payment">
              <IndexRoute component={BSSPayment.List} />
              <Route path="apply" component={BSSPayment.ApplyList} />
              <Route path="claim" component={BSSPayment.ClaimList} />
              <Route path="request" component={BSSPayment.Request} />
            </Route>
            <Route path="voucher" component={BSSVoucher.List} />
            <Route path="setting">
              <IndexRedirect to="/bss/setting/fees" />
              <Route path="fees" component={BSSSetting.Fees} />
              <Route path="currencies" component={BSSSetting.Currencies} />
              <Route path="taxes" component={BSSSetting.Taxes} />
              <Route path="billtemplates">
                <IndexRoute component={BSSSetting.BillTemplates} />
                <Route path=":templateId/fees" component={BSSSetting.TemplateFees} />
              </Route>
              <Route path="accountsets" component={BSSSetting.AccountSets} />
              <Route path="subjects" component={BSSSetting.Subjects} />
              <Route path="paytypes" component={BSSSetting.PayTypes} />
            </Route>
          </Route>
          <Route path={DEFAULT_MODULES.dis.id} component={DIS}>
            <Route path="forbidden" component={Forbidden} />
            <Route path="dashboard" component={DISDashboard.Index} />
            <Route path="report">
              <IndexRoute component={DISReport.List} />
              <Route path="view/:reportId" component={DISReport.View} />
              <Route path="edit/:id" component={DISReport.ConfigEditor} />
            </Route>
            <Route path="analytics">
              <IndexRoute component={DISAnalytics.List} />
              <Route path="chart/:chartUid" component={DISAnalytics.Chart} />
              <Route path="edit/:chartUid" component={DISAnalytics.ChartConfig} />
            </Route>
          </Route>
          <Route path={DEFAULT_MODULES.pts.id} component={PTS}>
            <Route path="forbidden" component={Forbidden} />
            <Route path="dashboard" component={PTSDashboard.Index} />
            <Route path="ptbook" >
              <IndexRoute component={PTSPTBook.List} />
              <Route path=":id" component={PTSPTBook.Detail} />
            </Route>
            <Route path="import/:ieType" >
              <IndexRoute component={PTSIMPEXP.List} />
              <Route path=":invtNo" component={PTSIMPEXP.Detail} />
            </Route>
            <Route path="export/:ieType" >
              <IndexRoute component={PTSIMPEXP.List} />
              <Route path=":invtNo" component={PTSIMPEXP.Detail} />
            </Route>
          </Route>
        </Route>
      </Route>
      <Route path="*">
        <IndexRedirect to="/notfound" />
      </Route>
    </Route>
  );
};
