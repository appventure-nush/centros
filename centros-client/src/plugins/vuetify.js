import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

const vuetify = new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#43919D',
                secondary: '#FFFFFF',
            },

            dark: {
                primary: '#43919D',
                secondary: '#FFFFFF',
            },
        },
    },
})

export default vuetify;
