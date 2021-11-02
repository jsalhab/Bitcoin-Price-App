import React, { useState, useEffect } from 'react';
import Chart from "react-apexcharts";
import axios from 'axios';
import LoadingSpinner from "./components/shared/loading-spinner/LoadingSpinner"
import "./App.css";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [series, setSeries] = useState([]);

  const options = [
    { value: 'USD', text: 'USD' },
    { value: 'EUR', text: 'EUR' },
    { value: 'CNY', text: 'CNY' },
    { value: 'JPY', text: 'JPY' },
    { value: 'PLN', text: 'PLN' }
  ];

  useEffect(() => {
    getCurrentPrice('USD');
    getChartData('USD');
    return () => {
      setLoading(false);
    }

  }, []);

  const handleSelect = async (e) => {
    setCurrency(e.target.value);
    getCurrentPrice(e.target.value);
  };

  const getCurrentPrice = async (curr) => {
    const res = await axios.get(`https://api.coindesk.com/v1/bpi/currentprice/${curr}.json`)
    setCurrency(res.data.bpi[curr].code);
    setPrice(res.data.bpi[curr].rate);
    getChartData(curr);
  }

  const getChartData = async (curr) => {
    const res = await axios.get(`https://api.coindesk.com/v1/bpi/historical/close.json?${curr}.json`)
    const categories = Object.keys(res.data.bpi);
    const series = Object.values(res.data.bpi);

    setChartData({
      xaxis: {
        categories: categories
      }
    })
    setSeries([
      {
        name: "series-1",
        data: series
      }
    ])
    setLoading(false);
  }

  return (
    <div className="App" data-test="app-component">
      <h1>Coindesk API Data</h1>
      {loading ?
        <div><LoadingSpinner /></div> :
        <div className='warpper'>
          <div>
            <div className="dropdown">
              <select
                role="dropdown"
                value={currency}
                onChange={handleSelect}
              >
                {options.map(currency => (
                  <option data-testid={`option-${currency.value}`} key={currency.value} value={currency.value}>{currency.text}</option>
                ))}
              </select>
            </div>

            <div className='price'>
              <div>
                <div className='card'>
                  <div data-testid="currency" className='currency'>{currency} Price</div>
                  <div data-testid="price">{price}</div>
                </div>
              </div>
            </div>
          </div>

          <div className='chart'>
            <Chart
              options={chartData}
              series={series}
              type="line"
              data-testid="chart"
            />
          </div>
        </div>

      }
    </div>
  );
}

export default App;
