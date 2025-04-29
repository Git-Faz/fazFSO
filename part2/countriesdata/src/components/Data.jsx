import Country from "./Country";
import Countries from "./Countries";

const Data = ({ filteredCountries, selectCountry }) => {
    if (filteredCountries.length > 10) {
        return <p>Too many matches, specify another filter</p>;
    }

    if (filteredCountries.length > 1) {
        return <Countries countries={filteredCountries} selectedCountry={selectCountry} />;
    }

    if (filteredCountries.length === 1 && filteredCountries[0]) {
        return <Country country={filteredCountries[0]} />;
    }

    return <p>No countries match the filter.</p>; // fallback case
};

export default Data;
