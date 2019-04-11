<template>
  <div>
    <!-- <img :src="url" alt> -->
    <video
      id="my-video"
      v-if="status =='video'"
      class="video-js vjs-default-skin"
      controls
      preload="auto"
      :poster="url"
    >
      <source :src="url" type="application/x-mpegURL">
    </video>
    <div v-if="status == 'picture'">
      <img :src="url" alt>
    </div>
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
    },
    url: {
      type: String
    }
  },
  data() {
    return {
      status: ""
    };
  },
  watch: {},
  mounted() {
    const imgType = ["jpg", "jpeg", "png"];
    const videoType = ["mp4", "m3u8"];
    const index = this.url.lastIndexOf(".");
    let filename = this.url.substring(index + 1);
    if (imgType.indexOf(filename.toLowerCase()) != -1) {
      //picture
      this.status = "picture";
    } else if (videoType.indexOf(filename.toLowerCase()) != -1) {
      //video
      this.status = "video";
      this.videoInit();
    } else {
      this.status = "other";
    }
  },
  methods: {
    videoInit() {
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
  }
};
</script>
<style lang="less">
#my-video {
  width: 100%;
  height: 500px;
}
</style>
