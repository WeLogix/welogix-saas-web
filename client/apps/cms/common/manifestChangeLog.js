import moment from 'moment';
import {
  CMS_ENTRY_TYPE, CMS_FEE_UNIT, CMS_CONFIRM, CMS_CUS_REMARK, CIQ_SPECIAL_DECL_FLAGS,
  CIQ_CORREL_REASONS, CMS_BILL_TYPE, CIQ_GOODS_ATTRS, CIQ_GOODS_USETO, CIQ_DANGER_PACK_TYPE,
} from 'common/constants';

export function createDelgHeadChangeLog(formData, formValues, formParams, msg, ietype) {
  const mapValues = {
    trade_co: ietype === 'import' ? msg('domesticReceiver') : msg('domesticSender'),
    trade_custco: msg('tradeCustco'),
    trade_name: msg('tradeName'),
    trader_ciqcode: msg('traderCiqcode'),
    agent_ciqcode: msg('agentCiqcode'),
    agent_code: msg('agentCode'),
    agent_custco: msg('agentCustco'),
    agent_name: msg('agentName'),
    oversea_entity_aeocode: msg('overseaEntityAeocode'),
    oversea_entity_name: ietype === 'import' ? msg('overseaSender') : msg('overseaReceiver'),
    owner_ciqcode: msg('ownerCiqcode'),
    owner_code: ietype === 'import' ? msg('ownerConsumeName') : msg('ownerProduceName'),
    owner_custco: msg('ownerCustco'),
    owner_name: msg('ownerName'),
    bl_wb_no: msg('ladingWayBill'),
    decl_port: msg('declPort'),
    cdf_flag: msg('entryType'),
    ftz_flag: msg('billType'),
    i_e_date: ietype === 'import' ? msg('idate') : msg('edate'),
    i_e_port: ietype === 'import' ? msg('entryCustoms') : msg('exitCustoms'),
    d_date: msg('ddate'),
    decl_matters: msg('cusRemark'),
    contr_no: msg('contractNo'),
    manual_no: msg('emsNo'),
    trade_mode: msg('tradeMode'),
    cut_mode: msg('rmModeName'),
    trade_country: msg('tradeCountry'),
    dept_dest_country: ietype === 'import' ? msg('departCountry') : msg('destinateCountry'),
    dept_dest_port: ietype === 'import' ? msg('callingPort') : msg('eDestinatePort'),
    origin_port: msg('originPort'),
    entry_exit_zone: ietype === 'import' ? msg('entryPort') : msg('exitPort'),
    gross_wt: msg('grossWeight'),
    net_wt: msg('netWeight'),
    fee_curr: msg('feeCurr'),
    fee_mark: msg('feeMark'),
    fee_rate: msg('feeRate'),
    insur_mark: msg('insurMark'),
    insur_rate: msg('insurRate'),
    insur_curr: msg('insurCurr'),
    other_curr: msg('otherCurr'),
    other_rate: msg('otherRate'),
    other_mark: msg('otherMark'),
    storage_place: msg('storagePlace'),
    license_no: msg('licenseNo'),
    mark_note: msg('markNo'),
    note: msg('notes'),
    pack_count: msg('packCount'),
    payment_royalty: msg('paymentRoyalty'),
    price_effect: msg('priceEffect'),
    special_relation: msg('specialRelation'),
    traf_mode: msg('transMode'),
    traf_name: msg('transModeName'),
    trxn_mode: msg('trxMode'),
    voyage_no: msg('voyageNo'),
    wrap_type: msg('packType'),
    ra_decl_no: msg('raDeclNo'),
    ra_manual_no: msg('raManualNo'),
    store_no: msg('storeNo'),
    yard_code: msg('yardCode'),
    ciq_orgcode: msg('orgCode'),
    vsa_orgcode: msg('vsaOrgCode'),
    insp_orgcode: msg('inspOrgCode'),
    purp_orgcode: msg('purpOrgCode'),
    // ent_qualif_type: msg('entQualif'),
    spec_decl_flag: msg('specDeclFlag'),
    correl_no: msg('correlNo'),
    correl_reason_flag: msg('correlReasonFlag'),
    // appl_cert: msg('applCert'),
    depart_date: msg('departDate'),
    swb_no: msg('BLno'),
    orig_box_flag: msg('originBox'),
  };
  // 字符标识转换
  const customsFn = (prev, next) => {
    let oldData;
    let newData;
    formParams.customs.forEach((f) => {
      if (f.customs_code === prev) {
        oldData = f.customs_name;
      } else if (f.customs_code === next) {
        newData = f.customs_name;
      }
    });
    return { oldData, newData };
  };
  const countryFn = (prev, next) => {
    let oldData;
    let newData;
    formParams.country.forEach((f) => {
      if (f.cntry_co === prev) {
        oldData = f.cntry_name_cn;
      } else if (f.cntry_co === next) {
        newData = f.cntry_name_cn;
      }
    });
    return { oldData, newData };
  };
  const portFn = (prev, next) => {
    let oldData;
    let newData;
    formParams.port.forEach((f) => {
      if (f.port_code === prev) {
        oldData = f.port_c_cod;
      } else if (f.port_code === next) {
        newData = f.port_c_cod;
      }
    });
    return { oldData, newData };
  };
  const feeUnitFn = (prev, next) => {
    let oldData;
    let newData;
    CMS_FEE_UNIT.forEach((f) => {
      if (f.value === prev) {
        oldData = f.text;
      } else if (f.value === next) {
        newData = f.text;
      }
    });
    return { oldData, newData };
  };
  const currencyFn = (prev, next) => {
    let oldData;
    let newData;
    formParams.currency.forEach((f) => {
      if (f.curr_code === prev) {
        oldData = f.curr_name;
      } else if (f.curr_code === next) {
        newData = f.curr_name;
      }
    });
    return { oldData, newData };
  };
  const confirmFn = (prev, next) => {
    let oldData;
    let newData;
    CMS_CONFIRM.forEach((f) => {
      if (f.value === prev) {
        oldData = f.text;
      } else if (f.value === next) {
        newData = f.text;
      }
    });
    return { oldData, newData };
  };
  const ciqOrgFn = (prev, next) => {
    let oldData;
    let newData;
    formParams.ciqOrganization.forEach((f) => {
      if (f.org_code === prev) {
        oldData = f.org_name;
      } else if (f.org_code === next) {
        newData = f.org_name;
      }
    });
    return { oldData, newData };
  };
  const timeFn = (prev, next) => {
    const oldData = prev && moment(prev).format('YYYY-MM-DD');
    const newData = next && moment(next).format('YYYY-MM-DD');
    if (oldData === newData || (!oldData && !newData)) {
      return { oldData: null, newData: null };
    }
    return { oldData, newData };
  };
  const specialHandle = {
    default: (prev, next) => ({ oldData: prev, newData: next }),
    decl_port: customsFn,
    cdf_flag: (prev, next) => {
      let oldData;
      let newData;
      CMS_ENTRY_TYPE.forEach((f) => {
        if (f.value === prev) {
          oldData = f.text;
        } else if (f.value === next) {
          newData = f.text;
        }
      });
      return { oldData, newData };
    },
    ftz_flag: (prev, next) => {
      let oldData;
      let newData;
      CMS_BILL_TYPE.forEach((f) => {
        if (f.value === prev) {
          oldData = f.text;
        } else if (f.value === next) {
          newData = f.text;
        }
      });
      return { oldData, newData };
    },
    i_e_port: customsFn,
    entry_exit_zone: (prev, next) => {
      let oldData;
      let newData;
      formParams.cnport.forEach((f) => {
        if (f.port_code === prev) {
          oldData = f.port_name;
        } else if (f.port_code === next) {
          newData = f.port_name;
        }
      });
      return { oldData, newData };
    },
    trade_mode: (prev, next) => {
      let oldData;
      let newData;
      formParams.tradeMode.forEach((f) => {
        if (f.trade_mode === prev) {
          oldData = f.trade_abbr;
        } else if (f.trade_mode === next) {
          newData = f.trade_abbr;
        }
      });
      return { oldData, newData };
    },
    cut_mode: (prev, next) => {
      let oldData;
      let newData;
      formParams.remissionMode.forEach((f) => {
        if (f.rm_mode === prev) {
          oldData = f.rm_abbr;
        } else if (f.rm_mode === next) {
          newData = f.rm_abbr;
        }
      });
      return { oldData, newData };
    },
    traf_mode: (prev, next) => {
      let oldData;
      let newData;
      formParams.transMode.forEach((f) => {
        if (f.trans_code === prev) {
          oldData = f.trans_spec;
        } else if (f.trans_code === next) {
          newData = f.trans_spec;
        }
      });
      return { oldData, newData };
    },
    trxn_mode: (prev, next) => {
      let oldData;
      let newData;
      formParams.trxnMode.forEach((f) => {
        if (f.trx_mode === prev) {
          oldData = f.trx_spec;
        } else if (f.trx_mode === next) {
          newData = f.trx_spec;
        }
      });
      return { oldData, newData };
    },
    trade_country: countryFn,
    dept_dest_country: countryFn,
    origin_port: portFn,
    dept_dest_port: portFn,
    wrap_type: (prev, next) => {
      let oldData;
      let newData;
      formParams.wrapType.forEach((f) => {
        if (f.value === prev) {
          oldData = f.text;
        } else if (f.value === next) {
          newData = f.text;
        }
      });
      return { oldData, newData };
    },
    fee_mark: feeUnitFn,
    insur_mark: feeUnitFn,
    other_mark: feeUnitFn,
    fee_curr: currencyFn,
    insur_curr: currencyFn,
    other_curr: currencyFn,
    special_relation: confirmFn,
    price_effect: confirmFn,
    payment_royalty: confirmFn,
    ciq_orgcode: ciqOrgFn,
    vsa_orgcode: ciqOrgFn,
    insp_orgcode: ciqOrgFn,
    purp_orgcode: ciqOrgFn,
    correl_reason_flag: (prev, next) => {
      let oldData;
      let newData;
      CIQ_CORREL_REASONS.forEach((f) => {
        if (f.value === prev) {
          oldData = f.text;
        } else if (f.value === next) {
          newData = f.text;
        }
      });
      return { oldData, newData };
    },
    orig_box_flag: confirmFn,
    decl_matters: (prev, next) => {
      const cusMark = {};
      CMS_CUS_REMARK.forEach((f) => { cusMark[f.value] = f.text; });
      const prevData = prev ? prev.split(',') : [];
      const oldData = prevData.map(f => cusMark[f]).join(',');
      const nextData = next ? next.split(',') : [];
      const newData = nextData.map(f => cusMark[f]).join(',');
      return { oldData, newData };
    },
    spec_decl_flag: (prev, next) => {
      const ciqSpecial = {};
      CIQ_SPECIAL_DECL_FLAGS.forEach((f) => { ciqSpecial[f.value] = f.text; });
      const prevData = prev ? prev.split(',') : [];
      const oldData = prevData.map(f => ciqSpecial[f]).join(',');
      const nextData = next ? next.split(',') : [];
      const newData = nextData.map(f => ciqSpecial[f]).join(',');
      return { oldData, newData };
    },
    i_e_date: timeFn,
    d_date: timeFn,
    depart_date: timeFn,
    complete_discharge_date: timeFn,
  };
  const changeLogs = [];
  const updateValue = {};
  Object.keys(formValues).forEach((formkey) => {
    if (formValues[formkey] || formValues[formkey] === 0 || formValues[formkey] === false) {
      let formValue = formValues[formkey];
      if (['gross_wt', 'net_wt', 'fee_rate', 'insur_rate', 'other_rate', 'pack_count'].indexOf(formkey) !== -1) {
        formValue = parseFloat(formValue);
        if (Number.isNaN(formValue)) {
          formValue = null;
        }
      } else if (['decl_matters', 'spec_decl_flag'].indexOf(formkey) !== -1) {
        formValue = formValue.join(',');
      }
      if (formData[formkey] !== formValue) {
        updateValue[formkey] = formValue;
        // 企业资质和申报单证在modal中新建保存时就已记录，无需再此重复记录
        if (['ent_qualif_type', 'appl_cert'].indexOf(formkey) === -1) {
          const handleFn = specialHandle[formkey] || specialHandle.default;
          const { oldData, newData } = handleFn(formData[formkey], formValue);
          if (oldData || newData) { // 时间类特殊处理
            changeLogs.push(`${mapValues[formkey]}由${oldData || '空'}改为${newData || '空'}`);
          }
        }
      }
    } else if (formData[formkey] !== null && formData[formkey] !== ''
      && formData[formkey] !== undefined) {
      updateValue[formkey] = null;
    }
  });
  return { updateValue, opContent: changeLogs.join(',') };
}

export function createDelgBodyChangeLog(fieldLabelMap, formData, formValues, formParams, ciqList) {
  const unitFn = (prev, next) => {
    let oldData;
    let newData;
    formParams.unit.forEach((f) => {
      if (f.unit_code === prev) {
        oldData = f.unit_name;
      } else if (f.unit_code === next) {
        newData = f.unit_name;
      }
    });
    return { oldData, newData };
  };
  const countryFn = (prev, next) => {
    let oldData;
    let newData;
    formParams.country.forEach((f) => {
      if (f.cntry_co === prev) {
        oldData = f.cntry_name_cn;
      } else if (f.cntry_co === next) {
        newData = f.cntry_name_cn;
      }
    });
    return { oldData, newData };
  };
  const districtFn = (prev, next) => {
    let oldData;
    let newData;
    formParams.district.forEach((f) => {
      if (f.district_code === prev) {
        oldData = f.district_name;
      } else if (f.district_code === next) {
        newData = f.district_name;
      }
    });
    return { oldData, newData };
  };
  const timeFn = (prev, next) => {
    const oldData = prev && moment(prev).format('YYYY-MM-DD');
    const newData = next && moment(next).format('YYYY-MM-DD'); // moment(moment('XXX'))可以使用
    if (oldData === newData || (!oldData && !newData)) {
      return { oldData: null, newData: null };
    }
    return { oldData, newData };
  };
  const specialHandle = {
    default: (prev, next) => ({ oldData: prev, newData: next }),
    trade_curr: (prev, next) => {
      let oldData;
      let newData;
      formParams.currency.forEach((f) => {
        if (f.curr_code === prev) {
          oldData = f.curr_name;
        } else if (f.curr_code === next) {
          newData = f.curr_name;
        }
      });
      return { oldData, newData };
    },
    g_unit: unitFn,
    unit_pcs: unitFn,
    orig_country: countryFn,
    dest_country: countryFn,
    district_code: districtFn,
    district_region: districtFn,
    duty_mode: (prev, next) => {
      let oldData;
      let newData;
      formParams.exemptionWay.forEach((f) => {
        if (f.value === prev) {
          oldData = f.text;
        } else if (f.value === next) {
          newData = f.text;
        }
      });
      return { oldData, newData };
    },
    orig_place_code: (prev, next) => {
      let oldData;
      let newData;
      formParams.origPlace.forEach((f) => {
        if (f.place_code === prev) {
          oldData = f.place_name;
        } else if (f.place_code === next) {
          newData = f.place_name;
        }
      });
      return { oldData, newData };
    },
    purpose: (prev, next) => {
      let oldData;
      let newData;
      CIQ_GOODS_USETO.forEach((f) => {
        if (f.value === prev) {
          oldData = f.text;
        } else if (f.value === next) {
          newData = f.text;
        }
      });
      return { oldData, newData };
    },
    goods_attr: (prev, next) => {
      const goodsAttr = {};
      CIQ_GOODS_ATTRS.forEach((f) => { goodsAttr[f.value] = f.text; });
      const prevData = prev ? prev.split(',') : [];
      const oldData = prevData.map(f => goodsAttr[f]).join(',');
      const nextData = next ? next.split(',') : [];
      const newData = nextData.map(f => goodsAttr[f]).join(',');
      return { oldData, newData };
    },
    expiry_date: timeFn,
    produce_date: timeFn,
    danger_flag: (prev, next) => {
      const dangerFlag = {
        0: '危险化学品',
        1: '非危化学品',
      };
      return { oldData: dangerFlag[prev], newData: dangerFlag[next] };
    },
    danger_pack_type: (prev, next) => {
      let oldData;
      let newData;
      CIQ_DANGER_PACK_TYPE.forEach((f) => {
        if (f.value === prev) {
          oldData = f.text;
        } else if (f.value === next) {
          newData = f.text;
        }
      });
      return { oldData, newData };
    },
  };
  const whetherEdit = !!formData.id;
  const changeLogs = [];
  const updateValue = { ...formValues };
  const hsciq = ciqList.find(f => f.ciqcode === formValues.ciqcode);
  updateValue.ciqname = hsciq && hsciq.ciqname;
  Object.keys(formValues).forEach((formkey) => {
    if (formValues[formkey] || formValues[formkey] === 0 || formValues[formkey] === false || formValues[formkey] === '') {
      let formValue = formValues[formkey];
      if (['dec_price', 'trade_total', 'gross_wt', 'wet_wt', 'g_qty', 'qty_1', 'qty_2', 'qty_pcs', 'em_g_no', 'warranty_days'].indexOf(formkey) !== -1) {
        formValue = parseFloat(formValue);
        if (Number.isNaN(formValue)) {
          formValue = null;
        }
      } else if (['goods_attr'].indexOf(formkey) !== -1) {
        formValue = formValue.join(',');
      }
      updateValue[formkey] = formValue;
      if (whetherEdit && formData[formkey] !== formValue &&
        ['stuff', 'expiry_date', 'warranty_days', 'oversea_manufcr_name', 'produce_date_str', 'brand', 'produce_date', 'external_lot_no',
          'manufcr_regno', 'manufcr_regname', 'product_spec', 'product_model', 'product_models'].indexOf(formkey) === -1) {
        const handleFn = specialHandle[formkey] || specialHandle.default;
        const { oldData, newData } = handleFn(formData[formkey], formValue);
        if (oldData || newData) { // 时间类特殊处理
          changeLogs.push(`${fieldLabelMap[formkey]}由${oldData || '空'}改为${newData || '空'}`);
        }
      }
    } else {
      updateValue[formkey] = null;
    }
  });
  delete updateValue.unit_1;
  delete updateValue.unit_2;
  const opContent = whetherEdit ? changeLogs.join(',') : '新增表体数据';
  return { updateValue, opContent };
}
