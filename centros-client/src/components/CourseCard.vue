<template>
  <v-card
      elevation="2"
      outlined
  >
    <v-list-item>
      <v-list-item-avatar
          tile
          size="150"
      >
        <v-img :src="src"></v-img>

      </v-list-item-avatar>
      <v-list-item-content>
        <v-container fluid class="pa-0">
          <v-list-item-title class="headline font-weight-bold">{{ name }}</v-list-item-title>
          <p>{{ description }}</p>

          <v-chip
              class="mr-2"
              color="primary"
              label
          >
            <v-avatar left>
              <v-icon>mdi-currency-usd</v-icon>
            </v-avatar>
            {{ cost }}
          </v-chip>

          <v-chip
              label
              color="primary">
            <v-avatar left>
              <v-icon>mdi-clock-time-eight</v-icon>
            </v-avatar>
            {{ duration }}
          </v-chip>
        </v-container>
      </v-list-item-content>
      <v-btn color="primary" max-height="auto">Apply</v-btn>
    </v-list-item>
  </v-card>
</template>

<script>
export default {
  name: "CourseCard",
  props: {
    src: {requestId: true, type: String},
    name: {require: true, type: String},
    description: {require: true, type: String},
    cost: {require: true, type: String},
    duration: {require: true, type: Number}
  }
}
</script>

<style scoped>

</style>