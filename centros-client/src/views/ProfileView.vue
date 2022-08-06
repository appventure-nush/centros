<template>
  <v-card>
    <v-list
        two-line
        subheader>
      <v-list-item>
        <v-list-item-content>
          <div class="mx-auto text-center">
            <UserAvatar :size="200" style="font-size: 6em"></UserAvatar>
            <h1 class="display-1 font-weight-black">{{ user_name }}</h1>
            <h1 class="subtitle-1">
              {{ user_email }}
            </h1>
          </div>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Account Type</v-list-item-title>
          <v-list-item-subtitle>{{ metadata.user_type }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>House</v-list-item-title>
          <v-list-item-subtitle>{{ metadata.house }}</v-list-item-subtitle>
        </v-list-item-content>

        <!--        <v-list-item-action>-->
        <!--          <v-btn icon>-->
        <!--            <v-icon>mdi-pencil</v-icon>-->
        <!--          </v-btn>-->
        <!--        </v-list-item-action>-->
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Graduation Year</v-list-item-title>
          <v-list-item-subtitle>{{ metadata.graduation_year }}</v-list-item-subtitle>
        </v-list-item-content>

        <!--        <v-list-item-action>-->
        <!--          <v-btn-->
        <!--              @click="editGradYear = true"-->
        <!--              icon>-->
        <!--            <v-icon>mdi-pencil</v-icon>-->
        <!--          </v-btn>-->
        <!--        </v-list-item-action>-->
      </v-list-item>

      <v-dialog
          v-model="editGradYear"
          width="450">
        <v-card>
          <v-toolbar dense class="text-h5 font-weight-bold" color="primary" dark>Edit Graduation Year</v-toolbar>
          <div class="px-12 pt-12">
            <v-select
                class="mx-12"
                :items="editGradYearItems"
                outlined
            ></v-select>
          </div>
          <v-card-actions class="justify-end">
            <v-btn
                color="primary">
              Done
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Mentor Group</v-list-item-title>
          <v-list-item-subtitle>{{ metadata.mentor_group }}</v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action>
          <v-btn
              icon
              @click="editMentorGroup = true"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>

      <v-dialog
          v-model="editMentorGroup"
          width="450">
        <v-card>
          <v-toolbar dense class="text-h5 font-weight-bold" color="primary" dark>Edit Mentor Group</v-toolbar>
          <div class="px-12 pt-12">
            <v-form ref="editMentorGroupForm">
              <v-select
                  :rules="[v => !!v || `Please specify your Mentor Group`]"
                  class="mx-12"
                  v-model="editMentorGroupInput"
                  :items="editMentorGroupItems"
                  outlined
              ></v-select>
            </v-form>

          </div>
          <v-card-actions class="justify-end">
            <v-btn
                @click="submitEditMentorGroup"
                color="primary">
              Done
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>


      <v-divider></v-divider>

      <v-list-item>
        <v-list-item-title>Majors</v-list-item-title>
        <v-chip-group>
          <v-chip color="primary" v-for="major in metadata.majors" :key="major">{{ major }}</v-chip>
        </v-chip-group>

        <!--        <v-list-item-action>-->
        <!--          <v-btn icon class="mr-5"-->
        <!--                 @click="loadMajorsDialog">-->
        <!--            <v-icon>mdi-pencil</v-icon>-->
        <!--          </v-btn>-->
        <!--        </v-list-item-action>-->
      </v-list-item>

      <v-list-item>
        <v-list-item-title>Honours</v-list-item-title>
        <v-chip-group>
          <v-chip color="primary" v-for="honour in metadata.honours" :key="honour">{{ honour }}</v-chip>
        </v-chip-group>

        <!--        <v-list-item-action>-->
        <!--          <v-btn icon class="mr-5"-->
        <!--                 @click="loadHonoursDialog">-->
        <!--            <v-icon>mdi-pencil</v-icon>-->
        <!--          </v-btn>-->
        <!--        </v-list-item-action>-->
      </v-list-item>

      <v-dialog
          v-model="subjectEdit"
          width="450">
        <v-card>
          <v-toolbar dense class="text-h5 font-weight-bold" color="primary" dark>Edit {{ subjectEditMode }}</v-toolbar>
          <div class="px-12 pt-12">
            <v-form ref="subjectInput">
              <v-autocomplete
                  :label="subjectEditMode"
                  chips
                  deletable-chips
                  outlined
                  multiple
                  v-model="subjectsSelected"
                  :rules="subjectInputRules"
                  :items="subjectItems"
              ></v-autocomplete>
            </v-form>

          </div>
          <v-card-actions class="justify-end">
            <v-btn
                color="primary"
                @click="submitSubjectChange">
              Done
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-list>

    <v-card-actions class="justify-center">
      <v-btn
          min-width="300"
          color="primary"
          href="/signout"
      >
        <v-icon class="mr-2">
          mdi-logout
        </v-icon>
        Logout
      </v-btn>
    </v-card-actions>

  </v-card>
</template>

<script>
import {mentorGroups, subjects} from "@/data/globals";
import UserAvatar from "@/components/UserAvatar";
import {postEditMentorGroup} from "@/api/meta";

const {getUserMetadata} = require("@/api/meta");

export default {
  name: "ProfileView",
  components: {UserAvatar},
  data: () => ({
    editMentorGroupInput: '',
    metadata: {},
    editGradYear: false,
    editMentorGroup: false,
    subjectEdit: false,
    subjectEditMode: null,
    editMentorGroupItems: mentorGroups,
    subjectItems: subjects,
    subjectsSelected: [],
  }),

  methods: {
    reloadUserMetadata() {
      getUserMetadata().then(data => {
        this.metadata = data
      })
    },
    submitEditMentorGroup() {
      if (this.$refs.editMentorGroupForm.validate()) {
        let currYear = new Date().getFullYear()
        let gradYear = this.metadata.graduation_year
        let year = 6 - (gradYear - currYear)
        let newMentorGroup = 'M' + (currYear % 100) + year + this.editMentorGroupInput
        postEditMentorGroup(newMentorGroup).then(res => {
          this.$refs.editMentorGroupForm.reset()
          this.editMentorGroup = false
          if (res.success) {
            this.$store.commit('showSnackbar', "Successfully edited mentor group!")
          } else {
            this.$store.commit('showSnackbar', "There was an error editing your mentor group :(")
          }
          this.reloadUserMetadata()
        });
      }
    },
    loadMajorsDialog() {
      this.subjectEditMode = "Majors"
      this.subjectEdit = true
      this.subjectsSelected = []
      this.$refs.subjectInput.reset()
    },
    loadHonoursDialog() {
      this.subjectEditMode = "Honours"
      this.subjectEdit = true
      this.subjectsSelected = []
      this.$refs.subjectInput.reset()
    },
    submitSubjectChange() {
      if (this.$refs.subjectInput.validate()) {
        alert('ok')
      }
    }
  },

  mounted() {
    this.reloadUserMetadata()
  },

  computed: {
    subjectInputRules() {
      return [val => val.length >= 2 || `At least two ${this.subjectEditMode} is required`]
    },
    user_name() {
      if (!this.$store.state.user) return "User"
      return this.$store.state.user.name
    },
    user_email() {
      if (!this.$store.state.user) return "Email"
      return this.$store.state.user.email
    },

    editGradYearItems() {
      let year = new Date().getFullYear()
      let res = []
      for (let i = 0; i < 6; ++i) {
        res.push(year + i)
      }
      return res
    },
  },
  watch: {
    '$store.state.user': function () {
      this.reloadUserMetadata()
    }
  }
}
</script>

<style scoped>

</style>