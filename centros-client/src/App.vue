<template>
  <v-app>
    <v-snackbar
        v-model="snackbarFlag"
    >
      {{ this.$store.state.snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn
            color="error"
            text
            v-bind="attrs"
            @click="snackbarFlag = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>


    <v-navigation-drawer v-if="hasRegistered" permanent app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h5">
            Centros
          </v-list-item-title>
          <v-list-item-subtitle class="caption">
            College Counselling
          </v-list-item-subtitle>
          <v-list-item-subtitle class="caption">
            Management System
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <div v-for="item in navItems"
             :key="item.title">
          <v-list-item
              link
              router :to="item.route"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title
              >{{ item.title }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider class="my-3" v-if="item.divider"></v-divider>
        </div>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn block color="primary" target="_blank" href="https://forms.office.com/r/22BAnGHvir">
            <v-icon left>mdi-alert-circle</v-icon>
            Report Bug
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar
        app
        dense
        color="primary"
        v-if="hasRegistered"
        class="white--text font-weight-bold">
      <v-toolbar-title>Centros</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-menu
          bottom
          min-width="250px"
          rounded
          offset-y
      >
        <template v-slot:activator="{ on }">
          <v-btn
              icon
              x-large
              v-on="on"
          >
            <UserAvatar :size="40"></UserAvatar>
          </v-btn>
        </template>
        <v-card>
          <v-list-item-content class="justify-center">
            <div class="mx-auto text-center">
              <UserAvatar :size="56"></UserAvatar>
              <h3>{{ user.name }}</h3>
              <p class="text-caption mt-1">
                {{ user.email }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-btn
                  depressed
                  rounded
                  text
                  href="/signout"
              >
                Logout
              </v-btn>
            </div>
          </v-list-item-content>
        </v-card>
      </v-menu>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>

    <v-footer app>

    </v-footer>
  </v-app>
</template>

<script>
import {getUserData} from "@/api/me";
import UserAvatar from "@/components/UserAvatar";

export default {
  name: 'App',

  components: {UserAvatar},

  methods: {
    schedule() {
      return this.$store.state.schedule
    },
  },

  computed: {
    snackbarFlag: {
      get() {
        return this.$store.state.snackbarFlag
      },
      set(value) {
        if (value) this.$store.commit('showSnackbar', this.$store.state.snackbarText)
        else this.$store.commit('hideSnackbar')
      }
    },

    user() {
      return this.$store.state.user
    },
    hasRegistered() {
      return !!this.$store.state.user && this.$store.state.user.hasRegistered
    },
  },

  mounted() {
    getUserData().then(data => {
      if (data === null && this.$route.name !== '/') {
        this.$router.replace('/')
      }
      this.$store.commit("user", data)
    })
  },
  created(){
    document.title = "Centros"
  },


  data: () => ({
    show: false,
    navItems: [
      {
        title: 'Calendar',
        icon: 'mdi-calendar',
        divider: false,
        route: '/calendar'
      },
      {
        title: 'Meetings',
        icon: 'mdi-calendar-clock',
        divider: true,
        route: '/meetings'
      },
      {
        title: 'Profile',
        icon: 'mdi-account',
        divider: false,
        route: '/profile'
      },
      // {
      //   title: 'Reviews',
      //   icon: 'mdi-message-draw',
      //   divider: false,
      //   route: '/reviews'
      // },
      // {
      //   title: 'Files',
      //   icon: 'mdi-file',
      //   divider: false,
      //   route: '/files'
      // },
      {
        title: 'Guides',
        icon: 'mdi-book-open-variant',
        divider: false,
        route: '/guides'
      },
      // {
      //   title: 'University',
      //   icon: 'mdi-town-hall',
      //   divider: false,
      //   route: '/university'
      // }
    ],


  }),
};
</script>
