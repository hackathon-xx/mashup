var Twitter = {
  getUserInfo: function(name, callback) {
    $.getJSON("http://api.twitter.com/1/users/show.json?screen_name=" + name + "&callback=?", callback)
  },
  search: function(term, callback) {
    $.getJSON('http://search.twitter.com/search.json?q='+escape(term)+'&callback=?', callback)
  }
}