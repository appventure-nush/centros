<template>
  <v-container class="pa-0" fill-height v-if="$mq === 'mobile'">
    <v-row class="fill-height" no-gutters>
      <v-col class="fill-height" cols="3">

        <v-navigation-drawer v-model="drawer"
                             absolute
                             temporary>
          <v-list
              dense>
            <v-subheader>CATEGORY</v-subheader>
            <v-list-item-group v-model="selectedCategory">
              <v-list-item v-for="category of categories" :key="category.name" :value="category.name">
                {{ category.name }}
              </v-list-item>

            </v-list-item-group>
          </v-list>
          <template v-slot:append v-if="isAdmin">
            <v-btn text color="primary"
                   @click="categoryDialog = true">
              <v-icon left>mdi-plus</v-icon>
              Add Category
            </v-btn>
          </template>

          <v-dialog
              v-model="categoryDialog"
              width="700"
          >
            <v-card>
              <v-card-title class="font-weight-bold">
                Add A Category
              </v-card-title>

              <v-card-text>
                <v-form ref="categoryForm">
                  <v-text-field
                      outlined
                      v-model="categoryInput"
                      dense
                      :rules="[v => !!v || `Category name is required`, isNewCategory]"
                      label="Category"
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
                    @click="submitCreateCategory"
                >
                  Confirm
                </v-btn>

                <v-btn
                    text
                    @click="closeCreateCategory"
                >
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-navigation-drawer>
      </v-col>

      <v-col cols="9">
        <v-dialog
            width="500"
            v-model="guideDialog">
          <v-card tile>
            <v-card-title class="font-weight-bold">Add New Guide</v-card-title>
            <v-card-text>
              <v-form class="pt-4"
                      ref="guideForm">
                <v-text-field
                    label="Title"
                    dense
                    v-model="titleInput"
                    :rules="[v => !!v || `Title is required!`]"
                    prepend-icon="mdi-pencil"
                    outlined>
                </v-text-field>
                <v-text-field
                    label="Description"
                    dense
                    v-model="descriptionInput"
                    :rules="[v => !!v || `Description is required!`]"
                    prepend-icon="mdi-text"
                    outlined>
                </v-text-field>
                <v-file-input
                    outlined
                    dense
                    accept="image/*"
                    v-model="imageFile"
                    label="Cover Image"
                    :loading="isUploading"

                    :rules="[v => !!v || 'Cover image is required']"
                ></v-file-input>
                <p>
                  Which file would you like to make as a Guide?
                </p>
                <v-autocomplete
                    prepend-icon="mdi-file"
                    dense
                    :items="files"
                    no-data-text="No Files Found"
                    clearable
                    label="Select File"
                    solo
                    outlined
                    flat
                    v-model="selectedFile"
                    :rules="[v => !!v || 'File is required']"
                ></v-autocomplete>
              </v-form>

            </v-card-text>
            <v-card-actions
                class="justify-end">
              <v-btn
                  @click="submitCreateGuide"
                  color="primary">
                Submit
              </v-btn>

              <v-btn
                  @click="closeCreateGuide"
                  text>
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-container class="fill-height" v-if="categories.length === 0">
          <v-row justify="center" align="center">
            <v-img contain max-height="200" :src="require('../assets/no_category_art.svg')"></v-img>
            <p class="overline mt-4">There's No Categories to Show :( (Swipe to open categories)</p>
          </v-row>
        </v-container>

        <v-container class="d-flex flex-wrap justify-center" v-if="categories.length > 0">
          <div v-if="isAdmin">
            <v-btn text color="primary" class="mb-2" @click="openCreateGuide">
              <v-icon left>mdi-plus</v-icon>
              Add Guide
            </v-btn>
            <v-spacer></v-spacer>
          </div>

          <v-container>
            <v-row justify="center" align="center" v-if="getGuidesForSelectedCategory.length === 0">
              <v-img contain max-height="200" :src="require('../assets/no_meeting_art.svg')"></v-img>
              <p class="overline mt-4">There's No Guides in this category for now :(</p>
            </v-row>
          </v-container>
          <v-card
              v-for="guide in getGuidesForSelectedCategory"
              :key="guide.document_id"
              class="mb-4"
              width="720"
              outlined>
            <v-img
                height="200"
                :src="guide.image_link"></v-img>
            <v-card-title>
              <h3 class="font-weight-bold">{{ guide.title }}</h3>
            </v-card-title>
            <v-card-subtitle>
              <p class="ma-0">{{ guide.publisher }}</p>
            </v-card-subtitle>

            <v-card-text>
              {{ guide.description }}
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn outlined color="primary" :href="guide.link">
                <v-icon>mdi-open-in-new</v-icon>
                View
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
  <v-container class="pa-0" fill-height v-else-if="$mq === 'desktop'">
    <v-row class="fill-height" no-gutters>
      <v-col class="fill-height" cols="3">
        <v-navigation-drawer permanent>
          <v-list
              dense>
            <v-subheader>CATEGORY</v-subheader>
            <v-list-item-group v-model="selectedCategory">
              <v-list-item v-for="category of categories" :key="category.name" :value="category.name">
                {{ category.name }}
              </v-list-item>

            </v-list-item-group>
          </v-list>
          <template v-slot:append v-if="isAdmin">
            <v-btn text color="primary"
                   @click="categoryDialog = true">
              <v-icon left>mdi-plus</v-icon>
              Add Category
            </v-btn>
          </template>

          <v-dialog
              v-model="categoryDialog"
              width="700"
          >
            <v-card>
              <v-card-title class="font-weight-bold">
                Add A Category
              </v-card-title>

              <v-card-text>
                <v-form ref="categoryForm">
                  <v-text-field
                      outlined
                      v-model="categoryInput"
                      dense
                      :rules="[v => !!v || `Category name is required`, isNewCategory]"
                      label="Category"
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
                    @click="submitCreateCategory"
                >
                  Confirm
                </v-btn>

                <v-btn
                    text
                    @click="closeCreateCategory"
                >
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-navigation-drawer>
      </v-col>

      <v-col cols="9">
        <v-dialog
            width="500"
            v-model="guideDialog">
          <v-card tile>
            <v-card-title class="font-weight-bold">Add New Guide</v-card-title>
            <v-card-text>
              <v-form class="pt-4"
                      ref="guideForm">
                <v-text-field
                    label="Title"
                    dense
                    v-model="titleInput"
                    :rules="[v => !!v || `Title is required!`]"
                    prepend-icon="mdi-pencil"
                    outlined>
                </v-text-field>
                <v-text-field
                    label="Description"
                    dense
                    v-model="descriptionInput"
                    :rules="[v => !!v || `Description is required!`]"
                    prepend-icon="mdi-text"
                    outlined>
                </v-text-field>
                <v-file-input
                    outlined
                    dense
                    accept="image/*"
                    v-model="imageFile"
                    label="Cover Image"
                    :loading="isUploading"

                    :rules="[v => !!v || 'Cover image is required']"
                ></v-file-input>
                <p>
                  Which file would you like to make as a Guide?
                </p>
                <v-autocomplete
                    prepend-icon="mdi-file"
                    dense
                    :items="files"
                    no-data-text="No Files Found"
                    clearable
                    label="Select File"
                    solo
                    outlined
                    flat
                    v-model="selectedFile"
                    :rules="[v => !!v || 'File is required']"
                ></v-autocomplete>
              </v-form>

            </v-card-text>
            <v-card-actions
                class="justify-end">
              <v-btn
                  @click="submitCreateGuide"
                  color="primary">
                Submit
              </v-btn>

              <v-btn
                  @click="closeCreateGuide"
                  text>
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-container class="fill-height" v-if="categories.length === 0">
          <v-row justify="center" align="center">
            <v-img contain max-height="200" :src="require('../assets/no_category_art.svg')"></v-img>
            <p class="overline mt-4">There's No Categories to Show :(</p>
          </v-row>
        </v-container>

        <v-container class="d-flex flex-wrap justify-center" v-if="categories.length > 0">
          <div v-if="isAdmin">
            <v-btn text color="primary" class="mb-2" @click="openCreateGuide">
              <v-icon left>mdi-plus</v-icon>
              Add Guide
            </v-btn>
            <v-spacer></v-spacer>
          </div>

          <v-container>
            <v-row justify="center" align="center" v-if="getGuidesForSelectedCategory.length === 0">
              <v-img contain max-height="200" :src="require('../assets/no_meeting_art.svg')"></v-img>
              <p class="overline mt-4">There's No Guides in this category for now :(</p>
            </v-row>
          </v-container>
          <v-card
              v-for="guide in getGuidesForSelectedCategory"
              :key="guide.document_id"
              class="mb-4"
              width="720"
              outlined>
            <v-img
                height="200"
                :src="guide.image_link"></v-img>
            <v-card-title>
              <h3 class="font-weight-bold">{{ guide.title }}</h3>
            </v-card-title>
            <v-card-subtitle>
              <p class="ma-0">{{ guide.publisher }}</p>
            </v-card-subtitle>

            <v-card-text>
              {{ guide.description }}
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn outlined color="primary" :href="guide.link">
                <v-icon>mdi-open-in-new</v-icon>
                View
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {createCategory, getCategories} from "@/api/category";
import {getUserDocument} from "@/api/document";
import {getLink, saveFile} from "@/firebase/firebase";
import {getGuides, postCreateGuide} from "@/api/guide";

export default {
  name: "GuidesView",
  data: () => ({
    selectedCategory: '',
    guides: [],
    titleInput: '',
    descriptionInput: '',
    isUploading: false,
    imageFile: null,
    selectedFile: null,
    files: [],
    categories: [],
    guideDialog: false,
    categoryInput: null,
    categoryDialog: false,
    drawer: false,
    group: null,
  }),

  watch: {
    group () {
      this.drawer = false
    },
  },

  computed: {
    isAdmin() {
      if (!this.$store.state.user) return false
      return this.$store.state.user.isAdmin
    },
    getGuidesForSelectedCategory() {
      return this.guides.filter(g => g.category === this.selectedCategory);
    }
  },

  mounted() {
    this.reloadCategories();
    this.reloadGuides();
  },
  methods: {
    reloadGuides() {
      getGuides().then(guides => {
        this.guides = guides
      })
    },
    isNewCategory(val) {
      if (this.categories.some(c => val === c.name)) {
        return "Category name already exists!"
      }
      return true
    },

    reloadCategories() {
      getCategories().then(data => {
        this.categories = data
        if (this.categories.length > 0) {
          this.selectedCategory = this.categories[0].name
        }
      })
    },
    openCreateGuide() {
      getUserDocument().then(data => {
        for (const file of data) {
          this.files.push({
            text: file.file_name,
            value: file.document_id,
            disabled: false
          })
        }
        this.guideDialog = true
      })
    },

    closeCreateGuide() {
      this.$refs.guideForm.reset()
      this.guideDialog = false
    },

    submitCreateGuide() {
      if (this.$refs.guideForm.validate()) {
        this.isUploading = 'primary'
        const document_id = this.selectedFile
        const refPath = 'guides/' + document_id
        try {
          saveFile(this.imageFile, refPath).then(() => {
            getLink(refPath).then(link => {
              postCreateGuide(document_id, this.selectedCategory, this.titleInput, this.descriptionInput,
                  link).then(res => {
                this.closeCreateGuide()
                if (res.success) {
                  this.$store.commit('showSnackbar', "Successfully created guide!")
                } else {
                  this.$store.commit('showSnackbar', "There was an error creating the guide :(")
                }
                this.reloadGuides()
              })
            })

          }, {contentType: this.imageFile.type})
        } catch (e) {
          this.closeCreateGuide();
          this.$store.commit('showSnackbar', 'Oops! There was an while uploading :(')
        }
      }
    },
    closeCreateCategory() {
      this.$refs.categoryForm.reset()
      this.categoryDialog = false
    },
    submitCreateCategory() {
      if (this.$refs.categoryForm.validate()) {
        createCategory(this.categoryInput).then(res => {
          this.closeCreateCategory()
          if (res.success) {
            this.$store.commit('showSnackbar', 'Successfully added Category!');
          } else {
            this.$store.commit('showSnackbar', 'There was an error while creating the category :(');
          }
          this.reloadCategories()
        })
      }
    },
  },
}
</script>

<style scoped>

</style>