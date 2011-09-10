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
  getContacts: function(options, success) {
    if (!options) options = { page: 1 }
    $.ajax({
      dataType: 'json',
      url: '/api/sales/contacts.json?page=1&token=' + Pipejump.token,
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
  }
}

jQuery.fn.extractParams = function() {
  var params = {}
  $.each($(this).serializeArray(), function(index, field) {
    if (field.name) {
      params[field.name] = field.value
    }
  })
  return params;
}

jQuery.fn.render = function(name, options) {
  var html = Template.render(name, options)
  $(this).html(html)
};

var Template = {
  collection: {},
  loadAll: function() {
    var scripts = $('script[type="text/x-handlebars-template"]')
    $.each(scripts, function(index, script) {
      Template.collection[script.id.replace(/\-template/, '')] = Handlebars.compile(script.innerHTML);
    })
  },
  render: function(name, context, options) {
    return this.collection[name](context, options)
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
    Pipejump.login(params.email, params.password, function() {
      displayContactList()
    }, function() {
      alert('wrong!')
    })
    return false
  })
}

var installContactEvents = function(){
  $('ul.contacts li.name').live('click', function(){
     $('ul.contacts li.name').toggle(function(){
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