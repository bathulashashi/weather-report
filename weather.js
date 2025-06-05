const apiKey = "7352e8aa20d855a4bfe0215b091abb5a"; 

// Fetch weather by city
async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found.");
    const data = await response.json();
    displayWeather(data);
    getForecast(city);
  } catch (error) {
    showError(error.message);
  }
}

// Display current weather
function displayWeather(data) {
  const weatherResult = document.getElementById("weatherResult");
  const { name, dt, main, wind, weather } = data;
  const date = new Date(dt * 1000).toISOString().split("T")[0];
  const icon = weather[0].icon;
  const desc = weather[0].description;

  weatherResult.classList.remove("hidden");
  weatherResult.innerHTML = `
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-xl font-bold">${name} (${date})</h2>
        <p>Temperature: ${main.temp.toFixed(1)}°C</p>
        <p>Wind: ${wind.speed} M/S</p>
        <p>Humidity: ${main.humidity}%</p>
      </div>
      <div class="text-center">
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" />
        <p class="capitalize">${desc}</p>
      </div>
    </div>
  `;
}

// 5-Day Forecast
async function getForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Could not fetch forecast.");
    const data = await response.json();
    displayForecast(data);
  } catch (error) {
    showError("Forecast unavailable.");
  }
}

// Display forecast cards
function displayForecast(data) {
  const forecastEl = document.getElementById("forecast");
  forecastEl.innerHTML = "";

  const days = data.list.filter(f => f.dt_txt.includes("12:00:00")).slice(0, 5);

  days.forEach(day => {
    const date = day.dt_txt.split(" ")[0];
    const icon = day.weather[0].icon;
    const desc = day.weather[0].description;
    const temp = day.main.temp.toFixed(1);
    const wind = day.wind.speed;
    const humidity = day.main.humidity;

    forecastEl.innerHTML += `
      <div class="bg-gray-700 text-white rounded p-4 text-center shadow">
        <h3 class="font-bold mb-2">(${date})</h3>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" class="mx-auto" alt="${desc}" />
        <p class="capitalize">${desc}</p>
        <p class="text-sm">Temp: ${temp}°C</p>
        <p class="text-sm">Wind: ${wind} M/S</p>
        <p class="text-sm">Humidity: ${humidity}%</p>
      </div>
    `;
  });
}

// Search city
function searchCity() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    showError("Please enter a city name.");
    return;
  }
  getWeather(city);
}

// Geolocation weather
function getWeatherByLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported.");
    return;
  }

  navigator.geolocation.getCurrentPosition(async pos => {
    const { latitude, longitude } = pos.coords;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Location weather failed.");
      const data = await response.json();
      displayWeather(data);
      getForecast(data.name);
    } catch (error) {
      showError("Could not get weather for your location.");
    }
  }, () => {
    showError("Location permission denied.");
  });
}

// Show error
function showError(msg) {
  document.getElementById("weatherResult").classList.remove("hidden");
  document.getElementById("weatherResult").innerHTML = `
    <p class="text-white text-center font-semibold">${msg}</p>
  `;
  document.getElementById("forecast").innerHTML = "";
}
