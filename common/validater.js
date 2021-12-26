import { formatMsg } from './message.i18n';
/**
 *移动：134、135、136、137、138、139、150、151、157(TD)、158、159、187、188
 *联通：130、131、132、152、155、156、182、185、186
 *电信：133、153、180、189、（1349卫通）
 */
function isMobile(phone, defaultPhone) {
  if (phone === defaultPhone) {
    return true;
  }
  const phoneRe = new RegExp('^((13[0-9])|(14[0-9])|(16[0-9])|(17[0-9])|(19[0-9])|(15[^4,\\D])|(18[0-3,5-9]))\\d{8}$');
  return phoneRe.test(phone);
}
function getSmsCode(len) {
  let str = '';
  for (let i = 0; i < len; ++i) {
    str += Math.floor(Math.random() * 10);
  }
  return str;
}

function validatePhone(phone, callback, intl, required = true) {
  if (phone === undefined || phone === '' || phone === null) {
    if (required) {
      callback(new Error(formatMsg(intl)('phoneRequired')));
    } else {
      callback();
    }
  } else if (isMobile(phone)) {
    callback();
  } else {
    callback(new Error(formatMsg(intl)('invalidPhone')));
  }
}

// double byte character set
function dbcsByteLength(str) {
  if (!str) {
    return 0;
  }
  let slen = str.length;
  for (let i = slen - 1; i >= 0; i -= 1) {
    const scode = str.charCodeAt(i);
    if (scode > 0xff) {
      slen += 1;
    }
  }
  return slen;
}

function validateDbcsLength(dbcsStr, maxLen, callback, invalidMsg) {
  if (dbcsByteLength(dbcsStr) > maxLen) {
    callback(new Error(invalidMsg));
  } else {
    callback();
  }
}

export function isPositiveInteger(val) {
  if (!val || (val.trim && !val.trim())) {
    return undefined;
  }
  const num = +val; // Number(val)
  if (Number.isNaN(num)) {
    return false;
  }
  const numint = parseInt(num, 10);
  if (numint !== num || numint < 0) {
    return false;
  }
  return true;
}

export function genCurrentPageAfterDel(pageSize, current, totalCount, deleteCount) {
  if (current !== 1) {
    const totalPage = Math.ceil((totalCount - deleteCount) / pageSize);
    if (current > totalPage) {
      return current - 1;
    }
  }
  return current;
}

export {
  validatePhone,
  isMobile,
  getSmsCode,
  validateDbcsLength,
  dbcsByteLength,
};
