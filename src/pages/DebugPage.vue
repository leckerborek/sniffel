<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col class="text-center">
        <h2>Debug</h2>
      </v-col>
    </v-row>
    <v-row>
      <webrtc
        ref="webrtc"
        width="100%"
        roomId="the-snifflers"
        v-on:joined-room="logEvent"
        v-on:left-room="logEvent"
        v-on:open-room="logEvent"
        v-on:share-started="logEvent"
        v-on:share-stopped="logEvent"
        @error="onError"
      ></webrtc>
    </v-row>
    <v-row align="baseline" justify="space-around">
      <v-btn @click="onJoin">Join Video</v-btn>
      <v-btn @click="onLeave">Leave</v-btn>
    </v-row>
  </v-container>
</template>

<style scoped>
</style>

<script>
import webrtc from "../components/webrtc.vue";
export default {
  name: "DebugPage",
  components: {
    webrtc
  },
  methods: {
    onJoin() {
      this.$refs.webrtc.join();
    },
    onLeave() {
      this.$refs.webrtc.leave();
    },
    onError(error, stream) {
      console.log("On Error Event", error, stream);
    },
    logEvent(event) {
      console.log("Event : ", event);
    }
  }
};
</script>