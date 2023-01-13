

document.querySelector("#city-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const city = document.querySelector("#city-input").value;
    const APIKey = "97838015f216fd46bdd9041d10d6674a";
    const forecastContainer = document.querySelector("#forecast-container");
    const historyList = document.querySelector("#history-list");

    let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  history.push(city);
  localStorage.setItem("searchHistory", JSON.stringify(history));

  historyList.innerHTML = "";
  history.forEach(function(item) {
    historyList.innerHTML += `<li>${item}</li>`;
  });
    
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}`)
      .then(response => response.json())
      .then(data => {
        forecastContainer.innerHTML = '';
        const forecastData = data.list;
        
        const forecastByDay = forecastData.reduce((forecast, item) => {
          const date = new Date(item.dt * 1000);
          const day = date.toDateString();
          if (!forecast[day]) {
            forecast[day] = {
              date: day,
              city: data.city.name,
              icon: `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
              minTemp: item.main.temp_min,
              maxTemp: item.main.temp_max,
              weather: item.weather[0].description,
              humidity: item.main.humidity,
              windSpeed: item.wind.speed
            };
          } else {
            forecast[day].minTemp = Math.min(forecast[day].minTemp, item.main.temp_min);
            forecast[day].maxTemp = Math.max(forecast[day].maxTemp, item.main.temp_max);
          }
          return forecast;
        }, {});
    
        
        const forecastForNext5Days = Object.values(forecastByDay).slice(0, 5);
    
        
        forecastForNext5Days.forEach(function(day) {
          forecastContainer.innerHTML += `
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">${day.date}</h5>
              <p>City: ${day.city}</p>
              <img src="${day.icon}" alt="Weather icon" width="50" height="50">
              <p>Temperature: ${day.minTemp} - ${day.maxTemp} &#8451;</p>
              <p>Weather: ${day.weather}</p>
              <p>Humidity: ${day.humidity}%</p>
              <p>Wind Speed: ${day.windSpeed} m/s</p>
            </div>
          </div>
          `;
        });
      })
      .catch(error => console.log(error));
  });