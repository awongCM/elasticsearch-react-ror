import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from "axios";
import DatePicker from 'react-date-picker';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

// TODO
const options = [
  { value: 'm', label: 'Minute' },
  { value: 'h', label: 'Hour' },
  { value: 'w', label: 'Week' },
  { value: 'M', label: 'Month' },
  { value: 'q', label: 'Quarter' },
  { value: 'y', label: 'Year' },
];

const defaultOption = options[0];

const chartColors = [
      "#6B5B95",
      "#ECDB54",
      "#E94B3C",
      "#6F9FD8",
      "#944743",
      "#DBB1CD",
      "#00A591",
      "#6B5B95",
      "#6C4F3D",
      "#BFD641"
];

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      elasticsearch_data: null,
      beforeDate: new Date(2017, 5, 1),
      afterDate: new Date(2017, 5, 30),
      intervalValue: '',
      intervalType: 'm'
    };
  }

  componentDidMount() {
    console.log('did mount');

    axios.get('/api/page_views')
      .then(res => {
        console.log('Response: ', res);
      })
      .catch(err => console.error('Error: ', err));
  }

  onBeforeDateChange(date){
    this.setState({beforeDate: date});
  }

  onAfterDateChange(date){
    this.setState({afterDate: date});
  }

  onIntervalValueChange(event){
    this.setState({intervalValue: event.target.value });
  }

  onSelect(intervalType) {
    console.log('intervalType value', intervalType);
    this.setState({intervalType: intervalType.value});
  }

  onSubmit(event) {
    event.preventDefault();
    console.log('fomr submittted', this.state);
    const {beforeDate, afterDate, intervalType, intervalValue} = this.state;
    console.log(getFormattedDate(beforeDate));
    console.log(getFormattedDate(afterDate));
    console.log('interval', intervalValue + intervalType);

    const data = {
      before: getFormattedDate(beforeDate),
      after: getFormattedDate(afterDate),
      interval: intervalValue + intervalType
    };

    axios.post('/api/page_views', data)
      .then(res => {
        console.log('Response: ', res);
        let data = parseResponseData(res.data);
        this.setState({elasticsearch_data: data});
      })
      .catch(err => console.error('Error: ', err));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Streem API Service App</h1>
        </header>
        <div className="form-group">
          <form>
          <label htmlFor="beforeDate">Start Date: </label>          
          <DatePicker name="beforeDate"
            onChange={(e) => this.onBeforeDateChange(e)}
            value={this.state.beforeDate}
            />
          <label htmlFor="afterDate">End Date: </label>
          <DatePicker name="afterDate"
            onChange={(e) => this.onAfterDateChange(e)}
            value={this.state.afterDate}
            />
          <label htmlFor="IntervalValue">Interval: 
            <input type="text" name="IntervalValue"
              onChange={this.onIntervalValueChange.bind(this)}
              value={this.state.intervalValue}
            />
          </label>
          <Dropdown options={options} onChange={this.onSelect.bind(this)} value={defaultOption} placeholder="Select an option" />          
          <div className="button-group">
            <button type="button" onClick={this.onSubmit.bind(this)}>Submit</button>
          </div>
          </form>
          
        </div>
        {/* TODO */}
        <div className="histogram-container">
          <h2>Page Views Histogram Graph</h2>
          <BarChart width={900} height={600} data={this.state.elasticsearch_data}
              margin={{top: 20, right: 30, left: 20, bottom: 5}}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="name"/>
          <YAxis/>
          <Tooltip/>
          <Legend />
          <Bar dataKey="0" stackId="a" fill="#6B5B95" />
          <Bar dataKey="1" stackId="a" fill="#ECDB54" />       
          <Bar dataKey="2" stackId="a" fill="#E94B3C" />
          <Bar dataKey="3" stackId="a" fill="#6F9FD8" />
          <Bar dataKey="4" stackId="a" fill="#944743" />
          <Bar dataKey="5" stackId="a" fill="#DBB1CD" />
          <Bar dataKey="6" stackId="a" fill="#00A591" />
          <Bar dataKey="7" stackId="a" fill="#6B5B95" />
          <Bar dataKey="8" stackId="a" fill="#6C4F3D" />
          <Bar dataKey="9" stackId="a" fill="#BFD641" />
        </BarChart>
        </div>

        
      </div>
    );
  }
}

const parseResponseData = (data) => {
  console.log('ready to parse response data', data);
  // expects response property

  var parsedData = [];
  const {aggregations} = data.response;

   for (let i = 0; i < aggregations.page_views_over_time.buckets.length; i++) {
     console.log('Iterating columns...');
     const item = aggregations.page_views_over_time.buckets[i];
     console.log('items...', item);
     const o = {name: item.key_as_string};
     const {buckets} = item.urls_makeup;
     
     for (let j = 0; j < buckets.length; j++) {
       const sub_item = buckets[j];
       console.log('Object sub_item props', sub_item);
       o[j] = sub_item.doc_count;  
     }
     parsedData.push(o);
     
   }
  console.log('parsedData', parsedData); 

  return parsedData;
};

const getFormattedDate = (date) => {
  var year = date.getFullYear();

  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  
  return day + '/' + month + '/' + year;
};

export default App;
