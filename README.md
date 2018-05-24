# elasticsearch-react-ror

Streem Page Views Histogram using ElasticSearch

### Ingredients used for this app
* Rails 5 (API only)
* React
* ReCharts
* ElasticSearch(external services only)
* Axios
* Yarn
* NPM

### Instructions to setup and run the app
1. Navigate to the root folder of the project.
2. Check your RAILS version: 5 and above, and run `bundle install`.
3. To start up Rails API service, type `rails s -p 3001`. The service needs port 3001 as the proxy server is set up to serve the single page app.
4. To get the React single page app up and running, navigate to the `client` folder.
5. Run `npm install` or `npm i`
6. Run `yarn start`.

## Keynotes.
The API service has only one endpoint `page_views` that only facilitates `GET` and `POST` requests. With `POST` requests, it requires the following body params, to the Elasticsearch server.

```
{
  "urls": [<list of urls>],
  "before": <start date >,
  "after": <end date>,
  "interval": <interval times used for making date histogram aggregates>
}
```

At the time of writing, I have not been successful in finding a way to filter aggregates results for a specific list of `urls` provided in the body params. Thus, the data histogram aggregates will retrieve all urls' page views, using the supplied `before`, `after` and `interval` params. In the same manner, the single page app has UI input control for the 3 params, respectively.

### TODO
1. Find out how to get `urls` filter aggregates working with the date histogram data.
2. Refactor ElasticSearch Ruby library to have its own separate client/module
3. Provide a UI textarea field input for entering list of urls once step 1. is completed.
