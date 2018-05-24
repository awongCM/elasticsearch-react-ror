require 'elasticsearch'

module Api
  class PageViewsController < ApplicationController

    $client = Elasticsearch::Client.new url: 'http://elastic:streem@test.es.streem.com.au:9200', log: true, trace: true

    # to test the end point
    def index
      $client.cluster.health

      render json: {
        status: 200,
        message: 'Welcome to Elasticsearch React ROR API'
      }.to_json
    end
  
    def create
      @body = page_views_params

      begin
        $client.cluster.health
        response = $client.search query_hash(@body)

        render json: {
          status: 200,
          message: 'Query successful',
          body: @body,
          response: response
        }.to_json  

      rescue Exception => exception
        render json: {
          status: 401,
          message: 'Query unsuccessful at this time',
          body: @body,
          error: exception
        }.to_json  
      end
    
    end
  
    private
  
    def page_views_params
      params.permit(:urls,:before,:after,:interval)
    end

    def query_hash(body_params)
      @urls = body_params[:urls]
      @before = body_params[:before]
      @after = body_params[:after]
      @interval = body_params[:interval]
      
      hash = {
        body: {
          query: { 
            bool: {
              should: [
                {terms: {
                  page_url: []
                }}
              ],
              must: [
                {range: {
                  derived_tstamp: {
                    gte: @before,
                    lte: @after, 
                    format: 'dd/MM/yyyy'
                  }
                }}
              ]
            }
          },
          aggs: {
            page_views_over_time: {
              date_histogram: {
                field: 'derived_tstamp',
                interval: @interval
              },
              aggs: {
                urls_makeup: {
                  terms: {
                    field: 'page_url'
                  }
                }
              }
            }
          }
        }
      }
    end
    
  
  
  end  
end
