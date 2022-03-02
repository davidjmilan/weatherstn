<template>
  <div>
    <img src="../assets/radarBackground.jpg" />
    <img
      v-for="(frame, i) in frames"
      :src="'http://localhost:8080/image?q=' + frame"
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

// Webpage listing all animation frames
const radarURL = "https://mrms.ncep.noaa.gov/data/RIDGEII/L2/KBOX/BREF_RAW/";
// Proxy url for avoiding CORS issues
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
    // Get animation frames
    axios.get(proxyURL + radarURL).then(this.processFileListing);
    // Update animation frames every 5 minutes
    setInterval(() => {
      axios.get(proxyURL + radarURL).then(this.processFileListing);
    }, 300000);
    // Animate frames, every 75ms
    setInterval(() => {
      this.$refs[`animate__${this.step}`][0].style.display = "none";
      this.step = this.step === this.frames.length - 1 ? 0 : this.step + 1;
      this.$refs[`animate__${this.step}`][0].style.display = "initial";
    }, 75);
  },
  methods: {
    processFileListing(result) {
      // Gets frame listing and puts sources into an array.
      // Frames appear about every 7min, and around 135 are saved on the listing.
      // Each frame takes about 0.5s to process serverside (usually only once b/c of 304 requests.)
      this.frames = _.chain($("a", $(result.data)).toArray())
        .map(item => radarURL + item.innerText)
        .value()
        .splice(-10); // How many frames to display. Negative value takes from end of array.

      // Old code to check if frame is a valid image. Probably not required anymore.
      // this.frames.forEach(src => {
      //   axios.get(proxyURL + src).catch(() => {
      //     this.deleteFrame(this.frames.indexOf(src));
      //   });
      // });
    },
    // Old code to delete invalid frames
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
