<template>
  <div id="app">
    <forecast />
  </div>
</template>

<script>
import Forecast from "./components/Forecast.vue";

export default {
  name: "app",
  components: {
    Forecast
  }
};
</script>
