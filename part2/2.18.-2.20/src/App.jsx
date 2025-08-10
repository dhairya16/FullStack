import { useState, useEffect } from "react";
import axios from "axios";

const CountryInfo = ({ country, weather }) => {
  if (!country || !country.name) return null;

  return (
    <>
      <h1>{country.name.common}</h1>
      <div>Capital {country.capital[0]}</div>
      <div>Area {country.area}</div>
      <h2>Languages</h2>
      <ul>
        {Object.entries(country.languages).map(([code, language]) => (
          <li key={code}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} />
      <h1>Weather in {country.name.common}</h1>
      <p>Temperature {weather.temp}</p>
      <img src="https://openweathermap.org/img/wn/04d.png" />
      <p>Wind {weather.wind} m/s</p>
    </>
  );
};

const CountryList = ({ countries, showCountryHandler }) => {
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  }

  return countries.map((c) => (
    <div key={c.name.common}>
      {c.name.common}{" "}
      <button onClick={() => showCountryHandler(c)}>show</button>
    </div>
  ));
};

function App() {
  const [value, setValue] = useState("");
  const [countries, setCountries] = useState([]);
  const [countryDetail, setCountryDetail] = useState(null);
  const [countryWeather, setCountryWeather] = useState({ temp: 0, wind: 0 });

  useEffect(() => {
    if (value.length === 0) {
      setCountries([]);
      return;
    }

    const url = "https://studies.cs.helsinki.fi/restcountries/api/all";
    axios
      .get(url)
      .then((result) => result.data)
      .then((countries) => {
        const filteredCountries = countries.filter((c) =>
          c.name.common.toLowerCase().includes(value.toLowerCase())
        );
        setCountries(filteredCountries);
      });
  }, [value]);

  useEffect(() => {
    if (countries.length === 1) {
      setCountryDetail(countries[0]);
    }
  }, [countries]);

  useEffect(() => {
    if (!countryDetail) return;
    const api_key = import.meta.env.VITE_WEATHER_API_KEY;
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${countryDetail.name.common}&appid=${api_key}`;
    axios
      .get(url)
      .then((result) => result.data)
      .then((data) => {
        const temp = data.main.temp;
        const wind = data.wind.speed;
        setCountryWeather({ temp, wind });
      });
  }, [countryDetail]);

  const handleInput = (event) => setValue(event.target.value);

  const showCountryHandler = (country) => setCountryDetail({ ...country });

  return (
    <>
      find countries<span> </span>
      <input value={value} onChange={handleInput} />
      {countries.length === 1 ? (
        <CountryInfo country={countryDetail} weather={countryWeather} />
      ) : (
        <>
          <CountryList
            countries={countries}
            showCountryHandler={showCountryHandler}
          />
          {countryDetail && (
            <CountryInfo country={countryDetail} weather={countryWeather} />
          )}
        </>
      )}
    </>
  );
}

export default App;
