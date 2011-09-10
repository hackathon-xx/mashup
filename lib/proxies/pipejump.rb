get "/api/sales/*" do |url|
  url = url.sub("/api/sales/", "")
  url = URI.parse("https://sales.futuresimple.com/api/v1/#{url}")
  puts "Looking up #{url}"
  headers = {}
  headers['X-Pipejump-Auth'] = request.env['HTTP_X_PIPEJUMP_AUTH'].to_s
  req = Net::HTTP::Get.new(url.path, headers)
  http = Net::HTTP.new(url.host, url.port)
  http.use_ssl = true
  res = http.request(req)
  status res.code
  res.body
end

post "/api/sales/*" do |url|
  url = url.sub("/api/sales/", "")
  url = URI.parse("https://sales.futuresimple.com/api/v1/#{url}")
  puts "Looking up #{url}"
  headers = {}
  headers['X-Pipejump-Auth'] = request.env['HTTP_X_PIPEJUMP_AUTH'].to_s
  req = Net::HTTP::Post.new(url.path, headers)
  req.set_form_data(request.POST)
  http = Net::HTTP.new(url.host, url.port)
  http.use_ssl = true
  res = http.request(req)
  status res.code
  res.body
end

put "/api/sales/*" do |url|
end

delete "/api/sales/*" do |url|
end
