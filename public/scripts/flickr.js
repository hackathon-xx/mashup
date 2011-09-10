var Flickr = {
  search: function(name, callback) {
    $.getJSON("http://api.flickr.com/services/rest/?method=flickr.photos.search&text="+encodeURI(name)+"&format=json&api_key=28012eaffb5ffa32c59c3dce8ed4c8f0&jsoncallback=?", callback)
  }
}