import { PRESET_TRANSMODES, CONTAINER_PACKAGE_TYPE } from 'common/constants';

export function renderRegion(region) {
  const rgs = [];
  if (region.province) {
    rgs.push(region.province);
  }
  if (region.city && (region.city.indexOf('市') !== 0 && region.city.indexOf('县') !== 0)) {
    rgs.push(region.city);
  }
  if (region.district) {
    rgs.push(region.district);
  }
  if (region.street) {
    rgs.push(region.street);
  }
  return rgs.join('-');
}

export function getEndTableVarColumns(agreement, transModes, VEHICLE_TYPES, VEHICLE_LENGTH_TYPES) {
  const columns = [];
  const tms = transModes.filter(tm => tm.mode_code === agreement.transModeCode);
  const tmCode = tms.length === 1 ? tms[0].mode_code : null;
  if (tmCode === PRESET_TRANSMODES.ftl) {
    for (let i = 0; i < agreement.intervals.length; i++) {
      const vlts = VEHICLE_LENGTH_TYPES.filter(vlt => vlt.value === agreement.intervals[i]);
      const vts = VEHICLE_TYPES.filter(vt => vt.value === agreement.vehicleTypes[i]);
      if (vlts[0] && vts[0]) {
        const title = `${vlts[0].text}/${vts[0].text}`;
        columns.push({ title, index: i });
      }
    }
  } else if (tmCode === PRESET_TRANSMODES.ctn) {
    for (let i = 0; i < agreement.intervals.length; i++) {
      const ctn = agreement.intervals[i];
      const cpts = CONTAINER_PACKAGE_TYPE.filter(cpt => cpt.id === ctn);
      if (cpts[0]) {
        columns.push({ title: cpts[0].value, index: i });
      }
    }
  } else {
    let unit;
    if (agreement.meter === 't') {
      unit = '吨';
    } else if (agreement.meter === 'm3') {
      unit = '立方米';
    } else if (agreement.meter === 't*km') {
      unit = '吨';
    } else if (agreement.meter === 'kg' || agreement.meter === 'kgfix') {
      unit = '公斤';
    }
    columns.push({ title: `<${agreement.intervals[0]}${unit}`, index: 0 });
    for (let i = 1; i < agreement.intervals.length; i++) {
      columns.push({
        title: `${agreement.intervals[i - 1]}~${agreement.intervals[i]}${unit}`,
        index: i,
      });
    }
    columns.push({
      title: `>${agreement.intervals[agreement.intervals.length - 1]}${unit}`,
      index: agreement.intervals.length,
    });
  }
  return columns;
}
