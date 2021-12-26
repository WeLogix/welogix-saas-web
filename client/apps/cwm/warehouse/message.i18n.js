import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';

const messages = defineMessages({
  warehouse: {
    id: 'cwm.settings.warehouse',
    defaultMessage: '仓库',
  },
  warehouseName: {
    id: 'cwm.settings.warehouse.name',
    defaultMessage: '仓库名称',
  },
  warehouseCode: {
    id: 'cwm.settings.warehouse.code',
    defaultMessage: '仓库代码',
  },
  warehouseMode: {
    id: 'cwm.settings.warehouse.mode',
    defaultMessage: '运营模式',
  },
  pivateMode: {
    id: 'cwm.settings.warehouse.pivate',
    defaultMessage: '自营仓库',
  },
  publicMode: {
    id: 'cwm.settings.warehouse.public',
    defaultMessage: '公共仓库',
  },
  supevsionAttr: {
    id: 'cwm.settings.warehouse.supevsionAttr',
    defaultMessage: '监管属性',
  },
  supevsionTrue: {
    id: 'cwm.settings.warehouse.supevsionTrue',
    defaultMessage: '非监管',
  },
  supevsionFalse: {
    id: 'cwm.settings.warehouse.supevsionFalse',
    defaultMessage: '海关监管',
  },
  enterPrise: {
    id: 'cwm.settings.warehouse.enterPrise',
    defaultMessage: '经营企业',
  },
  warehouseAddress: {
    id: 'cwm.settings.warehouse.address',
    defaultMessage: '仓库地址',
  },
  pleaseInputWarehouseAddress: {
    id: 'cwm.settings.warehouse.input.address',
    defaultMessage: '请输入仓库地址',
  },
  detailedAddress: {
    id: 'cwm.settings.warehouse.detailed.address',
    defaultMessage: '详细地址（街道、门牌号、楼层）',
  },
  warehouseContact: {
    id: 'cwm.settings.warehouse.contact',
    defaultMessage: '联系人',
  },
  warehousePhone: {
    id: 'cwm.settings.warehouse.phone',
    defaultMessage: '联系电话',
  },
  isBonded: {
    id: 'cwm.settings.warehouse.bonded',
    defaultMessage: '保税仓',
  },
  warehouseLocation: {
    id: 'cwm.settings.warehouse.location',
    defaultMessage: '位置',
  },
  warehousePlaceholder: {
    id: 'cwm.settings.warehouse.wh.placeholder',
    defaultMessage: '仓库查找',
  },
  locationPh: {
    id: 'cwm.settings.warehouse.location.placeholder',
    defaultMessage: '库位编码',
  },
  whseNameRequired: {
    id: 'cwm.settings.warehouse.basic.name',
    defaultMessage: '请输入仓库名称',
  },
  whseModeRequired: {
    id: 'cwm.settings.warehouse.basic.mode',
    defaultMessage: '请选择运营模式',
  },
  whseBonedRequired: {
    id: 'cwm.settings.warehouse.basic.boned',
    defaultMessage: '请选择监管属性',
  },
  whseEditSuccess: {
    id: 'cwm.settings.warehouse.basic.success',
    defaultMessage: '编辑仓库成功',
  },
  bwlType: {
    id: 'cwm.settings.warehouse.bwl.type',
    defaultMessage: '区域场所类别',
  },
  ftzWhseCode: {
    id: 'cwm.settings.warehouse.ftz.code',
    defaultMessage: '仓库备案代码',
  },
  customsCode: {
    id: 'cwm.settings.warehouse.customs.code',
    defaultMessage: '主管海关',
  },
  supervisionSystem: {
    id: 'cwm.settings.warehouse.supervision.system',
    defaultMessage: '监管系统类型',
  },
  supSystemTypeSelect: {
    id: 'cwm.settings.warehouse.supervision.system.type.select',
    defaultMessage: '请选择海关监管系统类型',
  },
  integrationAppId: {
    id: 'cwm.settings.warehouse.integration.appId.select',
    defaultMessage: '监管系统接口',
  },
  pleaseSelectCustomsCode: {
    id: 'cwm.settings.warehouse.pleaseselect.customsCode',
    defaultMessage: '请选择主管海关',
  },
  pleaseInputftzWhseCode: {
    id: 'cwm.settings.warehouse.pleaseinput.ftzWhseCode',
    defaultMessage: '请填写仓库备案代码',
  },
  pleaseInputWhseCode: {
    id: 'cwm.settings.warehouse.pleaseinput.WhseCode',
    defaultMessage: '请填写仓库代码',
  },
  pleaseSelectBwlType: {
    id: 'cwm.settings.warehouse.pleaseSelect.bwlType',
    defaultMessage: '请选择区域场所类别',
  },
  pleaseSelectFtzType: {
    id: 'cwm.settings.warehouse.pleaseSelect.ftzType',
    defaultMessage: '请选择辅助监管系统',
  },
  pleaseInputBwlNo: {
    id: 'cwm.settings.warehouse.pleaseinput.bwlNo',
    defaultMessage: '请填写账册号',
  },
  pleaseSelectBlbookType: {
    id: 'cwm.settings.warehouse.pleaseSelect.blbookType',
    defaultMessage: '请选择账册类型',
  },
  newUnRecBlbook: {
    id: 'cwm.settings.warehouse.wizard.newUnRecBlbook',
    defaultMessage: '新建未备案账册',
  },
  newRecBlbook: {
    id: 'cwm.settings.warehouse.wizard.newRecBlbook',
    defaultMessage: '添加已备案账册',
  },
  nextStep: {
    id: 'cwm.settings.warehouse.wizard.nextStep',
    defaultMessage: '下一步',
  },
  addWhse: {
    id: 'cwm.settings.warehouse.wizard.addWhse',
    defaultMessage: '添加仓库',
  },
  bwlNo: {
    id: 'cwm.settings.warehouse.wizard.bwlNo',
    defaultMessage: '账册号',
  },
  blbookType: {
    id: 'cwm.settings.warehouse.wizard.blbookType',
    defaultMessage: '账册类型',
  },
  basicInfo: {
    id: 'cwm.settings.warehouse.wizard.basicInfo',
    defaultMessage: '基本信息',
  },
  relateBlbook: {
    id: 'cwm.settings.warehouse.wizard.relate.blbook',
    defaultMessage: '关联账册',
  },
  ownerCusCode: {
    id: 'cwm.settings.warehouse.wizard.owner',
    defaultMessage: '经营单位',
  },
  name: {
    id: 'cwm.settings.warehouse.partners.name',
    defaultMessage: '名称',
  },
  code: {
    id: 'cwm.settings.warehouse.partners.code',
    defaultMessage: '代码',
  },
  customs: {
    id: 'cwm.settings.warehouse.partners.customs',
    defaultMessage: '海关编码',
  },
  ftzWhseCodeCustomCode: {
    id: 'cwm.settings.warehouse.partners.ftzWhseCodeCustomCode',
    defaultMessage: '发货仓库海关编码',
  },
  relatedOwner: {
    id: 'cwm.settings.warehouse.partners.relatedOwner',
    defaultMessage: '关联货主',
  },
  region: {
    id: 'cwm.settings.warehouse.partners.region',
    defaultMessage: '地区',
  },
  address: {
    id: 'cwm.settings.warehouse.partners.address',
    defaultMessage: '详细地址',
  },
  postCode: {
    id: 'cwm.settings.warehouse.partners.postCode',
    defaultMessage: '邮政编码',
  },
  contact: {
    id: 'cwm.settings.warehouse.partners.contact',
    defaultMessage: '联系人',
  },
  phone: {
    id: 'cwm.settings.warehouse.partners.phone',
    defaultMessage: '手机',
  },
  number: {
    id: 'cwm.settings.warehouse.partners.number',
    defaultMessage: '电话',
  },
  zoneCode: {
    id: 'cwm.settings.warehouse.zone.code',
    defaultMessage: '库区代码',
  },
  zoneName: {
    id: 'cwm.settings.warehouse.zone.name',
    defaultMessage: '库区名称',
  },
  locationCode: {
    id: 'cwm.settings.warehouse.location.code',
    defaultMessage: '库位编号',
  },
  locationType: {
    id: 'cwm.settings.warehouse.location.type',
    defaultMessage: '库位类型',
  },
  locationStatus: {
    id: 'cwm.settings.warehouse.location.status',
    defaultMessage: '库位状态',
  },
  createZone: {
    id: 'cwm.settings.warehouse.create.zone',
    defaultMessage: '新建库区',
  },
  editZone: {
    id: 'cwm.settings.warehouse.edit.zone',
    defaultMessage: '编辑库区',
  },
  deleteZone: {
    id: 'cwm.settings.warehouse.delete.zone',
    defaultMessage: '删除库区',
  },
  createLocation: {
    id: 'cwm.settings.warehouse.create.location',
    defaultMessage: '新建库位',
  },
  exportLocations: {
    id: 'cwm.settings.warehouse.export.locations',
    defaultMessage: '导出库位',
  },
  addProductNo: {
    id: 'cwm.settings.warehouse.locations.add.product.no',
    defaultMessage: '添加货号',
  },
  emptyProducNoOrCapacity: {
    id: 'cwm.settings.warehouse.locations.empty.produc.no.or.capacity',
    defaultMessage: '存在空货号或空容量',
  },
  duplicateProductNo: {
    id: 'cwm.settings.warehouse.locations.duplicate.product.no',
    defaultMessage: '出现重复的货号',
  },
  capacityShouldBePositive: {
    id: 'cwm.settings.warehouse.locations.capacity.should.be.positive',
    defaultMessage: '库存须为正数',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...messages });
