<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
            :src="require('../assets/logo.svg')"
            class="my-3"
            contain
            height="280"
        />
      </v-col>

      <v-col cols="12">
        <h1 class="text-h2 font-weight-bold">Centros</h1>
      </v-col>

      <v-col>
        <p class="body-4">
          College Counselling Management System
        </p>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="d-flex justify-center">
        <v-btn
            class="mx-auto"
            x-large
            rounded
            color="primary"
            href="/signin"
        >

          <v-icon class="mr-2">
            mdi-microsoft
          </v-icon>
          Microsoft Login
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {

  name: "SignIn",

  data: () => ({
  }),

  methods: {
  }
}
</script>

<style scoped>

</style>