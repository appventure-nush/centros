<template>
  <v-container class="pa-0">

    <v-tabs
        v-model="tabSelected"
        centered
        grow
        class="primary"
    >
      <v-tab>My Files</v-tab>
      <v-tab>Shared with Me</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tabSelected">
      <v-tab-item>

        <v-container class="pt-4 pa-0">

          <v-row no-gutters>
            <v-col class="col-8">
              <v-btn
                  class="ml-4 pl-2"
                  text
                  color="primary"
                  @click="addFile = true"
              >
                <v-icon>mdi-plus</v-icon>
                New File
              </v-btn>
            </v-col>
            <v-col>
              <v-select
                  class="pr-4"
                  dense
                  outlined
                  prepend-icon="mdi-filter"
                  :items="sortItems"
                  v-model="sortTypeSelected"
                  label="Sort by"
              ></v-select>
            </v-col>
          </v-row>

          <v-container fluid class="mt-12" v-if="files.length === 0">
            <v-row justify="center">
              <v-img contain max-height="200" :src="require('../assets/no_files_art.svg')"></v-img>
            </v-row>
            <v-row justify="center">
              <p class="overline mt-4">You do not have any files :(</p>
            </v-row>
          </v-container>

          <v-row class="mt-0">
            <v-container class="pt-0 d-flex flex-wrap" v-if="files.length > 0">
              <FileCard
                  v-for="file of files"
                  :key="file.document_id"
                  :filename="file.file_name"
                  :filetype="file.file_type"
                  :link="file.link"
                  :access-date="file.last_access_date"
                  :access-time="file.last_access_time"
                  :show-review="true"
                  @review="submitReview(file)"
              ></FileCard>
            </v-container>
          </v-row>
        </v-container>

        <v-dialog
            v-model="addFile"
            width="700">
          <v-toolbar dense class="text-h5 font-weight-bold" color="primary" dark>Add New File</v-toolbar>
          <v-card>
            <v-card-text>
              <v-form ref="form" class="pt-12">
                <v-file-input
                    outlined
                    v-model="selectedFile"
                    :rules="[v => !!v || 'File is required']"
                    label="File"
                ></v-file-input>
                <v-text-field
                    prepend-icon="mdi-web"
                    label="Link"
                    v-model="linkInput"
                    :rules="[v => !!v || 'Link is required']"
                    outlined>
                </v-text-field>
              </v-form>
            </v-card-text>

            <v-card-actions class="justify-end">
              <v-btn
                  color="primary" @click="submitCreateDocument">
                Done
              </v-btn>

              <v-btn
                  @click="closeCreateDocument"
                  text>
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-tab-item>

      <v-tab-item>
        <v-container fluid class="mt-12" v-if="sharedFiles.length === 0">
          <v-row justify="center">
            <v-img contain max-height="200" :src="require('../assets/no_files_art.svg')"></v-img>
          </v-row>
          <v-row justify="center">
            <p class="overline mt-4">You do not have any files :(</p>
          </v-row>
        </v-container>

        <v-container class="pt-4 pa-0" v-if="sharedFiles.length > 0">
          <v-row class="mt-0">
            <v-container class="pt-0 d-flex flex-wrap">
              <FileCard
                  v-for="file of sharedFiles"
                  :key="file.document_id"
                  :filename="file.file_name"
                  :filetype="file.file_type"
                  :link="file.link"
                  :access-date="file.last_access_date"
                  :access-time="file.last_access_time"
                  :show-review="false"
              ></FileCard>
            </v-container>
          </v-row>
        </v-container>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import FileCard from '../components/FileCard'
import {getUserDocument, getUserSharedDocument, postCreateDocument} from "@/api/document";
import {postSubmitReview} from "@/api/review";
import {getMysqlFormattedDate, getMysqlFormattedTime} from "@/data/formatter";

export default {
  name: "FileView",
  data: () => ({
    files: [],
    sharedFiles: [],
    linkInput: '',
    selectedFile: null,
    tabSelected: null,
    addFile: false,
    sortTypeSelected: 'Last Modified',
    sortItems: ['Last Modified', 'Name', 'File Type'],
  }),

  methods: {
    reloadUserSharedDocument() {
      if (!this.$store.state.user || !this.$store.state.user.isAdmin) return

      getUserSharedDocument().then(data => {
        this.sharedFiles = data
      })
    },
    reloadUserDocument() {
      getUserDocument().then(data => {
        this.files = data
      })
    },
    closeCreateDocument() {
      this.$refs.form.reset()
      this.addFile = false
    },

    submitCreateDocument() {
      if (this.$refs.form.validate()) {
        postCreateDocument(this.selectedFile.name, this.selectedFile.type, this.linkInput, 'DOCUMENT').then(res => {
          this.closeCreateDocument()
          if (res.success) {
            this.$store.commit('showSnackbar', "Successfully added file!")
          } else {
            this.$store.commit('showSnackbar', "There was an error adding the file :(")
          }
          this.reloadUserDocument()
        })
      }
    },

    submitReview(document) {
      postSubmitReview(document.document_id, getMysqlFormattedDate(new Date()),
          getMysqlFormattedTime(new Date())).then(res => {
        if (res.success) {
          this.$store.commit('showSnackbar', "Successfully sent file for review!")
        } else {
          this.$store.commit('showSnackbar', "There was an error sending the file for review :(")
        }
      })
    }
  },

  mounted() {
    this.reloadUserDocument()
    this.reloadUserSharedDocument()
  },
  watch: {
    '$store.state.user': function () {
      this.reloadUserDocument()
      this.reloadUserSharedDocument()
    },
    'sortTypeSelected': function () {
      console.log('sorting')
      if (this.sortTypeSelected === 'Last Modified') {
        this.files.sort(function (a, b) {
          return a.last_access_datetime > b.last_access_datetime
        })
      } else if (this.sortTypeSelected === 'Name') {
        this.files.sort(function (a, b) {
          return a.file_name > b.file_name
        })
      } else if (this.sortTypeSelected === 'File Type') {
        this.files.sort(function (a, b) {
          return a.file_type > b.file_type
        })
      }
    }
  },
  components: {
    FileCard
  }
}
</script>

<style scoped>

</style>