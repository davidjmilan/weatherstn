<template>
  <div>
    <h1>{{ currentTemp }}</h1>
    <div v-for="forecast in dailyForecasts" :key="forecast.name">
      <p style="margin: 0px">{{ forecast.name }} : {{ forecast.temperature }}</p>
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
    });
    setInterval(() => {
      axios.get(forecastURL).then(response => {
        this.dailyForecasts = response.data.properties.periods;
      });
    }, 1200000);
  }
};
</script>
