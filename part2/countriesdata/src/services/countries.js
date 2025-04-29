import axios from "axios";

const url = "https://studies.cs.helsinki.fi/restcountries/api/all";

const getAllCountries = () => {
    const req = axios.get(url);
    return req.then(response => response.data);
}

export default getAllCountries;