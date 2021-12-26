function formatDevAppUrl(url, opencode) {
  let newUrl = url;
  if (opencode && url) {
    if (url.indexOf('?') !== -1) {
      newUrl = `${url}&opencode=${opencode}`;
    } else {
      newUrl = `${url}?opencode=${opencode}`;
    }
  }
  return newUrl;
}
export default {
  formDevAppLinks(devApps, opencode, bizKey, msg) {
    const appMenus = [];
    if (devApps && devApps.length === 1) {
      appMenus.push({
        single: true,
        key: devApps[0].app_id,
        path: formatDevAppUrl(devApps[0].url, opencode),
        icon: 'icon-apps',
        text: devApps[0].app_name,
      });
    } else if (devApps && devApps.length > 1) {
      appMenus.push({
        single: false,
        key: `${bizKey}-app`,
        icon: 'icon-apps',
        text: msg('devApps'),
        sublinks: [],
      });
      devApps.forEach((s, index) => {
        appMenus[0].sublinks.push({
          key: `${bizKey}-app-${index}`,
          path: formatDevAppUrl(s.url, opencode),
          text: s.app_name,
        });
      });
    }
    return appMenus;
  },
};
