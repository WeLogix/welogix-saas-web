/* eslint react/no-multi-comp: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { Button, Icon, Row, Col, Form, Input, Select, AutoComplete } from 'antd';
import { CMS_ENTRY_TYPE, CMS_FEE_UNIT, CMS_DECL_STATUS, CMS_CONFIRM, CMS_CUS_REMARK, CIQ_SPECIAL_DECL_FLAGS, CIQ_CORREL_REASONS, CMS_BILL_TYPE, CIQ_ENT_QUALIF_TYPE_I, CIQ_ENT_QUALIF_TYPE_E } from 'common/constants';
import { renderV1V2Options } from 'client/common/transformer';
import FormInput from './formInput';
import FormEditableItem from './formEditableItem';
import FormChildrenSearchSelect from './formChildrenSelect';
import FormControlSearchSelect from './formLimitSelect';
import FormDatePicker from './formDatePicker';
import EntQualifyModal from '../modal/entQualifyModal';
import CiqUserListModal from '../modal/ciqUserListModal';
import CiqApplCertModal from '../modal/ciqApplCertModal';
import OtherPackModal from '../modal/otherPackModal';
import { formatMsg } from '../../message.i18n';

const FormItem = Form.Item;
const { Option } = Select;
const ButtonGroup = Button.Group;

export const DeclFormContext = React.createContext({
  ietype: 'import',
  intl: null,
  getFieldDecorator: () => node => node,
  getFieldValue: value => value,
  setFieldsValue: value => value,
  cdfversion: 'v201807',
  nonftz: true,
  formParams: {
    customs: [],
    country: [],
    currency: [],
  },
  manifestEntity: { traders: [], agents: [], overseaEntity: [] },
});

export const DECL_LABEL_KEYS_BY_IEVERSION = {
  v201603: {
    ieport: {
      import: 'iport',
      export: 'eport',
    },
    trade_co: {
      import: 'forwardName',
      export: 'forwardName',
    },
    owner_code: {
      import: 'ownerConsumeName',
      export: 'ownerProduceName',
    },
    agent_code: {
      import: 'agentName',
      export: 'agentName',
    },
  },
  v201807: {
    ieport: {
      import: 'entryCustoms',
      export: 'exitCustoms',
    },
    trade_co: {
      import: 'domesticReceiver',
      export: 'domesticSender',
    },
    owner_code: {
      import: 'ownerConsumeName',
      export: 'ownerProduceName',
    },
    agent_code: {
      import: 'agentName',
      export: 'agentName',
    },
    oversea_entity: {
      import: 'overseaSender',
      export: 'overseaReceiver',
    },
    dept_dest_port: {
      import: 'callingPort',
      export: 'eDestinatePort',
    },
    entry_exit_zone: {
      import: 'entryPort',
      export: 'exitPort',
    },
    dept_dest_country: {
      import: 'departCountry',
      export: 'destinateCountry',
    },
  },
  i_e_date: {
    import: 'idate',
    export: 'edate',
  },
  gross_wt: 'grossWeight',
  net_wt: 'netWeight',
};

// 进出口口岸
export function IEPort(props) {
  return (
    <DeclFormContext.Consumer>
      {(context) => {
  const {
    intl, ietype, cdfversion, getFieldDecorator, formParams: { customs, cnport },
  } = context;
  const {
    disabled, formData, required,
  } = props;
  const msg = formatMsg(intl);
  const customsProps = {
    outercol: 24,
    col: 8,
    field: 'i_e_port',
    rules: [{ required }],
    options: customs.map(cus => ({
      value: cus.customs_code,
      text: `${cus.customs_code} | ${cus.customs_name}`,
    })),
    label: msg(DECL_LABEL_KEYS_BY_IEVERSION[cdfversion].ieport[ietype]),
    disabled,
    formData,
    getFieldDecorator,
  };
        let entryExitProps;
        if (cdfversion !== 'v201603') {
         entryExitProps = {
    outercol: 24,
    col: 8,
    field: 'entry_exit_zone',
    label: msg(DECL_LABEL_KEYS_BY_IEVERSION[cdfversion].entry_exit_zone[ietype]),
    rules: [{ required }],
    options: cnport.map(pt => ({
      value: pt.port_code,
      text: `${pt.port_code} | ${pt.port_name}`,
    })),
    disabled,
    formData,
    getFieldDecorator,
  };
        }
  return (<Col span={cdfversion === 'v201603' ? 8 : 12}>
    <Col span={cdfversion === 'v201603' ? 24 : 12}>
      <FormControlSearchSelect {...customsProps} />
    </Col>
    {cdfversion !== 'v201603' &&
    <Col span={12}>
      <FormControlSearchSelect {...entryExitProps} />
    </Col>}
  </Col>);
  }
}
    </DeclFormContext.Consumer>
  );
}
IEPort.propTypes = {
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  formData: PropTypes.shape({ i_e_port: PropTypes.string }).isRequired,
};

// 进出口日期
export function IEDate(props) {
  return (
    <DeclFormContext.Consumer>
      {(context) => {
  const { getFieldDecorator, ietype, intl } = context;
  const {
    disabled, formData, editable, onSave,
  } = props;
  const msg = formatMsg(intl);
  const ieDateProps = {
    outercol: 24,
    col: 8,
    field: 'i_e_date',
    label: ietype === 'import' ? msg('idate') : msg('edate'),
    rules: [{ required: false }],
    formData,
    getFieldDecorator,
  };
  return (
    editable ? <FormEditableItem type="date" onSave={onSave} {...ieDateProps} />
    : <FormDatePicker disabled={disabled} {...ieDateProps} />
  );
      }
      }
    </DeclFormContext.Consumer>
  );
}
IEDate.propTypes = {
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  formData: PropTypes.shape({
    i_e_date: PropTypes.string,
  }).isRequired,
};

// 申报日期
export function DeclDate(props) {
  return (
    <DeclFormContext.Consumer>
      {(context) => {
  const { getFieldDecorator, intl } = context;
  const msg = formatMsg(intl);
  const { disabled, formData } = props;
  const dDateProps = {
    outercol: 24,
    col: 8,
    field: 'd_date',
    label: msg('ddate'),
    disabled,
    rules: [{ required: false }],
    formData,
    getFieldDecorator,
  };
  return <FormDatePicker {...dDateProps} />;
      }
      }
    </DeclFormContext.Consumer>
  );
}
DeclDate.propTypes = {
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  formData: PropTypes.shape({ d_date: PropTypes.instanceOf(Date) }).isRequired,
};

// 境内单位
export class DomesticEntitySelect extends React.Component {
  static propTypes = {
    codeField: PropTypes.string.isRequired,
    custCodeField: PropTypes.string.isRequired,
    ciqCodeField: PropTypes.string.isRequired,
    nameField: PropTypes.string.isRequired,
    formData: PropTypes.shape({ id: PropTypes.number }),
    disabled: PropTypes.bool,
    codeRules: PropTypes.arrayOf(PropTypes.shape({ required: PropTypes.bool })),
    nameRules: PropTypes.arrayOf(PropTypes.shape({ required: PropTypes.bool })),
  }
  CODE_ENTITY_KEY = {
    trade_co: {
      key: 'traders',
    },
    owner_code: {
      key: 'traders',
    },
    agent_code: {
      key: 'agents',
    },
    trade_custco: {
      key: 'traders',
    },
    owner_custco: {
      key: 'traders',
    },
    agent_custco: {
      key: 'agents',
    },
    trader_ciqcode: {
      key: 'traders',
    },
    owner_ciqcode: {
      key: 'traders',
    },
    agent_ciqcode: {
      key: 'agents',
    },
  }

  render() {
    const {
      codeField, custCodeField, ciqCodeField, nameField, formData, disabled,
      codeRules, nameRules,
    } = this.props;
    const initialCodeValue = (formData && formData[codeField]) || '';
    const initialCustCodeValue = (formData && formData[custCodeField]) || '';
    const initialCiqCodeValue = (formData && formData[ciqCodeField]) || '';
    const initialNameValue = formData && formData[nameField];
    return (
      <DeclFormContext.Consumer>
        {(context) => {
    const {
      getFieldDecorator, setFieldsValue, cdfversion, intl, ietype, manifestEntity,
      saveHeadLocal,
    } = context;
    const msg = formatMsg(intl);
    const label = DECL_LABEL_KEYS_BY_IEVERSION[cdfversion][codeField][ietype];
        const codeOpts = { cuc: [], scc: [] };
      const entityCd = this.CODE_ENTITY_KEY[codeField];
      const options = manifestEntity[entityCd.key];
    if (!disabled) {
      codeOpts.cuc = options.filter(op => op.custcode !== null && op.custcode.length > 0);
      codeOpts.ciq = options.filter(op => op.ciqcode !== null && op.ciqcode.length > 0);
      codeOpts.scc = options.filter(op => op.code !== null && op.code.length > 0);
    }
    function handleInputChange(value) {
      if (value === undefined || value === '') {
        setFieldsValue({
          [codeField]: '',
          [custCodeField]: '',
          [ciqCodeField]: '',
          [nameField]: '',
        });
        if (codeField === 'trade_co' && saveHeadLocal) {
          saveHeadLocal({ trader_name_en: '' });
        }
      } else {
        const rels = options.filter(rel => rel.code === value || rel.custcode === value ||
          rel.ciqcode === value);
        if (rels.length > 0) {
          setFieldsValue({
            [codeField]: rels[0].code,
            [custCodeField]: rels[0].custcode,
            [ciqCodeField]: rels[0].ciqcode,
            [nameField]: rels[0].name,
          });
        if (codeField === 'trade_co' && saveHeadLocal) {
          saveHeadLocal({ trader_name_en: rels[0].name_en });
        }
        }
      }
    }
    return (<FormItem
      labelCol={{ span: cdfversion === 'v201807' ? 4 : 5 }}
      wrapperCol={{ span: cdfversion === 'v201807' ? 20 : 19 }}
      colon={false}
      label={msg(label)}
      required
    >
      <Row gutter={4}>
        <Col span={6}>
          {disabled ?
            <Input disabled value={initialCodeValue} />
                  : getFieldDecorator(codeField, {
                    initialValue: initialCodeValue,
                    rules: codeRules,
                    onChange: handleInputChange,
                  })(<AutoComplete
                    allowClear
                    optionLabelProp="value"
                    placeholder={msg('scc')}
                    dropdownMatchSelectWidth={false}
                    dropdownStyle={{ width: 360 }}
                  >
                    {codeOpts.scc.map(opt => (<Option key={opt.code} value={opt.code}>
                      {opt.code} | {opt.name}</Option>))}
                  </AutoComplete>)}
        </Col>
        <Col span={cdfversion === 'v201807' ? 4 : 8}>
          {disabled ?
            <Input disabled value={initialCustCodeValue} />
                  : getFieldDecorator(custCodeField, {
                    initialValue: initialCustCodeValue,
                    onChange: handleInputChange,
                  })(<AutoComplete
                    allowClear
                    optionLabelProp="value"
                    placeholder={msg('customsCode')}
                    dropdownMatchSelectWidth={false}
                    dropdownStyle={{ width: 360 }}
                  >
                    {codeOpts.cuc.map(opt => (<Option key={opt.custcode} value={opt.custcode}>
                      {opt.custcode} | {opt.name}</Option>))}
                  </AutoComplete>)}
        </Col>
        {cdfversion === 'v201807' && <Col span={4}>
          {disabled ?
            <Input disabled value={initialCiqCodeValue} />
                  : getFieldDecorator(ciqCodeField, {
                    initialValue: initialCiqCodeValue,
                    onChange: handleInputChange,
                  })(<AutoComplete
                    allowClear
                    optionLabelProp="value"
                    placeholder={msg('ciqCode')}
                    dropdownMatchSelectWidth={false}
                    dropdownStyle={{ width: 360 }}
                  >
                    {codeOpts.ciq.map(opt => (<Option key={opt.ciqcode} value={opt.ciqcode}>
                      {opt.ciqcode} | {opt.name}</Option>))}
                  </AutoComplete>)}
        </Col>}
        <Col span={10}>
          {disabled ?
            <Input disabled value={initialNameValue} /> :
                  getFieldDecorator(nameField, {
                    rules: nameRules,
                    initialValue: initialNameValue,
                  })(<Input placeholder={msg('relationName')} disabled={disabled} />)}
        </Col>
      </Row>
    </FormItem>
    );
      }}
      </DeclFormContext.Consumer>);
  }
}

export class OverseaEntitySelect extends React.PureComponent {
  static propTypes = {
    aeoCodeField: PropTypes.string.isRequired,
    nameField: PropTypes.string.isRequired,
    formData: PropTypes.shape({ id: PropTypes.number }),
    disabled: PropTypes.bool,
    codeRules: PropTypes.arrayOf(PropTypes.shape({ required: PropTypes.bool })),
    nameRules: PropTypes.arrayOf(PropTypes.shape({ required: PropTypes.bool })),
  }

  render() {
    const {
      aeoCodeField, nameField, formData, disabled, codeRules, nameRules, editable, onSave,
    } = this.props;
    const initialAEOCodeValue = (formData && formData[aeoCodeField]) || '';
    const initialNameValue = formData && formData[nameField];
    return (
      <DeclFormContext.Consumer>
        {(context) => {
    const {
      getFieldDecorator, intl, cdfversion, ietype, manifestEntity,
      saveHeadLocal, setFieldsValue,
    } = context;
    const aeoCompOpts = manifestEntity.overseaEntity.filter(ove => ove.aeo_code).map(ove => ({
      aeo_code: ove.aeo_code,
      name: ove.name_en,
      name_cn: ove.name,
      addr: ove.addr,
    }));
    const aeoNameOpts = manifestEntity.overseaEntity.filter(ove => ove.name_en).map(ove => ({
      // id: ove.id,
      name: ove.name_en,
    }));
    const label = DECL_LABEL_KEYS_BY_IEVERSION[cdfversion].oversea_entity[ietype];
    const msg = formatMsg(intl);
    function handleAeoChange(value) {
      if (value === undefined || value === '') {
        setFieldsValue({
          [aeoCodeField]: '',
        });
        if (saveHeadLocal) {
        saveHeadLocal({ oversea_entity_cname: '', oversea_entity_addr: '' });
        }
      } else {
        const rels = aeoCompOpts.filter(rel => rel.aeo_code === value);
        if (rels.length > 0) {
          setFieldsValue({
            [aeoCodeField]: rels[0].aeo_code || '',
            [nameField]: rels[0].name,
          });
        if (saveHeadLocal) {
          saveHeadLocal({
            oversea_entity_cname: rels[0].name_cn,
            oversea_entity_addr: rels[0].addr,
          });
        }
        }
      }
    }
    const aeoCodeProps = {
      field: aeoCodeField,
      formData,
      rules: codeRules,
      getFieldDecorator,
      options: aeoCompOpts.map(opt => ({
        value: opt.aeo_code,
        text: [opt.aeo_code, opt.name].filter(f => f).join(' | '),
      })),
      dropdownWidth: 460,
      noMarginBottom: true,
    };
    const nameProps = {
      field: nameField,
      formData,
      rules: nameRules,
      getFieldDecorator,
      options: aeoNameOpts.map(opt => ({
        value: opt.name,
        text: opt.name,
      })),
      dropdownWidth: 360,
      noMarginBottom: true,
    };
    const aeoCodeSelect = (disabled ? <Input disabled value={initialAEOCodeValue} /> :
      getFieldDecorator(aeoCodeField, {
        initialValue: initialAEOCodeValue,
        rules: codeRules,
        onChange: handleAeoChange,
      })(<AutoComplete
        allowClear
        optionLabelProp="value"
        placeholder={msg('aeoCode')}
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: 460 }}
      >
        {aeoCompOpts.map(opt => (<Option key={opt.aeo_code} value={opt.aeo_code}>
          {[opt.aeo_code, opt.name].filter(aeo => aeo).join(' | ')}</Option>))}
      </AutoComplete>));
    const nameSelect = (disabled ? <Input disabled value={initialNameValue} /> :
      getFieldDecorator(nameField, {
        rules: nameRules,
        initialValue: initialNameValue,
      })(<AutoComplete
        allowClear
        optionLabelProp="value"
        placeholder={msg('enCopName')}
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: 360 }}
      >
        {aeoNameOpts.map(opt => (<Option key={opt.name} value={opt.name}>
          {opt.name}</Option>))}
      </AutoComplete>));
    return (<FormItem
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      colon={false}
      label={msg(label)}
    >
      <Row gutter={4}>
        <Col span={10}>
          {editable ? <FormEditableItem onSave={onSave} {...aeoCodeProps} /> :
          aeoCodeSelect}
        </Col>
        <Col span={14}>
          {editable ? <FormEditableItem onSave={onSave} {...nameProps} /> :
          nameSelect}
        </Col>
      </Row>
    </FormItem>
  );
      }
      }
      </DeclFormContext.Consumer>);
  }
}

// 申报地海关
export function DeclCustoms(props) {
  return (
    <DeclFormContext.Consumer>
      {(context) => {
  const { getFieldDecorator, formParams: { customs }, intl } = context;
  const msg = formatMsg(intl);
  const {
    disabled, formData, required,
  } = props;
  const declPortProps = {
    outercol: 24,
    col: 8,
    field: 'decl_port',
    label: msg('declPort'),
    rules: [{ required }],
    disabled,
    formData,
    getFieldDecorator,
    options: customs.map(cus => ({
      value: cus.customs_code,
      text: `${cus.customs_code} | ${cus.customs_name}`,
    })),
  };

  return (<Col span={6}>
    <FormControlSearchSelect {...declPortProps} />
  </Col>);
      } }
    </DeclFormContext.Consumer>);
}
DeclCustoms.propTypes = {
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  formData: PropTypes.shape({ decl_port: PropTypes.string }).isRequired,
};

// 报关单类型
export function EntryType(props) {
  return (
    <DeclFormContext.Consumer>
      {(context) => {
  const {
    getFieldDecorator, intl,
  } = context;
  const msg = formatMsg(intl);
  const {
    disabled, formData, editable, onSave,
  } = props;
  const entryTypeProps = {
    outercol: 24,
    col: 8,
    field: 'cdf_flag',
    options: CMS_ENTRY_TYPE.map(et => ({
      value: et.value,
      text: `${et.value} | ${et.text}`,
    })),
    label: msg('entryType'),
    formData,
    getFieldDecorator,
  };
  return editable ? <Col span={6}><FormEditableItem type="select" onSave={onSave} {...entryTypeProps} /></Col>
    : <Col span={6}><FormChildrenSearchSelect disabled={disabled} {...entryTypeProps} /></Col>;
  } }
    </DeclFormContext.Consumer>);
}
EntryType.propTypes = {
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  editable: PropTypes.bool,
  onSave: PropTypes.func,
  formData: PropTypes.shape({ entry_type: PropTypes.string }).isRequired,
};

// 备案清单类型
export function BillType(props) {
  return (
    <DeclFormContext.Consumer>
      {(context) => {
  const {
    getFieldDecorator, intl, nonftz,
  } = context;
  const msg = formatMsg(intl);
  const {
    disabled, formData, editable, onSave,
  } = props;
  const billTypeProps = {
    outercol: 24,
    col: 8,
    field: 'ftz_flag',
    options: CMS_BILL_TYPE.map(et => ({
      value: et.value,
      text: `${et.value} | ${et.text}`,
    })),
    label: msg('billType'),
    formData,
    getFieldDecorator,
  };
  if (!nonftz) {
    return editable ? <Col span={6}><FormEditableItem type="select" onSave={onSave} {...billTypeProps} /></Col>
    : <Col span={6}><FormChildrenSearchSelect disabled={disabled} {...billTypeProps} /></Col>;
  }
  return null;
      } }
    </DeclFormContext.Consumer>);
}
BillType.propTypes = {
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  editable: PropTypes.bool,
  onSave: PropTypes.func,
  formData: PropTypes.shape({ bill_type: PropTypes.string }).isRequired,
};

// 合同协议号
export function ContractNo(props) {
  return (
    <DeclFormContext.Consumer>
      {(context) => {
  const { getFieldDecorator, intl } = context;
  const msg = formatMsg(intl);
  const {
    disabled, formData, editable, onSave,
  } = props;
  const contractNoProps = {
    outercol: 24,
    col: 4,
    field: 'contr_no',
    label: msg('contractNo'),
    formData,
    getFieldDecorator,
    rules: [{ max: 32 }],
  };
  return (<Col span={12}>{editable ? <FormEditableItem onSave={onSave} {...contractNoProps} />
    : <FormInput disabled={disabled} {...contractNoProps} />}</Col>);
      } }
    </DeclFormContext.Consumer>);
}
ContractNo.propTypes = {
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  formData: PropTypes.shape({ contr_no: PropTypes.string }).isRequired,
};

// 运输方式、运输工具名称、提运单号
export function Transport(props) {
  return (
    <DeclFormContext.Consumer>
      {(context) => {
  const {
 intl, getFieldDecorator, getFieldValue, formParams: { transMode },
} = context;
  const msg = formatMsg(intl);
  const {
    disabled, formData, required, editable, onSave,
  } = props;
  const isAirOrSeaTraf = getFieldValue('traf_mode') === '2' || getFieldValue('traf_mode') === '5';
  const trafModeProps = {
    outercol: 24,
    col: 8,
    field: 'traf_mode',
    options: transMode.map(tm => ({
      value: tm.trans_code,
      text: `${tm.trans_code} | ${tm.trans_spec}`,
    })),
    label: msg('transMode'),
    disabled,
    formData,
    rules: [{ required, max: 32 }],
    getFieldDecorator,
  };
  const trafNameProps = {
    outercol: 24,
    col: 8,
    field: 'traf_name',
    label: msg('transModeName'),
    rules: getFieldValue('traf_mode') === '2' ? [{ required, max: 32 }] : [{ required: false, max: 32 }],
    formData,
    getFieldDecorator,
  };
  const voyageNoProps = {
    outercol: 24,
    col: 8,
    field: 'voyage_no',
    label: msg('voyageNo'),
    formData,
    rules: getFieldValue('traf_mode') === '2' ? [{ required, max: 32 }] : [{ required: false, max: 32 }],
    getFieldDecorator,
  };
  const blwbProps = {
    outercol: 24,
    col: 8,
    field: 'bl_wb_no',
    label: msg('ladingWayBill'),
    formData,
    rules: isAirOrSeaTraf ? [{ required, max: 32 }] : [{ required: false, max: 32 }],
    getFieldDecorator,
  };
  return (
    <Row>
      <Col span={6}>
        <FormChildrenSearchSelect {...trafModeProps} />
      </Col>
      <Col span={6}>
        { editable ? <FormEditableItem onSave={onSave} {...trafNameProps} /> :
        <FormInput disabled={disabled} {...trafNameProps} />}
      </Col>
      <Col span={6}>
        { editable ? <FormEditableItem onSave={onSave} {...voyageNoProps} /> :
        <FormInput disabled={disabled} {...voyageNoProps} />}
      </Col>
      <Col span={6}>
        { editable ? <FormEditableItem onSave={onSave} {...blwbProps} /> :
        <FormInput disabled={disabled} {...blwbProps} />}
      </Col>
    </Row>
  );
      } }
    </DeclFormContext.Consumer>);
}
Transport.propTypes = {
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  formData: PropTypes.shape({ traf_mode: PropTypes.string }).isRequired,
};

// 监管方式/征免性质
export function TradeRemission(props) {
  return (
    <DeclFormContext.Consumer>
      {(context) => {
  const {
 intl, nonftz, getFieldDecorator, formParams: { tradeMode, remissionMode },
} = context;
  const msg = formatMsg(intl);
  const {
    disabled, formData, required,
  } = props;
  const tradeModeProps = {
    outercol: 24,
    col: nonftz ? 8 : 4,
    field: 'trade_mode',
    options: tradeMode.map(tm => ({
      value: tm.trade_mode,
      text: `${tm.trade_mode} | ${tm.trade_abbr}`,
    })),
    label: msg('tradeMode'),
    rules: [{ required }],
    disabled,
    formData,
    getFieldDecorator,
  };
  const remissionProps = {
    outercol: 24,
    col: 8,
    field: 'cut_mode',
    options: remissionMode.map(rm => ({
      value: rm.rm_mode,
      text: `${rm.rm_mode} | ${rm.rm_abbr}`,
    })),
    required: false,
    label: msg('rmModeName'),
    disabled,
    formData,
    getFieldDecorator,
    dropdownWidth: 320,
  };
  return (
    <Col span={12}>
      <Col span={nonftz ? 12 : 24}>
        <FormChildrenSearchSelect {...tradeModeProps} />
      </Col>
      {nonftz &&
      <Col span={12}>
        <FormChildrenSearchSelect {...remissionProps} />
      </Col>}
    </Col>
  );
      } }
    </DeclFormContext.Consumer>);
}
TradeRemission.propTypes = {
  intl: intlShape,
  ftz: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  formData: PropTypes.shape({ cut_mode: PropTypes.string }).isRequired,
};

// 启运港，经停/指运港,入境/离境口岸
export function Ports(props) {
  return (
    <DeclFormContext.Consumer>
      {(context) => {
  const {
    getFieldDecorator, intl, ietype, cdfversion, formParams: { port },
  } = context;
  const msg = formatMsg(intl);
  const {
    disabled, formData, required,
  } = props;
  let originPortItem = null;
  if (ietype === 'import') {
    const originPortProps = {
      outercol: 24,
      col: 8,
      field: 'origin_port',
      options: port.map(pt => ({
        value: pt.port_code,
        text: `${pt.port_code} | ${pt.port_c_cod}`,
      })),
      label: msg('originPort'),
      rules: [{ required }],
      disabled,
      formData,
      getFieldDecorator,
      dropdownWidth: 240,
    };
    originPortItem = (<Col span={12}>
      <FormControlSearchSelect {...originPortProps} />
    </Col>);
  }
  const destPortProps = {
    outercol: 24,
    col: ietype === 'import' ? 8 : 4,
    field: 'dept_dest_port',
    options: port.map(pt => ({
      value: pt.port_code,
      text: `${pt.port_code} | ${pt.port_c_cod}`,
    })),
    label: msg(DECL_LABEL_KEYS_BY_IEVERSION[cdfversion].dept_dest_port[ietype]),
    rules: [{ required }],
    disabled,
    formData,
    getFieldDecorator,
    dropdownWidth: 240,
  };

  return (
    <Col span={12}>
      {originPortItem}
      <Col span={ietype === 'import' ? 12 : 24}>
        <FormControlSearchSelect {...destPortProps} />
      </Col>

    </Col>
  );
      } }
    </DeclFormContext.Consumer>);
}

Ports.propTypes = {
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  formData: PropTypes.shape({ district_code: PropTypes.string }).isRequired,
};

// 国家(地区)
export function CountryRegion(props) {
  return (
    <DeclFormContext.Consumer>
      {(context) => {
  const {
    intl, getFieldDecorator, ietype, cdfversion, formParams: { country },
  } = context;
  const msg = formatMsg(intl);
  const {
    disabled, formData, required, editable, onSave,
  } = props;
  const countryOptions = renderV1V2Options(country.map(tc => ({
      code: tc.cntry_co,
      code_v1: tc.cntry_co_v1,
      text: tc.cntry_name_cn,
    })));
  const tradeCountryProps = {
    outercol: 24,
    col: 8,
    field: 'trade_country',
    options: countryOptions,
    label: msg('tradeCountry'),
    disabled,
    formData,
    rules: [{ required }],
    getFieldDecorator,
    dropdownWidth: 240,
  };
  const departCountryProps = {
    outercol: 24,
    col: 8,
    field: 'dept_dest_country',
    options: countryOptions,
    label: msg(DECL_LABEL_KEYS_BY_IEVERSION[cdfversion].dept_dest_country[ietype]),
    disabled,
    formData,
    rules: [{ required }],
    getFieldDecorator,
    dropdownWidth: 240,
  };
  return (
    <Col span={12}>
      <Col span={12}>
        <FormChildrenSearchSelect {...tradeCountryProps} />
      </Col>
      <Col span={12}>
        { editable ? <FormEditableItem type="select" onSave={onSave} {...departCountryProps} /> :
        <FormChildrenSearchSelect {...departCountryProps} />}
      </Col>
    </Col>
  );
      } }
    </DeclFormContext.Consumer>);
}

CountryRegion.propTypes = {
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  formData: PropTypes.shape({ trade_country: PropTypes.string }).isRequired,
};

// 成交方式
export function TradeMode(props) {
  return (
    <DeclFormContext.Consumer>
      {(context) => {
  const { getFieldDecorator, intl, formParams: { trxnMode } } = context;
  const msg = formatMsg(intl);
  const {
    disabled, formData, required, editable, onSave,
  } = props;
  const trxModeProps = {
    outercol: 24,
    col: 8,
    field: 'trxn_mode',
    options: trxnMode.map(tm => ({
      value: tm.trx_mode,
      text: `${tm.trx_mode} | ${tm.trx_spec}`,
    })),
    label: msg('trxMode'),
    formData,
    rules: [{ required }],
    getFieldDecorator,
  };
  return (
    <Col span={6}>
      { editable ? <FormEditableItem type="select" onSave={onSave} {...trxModeProps} /> :
      <FormChildrenSearchSelect disabled={disabled} {...trxModeProps} />}
    </Col>
  );
      } }
    </DeclFormContext.Consumer>);
}

TradeMode.propTypes = {
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  formData: PropTypes.shape({ trxn_mode: PropTypes.string }).isRequired,
};

// 备案号
export function ManualNo(props) {
  return (
    <DeclFormContext.Consumer>
      {(context) => {
  const {
 intl, getFieldDecorator, bookList,
} = context;
  const msg = formatMsg(intl);
  const {
    disabled, formData,
  } = props;
  return (
    <Col span={6}>
      <FormItem
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        colon={false}
        label={msg('emsNo')}
      >
        {getFieldDecorator('manual_no', {
            initialValue: formData.manual_no,
            rules: [{ len: 12 }],
          })(<AutoComplete
            allowClear
            disabled={disabled}
            dataSource={bookList.map(bk => bk.blbook_no)}
            optionLabelProp="value"
            placeholder={msg('emsNo')}
            filterOption={(value, option) =>
              option.props.children.indexOf(value) !== -1}
          />)}
      </FormItem>
    </Col>
  );
      } }
    </DeclFormContext.Consumer>);
}
ManualNo.propTypes = {
  formData: PropTypes.shape({ trxn_mode: PropTypes.string }).isRequired,
  disabled: PropTypes.bool,
};

// 许可证号 v201807
export function LicenseAndStorage(props) {
  return (
    <DeclFormContext.Consumer>
      {(context) => {
  const {
    intl, getFieldDecorator, ietype,
  } = context;
  const msg = formatMsg(intl);
  const { disabled, formData } = props;
  const licenseNoProps = {
    outercol: 24,
    col: ietype === 'import' ? 8 : 4,
    field: 'license_no',
    label: msg('licenseNo'),
    disabled,
    formData,
    getFieldDecorator,
    rules: [{ max: 20 }],
  };
  const spProps = {
    outercol: 24,
    col: 8,
    field: 'storage_place',
    label: msg('storagePlace'),
    disabled,
    formData,
    getFieldDecorator,
    rules: [{ max: 100 }],
  };
  return ietype === 'import' ? (
    <Col span={12}>
      <Col span={12}>
        <FormInput {...licenseNoProps} />
      </Col>
      <Col span={12}>
        <FormInput {...spProps} />
      </Col>
    </Col>
  ) : (
    <Col span={12}>
      <FormInput {...licenseNoProps} />
    </Col>
  );
      } }
    </DeclFormContext.Consumer>);
}
LicenseAndStorage.propTypes = {
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  formData: PropTypes.shape({ license_no: PropTypes.string }).isRequired,
};

// 费用
function FeeFormItem(props) {
  const {
    feeField, currencyField, markField, label, disabled, formData,
    getFieldDecorator, currency, require, feeCurrReq, insurCurrReq, required,
    getFieldValue, editable, onSave, saveHeadLocal,
  } = props;
  let currReq = false;
  if (currencyField === 'fee_curr') {
    currReq = feeCurrReq && require;
  } else if (currencyField === 'insur_curr') {
    currReq = insurCurrReq && require;
  }
  let feeMarkUnits = CMS_FEE_UNIT;
  if (currencyField === 'other_curr' || currencyField === 'insur_curr') {
    feeMarkUnits = feeMarkUnits.filter(fmu => fmu.value !== '2');
  }
  const currDisable = getFieldValue(markField) === '1' || disabled;
  function handleMarkChange(value) {
    if (value === '1') { // 选择费率时置空币制
      saveHeadLocal({ [currencyField]: '' });
    }
  }
  const feeProps = {
    field: feeField,
    formData,
    rules: require ? [{ required, max: 19 }] : [{ required: false, max: 19 }],
    getFieldDecorator,
    noMarginBottom: true,
  };
  const currencyProps = {
    field: currencyField,
    options: renderV1V2Options(currency.map(curr => ({
      code: curr.curr_code,
      code_v1: curr.curr_code_v1,
      text: curr.curr_name,
    }))),
    formData,
    rules: currReq ? [{ required }] : [{ required: false }],
    getFieldDecorator,
    dropdownWidth: 220,
    noMarginBottom: true,
  };
  const markProps = {
    field: markField,
    formData,
    rules: require ? [{ required }] : [{ required: false }],
    getFieldDecorator,
    options: feeMarkUnits.map(fu => ({
      value: fu.value,
      text: `${fu.value} | ${fu.text}`,
    })),
    dropdownWidth: 200,
    noMarginBottom: true,
  };
  return (
    <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} colon={false} label={label}>
      <Row gutter={4}>
        <Col span={8}>
          {editable ? <FormEditableItem type="select" onSave={onSave} {...markProps} /> :
          <FormChildrenSearchSelect
            disabled={disabled}
            onChange={handleMarkChange}
            {...markProps}
          />}
        </Col>
        <Col span={8}>
          {editable ? <FormEditableItem onSave={onSave} {...feeProps} /> :
          <FormInput disabled={disabled} {...feeProps} />}
        </Col>
        <Col span={8}>
          {editable ? <FormEditableItem type="select" onSave={onSave} {...currencyProps} /> :
          <FormChildrenSearchSelect disabled={currDisable} {...currencyProps} />}
        </Col>
      </Row>
    </FormItem>
  );
}

FeeFormItem.propTypes = {
  feeField: PropTypes.string.isRequired,
  currencyField: PropTypes.string.isRequired,
  markField: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  formData: PropTypes.shape({}).isRequired,
  getFieldDecorator: PropTypes.func.isRequired,
};

export function Fee(props) {
  return (
    <DeclFormContext.Consumer>
      {(context) => {
  const {
    intl, getFieldValue, ietype, getFieldDecorator, formParams: { currency }, saveHeadLocal,
  } = context;
  const msg = formatMsg(intl);
  const fobRequire = (getFieldValue('trxn_mode') === '3' && ietype === 'import');
  const ciRequire = getFieldValue('trxn_mode') === '4';
  const feeCurrReq = getFieldValue('fee_mark') !== '1';
  const insurCurrReq = getFieldValue('insur_mark') !== '1';
  return (
    <Col span={18}>
      <Col span={8}>
        <FeeFormItem
          {...props}
          currency={currency}
          getFieldDecorator={getFieldDecorator}
          getFieldValue={getFieldValue}
          saveHeadLocal={saveHeadLocal}
          label={msg('freightCharge')}
          feeField="fee_rate"
          currencyField="fee_curr"
          markField="fee_mark"
          require={fobRequire || ciRequire}
          feeCurrReq={feeCurrReq}
        />
      </Col>
      <Col span={8}>
        <FeeFormItem
          {...props}
          currency={currency}
          getFieldDecorator={getFieldDecorator}
          getFieldValue={getFieldValue}
          saveHeadLocal={saveHeadLocal}
          label={msg('insurance')}
          feeField="insur_rate"
          currencyField="insur_curr"
          markField="insur_mark"
          require={fobRequire}
          insurCurrReq={insurCurrReq}
        />
      </Col>
      <Col span={8}>
        <FeeFormItem
          {...props}
          currency={currency}
          getFieldDecorator={getFieldDecorator}
          getFieldValue={getFieldValue}
          saveHeadLocal={saveHeadLocal}
          label={msg('sundry')}
          feeField="other_rate"
          currencyField="other_curr"
          markField="other_mark"
          require={false}
        />
      </Col>
    </Col>
  );
      } }
    </DeclFormContext.Consumer>);
}

Fee.propTypes = {
  disabled: PropTypes.bool,
  formData: PropTypes.shape({ fee_mark: PropTypes.string }).isRequired,
};

export function PackCountV201603(props) {
  return (
    <DeclFormContext.Consumer>
      {(context) => {
  const { getFieldDecorator, formParams, intl } = context;
  const msg = formatMsg(intl);
  const {
    disabled, formData,
    required, packTypeEditCell, packCountEditCell,
  } = props;
  let countFormItem = packCountEditCell;
  if (!countFormItem) {
    const countProps = {
      outercol: 24,
      col: 10,
      field: 'pack_count',
      label: msg('packCount'),
      disabled,
      formData,
      rules: [{ required }],
      getFieldDecorator,
    };
    countFormItem = <FormInput {...countProps} />;
  }
  let packFormItem = packTypeEditCell;
  if (!packFormItem) {
    const packProps = {
      outercol: 24,
      col: 10,
      label: msg('packType'),
      field: 'wrap_type',
      options: formParams.wrapType,
      disabled,
      formData,
      rules: [{ required }],
      getFieldDecorator,
    };
    packFormItem = <FormChildrenSearchSelect {...packProps} />;
  }
  return (
    <Col span={8}>
      <Col span={10}>
        {countFormItem}
      </Col>
      <Col span={14}>
        {packFormItem}
      </Col>
    </Col>
  );
      } }
    </DeclFormContext.Consumer>);
}

PackCountV201603.propTypes = {
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  formData: PropTypes.shape({ pack_count: PropTypes.number }).isRequired,
};

// 包装种类
export class PackType extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    formData: PropTypes.shape({ pack_count: PropTypes.number }).isRequired,
  }
  state = {
    visibleModal: false,
  }
  handleModalOpen = () => {
    this.setState({ visibleModal: true });
  }
  handleModalClose = () => {
    this.setState({ visibleModal: false });
  }
  render() {
    const {
      disabled, formData, required, fromTemplate,
    } = this.props;
    const { visibleModal } = this.state;
    return (
      <DeclFormContext.Consumer>
        {(context) => {
          const {
            getFieldDecorator, formParams, intl,
          } = context;
          const msg = formatMsg(intl);
            const packProps = {
              outercol: 24,
              col: fromTemplate ? 4 : 6,
              label: msg('packType'),
              field: 'wrap_type',
              options: formParams.wrapType,
              disabled,
              formData,
              rules: [{ required }],
              getFieldDecorator,
            };
          return (
            <Col span={12}>
              <Col span={fromTemplate ? 24 : 16}>
                <FormChildrenSearchSelect {...packProps} />
              </Col>
              {!fromTemplate &&
              <Col span={8} style={{ paddingLeft: 8 }}>
                <Button block onClick={this.handleModalOpen}>
                  {msg('otherPack')}<Icon type="ellipsis" />
                </Button>
                <OtherPackModal
                  msg={msg}
                  visible={visibleModal}
                  onModalClose={this.handleModalClose}
                  declInfo={{
                    delg_no: formData.delg_no,
                    pre_entry_seq_no: formData.pre_entry_seq_no,
                  }}
                  disabled={formData.pre_entry_seq_no ?
                      formData.status >= CMS_DECL_STATUS.sent.value : disabled}
                />
              </Col>}
            </Col>
          );
        } }
      </DeclFormContext.Consumer>);
  }
}

// 件数
export function PackCount(props) {
  return (
    <DeclFormContext.Consumer>
      {(context) => {
  const { getFieldDecorator, intl } = context;
  const msg = formatMsg(intl);
  const {
    disabled, formData, editable, onSave,
    required,
  } = props;
  const countProps = {
    outercol: 24,
    col: 8,
    field: 'pack_count',
    label: msg('packCount'),
    disabled: editable ? false : disabled,
    formData,
    rules: [{ required }],
    getFieldDecorator,
    noMarginBottom: true,
  };
  return editable ? <FormEditableItem onSave={onSave} {...countProps} />
    : <FormInput {...countProps} />;
      } }
    </DeclFormContext.Consumer>);
}

PackCount.propTypes = {
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  editable: PropTypes.bool,
  onSave: PropTypes.func,
  formData: PropTypes.shape({ pack_count: PropTypes.number }).isRequired,
};

// 重量
export function Weight(props) {
  return (
    <DeclFormContext.Consumer>
      {(context) => {
  const { intl, getFieldDecorator } = context;
  const {
    field, disabled, formData, editable, onSave,
  } = props;
  const label = formatMsg(intl)(DECL_LABEL_KEYS_BY_IEVERSION[field]);
  const wtProps = {
    label,
    field,
    outercol: 24,
    col: 8,
    addonAfter: 'KG',
    disabled: editable ? false : disabled,
    formData,
    getFieldDecorator,
  };
  return (
editable ? <FormEditableItem onSave={onSave} {...wtProps} /> :
<FormInput {...wtProps} />
  );
      } }
    </DeclFormContext.Consumer>);
}

Weight.propTypes = {
  field: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  formData: PropTypes.shape({ gross_wt: PropTypes.number }).isRequired,
};

// 标记唛码
export function MarkNo(props) {
  return (
    <DeclFormContext.Consumer>
      {(context) => {
        const { intl, getFieldDecorator } = context;
  const msg = formatMsg(intl);
  const {
    disabled, formData, editable, onSave,
  } = props;
  const markNoProps = {
    outercol: 24,
    col: 4,
    field: 'mark_note',
    label: msg('markNo'),
    disabled,
    formData,
    getFieldDecorator,
    // addonAfter: <Button type="primary" ghost size="small"
    // disabled={disabled}><Icon type="upload" /></Button>,
  };
  return (
    <Col span={12}>
      {editable ? <FormEditableItem onSave={onSave} {...markNoProps} />
        : <FormInput {...markNoProps} />}
    </Col>

  );
      } }
    </DeclFormContext.Consumer>);
}

// 备注
export function Remark(props) {
  return (
    <DeclFormContext.Consumer>
      {(context) => {
        const { intl, getFieldDecorator } = context;
  const msg = formatMsg(intl);
  const {
    disabled, formData, editable, onSave,
  } = props;
  const noteProps = {
    outercol: 24,
    col: 4,
    field: 'note',
    label: msg('remark'),
    disabled,
    formData,
    getFieldDecorator,
  };
  return (
    <Col span={12}>
      {editable ? <FormEditableItem type="textarea" onSave={onSave} {...noteProps} />
        : <FormInput {...noteProps} />}
    </Col>
  );
      } }
    </DeclFormContext.Consumer>);
}

// 特殊关系确认\价格影响确认\支付特许权使用费确认
export function TermConfirm(props) {
  return (
    <DeclFormContext.Consumer>
      {(context) => {
  const { intl, getFieldDecorator, cdfversion } = context;
  const msg = formatMsg(intl);
  const { disabled, formData } = props;
  const specialProps = {
    outercol: 24,
    col: 8,
    label: msg('specialRelation'),
    field: 'special_relation',
    disabled,
    formData,
    options: CMS_CONFIRM,
    getFieldDecorator,
  };
  const priceEffectProps = {
    outercol: 24,
    col: 8,
    label: msg('priceEffect'),
    field: 'price_effect',
    disabled,
    formData,
    getFieldDecorator,
    options: CMS_CONFIRM,
  };
  const paymentProps = {
    outercol: 24,
    col: 14,
    label: msg('paymentRoyalty'),
    field: 'payment_royalty',
    disabled,
    formData,
    getFieldDecorator,
    options: CMS_CONFIRM,
  };
  let wholeColumnSpan = 18;
  let sepColumnSpan = 8;
  if (cdfversion === 'v201603') {
    wholeColumnSpan = 24;
    sepColumnSpan = 6;
  }

  return (
    <Col span={wholeColumnSpan}>
      <Col span={sepColumnSpan}>
        <FormChildrenSearchSelect {...specialProps} />
      </Col>
      <Col span={sepColumnSpan}>
        <FormChildrenSearchSelect {...priceEffectProps} />
      </Col>
      <Col span={sepColumnSpan}>
        <FormChildrenSearchSelect {...paymentProps} />
      </Col>
    </Col>
  );
      } }
    </DeclFormContext.Consumer>);
}

TermConfirm.propTypes = {
  disabled: PropTypes.bool,
  formData: PropTypes.shape({ price_effect: PropTypes.string }).isRequired,
};

// 业务事项：自报自缴
export function CusRemark(props) {
  return (
    <DeclFormContext.Consumer>
      {(context) => {
        const {
 intl, getFieldDecorator, ietype, nonftz,
} = context;
  const { disabled, formData } = props;
let matterOpts = CMS_CUS_REMARK;
if (!nonftz) {
  matterOpts = matterOpts.filter(mao => mao.value !== '1' && mao.value !== '2');
}
if (ietype === 'import') {
  matterOpts = matterOpts.filter(mao => mao.value !== '3');
}
  const msg = formatMsg(intl);
const formDeclMatters = formData.decl_matters ? formData.decl_matters.split(',') : [];
  const selfDeclProps = {
    outercol: 24,
    col: 8,
    label: msg('cusRemark'),
    field: 'decl_matters',
    disabled,
    formData: { ...formData, decl_matters: formDeclMatters },
    getFieldDecorator,
    options: matterOpts,
    mode: 'multiple',
  };
  return (
    <Col span={6}>
      <FormChildrenSearchSelect {...selfDeclProps} />
    </Col>
  );
      } }
    </DeclFormContext.Consumer>);
}
CusRemark.propTypes = {
  disabled: PropTypes.bool,
  formData: PropTypes.shape({ decl_matters: PropTypes.string }).isRequired,
};

// 报关人员、证号、电话
export function DeclPersonnel(props) {
  return (
    <DeclFormContext.Consumer>
      {(context) => {
        const { intl, getFieldDecorator } = context;
  const msg = formatMsg(intl);
  const { disabled, formData, compact } = props;
  const nameProps = {
    outercol: 24,
    col: 8,
    field: 'decl_pensonnel_name',
    label: msg('declPersonnelName'),
    disabled,
    formData,
    getFieldDecorator,
  };
  const codeProps = {
    outercol: 24,
    col: 8,
    field: 'decl_pensonnel_code',
    label: msg('declPersonnelCode'),
    disabled,
    formData,
    getFieldDecorator,
  };
  const phoneProps = {
    outercol: 24,
    col: 8,
    field: 'decl_pensonnel_phone',
    label: msg('declPersonnelPhone'),
    disabled,
    formData,
    getFieldDecorator,
  };

  return compact ? <Col span={8}><FormInput {...nameProps} /></Col> : (
    <Col span={16}>
      <Col span={8}>
        <FormInput {...nameProps} />
      </Col>
      <Col span={8}>
        <FormInput {...codeProps} />
      </Col>
      <Col span={8}>
        <FormInput {...phoneProps} />
      </Col>
    </Col>
  );
      } }
    </DeclFormContext.Consumer>);
}
DeclPersonnel.propTypes = {
  disabled: PropTypes.bool,
  formData: PropTypes.shape({ decl_pensonnel_name: PropTypes.string }).isRequired,
  compact: PropTypes.bool,
};
// 关联报关单号 关联备案号
export function RaDeclManulNo(props) {
  return (
    <DeclFormContext.Consumer>
      {(context) => {
        const {
 intl, getFieldDecorator, setFieldsValue, saveHeadLocal,
} = context;
  const msg = formatMsg(intl);
  const { disabled, formData } = props;
  const raDeclNoProps = {
    outercol: 24,
    col: 8,
    field: 'ra_decl_no',
    label: msg('raDeclNo'),
    disabled,
    formData,
    getFieldDecorator,
    rules: [{ len: 18 }],
    fieldProps: {
 onChange: (ev) => {
   const declNo = ev.target.value;
      if (declNo && declNo.length === 18) {
        setFieldsValue({ correl_no: declNo });
        if (saveHeadLocal) {
        saveHeadLocal({ correl_no: declNo });
        }
      }
    },
},
  };
  const raManualNoProps = {
    outercol: 24,
    col: 8,
    field: 'ra_manual_no',
    label: msg('raManualNo'),
    disabled,
    formData,
    getFieldDecorator,
    rules: [{ len: 12 }],
  };

  return (
    <Col span={12}>
      <Col span={12}>
        <FormInput {...raDeclNoProps} />
      </Col>
      <Col span={12}>
        <FormInput {...raManualNoProps} />
      </Col>
    </Col>
  );
      } }
    </DeclFormContext.Consumer>);
}

RaDeclManulNo.propTypes = {
  disabled: PropTypes.bool,
  formData: PropTypes.shape({ ra_decl_no: PropTypes.string }).isRequired,
};

// 保税/监管场所 货场代码
export function StoreYard(props) {
  return (
    <DeclFormContext.Consumer>
      {(context) => {
        const { intl, getFieldDecorator } = context;
  const msg = formatMsg(intl);
  const { disabled, formData } = props;
  const storeProps = {
    outercol: 24,
    col: 8,
    field: 'store_no',
    label: msg('storeNo'),
    disabled,
    formData,
    getFieldDecorator,
    rules: [{ max: 10 }],
  };
  const yardProps = {
    outercol: 24,
    col: 8,
    field: 'yard_code',
    label: msg('yardCode'),
    disabled,
    formData,
    getFieldDecorator,
    rules: [{ len: 4 }],
  };
  return (
    <Col span={12}>
      <Col span={12}>
        <FormInput {...storeProps} />
      </Col>
      <Col span={12}>
        <FormInput {...yardProps} />
      </Col>
    </Col>
  );
      } }
    </DeclFormContext.Consumer>);
}

StoreYard.propTypes = {
  disabled: PropTypes.bool,
  formData: PropTypes.shape({ store_no: PropTypes.string }).isRequired,
};

export function CiqOrgs(props) {
  return (
    <DeclFormContext.Consumer>
      {(context) => {
        const { intl, getFieldDecorator, formParams } = context;
  const msg = formatMsg(intl);
  const { disabled, formData } = props;
        const orgOptions = formParams.ciqOrganization.map(co => ({
      value: co.org_code,
      text: `${co.org_code}|${co.org_name}`,
    }));
  const ciqOrgProps = {
    outercol: 24,
    col: 10,
    field: 'ciq_orgcode',
    label: msg('orgCode'),
    disabled,
    formData,
    options: orgOptions,
    getFieldDecorator,
  };
  const vsaOrgProps = {
    outercol: 24,
    col: 10,
    field: 'vsa_orgcode',
    label: msg('vsaOrgCode'),
    disabled,
    formData,
    options: orgOptions,
    getFieldDecorator,
  };
  const inspOrgProps = {
    outercol: 24,
    col: 10,
    field: 'insp_orgcode',
    label: msg('inspOrgCode'),
    disabled,
    formData,
    options: orgOptions,
    getFieldDecorator,
  };
  const purpOrgProps = {
    outercol: 24,
    col: 10,
    field: 'purp_orgcode',
    label: msg('purpOrgCode'),
    disabled,
    formData,
    options: orgOptions,
    getFieldDecorator,
  };
  return (
    <Row>
      <Col span={6}>
        <FormControlSearchSelect {...ciqOrgProps} />
      </Col>
      <Col span={6}>
        <FormControlSearchSelect {...vsaOrgProps} />
      </Col>
      <Col span={6}>
        <FormControlSearchSelect {...inspOrgProps} />
      </Col>
      <Col span={6}>
        <FormControlSearchSelect {...purpOrgProps} />
      </Col>
    </Row>
  );
      } }
    </DeclFormContext.Consumer>);
}
CiqOrgs.propTypes = {
  disabled: PropTypes.bool,
  formData: PropTypes.shape({ insp_orgcode: PropTypes.string }).isRequired,
};

export class QualifSpecCorrel extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    formData: PropTypes.shape({ special_decl_flag: PropTypes.string }).isRequired,
  }
  state = {
    visibleModal: false,
    entQualifs: [],
    activeIndex: 0,
  }
  handleModalOpen = () => {
    this.setState({ visibleModal: true });
  }
  render() {
    const { disabled, formData, fromTemplate } = this.props;
    const { visibleModal, entQualifs, activeIndex } = this.state;
    return (
      <DeclFormContext.Consumer>
        {(context) => {
          const {
          intl, getFieldDecorator, getFieldValue, setFieldsValue, ietype,
          } = context;
          const CIQ_ENT_QUALIF_TYPE = ietype === 'import' ? CIQ_ENT_QUALIF_TYPE_I : CIQ_ENT_QUALIF_TYPE_E;
          function renderEntQualif(entType) {
            const qualif = CIQ_ENT_QUALIF_TYPE.find(type => type.value === entType);
            return qualif ? `${qualif.value} | ${qualif.text}` : entType;
          }
          const handleSelect = (index) => {
            this.setState({
              activeIndex: index,
            });
            const entQualif = entQualifs[index];
            if (entQualif) {
              setFieldsValue({ ent_qualif_type: renderEntQualif(entQualif.ent_qualif_type_code) });
            }
          };
          const handlePrevEntQualif = () => {
            const index = activeIndex > 0 ? activeIndex - 1 : (entQualifs.length - 1);
            handleSelect(index);
          };
          const handleNextEntQualif = () => {
            const index = activeIndex < (entQualifs.length - 1) ? activeIndex + 1 : 0;
            handleSelect(index);
          };
          const entQualifModalDisable = formData.pre_entry_seq_no ?
            formData.status >= CMS_DECL_STATUS.sent.value : disabled;
          const handleModalChange = (newEntQualifs) => {
            this.setState({ entQualifs: newEntQualifs });
            if (newEntQualifs.length) {
              const entType = newEntQualifs[newEntQualifs.length - 1].ent_qualif_type_code;
              const newVal = renderEntQualif(entType);
              setFieldsValue({ ent_qualif_type: newVal });
            }
          };
          const onModalClose = (newEntQualifs) => {
            if (!entQualifModalDisable) {
            handleModalChange(newEntQualifs);
            }
            this.setState({
              visibleModal: false,
            });
          };
          const msg = formatMsg(intl);
          const qualifProps = {
            outercol: 24,
            col: 10,
            field: 'ent_qualif_type',
            label: msg('entQualif'),
            formData,
            readOnly: true,
            getFieldDecorator,
            addonAfter: fromTemplate ? null : (<ButtonGroup size="small">
              <Button onClick={handlePrevEntQualif}><Icon type="left" /></Button>
              <Button onClick={handleNextEntQualif}><Icon type="right" /></Button>
              <Button onClick={this.handleModalOpen}><Icon type="ellipsis" /></Button>
            </ButtonGroup>),
          };
          const specDecFormData = { spec_decl_flag: formData.spec_decl_flag ? formData.spec_decl_flag.split(',') : [] };
          const specDeclProps = {
            outercol: 24,
            col: 10,
            field: 'spec_decl_flag',
            label: msg('specDeclFlag'),
            disabled,
            formData: specDecFormData,
            options: CIQ_SPECIAL_DECL_FLAGS,
            getFieldDecorator,
            mode: 'multiple',
          };
          const correlNoProps = {
            outercol: 24,
            col: 10,
            field: 'correl_no',
            label: msg('correlNo'),
            disabled: fromTemplate ? true : disabled,
            formData,
            getFieldDecorator,
          };
          const correlNo = getFieldValue('correl_no') || formData.correl_no;
          const correlReasonProps = {
            outercol: 24,
            col: 10,
            field: 'correl_reason_flag',
            label: msg('correlReasonFlag'),
            disabled,
            formData,
            options: CIQ_CORREL_REASONS,
            getFieldDecorator,
            rules: [{ required: !!correlNo }],
          };
          return (
            <Row>
              <Col span={6}>
                <FormInput {...qualifProps} />
              </Col>
              <Col span={6}>
                <FormChildrenSearchSelect {...specDeclProps} />
              </Col>
              <Col span={6}>
                <FormInput {...correlNoProps} />
              </Col>
              <Col span={6}>
                <FormChildrenSearchSelect {...correlReasonProps} />
              </Col>
              <EntQualifyModal
                msg={msg}
                ietype={ietype}
                visible={visibleModal}
                onModalClose={onModalClose}
                onModalChanged={handleModalChange}
                declInfo={{
                  delg_no: formData.delg_no,
                  pre_entry_seq_no: formData.pre_entry_seq_no,
                }}
                disabled={entQualifModalDisable}
              />
            </Row>
          );
        } }
      </DeclFormContext.Consumer>);
  }
}

export class ApplCertUser extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    formData: PropTypes.shape({
      appl_cert: PropTypes.string,
      depart_date: PropTypes.string,
      bl_wb_no: PropTypes.string,
      orig_box_flag: PropTypes.string,
    }),
  }
  state = {
    visibleUserListModal: false,
    visibleApplCertModal: false,
  }
  handleUserListModalOpen = () => {
    this.setState({ visibleUserListModal: true });
  }
  handleUserListModalClose = () => {
    this.setState({ visibleUserListModal: false });
  }
  handleApplCertModalOpen = () => {
    this.setState({ visibleApplCertModal: true });
  }
  render() {
    const { disabled, formData, fromTemplate } = this.props;
    const { visibleUserListModal, visibleApplCertModal } = this.state;
    return (
      <DeclFormContext.Consumer>
        {(context) => {
          const {
            intl, getFieldDecorator, setFieldsValue, ietype,
          } = context;
          const applCertModalDisable = formData.pre_entry_seq_no ?
            formData.status >= CMS_DECL_STATUS.sent.value : disabled;
          const onApplCertModalClose = (newVal) => {
            this.setState({ visibleApplCertModal: false });
            if (!applCertModalDisable) {
            setFieldsValue({ appl_cert: newVal });
            }
          };
          const onApplCertChanged = (applcertText) => {
            setFieldsValue({ appl_cert: applcertText });
          };
          const msg = formatMsg(intl);
          const applcertProps = {
            outercol: 24,
            col: ietype === 'import' ? 10 : 2,
            field: 'appl_cert',
            label: msg('applCert'),
            readOnly: true,
            formData,
            getFieldDecorator,
            addonAfter: fromTemplate ? null : <Button size="small" onClick={this.handleApplCertModalOpen}><Icon type="ellipsis" /></Button>,
          };
          const deptProps = {
            outercol: 24,
            col: 10,
            field: 'depart_date',
            label: msg('departDate'),
            disabled,
            formData,
            getFieldDecorator,
          };
          const blnoProps = {
            outercol: 24,
            col: 10,
            field: 'swb_no',
            label: msg('BLno'),
            disabled,
            formData,
            getFieldDecorator,
          };
          const originBoxProps = {
            outercol: 24,
            col: 10,
            field: 'orig_box_flag',
            label: msg('originBox'),
            disabled,
            formData,
            options: CMS_CONFIRM,
            getFieldDecorator,
          };
          return (
            <Row>
              <Col span={ietype === 'import' ? 6 : 24}>
                <FormInput {...applcertProps} />
              </Col>
              {ietype === 'import' &&
              <Col span={6}>
                <FormDatePicker {...deptProps} />
              </Col>}
              {ietype === 'import' &&
              <Col span={6}>
                <FormInput {...blnoProps} />
              </Col>}
              {ietype === 'import' &&
              <Col span={fromTemplate ? 6 : 4}>
                <FormChildrenSearchSelect {...originBoxProps} />
              </Col>}
              {!fromTemplate && ietype === 'import' &&
              <Col span={2} style={{ paddingLeft: 8 }}>
                <Button block onClick={this.handleUserListModalOpen}>{msg('declUser')}<Icon type="ellipsis" /></Button>
                <CiqUserListModal
                  msg={msg}
                  visible={visibleUserListModal}
                  onModalClose={this.handleUserListModalClose}
                  declInfo={{
                    delg_no: formData.delg_no,
                    pre_entry_seq_no: formData.pre_entry_seq_no,
                  }}
                  disabled={formData.pre_entry_seq_no ?
                      formData.status >= CMS_DECL_STATUS.sent.value : disabled}
                />
              </Col>}
              <CiqApplCertModal
                msg={msg}
                visible={visibleApplCertModal}
                onModalClose={onApplCertModalClose}
                onModalChanged={onApplCertChanged}
                declInfo={{
                    delg_no: formData.delg_no,
                    pre_entry_seq_no: formData.pre_entry_seq_no,
                    ietype,
                    oversea_entity_addr: formData.oversea_entity_addr,
                    oversea_entity_cname: formData.oversea_entity_cname,
                    trader_name_en: formData.trader_name_en,
                    complete_discharge_date: formData.complete_discharge_date,
                  }}
                getFieldDecorator={getFieldDecorator}
                disabled={applCertModalDisable}
              />
            </Row>
          );
        }
      }
      </DeclFormContext.Consumer>);
  }
}

// 许可证号 v201603
export function LicenseNo(props) {
  return (
    <DeclFormContext.Consumer>
      {(context) => {
        const { intl, getFieldDecorator } = context;
  const msg = formatMsg(intl);
  const { disabled, formData } = props;
  const licenseNoProps = {
    outercol: 24,
    col: 8,
    field: 'license_no',
    label: msg('licenseNo'),
    disabled,
    formData,
    getFieldDecorator,
  };
  return (
    <FormInput {...licenseNoProps} />
  );
      } }
    </DeclFormContext.Consumer>);
}
LicenseNo.propTypes = {
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  formData: PropTypes.shape({ license_no: PropTypes.string }).isRequired,
};

// 贸易国、起运国、装卸货港、境内目的地 v201603
export function CountryAttr(props) {
  return (
    <DeclFormContext.Consumer>
      {(context) => {
        const {
intl, ietype, formParams: { country, port, district }, getFieldDecorator,
} = context;
  const msg = formatMsg(intl);
  const {
    disabled, formData, onSearch, required,
  } = props;
        const countryOpts = country.map(tc => ({
      value: tc.cntry_co,
      text: `${tc.cntry_co} | ${tc.cntry_name_cn}`,
    }));
  const tradeCountryProps = {
    outercol: 24,
    col: 5,
    field: 'trade_country',
    options: countryOpts,
    label: msg('tradeCountry'),
    disabled,
    formData,
    rules: [{ required }],
    getFieldDecorator,
    dropdownWidth: 240,
  };
  const departCountryProps = {
    outercol: 24,
    col: 8,
    field: 'dept_dest_country',
    options: countryOpts,
    label: ietype === 'import' ? msg('departCountry') : msg('destinateCountry'),
    disabled,
    formData,
    rules: [{ required }],
    getFieldDecorator,
    dropdownWidth: 240,
  };
  const destPortProps = {
    outercol: 24,
    col: 8,
    field: 'dept_dest_port',
    options: port.map(pt => ({
      value: pt.port_code,
      text: `${pt.port_code} | ${pt.port_c_cod}`,
    })),
    label: ietype === 'import' ? msg('iDestinatePort') : msg('eDestinatePort'),
    rules: [{ required }],
    disabled,
    formData,
    getFieldDecorator,
    onSearch,
    dropdownWidth: 240,
  };
  const districtProps = {
    outercol: 24,
    col: 8,
    field: 'district_code',
    options: district.map(dist => ({
      value: dist.district_code,
      text: `${dist.district_code} | ${dist.district_name}`,
    })),
    label: ietype === 'import' ? msg('iDistrict') : msg('eDistrict'),
    rules: [{ required }],
    disabled,
    formData,
    getFieldDecorator,
    dropdownWidth: 240,
  };
  return (
    <Row>
      <Col span={8}>
        <FormChildrenSearchSelect {...tradeCountryProps} />
      </Col>
      <Col span={16}>
        <Col span={8}>
          <FormChildrenSearchSelect {...departCountryProps} />
        </Col>
        <Col span={8}>
          <FormControlSearchSelect {...destPortProps} />
        </Col>
        <Col span={8}>
          <FormChildrenSearchSelect {...districtProps} />
        </Col>
      </Col>
    </Row>
  );
      } }
    </DeclFormContext.Consumer>);
}

CountryAttr.propTypes = {
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  formData: PropTypes.shape({ district_code: PropTypes.string }).isRequired,
  formRequire: PropTypes.shape({}).isRequired,
};

// 集装箱号 v201603
export function ContainerNo(props) {
  return (
    <DeclFormContext.Consumer>
      {(context) => {
  const { getFieldDecorator, intl } = context;
  const msg = formatMsg(intl);
  const { disabled, formData } = props;
  const containerNoProps = {
    outercol: 24,
    col: 5,
    field: 'container_no',
    label: msg('containerNo'),
    disabled,
    formData,
    getFieldDecorator,
  };
  return (
    <FormInput {...containerNoProps} />
  );
      } }
    </DeclFormContext.Consumer>);
}

ContainerNo.propTypes = {
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  formData: PropTypes.shape({ container_no: PropTypes.string }).isRequired,
};

// 监管方式/征免性质/备案号
export function TradeRemissionV201603(props) {
  return (
    <DeclFormContext.Consumer>
      {(context) => {
  const {
    getFieldDecorator, formParams: { tradeMode, remissionMode }, intl, bookList,
  } = context;
  const msg = formatMsg(intl);
  const {
    disabled, formData, required,
  } = props;
  const tradeModeProps = {
    outercol: 24,
    col: 8,
    field: 'trade_mode',
    options: tradeMode.map(tm => ({
      value: tm.trade_mode,
      text: `${tm.trade_mode} | ${tm.trade_abbr}`,
    })),
    label: msg('tradeMode'),
    rules: [{ required }],
    disabled,
    formData,
    getFieldDecorator,
  };
  // const declWay = formData.decl_way_code !== '0102' && formData.decl_way_code !== '0103';
  const remissionProps = {
    outercol: 24,
    col: 8,
    field: 'cut_mode',
    options: remissionMode.map(rm => ({
      value: rm.rm_mode,
      text: `${rm.rm_mode} | ${rm.rm_abbr}`,
    })),
    // rules: declWay ? [{ required }] : [{ required: false }],
    required: false,
    label: msg('rmModeName'),
    disabled,
    formData,
    getFieldDecorator,
  };
  return (
    <Col span={16}>
      <Col span={8}>
        <FormChildrenSearchSelect {...tradeModeProps} />
      </Col>
      <Col span={8}>
        <FormChildrenSearchSelect {...remissionProps} />
      </Col>
      <Col span={8}>
        <FormItem
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          colon={false}
          label={msg('emsNo')}
        >
          {getFieldDecorator('manual_no', {
              initialValue: formData.manual_no,
              rules: [{ len: 12 }],
            })(<AutoComplete
              allowClear
              disabled={disabled}
              dataSource={bookList.map(bk => bk.blbook_no)}
              optionLabelProp="value"
              placeholder={msg('emsNo')}
              dropdownMatchSelectWidth={false}
              dropdownStyle={{ width: 360 }}
              filterOption={(value, option) =>
                option.props.children.indexOf(value) !== -1}
            />)}
        </FormItem>
      </Col>
    </Col>
  );
      } }
    </DeclFormContext.Consumer>);
}
TradeRemissionV201603.propTypes = {
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  formData: PropTypes.shape({ cut_mode: PropTypes.string }).isRequired,
  formRequire: PropTypes.shape({}).isRequired,
};
