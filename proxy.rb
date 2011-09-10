require "rubygems"
require "bundler/setup"
require "sinatra"
require 'net/http'
require 'net/https'
require 'cgi'

get "/" do
  erb :home
end

get "/api/sales/*" do |url|
  url = url.sub("/api/sales/", "")
  url = URI.parse("https://sales.futuresimple.com/api/v1/#{url}")
  puts "Looking up #{url}"
  headers = {}
  # puts "=" * 100
  # puts request['X-Pipejump-Auth']
  # puts request.inspect
  headers['X-Pipejump-Auth'] = params["token"] # request['X-Pipejump-Auth'].to_s
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
  headers['X-Pipejump-Auth'] = request['X-Pipejump-Auth'].to_s
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
