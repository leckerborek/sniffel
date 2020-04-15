<template>
  <v-container>
    <v-row v-if="roomData !== undefined">
      <draggable
        v-model="roomData.cards"
        :component-data="scrollContainerData"
        handle=".scroll-handle"
        @end="pushData"
      >
        <transition-group name="list" style="display: flex;">
          <v-card v-for="card in roomData.cards" :key="card.id" class="scroll-card" :raised="true">
            <v-card-title>
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
            </v-card-title>
            <v-card-text>
              <v-form>
                <v-text-field
                  v-for="field in upperFields"
                  :key="field.key"
                  type="number"
                  pattern="[0-9]*"
                  class="mb-3"
                  :dense="true"
                  v-model.number="card[field.key]"
                  :label="field.name"
                  :placeholder="field.hint"
                  :rules="[field.validator]"
                  :validate-on-blur="true"
                  @change="pushData"
                ></v-text-field>
                <div class="subtitle-1 mt-n4">Summe Oben: {{sumUpper(card)}}</div>
                <div class="subtitle-1 mb-6">Bogus: {{bonusUpper(card)}}</div>
                <v-text-field
                  v-for="field in lowerFields"
                  :key="field.key"
                  type="number"
                  pattern="[0-9]*"
                  class="mb-3"
                  :dense="true"
                  v-model.number="card[field.key]"
                  :label="field.name"
                  :placeholder="field.hint"
                  :rules="[field.validator]"
                  :validate-on-blur="true"
                  @change="pushData"
                ></v-text-field>
                <div class="subtitle-1 mt-n4">Summe Unten: {{sumLower(card)}}</div>
                <div class="subtitle-1">Gesamt: {{sumTotal(card)}}</div>
              </v-form>
            </v-card-text>

            <v-card-actions justify="between">
              <v-btn text fab dark small color="blue" @click="move(card, -1)">
                <v-icon dark>mdi-arrow-left</v-icon>
              </v-btn>
              <v-btn text fab dark small color="blue" class="scroll-handle">
                <v-icon dark>mdi-hand</v-icon>
              </v-btn>
              <v-btn text fab dark small color="blue" @click="move(card, +1)">
                <v-icon dark>mdi-arrow-right</v-icon>
              </v-btn>
              <v-btn text fab dark small color="red" @click="remove(card)">
                <v-icon dark>mdi-trash-can</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </transition-group>
      </draggable>
    </v-row>
  </v-container>
</template>

<style scoped>
.scroll-card {
  /* min-width: 200px; */
  margin: 15px;
}
.scroll-container {
  display: flex;
  overflow-x: scroll;
}
.scroll-handle {
  cursor: ew-resize;
}
.list-move {
  transition: transform 1s;
}
.list-enter-active,
.list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active for <2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style>

<script>
/* eslint-disable no-unused-vars */
import rooms from "@/services/rooms";
import card from "@/services/card";
import arrayMove from "array-move";
import draggable from "vuedraggable";

export default {
  name: "scoreCards",
  components: {
    draggable
  },
  async created() {
    console.log("scoreCards.created");
  },
  props: {
    roomName: String,
    roomData: Object
  },
  data: () => ({
    upperFields: card.fields.filter(field => field.upper),
    lowerFields: card.fields.filter(field => !field.upper),
    scrollContainerData: {
      attrs: {
        class: "scroll-container"
      }
    }
  }),
  methods: {
    validator(value) {
      return "oh no";
    },
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
    },
    getScrollContainerData() {
      return {
        attrs: {
          class: "scroll-container"
        }
      };
    }
  }
};
</script>