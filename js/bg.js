window.onload = function() {
  if (!chrome.cookies) {
    chrome.cookies = chrome.experimental.cookies;
  }
  if (this.location.host == "developer.daily.tuya-inc.cn") {
    // this.localStorage.setItem('backupCookies', document.cookie)
    chrome.storage.sync.set({ backupCookies: document.cookie }, function() {
      console.log("保存成功！")
    })
  }
  this.console.log("chrome cookies=======>>>", chrome.cookies);
  chrome.cookies.getAll({'domain': '.tuya-inc.cn/'}, (cks) => {
    this.console.log('chrome cookies=======>>>', cks)

  })
  if (this.location.host == "localhost:3000") {
    // var cookie_backup = this.localStorage.getItem("backupCookies");
    chrome.storage.sync.get({ backupCookies: "" }, function(items) {
      var cookie_backup = items.backupCookies;
      document.cookie = cookie_backup;
    });
  }
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
};
