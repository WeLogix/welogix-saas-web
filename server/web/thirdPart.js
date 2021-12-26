/**
 * Copyright (c) 2016-2019 WeLogix Ltd. All Rights Reserved.
 */
/**
 * User: Kurten
 * Date: 2016-03-30
 * Time: 17:01
 * Version: 1.0
 * Description:
 */
let growingAccount = '8e87f20efd43c754';
if (global.ENV_STAGING) {
  growingAccount = '8ce24a77361d3d0e';
}

const stjs = `<script type='text/javascript'>
    var _vds = _vds || [];
    window._vds = _vds;
    (function(){
      _vds.push(['setAccountId', '${growingAccount}']);
      (function() {
        var vds = document.createElement('script');
        vds.type='text/javascript';
        vds.async = true;
        vds.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'dn-growing.qbox.me/vds.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(vds, s);
      })();
    })();
  </script>`;

module.exports = stjs;
