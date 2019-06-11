<template>
  <div>
    <header>
      <h1 style="margin:10px; font-size:20px; height:144px; overflow: hidden;">
        {{ detailedForecast }}
      </h1>
      <p
        style="font-size: 80px; margin-top: 10px; margin-bottom: 10px; margin-left: 100px"
      >
        {{ currentData.current }}
        <font-awesome-icon :icon="currentData.icon" />
      </p>
      <p
        width="400"
        style="font-size: 30px; margin-top:5px; margin-bottom: 5px; margin-left: 100px"
      >
        {{ currentData.high }} / {{ currentData.low }}
      </p>
    </header>
    <footer>
      <div
        style="display: inline-block; margin: 5px; width: 115px"
        v-for="forecast in dailyForecasts"
        :key="forecast.name"
      >
        <p style="margin: 0px">
          {{ forecast.name }}
          <br />
          {{ forecast.temperature }} / {{ forecast.low }}
        </p>
        <font-awesome-icon :icon="forecast.icon" />
      </div>
    </footer>
  </div>
</template>

<script>
import axios from "axios";
import _ from "lodash";
import { setInterval } from "timers";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBolt,
  faCloudMeatball,
  faSun,
  faCloud,
  faSnowflake,
  faCloudShowersHeavy,
  faSmog,
  faQuestion
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  faBolt,
  faCloudMeatball,
  faSun,
  faCloud,
  faSnowflake,
  faCloudShowersHeavy,
  faSmog,
  faQuestion
);

const forecastURL = "https://api.weather.gov/gridpoints/BOX/66,74/forecast";
const forecastHourlyURL =
  "https://api.weather.gov/gridpoints/BOX/66,74/forecast/hourly";

export default {
  name: "Forecast",
  components: {
    "font-awesome-icon": FontAwesomeIcon
  },
  data() {
    return {
      currentData: {
        high: 0,
        low: 0,
        current: 0,
        icon: "question"
      },
      detailedForecast: "",
      dailyForecasts: [],
      dummy: []
    };
  },
  created() {
    axios.get(forecastHourlyURL).then(this.processHourly);
    setInterval(() => {
      axios.get(forecastHourlyURL).then(this.processHourly);
    }, 3600000);
    axios.get(forecastURL).then(this.processDaily);
    setInterval(() => {
      axios.get(forecastURL).then(this.processDaily);
    }, 1200000);
  },
  methods: {
    processHourly(response) {
      this.currentData.current =
        response.data.properties.periods[0].temperature;
      this.currentData.icon = this.convertIcon(
        response.data.properties.periods[0].icon
      );
    },
    processDaily(response) {
      this.currentData.low = response.data.properties.periods[0].isDaytime
        ? response.data.properties.periods[1].temperature
        : response.data.properties.periods[0].temperature;
      this.currentData.high = response.data.properties.periods[0].isDaytime
        ? response.data.properties.periods[0].temperature
        : "-";
      this.dailyForecasts = _.chain(response.data.properties.periods)
        .dropWhile(item => item.number === 1 || item.name === "Tonight")
        .chunk(2)
        .filter(item => item.length === 2)
        .map(item => _.set(item[0], "low", item[1].temperature))
        .map(item => _.set(item, "icon", this.convertIcon(item.icon)))
        .value();
      this.detailedForecast =
        response.data.properties.periods[0].detailedForecast;
    },
    convertIcon(icon) {
      if (icon.includes("tsra")) {
        return "bolt";
      }
      if (
        icon.includes("sleet") ||
        icon.includes("fzra") ||
        icon.includes("rain_snow")
      ) {
        return "cloud-meatball";
      }
      if (
        icon.includes("skc") ||
        icon.includes("few") ||
        icon.includes("hot") ||
        icon.includes("cold")
      ) {
        return "sun";
      }
      if (
        icon.includes("sct") ||
        icon.includes("bkn") ||
        icon.includes("ovc")
      ) {
        return "cloud";
      }
      if (icon.includes("snow") || icon.includes("blizzard")) {
        return "snowflake";
      }
      if (icon.includes("rain")) {
        return "cloud-showers-heavy";
      }
      if (
        icon.includes("haze") ||
        icon.includes("smoke") ||
        icon.includes("dust") ||
        icon.includes("fog")
      ) {
        return "smog";
      }
      return "question";
    }
  }
};
</script>

<style scoped>
header {
  width: 400px;
}
i {
  color: #0077c2;
  font-size: 50px;
  margin: 10px;
}
footer {
  position: absolute;
  text-align: center;
  bottom: 0px;
  margin-left: 15px;
}
</style>
