import { createApp, h } from "vue"

import VueVisualFilter from "@/main.js"

import Serve from "./Serve.vue"

createApp({
  render: () => h(Serve),
})
  .use(VueVisualFilter)
  .mount("#app")
