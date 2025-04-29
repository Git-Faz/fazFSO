import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import getAllCountries from "./services/countries";
import Data from "./components/Data"

const App = () => {
  const [allCountries, setAllCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);

  useEffect(() => {
    getAllCountries()
      .then(allCountries => setAllCountries(allCountries));
      console.log(`all countries loaded`);
  }, [])

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    console.log(searchTerm);
    const countries =
      searchTerm.trim().length !== 0
        ? allCountries.filter((country) =>
          country.name.common
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase())
          )
        : allCountries;
    setSearch(searchTerm);
    setFilteredCountries(countries);
    console.log(filteredCountries);
    
  }

  const selectedCountry = (country) => {
    setFilteredCountries([country]);
    console.log('showing: '+country.name.common);
  }

  return (
    <div>
      <SearchBar search={search} setSearch={handleSearch} />
      <Data filteredCountries={filteredCountries} selectCountry={selectedCountry} />
    </div>
  )
}

export default App;