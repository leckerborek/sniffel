<template>
  <v-container class="fill-height">
    <v-overlay :opacity="0.2" :value="loading">
      <v-progress-circular indeterminate :size="115" :width="8" color="blue"></v-progress-circular>
    </v-overlay>
    <v-row align="start" justify="space-around">
      <h2>Willkommen in {{roomName}} 👋</h2>
    </v-row>
    <score-cards :room-name="roomName" :room-data="roomData"></score-cards>
    <v-row align="stretch">
      <web-rtc
        ref="webrtc"
        width="100%"
        :roomId="roomName"
        v-on:joined-room="joinedRoom"
        v-on:left-room="logEvent"
        v-on:open-room="logEvent"
        v-on:share-started="logEvent"
        v-on:share-stopped="logEvent"
        @error="onError"
      ></web-rtc>
      <v-row justify="space-between" v-if="!loading">
        <v-col>
          <v-card>
            <v-card-title>Video-Chat</v-card-title>
            <v-card-subtitle>Sniffle verwendet Alientechnologie und WebRTC um dir eine unvergessliche Live Chat Erfahrung zu bieten - gönn' dir reichlich und lade die Seite einfach neu, wenn mal etwas nicht funktioniert.</v-card-subtitle>
            <v-card-actions>
              <v-btn text @click="onJoin">Join Video</v-btn>
              <v-btn text @click="onLeave">Leave</v-btn>
              <v-btn text @click="onShareScreen">Share Screen</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col>
          <v-card>
            <v-card-title>Optionen</v-card-title>
            <v-card-subtitle>Wähle aus diesen reichhaltigen Optionen und mache Sniffel zu deinem ganz persönlichen Erlebnis!</v-card-subtitle>
            <v-card-actions>
              <v-btn text @click="newPlayer">Neuer Spieler</v-btn>
              <v-btn text @click="clearCards">Alle Punkte löschen</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-row>
  </v-container>
</template>

<style scoped>
</style>

<script>
import ScoreCards from "@/components/ScoreCards";
import WebRtc from "@/components/WebRtcFix";
import rooms from "@/services/rooms";
import card from "@/services/card";
import snackbear from "@/services/snackbear";

export default {
  name: "RoomPage",
  components: {
    ScoreCards,
    WebRtc
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
    roomData: undefined
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
    async clearCards() {
      this.roomData.cards.forEach(c => card.clear(c));
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