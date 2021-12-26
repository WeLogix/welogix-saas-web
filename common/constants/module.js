const MODULE_SOF = {
  id: 'scof',
  text: 'moduleSCOF',
  defaultText: '订单中心',
  features: [
    {
      id: 'dashboard',
      text: 'featSofDashboard',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        },
      ],
    },
    {
      id: 'purchaseOrder',
      text: 'featSofPurchaseOrder',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        }, {
          id: 'edit',
          text: 'featActionEdit',
        }, {
          id: 'create',
          text: 'featActionCreate',
        }, {
          id: 'delete',
          text: 'featActionDelete',
        },
      ],
    },
    {
      id: 'invoice',
      text: 'featSofInvoice',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        }, {
          id: 'edit',
          text: 'featActionEdit',
        }, {
          id: 'create',
          text: 'featActionCreate',
        }, {
          id: 'delete',
          text: 'featActionDelete',
        },
      ],
    },
    {
      id: 'shipments',
      text: 'featSofShipments',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        }, {
          id: 'edit',
          text: 'featActionEdit',
        }, {
          id: 'create',
          text: 'featActionCreate',
        }, {
          id: 'delete',
          text: 'featActionDelete',
        },
      ],
    },
    {
      id: 'tracking',
      text: 'featSofTracking',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        }, {
          id: 'create',
          text: 'featActionCreate',
        },
      ],
    },
    {
      id: 'partner',
      text: 'featSofPartners',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        }, {
          id: 'edit',
          text: 'featActionEdit',
        }, {
          id: 'create',
          text: 'featActionCreate',
        }, {
          id: 'delete',
          text: 'featActionDelete',
        },
      ],
    },
  ],
};

const MODULE_CDM = {
  id: 'clearance',
  text: 'moduleCLEARANCE',
  defaultText: '关务管理',
  features: [
    {
      id: 'dashboard',
      text: 'featCdmDashboard',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        }, {
          id: 'edit',
          text: 'featActionEdit',
        }, {
          id: 'create',
          text: 'featActionCreate',
        }, {
          id: 'delete',
          text: 'featActionDelete',
        },
      ],
    },
    {
      id: 'delegation',
      text: 'featCdmDelegation',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        }, {
          id: 'edit',
          text: 'featActionEdit',
        }, {
          id: 'create',
          text: 'featActionCreate',
        }, {
          id: 'delete',
          text: 'featActionDelete',
        }, {
          id: 'audit',
          text: 'featActionAudit',
        },
      ],
    },
    {
      id: 'customs',
      text: 'featCdmCustoms',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        }, {
          id: 'edit',
          text: 'featActionEdit',
        }, {
          id: 'create',
          text: 'featActionCreate',
        }, {
          id: 'delete',
          text: 'featActionDelete',
        },
      ],
    },
    {
      id: 'compliance',
      text: 'featCdmCompliance',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        }, {
          id: 'edit',
          text: 'featActionEdit',
        }, {
          id: 'create',
          text: 'featActionCreate',
        }, {
          id: 'delete',
          text: 'featActionDelete',
        },
      ],
    },
    {
      id: 'declTax',
      text: 'featCdmDeclTax',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        }, {
          id: 'import',
          text: 'featActionImport',
        },
      ],
    },
    {
      id: 'billing',
      text: 'featCdmBilling',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        }, {
          id: 'edit',
          text: 'featActionEdit',
        }, {
          id: 'create',
          text: 'featActionCreate',
        }, {
          id: 'delete',
          text: 'featActionDelete',
        },
      ],
    },
  ],
};

const MODULE_TMS = {
  id: 'transport',
  text: 'moduleTRANSPORT',
  defaultText: '运输管理',
  features: [
    {
      id: 'dashboard',
      text: 'featTmsDashboard',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        },
      ],
    },
    {
      id: 'shipment',
      text: 'featTmsPlanning',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        }, {
          id: 'edit',
          text: 'featActionEdit',
        }, {
          id: 'create',
          text: 'featActionCreate',
        }, {
          id: 'delete',
          text: 'featActionDelete',
        },
      ],
    },
    {
      id: 'dispatch',
      text: 'featTmsDispatch',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        }, {
          id: 'edit',
          text: 'featActionEdit',
        }, {
          id: 'create',
          text: 'featActionCreate',
        }, {
          id: 'delete',
          text: 'featActionDelete',
        },
      ],
    },
    {
      id: 'tracking',
      text: 'featTmsTrackinng',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        }, {
          id: 'edit',
          text: 'featActionEdit',
        }, {
          id: 'create',
          text: 'featActionCreate',
        },
      ],
    },
    {
      id: 'resources',
      text: 'featTransportResources',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        }, {
          id: 'edit',
          text: 'featActionEdit',
        }, {
          id: 'create',
          text: 'featActionCreate',
        }, {
          id: 'delete',
          text: 'featActionDelete',
        },
      ],
    },
    {
      id: 'tariff',
      text: 'featTmsTariff',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        }, {
          id: 'edit',
          text: 'featActionEdit',
        }, {
          id: 'create',
          text: 'featActionCreate',
        }, {
          id: 'delete',
          text: 'featActionDelete',
        },
      ],
    },
  ],
};

const MODULE_BWM = {
  id: 'cwm',
  text: 'moduleCWM',
  defaultText: '保税仓储',
  features: [
    {
      id: 'dashboard',
      text: 'featCwmDashboard',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        }, {
          id: 'edit',
          text: 'featActionEdit',
        }, {
          id: 'create',
          text: 'featActionCreate',
        }, {
          id: 'delete',
          text: 'featActionDelete',
        },
      ],
    },
    {
      id: 'receiving',
      text: 'featCwmReceiving',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        }, {
          id: 'edit',
          text: 'featActionEdit',
        }, {
          id: 'create',
          text: 'featActionCreate',
        }, {
          id: 'delete',
          text: 'featActionDelete',
        },
      ],
    },
    {
      id: 'shipping',
      text: 'featCwmShipping',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        }, {
          id: 'edit',
          text: 'featActionEdit',
        }, {
          id: 'create',
          text: 'featActionCreate',
        }, {
          id: 'delete',
          text: 'featActionDelete',
        },
      ],
    },
    {
      id: 'stock',
      text: 'featCwmStock',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        }, {
          id: 'edit',
          text: 'featActionEdit',
        }, {
          id: 'create',
          text: 'featActionCreate',
        }, {
          id: 'delete',
          text: 'featActionDelete',
        },
      ],
    },
    {
      id: 'inboundQuery',
      text: 'featCwmInboundQuery',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        },
      ],
    },
    {
      id: 'outboundQuery',
      text: 'featCwmOutboundQuery',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        },
      ],
    },
    {
      id: 'stockQuery',
      text: 'featCwmStockQuery',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        },
      ],
    },
    {
      id: 'supervision',
      text: 'featCwmShftz',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        }, {
          id: 'edit',
          text: 'featActionEdit',
        }, {
          id: 'create',
          text: 'featActionCreate',
        }, {
          id: 'delete',
          text: 'featActionDelete',
        },
      ],
    },
    {
      id: 'blbook',
      text: 'featCwmBlBook',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        }, {
          id: 'edit',
          text: 'featActionEdit',
        }, {
          id: 'create',
          text: 'featActionCreate',
        }, {
          id: 'delete',
          text: 'featActionDelete',
        },
      ],
    },
    {
      id: 'products',
      text: 'featCwmSKU',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        }, {
          id: 'edit',
          text: 'featActionEdit',
        }, {
          id: 'create',
          text: 'featActionCreate',
        }, {
          id: 'delete',
          text: 'featActionDelete',
        },
      ],
    },
    {
      id: 'settings',
      text: 'featCwmSettings',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        }, {
          id: 'edit',
          text: 'featActionEdit',
        }, {
          id: 'create',
          text: 'featActionCreate',
        }, {
          id: 'delete',
          text: 'featActionDelete',
        },
      ],
    },
  ],
};

const MODULE_BSS = {
  id: 'bss',
  text: 'moduleBSS',
  defaultText: '结算中心',
  features: [
    {
      id: 'audit',
      text: 'featBssAudit',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        }, {
          id: 'edit',
          text: 'featActionEdit',
        }, {
          id: 'create',
          text: 'featActionCreate',
        }, {
          id: 'delete',
          text: 'featActionDelete',
        },
      ],
    },
    {
      id: 'bill',
      text: 'featBssBill',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        }, {
          id: 'edit',
          text: 'featActionEdit',
        }, {
          id: 'create',
          text: 'featActionCreate',
        }, {
          id: 'delete',
          text: 'featActionDelete',
        },
      ],
    },
    {
      id: 'invoice',
      text: 'featBssOutputInvoice',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        }, {
          id: 'edit',
          text: 'featActionEdit',
        }, {
          id: 'create',
          text: 'featActionCreate',
        }, {
          id: 'delete',
          text: 'featActionDelete',
        },
      ],
    },
    {
      id: 'payment',
      text: 'featBssPayment',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        }, {
          id: 'edit',
          text: 'featActionEdit',
        }, {
          id: 'create',
          text: 'featActionCreate',
        }, {
          id: 'delete',
          text: 'featActionDelete',
        },
      ],
    },
  ],
};

const MODULE_DIS = {
  id: 'dis',
  text: 'moduleDIS',
  defaultText: '数据智能',
  features: [
    {
      id: 'dashboard',
      text: 'featDisDashboard',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        }, {
          id: 'edit',
          text: 'featActionEdit',
        }, {
          id: 'create',
          text: 'featActionCreate',
        }, {
          id: 'delete',
          text: 'featActionDelete',
        },
      ],
    },
    {
      id: 'report',
      text: 'featDisReport',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        }, {
          id: 'edit',
          text: 'featActionEdit',
        }, {
          id: 'create',
          text: 'featActionCreate',
        }, {
          id: 'delete',
          text: 'featActionDelete',
        },
      ],
    },
    {
      id: 'analytics',
      text: 'featDisAnalytics',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        }, {
          id: 'edit',
          text: 'featActionEdit',
        }, {
          id: 'create',
          text: 'featActionCreate',
        }, {
          id: 'delete',
          text: 'featActionDelete',
        },
      ],
    },
    {
      id: 'stats',
      text: 'featDisStats',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        }, {
          id: 'edit',
          text: 'featActionEdit',
        }, {
          id: 'create',
          text: 'featActionCreate',
        }, {
          id: 'delete',
          text: 'featActionDelete',
        },
      ],
    },
  ],
};

const MODULE_PTS = {
  id: 'pts',
  text: 'modulePTS',
  defaultText: '加工贸易',
};

const appModules = [
  MODULE_SOF,
  MODULE_CDM,
  MODULE_BWM,
  MODULE_TMS,
  MODULE_BSS,
  MODULE_DIS,
  MODULE_PTS,
];

const MODULE_CORPORATION = {
  id: 'corp',
  text: 'moduleCorp',
  features: [
    {
      id: 'info',
      text: 'featCorpInfo',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        }, {
          id: 'edit',
          text: 'featActionEdit',
        },
      ],
    },
    {
      id: 'member',
      text: 'featCorpPersonnel',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        }, {
          id: 'edit',
          text: 'featActionEdit',
        }, {
          id: 'create',
          text: 'featActionCreate',
        }, {
          id: 'delete',
          text: 'featActionDelete',
        },
      ],
    },
    {
      id: 'role',
      text: 'featCorpRole',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        }, {
          id: 'edit',
          text: 'featActionEdit',
        }, {
          id: 'create',
          text: 'featActionCreate',
        }, {
          id: 'delete',
          text: 'featActionDelete',
        },
      ],
    },
    {
      id: 'affiliate',
      text: 'featCorpAffiliate',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        }, {
          id: 'edit',
          text: 'featActionEdit',
        },
      ],
    },
    {
      id: 'collab',
      text: 'featCorpCollab',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        }, {
          id: 'edit',
          text: 'featActionEdit',
        },
      ],
    },
    {
      id: 'audit',
      text: 'featCorpAudit',
      actions: [
        {
          id: 'view',
          text: 'featActionView',
        },
      ],
    },
  ],
};

export const DEFAULT_MODULES = {};
appModules.forEach((mod, index) => {
  DEFAULT_MODULES[mod.id] = {
    id: mod.id,
    cls: mod.id,
    url: `/${mod.id}`,
    text: mod.text,
    status: mod.status,
    defaultText: mod.defaultText,
    index,
  };
});

export const INTRINSIC_MODULE_FEATURES = appModules.concat([MODULE_CORPORATION]);
