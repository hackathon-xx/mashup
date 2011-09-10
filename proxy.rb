require "rubygems"
require "bundler/setup"
require "sinatra"
require 'net/http'
require 'net/https'
require 'cgi'
require File.expand_path('lib/proxies/pipejump', File.dirname(__FILE__))

get "/" do
  erb :home
end

