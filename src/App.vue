<template>
  <div id="app">
    <forecast />
  </div>
</template>

<script>
import Forecast from "./components/Forecast.vue";
import "./assets/css/weathericons.min.css";

export default {
  name: "app",
  components: {
    Forecast
  }
};
</script>
