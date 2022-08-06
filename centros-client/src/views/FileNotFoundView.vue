<template>
  <v-container fluid>
    <v-row justify="center">
    <v-img :src="require('../assets/404_art.svg')" max-width="40%"></v-img>
    </v-row>
    <v-row class="py-12" justify="center">
      <h1>Oops, we couldn't find this page...</h1>
    </v-row>
  </v-container>

</template>

<script>
export default {
  name: "FileNotFound"
}
</script>

<style scoped>

</style>