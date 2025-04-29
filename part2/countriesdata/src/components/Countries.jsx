const Countries = ({ countries, selectedCountry }) => {
    return countries.map(country => (
        <div key={country.name.common}>
            <p>{country.name.common} <button onClick={() => selectedCountry(country)}>show</button></p> 
        </div>
    ));
}

export default Countries;