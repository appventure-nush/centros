<template>
  <v-container fluid class="px-12">
    <div class="pa-4">
      <v-row>
        <v-col>
          <h1 class="text-h4 font-weight-bold">Meeting Schedule</h1>
        </v-col>
      </v-row>

      <!--      <v-row dense no-gutters>-->
      <!--        <v-col>-->
      <!--          <p>Last Updated: {{ getReadTime() }}</p>-->
      <!--        </v-col>-->
      <!--      </v-row>-->


      <v-row dense no-gutters>
        <v-col>
          <p>This site is for scheduling appointments with Mr West only. You can schedule appointments with Mr Allan <a
              href="https://tinyurl.com/see-mr-allan">here</a></p>
        </v-col>
      </v-row>

      <v-row dense no-gutters>
        <v-col>
          <p>Canteen College Counselling - Find Mr West at the canteen at 1130-1300, say hello, and ask questions about
            your university journeys and dreams.</p>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <MeetingCard
              v-for="meeting in pendingMeetings"
              :key="meeting.meeting_id"
              :name="meeting.name"
              :email="meeting.email"
              :description="meeting.description"
              :date="getDateFromMysqlDate(meeting.date)"
              :start-time="getDateFromMysqlTime(meeting.start_time)"
              :end-time="getDateFromMysqlTime(meeting.end_time)"
          >

          </MeetingCard>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-row>
            <v-container fluid class="d-flex align-center justify-center">
              <v-btn icon class="ml-auto" @click="goToPreviousPage">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <p class="ma-0">{{ currDateFormatted() }}</p>
              <v-btn icon @click="goToNextPage">
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
              <v-btn class="ml-auto" icon @click="changeCalendarMode">
                <v-icon>mdi-calendar-month-outline</v-icon>
              </v-btn>
            </v-container>
          </v-row>

          <v-row>
            <v-col>
              <v-calendar
                  :start="new Date()"
                  ref="calendar"
                  event-overlap-mode="column"
                  v-model="targetDate"
                  style="height: auto; width: auto;"
                  :type="mode"
                  :events="events"
                  color="primary"
                  :event-ripple="false"
                  @click:event="showMeetingDetails"
                  @click:date="viewWeek"
                  @mousedown:event="startDrag"
                  @mousedown:time="startTime"
                  @mousemove:time="mouseMove"
                  @mouseup:time="endDrag"
                  @mouseleave.native="cancelDrag"
                  interval-minutes="30"
                  first-interval="15"
                  interval-count="19">
                <template v-slot:interval="{past, weekday}">
                  <div class="fill-height" style="background: #e6e6e6"
                       v-if="past || weekday === 0 || weekday === 6"></div>
                </template>
              </v-calendar>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>

    <div style="height: 60px"></div>

    <v-menu
        v-model="selectedOpen"
        :close-on-content-click="false"
        :activator="selectedElement"
        offset-x
    >
      <v-card
          width="300"
          flat
      >
        <v-list>
          <v-subheader>Booked By</v-subheader>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ selectedEvent.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ selectedEvent.email }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-text</v-icon>
            </v-list-item-icon>
            <v-list-item-content>{{ selectedEvent.description }}</v-list-item-content>
          </v-list-item>

          <v-list-item v-if="selectedEvent.venue">
            <v-list-item-icon>
              <v-icon>mdi-map-marker</v-icon>
            </v-list-item-icon>
            <v-list-item-content>{{ selectedEvent.venue }}</v-list-item-content>
          </v-list-item>
          <v-list-item two-line>
            <v-list-item-icon>
              <v-icon>mdi-calendar-clock</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ getFormattedDate(selectedEvent.start) }}</v-list-item-title>
              <v-list-item-subtitle>{{ getFormattedTime(selectedEvent.start) }} to
                {{ getFormattedTime(selectedEvent.end) }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-chip :color="meetingStatusToColor[selectedEvent.meeting_status]"
                    text-color="white">
              {{ selectedEvent.meeting_status }}
            </v-chip>
          </v-list-item>
        </v-list>
        <v-card-actions v-if="showCancelMeetingActions">
          <v-spacer></v-spacer>
          <v-btn text color="error" @click="cancelDialog = true">Cancel</v-btn>
        </v-card-actions>
        <v-card-actions v-if="showConfirmMeetingActions">
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="acceptDialog = true">Accept</v-btn>
          <v-btn text color="error" @click="declineDialog = true">Decline</v-btn>
        </v-card-actions>
        <v-card-actions v-if="showCompleteMeetingActions">
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="completeDialog = true">Mark Completed</v-btn>
          <v-btn text color="error" @click="declineDialog = true">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>

    <v-bottom-sheet
        hide-overlay
        persistent
        ref="bottomSheet"
        :value="showCreatePrompt"
        no-click-animation
        :retain-focus="false">
      <v-sheet
          height="80px"
          class="d-flex justify-center align-center pa-10">
        New Meeting: {{ meetingDate }} {{ meetingStartTime }} to {{ meetingEndTime }}

        <v-btn
            class="ml-auto mr-3"
            color="primary"
            @click="scheduleDialog = true"
        >Schedule
        </v-btn>

        <v-dialog
            v-model="scheduleDialog"
            width="700"
        >
          <v-card>
            <v-card-title class="font-weight-bold">
              Schedule Meeting
            </v-card-title>

            <v-card-text>
              <p>Please provide a short description of what you would like to discuss about.</p>
              <v-form ref="scheduleForm">
                <v-text-field
                    prepend-icon="mdi-pencil"
                    outlined
                    v-model="descriptionInput"
                    dense
                    :rules="[v => !!v || `Description is required`]"
                    label="Description"
                >
                </v-text-field>
              </v-form>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                  text
                  @click="closeScheduleDialog"
              >
                Cancel
              </v-btn>

              <v-btn
                  color="primary"
                  text
                  @click="submitMeetingSchedule"
              >
                Confirm
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-btn
            text
            color="red"
            @click="cancelScheduleNewMeeting">
          Cancel
        </v-btn>
      </v-sheet>
    </v-bottom-sheet>

    <v-dialog
        v-model="acceptDialog"
        width="700"
    >
      <v-card>
        <v-card-title class="font-weight-bold">
          Accept Meeting
        </v-card-title>

        <v-card-text>
          <p>Where will the meeting take place?</p>
          <v-form ref="acceptForm">
            <v-text-field
                outlined
                prepend-icon="mdi-map-marker"
                v-model="venueInput"
                dense
                :rules="[v => !!v || `A venue is required`]"
                label="Venue"
            >
            </v-text-field>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              text
              @click="closeAcceptDialog"
          >
            Cancel
          </v-btn>

          <v-btn
              color="primary"
              text
              @click="submitAcceptMeeting"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
        v-model="declineDialog"
        width="700"
    >
      <v-card>
        <v-card-title class="font-weight-bold">
          Decline Meeting
        </v-card-title>

        <v-card-text>
          <p>Please provide a short reason for declining the meeting.</p>
          <v-form ref="declineForm">
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
              text
              @click="closeDeclineDialog"
          >
            Cancel
          </v-btn>

          <v-btn
              color="primary"
              text
              @click="submitDeclineMeeting"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
        v-model="completeDialog"
        width="300"
    >
      <v-card>
        <v-card-title class="font-weight-bold">
          Complete Meeting
        </v-card-title>

        <v-card-text>
          Are you sure you want to complete this meeting?
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="primary"
              text
              @click="submitCompleteMeeting"
          >
            Confirm
          </v-btn>

          <v-btn
              text
              @click="completeDialog = false"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
              text
              @click="closeCancelDialog"
          >
            Cancel
          </v-btn>

          <v-btn
              color="primary"
              text
              @click="submitCancelMeeting"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>


<script>
import moment from 'moment'
import {maxContiguousMeetingInterval, meetingStatusToColor} from "@/data/globals";
import {
  getFormattedDate,
  getFormattedTime,
  getMysqlFormattedTime,
  getMysqlFormattedDate
} from "@/data/formatter";
import MeetingCard from "@/components/MeetingCard";
import {
  getPublicMeetings,
  postAcceptMeeting,
  postCompleteMeeting,
  postDeclineMeeting,
  scheduleMeeting
} from "@/api/meeting";

export default {
  name: "MeetingSchedule",
  components: {MeetingCard},
  data: () => ({
    completeDialog: false,
    meetingStatusToColor,
    pendingMeetings: [],
    events: [],
    targetDate: moment().format('YYYY-MM-DD'),
    descriptionInput: null,
    // models for displaying meeting details
    selectedOpen: false,
    selectedElement: null,
    selectedEvent: {
      name: '',
      meeting_status: 'CANCELLED',
    },
    acceptDialog: false,
    venueInput: '',
    declineDialog: false,
    reasonInput: '',
    scheduleDialog: false,
    cancelDialog: false,

    // models for meeting schedule
    ready: false,
    mode: 'week',
    showCreatePrompt: false,
    newMeeting: null,
    meetingStartTime: null,
    meetingEndTime: null,
    meetingDate: null,

    // add event related models
    dragEvent: null,
    dragStart: null,
    createStart: null,
    extendOriginal: null,
  }),
  computed: {
    showCancelMeetingActions() {
      if (!this.$store.state.user) return false
      if (this.selectedEvent.meeting_status === 'SCHEDULED') {
        return this.$store.state.user.isAdmin || this.selectedEvent.student_id === this.$store.state.user.user_id;
      } else {
        return this.selectedEvent.student_id === this.$store.state.user.user_id;
      }
    },

    showConfirmMeetingActions() {
      if (!this.$store.state.user) return false
      return this.$store.state.user.isAdmin && this.selectedEvent.meeting_status === 'PENDING'
    },

    showCompleteMeetingActions() {
      if (!this.$store.state.user) return false
      return this.$store.state.user.isAdmin && this.selectedEvent.meeting_status === 'SCHEDULED'
          && new Date(this.selectedEvent.end) < new Date()
    },

    cal() {
      return this.ready ? this.$refs.calendar : null
    },
  },
  mounted() {
    this.ready = true
    this.scrollToTime()
    this.updateTime()
    this.reloadPublicMeetings()
  },

  methods: {
    submitCompleteMeeting() {
      postCompleteMeeting(this.selectedEvent.meeting_id).then(res => {
        this.completeDialog = false
        if (res.success) {
          this.$store.commit('showSnackbar', "Successfully completed meeting! A minutes file has been created!")
        } else {
          this.$store.commit('showSnackbar', "There was an error completing the meeting :(")
        }
        this.reloadPublicMeetings()
      })
    },
    closeAcceptDialog() {
      this.$refs.acceptForm.reset()
      this.acceptDialog = false
    },
    submitAcceptMeeting() {
      if (this.$refs.acceptForm.validate()) {
        postAcceptMeeting(this.$store.state.user.user_id, this.selectedEvent.meeting_id, this.venueInput).then(res => {
          this.closeAcceptDialog()
          if (res.success) {
            this.$store.commit('showSnackbar', "Successfully accepted meeting!")
          } else {
            this.$store.commit('showSnackbar', "There was an error accepting the meeting :(")
          }
          this.reloadPublicMeetings()
        })
      }
    },
    submitDeclineMeeting() {
      if (this.$refs.declineForm.validate()) {
        postDeclineMeeting(this.selectedEvent.meeting_id, this.reasonInput).then(res => {
          this.closeDeclineDialog()
          if (res.success) {
            this.$store.commit('showSnackbar', "Successfully declined meeting!")
          } else {
            this.$store.commit('showSnackbar', "There was an error declining the meeting :(")
          }
          this.reloadPublicMeetings()
        })
      }
    },
    submitCancelMeeting() {
      if (this.$refs.cancelForm.validate()) {
        postDeclineMeeting(this.selectedEvent.meeting_id, this.reasonInput).then(res => {
          this.closeCancelDialog()
          if (res.success) {
            this.$store.commit('showSnackbar', "Successfully cancelled meeting!")
          } else {
            this.$store.commit('showSnackbar', "There was an error cancelling the meeting :(")
          }
          this.reloadPublicMeetings()
        })
      }
    },
    closeDeclineDialog() {
      this.$refs.declineForm.reset()
      this.declineDialog = false
    },
    closeCancelDialog() {
      this.$refs.cancelForm.reset()
      this.cancelDialog = false
    },
    closeScheduleDialog() {
      this.$refs.scheduleForm.reset()
      this.scheduleDialog = false
    },
    reloadPublicMeetings() {
      this.cancelScheduleNewMeeting()
      getPublicMeetings().then(value => {
        this.events = value
      })
    },
    getFormattedDate,
    getFormattedTime,
    // submit to api
    submitMeetingSchedule() {
      if (this.$refs.scheduleForm.validate()) {
        scheduleMeeting(this.$store.state.user.user_id, this.descriptionInput, getMysqlFormattedDate(this.newMeeting.start),
            getMysqlFormattedTime(this.newMeeting.start), getMysqlFormattedTime(this.newMeeting.end))
            .then(res => {
              this.closeScheduleDialog()
              if (res.success) {
                this.$store.commit('showSnackbar', "Successfully scheduled meeting!")
                this.cancelScheduleNewMeeting()
              } else {
                this.$store.commit('showSnackbar', "There was an error scheduling your meeting :(")
              }
              this.reloadPublicMeetings()
            });
      }
    },

    showMeetingDetails({nativeEvent, event}) {
      if (this.newMeeting && event.name === this.newMeeting.name) return

      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        requestAnimationFrame(() => requestAnimationFrame(() => open()))
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },
    goToNextPage() {
      this.$refs.calendar.next()
      this.cancelScheduleNewMeeting()
    },
    goToPreviousPage() {
      this.$refs.calendar.prev()
      this.cancelScheduleNewMeeting()
    },
    changeCalendarMode() {
      if (this.mode === 'month') {
        this.mode = 'week'
      } else {
        this.mode = 'month'
      }
      this.cancelScheduleNewMeeting()
    },

    cancelScheduleNewMeeting() {
      this.deleteNewMeeting()
      this.showCreatePrompt = false
    },


    // add event util functions
    deleteNewMeeting() {
      if (this.newMeeting) {
        this.events.pop()
        this.newMeeting = null
      }
    },

    startDrag({event, timed}) {
      if (event && timed) {
        this.dragEvent = event
        this.dragTime = null
        this.extendOriginal = null
      }
    },

    startTime(tms) {
      const mouse = this.toTime(tms)
      const mouseDate = this.toDate(tms)
      if (mouseDate < Date.now() || mouseDate.getDay() === 0 || mouseDate.getDay() === 6) {
        // this.$store.commit('showSnackbar', 'Stop Trying to Book a Meeting in the Past!')
        return
      }

      if (this.dragEvent && this.dragTime === null) {
        const start = this.dragEvent.start

        this.dragTime = mouse - start
      } else {
        this.createStart = this.roundTime(mouse)

        if (this.newMeeting) this.events.pop()

        this.newMeeting = {
          name: `New Meeting`,
          color: 'primary',
          start: this.createStart,
          end: this.createStart + 30 * 60 * 1000,
          timed: true,
        }
        this.events.push(this.newMeeting)
        this.checkForCollisions();
      }
    },

    checkForCollisions() {
      for (let i = 0; i < this.events.length - 1; i++) {
        let x = this.events[i]
        let st = new Date(x.start)
        let ed = new Date(x.end)

        if (!(this.newMeeting.end <= st.getTime() || this.newMeeting.start >= ed.getTime())) {
          this.deleteNewMeeting();
          break;
        }
      }
    },
    mouseMove(tms) {
      const mouse = this.toTime(tms)

      // if (this.dragEvent && this.dragTime !== null) {
      // const start = this.dragEvent.start
      // const end = this.dragEvent.end
      // const duration = end - start
      // const newStartTime = mouse - this.dragTime
      // const newStart = this.roundTime(newStartTime)
      // const newEnd = newStart + duration
      //
      // this.dragEvent.start = newStart
      // this.dragEvent.end = newEnd
      // }
      if (this.newMeeting && this.createStart !== null) {

        const mouseRounded = this.roundTime(mouse, false)

        if (this.newMeeting.createStart > mouseRounded) return;
        this.newMeeting.start = this.createStart

        // meeting must be at least 30 minutes
        let end = Math.max(mouseRounded, this.createStart + 30 * 60 * 1000)
        this.newMeeting.end = end
        // for students max duration of meeting is 30 * maxInterval minutes
        if (!this.$store.state.user.isAdmin)
          this.newMeeting.end = Math.min(this.newMeeting.end, this.createStart + maxContiguousMeetingInterval * 30 * 60 * 1000)

        // limit drag so as to not collide with future events
        for (let i = 0; i < this.events.length - 1; i++) {
          let x = this.events[i]
          let st = new Date(x.start)
          let ed = new Date(x.end)

          if (ed.getTime() <= this.newMeeting.start) continue;
          this.newMeeting.end = Math.min(this.newMeeting.end, st.getTime())
        }
      }
    },
    endDrag() {
      this.dragTime = null
      this.dragEvent = null
      this.createStart = null
      this.extendOriginal = null
    },
    cancelDrag() {
      if (this.newMeeting) {
        if (this.extendOriginal) {
          this.newMeeting.end = this.extendOriginal
        }
        // else {
        //   const i = this.events.indexOf(this.newMeeting)
        //   if (i !== -1) {
        //     this.events.splice(i, 1)
        //   }
        // }
      }

      this.endDrag()

      // this.newMeeting = null
      // this.createStart = null
      // this.dragTime = null
      // this.dragEvent = null
    },
    roundTime(time, down = true) {
      const roundTo = 30 // minutes
      const roundDownTime = roundTo * 60 * 1000

      return down
          ? time - time % roundDownTime
          : time + (roundDownTime - (time % roundDownTime))
    },

    toDate(tms) {
      return new Date(tms.year, tms.month - 1, tms.day, tms.hour, tms.minute)
    },

    toTime(tms) {
      return this.toDate(tms).getTime()
    },

    viewWeek() {
      this.mode = "week"
    },

    getReadTime() {
      return moment().format('MMMM Do YYYY, h:mm:ss a');
    },
    currDateFormatted() {
      return moment(this.targetDate).format('MMMM YYYY')
    },
    getCurrentTime() {
      return this.cal ? this.cal.times.now.hour * 60 + this.cal.times.now.minute : 0
    },
    scrollToTime() {
      const time = this.getCurrentTime()
      const first = Math.max(0, time - (time % 30) - 30)

      this.cal.scrollToTime(first)
    },
    updateTime() {
      setInterval(() => this.cal.updateTimes(), 60 * 1000)
    },
  },

  watch: {
    newMeeting: {
      handler(newVal) {
        if (!newVal) return
        this.showCreatePrompt = true
        let start = new Date(this.newMeeting.start)
        let end = new Date(this.newMeeting.end)
        this.meetingStartTime = getFormattedTime(start)
        this.meetingEndTime = getFormattedTime(end)
        this.meetingDate = getFormattedDate(start)
      },
      deep: true
    },

    '$store.state.user': function () {
      this.reloadPublicMeetings()
    },

    showCreatePrompt: {
      handler() {
        this.$nextTick(() => {
          this.$refs.bottomSheet.showScroll();
        });
      },
    }

  }
}
</script>

<style lang="css">
.v-calendar-daily__scroll-area {
  overflow-y: hidden !important;
}

.v-calendar-daily_head-day-label {
  pointer-events: none;
}
</style>