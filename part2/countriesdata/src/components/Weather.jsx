import { useState, useEffect } from "react";
import getWeather from "../services/weather";

const Weather = ({ name, lat, lon }) => {
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        getWeather(lat, lon)
            .then(weather => setWeather(weather))
            .catch(error => setError(error));
    }, [lat, lon]);

    return (
        <div>
            <h3>Weather in {name}</h3>
            {weather && <p>Temperature {weather.main.temp} Celcius</p>}
            {error && <p>{error}</p>}
            {weather && (<img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
            />
            )}
        </div>
    )
}

export default Weather;