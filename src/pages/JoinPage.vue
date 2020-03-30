<template>
  <v-container class="fill-height">
    <v-row justify="center">
      <v-list>
        <v-list-item>
          <h2>where's da party at?!</h2>
        </v-list-item>
        <v-list-item>
          <v-text-field label="Raum" v-model="roomName" />
        </v-list-item>
        <v-list-item>
          <v-btn :block="true" @click="join">Join</v-btn>
        </v-list-item>
      </v-list>
    </v-row>
  </v-container>
</template>

<style scoped>
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