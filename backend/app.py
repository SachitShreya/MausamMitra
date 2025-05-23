from fastapi import FastAPI
from fastapi.responses import HTMLResponse
import requests
from fastapi.staticfiles import StaticFiles

app = FastAPI()
app.mount("/static", StaticFiles(directory="../frontend"), name="static")



import os
from dotenv import load_dotenv

load_dotenv()  

API_KEY = os.getenv('OPENWEATHER_API_KEY')

BASE_URL = 'http://api.openweathermap.org/data/2.5/weather'

@app.get("/", response_class=HTMLResponse)
async def read_root():
    return """
    <html>
        <head>
            <title>MausamMitra</title>
            <link rel="stylesheet" type="text/css" href="/static/styles.css">
        </head>
        <body>
            <h1>Weather Report</h1>
            <input type="text" id="location" placeholder="Enter location">
            <button onclick="getWeather()">Get Weather</button>
            <div id="weatherResult"></div>
            <script src="/static/script.js"></script>
        </body>
    </html>
    """

@app.get("/weather/{location}")
async def get_weather(location: str):
    params = {
        'q': location,
        'appid': API_KEY,
        'units': 'metric'
    }
    response = requests.get(BASE_URL, params=params)
    data = response.json()
    
    if response.status_code == 200:
        weather_info = {
            'location': data['name'],
            'temperature': data['main']['temp'],
            'description': data['weather'][0]['description']
        }
        return weather_info
    else:
        return {'error': data.get('message', 'Location not found')}

# To run the application, use the command: uvicorn app:app --reload
