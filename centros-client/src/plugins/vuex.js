import Vuex from 'vuex'
import Vue from "vue"

Vue.use(Vuex)

const store = new Vuex.Store({
    state() {
        return {
            user: null,
            snackbarText: '',
            snackbarFlag: false,
        }
    },
    mutations: {
        user(state, user) {
            state.user = user
        },
        hideSnackbar(state) {
            state.snackbarText = ''
            state.snackbarFlag = false
        },
        showSnackbar(state, text) {
            state.snackbarText = text
            state.snackbarFlag = true
        },
    },
})

export default store

