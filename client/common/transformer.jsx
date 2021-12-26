import React from 'react';

export function toNonNullProperties(obj) {
  const retObj = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key]) {
      retObj[key] = obj[key];
    }
  });
  return retObj;
}

export function toNumber(v) {
  if (!v || (v.trim && !v.trim())) {
    return undefined;
  }
  let num = Number(v);
  // num === ' '
  if (!Number.isNaN(num)) {
    num = parseInt(v, 10);
  }
  return Number.isNaN(num) ? v : num;
}

export function renderV1V2Options(v1v2Opts) {
  return v1v2Opts.map(opt => ({
    value: opt.code,
    title: `${opt.code} | ${opt.text}`,
    search: `${opt.code} | ${opt.text} | ${opt.code_v1}`,
    text: <span><span style={{ fontWeight: 'bold', color: '#000000' }}>{opt.code} | {opt.text}</span>
      <span style={{ color: '#a5a5a5', paddingLeft: 10 }}>{opt.code_v1}</span></span>,
  }));
}
