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
                  <span class="headline" v-if="rank(card) === 1">🥇</span>
                  <span class="headline" v-else-if="rank(card) === 2">🥈</span>
                  <span class="headline" v-else-if="rank(card) === 3">🥉</span>
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
          <v-card-actions justify="between">
            <v-col class="text-center">
              <v-btn fab dark x-small color="blue" @click="move(card, -1)">
                <v-icon dark>mdi-arrow-left</v-icon>
              </v-btn>
            </v-col>
            <v-col class="text-center">
              <v-btn fab dark x-small color="blue" @click="move(card, +1)">
                <v-icon dark>mdi-arrow-right</v-icon>
              </v-btn>
            </v-col>
            <v-col class="text-center">
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
import arrayMove from "array-move";

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
    async move(c, direction) {
      const currentIndex = this.roomData.cards.indexOf(c);
      const newIndex = currentIndex + direction;
      if (newIndex >= 0 && newIndex < this.roomData.cards.length) {
        this.roomData.cards = arrayMove(
          this.roomData.cards,
          currentIndex,
          newIndex
        );
        await this.pushData();
      }
    },
    rank(c) {
      return card.rank(c, this.roomData.cards);
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