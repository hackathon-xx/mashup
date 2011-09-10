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
