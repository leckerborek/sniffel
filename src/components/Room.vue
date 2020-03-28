<template>
  <v-container class="fill-height">
    <!-- <v-container class="fill-height" fluid> -->
    <!-- <v-layout row justify-space-between> -->
    <!-- <v-row align="center" justify="center">
          <v-col class="text-center">
          </v-col>
    </v-row>-->
    <v-row align="start" justify="space-around">
      <h2>Willkommen in {{roomId}} 👋</h2>
    </v-row>
    <v-row align="stretch">
      <vue-webrtc
        ref="webrtc"
        width="100%"
        :roomId="roomId"
        v-on:joined-room="joinedRoom"
        v-on:left-room="logEvent"
        v-on:open-room="logEvent"
        v-on:share-started="logEvent"
        v-on:share-stopped="logEvent"
        @error="onError"
      ></vue-webrtc>
    </v-row>

    <!-- <v-row align="stretch">
        <div style="width:100px;height:100px;background:orange" />
    </v-row> -->

    <v-row align="baseline" justify="space-around">
      <v-btn @click="onJoin">Join Video</v-btn>
      <v-btn @click="onLeave">Leave</v-btn>
      <v-btn @click="onShareScreen">Share Screen</v-btn>
      <v-switch v-model="draggable" :label="'Draggable Videos'"></v-switch>
    </v-row>
    <!-- </v-layout> -->
  </v-container>
</template>

<script>
import util from "@/services/util";

export default {
  name: "room",
  props: {
    roomId: String
  },
  data: () => ({
    draggable: false
  }),
  methods: {
    onJoin() {
      this.$refs.webrtc.join();
    },
    onLeave() {
      this.$refs.webrtc.leave();
    },
    onShareScreen() {
      this.img = this.$refs.webrtc.shareScreen();
    },
    onError(error, stream) {
      console.log("On Error Event", error, stream);
    },
    logEvent(event) {
      console.log("Event : ", event);
    },
    joinedRoom(videoId) {
      console.log(`Share started with ID ${videoId}`);

      if (this.draggable) {
        setTimeout(() => this.makeVideoDraggable(videoId), 2000);
      }
    },

    makeVideoDraggable(id) {
      const video = document.getElementById(id);
      if (video === null) {
        console.error("Could not find video element.");
        return;
      }

      console.log("Found video element.", video);
      const videoDiv = video.parentElement;
      videoDiv.style.background = "transparent";
      videoDiv.style.position = "absolute";
      videoDiv.style.cursor = "move";
      util.makeElementDraggable(videoDiv);
    }
  }
};
</script>