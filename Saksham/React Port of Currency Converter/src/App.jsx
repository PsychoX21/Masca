import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import { CurrencySelector, AmountSelector } from './components/Selectors';
import Info from './components/Info';
import './App.css';

const App = () => {
  const [baseCurrency, setBaseCurrency] = useState('INR');
  const [targetCurrency, setTargetCurrency] = useState('USD');
  const [amount, setAmount] = useState(100);
  const [result, setResult] = useState(0);
  const [rate, setRate] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [basedata, setBasedata] = useState([]);
  const [targetdata, setTargetdata] = useState([]);


  const fetchCurrencyData = async () => {
    const currencyInfoUrl = 'https://openexchangerates.org/api/currencies.json';
    const response = await fetch(currencyInfoUrl);
    const data = await response.json();
    const options = Object.entries(data).map(([code, name]) => ({ code, name }));
    setCurrencyOptions(options);
  };

  const fetchExchangeRates = async () => {
    const apiKey = 'bcfba3d988786f729e19534d';
    const apiUrlbase = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`;
    const apiUrltarget = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${targetCurrency}`;
    const responsebase = await fetch(apiUrlbase);
    const responsetarget = await fetch(apiUrltarget);
    const data1 = await responsebase.json();
    const data2 = await responsetarget.json();
    const ratesData1 = data1.conversion_rates;
    const ratesData2 = data2.conversion_rates;
    setBasedata(ratesData1);
    setTargetdata(ratesData2);

    setRate(`1 ${baseCurrency} = ${ratesData1[targetCurrency].toFixed(3)} ${targetCurrency}`);
    setResult((amount * ratesData1[targetCurrency]).toFixed(3));
    setTimestamp(`Last updated: ${new Date(data1.time_last_update_unix * 1000).toLocaleString()}`);
  };

  useEffect(() => {
    fetchCurrencyData();
  }, []);

  useEffect(() => {
    fetchExchangeRates();
  }, [baseCurrency, targetCurrency]);

  return (
    <div className="App">
      <Header />
      <main>
        <section id="main">
          <section className='selector'>
            <CurrencySelector
              label="Base Currency"
              id="base"
              options={currencyOptions}
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
            />
            <AmountSelector
              label="Enter Amount"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </section>

          <button id="swap" onClick={() => [setBaseCurrency(targetCurrency), setTargetCurrency(baseCurrency)]}></button>

          <section className='selector'>
            <CurrencySelector
              label="Target Currency"
              id="target"
              options={currencyOptions}
              value={targetCurrency}
              onChange={(e) => setTargetCurrency(e.target.value)}
            />
            <AmountSelector label="Converted Amount" id="result" value={result} isReadOnly />
          </section>
        </section>

        <Info rate={rate} timestamp={timestamp} />

      </main>
    </div>
  );
};

export default App;
