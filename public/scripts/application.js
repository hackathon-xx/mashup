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
  $('ul.contacts > li span').live('click', function(){
    var self = $(this)
    var contact_id = $(this).attr('rel');
    var container = $( "#contact-"+contact_id)
    if ($.trim(container.html()) == '' || container.is(':hidden')){
      container.render('contacts-container', { contact: Pipejump.getContact(contact_id)});
      container.show()
      var found = Pipejump.getContact(contact_id)
      Flickr.search(found.contact.name, function(data) {
        container.find('.flickr-photos').render('flickr-photos', { photos: data.photos.photo })
      })
      Twitter.getUserInfo(found.contact.twitter, function(data) {
        container.find('.twitter-details').render('contact-twitter-details', data)
      })
    } else {
      container.hide()
    }
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
