<template>
  <v-container fluid class="pa-0">
    <v-row>
      <v-img
          style="position:relative; align-items: center;"
          :src="require('../assets/university_background.png')"
          max-height="300">
        <h1 style="text-align: center; color: white;
" class="display-2 font-weight-bold pa-4">
          University Database</h1>
      </v-img>
    </v-row>

    <v-row v-if="isAdmin">
      <v-btn
          class="ml-6 mt-4"
          text color="primary"
          @click="addUniversity = true"
      >
        <v-icon left>mdi-plus</v-icon>
        Add University
      </v-btn>
    </v-row>

    <v-dialog
        v-model="addUniversity"
        width="100%">
      <v-card tile>
        <v-toolbar dense class="text-h5 font-weight-bold" color="primary" dark>Add New University</v-toolbar>
        <v-card-text>
          <v-form class="pt-4"
                  ref="uniForm">
            <v-text-field
                label="Name"
                dense
                :rules="[nameRules, nameIsUnique]"
                v-model="uniNameInput"
                prepend-icon="mdi-town-hall"
                outlined>
            </v-text-field>
            <v-text-field
                label="Country"
                dense
                v-model="countryInput"
                :rules="countryRules"
                prepend-icon="mdi-earth"
                outlined>
            </v-text-field>
            <v-text-field
                label="State"
                :rules="stateRules"
                v-model="stateInput"
                prepend-icon="mdi-map-marker-radius"
                dense
                outlined>
            </v-text-field>
            <v-text-field
                label="Enrollment"
                dense
                type="number"
                v-model="enrollmentInput"
                :rules="enrollRules"
                prepend-icon="mdi-account-multiple"
                outlined>
            </v-text-field>
            <v-text-field
                label="Website"
                dense
                v-model="websiteInput"
                :rules="websiteRules"
                prepend-icon="mdi-web"
                outlined>
            </v-text-field>

            <v-file-input
                outlined
                dense
                accept="image/*"
                v-model="imageFile"
                label="Logo"
                :loading="isUploading"
                :rules="[v => !!v || 'Logo image is required']"
            ></v-file-input>

            <v-menu
                v-model="startDatePicker"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                    label="Application Start Date"
                    readonly
                    dense
                    outlined
                    v-on="on"
                    prepend-icon="mdi-calendar-start"
                    :value="format(startDate)"
                    :rules="[startDateRules]"
                ></v-text-field>
              </template>
              <v-date-picker
                  v-model="startDate"
                  @input="startDatePicker = false"
                  :min="new Date().toISOString().substring(0, 10)"
              ></v-date-picker>
            </v-menu>

            <v-menu
                v-model="endDatePicker"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                    label="Application End Date"
                    readonly
                    dense
                    outlined
                    v-on="on"
                    prepend-icon="mdi-calendar-end"
                    :value="format(endDate)"
                    :rules="endDateRules"
                ></v-text-field>
              </template>
              <v-date-picker
                  v-model="endDate"
                  @input="endDatePicker = false"
                  :min="new Date().toISOString().substring(0, 10)"
              ></v-date-picker>
            </v-menu>
          </v-form>
        </v-card-text>
        <v-card-actions
            class="justify-end">
          <v-btn
              @click="submitAddUniversity"
              color="primary">
            Done
          </v-btn>

          <v-btn
              @click="addUniversity = false"
              text>
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
        v-model="addCourse">
      <v-card tile>
        <v-toolbar dense class="text-h5 font-weight-bold" color="primary" dark>Add New Course</v-toolbar>
        <v-card-text>
          <v-form class="pt-4" ref="courseForm">
            <v-text-field
                label="Title"
                dense
                :rules="[titleRules]"
                v-model="courseTitleInput"
                prepend-icon="mdi-school"
                outlined>
            </v-text-field>
            <v-text-field
                label="Faculty"
                dense
                v-model="facultyInput"
                :rules="[v => !!v || `Faculty is required`]"
                prepend-icon="mdi-office-building"
                outlined>
            </v-text-field>
            <v-text-field
                label="Description"
                :rules="[v => !!v || `Description is required`]"
                v-model="courseDescInput"
                prepend-icon="mdi-text"
                dense
                outlined>
            </v-text-field>
            <v-text-field
                label="Tuition Fee"
                dense
                type="number"
                v-model="tuitionFeeInput"
                :rules="[v => !!v || `Tuition fee is required`]"
                prepend-icon="mdi-currency-usd"
                outlined>
            </v-text-field>
            <v-text-field
                label="Duration (Years)"
                dense
                v-model="durationInput"
                type="number"
                :rules="[v => !!v || `Duration is required`]"
                prepend-icon="mdi-clock"
                outlined>
            </v-text-field>

            <v-file-input
                outlined
                dense
                accept="image/*"
                v-model="imageFile"
                label="Logo"
                :loading="isUploading"
                :rules="[v => !!v || 'Course image is required']"
            ></v-file-input>
          </v-form>
        </v-card-text>
        <v-card-actions
            class="justify-end">
          <v-btn
              @click="submitAddCourse"
              color="primary">
            Done
          </v-btn>

          <v-btn
              @click="addCourse = false"
              text>
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-row class="px-8 py-4">
      <v-col cols="4" v-for="uni in universities"
             :key="uni.name">
        <v-card>
          <v-img
              contain
              class="mx-auto my-2"
              width="250"
              height="250"
              :src="uni.image_link"></v-img>

          <v-card-title class="pt-0">{{ uni.name }}</v-card-title>
          <v-card-subtitle>{{ uni.state }}, {{ uni.country }}</v-card-subtitle>

          <v-list>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-account-multiple</v-icon>
              </v-list-item-icon>
              <v-list-item-content>Enrollment</v-list-item-content>
              <v-list-item-action>
                <v-chip color="primary">{{ uni.enrollment }}</v-chip>
              </v-list-item-action>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-icon>
                <v-icon>mdi-calendar-clock</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Application Period</v-list-item-title>
                <v-list-item-subtitle>{{ getFormattedDate(uni.app_start_date, true, true) }} to
                  {{ getFormattedDate(uni.app_end_date, true, true) }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-spacer></v-spacer>

          <v-card-actions class="justify-end">
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="selectedUni = uni; showCourses = true">
              <v-icon class="pr-3">mdi-school</v-icon>
              Courses
            </v-btn>
            <v-btn color="primary" :href="uni.website">
              <v-icon class="pr-3">mdi-web</v-icon>
              Website
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog
        fullscreen
        transition="dialog-bottom-transition"
        v-model="showCourses">
      <v-card tile>
        <v-card-text class="px-0">
          <v-card-title
              class="primary white--text font-weight-bold">
            Courses
            <v-spacer></v-spacer>
            <v-btn color="white" icon @click="showCourses = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-btn
              class="ml-6 mt-4"
              text color="primary"
              @click="addCourse = true"
              v-if="isAdmin"
          >
            <v-icon left>mdi-plus</v-icon>
            Add Course
          </v-btn>
          <v-container fluid>
            <div v-for="faculty of courseForSelectedUni"
                 :key="faculty[0].faculty"
            >
              <v-subheader>{{ faculty[0].faculty }}</v-subheader>
              <v-row v-for="course of faculty" :key="course.title">
                <v-col>
                  <CourseCard
                      :name="course.title"
                      :description="course.description"
                      :src="course.image_link"
                      :cost="course.tuition_fee"
                      :duration="course.duration"
                      :key="course.title">
                  </CourseCard>
                </v-col>
              </v-row>
            </div>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import {getUniversityData, postCreateUni} from "@/api/uni";
import CourseCard from "@/components/CourseCard";
import {getFormattedDate} from "@/data/formatter";
import {getLink, saveFile} from "@/firebase/firebase";
import {getCourses, postCreateCourse} from "@/api/course";

export default {
  name: "UniversityView",
  components: {CourseCard},
  data: () => ({
    // view model
    uniNameInput: '',
    countryInput: '',
    stateInput: '',
    enrollmentInput: null,
    websiteInput: '',
    imageFile: null,
    startDate: null,
    endDate: null,

    isUploading: false,
    addUniversity: false,
    startDatePicker: false,
    endDatePicker: false,

    // course view model
    courses: [],
    addCourse: false,
    courseTitleInput: '',
    facultyInput: '',
    courseDescInput: '',
    tuitionFeeInput: '',
    durationInput: '',


    // input rules
    nameRules: [
      v => !!v || 'Name is required',
    ],
    countryRules: [
      v => !!v || 'Country is required',
    ],
    enrollRules: [
      v => !!v || 'Enrollment is required',
    ],
    stateRules: [
      v => !!v || 'State is required',
    ],
    websiteRules: [
      v => !!v || 'Website is required',
    ],
    endDateRules: [
      v => !!v || 'End date is required',
    ],


    universities: [],
    selectedUni: null,
    showCourses: false,
    headers: [
      {
        text: 'Name',
        value: 'name'
      },
      {
        text: 'Enrollment',
        value: 'enrollment'
      },
      {
        text: 'Country',
        value: 'country'
      },
      {
        text: 'State',
        value: 'state'
      },
      {
        text: 'Application Start Date',
        value: 'app_start_date'
      },
      {
        text: 'Application End Date',
        value: 'app_end_date'
      },
    ]
  }),

  computed: {
    courseForSelectedUni() {
      if (!this.selectedUni) return []
      let courses = this.courses.filter(c => c.uni_name === this.selectedUni.name)
      let res = {}
      for (let i = 0; i < courses.length; ++i) {
        if (!res[courses[i].faculty]) {
          res[courses[i].faculty] = []
        }
        res[courses[i].faculty].push(courses[i])
      }
      return res
    },

    nameIsUnique() {
      if (this.universities.some(u => u.name === this.uniNameInput)) {
        return "University with name " + this.uniNameInput + " already exists!"
      }
      return true
    },

    titleRules() {
      if (!this.courseTitleInput) return "Title is required!";
      if (Object.values(this.courseForSelectedUni).some(faculty => faculty.some(course => course.title === this.courseTitleInput))) {
        return "Course title already exists!"
      }
      return true
    },

    startDateRules() {
      if (!this.startDate) return 'Start Date is Required'
      if (!this.startDate || !this.endDate) return true
      if (this.startDate > this.endDate) {
        return 'Application Start Date must be before End'
      }
      return true
    },

    isAdmin() {
      if (!this.$store.state.user) return false
      return this.$store.state.user.isAdmin
    }
  },

  methods: {
    getFormattedDate,
    reloadCourse() {
      getCourses().then(data => {
        this.courses = data
      })
    },
    reloadUniversity() {
      getUniversityData().then(data => {
        this.universities = data
      })
    },
    format(date) {
      return getFormattedDate(date, true)
    },

    submitAddCourse() {
      if (this.$refs.courseForm.validate()) {
        this.isUploading = 'primary'
        const imagePath = 'course/' + this.selectedUni.name + '/' + this.courseTitleInput
        try {
          saveFile(this.imageFile, imagePath).then(() => {
            getLink(imagePath).then(link => {
              postCreateCourse(this.selectedUni.name, this.courseTitleInput, this.facultyInput, this.courseDescInput,
                  this.tuitionFeeInput, this.durationInput, link).then(res => {
                this.$refs.courseForm.reset()
                this.isUploading = false
                this.addCourse = false
                if (res.success) {
                  this.$store.commit('showSnackbar', "Successfully added course!")
                } else {
                  this.$store.commit('showSnackbar', "There was an error adding the course :(")
                }
                this.reloadCourse()
              })
            })
          }, {contentType: this.imageFile.type})
        } catch (e) {
          this.addUniversity = false;
          this.$store.commit('showSnackbar', 'Oops! There was an while uploading :(')
        }
      }
    },

    submitAddUniversity() {
      if (this.$refs.uniForm.validate()) {
        this.isUploading = 'primary'
        const imagePath = 'university/' + this.uniNameInput
        try {
          saveFile(this.imageFile, imagePath).then(() => {
            getLink(imagePath).then(link => {
              postCreateUni(this.uniNameInput, this.countryInput,
                  this.stateInput, this.enrollmentInput, this.websiteInput, link, this.startDate, this.endDate).then(res => {
                this.$refs.uniForm.reset()
                this.isUploading = false
                this.addUniversity = false
                if (res.success) {
                  this.$store.commit('showSnackbar', "Successfully added university!")
                } else {
                  this.$store.commit('showSnackbar', "There was an error adding the university :(")
                }
                this.reloadUniversity()
              })
            })
          }, {contentType: this.imageFile.type})
        } catch (e) {
          this.addUniversity = false;
          this.$store.commit('showSnackbar', 'Oops! There was an while uploading :(')
        }
      }
    }
    ,
  },

  mounted() {
    this.reloadCourse()
    this.reloadUniversity()
  },
}
</script>

<style scoped>
.overlay-text {
  position: relative;
  top: 50%;
  left: 50%;
}
</style>