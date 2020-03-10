$(document).ready(function() {

  initPage()
  initPageEvent() 


  function initPage () {
    chrome.storage.sync.get(['openAsync'], ({openAsync}) => {
      if(openAsync) {
        $('#switchMain').addClass('switch-checked')
      } else {
        $('#switchMain').removeClass('switch-checked')
      }
    })
  }

  function refreshPagesData() {
    chrome.storage.sync.get(['pages'], ({ pages }) => {

    })
  }


  function initPageEvent() {
    $('#switchMain').click(() => {
      const preValue = $('#switchMain').hasClass('switch-checked')
      if(preValue) {
        $('#switchMain').removeClass('switch-checked')
        $('.mask').addClass('mask-active')
      } else {
        $('#switchMain').addClass('switch-checked')
        $('.mask').removeClass('mask-active')
      }
      switchAsync(!preValue)
    })

    $('#saveSetting').click(() => {
      const values = getFormValues()
      if(!values) {
        return
      }
      saveAsync(values, () => {
        resetFormValues()
      })
    })

    $('.pages-item').delegate('.icon-shuaxin', 'click', function(e) {
      $(this).addClass('icon-shuaxin-round')
    })

    $('.pages-item').on('click', '.pages-item-switch', () => {

    })
  
    $('#saveSettingCancel').click(() => {
      resetFormValues()
      $('.add-card').removeClass('add-card-active')
    })
  
    $('#addNewAsync').click(() => {
      if($('.add-card').hasClass('add-card-active')) {
        return
      }
      resetFormValues()
      $('.add-card').addClass('add-card-active')
    })
  }

  

  function saveAsync(values = {}, callback = () => {}) {
    chrome.storage.sync.get(['pages'], ({pages}) => {
      if(values.id) {
        const newPages = { ...pages, [values.id]: values }
        chrome.storage.sync.set({ pages: newPages })
      } else {
        const id = 'pageId_' + Math.round(Math.random() * 100000)
        chrome.storage.sync.set({ pages: {...pages, [id]: values }})
      }
      callback && callback()
    })
    
  }

  function switchAsync(open = false) {
    chrome.storage.sync.set({openAsync: open})
  }

  function resetFormValues() {
    $('#name').val('')
    $('#originUrl').val('')
    $('#goatUrl').val('')
    $('#goatCookie').val('')
  }

  function getFormValues() {
    var value_name = $('#name').val()
    var value_origin_url = $('#originUrl').val()
    var value_goat_url = $('#goatUrl').val()
    var value_cookies = $('#goatCookie').val()

    if(!value_name || !value_origin_url || !value_goat_url || !value_cookies) {
      return false
    }
    return {
      name: value_name,
      originUrl: value_origin_url,
      goatUrl: value_goat_url,
      goatCookie: value_cookies,
    }
  }
})