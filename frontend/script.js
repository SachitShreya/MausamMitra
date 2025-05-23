document.addEventListener('DOMContentLoaded', function() {
    const weatherForm = document.getElementById('weather-form');
    const locationInput = document.getElementById('location');
    const weatherReport = document.getElementById('weather-report');

    weatherForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const location = locationInput.value;

        fetch(`/api/weather?location=${encodeURIComponent(location)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    weatherReport.innerHTML = `<p>${data.error}</p>`;
                } else {
                    weatherReport.innerHTML = `
                        <h2>Weather in ${data.location}</h2>
                        <p>Temperature: ${data.temperature}°C</p>
                        <p>Condition: ${data.condition}</p>
                    `;
                }
            })
            .catch(error => {
                weatherReport.innerHTML = `<p>Error: ${error.message}</p>`;
            });
    });
});
let map, marker;


function getWeather() {
    const location = document.getElementById('location').value;
    if (!location) return;

    fetch(`/weather/${location}`)
        .then(res => res.json())
        .then(data => {
            const weatherDiv = document.getElementById('weatherResult');
            if (data.error) {
                weatherDiv.innerHTML = `<span style="color:red">${data.error}</span>`;
                return;
            }
            weatherDiv.innerHTML = `
                <div class="weather-card">
                    <h2>${data.location}</h2>
                    <div class="temp">${data.temperature}°C</div>
                    <div class="desc">${data.description}</div>
                </div>
            `;
        });
}

function showMap(location) {
    // Use OpenStreetMap Nominatim API for geocoding
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`)
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) return;
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);

            if (map) {
                map.setView([lat, lon], 10);
                if (marker) marker.setLatLng([lat, lon]);
                else marker = L.marker([lat, lon]).addTo(map);
            } else {
                map = L.map('map').setView([lat, lon], 10);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors'
                }).addTo(map);
                marker = L.marker([lat, lon]).addTo(map);
            }
        });
}