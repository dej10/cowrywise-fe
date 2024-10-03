// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  pages: true,
  css: ['@/assets/css/main.css'],

  devtools : {enabled: true},

  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL,
      accessKey: process.env.ACCESS_KEY,
    }
  },

})
