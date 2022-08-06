<template>
  <v-container fluid>
    <div class="pa-4">
      <v-row>
        <v-col>
          <h1 class="text-h4 font-weight-bold">My Reviews</h1>
        </v-col>
      </v-row>

      <v-row no-gutters v-if="this.$store.state.user && this.$store.state.user.isAdmin">
        <v-col>
          <p>Below are the list of pending review requests from students.</p>
        </v-col>
      </v-row>

      <v-row dense no-gutters>
        <v-col>
          <p>Last Updated: {{ getReadTime() }}</p>
        </v-col>
      </v-row>
    </div>
    <v-data-table
        :headers="reviewHeaders"
        :items="reviews"
        :footer-props="{
                  'items-per-page-options': [40, 80, -1]
              }"
        :items-per-page="20"
        class="elevation-1">

      <template v-slot:[`item.status`]="{ item }">
        <v-chip :color="statusColor[item.status]">{{ item.status }}</v-chip>
      </template>

      <template v-slot:[`item.link`]="{ item }">
        <v-btn icon :href="item.link">
          <v-icon>mdi-open-in-new</v-icon>
        </v-btn>
      </template>

      <template v-slot:[`item.name`]="{ item }">
        <v-list-item-content>
          <v-list-item-title>{{ item.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ item.email }}</v-list-item-subtitle>
        </v-list-item-content>
      </template>

      <template v-slot:[`item.review_id`]="{ item }">
        <v-btn text class="primary" @click="selectedReview = item.review_id; confirmDialog = true">
          Review
        </v-btn>
      </template>
    </v-data-table>

    <v-dialog
        v-model="confirmDialog"
        width="300"
    >
      <v-card>
        <v-card-title class="font-weight-bold">
          Review File
        </v-card-title>

        <v-card-text>
          Are you sure you want to complete the review?
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="primary"
              text
              @click="submitCompleteReview"
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
  </v-container>
</template>

<script>
import moment from "moment";
import {getUserReviews, postCompleteReview} from "@/api/review";

export default {
  name: "ReviewView",
  data: () => ({
    confirmDialog: false,
    selectedReview: null,
    statusColor: {
      PENDING: 'warning',
      REVIEWED: 'success',
      ERROR: 'error'
    },

    reviewHeaders: [
      {
        text: 'File',
        value: 'file_name'
      },
      {
        text: 'Status',
        value: 'status'
      },
      {
        text: 'File Type',
        value: 'file_type'
      },
      {
        text: 'Request Date',
        value: 'request_date'
      },
      {
        text: 'Request Time',
        value: 'request_time'
      },
      {
        text: 'Link',
        value: 'link'
      },

    ],
    reviews: []
  }),

  mounted() {
    this.reloadUserReviews()
    if (this.$store.state.user && this.$store.state.user.isAdmin) {
      this.reviewHeaders.push({text: 'From', value: 'name'})
      this.reviewHeaders.push({text: 'Action', value: 'review_id'})
    }
  },

  methods: {
    getReadTime() {
      return moment().format('MMMM Do YYYY, h:mm:ss a');
    },

    reloadUserReviews() {
      getUserReviews().then(data => {
        this.reviews = data
      })
    },
    submitCompleteReview() {
      this.confirmDialog = false
      postCompleteReview(this.selectedReview).then(res => {
        if (res.success) {
          this.$store.commit('showSnackbar', "Successfully reviewed file!")
        } else {
          this.$store.commit('showSnackbar', "There was an error reviewing the file :(")
        }
        this.reloadUserReviews()
      })
    }
  },

  watch: {
    '$store.state.user': function () {
      if (this.$store.state.user.isAdmin) {
        this.reviewHeaders.push({text: 'From', value: 'name'})
        this.reviewHeaders.push({text: 'Action', value: 'review_id'})
      }
      this.reloadUserReviews()
    }
  }
}
</script>

<style scoped>

</style>