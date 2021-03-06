<template>
  <div class="video-list">
    <div v-for="item in videoList" v-bind:video="item" v-bind:key="item.id" class="video-item">
      <Moveable
        class="moveable"
        ref="testical"
        v-bind="moveable"
        @drag="handleDrag"
        @resize="handleResize"
        @scale="handleScale"
        @rotate="handleRotate"
        @warp="handleWarp"
        @pinch="handlePinch"
      >
        <video
          autoplay
          playsinline
          ref="videos"
          :height="cameraHeight"
          :muted="item.muted"
          :id="item.id"
        ></video>
      </Moveable>
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/no-unused-components */
/* eslint-disable no-inner-declarations */
import RTCMultiConnection from "rtcmulticonnection";
import Moveable from "vue-moveable";

require("adapterjs");
export default {
  name: "webRtc",
  components: {
    RTCMultiConnection,
    Moveable
  },
  data: () => ({
    rtcmConnection: null,
    localVideo: null,
    videoList: [],
    canvas: null,
    moveable: {
      draggable: true,
      throttleDrag: 0,
      resizable: false,
      throttleResize: 1,
      keepRatio: true,
      scalable: true,
      throttleScale: 0,
      rotatable: true,
      throttleRotate: 0,
      pinchable: true, // ["draggable", "resizable", "scalable", "rotatable"]
      origin: false
    }
  }),
  props: {
    roomId: {
      type: String,
      default: "public-room"
    },
    socketURL: {
      type: String,
      default: "https://rtcmulticonnection.herokuapp.com:443/"
    },
    cameraHeight: {
      type: [Number, String],
      default: 160
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    screenshotFormat: {
      type: String,
      default: "image/jpeg"
    },
    enableAudio: {
      type: Boolean,
      default: true
    },
    enableVideo: {
      type: Boolean,
      default: true
    },
    enableLogs: {
      type: Boolean,
      default: false
    }
  },
  watch: {},
  mounted() {
    // TODO: REMOVE THIS CRAP!
    var that = this;

    this.rtcmConnection = new RTCMultiConnection();
    this.rtcmConnection.socketURL = this.socketURL;
    this.rtcmConnection.autoCreateMediaElement = false;
    this.rtcmConnection.enableLogs = this.enableLogs;
    this.rtcmConnection.session = {
      audio: this.enableAudio,
      video: this.enableVideo
    };
    this.rtcmConnection.sdpConstraints.mandatory = {
      OfferToReceiveAudio: this.enableAudio,
      OfferToReceiveVideo: this.enableVideo
    };
    this.rtcmConnection.onstream = function(stream) {
      let found = that.videoList.find(video => {
        return video.id === stream.streamid;
      });
      if (found === undefined) {
        let video = {
          id: stream.streamid,
          muted: stream.type === "local"
        };

        that.videoList.push(video);

        if (stream.type === "local") {
          that.localVideo = video;
        }
      }

      setTimeout(function() {
        for (var i = 0, len = that.$refs.videos.length; i < len; i++) {
          if (that.$refs.videos[i].id === stream.streamid) {
            that.$refs.videos[i].srcObject = stream.stream;
            that.$refs.videos[i].addEventListener("resize", () => {
              that.$refs.testical[i].updateRect();
            });
            break;
          }
        }
      }, 1000);

      that.$emit("joined-room", stream.streamid);
    };
    this.rtcmConnection.onstreamended = function(stream) {
      var newList = [];
      that.videoList.forEach(function(item) {
        if (item.id !== stream.streamid) {
          newList.push(item);
        }
      });
      that.videoList = newList;
      that.$emit("left-room", stream.streamid);
    };
  },
  methods: {
    handleDrag({ target, transform }) {
      console.log("onDrag left, top", transform);
      target.style.transform = transform;
    },
    handleResize({ target, width, height, delta }) {
      console.log("onResize", width, height);
      delta[0] && (target.style.width = `${width}px`);
      delta[1] && (target.style.height = `${height}px`);
    },
    handleScale({ target, transform, scale }) {
      console.log("onScale scale", scale);
      target.style.transform = transform;
    },
    handleRotate({ target, dist, transform }) {
      console.log("onRotate", dist);
      target.style.transform = transform;
    },
    handleWarp({ target, transform }) {
      console.log("onWarp", transform);
      target.style.transform = transform;
    },
    handlePinch({ target }) {
      console.log("onPinch", target);
    },
    join() {
      var that = this;
      this.rtcmConnection.openOrJoin(this.roomId, function(
        isRoomExist,
        roomid
      ) {
        if (isRoomExist === false && that.rtcmConnection.isInitiator === true) {
          that.$emit("opened-room", roomid);
        }
      });
    },
    leave() {
      this.rtcmConnection.attachStreams.forEach(function(localStream) {
        localStream.stop();
      });
      this.videoList = [];
    },
    capture() {
      return this.getCanvas().toDataURL(this.screenshotFormat);
    },
    getCanvas() {
      let video = this.getCurrentVideo();
      if (video !== null && !this.ctx) {
        let canvas = document.createElement("canvas");
        canvas.height = video.clientHeight;
        canvas.width = video.clientWidth;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
      }
      const { ctx, canvas } = this;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas;
    },
    getCurrentVideo() {
      if (this.localVideo === null) {
        return null;
      }
      for (var i = 0, len = this.$refs.videos.length; i < len; i++) {
        if (this.$refs.videos[i].id === this.localVideo.id)
          return this.$refs.videos[i];
      }
      return null;
    },
    shareScreen() {
      var that = this;
      if (navigator.getDisplayMedia || navigator.mediaDevices.getDisplayMedia) {
        function addStreamStopListener(stream, callback) {
          var streamEndedEvent = "ended";
          if ("oninactive" in stream) {
            streamEndedEvent = "inactive";
          }
          stream.addEventListener(
            streamEndedEvent,
            function() {
              callback();
              callback = function() {};
            },
            false
          );
        }

        function onGettingSteam(stream) {
          that.rtcmConnection.addStream(stream);
          that.$emit("share-started", stream.streamid);

          addStreamStopListener(stream, function() {
            that.rtcmConnection.removeStream(stream.streamid);
            that.$emit("share-stopped", stream.streamid);
          });
        }

        function getDisplayMediaError(error) {
          console.log("Media error: " + JSON.stringify(error));
        }

        if (navigator.mediaDevices.getDisplayMedia) {
          navigator.mediaDevices
            .getDisplayMedia({ video: true, audio: false })
            .then(stream => {
              onGettingSteam(stream);
            }, getDisplayMediaError)
            .catch(getDisplayMediaError);
        } else if (navigator.getDisplayMedia) {
          navigator
            .getDisplayMedia({ video: true })
            .then(stream => {
              onGettingSteam(stream);
            }, getDisplayMediaError)
            .catch(getDisplayMediaError);
        }
      }
    }
  }
};
</script>
<style scoped>
.moveable {
  position: absolute;
}

.video-list {
  background: whitesmoke;
  height: auto;
}

.video-list div {
  padding: 0px;
}

.video-item {
  background: #c5c4c4;
  display: inline-block;
}
</style>