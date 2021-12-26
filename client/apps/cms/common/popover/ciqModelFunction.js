export function loadCiqModelFields(isCDF) {
  let productModelFd = { key: 'product_model' };
  let produceDateFd = { key: 'produce_date', type: 'date' };
  if (isCDF) {
    productModelFd = { key: 'product_models' };
    produceDateFd = { key: 'produce_date_str' };
  }
  const ciqModelFields = [
    { key: 'stuff' },
    { key: 'expiry_date', type: 'date' },
    { key: 'warranty_days' },
    { key: 'oversea_manufcr_name' },
    { key: 'product_spec' },
    productModelFd,
    { key: 'brand' },
    produceDateFd,
    { key: 'external_lot_no' },
    { key: 'manufcr_regno' },
    { key: 'manufcr_regname' },
  ];
  return ciqModelFields;
}

export function formatCiqModelDateString(ciqMdDate) {
  if (ciqMdDate) {
    const ciqDate = new Date(ciqMdDate);
    if (ciqDate && !Number.isNaN(ciqDate.getTime())) {
      const year = ciqDate.getFullYear();
      const month = `0${ciqDate.getMonth() + 1}`.slice(-2);
      const day = `0${ciqDate.getDate()}`.slice(-2);
      return `${year}-${month}-${day}`;
    }
  }
  return null;
}

export function formatCiqModelString(ciqModelValues, isCDF) {
  const ciqModelFields = loadCiqModelFields(isCDF);
  const modelFieldValues = ciqModelFields.map((cmf) => {
    if (ciqModelValues[cmf.key]) {
      if (cmf.type === 'date') {
        return formatCiqModelDateString(ciqModelValues[cmf.key]) || '';
      }
      return ciqModelValues[cmf.key];
    }
    return '';
  });
  if (modelFieldValues.filter(mfv => mfv).length > 0) {
    return modelFieldValues.filter(mfv => mfv).join(';');
  }
  return '';
}
