import Vue from 'vue'
import App from './App.vue'
import VueMq from 'vue-mq'
import vuetify from './plugins/vuetify'
import router from './router'
import store from '@/plugins/vuex'

Vue.config.productionTip = false
Vue.use(VueMq, {
    breakpoints: {
        mobile: 500,
        tablet: 900,
        laptop: 1250,
        desktop: Infinity,
    }
})

new Vue({
    vuetify,
    router,
    store,
    render: h => h(App)
}).$mount('#app')