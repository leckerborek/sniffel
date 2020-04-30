<template>
  <span @click="rollRandom()" style="cursor: pointer;">
    <video
      v-for="(item) of items"
      :key="item.number"
      :src="'/dice/' + item.number + '.mp4'"
      v-show="number === item.number"
      ref="dice"
      width="98"
      height="130"
      playsinline
      autoplay
      muted
    />
  </span>
</template>

<script>
export default {
  name: "die",
  props: {
    // number: Number,
    changeDetector: String
  },
  data: () => ({
    items: [],
    number: 1
  }),
  created() {
    for (let i = 1; i <= 6; ++i) {
      this.items.push({
        number: i
      });
    }
  },
  watch: {
    // changeDetector: function(newValue) {
    //   console.log("changeDetector", newValue);
    //   this.roll(this.$props.number);
    // }
  },
  methods: {
    rollRandom() {
      const number = Math.floor(Math.random() * 6 + 1);
      this.roll(number);
    },
    roll(number) {
      this.number = number;
      const index = number - 1;
      this.$refs.dice[index].currentTime = 0;
      this.$refs.dice[index].play();
    }
  }
};
</script>
<style scoped>
</style>