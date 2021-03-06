export const CIQ_CORREL_REASONS = [
  { text: '通关单超过有效期', value: '1' },
  { text: '换证凭单/条超过有效期', value: '2' },
  { text: '进口复出口', value: '3' },
  { text: '出口复进口', value: '4' },
  { text: '出境预检', value: '5' },
  { text: '登检换证', value: '6' },
  { text: '与其它报检批拼箱', value: '7' },
  { text: '保税出库', value: '8' },
  { text: '进口车辆换证', value: '9' }];

export const CIQ_SPECIAL_DECL_FLAGS = [
  { value: '1', text: '国际赛事' },
  { value: '2', text: '特殊进出军工物资' },
  { value: '3', text: '国际援助物资' },
  { value: '4', text: '国际会议' },
  { value: '5', text: '直通放行' },
  { value: '6', text: '外交礼遇' },
  { value: '7', text: '绿色通道' },
];

// 进口企业资质
export const CIQ_ENT_QUALIF_TYPE_I = [
  { value: '000', text: '企业产品许可类别' },
  { value: '100', text: '通关司类' },
  { value: '101', text: '检疫处理单位审批' },
  { value: '104', text: '检疫处理人员审批' },
  { value: '200', text: '卫生司类' },
  { value: '300', text: '动植司类' },
  { value: '303', text: '进境水果境外果园/包装厂注册登记' },
  { value: '306', text: '进口饲料和饲料添加剂生产企业注册登记' },
  { value: '307', text: '进境非食用动物产品生产、加工、存放企业注册登记' },
  { value: '312', text: '进境植物繁殖材料隔离检疫圃申请' },
  { value: '317', text: '进出境动物指定隔离检疫场使用申请' },
  { value: '319', text: '进境栽培介质使用单位注册' },
  { value: '320', text: '进境动物遗传物质进口代理及使用单位备案' },
  { value: '321', text: '进境动物及动物产品国外生产单位注册' },
  { value: '322', text: '饲料进口企业备案' },
  { value: '326', text: '进境粮食加工储存单位注册' },
  { value: '327', text: '进口粮食境外出口、仓储企业注册登记' },
  { value: '400', text: '检验司类' },
  { value: '413', text: '进口可用作原料的固体废物国内收货人注册登记' },
  { value: '414', text: '进口可用作原料的固体废物国外供货商注册登记' },
  { value: '415', text: '进出境集装箱场站登记' },
  { value: '416', text: '进口棉花境外供货商登记注册' },
  { value: '418', text: '对出口食品包装生产企业和进口食品包装的进口商实行备案' },
  { value: '421', text: '进出口商品检验鉴定机构许可' },
  { value: '500', text: '食品局类' },
  { value: '508', text: '进口食品境外出口商代理商备案' },
  { value: '509', text: '进口食品进口商备案' },
  { value: '510', text: '进口肉类收货人备案' },
  { value: '511', text: '进口肉类存储冷库备案' },
  { value: '513', text: '进口水产品存储冷库备案' },
  { value: '515', text: '进口化妆品收货人备案' },
  { value: '519', text: '进口食品境外生产企业注册' },
  { value: '524', text: '进口食品境外生产企业信息记录' },
  { value: '600', text: '综合类' },
  { value: '601', text: '进口其他证书' },
  { value: '603', text: '从事进出境检疫处理业务的人员认定' },
  { value: '700', text: '认监委类' },
];

// 出口企业资质
export const CIQ_ENT_QUALIF_TYPE_E = [
  { value: '000', text: '企业产品许可类别' },
  { value: '100', text: '通关司类' },
  { value: '101', text: '检疫处理单位审批' },
  { value: '102', text: '实施绿色通道制度申请' },
  { value: '104', text: '检疫处理人员审批' },
  { value: '200', text: '卫生司类' },
  { value: '300', text: '动植司类' },
  { value: '301', text: '出境水果包装厂注册登记' },
  { value: '302', text: '出境水果果园注册登记' },
  { value: '304', text: '出境水生动物养殖场/包转场检验检疫注册登记' },
  { value: '305', text: '出口饲料和饲料添加剂生产、加工、存放企业注册登记' },
  { value: '308', text: '出境货物木质包装除害处理标识加施资格申请' },
  { value: '309', text: '出境种苗花卉生产经营企业注册登记' },
  { value: '310', text: '出境竹木草制品生产企业注册登记' },
  { value: '311', text: '出口植物产品生产、加工、存放企业注册登记' },
  { value: '315', text: '供港澳陆生动物饲养场、中转场检验检疫注册' },
  { value: '317', text: '进出境动物指定隔离检疫场使用申请' },
  { value: '318', text: '出境动物及其非食用动物产品生产、加工、存放企业注册登记' },
  { value: '323', text: '饲料出口企业备案' },
  { value: '324', text: '出境货物木质包装除害处理合格凭证' },
  { value: '329', text: '出境粮食生产、加工、存放企业注册登记' },
  { value: '400', text: '检验司类' },
  { value: '415', text: '进出境集装箱场站登记' },
  { value: '417', text: '出口玩具质量许可（注册登记）' },
  { value: '418', text: '对出口食品包装生产企业和进口食品包装的进口商实行备案' },
  { value: '419', text: '输美日用陶瓷生产厂认证' },
  { value: '421', text: '进出口商品检验鉴定机构许可' },
  { value: '500', text: '食品局类' },
  { value: '501', text: '出口肉类产品养殖场备案' },
  { value: '502', text: '出口蛋禽养殖场备案' },
  { value: '503', text: '出口蜂产品养蜂基地备案' },
  { value: '504', text: '出口食品原料种植场备案' },
  { value: '505', text: '供港澳蔬菜生产加工企业备案' },
  { value: '506', text: '供港澳蔬菜种植基地备案' },
  { value: '507', text: '出口粮谷豆类生产加工企业注册登记' },
  { value: '512', text: '出口加工用水产养殖场备案' },
  { value: '514', text: '出口化妆品生产企业备案' },
  { value: '518', text: '出口食品生产企业备案' },
  { value: '520', text: '出口食品生产企业境外注册' },
  { value: '602', text: '出口其他证书' },
  { value: '603', text: '从事进出境检疫处理业务的人员认定' },
  { value: '700', text: '认监委类' },
];
export const CIQ_APPL_CERTS = [
  {
    certcode: '11', appl_ori: '1', appl_copyquan: '2', certname: '品质证书',
  },
  {
    certcode: '12', appl_ori: '1', appl_copyquan: '2', certname: '重量证书',
  },
  {
    certcode: '13', appl_ori: '1', appl_copyquan: '2', certname: '数量证书',
  },
  {
    certcode: '14', appl_ori: '1', appl_copyquan: '2', certname: '兽医卫生证书',
  },
  {
    certcode: '15', appl_ori: '1', appl_copyquan: '2', certname: '健康证书',
  },
  {
    certcode: '16', appl_ori: '1', appl_copyquan: '2', certname: '卫生证书',
  },
  {
    certcode: '17', appl_ori: '1', appl_copyquan: '2', certname: '动物卫生证书',
  },
  {
    certcode: '18', appl_ori: '1', appl_copyquan: '2', certname: '植物检疫证书',
  },
  {
    certcode: '19', appl_ori: '1', appl_copyquan: '2', certname: '熏蒸/消毒证书',
  },
  {
    certcode: '20', appl_ori: '1', appl_copyquan: '2', certname: '出境货物换证凭单',
  },
  {
    certcode: '21', appl_ori: '1', appl_copyquan: '2', certname: '入境货物检验检疫证明（申请出具）',
  },
  {
    certcode: '22', appl_ori: '1', appl_copyquan: '2', certname: '出境货物不合格通知单',
  },
  {
    certcode: '23', appl_ori: '1', appl_copyquan: '2', certname: '集装箱检验检疫结果单',
  },
  {
    certcode: '24', appl_ori: '1', appl_copyquan: '2', certname: '入境货物检验检疫证明（申请不出具）',
  },
  {
    certcode: '95', appl_ori: '1', appl_copyquan: '2', certname: '入境货物调离通知单',
  },
  {
    certcode: '96', appl_ori: '1', appl_copyquan: '2', certname: '出境货物检验检疫工作联系单',
  },
  {
    certcode: '98', appl_ori: '1', appl_copyquan: '2', certname: '其他单',
  },
  {
    certcode: '99', appl_ori: '1', appl_copyquan: '2', certname: '其他证书',
  },
];

export const CIQ_DANGER_PACK_TYPE = [
  { value: '1', text: '一类' },
  { value: '2', text: '二类' },
  { value: '3', text: '三类' },
];

export const CIQ_GOODS_USETO = [
  { value: '11', text: '种用或繁殖' },
  { value: '12', text: '食用' },
  { value: '13', text: '奶用' },
  { value: '14', text: '观赏或演艺' },
  { value: '15', text: '伴侣' },
  { value: '16', text: '实验' },
  { value: '17', text: '药用' },
  { value: '18', text: '饲用' },
  { value: '19', text: '食品包装材料' },
  { value: '20', text: '食品加工设备' },
  { value: '21', text: '食品添加剂' },
  { value: '22', text: '介质土' },
  { value: '23', text: '食品容器' },
  { value: '24', text: '食品洗涤剂' },
  { value: '25', text: '食品消毒剂' },
  { value: '26', text: '仅工业用途' },
  { value: '27', text: '化妆品' },
  { value: '28', text: '化妆品原料' },
  { value: '29', text: '肥料' },
  { value: '30', text: '保健品' },
  { value: '31', text: '治疗、预防、诊断' },
  { value: '32', text: '科研' },
  { value: '33', text: '展览展示' },
  { value: '99', text: '其他' },
];

export const CIQ_GOODS_ATTRS = [
  { text: '3C目录内', value: '11' },
  { text: '3C目录外', value: '12' },
  { text: '无需办理3C认证', value: '13' },
  { text: '预包装', value: '14' },
  { text: '非预包装', value: '15' },
  { text: '转基因产品', value: '16' },
  { text: '非转基因产品', value: '17' },
  { text: '首次进出口', value: '18' },
  { text: '正常', value: '19' },
  { text: '废品', value: '20' },
  { text: '旧品', value: '21' },
  { text: '成套设备', value: '22' },
  { text: '带皮木材/板材', value: '23' },
  { text: '不带皮木材/板材', value: '24' },
  { text: 'A级特殊物品', value: '25' },
  { text: 'B级特殊物品', value: '26' },
  { text: 'C级特殊物品', value: '27' },
  { text: 'D级特殊物品', value: '28' },
  { text: 'V/W非特殊物品', value: '29' },
  { text: '市场采购', value: '30' },
];

export const CIQ_GOODS_LIMITS_TYPE_I = [
  { value: '105', text: '兽医(卫生)证书' },
  { value: '106', text: '动物检疫证书' },
  { value: '107', text: '植物检疫证书' },
  { value: '108', text: '重量证书' },
  { value: '109', text: 'TCK检验证书（美国小麦）' },
  { value: '110', text: '熏蒸证书' },
  { value: '111', text: '放射性物质检测合格证明' },
  { value: '112', text: '木材发货检验码单' },
  { value: '113', text: '原产地证书（证明）' },
  { value: '114', text: '中转进境确认证明文件（经港澳地区中转入境水果）' },
  { value: '115', text: '入口检测报告' },
  { value: '116', text: '货物进口证明书' },
  { value: '117', text: '进出口货物征免税证明' },
  { value: '203', text: '出入境特殊物品卫生检疫审批' },
  { value: '325', text: '进境动植物检疫许可证' },
  { value: '328', text: '同意调入函（植物繁殖材料）' },
  { value: '401', text: '进出口商品免验' },
  { value: '402', text: '进口旧机电产品备案' },
  { value: '408', text: '汽车预审备案' },
  { value: '409', text: '免于强制性认证特殊用途进口汽车检测处理程序车辆' },
  { value: '410', text: '免于办理强制性产品认证' },
  { value: '411', text: '强制性产品（CCC）认证' },
  { value: '412', text: '进口涂料备案' },
  { value: '416', text: '进口棉花境外供货商登记注册' },
  { value: '422', text: '进口废物原料装运前检验证书' },
  { value: '423', text: '进境旧机电境外预检验证书' },
  { value: '424', text: '境外捐赠机构登记和捐赠医疗器械备案材料' },
  { value: '428', text: '进口食品接触产品备案书' },
  { value: '516', text: '进口化妆品产品备案' },
  { value: '517', text: '进口预包装食品标签备案' },
  { value: '519', text: '进口食品境外生产企业注册' },
  { value: '522', text: '水果预检验证书' },
  { value: '523', text: '进口化妆品产品套装备案' },
  { value: '524', text: '进口食品境外生产企业信息记录' },
  { value: '601', text: '从事进出境检疫处理业务的单位认定（A类）' },
  { value: '603', text: '进口车辆识别代码（VIN）校验报告单' },
  { value: '604', text: '型式试验合格证明（首次进口压力管道元件）' },
  { value: '605', text: '实施金伯利进程国际证书制度注册登记证' },
  { value: '606', text: '允许进出口证明书/中华人民共和国野生动植物进出口说明书/非《进出口野生动植物种商品目录》物种' },
  { value: '607', text: '限制类环保证书' },
  { value: '608', text: '药品生产/经营许可证' },
  { value: '609', text: '进口兽药注册证书' },
  { value: '610', text: '机动车进口许可证' },
  { value: '611', text: '进口饲料和饲料添加剂产品登记证' },
  { value: '612', text: '进口医疗器械注册证' },
  { value: '613', text: '能源效率标识备案' },
  { value: '614', text: '允许进出口证明书/中华人民共和国野生动植物进出口说明书/非《进出口野生动植物种商品目录》物种证明' },
  { value: '800', text: '准入肉类名单' },
  { value: '900', text: '进口肉类名录' },
];
export const CIQ_GOODS_LIMITS_TYPE_E = [
  { value: '103', text: '直通放行申请' },
  { value: '203', text: '出入境特殊物品卫生检疫审批' },
  { value: '401', text: '进出口商品免验' },
  { value: '404', text: '出口产品型式试验' },
  { value: '417', text: '出口玩具质量许可（注册登记）' },
  { value: '425', text: '出境危险货物运输包装使用鉴定结果单' },
  { value: '426', text: '出境危险货物运输包装性能检验结果单' },
  { value: '518', text: '出口食品生产企业备案' },
  { value: '519', text: '进口食品境外生产企业注册' },
  { value: '602', text: '出口其他证书' },
  { value: '606', text: '允许进出口证明书/中华人民共和国野生动植物进出口说明书/非《进出口野生动植物种商品目录》物种' },
  { value: '614', text: '允许进出口证明书/中华人民共和国野生动植物进出口说明书/非《进出口野生动植物种商品目录》物种证明' },
  { value: '615', text: '捕捞船舶登记证和捕捞许可证（野生捕捞水生动物' },
  { value: '616', text: '化妆品生产许可证(仅限首次出口时提供)' },
  { value: '617', text: '特殊用途销售包装化妆品成品应当提供相应的卫生许可批件' },
  { value: '618', text: '危险特性分类鉴别报告' },
  { value: '619', text: '型式试验报告' },
  { value: '620', text: '动物检疫合格证明（国产原料）；进境货物检疫证明、原产国检验证书（进口原料）' },
  { value: '621', text: '出口检测报告' },
  { value: '622', text: '微生物检测报告（沙门氏菌、产志贺毒素大肠杆菌、金黄色葡萄球菌、单增李斯特菌）' },
  { value: '623', text: '出口水产品成品检验报告' },
  { value: '624', text: '检验检疫机关出具的分类定级试验报告和12米跌落试验合格报告' },
  { value: '626', text: '出口水产品原料供货证明（养殖水产品）' },
  { value: '627', text: '出口加工用动物源性食品原料供货证明(水产原料)' },
  { value: '628', text: '采购备案单位商品的需提供备案证明' },
];

const obj = {};
const ciqPermits = [];
CIQ_GOODS_LIMITS_TYPE_I.concat(CIQ_GOODS_LIMITS_TYPE_I).forEach((f) => {
  if (obj[f.value] === undefined) {
    obj[f.value] = f;
    ciqPermits.push(f);
  }
});

export const CIQ_GOODS_LIMITS_TYPE = ciqPermits;

export const INSPECTIONS = [
  { value: 'M', text: '进口商品检验' },
  { value: 'N', text: '出口商品检验' },
  { value: 'P', text: '进境动植物、动植物产品检疫' },
  { value: 'Q', text: '出境动植物、动植物产品检疫' },
  { value: 'R', text: '进口食品卫生监督检验' },
  { value: 'S', text: '出口食品卫生监督检验' },
  { value: 'L', text: '民用商品入境验证' },
];
