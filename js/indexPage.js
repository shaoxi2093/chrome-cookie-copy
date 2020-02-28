$(document).ready(function() {

  chrome.storage.sync.get(['openAsync'], ({openAsync}) => {
    if(openAsync) {
      $('#switchMain').addClass('switch-checked')
    } else {
      $('#switchMain').removeClass('switch-checked')
    }
  })

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