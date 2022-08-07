<template>
  <v-card>
    <v-card-title>Meeting #{{ meetingId }}
      <v-chip class="ml-4" dark :color="meetingStatusToColor[meetingStatus]">{{ meetingStatus }}</v-chip>
    </v-card-title>
    <v-card-subtitle>{{ description }}</v-card-subtitle>
    <v-card-text>
      <v-list>
        <v-list-item v-if="!!name && !!email">
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <div>
              <v-menu
                  v-model="menu"
                  bottom
                  right
                  transition="scale-transition"
                  origin="top left"
              >
                <template v-slot:activator="{ on }">
                  <v-chip
                      pill
                      v-on="on"
                  >
                    <v-avatar left>
                      <v-img :src="require('../assets/user.png')"></v-img>
                    </v-avatar>
                    {{ name }}
                  </v-chip>
                </template>
                <v-card width="300">
                  <v-list>
                    <v-list-item>
                      <v-list-item-avatar>
                        <v-img :src="require('../assets/user.png')"></v-img>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title>{{ name }}</v-list-item-title>
                        <v-list-item-subtitle>{{ email }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-menu>
            </div>

          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="venue">
          <v-list-item-icon>
            <v-icon>mdi-map-marker</v-icon>
          </v-list-item-icon>
          <v-list-item-content>{{ venue }}</v-list-item-content>
        </v-list-item>
        <v-list-item two-line>
          <v-list-item-icon>
            <v-icon>mdi-calendar-clock</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ this.formattedDate(date) }}</v-list-item-title>
            <v-list-item-subtitle>{{ this.formattedTime(startTime) }} to {{ this.formattedTime(endTime) }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="reason">
          <v-list-item-icon>
            <v-icon>mdi-cancel</v-icon>
          </v-list-item-icon>
          <v-list-item-content>{{ reason }}</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-actions v-if="showActions">
      <v-spacer></v-spacer>
<!--      <v-btn color="primary" text @click="handleFollowUp" v-if="meetingStatus === 'COMPLETED'">Follow Up</v-btn>-->
      <v-btn color="red" text @click="promptConfirmation">Cancel</v-btn>
    </v-card-actions>

    <v-dialog
        v-model="cancelDialog"
        width="600"
    >
      <v-card>
        <v-card-title class="font-weight-bold">
          Cancel Meeting
        </v-card-title>

        <v-card-text>
          <p>Please provide a short reason for cancelling the meeting.</p>
          <v-form ref="cancelForm">
            <v-text-field
                outlined
                prepend-icon="mdi-pencil"
                v-model="reasonInput"
                dense
                :rules="[v => !!v || `Short reason is required`]"
                label="Reason"
            >
            </v-text-field>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="primary"
              text
              @click="submitCancelMeeting"
          >
            Confirm
          </v-btn>

          <v-btn
              text
              @click="cancelDialog = false"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import {getFormattedDate, getFormattedTime} from "@/data/formatter";
import {meetingStatusToColor} from "@/data/globals";

export default {
  name: "MeetingCard",
  data: () => ({
    meetingStatusToColor,
    reasonInput: '',

    cancelDialog: false,
    menu: false,
  }),

  methods: {
    submitCancelMeeting() {
      if (this.$refs.cancelForm.validate()) {
        this.cancelDialog = false
        this.$emit('cancel', this.meetingId, this.reasonInput)
      }
    },
    promptConfirmation() {
      this.cancelDialog = true
    },
    formattedDate(date) {
      return getFormattedDate(date, true)
    },
    formattedTime(time) {
      return getFormattedTime(time)
    }
  },

  computed: {
    showActions() {
      return !(this.meetingStatus === 'COMPLETED' || this.meetingStatus === 'CANCELLED');
    },
  },

  props: {
    reason: {require: false, type: String},
    name: {require: true, type: String},
    email: {require: true, type: String},
    description: {require: true, type: String},
    meetingStatus: {require: true, type: String},
    venue: {require: false, type: String},
    date: {require: true, type: Date},
    startTime: {require: true, type: Date},
    endTime: {require: true, type: Date},
    meetingId: {require: true, type: Number}
  }
}
</script>

<style scoped>

</style>