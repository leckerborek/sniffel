<template>
  <v-container class="fill-height">
    <v-overlay :opacity="0.2" :value="loading">
      <v-progress-circular indeterminate :size="70" :width="7" color="blue"></v-progress-circular>
    </v-overlay>
    <!-- <v-container v-if="roomData !== undefined"> -->
    <v-row align="start" justify="space-around">
      <h2>Willkommen in {{roomName}} 👋</h2>
    </v-row>
    <score-cards :room-name="roomName" :room-data="roomData"></score-cards>
    <v-row align="stretch">
      <webrtc
        ref="webrtc"
        width="100%"
        :roomId="roomName"
        v-on:joined-room="joinedRoom"
        v-on:left-room="logEvent"
        v-on:open-room="logEvent"
        v-on:share-started="logEvent"
        v-on:share-stopped="logEvent"
        @error="onError"
      ></webrtc>
    </v-row>
    <v-row align="baseline" justify="space-around" v-if="!loading">
      <v-btn @click="newPlayer">Neuer Spieler</v-btn>
      <v-btn @click="onJoin">Join Video</v-btn>
      <v-btn @click="onLeave">Leave</v-btn>
      <v-btn @click="onShareScreen">Share Screen</v-btn>
    </v-row>
    <!-- </v-container> -->
  </v-container>
</template>

<style scoped>
</style>

<script>
import rooms from "@/services/rooms";
import ScoreCards from "@/components/ScoreCards";
import webrtc from "@/components/webrtc";
import card from "@/data/card";
import snackbear from "@/services/snackbear";

export default {
  name: "RoomPage",
  components: {
    ScoreCards,
    webrtc
  },
  async created() {
    console.log("room.created");
    await rooms.initRoom(this.roomName);
    await rooms.observeRoom(this.roomName, this.onDataChanged);
  },
  props: {
    roomName: String
  },
  data: () => ({
    roomData: undefined,
    draggable: false
  }),
  computed: {
    loading() {
      return this.roomData === undefined;
    }
  },
  methods: {
    async newPlayer() {
      this.roomData.cards.push(card.create());
      await rooms.updateRoom(this.roomName, this.roomData);
    },
    onDataChanged(newData) {
      console.log("room.onDataChanged", newData);
      const info = rooms.diff(this.roomData, newData);
      if (info !== undefined) {
        snackbear.info(info);
      }
      this.roomData = newData;
    },
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
    }
  }
};
</script>