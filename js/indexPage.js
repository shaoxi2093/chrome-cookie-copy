$(document).ready(function() {
  initPage();
  initPageEvent();

  function initPage() {
    chrome.storage.sync.get(["openAsync"], ({ openAsync }) => {
      if (openAsync) {
        $("#switchMain").addClass("switch-checked");
      } else {
        $("#switchMain").removeClass("switch-checked");
      }
    });
    refreshPagesData()
  }

  function refreshPagesData() {
    chrome.storage.sync.get(["pages"], ({ pages }) => {
      var innerHtmlStr = '<p class="title">同步页面列表</p>';
      if(pages) {
        for (key of Object.keys(pages)) {
          const html = `
            <div class="pages-item">
              <div class="item-name">
                <i data-id="${key}" class="iconfont icon-shuaxin" title="刷新同步"></i>
                <span class="page-name" title="日常同步">${pages[key].name}</span>
                <div class="item-opts">
                  <i data-id="${key}" class="iconfont icon-bianji" title="编辑"></i>
                  <i data-id="${key}" class="iconfont icon-shanchu" title="删除"></i>
                </div>
              </div>
              <button
                data-id="${key}"
                type="button"
                class="switch ${
                  pages[key].switchOn ? "switch-checked" : ""
                } pages-item-switch"
              >
                <span class="switch-inner"></span>
              </button>
            </div>
          `;
          innerHtmlStr += html
        }
      }
      
      $('.pages-wrapper').html(innerHtmlStr || `<p class="pages-none">暂无配置任何同步</p>`)
    });
  }

  function showMessage(msg) {
    var msgNode = document.createElement('div')
    msgNode.className = 'message-tips'
    msgNode.innerText = msg
    document.body.appendChild(msgNode)
    setTimeout(() => {
      msgNode.className = 'message-tips message-tips-motion'
    }, 1000)
    setTimeout(() => {
      document.body.removeChild(msgNode)
    }, 3000)
  }

  function initPageEvent() {
    $("#switchMain").click(() => {
      const preValue = $("#switchMain").hasClass("switch-checked");
      if (preValue) {
        $("#switchMain").removeClass("switch-checked");
        $(".mask").addClass("mask-active");
      } else {
        $("#switchMain").addClass("switch-checked");
        $(".mask").removeClass("mask-active");
      }
      switchAsync(!preValue);
    });

    $("#saveSetting").click(() => {
      const values = getFormValues();
      if (!values) {
        return;
      }
      saveAsync({ ...values, switchOn: true }, () => {
        resetFormValues();
        refreshPagesData();
      });
    });

    $(".pages-wrapper").delegate(".icon-shuaxin", "click", function(e) {
      const id = $(this).data('id')
      refreshCookieByPageId(id)
    });

    $(".pages-wrapper").delegate(".pages-item-switch", "click", function() {
      const preValue = $(this).hasClass("switch-checked");
      const pageId = $(this).data('id')
      if (preValue) {
        $(this).removeClass("switch-checked");
      } else {
        $("#switchMain").addClass("switch-checked");
      }
      switchItemAsync(pageId, !preValue, () => {
        refreshPagesData()
      });
    });
    $(".pages-wrapper").delegate(".icon-bianji", "click", function() {
      alert('暂未支持')
    });
    $(".pages-wrapper").delegate(".icon-shanchu", "click", function() {
      const id = $(this).data('id')
      deleteAsync(id, () => {
        refreshPagesData()
      })
    });

    $("#saveSettingCancel").click(() => {
      resetFormValues();
      $(".add-card").removeClass("add-card-active");
    });

    $("#addNewAsync").click(() => {
      if ($(".add-card").hasClass("add-card-active")) {
        return;
      }
      resetFormValues();
      $(".add-card").addClass("add-card-active");
    });
  }

  function refreshCookieByPageId(id, callback) {
    if(!id) {
      return
    }
    chrome.storage.sync.get(["pages"], ({pages}) => {
      chrome.cookies.getAll({domain: pages[id].originUrl}, (resultCookiesArr) => {
        for(const item of pages[id].goatCookie.split(',')) {
          const objFound = resultCookiesArr.find(c => c.name == item)
          if(objFound) {
            chrome.cookies.set(
              {
                name: item,
                value: objFound.value,
                domain: pages[id].goatUrl.indexOf('localhost') > -1 ? "localhost" : pages[id].goatUrl,
                url: pages[id].goatUrl.indexOf('localhost') > -1 ? `http://${pages[id].goatUrl}` : `https://${pages[id].goatUrl}`
              },
              () => {
                showMessage("手动同步成功");
              }
            );
          }
          
        }
      })
    })
    callback && callback()
  }

  function deleteAsync(id, callback) {
    chrome.storage.sync.get(["pages"], ({ pages }) => {
      if (pages[id]) {
        delete pages[id]
        chrome.storage.sync.set({ pages });
      }
      callback && callback();
    });
  }

  function saveAsync(values = {}, callback = () => {}) {
    chrome.storage.sync.get(["pages"], ({ pages }) => {
      if (values.id) {
        const newPages = { ...pages, [values.id]: values };
        chrome.storage.sync.set({ pages: newPages });
      } else {
        const id = "pageId_" + Math.round(Math.random() * 100000);
        chrome.storage.sync.set({ pages: { ...pages, [id]: values } });
      }
      callback && callback();
    });
  }

  function switchAsync(open = false) {
    chrome.storage.sync.set({ openAsync: open });
  }

  function switchItemAsync(pageId, open = false, callback) {
    chrome.storage.sync.get(["pages"], ({ pages }) => {
      if (pages[pageId]) {
        const newPages = { ...pages, [pageId]: {
          ...pages[pageId],
          switchOn: open,
        }};
        chrome.storage.sync.set({ pages: newPages });
      }
      callback && callback();
    });
  }

  function resetFormValues(page = {}) {
    $("#name").val(page.name || "");
    $("#originUrl").val(page.originUrl || "");
    $("#goatUrl").val(page.goatUrl || "");
    $("#goatCookie").val(page.goatCookie || "");
  }

  function getFormValues() {
    var value_name = $("#name").val();
    var value_origin_url = $("#originUrl").val();
    var value_goat_url = $("#goatUrl").val();
    var value_cookies = $("#goatCookie").val();

    if (!value_name || !value_origin_url || !value_goat_url || !value_cookies) {
      return false;
    }
    return {
      name: value_name,
      originUrl: value_origin_url,
      goatUrl: value_goat_url,
      goatCookie: value_cookies
    };
  }
});
