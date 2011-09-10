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
      Pipejump.setContactsCollection(data)
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
    this.get('/api/sales/contacts.json?page=1', success)
  }
}

var displayContactList = function() {
  $('#container').html('Loading...')
  Pipejump.getContacts({}, function(contacts) {
    $('#container').render('contacts', { contacts: contacts })
  })
};

var displayLoginBox = function() {
  $('#container').render('login')
  $('.login').submit(function() {
    var params = $(this).extractParams()
    var token = Pipejump.login(params.email, params.password)

    Pipejump.login(params.email, params.password, function() {
      displayContactList()
    }, function() {
      alert('wrong!')
    })

    return false
  })
}

var installContactEvents = function(){
  $('ul.contacts li.name span').live('click', function(){
    var self = $(this)
     $('ul.contacts li.name span').toggle(function(){
       var contact_id = $(this).attr('rel');
       if ($( "#contact-"+contact_id).is(':hidden')){
         $( "#contact-"+contact_id ).show()
       }
       $( "#contact-"+contact_id ).render('contacts-container', { contact: Pipejump.getContact(contact_id)});
     }, function(){
        var contact_id = $(this).attr('rel');
        $( "#contact-"+contact_id ).hide()
     })
   })
}

$(function() {
  Template.loadAll();
  var token = $.cookie('pipejump_token')

  if (token) {
    Pipejump.token = token
    displayContactList()
    installContactEvents()
  } else {
    displayLoginBox()
  }

})
