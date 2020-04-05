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
              ></v-text-field>
            </v-list-item>
            <v-list-item>
              <v-text-field
                v-model.number="card.one"
                label="1er"
                placeholder="1, 2, 3, 4, 5"
                type="number"
                pattern="[0-9]*"
                @change="pushData"
              ></v-text-field>
            </v-list-item>
            <v-list-item>
              <v-text-field
                v-model.number="card.two"
                label="2er"
                placeholder="2, 4, 6, 8, 10"
                type="number"
                pattern="[0-9]*"
                @change="pushData"
              ></v-text-field>
            </v-list-item>
            <v-list-item>
              <v-text-field
                v-model.number="card.three"
                label="3er"
                placeholder="3, 6, 9, 12, 15"
                type="number"
                pattern="[0-9]*"
                @change="pushData"
              ></v-text-field>
            </v-list-item>
            <v-list-item>
              <v-text-field
                v-model.number="card.four"
                label="4er"
                placeholder="4, 8, 12, 16, 20"
                type="number"
                pattern="[0-9]*"
                @change="pushData"
              ></v-text-field>
            </v-list-item>
            <v-list-item>
              <v-text-field
                v-model.number="card.five"
                label="5er"
                placeholder="5, 10, 15, 20, 25"
                type="number"
                pattern="[0-9]*"
                @change="pushData"
              ></v-text-field>
            </v-list-item>
            <v-list-item>
              <v-text-field
                v-model.number="card.six"
                label="6er"
                placeholder="6, 12, 18, 24, 30"
                type="number"
                pattern="[0-9]*"
                @change="pushData"
              ></v-text-field>
            </v-list-item>
            <!-- <v-divider></v-divider> -->
            <v-list-item>Oben: {{sumUpper(card)}}</v-list-item>
            <v-list-item>Bonus: {{bonusUpper(card)}}</v-list-item>
            <!-- <v-divider></v-divider> -->
            <v-list-item>
              <v-text-field
                v-model.number="card.threeofakind"
                label="3 gleiche"
                placeholder="Alle Augen"
                type="number"
                pattern="[0-9]*"
                @change="pushData"
              ></v-text-field>
            </v-list-item>
            <v-list-item>
              <v-text-field
                v-model.number="card.fourofakind"
                label="4 gleiche"
                placeholder="Alle Augen"
                type="number"
                pattern="[0-9]*"
                @change="pushData"
              ></v-text-field>
            </v-list-item>
            <v-list-item>
              <v-text-field
                v-model.number="card.fullhouse"
                label="Full House"
                placeholder="25"
                type="number"
                pattern="[0-9]*"
                @change="pushData"
              ></v-text-field>
            </v-list-item>
            <v-list-item>
              <v-text-field
                v-model.number="card.smallstraight"
                label="Kleine Straße"
                placeholder="30"
                type="number"
                pattern="[0-9]*"
                @change="pushData"
              ></v-text-field>
            </v-list-item>
            <v-list-item>
              <v-text-field
                v-model.number="card.largestraight"
                label="Große Straße"
                placeholder="40"
                type="number"
                pattern="[0-9]*"
                @change="pushData"
              ></v-text-field>
            </v-list-item>
            <v-list-item>
              <v-text-field
                v-model.number="card.chance"
                label="Chance"
                placeholder="Alle Augen"
                type="number"
                pattern="[0-9]*"
                @change="pushData"
              ></v-text-field>
            </v-list-item>
            <v-list-item>
              <v-text-field
                v-model.number="card.sniffel"
                label="Sniffel"
                placeholder="50"
                type="number"
                pattern="[0-9]*"
                @change="pushData"
              ></v-text-field>
            </v-list-item>
            <!-- <v-divider></v-divider> -->
            <v-list-item>Unten: {{sumLower(card)}}</v-list-item>
            <!-- <v-divider></v-divider> -->
            <v-list-item>Gesamt: {{sumTotal(card)}}</v-list-item>
            <!-- <v-divider></v-divider> -->
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
  data: () => ({}),
  methods: {
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
      this.roomData.cards = this.roomData.cards.filter(card => card.id !== c.id);
      this.pushData();
    }
  }
};
</script>