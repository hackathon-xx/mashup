require "rubygems"
require "bundler/setup"
require "sinatra"
require 'net/http'
require 'net/https'
require 'cgi'
require "lib/proxies/pipejump"

get "/" do
  erb :home
end

