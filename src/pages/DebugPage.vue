<template>
  <!-- <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col class="text-center">
        <h2>Debug</h2>
      </v-col>
    </v-row>
    <v-row>
      <web-rtc
        ref="webrtc"
        width="100%"
        roomId="the-snifflers"
        v-on:joined-room="logEvent"
        v-on:left-room="logEvent"
        v-on:open-room="logEvent"
        v-on:share-started="logEvent"
        v-on:share-stopped="logEvent"
        @error="onError"
      ></web-rtc>
    </v-row>
    <v-row align="baseline" justify="space-around">
      <v-btn @click="onJoin">Join Video</v-btn>
      <v-btn @click="onLeave">Leave</v-btn>
    </v-row>
  </v-container>-->

  <v-container>
    <v-row>
      <v-card>
        <v-card-title>Dicer</v-card-title>
        <v-card-subtitle>Nix zum dicen da? Nix Problem! D-Quadrat (tm) Digital Dice 4tw!</v-card-subtitle>
        <die></die>
        <die></die>
        <die></die>
        <die></die>
        <die></die>
        <v-card-actions>
          <v-btn text @click="roll">Roll</v-btn>
        </v-card-actions>
      </v-card>
    </v-row>

    <v-row>
      <v-card height="200px" class="yo">
        <v-list>
          <v-list-item v-for="item in items" :key="item.key">
            <v-list-item-content>{{item.name}}</v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-row>

    <v-row>
      <!-- tag="v-flex" -->
      <draggable v-model="items" :component-data="getComponentData()">
        <!-- <div class="card-container"> -->
        <v-card v-for="item in items" :key="item.key" class="card">
          <v-card-title>{{item.name}}</v-card-title>
        </v-card>
        <!-- </div> -->
      </draggable>
    </v-row>
  </v-container>
</template>

<style scoped>
.yo {
  overflow-y: scroll;
}
.card {
  min-width: 200px;
}
.card-container {
  display: flex;
  overflow-x: scroll;
}
</style>

<script>
/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
/* eslint-disable vue/no-unused-components */
import WebRtc from "@/components/WebRtcFix";
import Die from "@/components/Die";
import draggable from "vuedraggable";

import { getName } from "ikea-name-generator";
import { v4 as uuidv4 } from "uuid";

export default {
  name: "DebugPage",
  components: {
    WebRtc,
    Die,
    draggable
  },
  data: () => ({
    number: 1,
    changeDetector: uuidv4(),
    items: [],
  }),
  created() {},
  methods: {
    roll() {
      this.number = Math.floor(Math.random() * 6 + 1);
      this.changeDetector = uuidv4();
    },
    getComponentData() {
      return {
        attrs: {
          class: "card-container"
        }
      };
    },
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
