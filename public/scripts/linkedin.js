LinkedIn = {
  search: function(term, success) {
    if (/^\/in\//.test(term)) {
      this.lookupPerson(term, success)
    } else if (/^\/company\/\d+$/.test(term)) {
      this.lookupCompanyById(term, success)
    } else if (/^\/company\//.test(term)) {
      this.lookupCompanyByName(term, success)
    }
  },
  lookupPerson: function(url, success) {
    url = escape("http://www.linkedin.com" + url).replace(/\//g, '%2F')
    IN.API.Raw('/people/url='+url).result(success)
  },
  lookupCompanyById: function(url, success) {
    var id = url.split('/').pop()
    IN.API.Raw('/companies/'+id+':(id,name,description)').result(success)
  },
  lookupCompanyByName: function(url, success) {
    var name = url.split('/').pop()
    IN.API.Raw('/companies/universal-name='+name+':(id,name,description)').result(success)
  }
}
