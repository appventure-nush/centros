<template>
  <v-card width="300">
    <v-list>
      <v-list-item>
        <v-list-item-avatar>
          <UserAvatar :name="name" :size="40"></UserAvatar>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ name }}</v-list-item-title>
          <v-list-item-subtitle>{{ email }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import UserAvatar from "@/components/UserAvatar";

export default {
  name: "UserCard",
  components: {UserAvatar},
  props: {
    name: {require: true, type: String},
    email: {require: true, type: String}
  }
}
</script>

<style scoped>

</style>