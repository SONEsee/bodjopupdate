// import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
// import { resolve } from "path";
// export default defineNuxtConfig({
//   devtools: { enabled: false },
//   ssr: false,
//   compatibilityDate: "2024-04-03",

//   app: {
//     head: {
//       title: "Nuxt3-Starter-Template",
//     },
//   },

//   components: [
//     {
//       path: "@/components",
//       pathPrefix: false,
//     },
//     {
//       path: "@/components/Global/",
//       pathPrefix: true,
//       prefix: "Global",
//     },
//     {
//       path: "@/components/Login/",
//       pathPrefix: true,
//       prefix: "Login",
//     },
//     {
//       path: "@/components/Agency",
//       pathPrefix: true,
//       prefix: "Agency",
//     },
//     {
//       path: "@/components/ExpenseTypeManagements/",
//       pathPrefix: true,
//       prefix: "ExpenTypeManagements",
//     },
//     {
//       path: "@/components/DeviceManagement/",
//       pathPrefix: true,
//       prefix: "Devices",
//     },
//   ],

//   css: ["~/assets/css/style.scss", "~/assets/css/global.css"],

//   build: {
//     transpile: ["vuetify"],
//   },

//   modules: [
//     (_options, nuxt) => {
//       nuxt.hooks.hook("vite:extendConfig", (config) => {
//         // @ts-expect-error
//         config.plugins.push(vuetify({ autoImport: true }));
//       });
//     },
//     "@pinia/nuxt",
//     "@vueuse/nuxt",
//     "dayjs-nuxt",
//     "nuxt-lodash",
//   ],

//   dayjs: {
//     locales: ["en", "lo"],
//     plugins: ["relativeTime", "utc", "timezone"],
//     defaultLocale: "en",
//     defaultTimezone: "Asia/Bangkok",
//   },

//   vite: {
//     vue: {
//       template: {
//         transformAssetUrls,
//       },
//     },
//   },

//   imports: {
//     dirs: ["./stores"],
//   },

//   pinia: {
//     storesDirs: ["./stores/**"],
//   },
// });
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import { resolve } from "path";

export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: false,
  compatibilityDate: "2024-04-03",

  app: {
    head: {
      title: "Nuxt3-Starter-Template",
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Lao:wght@400;500;600;700&display=swap'
        }
      ]
    },
  },

  components: [
    {
      path: "@/components",
      pathPrefix: false,
    },
    {
      path: "@/components/Global/",
      pathPrefix: true,
      prefix: "Global",
    },
    {
      path: "@/components/Login/",
      pathPrefix: true,
      prefix: "Login",
    },
    {
      path: "@/components/Agency",
      pathPrefix: true,
      prefix: "Agency",
    },
    {
      path: "@/components/ExpenseTypeManagements/",
      pathPrefix: true,
      prefix: "ExpenTypeManagements",
    },
    {
      path: "@/components/DeviceManagement/",
      pathPrefix: true,
      prefix: "Devices",
    },
  ],

  css: ["~/assets/css/style.scss", "~/assets/css/global.css"],

  build: {
    transpile: ["vuetify", "vue3-apexcharts"],
  },

  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "dayjs-nuxt",
    "nuxt-lodash",
  ],

  dayjs: {
    locales: ["en", "lo"],
    plugins: ["relativeTime", "utc", "timezone"],
    defaultLocale: "en",
    defaultTimezone: "Asia/Bangkok",
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    optimizeDeps: {
      include: ['apexcharts']
    }
  },

  imports: {
    dirs: ["./stores"],
  },

  pinia: {
    storesDirs: ["./stores/**"],
  },
});