<template>
  <v-container>
    <v-subheader>Upcoming Meetings</v-subheader>
    <v-container fluid>
      <MeetingCard
          class="mb-4"
          v-for="meeting of upcoming"
          :key="meeting.meeting_id"
          :name="meeting.counsellor_name"
          :venue="meeting.venue"
          :date="meeting.date"
          :start-time="meeting.start_time"
          :end-time="meeting.end_time"
          :description="meeting.description"
          :email="meeting.counsellor_email"
          :meeting-status="meeting.meeting_status"
          :meeting-id="meeting.meeting_id"
          :reason="meeting.reason"
          @cancel="cancelMeeting"
      ></MeetingCard>
    </v-container>


    <v-container fluid v-if="upcoming.length === 0">
      <v-row justify="center">
        <v-img contain max-height="200" :src="require('../assets/no_meeting_art.svg')"></v-img>
      </v-row>
      <v-row justify="center">
        <p class="overline mt-4">You do not have any upcoming meetings</p>
      </v-row>
    </v-container>
    <v-divider></v-divider>

    <v-subheader>Past Meetings</v-subheader>
    <v-container fluid>
      <MeetingCard
          class="mb-4"
          v-for="meeting of past"
          :key="meeting.meeting_id"
          :name="meeting.counsellor_name"
          :venue="meeting.venue"
          :date="meeting.date"
          :start-time="meeting.start_time"
          :end-time="meeting.end_time"
          :description="meeting.description"
          :meeting-id="meeting.meeting_id"
          :email="meeting.counsellor_email"
          :meeting-status="meeting.meeting_status"
          :reason="meeting.reason"
          @cancel="cancelMeeting"
      ></MeetingCard>
    </v-container>
    <v-container fluid v-if="past.length === 0">
      <v-row justify="center">
        <v-img contain max-height="200" :src="require('../assets/no_meeting_art.svg')"></v-img>
      </v-row>
      <v-row justify="center">
        <p class="overline mt-4">You do not have any past meetings</p>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import MeetingCard from "@/components/MeetingCard";
import {getUserScheduledMeetings, postDeclineMeeting} from "@/api/meeting";

export default {
  name: "MeetingView",
  data: () => ({
    meetings: [],
  }),
  computed: {
    upcoming() {
      return this.meetings.filter(m => m.start_time.getTime() >= Date.now())
    },
    past() {
      return this.meetings.filter(m => m.start_time.getTime() < Date.now())
    },
  },

  mounted() {
    this.reloadUserMeetings()
  },

  components: {MeetingCard},
  methods: {
    cancelMeeting(meeting_id, reason) {
      postDeclineMeeting(meeting_id, reason).then(res => {
        if (res.success) {
          this.$store.commit('showSnackbar', "Successfully cancelled meeting!")
        } else {
          this.$store.commit('showSnackbar', "There was an error cancelling the meeting :(")
        }
        this.reloadUserMeetings()
      })
    },

    reloadUserMeetings() {
      getUserScheduledMeetings().then(data => {
        this.meetings = data
      })
    }
  },

  watch: {
    '$store.state.user': function () {
      this.reloadUserMeetings()
    },
  },
}
</script>

<style scoped>

</style>