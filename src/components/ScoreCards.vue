<template>
  <v-container>
    <v-row no-gutters justify="space-between" v-if="roomData !== undefined">
      <!-- https://vuejs.org/v2/guide/list.html -->
      <v-col v-for="card in roomData.cards" :key="card.id">
        <!-- <v-card outlined title> -->
        <v-card>
          <v-list>
            <v-list-item>
              <v-text-field
                v-model="card.player"
                label="Name"
                :single-line="true"
                @change="pushData"
              >
                <template v-slot:prepend>
                  <span class="headline" v-if="first(card)">🥇</span>
                  <span class="headline" v-if="second(card)">🥈</span>
                  <span class="headline" v-if="third(card)">🥉</span>
                </template>
              </v-text-field>
            </v-list-item>
            <v-list-item v-for="field in upperFields" :key="field.key">
              <v-text-field
                v-model.number="card[field.key]"
                :label="field.name"
                :placeholder="field.hint"
                :dense="false"
                type="number"
                pattern="[0-9]*"
                @change="pushData"
              ></v-text-field>
            </v-list-item>
            <v-list-item>Oben: {{sumUpper(card)}}</v-list-item>
            <v-list-item>Bogus: {{bonusUpper(card)}}</v-list-item>
            <v-list-item v-for="field in lowerFields" :key="field.key">
              <v-text-field
                v-model.number="card[field.key]"
                :label="field.name"
                :placeholder="field.hint"
                :dense="false"
                type="number"
                pattern="[0-9]*"
                @change="pushData"
              ></v-text-field>
            </v-list-item>
            <v-list-item>Unten: {{sumLower(card)}}</v-list-item>
            <v-list-item>Gesamt: {{sumTotal(card)}}</v-list-item>
          </v-list>
          <v-card-actions justify="end">
            <v-col class="text-right">
              <v-btn fab dark x-small color="red" @click="remove(card)">
                <v-icon dark>mdi-trash-can</v-icon>
              </v-btn>
            </v-col>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
/* eslint-disable no-unused-vars */
import rooms from "@/services/rooms";
import card from "@/services/card";

export default {
  name: "scoreCards",
  async created() {
    console.log("scoreCards.created");
  },
  props: {
    roomName: String,
    roomData: Object
  },
  data: () => ({
    upperFields: card.fields.filter(field => field.upper),
    lowerFields: card.fields.filter(field => !field.upper)
  }),
  methods: {
    first(c) {
      return true;
    },
    second(c) {
      return false;
    },
    third(c) {
      return false;
    },
    sumUpper(c) {
      return card.sumUpper(c);
    },
    bonusUpper(c) {
      return card.bonusUpper(c);
    },
    sumLower(c) {
      return card.sumLower(c);
    },
    sumTotal(c) {
      return card.sumTotal(c);
    },
    async pushData() {
      console.log("ScoreCards.pushData");
      await rooms.updateRoom(this.roomName, this.roomData);
    },
    remove(c) {
      this.roomData.cards = this.roomData.cards.filter(
        card => card.id !== c.id
      );
      this.pushData();
    }
  }
};
</script>