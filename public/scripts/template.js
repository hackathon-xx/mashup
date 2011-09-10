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

