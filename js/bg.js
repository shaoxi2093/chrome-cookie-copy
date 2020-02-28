if (!chrome.cookies) {
  chrome.cookies = chrome.experimental.cookies;
}

function filterCookieByFilters({ domain, name }, cookiesArr) {
  return cookiesArr.find(item => item.domain === domain && item.name === name)
    .value;
}
chrome.cookies.onChanged.addListener(function({ cookie }) {
  chrome.storage.sync.get(['openAsync'], ({openAsync}) => {
    if(openAsync) {
      if (
        cookie.domain === "developer.daily.tuya-inc.cn" &&
        cookie.name === "s-sid"
      ) {
        console.log('s-sid=========>>>>', cookie.value)
        const s_sid_daily = cookie.value;
        if (s_sid_daily) {
          chrome.cookies.set(
            { name: "s-sid", value: s_sid_daily, domain: "localhost", url: 'http://localhost:3000' },
            () => {
              console.log("成功");
            }
          );
        }
      }
    }
  })
});
this.console.log("chrome cookies=======>>>", chrome.cookies);
chrome.cookies.getAll({ domain: "developer.daily.tuya-inc.cn" }, cks => {
  this.console.log("chrome cookies=======>>>", cks);
});

this.console.log("document cookies=====>>>>>", document.cookie);
function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i].trim();
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return "";
}
