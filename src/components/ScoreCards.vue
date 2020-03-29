<template>
  <v-container>
    <v-row no-gutters>
      <!-- <v-col>
        <v-card outlined title>
          <v-list-item>Name</v-list-item>
          <v-list-item>1er</v-list-item>
          <v-list-item>2er</v-list-item>
          <v-list-item>3er</v-list-item>
          <v-list-item>4er</v-list-item>
          <v-list-item>5er</v-list-item>
          <v-list-item>6er</v-list-item>
        </v-card>
      </v-col>-->
      <!-- https://vuejs.org/v2/guide/list.html -->
      <v-col v-for="card in roomData.cards" :key="card.id">
        <!-- <v-card outlined title> -->
        <v-list>
          <v-list-item>
            <v-text-field v-model="card.player" label="Name" :single-line="true" @change="pushData"></v-text-field>
          </v-list-item>
          <v-list-item>
            <v-text-field
              v-model.number="card.one"
              label="1er"
              placeholder="1, 2, 3, 4, 5, 6"
              type="number"
              @change="pushData"
            ></v-text-field>
          </v-list-item>
          <v-list-item>
            <v-text-field
              v-model.number="card.two"
              label="2er"
              placeholder="2, 4, 6, 8, 10"
              type="number"
              @change="pushData"
            ></v-text-field>
          </v-list-item>
          <v-list-item>
            <v-text-field
              v-model.number="card.three"
              label="3er"
              placeholder="3, 6, 9, 12, 15"
              type="number"
              @change="pushData"
            ></v-text-field>
          </v-list-item>
          <v-list-item>
            <v-text-field
              v-model.number="card.four"
              label="4er"
              placeholder="4, 8, 12, 16, 20"
              type="number"
              @change="pushData"
            ></v-text-field>
          </v-list-item>
          <v-list-item>
            <v-text-field
              v-model.number="card.five"
              label="5er"
              placeholder="5, 10, 15, 20, 25"
              type="number"
              @change="pushData"
            ></v-text-field>
          </v-list-item>
          <v-list-item>
            <v-text-field
              v-model.number="card.six"
              label="6er"
              placeholder="6, 12, 18, 24, 30"
              type="number"
              @change="pushData"
            ></v-text-field>
          </v-list-item>
          <!-- <v-divider></v-divider> -->
          <v-list-item>Summe oben: {{sumUpper(card)}}</v-list-item>
          <v-list-item>Bonus: {{bonusUpper(card)}}</v-list-item>
          <!-- <v-divider></v-divider> -->
          <v-list-item>
            <v-text-field
              v-model.number="card.threeofakind"
              label="3 gleiche"
              placeholder="Alle Augen"
              type="number"
              @change="pushData"
            ></v-text-field>
          </v-list-item>
          <v-list-item>
            <v-text-field
              v-model.number="card.fourofakind"
              label="4 gleiche"
              placeholder="Alle Augen"
              type="number"
              @change="pushData"
            ></v-text-field>
          </v-list-item>
          <v-list-item>
            <v-text-field
              v-model.number="card.fullhouse"
              label="Full House"
              placeholder="25"
              type="number"
              @change="pushData"
            ></v-text-field>
          </v-list-item>
          <v-list-item>
            <v-text-field
              v-model.number="card.smallstraight"
              label="Kleine Straße"
              placeholder="30"
              type="number"
              @change="pushData"
            ></v-text-field>
          </v-list-item>
          <v-list-item>
            <v-text-field
              v-model.number="card.largestraight"
              label="Große Straße"
              placeholder="40"
              type="number"
              @change="pushData"
            ></v-text-field>
          </v-list-item>
          <v-list-item>
            <v-text-field
              v-model.number="card.chance"
              label="Chance"
              placeholder="Alle Augen"
              type="number"
              @change="pushData"
            ></v-text-field>
          </v-list-item>
          <v-list-item>
            <v-text-field
              v-model.number="card.yahtzee"
              label="Kniffel"
              placeholder="50"
              type="number"
              @change="pushData"
            ></v-text-field>
          </v-list-item>
          <!-- <v-divider></v-divider> -->
          <v-list-item>Summe unten: {{sumLower(card)}}</v-list-item>
          <!-- <v-divider></v-divider> -->
          <v-list-item>Gesamt: {{sumTotal(card)}}</v-list-item>
          <!-- <v-divider></v-divider> -->
        </v-list>
        <!-- </v-card> -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import rooms from "@/services/rooms";

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
    dense: true
  }),
  methods: {
    sumUpper(card) {
      function intOrZero(value) {
        const int = parseInt(value);
        return isNaN(int) ? 0 : int;
      }
      return (
        intOrZero(card.one) +
        intOrZero(card.two) +
        intOrZero(card.three) +
        intOrZero(card.four) +
        intOrZero(card.five) +
        intOrZero(card.six)
      );
    },
    bonusUpper(card) {
      return this.sumUpper(card) >= 63 ? 35 : 0;
    },
    sumLower(card) {
      function intOrZero(value) {
        const int = parseInt(value);
        return isNaN(int) ? 0 : int;
      }
      return (
        intOrZero(card.threeofakind) +
        intOrZero(card.fourofakind) +
        intOrZero(card.fullhouse) +
        intOrZero(card.smallstraight) +
        intOrZero(card.largestraight) +
        intOrZero(card.chance) +
        intOrZero(card.yahtzee)
      );
    },
    sumTotal(card) {
      return this.sumUpper(card) + this.bonusUpper(card) + this.sumLower(card);
    },
    async pushData() {
      console.log("ScoreCard.updateData");
      await rooms.updateRoom(this.roomName, this.roomData);
    }
  }
};
</script>