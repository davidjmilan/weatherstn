<template>
  <div>
    <img src="../assets/radarBackground.jpg" />
    <img
      v-for="(frame, i) in frames"
      :src="frame"
      class="animate"
      :ref="`animate__${i}`"
      :key="frame"
    />
  </div>
</template>

<script>
import axios from "axios";
import $ from "jquery";
import _ from "lodash";

const radarURL = "https://radar.weather.gov/ridge/RadarImg/N0R/BOX/";
const proxyURL = "http://localhost:8080/post?q=";

export default {
  name: "Radar",
  data() {
    return {
      frames: [],
      step: 0
    };
  },
  created() {
    axios.get(proxyURL + radarURL).then(this.processFileListing);
    setInterval(() => {
      axios.get(proxyURL + radarURL).then(this.processFileListing);
    }, 300000);
    setInterval(() => {
      this.$refs[`animate__${this.step}`][0].style.display = "none";
      this.step = this.step === this.frames.length - 1 ? 0 : this.step + 1;
      this.$refs[`animate__${this.step}`][0].style.display = "initial";
    }, 75);
  },
  methods: {
    processFileListing(result) {
      this.frames = _.chain($("a", $(result.data)).toArray())
        .filter(item => item.href.includes("N0R.gif"))
        .map(item => radarURL + item.innerText)
        .value()
        .slice(15);
      this.frames.forEach(src => {
        axios.get(proxyURL + src).catch(() => {
          this.deleteFrame(this.frames.indexOf(src));
        });
      });
    },
    deleteFrame(index) {
      this.frames.splice(index);
    }
  }
};
</script>

<style scoped>
div {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 0;
}
img {
  width: 380px;
}
.animate {
  position: absolute;
  z-index: 1;
  bottom: 0;
  right: 0;
}
</style>
