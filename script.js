const apiKey = "2e53162cc0e31b108fcb137c9bae9a61";

async function getWeather() {
    const city = document.getElementById("city-input").value;

    if (city === "") {
        alert("Please enter a city name!");
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === "404") {
            alert("City not found! Please enter a valid city.");
            return;
        }

        document.getElementById("city-name").innerText = `${data.name}, ${data.sys.country}`;
        document.getElementById("temperature").innerText = `🌡️ Temperature: ${data.main.temp}°C (Feels like: ${data.main.feels_like}°C)`;
        document.getElementById("weather-condition").innerText = `🌤️ Condition: ${data.weather[0].description}`;

        const iconCode = data.weather[0].icon;
        document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        getForecast(city);

    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Error fetching weather data. Please try again.");
    }
}

async function getWeatherByLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

            try {
                const response = await fetch(url);
                const data = await response.json();

                document.getElementById("city-name").innerText = `${data.name}, ${data.sys.country}`;
                document.getElementById("temperature").innerText = `🌡️ Temperature: ${data.main.temp}°C (Feels like: ${data.main.feels_like}°C)`;
                document.getElementById("weather-condition").innerText = `🌤️ Condition: ${data.weather[0].description}`;

                const iconCode = data.weather[0].icon;
                document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

                getForecast(data.name);
                
            } catch (error) {
                console.error("Error fetching weather data:", error);
                alert("Could not fetch weather for your location.");
            }
        });
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

async function getForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        let forecastHTML = "<h3>3-Day Forecast</h3>";

        for (let i = 0; i < data.list.length; i += 8) {
            let day = data.list[i];
            forecastHTML += `
                <div class="forecast-item">
                    <p>${new Date(day.dt_txt).toDateString()}</p>
                    <p>🌡️ ${day.main.temp}°C</p>
                    <p>🌤️ ${day.weather[0].description}</p>
                </div>
            `;
        }

        document.getElementById("forecast").innerHTML = forecastHTML;
    } catch (error) {
        console.error("Error fetching forecast data:", error);
        alert("Could not fetch weather forecast.");
    }
}

const darkModeToggle = document.getElementById("dark-mode-toggle");

darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

document.getElementById("dark-mode-toggle").addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
});

window.onload = function () {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }
};
