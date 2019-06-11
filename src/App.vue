<template>
  <div id="app">
    <div id="forecast">
      <forecast />
    </div>
    <div id="radar">
      <radar />
    </div>
  </div>
</template>

<script>
import Forecast from "./components/Forecast.vue";
import Radar from "./components/Radar.vue";

export default {
  name: "app",
  components: {
    Forecast,
    Radar
  }
};
</script>

<style>
#forecast {
  display: inline-block;
  font-family: "Roboto", Arial, Helvetica, sans-serif;
  color: #29434e;
}

#radar {
  display: inline-block;
}

#app {
  cursor: none;
}
</style>
