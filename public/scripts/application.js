var displayContactList = function() {
  $('#top').html("<div class='login'><span class='linked-in'><script type=\"IN/Login\"></script></span><a class='logout'>Log out</a></div>")
  $('#container').html('<div class="loader">Loading...</div>')
  Spinner.default.spin($('.loader').get(0))
  Pipejump.getContacts({}, function(contacts) {
    $('#container').render('contacts', { contacts: contacts })
  })
};

var displayLoginBox = function() {
  $('#container').render('login')
  $('.login').submit(function() {
    var params = $(this).extractParams()
    var token = Pipejump.login(params.email, params.password)
    $('#container').html('<div class="loader">Logging you in...</div>')
    Spinner.default.spin($('.loader').get(0))
    Pipejump.login(params.email, params.password, function() {
      displayContactList()
      installContactEvents()
    }, function() {
      alert('Wrong email or password')
      displayLoginBox()
    })

    return false
  })
}

var installContactEvents = function(){
  $('ul.contacts > li a').live('click', function(){
    var self = $(this)
    var contact_id = $(this).attr('rel');
    var container = $( "#contact-"+contact_id)
    if ($.trim(container.html()) == '' || container.is(':hidden')){
      container.render('contacts-container', { contact: Pipejump.getContact(contact_id)});
      container.show()
      var found = Pipejump.getContact(contact_id)
      Flickr.search(found.contact.name, function(data) {
        container.find('.flickr-photos').render('flickr-photos', { photos: data.photos.photo.slice(0, 22) })
        $('.flickr-photos li a').lightBox({fixedNavigation:true});
      })
      Twitter.getUserInfo(found.contact.twitter, function(data) {
        container.find('.twitter-details').render('contact-twitter-details', data)
      })
      LinkedIn.search(found.contact.linkedin, function(data){
        container.find('.linkedin-details').render('linkedin-details', data)
      })
    } else {
      container.hide()
    }
    return false;
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

  $('.logout').live('click', function() {
    Pipejump.logout()
    $('#top').html('')
    displayLoginBox()
  })
})
