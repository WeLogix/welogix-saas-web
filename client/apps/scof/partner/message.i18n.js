import { defineMessages } from 'react-intl';
import { formati18n } from 'client/common/i18n/helpers';
import globalMessages from 'client/common/root.i18n';
import moduleMessages from '../message.i18n';

const messages = defineMessages({
  partnerSearchPlaceholder: {
    id: 'sof.partner.search.placeholder',
    defaultMessage: '搜索名称/代码/海关编码/统一信用代码',
  },
  addToServiceTeam: {
    id: 'sof.customer.addto.serviceteam',
    defaultMessage: '添加团队成员',
  },
  allMembers: {
    id: 'sof.customer.all.members',
    defaultMessage: '所有成员',
  },
  customerName: {
    id: 'sof.partner.customers.name',
    defaultMessage: '客户名称',
  },
  customerCode: {
    id: 'sof.partner.customers.code',
    defaultMessage: '客户代码',
  },
  serviceTeam: {
    id: 'sof.partner.customers.service.team',
    defaultMessage: '协作团队',
  },
  batchImportCustomers: {
    id: 'sof.partner.customers.batch.import',
    defaultMessage: '批量导入客户',
  },
  supplier: {
    id: 'sof.partner.supplier',
    defaultMessage: '供应商',
  },
  supplierName: {
    id: 'sof.partner.supplier.name',
    defaultMessage: '供应商名称',
  },
  supplierCode: {
    id: 'sof.partner.supplier.code',
    defaultMessage: '供应商代码',
  },
  batchImportSuppliers: {
    id: 'sof.partner.supplier.batch.import',
    defaultMessage: '批量导入供应商',
  },
  vendor: {
    id: 'sof.partner.vendor',
    defaultMessage: '服务商',
  },
  vendorName: {
    id: 'sof.partner.vendors.name',
    defaultMessage: '服务商名称',
  },
  vendorCode: {
    id: 'sof.partner.vendors.code',
    defaultMessage: '服务商代码',
  },
  batchImportVendors: {
    id: 'sof.partner.vendors.batch.import',
    defaultMessage: '批量导入服务商',
  },
  displayName: {
    id: 'sof.partner.display.name',
    defaultMessage: '企业简称',
  },
  englishName: {
    id: 'sof.partner.english.name',
    defaultMessage: '英文名称',
  },
  profile: {
    id: 'sof.partner.profile',
    defaultMessage: '资料',
  },
  businessInfo: {
    id: 'sof.partner.business.info',
    defaultMessage: '工商信息',
  },
  businessType: {
    id: 'sof.partner.business.type',
    defaultMessage: '业务类型',
  },
  contact: {
    id: 'sof.partner.contact',
    defaultMessage: '联系人',
  },
  phone: {
    id: 'sof.partner.phone',
    defaultMessage: '电话',
  },
  email: {
    id: 'sof.partner.email',
    defaultMessage: '邮箱',
  },
  country: {
    id: 'sof.partner.country',
    defaultMessage: '国家/地区',
  },
  phCountry: {
    id: 'sof.partner.ph.country',
    defaultMessage: 'CHN 中国',
  },
  unknownCountry: {
    id: 'sof.partner.unknown.country',
    defaultMessage: '国(地)别不详',
  },
  uniqueCode: {
    id: 'sof.partner.unique.code',
    defaultMessage: '唯一识别代码',
  },
  uscCode: {
    id: 'sof.partner.usc.code',
    defaultMessage: '统一社会信用代码',
  },
  addonCode: {
    id: 'sof.partner.addon.code',
    defaultMessage: '附加码',
  },
  customsCode: {
    id: 'sof.partner.customs.code',
    defaultMessage: '海关编码',
  },
  customsCredit: {
    id: 'sof.partner.customs.credit',
    defaultMessage: '海关信用',
  },
  internalId: {
    id: 'sof.partner.id',
    defaultMessage: '合作ID',
  },
  uniqueCodeDuplicated: {
    id: 'sof.partner.unique.code.duplicated',
    defaultMessage: '已存在的唯一识别代码',
  },
  partnerNameRequired: {
    id: 'sof.partner.name.required',
    defaultMessage: '企业名称必填',
  },
  uscCode18len: {
    id: 'sof.partner.scccode.len18',
    defaultMessage: '18位统一社会信用代码',
  },
  customsCode10len: {
    id: 'sof.partner.customs.code.len10',
    defaultMessage: '10位海关编码',
  },
  qichachaCorpSearch: {
    id: 'sof.partner.qichacha.search',
    defaultMessage: '输入企业名称搜索',
  },
  qichachaFoundCorp: {
    id: 'sof.partner.qichacha.found',
    defaultMessage: '已找到企业信息',
  },
  partnerBusinessTypeRequired: {
    id: 'sof.vendor.busitype.required',
    defaultMessage: '请选择服务商业务类型',
  },
  virtualWhse: {
    id: 'sof.partner.customers.virtual.whse',
    defaultMessage: '库别',
  },
  remark: {
    id: 'sof.partner.customers.remark',
    defaultMessage: '备注',
  },
  contacterName: {
    id: 'sof.partner.contacters.name',
    defaultMessage: '联系人姓名',
  },
  company: {
    id: 'sof.partner.contacters.company',
    defaultMessage: '所属公司',
  },
  department: {
    id: 'sof.partner.contacters.department',
    defaultMessage: '部门',
  },
  position: {
    id: 'sof.partner.contacters.position',
    defaultMessage: '职务',
  },
  cellphoneNum: {
    id: 'sof.partner.contacters.cellphonenum',
    defaultMessage: '手机号码',
  },
  fax: {
    id: 'sof.partner.contacters.fax',
    defaultMessage: '传真',
  },
  batchImportContacters: {
    id: 'sof.partner.contacters.batch.import',
    defaultMessage: '批量导入联系人',
  },
});

export default messages;
export const formatMsg = formati18n({ ...globalMessages, ...moduleMessages, ...messages });
