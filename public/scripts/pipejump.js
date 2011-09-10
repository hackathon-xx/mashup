Pipejump = {
  token: null,
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
    }).success(success)
  },
  getContacts: function(options, success) {
    if (!options) options = { page: 1 }
    this.get('/api/sales/contacts.json?page=1', success)
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

$(function() {
  Template.loadAll();

  var token = $.cookie('pipejump_token')

  if (token) {
    Pipejump.token = token
    displayContactList()
  } else {
    displayLoginBox()
  }

})