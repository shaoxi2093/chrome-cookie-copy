if (!chrome.cookies) {
  chrome.cookies = chrome.experimental.cookies;
}

var pagesListen = {};
var originWebsites = [];
refreshPagesListen();
function refreshPagesListen() {
  chrome.storage.sync.get(["pages"], ({ pages }) => {
    pagesListen = pages;
    var originUrls = [];
    for (const id of Object.keys(pages)) {
      originUrls.push(pages[id].originUrl);
    }
    originWebsites = [...new Set(originUrls)];
  });
}

function findPagesByOriginUrl(originUrl) {
  var result = [];
  for (const id of Object.keys(pagesListen)) {
    if (pagesListen[id].originUrl == originUrl && pagesListen[id].switchOn) {
      result.push(pagesListen[id]);
    }
  }
  return result;
}

chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (changes.pages) {
    refreshPagesListen();
  }
});

function filterCookieByFilters({ domain, name }, cookiesArr) {
  return cookiesArr.find(item => item.domain === domain && item.name === name)
    .value;
}
chrome.cookies.onChanged.addListener(function({ cookie }) {
  chrome.storage.sync.get(["openAsync"], ({ openAsync }) => {
    if (openAsync) {
      if (originWebsites.includes(cookie.domain)) {
        var pages = findPagesByOriginUrl(cookie.domain);
        for (const pageItem of pages) {
          if (pageItem.goatCookie.split(',').includes(cookie.name)) {
            console.log("s-sid=========>>>>", cookie.value, cookie.name, pageItem.goatUrl, `http://${pageItem.goatUrl}`);
            const newValue = cookie.value;
            if (newValue) {
              chrome.cookies.set(
                {
                  name: cookie.name,
                  value: newValue,
                  domain: pageItem.goatUrl.indexOf('localhost') > -1 ? "localhost" : pageItem.goatUrl,
                  url: pageItem.goatUrl.indexOf('localhost') > -1 ? `http://${pageItem.goatUrl}` : `https://${pageItem.goatUrl}`
                },
                () => {
                  console.log("成功");
                }
              );
            }
          }
        }
      }
    }
  });
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
