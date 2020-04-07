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
      <v-card height="200px" class="yo">
        <v-list>
          <v-list-item v-for="item in items" :key="item.key">
            <v-list-item-content>{{item.name}}</v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-row>

    <v-row>
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
import draggable from "vuedraggable";

import { getName } from "ikea-name-generator";
import { v4 as uuidv4 } from "uuid";

export default {
  name: "DebugPage",
  components: {
    WebRtc,
    draggable
  },
  data: () => ({
    items: []
  }),
  created() {
    for (let i = 0; i < 10; ++i) {
      this.items.push({
        key: uuidv4(),
        name: getName(true)
      });
    }
  },
  methods: {
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