window.onload = function() {
  this.document.getElementById('saveSetting').onclick = () => {
    this.document.querySelector('.msg-error').style.display = 'none'
    var values = getFormValues()
    if(!values) {
      this.document.querySelector('.msg-error').style.display = 'block'
      return
    }
    
  }

  function getFormValues() {
    var value_name = this.document.getElementById('name').value
    var value_origin_url = this.document.getElementById('originUrl').value
    var value_goat_url = this.document.getElementById('goatUrl').value
    var value_cookies = this.document.getElementById('goatCookie').value

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
}