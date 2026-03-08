// IMPORTANT: Get your own free API key at https://openweathermap.org/
const API_KEY = "paste_your_openweathermap_api_key_here"; // ← CHANGE THIS
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const loadingDiv = document.getElementById("loading");
const resultDiv = document.getElementById("result");
const errorDiv = document.getElementById("error");

// ────────────────────────────────────────────────
function showLoading() {
  loadingDiv.classList.remove("hidden");
  resultDiv.classList.add("hidden");
  errorDiv.classList.add("hidden");
}

function hideLoading() {
  loadingDiv.classList.add("hidden");
}

function showError(message) {
  errorDiv.textContent = message;
  errorDiv.classList.remove("hidden");
  resultDiv.classList.add("hidden");
  hideLoading();
}

function showWeather(data) {
  // Clear previous content
  resultDiv.innerHTML = "";

  const city = data.name;
  const tempC = Math.round(data.main.temp - 273.15);
  const description = data.weather[0].description;
  const humidity = data.main.humidity;
  const iconCode = data.weather[0].icon;

  const html = `
    <h2>${city}</h2>
    <div class="weather-info">
      <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${description}">
      <p class="temp">${tempC}°C</p>
      <p>${description.charAt(0).toUpperCase() + description.slice(1)}</p>
      <p>Humidity: ${humidity}%</p>
    </div>
  `;

  resultDiv.innerHTML = html;
  resultDiv.classList.remove("hidden");
  errorDiv.classList.add("hidden");
  hideLoading();
}

// ────────────────────────────────────────────────
async function getWeather(city) {
  if (!city.trim()) {
    showError("Please enter a city name");
    return;
  }

  showLoading();

  try {
    const response = await fetch(
      `${API_URL}?q=${city}&appid=${API_KEY}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("City not found");
      }
      throw new Error("Something went wrong");
    }

    const data = await response.json();
    
    // Save to localStorage
    localStorage.setItem("lastCity", city);
    
    showWeather(data);

  } catch (err) {
    showError(err.message.includes("not found") 
      ? "City not found 😕" 
      : "Failed to fetch weather data");
  }
}

// ────────────────────────────────────────────────
// Event listeners
searchBtn.addEventListener("click", () => {
  getWeather(cityInput.value);
});

cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    getWeather(cityInput.value);
  }
});

// Load last searched city on page load
document.addEventListener("DOMContentLoaded", () => {
  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) {
    cityInput.value = lastCity;
    getWeather(lastCity);
  }
});
