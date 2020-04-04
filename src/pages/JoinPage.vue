<template>
  <v-container class="fill-height fluid">
    <span class="background"></span>
    <v-row align="center" justify="center">
      <v-card>
        <v-list>
          <v-list-item>
            <v-list-item-title class="headline mb-1">where's da party at?!</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-text-field label="Raum" v-model="roomName" />
          </v-list-item>
          <v-list-item>
            <v-btn :block="true" @click="join">Join</v-btn>
          </v-list-item>
        </v-list>
      </v-card>
    </v-row>
  </v-container>
</template>

<style scoped>
.background {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: url("https://media.giphy.com/media/PkL2FAFQYUmPWYrXEg/giphy.gif")
    center center;
  background-size: cover;
  /* transform: scale(1.5); */
}
</style>

<script>
export default {
  name: "JoinPage",
  components: {},
  data: () => ({
    roomName: "the-snifflers"
  }),
  methods: {
    join() {
      this.$router.push(`room/${this.roomName}`);
    }
  }
};
</script>