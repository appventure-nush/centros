<template>
  <v-avatar
      color="black"
      :size="size"
  >
    <span class="white--text">{{ getInitials() }}</span>
  </v-avatar>
</template>

<script>
export default {
  name: "UserAvatar",
  methods: {
    getName() {
      if (this.name) return this.name
      if (!this.$store.state.user) return "ERROR"
      return this.$store.state.user.name
    },

    getInitials() {
      let tok = this.getName().split(' ')
      let res
      if (tok.length === 1) {
        res = tok[0][0]
      } else {
        res = tok[0][0] + tok[1][0]
      }
      return res.toUpperCase();
    }
  },
  props: {
    name: {require: false, type: String},
    size: {require: true, type: Number}
  }
}
</script>

<style scoped>

</style>