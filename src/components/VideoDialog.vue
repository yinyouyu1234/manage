<template>
  <div>
    <!-- <img :src="url" alt> -->
    <video
      id="my-video"
      class="video-js vjs-default-skin"
      controls
      preload="auto"
      poster="../assets/images/login-background.png"
    >
      <source :src="backgroundUrl" type="application/x-mpegURL">
    </video>
  </div>
</template>
<script>
import "video.js/dist/video-js.css";
import videojs from "video.js";
import "videojs-contrib-hls";
export default {
  name: "VideoDialog",
  props: {
    backgroundUrl: {
      type: String,
      default: "http://127.0.0.1:7086/aaa/213/stream/1.m3u8"
    }
  },
  data() {
    return {};
  },
  watch: {},
  mounted() {
    videojs(
      "my-video",
      {
        bigPlayButton: false,
        textTrackDisplay: false,
        posterImage: true,
        errorDisplay: false,
        controlBar: true
      },
      function() {
        this.play();
      }
    );
  }
};
</script>
<style lang="less">
#my-video {
  width: 100%;
  height: 500px;
}
</style>
