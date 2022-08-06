const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],

  devServer: {
    port: 8000,
    proxy: 'http://localhost:3000'
  }
})
