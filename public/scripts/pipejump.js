Pipejump = {
  token: null,
  contacts_collection: [],
  logout: function() {
    $.cookie('pipejump_token', null)
  },
  login: function(username, password, success, failure) {
    $.post('/api/sales/authentication.json', 'email='+username+'&password='+password, function(data) {
      Pipejump.token = data.authentication.token
      $.cookie('pipejump_token', Pipejump.token)
    }, 'json').success(success).error(failure)
  },
  get: function(url, success, failure) {
    $.ajax({
      dataType: 'json',
      url: url,
      beforeSend: function(jqXHR) {
        jqXHR.setRequestHeader('X-Pipejump-Auth', Pipejump.token)
      }
    }).success(function(data){
      success(data)
    })
  },
  setContactsCollection: function(contacts){
    Pipejump.contacts_collection = contacts;
  },
  getContactsCollection: function(){
    return Pipejump.contacts_collection;
  },
  getContact: function(contact_id){
    result = null
    $.each(Pipejump.getContactsCollection(),function(index, element){
     if (element.contact.id*1==contact_id*1) {result = element;}
    })
    return result;
  },
  getContacts: function(options, success) {
    if (!options) options = { page: 1 }
    this.get('/api/sales/contacts.json?page=1', function(data) {
      Pipejump.setContactsCollection(data)
      success(data)
    })
  }
}
