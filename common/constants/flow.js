exports.NODE_TRIGGERS = [{
  key: 'enter',
  text: 'nodeOnEnter',
}, {
  key: 'exit',
  text: 'nodeOnExit',
}];

const CMS_DELEGATION_TRIGGERS = [
  {
    key: 'delgCreated', text: 'onCreated', seqNo: 0,
  },
  {
    key: 'declared', text: 'onDelgDeclared', actionText: 'delgDeclare', seqNo: 1,
  },
  {
    key: 'inspected', text: 'onDelgInspected', actionText: 'delgInspect', seqNo: 2,
  },
  {
    key: 'released', text: 'onDelgReleased', actionText: 'delgRelease', seqNo: 3,
  },
];

const CMS_MANIFEST_TRIGGERS = [
  {
    key: 'manifestCreated', text: 'onCreated', actionText: 'manifestCreate', seqNo: 0,
  },
  {
    key: 'generated', text: 'onManifestGenerated', actionText: 'manifestGenerate', seqNo: 1,
  },
];

const CMS_CUSTOMS_TRIGGERS = [
  {
    key: 'reviewed', text: 'onCustomsReviewed', actionText: 'customsReview', seqNo: 0,
  },
  {
    key: 'declared', text: 'onDelgDeclared', actionText: 'customsDelcare', seqNo: 1,
  },
  {
    key: 'released', text: 'onDelgReleased', actionText: 'customsRelease', seqNo: 2,
  },
];

const cmsBizObjects = [{
  key: 'cmsDelegation',
  text: 'cmsDelegation',
  triggers: CMS_DELEGATION_TRIGGERS,
}, {
  key: 'cmsManifest',
  text: 'cmsDeclManifest',
  triggers: CMS_MANIFEST_TRIGGERS,
}, {
  key: 'cmsCustomsDecl',
  text: 'cmsCustomsDecl',
  triggers: CMS_CUSTOMS_TRIGGERS,
}];

const tmsBizObjects = [{
  key: 'tmsShipment',
  text: 'tmsShipment',
  triggers: [{
    key: 'shipmtCreated',
    text: 'onCreated',
    actionText: 'shipmtCreate',
    seqNo: 0,
  }, {
    key: 'shipmtAccepted',
    text: 'onShipmtAccepted',
    actionText: 'shipmtAccept',
    seqNo: 1,
  }, {
    key: 'shipmtDispatched',
    text: 'onShipmtDispatched',
    actionText: 'shipmtDispatch',
    seqNo: 2,
  }, {
    key: 'shipmtPickedUp',
    text: 'onPickedUp',
    actionText: 'shipmtPickup',
    seqNo: 3,
  }, {
    key: 'shipmtDelivered',
    text: 'onDelivered',
    actionText: 'shipmtDeliver',
    seqNo: 4,
  }, {
    key: 'shpmtPod',
    text: 'onPod',
    actionText: 'shipmtPod',
    seqNo: 5,
  }],
}];

const cwmRecBizObjects = [{
  key: 'cwmReceiving',
  text: 'cwmRecAsn',
  triggers: [{
    key: 'asnCreated',
    text: 'onCreated',
    actionText: 'asnCreate',
    seqNo: 0,
  }, {
    key: 'asnReleased',
    text: 'onAsnReleased',
    actionText: 'asnRelease',
    seqNo: 1,
  }, {
    key: 'asnInbound',
    text: 'onAsnInbound',
    actionText: 'asnInbound',
    seqNo: 2,
  }, {
    key: 'asnFinished',
    text: 'onAsnFinished',
    actionText: 'asnFinish',
    seqNo: 3,
  }],
}];

const cwmShippingBizObjects = [{
  key: 'cwmShipping',
  text: 'cwmShippingOrder',
  triggers: [{
    key: 'soCreated',
    text: 'onCreated',
    actionText: 'soCreate',
    seqNo: 0,
  }, {
    key: 'soReleased',
    text: 'onSoReleased',
    actionText: 'soRelease',
    seqNo: 1,
  }, {
    key: 'soOutbound',
    text: 'onSoOutbound',
    actionText: 'soOutbound',
    seqNo: 2,
  }, {
    key: 'soFinished',
    text: 'onSoFinished',
    actionText: 'soFinish',
    seqNo: 3,
  }, {
    key: 'soDecl',
    text: 'onSoDecl',
    actionText: 'soDecl',
    seqNo: 4,
  }, {
    key: 'soRltDecl',
    text: 'onSoRltDecl',
    actionText: 'soRltDecl',
    seqNo: 4,
  }],
}];
const ptsBizObjects = [{ // 节点业务对象
  key: 'ptsInventory',
  text: 'inventory',
  triggers: [{
    key: 'ptsInvtCreated',
    text: 'invtCreated',
    actionText: 'invtCreate',
  }, {
    key: 'ptsInvtDeclared',
    text: 'invtDeclared',
    actionText: 'invtDeclare',
  }, {
    key: 'ptsInvtApproved',
    text: 'invtApproved',
    actionText: 'invtApprove',
  }, {
    key: 'ptsInvtVerificationed',
    text: 'invtVerificationed',
    actionText: 'invtVerification',
  }],
}];

exports.NODE_BIZ_OBJECTS = {
  import: cmsBizObjects,
  export: cmsBizObjects,
  tms: tmsBizObjects,
  cwmrec: cwmRecBizObjects,
  cwmship: cwmShippingBizObjects,
  ptsimp: ptsBizObjects,
  ptsexp: ptsBizObjects,
};

exports.NODE_CREATABLE_BIZ_OBJECTS = {
  import: cmsBizObjects.slice(0, cmsBizObjects.length - 1),
  export: cmsBizObjects.slice(0, cmsBizObjects.length - 1),
  tms: tmsBizObjects,
  cwmrec: cwmRecBizObjects,
  cwmship: cwmShippingBizObjects,
  ptsimp: ptsBizObjects,
  ptsexp: ptsBizObjects,
};

exports.NODE_BIZ_OBJECTS_EXECUTABLES = {
  import: [{
    key: 'cmsDelegation',
    text: 'cmsDelegation',
    triggers: [{ action: 'declare', actionText: 'delgDeclare' }],
  }, {
    key: 'cmsManifest',
    text: 'cmsDeclManifest',
    triggers: [{ action: 'generate', actionText: 'manifestGenerate' }],
  }, {
    key: 'cmsCustomsDecl',
    text: 'cmsCustomsDecl',
    triggers: [{ action: 'review', actionText: 'customsReview' }, { action: 'declare', actionText: 'customsDeclare' }],
  }],
  export: [{
    key: 'cmsDelegation',
    text: 'cmsDelegation',
    triggers: [{ action: 'declare', actionText: 'delgDeclare' }],
  }, {
    key: 'cmsManifest',
    text: 'cmsDeclManifest',
    triggers: [{ action: 'generate', actionText: 'manifestGenerate' }],
  }, {
    key: 'cmsCustomsDecl',
    text: 'cmsCustomsDecl',
    triggers: [{ action: 'review', actionText: 'customsReview' }, { action: 'declare', actionText: 'customsDeclare' }],
  }],
  tms: [{
    key: 'tmsShipment',
    text: 'tmsShipment',
    triggers: [{ action: 'accept', actionText: 'shipmtAccept' }],
  }],
  cwmrec: [{
    key: 'cwmReceiving',
    text: 'cwmRecAsn',
    triggers: [],
  }],
  cwmship: [{
    key: 'cwmShipping',
    text: 'cwmShippingOrder',
    triggers: [{ action: 'soReleased', actionText: 'soRelease' }, { action: 'autoAlloc', actionText: '订单自动分配' }],
  }],
  ptsimp: [{
    key: 'ptsInventory',
    text: 'inventory',
    triggers: [],
  }],
  ptsexp: [{
    key: 'ptsInventory',
    text: 'inventory',
    triggers: [],
  }],
};

exports.SCOF_BIZ_OBJECT_KEY = {
  SOF_COMMINV: { key: 'sofCommInv', defaultText: '商业发票' },
  SOF_ORDER: { key: 'sofOrder', defaultText: '货运订单' },
  CMS_DELEGATION: { key: 'cmsDelegation', defaultText: '报关委托' },
  CMS_MANIFEST: { key: 'cmsManifest', defaultText: '报关清单' },
  CMS_CUSTOMS: { key: 'cmsCustomsDecl', defaultText: '报关单' },
  TMS_SHIPMENT: { key: 'tmsShipment', defaultText: '运输单' },
  CWM_RECEIVING: { key: 'cwmReceiving', defaultText: '入库单' },
  CWM_MOVEMENT: { key: 'cwmMovement', defaultText: '移库单' },
  CWM_SHIPPING: { key: 'cwmShipping', defaultText: '出库单' },
  CWM_BLBOOK: { key: 'cwmBLBook', defaultText: '物流账册' },
  CWM_SASBL: { key: 'cwmSasbl', defaultText: '金二保税物流' },
  CWM_WHSE: { key: 'cwmWhse', defaultText: '仓库' },
  SAAS_PARTNER: { key: 'saasPartner', defaultText: '客户' },
  CMS_EXPENSE: { key: 'cmsExpense', defaultText: '费用明细' },
  CMS_QUOTE: { key: 'cmsQuote', defaultText: '报价费率' },
  DIS_REPORT: { key: 'disReport', defaultText: '报表' },
  DIS_ANALYTICS: { key: 'disAnalytics', defaultText: '分析图表' },
  PTS_BOOK: { key: 'ptsBook', defaultText: '加贸手/账册' },
  // CWM_SO_NORMAL: 'cwmSoNormal',
};
