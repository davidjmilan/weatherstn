<template>
  <div>
    <h1>{{ currentTemp }}</h1>
    <p>{{ detailedForecast }}</p>
    <div style="display: inline-block; margin: 5px; width: 100px" v-for="forecast in dailyForecasts" :key="forecast.name">
      <p style="margin: 0px">{{ forecast.name }}<br />{{ forecast.temperature }}</p>
      <img height="50" width="50" :src="forecast.icon" style="border-radius: 5px" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { setInterval } from "timers";

const forecastURL = "https://api.weather.gov/gridpoints/BOX/66,74/forecast";
const forecastHourlyURL =
  "https://api.weather.gov/gridpoints/BOX/66,74/forecast/hourly";

export default {
  name: "Forecast",
  data() {
    return {
      currentTemp: 0,
      detailedForecast: "",
      dailyForecasts: []
    };
  },
  created() {
    axios.get(forecastHourlyURL).then(response => {
      this.currentTemp = response.data.properties.periods[0].temperature;
    });
    setInterval(() => {
      axios.get(forecastHourlyURL).then(response => {
        this.currentTemp = response.data.properties.periods[0].temperature;
      });
    }, 3600000);
    axios.get(forecastURL).then(response => {
      this.dailyForecasts = response.data.properties.periods;
      this.detailedForecast = response.data.properties.periods[0].detailedForecast;
    });
    setInterval(() => {
      axios.get(forecastURL).then(response => {
        this.dailyForecasts = response.data.properties.periods;
        this.detailedForecast = response.data.properties.periods[0].detailedForecast;
      });
    }, 1200000);
  }
};
</script>
