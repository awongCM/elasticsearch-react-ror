# TODO - to decide whether to have this as a service object

require 'multi_json'
require 'faraday'
require 'elasticsearch'

class ElasticSearchClient
  include Elasticsearch::API

  CONNECTION = ::Faraday::Connection.new url: 'http://elastic:streem@test.es.streem.com.au:9200'

  def perform_request(method, path, params, body)
    puts "--> #{method.upcase} #{path} #{params} #{body}"

    CONNECTION.run_request \
      method.downcase.to_sym,
      path,
      ( body ? MultiJson.dump(body): nil ),
      {'Content-Type' => 'application/json'}
  end
  
end