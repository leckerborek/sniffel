<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">Sniffel</v-list-item-title>
          <v-list-item-subtitle>Sniffeltastic!</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list dense nav>
        <v-list-item link to="/join">
          <v-list-item-action>
            <v-icon>mdi-glass-cocktail</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Join</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/debug">
          <v-list-item-action>
            <v-icon>mdi-bug</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Debug</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="indigo" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Sniffel 🎲🍻</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <router-view />
    </v-content>
    <v-footer color="indigo" app>
      <span class="white--text">a #stayathome project</span>
    </v-footer>
    <v-snackbar v-model="snackVisible" color="info" :timeout="5000">{{snackText}}</v-snackbar>
  </v-app>
</template>

<script>
import core from "@/services/core";
import snackbear from "@/services/snackbear";

export default {
  async created() {
    console.log("app.created");
    await core.init();
    await snackbear.init((text) => {
      this.snackText = text;
      this.snackVisible = true;
    });
  },
  props: {
    source: String
  },
  data: () => ({
    drawer: null,
    snackVisible: false,
    snackText: ""
  }),
  methods: {},
  components: {}
};
</script>