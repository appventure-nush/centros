<template>
  <v-container>
    <v-row>
      <v-col class="col-md-12 col-lg-5">
        <h1 class="text-h2 font-weight-bold">You're Almost There!</h1>
        <h3>Kindly fill up the information below and we're good to go!</h3>

        <v-form
            ref="form"
            class="mt-12">
          <v-select
              :items="houseItems"
              label="House"
              v-model="house"
              :rules="houseInputRules"
              outlined></v-select>

          <v-select
              :items="yearItems"
              label="Year"
              v-model="year"
              :rules="yearInputRules"
              outlined></v-select>

          <v-select
              :items="mentorItems"
              v-model="mentorClass"
              :rules="mentorInputRules"
              label="Mentor Group"
              outlined></v-select>

          <v-autocomplete
              label="Major"
              chips
              deletable-chips
              outlined
              multiple
              v-model="majors"
              :rules="majorInputRules"
              :items="majorItems"
          ></v-autocomplete>

          <v-autocomplete
              label="Honours"
              chips
              deletable-chips
              outlined
              multiple
              v-model="honours"
              :rules="[majorsAndHonoursRule]"
              :items="majorItems"
          ></v-autocomplete>

          <v-btn
              class="mr-4"
              color="primary"
              @click="submit">
            submit
          </v-btn>
        </v-form>
      </v-col>

      <v-spacer></v-spacer>

      <v-col class="col-lg-6 mt-12">
        <v-img :src="require('../assets/registration_art.svg')"></v-img>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {postRegistrationData} from "@/api/submit";
import {houses, mentorGroups, subjects} from "@/data/globals";

export default {
  data: () => ({
    // models
    house: '',
    majors: [],
    honours: [],
    mentorClass: '',
    year: 0,

    // rules
    houseInputRules: [
      val => !!val || "House is Required"
    ],
    mentorInputRules: [
      val => !!val || "Mentor Class is Required"
    ],
    majorInputRules: [
      val => val.length >= 2 || "At least two majors is required"
    ],
    yearInputRules: [
      val => !!val || "Year is Required"
    ],

    houseItems: houses,
    yearItems: Array.from(Array(6).keys()).map(x => x + 1),
    mentorItems: mentorGroups,
    majorItems: subjects
  }),
  name: "RegisterView",

  computed: {
    majorsAndHonoursRule() {
      if (this.honours.some(val => this.majors.every(oth => oth !== val))) {
        return "You can only honour in a subject that you major in!"
      }
      return true
    }
  },

  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        postRegistrationData(
            this.house,
            this.year,
            this.majors,
            this.honours,
            this.mentorClass
        ).then(res => {
          if (res.success) {
            this.$store.commit('showSnackbar', 'Registration details have been submitted successfully!')
            window.location.href = '/calendar'
          } else {
            this.$store.commit('showSnackbar', 'There was an error submitting you details! Please try again.')
          }
        })
      }
    },
  }
}
</script>

<style scoped>

</style>