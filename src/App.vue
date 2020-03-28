<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Hello</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-information</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>About</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="indigo" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Sniffel 🎲🍻</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <room room-id="public-room"></room>
    </v-content>
    <v-footer color="indigo" app>
      <span class="white--text">a #stayathome project</span>
    </v-footer>
  </v-app>
</template>

<script>
import Room from "@/components/Room.vue";

export default {
  props: {
    source: String
  },
  data: () => ({
    drawer: null,
    img: null
  }),
  methods: {},
  components: {
    Room
  }
};
</script>