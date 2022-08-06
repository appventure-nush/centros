<template>
  <v-card

      width="240"
      class="mx-auto my-4 d-flex flex-column"
      elevation="2"
      outlined>

    <v-img
        class="mx-auto my-5"
        max-width="125"
        contain
        :src="getImageForFileType()"
    >
    </v-img>

    <v-card-title>{{ filename }}</v-card-title>
    <v-card-subtitle>Last Modified: {{ accessDate }} {{ accessTime }}</v-card-subtitle>

    <v-spacer></v-spacer>
    <v-card-actions>
      <v-btn
          color="mary"
          text
          :href="link"
      >
        View
      </v-btn>
      <v-spacer></v-spacer>
      <v-tooltip bottom v-if="showReview">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon
                 @click="confirmDialog = true"
                 v-bind="attrs"
                 v-on="on">
            <v-icon>mdi-message-draw</v-icon>
          </v-btn>
        </template>
        <span>Send for Review</span>
      </v-tooltip>

      <v-dialog
          v-model="confirmDialog"
          width="300"
      >
        <v-card>
          <v-card-title class="font-weight-bold">
            Review File
          </v-card-title>

          <v-card-text>
            Are you sure you want to send this file for review?
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="primary"
                text
                @click="handleReview"
            >
              Confirm
            </v-btn>

            <v-btn
                text
                @click="confirmDialog = false"
            >
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-actions>
  </v-card>
</template>

<script>
import wordImage from '../assets/word_file_logo.png'
import pptImage from '../assets/powerpoint_file_logo.png'
import excelImage from '../assets/excel_file_logo.png'
import imageImage from '../assets/image_file_logo.png'
import pdfImage from '../assets/pdf_file_logo.png'
import generalImage from  '../assets/general_file_icon.png'

export default {
  name: "FileCardComponent",
  data: () => ({
    confirmDialog: false,
  }),

  methods: {
    getImageForFileType() {
      if (this.filetype === 'docx') {
        return wordImage
      } else if (this.filetype === 'pptx') {
        return pptImage
      } else if (this.filetype === 'xlsx') {
        return excelImage
      } else if (this.filetype === 'image') {
        return imageImage
      } else if (this.filetype === 'pdf') {
        return pdfImage
      } else {
        return generalImage
      }
    },

    handleReview() {
      this.confirmDialog = false
      this.$emit('review')
    }
  },

  props: {
    filetype: {require: true, type: String},
    filename: {require: true, type: String},
    accessDate: {require: true, type: String},
    accessTime: {require: true, type: String},
    link: {require: true, type: String},
    showReview: {require: true, type: Boolean}
  }
}
</script>

<style scoped>

</style>